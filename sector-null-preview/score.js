const CLIPS = {
  early: new URL('./assets/score/early-waves.mp3', import.meta.url).href,
  late: new URL('./assets/score/late-waves.mp3', import.meta.url).href,
  ability: new URL('./assets/score/ability-select.mp3', import.meta.url).href,
};

export const WAVE_LEAD_IN = 0.83;
const CLEAR_FADE = 0.9;
const ABILITY_VOLUME = 0.38;
const ABILITY_CUTOFF = 1000;
const BAR = 1.65704;
const COMBAT_CROSSFADE = 0.6;
// The late asset measures ~3.5 dB louder in RMS than early; trim it at every entry.
const CLIP_GAIN = { early: 1, late: 0.65, ability: 1 };
const LATE_WAVE = 5;

export function createScore(ctx, musicBus) {
  const level = ctx.createGain();
  level.gain.value = 3.8;
  level.connect(musicBus);

  // Keep the decoded loop boundaries at the assets' native sample rate.
  const OfflineContext = window.OfflineAudioContext ?? window.webkitOfflineAudioContext;
  const decoder = OfflineContext ? new OfflineContext(2, 1, 44100) : ctx;
  /** Sync cache so queueWave can schedule the next loop in the same turn. */
  const decoded = Object.create(null);
  const bufferPromises = Object.fromEntries(Object.entries(CLIPS).map(([name, url]) => [
    name,
    fetch(url).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.arrayBuffer();
    }).then(data => decoder.decodeAudioData(data)).then(buffer => {
      decoded[name] = buffer;
      return buffer;
    }).catch(error => {
      console.warn(`Could not load score clip ${name}`, error);
      decoded[name] = null;
      return null;
    }),
  ]));
  const ready = Promise.all(Object.values(bufferPromises));

  const tracks = new Set();
  let ability, combat;

  function release(track) {
    tracks.delete(track);
    track.source?.disconnect();
    track.filter.disconnect();
    track.gain.disconnect();
  }

  function attachSource(track, buffer) {
    if (!tracks.has(track)) return;
    if (!buffer) {
      release(track);
      return;
    }
    // Schedule against the original start so a late decode still lines up with the crossfade.
    const at = Math.max(track.start, ctx.currentTime);
    const elapsed = at - track.phase;
    if (at >= track.end || (!track.loop && elapsed >= buffer.duration)) {
      release(track);
      return;
    }
    if (track.source) {
      try { track.source.stop(); } catch { /* */ }
      try { track.source.disconnect(); } catch { /* */ }
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = track.loop;
    source.connect(track.filter);
    source.onended = () => release(track);
    track.source = source;
    const offset = track.loop
      ? ((elapsed % buffer.duration) + buffer.duration) % buffer.duration
      : Math.max(0, elapsed);
    source.start(at, offset);
    if (Number.isFinite(track.end)) source.stop(track.end);
  }

  function play(name, start, { loop = false, phase = start, fadeIn = 0, volume = 1, cutoff = 20000 } = {}) {
    volume *= CLIP_GAIN[name];
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(cutoff, ctx.sampleRate / 2);
    filter.Q.value = 0.7;
    filter.connect(gain);
    gain.connect(level);
    gain.gain.setValueAtTime(fadeIn ? 0 : volume, start);
    if (fadeIn) gain.gain.linearRampToValueAtTime(volume, start + fadeIn);
    const track = {
      name, start, phase, fadeIn, volume, gain, filter, loop,
      source: null, end: Infinity, fadeAt: Infinity,
    };
    tracks.add(track);
    if (Object.prototype.hasOwnProperty.call(decoded, name)) {
      attachSource(track, decoded[name]);
    } else {
      bufferPromises[name].then(buffer => attachSource(track, buffer));
    }
    return track;
  }

  function fadeOut(track, at, duration) {
    if (!tracks.has(track) || track.end <= at) return;
    if (track.start > at) {
      // Pending future start (e.g. re-queued before lead-in) — cancel instead of fading.
      try { track.source?.stop(at); } catch { /* */ }
      release(track);
      return;
    }
    // A combat track already fading out during a bar switch can finish that fade.
    if (track.fadeAt <= at) return;
    const fadeProgress = track.fadeIn ? Math.min(1, (at - track.start) / track.fadeIn) : 1;
    track.gain.gain.cancelScheduledValues(at);
    track.gain.gain.setValueAtTime(track.volume * fadeProgress, at);
    track.end = at + duration;
    track.fadeAt = at;
    track.gain.gain.linearRampToValueAtTime(0, track.end);
    try { track.source?.stop(track.end); } catch { /* */ }
  }

  return {
    warm() { return ready; },
    queueWave(wave, delay) {
      const start = ctx.currentTime + Math.max(0, delay || 0);
      // Mirror clearWave: overlap ability fade-out with combat fade-in at wave start.
      // (Fading ability immediately here left ~1s of silence before combat began.)
      for (const track of [...tracks]) {
        fadeOut(track, start, CLEAR_FADE);
      }
      combat = ability = null;
      combat = play(wave >= LATE_WAVE ? 'late' : 'early', start, { loop: true, fadeIn: CLEAR_FADE });
      return start;
    },
    intensify() {
      if (combat?.name !== 'early' || !tracks.has(combat)) return;
      const phase = combat.phase;
      const nextBar = phase + (Math.floor((ctx.currentTime - phase) / BAR) + 1) * BAR;
      fadeOut(combat, nextBar, COMBAT_CROSSFADE);
      combat = play('late', nextBar, { loop: true, phase, fadeIn: COMBAT_CROSSFADE });
    },
    clearWave() {
      const clearedAt = ctx.currentTime;
      for (const track of tracks) {
        fadeOut(track, clearedAt, CLEAR_FADE);
      }
      combat = null;
      ability = play('ability', clearedAt, {
        loop: true, fadeIn: CLEAR_FADE, volume: ABILITY_VOLUME, cutoff: ABILITY_CUTOFF,
      });
    },
    stop() {
      for (const track of [...tracks]) {
        try { track.source?.stop(); } catch { /* */ }
        release(track);
      }
      combat = ability = null;
    },
  };
}

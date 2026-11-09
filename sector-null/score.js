const CLIPS = {
  early: new URL('./assets/score/early-waves.wav', import.meta.url).href,
  late: new URL('./assets/score/late-waves.wav', import.meta.url).href,
  ability: new URL('./assets/score/ability-select.wav', import.meta.url).href,
};

export const WAVE_LEAD_IN = 0.83;
const CLEAR_FADE = 0.9;
const ABILITY_VOLUME = 0.38;
const ABILITY_CUTOFF = 1000;
const BAR = 1.65704;
const COMBAT_CROSSFADE = 0.25;
const LATE_WAVE = 5;

export function createScore(ctx, musicBus) {
  const level = ctx.createGain();
  level.gain.value = 5.5;
  level.connect(musicBus);

  // Keep the decoded loop boundaries at the assets' native sample rate.
  const OfflineContext = window.OfflineAudioContext ?? window.webkitOfflineAudioContext;
  const decoder = OfflineContext ? new OfflineContext(2, 1, 44100) : ctx;
  const buffers = Object.fromEntries(Object.entries(CLIPS).map(([name, url]) => [
    name,
    fetch(url).then(response => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return response.arrayBuffer();
    }).then(data => decoder.decodeAudioData(data)).catch(error => {
      console.warn(`Could not load score clip ${name}`, error);
      return null;
    }),
  ]));

  const tracks = new Set();
  let ability, combat;

  function release(track) {
    tracks.delete(track);
    track.source?.disconnect();
    track.filter.disconnect();
    track.gain.disconnect();
  }

  function play(name, start, { loop = false, phase = start, fadeIn = 0, volume = 1, cutoff = 20000 } = {}) {
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = Math.min(cutoff, ctx.sampleRate / 2);
    filter.Q.value = 0.7;
    filter.connect(gain);
    gain.connect(level);
    gain.gain.setValueAtTime(fadeIn ? 0 : volume, start);
    if (fadeIn) gain.gain.linearRampToValueAtTime(volume, start + fadeIn);
    const track = { name, start, phase, fadeIn, volume, gain, filter, source: null, end: Infinity, fadeAt: Infinity };
    tracks.add(track);
    buffers[name].then(buffer => {
      if (!tracks.has(track)) return;
      const at = Math.max(start, ctx.currentTime);
      const elapsed = at - phase;
      if (!buffer || at >= track.end || (!loop && elapsed >= buffer.duration)) {
        release(track);
        return;
      }
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = loop;
      source.connect(filter);
      source.onended = () => release(track);
      track.source = source;
      source.start(at, loop ? elapsed % buffer.duration : elapsed);
      if (Number.isFinite(track.end)) source.stop(track.end);
    });
    return track;
  }

  function fadeOut(track, at, duration) {
    if (!tracks.has(track) || track.end <= at) return;
    if (track.start > at) {
      track.source?.stop(at);
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
    track.source?.stop(track.end);
  }

  return {
    queueWave(wave, delay) {
      const start = ctx.currentTime + delay;
      // Keep the breather calm until enemies arrive; no overlapping wave stingers.
      fadeOut(ability, start, CLEAR_FADE);
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
      for (const track of tracks) {
        track.source?.stop();
        release(track);
      }
      combat = ability = null;
    },
  };
}

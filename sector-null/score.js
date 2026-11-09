const CLIPS = {
  early: new URL('./assets/score/early-waves.wav', import.meta.url).href,
  late: new URL('./assets/score/late-waves.wav', import.meta.url).href,
  ability: new URL('./assets/score/ability-select.wav', import.meta.url).href,
  start: new URL('./assets/score/wave-start.wav', import.meta.url).href,
  clear: new URL('./assets/score/wave-clear.wav', import.meta.url).href,
};

export const WAVE_LEAD_IN = 0.83;
const CLEAR_FADE = 0.4;
const ABILITY_ENTRY = 2.2;
const BAR = 1.65704;
const COMBAT_CROSSFADE = 0.08;
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
  let clearedAt = -Infinity;

  function release(track) {
    tracks.delete(track);
    track.source?.disconnect();
    track.gain.disconnect();
  }

  function play(name, start, { loop = false, phase = start, fadeIn = 0 } = {}) {
    const gain = ctx.createGain();
    gain.connect(level);
    gain.gain.setValueAtTime(fadeIn ? 0 : 1, start);
    if (fadeIn) gain.gain.linearRampToValueAtTime(1, start + fadeIn);
    const track = { name, start, phase, fadeIn, gain, source: null, end: Infinity, fadeAt: Infinity };
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
      source.connect(gain);
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
    const volume = track.fadeIn ? Math.min(1, (at - track.start) / track.fadeIn) : 1;
    track.gain.gain.cancelScheduledValues(at);
    track.gain.gain.setValueAtTime(volume, at);
    track.end = at + duration;
    track.fadeAt = at;
    track.gain.gain.linearRampToValueAtTime(0, track.end);
    track.source?.stop(track.end);
  }

  return {
    queueWave(wave, delay) {
      const start = Math.max(ctx.currentTime + delay, clearedAt + ABILITY_ENTRY + WAVE_LEAD_IN);
      const cue = start - WAVE_LEAD_IN;
      fadeOut(ability, cue, WAVE_LEAD_IN);
      play('start', cue);
      combat = play(wave >= LATE_WAVE ? 'late' : 'early', start, { loop: true });
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
      clearedAt = ctx.currentTime;
      play('clear', clearedAt);
      for (const track of tracks) {
        if (track.name === 'early' || track.name === 'late') fadeOut(track, clearedAt, CLEAR_FADE);
      }
      combat = null;
      ability = play('ability', clearedAt + ABILITY_ENTRY, { loop: true });
    },
    stop() {
      for (const track of tracks) {
        track.source?.stop();
        release(track);
      }
      combat = ability = null;
      clearedAt = -Infinity;
    },
  };
}

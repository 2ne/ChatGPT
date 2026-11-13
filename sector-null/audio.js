import { createScore } from './score.js';

const midiHz = note => 440 * 2 ** ((note - 69) / 12);
// Soft SFX budget — late-wave kill storms used to stall the AudioContext graph.
const MAX_VOICES = 28;

export function createAudio(settings, listener) {
  const soundtrack = new Audio(new URL('./assets/soundtrack.mp3', import.meta.url).href);
  soundtrack.loop = true;
  let ctx, sfxBus, musicBus, reverb, noise, score;
  // Menu blips live on a second context so pause can suspend combat/music audio
  // without silencing title / pause / game-over UI feedback.
  let uiCtx, uiBus;
  let paused = false;
  let titleMusic = false;
  let recharge;
  let pickupStreak = 0;
  let lastPickupAt = -Infinity;
  let activeVoices = 0;
  let lastEmeraldAt = -Infinity;
  let lastExplodeAt = -Infinity;

  function cancelReload() {
    if (!recharge) return;
    const { oscillator, gain } = recharge;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.015);
    oscillator.stop(ctx.currentTime + 0.08);
    recharge = null;
  }

  function ensure() {
    if (!ctx) {
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContext) return;
      ctx = new AudioContext();
      const compressor = ctx.createDynamicsCompressor();
      compressor.connect(ctx.destination);
      sfxBus = ctx.createGain();
      musicBus = ctx.createGain();
      sfxBus.connect(compressor);
      musicBus.connect(compressor);
      ctx.createMediaElementSource(soundtrack).connect(musicBus);
      score = createScore(ctx, musicBus);
      reverb = ctx.createDelay(0.5);
      reverb.delayTime.value = 0.115;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.19;
      reverb.connect(feedback).connect(reverb);
      const wet = ctx.createGain();
      wet.gain.value = 0.17;
      reverb.connect(wet).connect(sfxBus);

      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const samples = noise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

      applyVolume();
    }
    if (!paused && ctx.state !== 'running') ctx.resume().catch(() => {});
    // Unlock the UI bus on the same gesture so pause/death menus can blip after combat audio suspends.
    ensureUi();
    // Decode early/late/ability up front so wave-start crossfades can schedule immediately.
    score?.warm?.();
    if (titleMusic && soundtrack.paused) soundtrack.play().catch(() => {});
  }

  function sfxLevel() {
    return (settings.sfx / 10) ** 1.5 * 0.75;
  }

  function applyUiVolume() {
    if (!uiCtx || !uiBus) return;
    uiBus.gain.setTargetAtTime(sfxLevel(), uiCtx.currentTime, 0.04);
  }

  function ensureUi() {
    const AudioContext = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioContext) return;
    if (!uiCtx) {
      uiCtx = new AudioContext();
      uiBus = uiCtx.createGain();
      uiBus.connect(uiCtx.destination);
      applyUiVolume();
    }
    if (uiCtx.state !== 'running') uiCtx.resume().catch(() => {});
  }

  function applyVolume() {
    if (ctx) {
      sfxBus.gain.setTargetAtTime(sfxLevel(), ctx.currentTime, 0.04);
      musicBus.gain.setTargetAtTime((settings.music / 10) ** 1.5, ctx.currentTime, 0.08);
    }
    applyUiVolume();
  }

  // Spatial taps used to leak pan/gain nodes forever — that stalls audio on long runs.
  function spatial(position, hold = 0.7) {
    if (!position || !ctx) return sfxBus;
    const player = listener();
    const dx = (position.x ?? 0) - player.x;
    const dz = (position.z ?? 0) - player.z;
    const pan = ctx.createStereoPanner();
    const distance = ctx.createGain();
    pan.pan.value = Math.max(-0.85, Math.min(0.85, dx / 12));
    distance.gain.value = 1 / (1 + Math.hypot(dx, dz) * 0.09);
    pan.connect(distance).connect(sfxBus);
    let users = 0;
    let dead = false;
    const dispose = () => {
      if (dead) return;
      dead = true;
      try { pan.disconnect(); } catch { /* */ }
      try { distance.disconnect(); } catch { /* */ }
    };
    pan._acquire = () => { users++; };
    pan._release = () => {
      users = Math.max(0, users - 1);
      if (users === 0) dispose();
    };
    setTimeout(dispose, Math.max(80, hold * 1000 + 100));
    return pan;
  }

  function claimVoice() {
    if (activeVoices >= MAX_VOICES) return false;
    activeVoices++;
    return true;
  }

  function releaseVoice() {
    activeVoices = Math.max(0, activeVoices - 1);
  }

  function voice(from, to, duration, volume, options = {}) {
    if (!ctx) return;
    if (!claimVoice()) return;
    const { type = 'sine', t = ctx.currentTime, attack = 0.008, out = sfxBus, echo = false } = options;
    if (out !== sfxBus && out._acquire) out._acquire();
    const oscillator = ctx.createOscillator();
    const envelope = ctx.createGain();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(from, t);
    oscillator.frequency.exponentialRampToValueAtTime(to, t + duration * 0.92);
    envelope.gain.setValueAtTime(0.0001, t);
    envelope.gain.exponentialRampToValueAtTime(volume, t + attack);
    envelope.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    oscillator.connect(envelope).connect(out);
    if (echo) envelope.connect(reverb);
    oscillator.start(t);
    oscillator.stop(t + duration + 0.015);
    oscillator.onended = () => {
      try { oscillator.disconnect(); } catch { /* */ }
      try { envelope.disconnect(); } catch { /* */ }
      if (out !== sfxBus && out._release) out._release();
      releaseVoice();
    };
  }

  function grain(freq, duration, volume, out = sfxBus, type = 'bandpass') {
    if (!ctx) return;
    if (!claimVoice()) return;
    if (out !== sfxBus && out._acquire) out._acquire();
    const t = ctx.currentTime;
    const source = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const envelope = ctx.createGain();
    source.buffer = noise;
    filter.type = type;
    filter.frequency.setValueAtTime(freq, t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(55, freq * 0.45), t + duration);
    filter.Q.value = 1.3;
    envelope.gain.setValueAtTime(0.0001, t);
    envelope.gain.exponentialRampToValueAtTime(volume, t + 0.005);
    envelope.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    source.connect(filter).connect(envelope).connect(out);
    source.start(t, Math.random() * 0.4, duration + 0.02);
    source.onended = () => {
      try { source.disconnect(); } catch { /* */ }
      try { filter.disconnect(); } catch { /* */ }
      try { envelope.disconnect(); } catch { /* */ }
      if (out !== sfxBus && out._release) out._release();
      releaseVoice();
    };
  }

  function signal(notes, volume = 0.13, step = 0.085) {
    if (!ctx) return;
    notes.forEach((note, i) => {
      const hz = midiHz(note);
      voice(hz, hz * 0.996, 0.24, volume, { type: 'triangle', t: ctx.currentTime + i * step, echo: true });
    });
  }

  /** Same triangle blip shape as signal(), but on the pause-proof UI bus. */
  function uiSignal(notes, volume = 0.075, step = 0.052) {
    ensureUi();
    if (!uiCtx || !uiBus) return;
    notes.forEach((note, i) => {
      const t = uiCtx.currentTime + i * step;
      const hz = midiHz(note);
      const oscillator = uiCtx.createOscillator();
      const envelope = uiCtx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(hz, t);
      oscillator.frequency.exponentialRampToValueAtTime(hz * 0.996, t + 0.24);
      envelope.gain.setValueAtTime(0.0001, t);
      envelope.gain.exponentialRampToValueAtTime(volume, t + 0.008);
      envelope.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      oscillator.connect(envelope).connect(uiBus);
      oscillator.start(t);
      oscillator.stop(t + 0.255);
      oscillator.onended = () => {
        try { oscillator.disconnect(); } catch { /* */ }
        try { envelope.disconnect(); } catch { /* */ }
      };
    });
  }

  return {
    ensure, applyVolume, cancelReload,
    setTitleMusic(on) {
      titleMusic = on;
      if (on) {
        cancelReload();
        score?.stop();
        ensure();
      } else {
        soundtrack.pause();
        soundtrack.currentTime = 0;
      }
    },
    /** Hard-reset music for a new run (pause restart, death retry, title play). */
    resetRunMusic() {
      titleMusic = false;
      cancelReload();
      score?.stop();
      soundtrack.pause();
      soundtrack.currentTime = 0;
    },
    setPaused(on) {
      paused = on;
      if (on) ctx?.suspend().catch(() => {});
      else ensure();
    },
    scoreTime() { return ctx?.state === 'running' ? ctx.currentTime : null; },
    queueWave(wave, delay) { return score?.queueWave(wave, delay) ?? null; },
    intensify() { score?.intensify(); },
    shot(hot, spread, charge = 1) {
      // A subtle three-semitone descent across the cell, without losing punch.
      const pitch = 2 ** ((Math.max(0, Math.min(1, charge)) - 1) * 3 / 12);
      voice((hot ? 520 : 620) * pitch, 180 * pitch, 0.09, 0.1, { type: 'sine' });
      voice((hot ? 210 : 250) * pitch, 65 * pitch, 0.15, 0.32 + Math.min(spread, 3) * 0.015, { type: 'triangle' });
      voice(110 * pitch, 48 * pitch, 0.12, 0.13);
      grain(1900, 0.045, 0.1);
    },
    lowCharge() {
      if (!ctx) return;
      voice(620, 490, 0.16, 0.16, { t: ctx.currentTime + 0.035 });
    },
    enemyCharge(pos) { voice(180, 380, 0.65, 0.07, { out: spatial(pos, 0.85), attack: 0.2 }); },
    enemyShot(pos) { voice(420, 110, 0.18, 0.16, { out: spatial(pos, 0.35), type: 'triangle' }); },
    reloadOut(duration) {
      if (!ctx) return;
      cancelReload();
      voice(300, 130, 0.12, 0.055);
      const t = ctx.currentTime;
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      oscillator.frequency.setValueAtTime(140, t);
      oscillator.frequency.exponentialRampToValueAtTime(280, t + duration);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.025, t + Math.min(0.16, duration / 3));
      gain.gain.linearRampToValueAtTime(0.035, t + duration);
      gain.gain.linearRampToValueAtTime(0, t + duration + 0.06);
      oscillator.connect(gain).connect(sfxBus);
      oscillator.start(t);
      oscillator.stop(t + duration + 0.08);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      recharge = { oscillator, gain };
    },
    reloadIn() {
      cancelReload();
      if (!ctx) return;
      voice(440, 520, 0.12, 0.065);
    },
    hit(pos) { const out = spatial(pos, 0.35); grain(2200, 0.08, 0.26, out); voice(290, 87, 0.1, 0.21, { out, type: 'triangle' }); },
    explode(pos) {
      // Coalesce rapid multi-kills so the graph doesn't flood.
      const now = performance.now();
      if (now - lastExplodeAt < 45) return;
      lastExplodeAt = now;
      const out = spatial(pos, 0.45);
      grain(2400, 0.16, 0.34, out);
      grain(520, 0.28, 0.2, out);
      voice(155, 42, 0.24, 0.28, { out, type: 'triangle', echo: true });
    },
    // Layered boom for the boss finale — heavier bass and a longer tail.
    bossExplode(pos) {
      const out = spatial(pos, 0.75);
      grain(2200, 0.22, 0.42, out);
      grain(480, 0.38, 0.3, out);
      grain(110, 0.55, 0.4, out);
      voice(140, 28, 0.42, 0.4, { out, type: 'triangle', echo: true });
      voice(52, 18, 0.55, 0.36, { out, type: 'sine' });
    },
    servo(pos) { const out = spatial(pos, 0.4); voice(135, 280, 0.24, 0.056, { out, type: 'triangle' }); grain(780, 0.12, 0.05, out); },
    swipe(pos) { grain(740, 0.21, 0.25, spatial(pos, 0.35)); },
    hurt() { voice(108, 43, 0.38, 0.42, { type: 'triangle' }); signal([56, 50], 0.12); },
    step() { grain(510, 0.08, 0.11); },
    bash(pos, strength = 1) { const out = spatial(pos, 0.35); voice(106, 50, 0.18, 0.29 * strength, { out, type: 'triangle' }); grain(1600, 0.12, 0.24 * strength, out); },
    crack(pos) { grain(4300, 0.14, 0.3, spatial(pos, 0.3)); },
    doorBreak(pos) { const out = spatial(pos, 0.6); grain(820, 0.48, 0.42, out); voice(210, 42, 0.38, 0.3, { out, type: 'triangle' }); },
    /** Heavy blast-door slam — denser / longer than a breach. */
    doorSlam(pos) {
      const out = spatial(pos, 1.0);
      grain(420, 0.72, 0.62, out);
      grain(110, 0.9, 0.55, out);
      grain(1800, 0.18, 0.22, out);
      voice(78, 22, 0.62, 0.5, { out, type: 'triangle' });
      voice(36, 12, 0.85, 0.48, { out, type: 'sine' });
    },
    shatter(pos) { const out = spatial(pos, 0.5); grain(4800, 0.36, 0.52, out); voice(880, 250, 0.18, 0.13, { out, echo: true }); },
    waveClear() { score?.clearWave(); },
    /** Soft restorative chime for wave-clear / announced shield refill. */
    heal() {
      signal([69, 76, 81], 0.12, 0.07);
      voice(523, 784, 0.3, 0.09, { type: 'sine', attack: 0.012 });
    },
    alarm(level) { signal(level > 0.8 ? [45, 52, 45] : [45, 52], 0.075, 0.16); },
    death() { cancelReload(); score?.stop(); signal([57, 54, 49, 35], 0.19, 0.17); },
    pickup(id) {
      // Rapid grabs within 1s climb the phrase so a chain of pickups keeps rising.
      const now = performance.now();
      pickupStreak = now - lastPickupAt <= 1000 ? Math.min(pickupStreak + 1, 8) : 0;
      lastPickupAt = now;
      const shift = pickupStreak * 2; // +2 semitones per step
      const base = id === 'med' ? [66, 73, 78] : [61, 69, 73];
      signal(base.map(n => n + shift), 0.11, 0.06);
    },
    emerald(chain = 0) {
      // Short digital tick — no chord, no reverb. Chain only nudges pitch.
      // Magnet vacuums can collect dozens per second; throttle the ticks.
      if (!ctx) return;
      const now = performance.now();
      if (now - lastEmeraldAt < 55) return;
      lastEmeraldAt = now;
      const hz = 720 + Math.min(chain, 8) * 70;
      voice(hz, hz * 1.12, 0.045, 0.035, { type: 'square', attack: 0.002 });
      grain(hz * 1.45, 0.03, 0.028);
    },
    upgrade(category) { signal(category === 'firepower' ? [49, 61, 68, 73] : [54, 59, 66, 71], 0.13, 0.065); },
    deal(count) { signal([54, 57, 61].slice(0, count), 0.065, 0.065); },
    hover(i) { signal([59 + i * 2], 0.05); },
    ui(action) {
      uiSignal(action === 'move' ? [57] : action === 'back' ? [61, 54] : [61, 66, 73], 0.075, 0.052);
    },
  };
}

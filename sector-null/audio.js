const midiHz = note => 440 * 2 ** ((note - 69) / 12);
const PROGRESSION = [
  [35, 54, 57, 61], [35, 52, 54, 62], [31, 50, 54, 57], [33, 52, 57, 59],
];
const MOTIF = [66, 69, 73, 71, 66, 62, 69, 64];

export function createAudio(settings, listener) {
  let ctx, master, musicBus, reverb, noise, hum, humGain;
  let muted = false;
  let paused = false;
  let mode = 'title';
  let nextBeat = 0;
  let beat = 0;

  function ensure() {
    if (!ctx) {
      const AudioContext = window.AudioContext ?? window.webkitAudioContext;
      if (!AudioContext) return;
      ctx = new AudioContext();
      master = ctx.createGain();
      const compressor = ctx.createDynamicsCompressor();
      master.connect(compressor).connect(ctx.destination);
      musicBus = ctx.createGain();
      musicBus.connect(master);
      reverb = ctx.createDelay(0.5);
      reverb.delayTime.value = 0.115;
      const feedback = ctx.createGain();
      feedback.gain.value = 0.19;
      reverb.connect(feedback).connect(reverb);
      const wet = ctx.createGain();
      wet.gain.value = 0.17;
      reverb.connect(wet).connect(master);

      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const samples = noise.getChannelData(0);
      for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;

      hum = ctx.createOscillator();
      hum.type = 'triangle';
      hum.frequency.value = 47;
      humGain = ctx.createGain();
      humGain.gain.value = 0.045;
      hum.connect(humGain).connect(master);
      hum.start();
      nextBeat = ctx.currentTime + 0.05;
      applyVolume();
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  }

  function applyVolume() {
    if (!ctx) return;
    master.gain.setTargetAtTime(muted ? 0 : (settings.master / 10) ** 1.5 * 0.75, ctx.currentTime, 0.04);
    musicBus.gain.setTargetAtTime(paused ? 0 : (settings.music / 10) ** 1.5, ctx.currentTime, 0.08);
  }

  function spatial(position) {
    if (!position || !ctx) return master;
    const player = listener();
    const dx = (position.x ?? 0) - player.x;
    const dz = (position.z ?? 0) - player.z;
    const pan = ctx.createStereoPanner();
    const distance = ctx.createGain();
    pan.pan.value = Math.max(-0.85, Math.min(0.85, dx / 12));
    distance.gain.value = 1 / (1 + Math.hypot(dx, dz) * 0.09);
    pan.connect(distance).connect(master);
    return pan;
  }

  function voice(from, to, duration, volume, options = {}) {
    if (!ctx) return;
    const { type = 'sine', t = ctx.currentTime, attack = 0.008, out = master, echo = false } = options;
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
  }

  function grain(freq, duration, volume, out = master, type = 'bandpass') {
    if (!ctx) return;
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
  }

  function signal(notes, volume = 0.13, step = 0.085) {
    if (!ctx) return;
    notes.forEach((note, i) => {
      const hz = midiHz(note);
      voice(hz, hz * 0.996, 0.24, volume, { type: 'triangle', t: ctx.currentTime + i * step, echo: true });
    });
  }

  function setMode(value) {
    if (value === mode) return;
    mode = value;
    beat = 0;
    if (ctx) nextBeat = ctx.currentTime + 0.08;
  }

  function schedule(pressure) {
    if (paused || mode === 'dead') return;
    if (nextBeat < ctx.currentTime) nextBeat = ctx.currentTime + 0.015;
    const combat = mode === 'combat';
    const interval = combat ? 0.267 - pressure * 0.05 : 0.44;
    while (nextBeat < ctx.currentTime + 0.095) {
      const chord = PROGRESSION[Math.floor(beat / 8) % PROGRESSION.length];
      const step = beat % 8;
      const opts = { t: nextBeat, out: musicBus };
      if (step === 0) {
        for (const n of chord.slice(1)) voice(midiHz(n), midiHz(n) * 0.998, interval * 7.8, 0.029, { ...opts, attack: 0.29 });
      }
      if (step === 0 || (combat && step % 2 === 0)) {
        const root = midiHz(chord[0] + (step === 6 ? 12 : 0));
        voice(root, root * 0.96, interval * 1.7, combat ? 0.155 : 0.076, { ...opts, type: 'triangle' });
        if (combat) voice(85, 39, 0.16, 0.13, opts);
      }
      if ((combat && step % 2 === 1) || (!combat && (step === 2 || step === 6))) {
        const n = midiHz(MOTIF[(Math.floor(beat / 2) + (mode === 'calm' ? 2 : 0)) % MOTIF.length]);
        voice(n, n * 0.986, interval * 2.3, 0.068, { ...opts, type: 'triangle' });
        voice(n * 2.003, n * 2, 0.16, 0.018, opts);
      }
      nextBeat += interval;
      beat++;
    }
  }

  return {
    ensure, applyVolume, setMode,
    pause(on) {
      paused = on;
      applyVolume();
      if (ctx && on) humGain.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
    },
    toggleMute() {
      ensure();
      muted = !muted;
      applyVolume();
      return muted;
    },
    reactor(pressure) {
      if (!ctx || ctx.state !== 'running') return;
      hum.frequency.setTargetAtTime(47 + pressure * 17, ctx.currentTime, 0.18);
      humGain.gain.setTargetAtTime(paused ? 0 : 0.043 + pressure * 0.04, ctx.currentTime, 0.18);
      schedule(pressure);
    },
    shot(hot, spread) {
      voice(hot ? 510 : 390, 47, 0.16, 0.31 + spread * 0.03, { type: 'triangle' });
      voice(1950, hot ? 190 : 380, 0.105, 0.115, { type: 'sawtooth', echo: true });
      grain(3600, 0.085, 0.24);
    },
    reloadOut() { grain(2400, 0.14, 0.24); voice(190, 95, 0.16, 0.11, { type: 'triangle' }); },
    reloadIn() { grain(1500, 0.1, 0.23); signal([61, 73], 0.06, 0.048); },
    hit(pos) { const out = spatial(pos); grain(2200, 0.08, 0.26, out); voice(290, 87, 0.1, 0.21, { out, type: 'triangle' }); },
    shutdown(pos) { const out = spatial(pos); grain(1250, 0.38, 0.32, out); voice(820, 45, 0.34, 0.22, { out, type: 'triangle', echo: true }); },
    servo(pos) { const out = spatial(pos); voice(135, 280, 0.24, 0.056, { out, type: 'triangle' }); grain(780, 0.12, 0.05, out); },
    swipe(pos) { grain(740, 0.21, 0.25, spatial(pos)); },
    hurt() { voice(108, 43, 0.38, 0.42, { type: 'triangle' }); signal([56, 50], 0.12); },
    step() { grain(510, 0.08, 0.11); },
    bash(pos, strength = 1) { const out = spatial(pos); voice(106, 50, 0.18, 0.29 * strength, { out, type: 'triangle' }); grain(1600, 0.12, 0.24 * strength, out); },
    crack(pos) { grain(4300, 0.14, 0.3, spatial(pos)); },
    doorBreak(pos) { const out = spatial(pos); grain(820, 0.48, 0.42, out); voice(210, 42, 0.38, 0.3, { out, type: 'triangle' }); },
    shatter(pos) { const out = spatial(pos); grain(4800, 0.36, 0.52, out); voice(880, 250, 0.18, 0.13, { out, echo: true }); },
    waveStart(n) { setMode('combat'); signal([42, 49, n > 4 ? 56 : 54], 0.16, 0.12); },
    waveClear() { setMode('calm'); signal([54, 61, 66, 73], 0.13); },
    alarm(level) { signal(level > 0.8 ? [45, 52, 45] : [45, 52], 0.075, 0.16); },
    death() { setMode('dead'); signal([57, 54, 49, 35], 0.19, 0.17); },
    pickup(id) { signal(id === 'med' ? [66, 73, 78] : [61, 69, 73], 0.11, 0.06); },
    upgrade(category) { signal(category === 'firepower' ? [49, 61, 68, 73] : [54, 59, 66, 71], 0.13, 0.065); },
    deal(count) { signal([54, 57, 61].slice(0, count), 0.065, 0.065); },
    hover(i) { signal([59 + i * 2], 0.05); },
    ui(action) { signal(action === 'move' ? [57] : action === 'back' ? [61, 54] : [61, 66, 73], 0.075, 0.052); },
  };
}

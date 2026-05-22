/**
 * sfx.js — Haikatalyst Sound Effects Engine
 * Synthesized via Web Audio API. No audio files needed.
 * Respects prefers-reduced-motion for users who opt out.
 */

const SFX = (() => {
  let ctx = null;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  // ── Core synthesizer ────────────────────────────────────────────────────────

  /**
   * Play a synthesized tone with optional frequency sweep and shape.
   * @param {Object} opts
   */
  function synth({
    type = 'sine',
    freq = 440,
    freqEnd = null,
    gain = 0.25,
    attack = 0.005,
    decay = 0.08,
    duration = 0.12,
    detune = 0,
    filterFreq = null,
    filterType = 'lowpass',
  } = {}) {
    if (reduced) return;
    const ac = getCtx();
    const now = ac.currentTime;

    const osc = ac.createOscillator();
    const gainNode = ac.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== null) {
      osc.frequency.exponentialRampToValueAtTime(freqEnd, now + duration);
    }
    if (detune) osc.detune.setValueAtTime(detune, now);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(gain, now + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + attack + decay);

    let lastNode = gainNode;

    if (filterFreq) {
      const filter = ac.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.setValueAtTime(filterFreq, now);
      gainNode.connect(filter);
      filter.connect(ac.destination);
      lastNode = filter;
    } else {
      gainNode.connect(ac.destination);
    }

    osc.connect(gainNode);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  // Layer two oscillators for richer sounds
  function synthLayer(layers) {
    layers.forEach((opts) => synth(opts));
  }

  // ── Sound definitions ────────────────────────────────────────────────────────

  /**
   * Varied button click SFX with dynamic styles and subtle pitch jitter.
   * @param {string|number} [style] - Style name ('retro', 'bubble', 'mechanical', 'tick') or grade number (1-6)
   */
  function click(style) {
    const jitter = 0.94 + Math.random() * 0.12; // Dynamic ±6% pitch variance for natural feel

    // If style is a grade number (1 to 6), scale the pitch for ascending scale effect
    let pitchMultiplier = 1.0;
    if (typeof style === 'number' && style >= 1 && style <= 6) {
      pitchMultiplier = 0.75 + (style - 1) * 0.10; // ascending pitch from 0.75x to 1.25x
      style = 'retro';
    }

    const styles = ['retro', 'bubble', 'mechanical', 'tick'];
    let selectedStyle = style;
    
    // If no style is specified or randomly chosen, pick one
    if (!selectedStyle) {
      selectedStyle = styles[Math.floor(Math.random() * styles.length)];
    }

    switch (selectedStyle) {
      case 'bubble':
        synthLayer([
          { type: 'sine',     freq: 400 * jitter * pitchMultiplier,  freqEnd: 1000 * jitter * pitchMultiplier, gain: 0.13, attack: 0.005, decay: 0.06, duration: 0.08 },
          { type: 'triangle', freq: 800 * jitter * pitchMultiplier,  freqEnd: 1400 * jitter * pitchMultiplier, gain: 0.05, attack: 0.003, decay: 0.04, duration: 0.06 },
        ]);
        break;
      case 'mechanical':
        synthLayer([
          { type: 'triangle', freq: 1600 * jitter * pitchMultiplier, freqEnd: 1200 * jitter * pitchMultiplier, gain: 0.10, attack: 0.001, decay: 0.02, duration: 0.03 },
          { type: 'sine',     freq: 2400 * jitter * pitchMultiplier, freqEnd: 1800 * jitter * pitchMultiplier, gain: 0.04, attack: 0.001, decay: 0.015, duration: 0.02 },
        ]);
        break;
      case 'tick':
        synthLayer([
          { type: 'triangle', freq: 500 * jitter * pitchMultiplier,  freqEnd: 260 * jitter * pitchMultiplier,  gain: 0.15, attack: 0.002, decay: 0.04, duration: 0.05, filterFreq: 1200 },
          { type: 'sine',     freq: 1000 * jitter * pitchMultiplier, freqEnd: 510 * jitter * pitchMultiplier,  gain: 0.06, attack: 0.002, decay: 0.03, duration: 0.04 },
        ]);
        break;
      case 'retro':
      default:
        synthLayer([
          { type: 'square', freq: 880 * jitter * pitchMultiplier, freqEnd: 660 * jitter * pitchMultiplier, gain: 0.10, attack: 0.002, decay: 0.07, duration: 0.09, filterFreq: 2400 },
          { type: 'sine',   freq: 1200 * jitter * pitchMultiplier, freqEnd: 900 * jitter * pitchMultiplier, gain: 0.06, attack: 0.003, decay: 0.05, duration: 0.08 },
        ]);
        break;
    }
  }

  /** Punchy roll: dice / main action */
  function roll() {
    synthLayer([
      { type: 'sawtooth', freq: 160, freqEnd: 80, gain: 0.22, attack: 0.003, decay: 0.14, duration: 0.17, filterFreq: 900 },
      { type: 'square',   freq: 320, freqEnd: 200, gain: 0.1,  attack: 0.005, decay: 0.1,  duration: 0.13, filterFreq: 1800 },
    ]);
  }

  /** Bright chime: start / confirm */
  function start() {
    [0, 80, 160].forEach((delay, i) => {
      setTimeout(() => synth({
        type: 'sine',
        freq: [523, 659, 784][i],
        gain: 0.18,
        attack: 0.01,
        decay: 0.18,
        duration: 0.22,
      }), delay);
    });
  }

  /** Soft click: secondary / close / modal */
  function soft() {
    synth({ type: 'sine', freq: 600, freqEnd: 480, gain: 0.14, attack: 0.004, decay: 0.09, duration: 0.11 });
  }

  /** Bounce pop: toggle / selection */
  function toggle() {
    synthLayer([
      { type: 'triangle', freq: 740,  freqEnd: 860, gain: 0.15, attack: 0.003, decay: 0.08, duration: 0.10 },
      { type: 'sine',     freq: 1480, freqEnd: 1720, gain: 0.07, attack: 0.005, decay: 0.06, duration: 0.09 },
    ]);
  }

  /** Negative blip: warning / coming-soon */
  function warn() {
    synthLayer([
      { type: 'sawtooth', freq: 220, freqEnd: 140, gain: 0.15, attack: 0.005, decay: 0.12, duration: 0.15, filterFreq: 700 },
      { type: 'sine',     freq: 110, freqEnd: 85,  gain: 0.1,  attack: 0.003, decay: 0.1,  duration: 0.13 },
    ]);
  }

  /** Sparkle shimmer: win / confetti */
  function win() {
    [0, 60, 120, 200, 300].forEach((delay, i) => {
      setTimeout(() => synth({
        type: 'sine',
        freq: [784, 880, 1047, 1175, 1319][i],
        gain: 0.16,
        attack: 0.008,
        decay: 0.2,
        duration: 0.25,
      }), delay);
    });
  }

  /**
   * Feather whisper: hover over buttons with optional pitch scaling
   * @param {number} [pitchMultiplier=1.0] - Scaling factor for ascending arpeggios
   */
  function hover(pitchMultiplier = 1.0) {
    synth({
      type: 'sine',
      freq: 1040 * pitchMultiplier,
      freqEnd: 1120 * pitchMultiplier,
      gain: 0.05,
      attack: 0.004,
      decay: 0.055,
      duration: 0.07
    });
  }

  /** Boost burst: random boost button */
  function boost() {
    synthLayer([
      { type: 'sawtooth', freq: 220, freqEnd: 440, gain: 0.18, attack: 0.005, decay: 0.12, duration: 0.15, filterFreq: 1600 },
      { type: 'square',   freq: 440, freqEnd: 880, gain: 0.10, attack: 0.005, decay: 0.10, duration: 0.14 },
      { type: 'sine',     freq: 880, freqEnd: 1760, gain: 0.08, attack: 0.008, decay: 0.09, duration: 0.13 },
    ]);
  }

  /** Info tap: tutorial / guide open */
  function info() {
    synthLayer([
      { type: 'sine', freq: 660, freqEnd: 740, gain: 0.13, attack: 0.005, decay: 0.1, duration: 0.13 },
      { type: 'sine', freq: 990, freqEnd: 1100, gain: 0.07, attack: 0.007, decay: 0.08, duration: 0.11 },
    ]);
  }

  // ── BGM (Background Music) ──────────────────────────────────────────────────
  let bgmInterval = null;
  let bgmStep = 0;
  
  /** Start a gentle, generative background loop */
  function bgmStart() {
    if (reduced) return;
    if (bgmInterval) return; // already playing
    
    const ac = getCtx();
    if (ac.state === 'suspended') ac.resume();

    // Pentatonic scale sequence for a calm, math-friendly vibe
    const notes = [
      261.63, // C4
      329.63, // E4
      392.00, // G4
      440.00, // A4
      523.25, // C5
      440.00, // A4
      392.00, // G4
      329.63  // E4
    ];

    bgmStep = 0;
    bgmInterval = setInterval(() => {
      if (ac.state !== 'running') return;
      const freq = notes[bgmStep % notes.length];
      
      // Soft ambient pluck
      synth({
        type: 'sine',
        freq: freq,
        gain: 0.025, // Keep it very quiet so it's not distracting
        attack: 0.08,
        decay: 1.2,
        duration: 1.3
      });

      // Add occasional harmonies
      if (bgmStep % 4 === 0) {
        synth({
          type: 'triangle',
          freq: freq * 0.5, // 1 octave lower
          gain: 0.02,
          attack: 0.1,
          decay: 1.5,
          duration: 1.6
        });
      }

      bgmStep++;
    }, 500); // 120 BPM (1 beat = 500ms)
  }

  function bgmStop() {
    if (bgmInterval) {
      clearInterval(bgmInterval);
      bgmInterval = null;
    }
  }

  return { click, roll, start, soft, toggle, warn, win, hover, boost, info, bgmStart, bgmStop };
})();

window.SFX = SFX;

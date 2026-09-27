/**
 * Web Audio API Sound Utility for Tactical Football Simulator
 * Generates an organic, subtle leather ball 'thump' when a pass or kick occurs.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }

  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }

  return audioCtx;
}

/**
 * Plays a realistic, subtle 'thump' acoustic sound effect representing
 * a boot striking a leather football when a pass starts.
 */
export function playBallThumpSound(volume: number = 0.32) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Primary Low-Frequency Body (Pitch-dropping sine/triangle wave)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    
    // Pitch drop: 125 Hz down to 48 Hz gives that punchy, organic ball impact
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(125, now);
    osc.frequency.exponentialRampToValueAtTime(48, now + 0.09);

    // Gain envelope: fast attack, quick decay
    oscGain.gain.setValueAtTime(0.001, now);
    oscGain.gain.linearRampToValueAtTime(volume, now + 0.006);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    // Low-pass filter to keep the thump warm and round without high-pitched clicks
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(260, now);
    lowpass.frequency.exponentialRampToValueAtTime(140, now + 0.1);

    osc.connect(oscGain);
    oscGain.connect(lowpass);
    lowpass.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);

    // 2. Subtle soft leather surface texture burst
    const bufferSize = Math.floor(ctx.sampleRate * 0.035); // 35ms burst
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.setValueAtTime(400, now);
    noiseFilter.Q.setValueAtTime(1.2, now);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(volume * 0.38, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    whiteNoise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.045);
  } catch {
    // Fail silently if audio is blocked or unsupported by browser policy
  }
}

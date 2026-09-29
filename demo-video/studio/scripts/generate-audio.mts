// Synthesizes the showcase soundtrack and UI sounds into public/audio.
// Everything is generated here, so there is no third-party audio to license.
// Run: npm run audio
import { mkdirSync, writeFileSync } from 'node:fs';

const RATE = 44100;
const PEAK = 10 ** (-1 / 20); // normalize every file to -1 dBFS; playback gain is set in audio-config.ts
const OUT_DIR = new URL('../public/audio/', import.meta.url);

const samples = (seconds: number): number => Math.round(seconds * RATE);
const lowpassCoefficient = (cutoff: number): number =>
  1 - Math.exp((-2 * Math.PI * cutoff) / RATE);

// Seeded PRNG so every run produces identical files.
const createNoise = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return (((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296) * 2 - 1;
  };
};

const writeWav = (name: string, channels: Float32Array[]): void => {
  const length = channels[0].length;
  let peak = 0;
  for (const channel of channels) {
    for (const sample of channel) peak = Math.max(peak, Math.abs(sample));
  }
  const gain = peak > 0 ? PEAK / peak : 0;
  const bytes = Buffer.alloc(44 + length * channels.length * 2);
  bytes.write('RIFF', 0);
  bytes.writeUInt32LE(36 + length * channels.length * 2, 4);
  bytes.write('WAVEfmt ', 8);
  bytes.writeUInt32LE(16, 16);
  bytes.writeUInt16LE(1, 20);
  bytes.writeUInt16LE(channels.length, 22);
  bytes.writeUInt32LE(RATE, 24);
  bytes.writeUInt32LE(RATE * channels.length * 2, 28);
  bytes.writeUInt16LE(channels.length * 2, 32);
  bytes.writeUInt16LE(16, 34);
  bytes.write('data', 36);
  bytes.writeUInt32LE(length * channels.length * 2, 40);
  for (let index = 0; index < length; index++) {
    channels.forEach((channel, channelIndex) => {
      const value = Math.max(-1, Math.min(1, channel[index] * gain));
      bytes.writeInt16LE(
        Math.round(value * 32767),
        44 + (index * channels.length + channelIndex) * 2,
      );
    });
  }
  writeFileSync(new URL(name, OUT_DIR), bytes);
  console.log(`${name}  ${(length / RATE).toFixed(2)}s`);
};

// Adds a decaying sine with an optional pitch glide into `target`.
const addTone = (
  target: Float32Array,
  options: {
    start: number;
    from: number;
    to?: number;
    glide?: number;
    attack?: number;
    decay: number;
    level: number;
  },
): void => {
  const { start, from, to = from, glide = 0.001, attack = 0.003, decay, level } = options;
  let phase = 0;
  const begin = samples(start);
  const end = Math.min(target.length, begin + samples(decay * 7));
  for (let index = begin; index < end; index++) {
    const time = (index - begin) / RATE;
    const frequency = from + (to - from) * Math.min(1, time / glide);
    phase += (2 * Math.PI * frequency) / RATE;
    const envelope = Math.min(1, time / attack) * Math.exp(-time / decay);
    target[index] += Math.sin(phase) * envelope * level;
  }
};

const click = (): Float32Array => {
  const out = new Float32Array(samples(0.08));
  const noise = createNoise(11);
  const smoothing = lowpassCoefficient(5000);
  let filtered = 0;
  for (let index = 0; index < out.length; index++) {
    const time = index / RATE;
    filtered += smoothing * (noise() - filtered);
    out[index] = filtered * Math.exp(-time / 0.004) * 0.8;
  }
  addTone(out, { start: 0, from: 1700, decay: 0.012, level: 0.5 });
  addTone(out, { start: 0, from: 850, decay: 0.02, level: 0.3 });
  return out;
};

const pop = (): Float32Array => {
  const out = new Float32Array(samples(0.25));
  addTone(out, { start: 0, from: 520, to: 780, glide: 0.04, attack: 0.004, decay: 0.06, level: 1 });
  addTone(out, { start: 0, from: 1040, to: 1560, glide: 0.04, attack: 0.004, decay: 0.035, level: 0.18 });
  return out;
};

// State-variable band-pass sweeping over noise: a soft air movement for scene changes.
const whoosh = (): Float32Array => {
  const out = new Float32Array(samples(0.75));
  const noise = createNoise(23);
  let low = 0;
  let band = 0;
  for (let index = 0; index < out.length; index++) {
    const progress = index / out.length;
    const cutoff = 350 + 2300 * Math.sin(Math.PI * progress ** 0.8);
    const tune = 2 * Math.sin((Math.PI * cutoff) / RATE);
    const high = noise() - low - 0.9 * band;
    band += tune * high;
    low += tune * band;
    out[index] = band * Math.sin(Math.PI * progress) ** 2;
  }
  return out;
};

// Sub drop with a short felt transient and a faint shimmer on top: a subtle "reveal" hit.
const impact = (): Float32Array => {
  const out = new Float32Array(samples(1.6));
  addTone(out, { start: 0, from: 92, to: 44, glide: 0.3, attack: 0.004, decay: 0.34, level: 1 });
  const noise = createNoise(37);
  const smoothing = lowpassCoefficient(900);
  let filtered = 0;
  for (let index = 0; index < samples(0.2); index++) {
    filtered += smoothing * (noise() - filtered);
    out[index] += filtered * Math.exp(-index / RATE / 0.03) * 0.45;
  }
  addTone(out, { start: 0.01, from: 880, attack: 0.03, decay: 0.45, level: 0.06 });
  addTone(out, { start: 0.01, from: 1318.51, attack: 0.03, decay: 0.4, level: 0.045 });
  return out;
};

// Ascending ticks over a soft rising tone: numbers loading or updating.
const data = (): Float32Array => {
  const out = new Float32Array(samples(0.55));
  [1200, 1400, 1600, 1800, 2100].forEach((frequency, index) => {
    addTone(out, { start: index * 0.06, from: frequency, attack: 0.002, decay: 0.012, level: 0.5 });
  });
  addTone(out, { start: 0, from: 420, to: 840, glide: 0.32, attack: 0.05, decay: 0.12, level: 0.35 });
  return out;
};

// Two soft bell notes, a fifth apart.
const success = (): Float32Array => {
  const out = new Float32Array(samples(1.2));
  [
    [0, 659.25],
    [0.11, 987.77],
  ].forEach(([start, frequency]) => {
    addTone(out, { start, from: frequency, attack: 0.004, decay: 0.32, level: 0.6 });
    addTone(out, { start, from: frequency * 2.76, attack: 0.004, decay: 0.08, level: 0.12 });
  });
  return out;
};

// ~48 s ambient bed at 110 BPM: detuned pad, soft sub pulse, sparse delayed plucks.
const music = (): Float32Array[] => {
  const duration = 48;
  const beat = 60 / 110;
  const bar = beat * 4;
  const left = new Float32Array(samples(duration));
  const right = new Float32Array(samples(duration));
  const chords = [
    [110, 164.81, 196, 246.94, 261.63], // Am9
    [87.31, 130.81, 164.81, 220, 329.63], // Fmaj7
    [130.81, 196, 246.94, 329.63], // Cmaj7
    [98, 146.83, 220, 329.63], // G6sus
  ];
  const chordLength = bar * 2;

  // Pad: saw-like additive voices, detuned ±4 cents between channels.
  const pad = [new Float32Array(left.length), new Float32Array(right.length)];
  for (let start = 0, chord = 0; start < duration; start += chordLength, chord++) {
    const notes = chords[chord % chords.length];
    const begin = samples(start);
    const end = Math.min(left.length, samples(start + chordLength + 1.2));
    notes.forEach((frequency) => {
      [-4, 4].forEach((cents, channel) => {
        const tuned = frequency * 2 ** (cents / 1200);
        for (let index = begin; index < end; index++) {
          const time = (index - begin) / RATE;
          const envelope =
            Math.min(1, time / 0.9) *
            Math.min(1, Math.max(0, (chordLength + 1.2 - time) / 1.2));
          let voice = 0;
          for (let harmonic = 1; harmonic <= 6; harmonic++) {
            voice += Math.sin(2 * Math.PI * tuned * harmonic * time) / harmonic;
          }
          pad[channel][index] += (voice * envelope * 0.1) / notes.length;
        }
      });
    });
  }
  pad.forEach((channel, channelIndex) => {
    let filtered = 0;
    for (let index = 0; index < channel.length; index++) {
      const cutoff = 900 + 450 * Math.sin((2 * Math.PI * 0.05 * index) / RATE + channelIndex);
      filtered += lowpassCoefficient(cutoff) * (channel[index] - filtered);
      (channelIndex === 0 ? left : right)[index] += filtered;
    }
  });

  // Sub pulse on beats 1 and 3, from bar 2.
  const pulse = new Float32Array(left.length);
  for (let time = bar * 2; time < duration; time += beat * 2) {
    addTone(pulse, { start: time, from: 70, to: 52, glide: 0.08, attack: 0.006, decay: 0.16, level: 0.06 });
  }

  // Plucked eighth-note arpeggio an octave up, from bar 2, with a ping-pong delay.
  const pluck = new Float32Array(left.length);
  for (let step = 0, time = bar * 2; time < duration; step++, time += beat / 2) {
    if (step % 8 === 3 || step % 8 === 7) continue; // leave air in the pattern
    const notes = chords[Math.floor(time / chordLength) % chords.length];
    const frequency = notes[(step % 4) + (notes.length > 4 ? 1 : 0)] * 2;
    addTone(pluck, { start: time, from: frequency, attack: 0.004, decay: 0.14, level: 0.045 });
    addTone(pluck, { start: time, from: frequency * 2, attack: 0.004, decay: 0.06, level: 0.012 });
  }
  const delay = samples(beat * 0.75);
  for (let index = 0; index < left.length; index++) {
    const echoLeft = index >= delay ? pluck[index - delay] * 0.35 : 0;
    const echoRight = index >= delay * 2 ? pluck[index - delay * 2] * 0.2 : 0;
    left[index] += pulse[index] + pluck[index] + echoLeft;
    right[index] += pulse[index] + pluck[index] * 0.85 + echoRight;
  }
  return [left, right];
};

mkdirSync(OUT_DIR, { recursive: true });
writeWav('click.wav', [click()]);
writeWav('pop.wav', [pop()]);
writeWav('whoosh.wav', [whoosh()]);
writeWav('impact.wav', [impact()]);
writeWav('data.wav', [data()]);
writeWav('success.wav', [success()]);
writeWav('music-bed.wav', music());

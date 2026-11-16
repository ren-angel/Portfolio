// Tiny synthesized UI sounds (Web Audio, no audio files). Off by default; toggled in Settings.
type SoundName = "open" | "close" | "minimize" | "maximize" | "restore" | "click" | "success" | "error";

// [frequency start, frequency end, duration seconds, wave]
const SOUNDS: Record<SoundName, [number, number, number, OscillatorType][]> = {
  open: [[660, 880, 0.08, "sine"], [880, 1175, 0.1, "sine"]],
  close: [[740, 440, 0.12, "sine"]],
  minimize: [[880, 330, 0.16, "triangle"]],
  maximize: [[330, 880, 0.16, "triangle"]],
  restore: [[523, 784, 0.12, "triangle"]],
  click: [[1200, 1000, 0.035, "square"]],
  success: [[784, 784, 0.09, "sine"], [988, 988, 0.09, "sine"], [1319, 1319, 0.16, "sine"]],
  error: [[300, 220, 0.18, "sawtooth"]],
};

let enabled = false;
let ctx: AudioContext | null = null;

export function setSoundsEnabled(on: boolean) {
  enabled = on;
}

export function playSound(name: SoundName) {
  if (!enabled || typeof AudioContext === "undefined") return;
  try {
    ctx ??= new AudioContext();
    let at = ctx.currentTime;
    for (const [from, to, dur, type] of SOUNDS[name]) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(from, at);
      osc.frequency.exponentialRampToValueAtTime(to, at + dur);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(type === "square" || type === "sawtooth" ? 0.03 : 0.08, at + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(at);
      osc.stop(at + dur + 0.02);
      at += dur * 0.85;
    }
  } catch { /* audio is a nice-to-have */ }
}

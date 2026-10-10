export const CURVES = ["linear", "equal-power"];

function clamp01(x) {
  return Number.isFinite(x) ? Math.min(1, Math.max(0, x)) : 0;
}

/**
 * Compute the volume (0-100) for each deck.
 * position: 0 = fully deck A, 1 = fully deck B, 0.5 = centre.
 * curve: "linear" (both 50% at centre) or "equal-power" (both ~71% at centre).
 * master: 0-100, scales both decks.
 */
export function deckVolumes(position, curve = "linear", master = 100) {
  const p = clamp01(position);
  let a, b;
  if (curve === "linear") {
    a = 1 - p;
    b = p;
  } else if (curve === "equal-power") {
    a = Math.cos((p * Math.PI) / 2);
    b = Math.sin((p * Math.PI) / 2);
  } else {
    throw new RangeError(`Unknown curve: ${curve}`);
  }
  const m = clamp01(master / 100);
  return { a: a * m * 100, b: b * m * 100 };
}

/** Move the fader by delta, staying within 0-1. */
export function nudgePosition(position, delta) {
  return clamp01(clamp01(position) + delta);
}

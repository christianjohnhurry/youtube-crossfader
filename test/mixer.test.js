import { test } from "node:test";
import assert from "node:assert/strict";
import { deckVolumes, nudgePosition } from "../src/mixer.js";

const close = (actual, expected) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} !~ ${expected}`);

test("linear: ends and centre", () => {
  assert.deepEqual(deckVolumes(0, "linear"), { a: 100, b: 0 });
  assert.deepEqual(deckVolumes(1, "linear"), { a: 0, b: 100 });
  assert.deepEqual(deckVolumes(0.5, "linear"), { a: 50, b: 50 });
});

test("equal-power: ends and centre", () => {
  const start = deckVolumes(0, "equal-power");
  close(start.a, 100);
  close(start.b, 0);
  const end = deckVolumes(1, "equal-power");
  close(end.a, 0);
  close(end.b, 100);
  const mid = deckVolumes(0.5, "equal-power");
  close(mid.a, 70.710678118);
  close(mid.b, 70.710678118);
});

test("equal-power keeps constant power across the fader", () => {
  for (const p of [0, 0.1, 0.25, 0.5, 0.8, 1]) {
    const { a, b } = deckVolumes(p, "equal-power");
    close(a * a + b * b, 100 * 100);
  }
});

test("master volume scales both decks", () => {
  assert.deepEqual(deckVolumes(0.5, "linear", 50), { a: 25, b: 25 });
  assert.deepEqual(deckVolumes(0, "linear", 50), { a: 50, b: 0 });
  assert.deepEqual(deckVolumes(1, "linear", 0), { a: 0, b: 0 });
  const mid = deckVolumes(0.5, "equal-power", 50);
  close(mid.a, 35.355339059);
  close(mid.b, 35.355339059);
  const end = deckVolumes(1, "equal-power", 80);
  close(end.a, 0);
  close(end.b, 80);
});

test("defaults to linear at full master", () => {
  assert.deepEqual(deckVolumes(0.25), { a: 75, b: 25 });
});

test("out-of-range inputs are clamped", () => {
  assert.deepEqual(deckVolumes(-1, "linear"), { a: 100, b: 0 });
  assert.deepEqual(deckVolumes(2, "linear"), { a: 0, b: 100 });
  assert.deepEqual(deckVolumes(0.5, "linear", 200), { a: 50, b: 50 });
  assert.deepEqual(deckVolumes(0.5, "linear", -5), { a: 0, b: 0 });
  assert.deepEqual(deckVolumes(NaN, "linear"), { a: 100, b: 0 });
});

test("unknown curve throws", () => {
  assert.throws(() => deckVolumes(0.5, "log"), RangeError);
});

test("nudgePosition moves and clamps", () => {
  close(nudgePosition(0.5, 0.05), 0.55);
  assert.equal(nudgePosition(0.98, 0.05), 1);
  assert.equal(nudgePosition(0.02, -0.05), 0);
});

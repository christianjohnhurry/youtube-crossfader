import { test } from "node:test";
import assert from "node:assert/strict";
import { parseVideoId } from "../src/youtube.js";

const ID = "dQw4w9WgXcQ";

test("bare video ID", () => {
  assert.equal(parseVideoId(ID), ID);
  assert.equal(parseVideoId(`  ${ID}\n`), ID);
  assert.equal(parseVideoId("a-b_c-d_e-f"), "a-b_c-d_e-f");
});

test("watch?v= URLs", () => {
  assert.equal(parseVideoId(`https://www.youtube.com/watch?v=${ID}`), ID);
  assert.equal(parseVideoId(`https://youtube.com/watch?v=${ID}&t=42s`), ID);
  assert.equal(parseVideoId(`https://www.youtube.com/watch?list=PL1&v=${ID}`), ID);
  assert.equal(parseVideoId(`https://m.youtube.com/watch?v=${ID}`), ID);
  assert.equal(parseVideoId(`https://music.youtube.com/watch?v=${ID}`), ID);
  assert.equal(parseVideoId(`www.youtube.com/watch?v=${ID}`), ID);
});

test("youtu.be URLs", () => {
  assert.equal(parseVideoId(`https://youtu.be/${ID}`), ID);
  assert.equal(parseVideoId(`https://youtu.be/${ID}?t=10`), ID);
  assert.equal(parseVideoId(`youtu.be/${ID}`), ID);
});

test("shorts URLs", () => {
  assert.equal(parseVideoId(`https://www.youtube.com/shorts/${ID}`), ID);
  assert.equal(parseVideoId(`https://youtube.com/shorts/${ID}?feature=share`), ID);
});

test("invalid input returns null", () => {
  assert.equal(parseVideoId(""), null);
  assert.equal(parseVideoId("   "), null);
  assert.equal(parseVideoId("hello"), null);
  assert.equal(parseVideoId("tooshort"), null);
  assert.equal(parseVideoId(`${ID}x`), null);
  assert.equal(parseVideoId("https://www.youtube.com/watch"), null);
  assert.equal(parseVideoId("https://www.youtube.com/watch?v=short"), null);
  assert.equal(parseVideoId("https://www.youtube.com/"), null);
  assert.equal(parseVideoId(`https://example.com/watch?v=${ID}`), null);
  assert.equal(parseVideoId(`javascript:alert('${ID}')`), null);
  assert.equal(parseVideoId(null), null);
  assert.equal(parseVideoId(undefined), null);
});

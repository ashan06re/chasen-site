import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CUTS, cutState, createStorySignal, artSrc, clamp01 } from '../src/lib/storyScript.ts';

test('five approved, consecutive story scenes', () => {
  assert.deepEqual(CUTS.map(c => c.id), ['01', '02', '03', '04', '05']);
  CUTS.forEach(c => { assert.ok(c.ja && c.en && c.detail && c.detailEn); });
});
test('start, end, overscroll and non-finite input stay valid', () => {
  for (const p of [-Infinity, NaN, Infinity, -100, 0, 1, 100]) {
    const s = cutState(p);
    for (const value of Object.values(s)) assert.ok(Number.isFinite(value));
    assert.ok(s.a >= 0 && s.b < CUTS.length);
    assert.ok(s.t >= 0 && s.t <= 1 && s.mix >= 0 && s.mix <= 1);
  }
  assert.deepEqual(cutState(0), { a: 0, b: 1, t: 0, mix: 0 });
  assert.deepEqual(cutState(1), { a: 4, b: 4, t: 1, mix: 0 });
});
test('every scene boundary dissolves continuously in both directions', () => {
  for (let i = 1; i < CUTS.length; i++) {
    const before = cutState(i / CUTS.length - 1e-7);
    const after = cutState(i / CUTS.length + 1e-7);
    assert.equal(before.b, after.a);
    assert.ok(before.mix > .99999 && after.mix === 0);
    assert.ok(after.t < .00001);
  }
});
test('rapid forward/reverse traversal never skips beyond array bounds', () => {
  const inputs = Array.from({ length: 10001 }, (_, i) => i / 10000);
  for (const p of [...inputs, ...inputs.reverse(), .95, .05, .75, .1, 1, 0]) {
    const s = cutState(p);
    assert.ok(CUTS[s.a] && CUTS[s.b]);
    assert.ok(s.b - s.a <= 1);
  }
});
test('one-frame depth panels cannot cross-fade to a missing texture', () => {
  for (const p of [0, .2, .7, .95, 1]) {
    const s = cutState(p, 1);
    assert.equal(s.a, 0); assert.equal(s.b, 0); assert.equal(s.mix, 0);
  }
});
test('signal has one authoritative value and releases subscribers', () => {
  const clock = createStorySignal();
  const received = [];
  const off = clock.subscribe(() => received.push(clock.read()));
  clock.set(.2); clock.set(.9); clock.set(-2); off(); clock.set(.7);
  assert.deepEqual(received, [.2, .9, 0]);
  assert.equal(clock.read(), .7);
  assert.equal(clamp01(NaN), 0);
});
test('new artwork cannot accidentally point at withdrawn photo URLs', () => {
  for (const cut of CUTS) {
    assert.equal(artSrc(cut.id), `/story-art/${cut.id}.webp`);
    assert.equal(artSrc(cut.id, true), `/story-art/${cut.id}-mobile.webp`);
    assert.ok(!artSrc(cut.id).startsWith('/story/'));
  }
});

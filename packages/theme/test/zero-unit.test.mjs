// Pins the zero-with-unit gate (src/scripts/zero-unit.mjs): both sides of the rule (bare
// zero outside math; `0rem`-only inside), the completed unit list, the multi-line calc scan,
// mutual exclusivity, and the error message.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ZERO_WITH_UNIT,
  ZERO_UNIT_IN_MATH,
  findZeroMisuse,
  assertNoZeroWithUnit,
} from '../src/scripts/zero-unit.mjs';

// `.test()` is stateless on these (non-global) regexes — see the module note.
const isBare = (s) => ZERO_WITH_UNIT.test(s);
const inMath = (s) => ZERO_UNIT_IN_MATH.test(s);

test('a zero length carrying a unit is flagged, across the full unit list', () => {
  for (const unit of [
    // absolute
    'px', 'cm', 'mm', 'Q', 'in', 'pt', 'pc',
    // font-relative + root-relative variants
    'em', 'rem', 'ex', 'rex', 'ch', 'rch', 'cap', 'rcap', 'ic', 'ric', 'lh', 'rlh',
    // viewport incl. the logical (vi/vb) + small/large/dynamic + min/max variants
    'vw', 'vh', 'vi', 'vb', 'vmin', 'vmax',
    'svw', 'svh', 'svi', 'svb', 'svmin', 'svmax',
    'lvw', 'lvh', 'lvi', 'lvb', 'lvmin', 'lvmax',
    'dvw', 'dvh', 'dvi', 'dvb', 'dvmin', 'dvmax',
    // container query
    'cqw', 'cqh', 'cqi', 'cqb', 'cqmin', 'cqmax',
  ]) {
    assert.ok(isBare(`--x: 0${unit};`), `expected 0${unit} to be flagged as a bare zero`);
  }
});

test('the units a partial list dropped are no longer silent', () => {
  // These are exactly the units ENG-46996 called out as passing through before.
  for (const unit of ['vi', 'vb', 'svi', 'svb', 'lvi', 'lvb', 'dvi', 'dvb', 'rex', 'rch', 'ric', 'rcap']) {
    assert.ok(isBare(`margin: 0${unit}`), `regression: 0${unit} slipped through`);
  }
});

test('units are case-insensitive', () => {
  for (const s of ['margin: 0PX', '--x: 0Rem', 'top: 0VI', 'width: 0SvB']) {
    assert.ok(isBare(s), `expected case-insensitive match for: ${s}`);
  }
});

test('a bare zero, non-zero lengths, and meaningful-at-zero units stay silent', () => {
  for (const s of [
    'margin: 0',
    'width: 10px',
    'padding: 0.5rem',
    'flex-basis: 0%',
    'transition-duration: 0s',
    'animation-delay: 0ms',
    'rotate: 0deg',
    'grid-template-columns: 0fr',
    'z-index: 0',
  ]) {
    assert.ok(!isBare(s), `expected silence for: ${s}`);
    assert.ok(!inMath(s), `expected silence (math) for: ${s}`);
  }
});

test('a zero with a unit inside a math function is zero-unit-in-calc, never zero-with-unit', () => {
  for (const s of [
    'width: calc(100% - 0px)',
    'height: min(0em, 1rem)',
    'width: clamp(0px, 2vw, 1rem)',
    'inset: max(0vi, var(--x))', // a newly-covered unit, inside math
    'width: calc(var(--x) - 0px)', // one nested call before the zero
  ]) {
    assert.ok(inMath(s), `expected zero-unit-in-calc for: ${s}`);
    assert.ok(!isBare(s), `expected NOT zero-with-unit for: ${s}`);
  }
});

test('0rem inside a math function is the sanctioned form — both checks stay silent', () => {
  for (const s of ['width: calc(100% - 0rem)', 'height: max(0rem, var(--h))']) {
    assert.ok(!isBare(s), `expected no zero-with-unit for: ${s}`);
    assert.ok(!inMath(s), `expected no zero-unit-in-calc for: ${s}`);
  }
});

test('a closed math function does not leak its exemption to a later zero', () => {
  const css = '--a: calc(100% - 1px);\n--b: 0px;';
  assert.equal(findZeroMisuse(css, ZERO_WITH_UNIT).length, 1, 'the zero after the closed calc() is bare');
  assert.equal(findZeroMisuse(css, ZERO_UNIT_IN_MATH).length, 0, 'nothing inside the calc() misuses a unit');
});

// Why the scan runs over the whole string: a per-line scan would mis-read the wrapped tail
// (`- 0px);`) as a bare zero.
test('a math function wrapping across lines is still judged in context', () => {
  const wrapped = '--x: calc(100%\n  - 0px);';
  assert.equal(findZeroMisuse(wrapped, ZERO_UNIT_IN_MATH).length, 1, 'the wrapped 0px is inside calc()');
  assert.equal(findZeroMisuse(wrapped, ZERO_WITH_UNIT).length, 0, 'it must NOT read as a bare zero');

  const wrappedOk = '--x: calc(100%\n  - 0rem);';
  assert.equal(findZeroMisuse(wrappedOk, ZERO_UNIT_IN_MATH).length, 0, 'wrapped 0rem is sanctioned');
  assert.equal(findZeroMisuse(wrappedOk, ZERO_WITH_UNIT).length, 0, 'and is not a bare zero');
});

test('findZeroMisuse reports the 1-based line and the trimmed source line', () => {
  const css = 'a: 0\nb: 1px\n--tracking-normal: 0em;';
  const hits = findZeroMisuse(css, ZERO_WITH_UNIT);
  assert.equal(hits.length, 1);
  assert.deepEqual(hits[0], { line: '--tracking-normal: 0em;', n: 3 });
});

test('assertNoZeroWithUnit passes on a clean stylesheet and is a no-op', () => {
  assert.doesNotThrow(() => assertNoZeroWithUnit(':root { margin: 0; width: calc(100% - 0rem); }'));
});

test('assertNoZeroWithUnit names the artifact and the offending token', () => {
  let err;
  try {
    assertNoZeroWithUnit('--tracking-normal: 0em;', 'globals.scss');
  } catch (e) {
    err = e;
  }
  assert.ok(err, 'expected a throw');
  assert.match(err.message, /globals\.scss:1/, 'honest, parametrized artifact name');
  assert.match(err.message, /--tracking-normal/, 'names the token to fix');
  assert.doesNotMatch(err.message, /globals\.css/, 'no hardcoded globals.css leak');
});

test('the one-level nesting limit is pinned (mirror of the webkit engine)', () => {
  // A zero ≥2 calls deep falls back to the bare-zero check, by documented design.
  const css = 'width: calc(min(max(1px, 2px), 3px) - 0px)';
  assert.ok(isBare(css), 'expected the depth-limited fallback report');
  assert.ok(!inMath(css), 'zero-unit-in-calc cannot see this deep');
});

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { compileThemeVars } from '../src/scripts/compile-theme.js';

const LEVELS = ['critical', 'high', 'medium', 'low', 'info'].map((level) => `--severity-${level}`);

const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const vars = compileThemeVars();

for (const variant of ['light', 'dark']) {
  test(`${variant}: every severity level resolves to a hex color`, () => {
    for (const name of LEVELS) {
      assert.match(vars[variant][name] ?? '', /^#[0-9a-f]{6}$/i, `${name} unresolved in ${variant}`);
    }
  });

  test(`${variant}: the five levels are five distinct colors`, () => {
    const values = LEVELS.map((name) => vars[variant][name].toUpperCase());
    assert.equal(new Set(values).size, LEVELS.length);
  });

  test(`${variant}: every level clears 3:1 on the canvas and the surface`, () => {
    for (const name of LEVELS) {
      for (const surface of ['--bg-canvas', '--bg-surface']) {
        const ratio = contrast(vars[variant][name], vars[variant][surface]);
        assert.ok(ratio >= 3, `${name} on ${surface} (${variant}) is ${ratio.toFixed(2)}:1`);
      }
    }
  });
}

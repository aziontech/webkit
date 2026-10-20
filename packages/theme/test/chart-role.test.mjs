import { test } from 'node:test';
import assert from 'node:assert/strict';

import { compileThemeVars } from '../src/scripts/compile-theme.js';

const SERIES = [1, 2, 3, 4, 5, 6].map((n) => `--chart-series-${n}`);
const CHROME = [
  '--chart-series-other',
  '--chart-grid',
  '--chart-axis',
  '--chart-label',
  '--chart-crosshair',
  '--chart-tooltip-bg',
  '--chart-tooltip-text',
  '--chart-tooltip-muted',
  '--chart-status-success',
  '--chart-status-warning',
  '--chart-status-danger',
  '--chart-status-info',
  '--chart-diverging-negative',
  '--chart-diverging-neutral',
  '--chart-diverging-positive',
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => `--chart-sequential-${n}`),
];

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
  test(`${variant}: every chart token resolves to a hex color`, () => {
    for (const name of [...SERIES, ...CHROME]) {
      assert.match(vars[variant][name] ?? '', /^#[0-9a-f]{6}$/i, `${name} unresolved in ${variant}`);
    }
  });

  test(`${variant}: series and Other marks clear 3:1 on the chart surfaces and the tooltip`, () => {
    const surfaces = ['--bg-surface', '--bg-canvas', '--chart-tooltip-bg'];
    for (const name of [...SERIES, '--chart-series-other']) {
      for (const surface of surfaces) {
        const ratio = contrast(vars[variant][name], vars[variant][surface]);
        assert.ok(ratio >= 3, `${name} on ${surface} (${variant}) is ${ratio.toFixed(2)}:1`);
      }
    }
  });

  test(`${variant}: the six series slots are six distinct colors`, () => {
    const values = SERIES.map((name) => vars[variant][name].toUpperCase());
    assert.equal(new Set(values).size, SERIES.length);
  });

  test(`${variant}: tooltip text and muted ink clear 4.5:1 on the tooltip`, () => {
    for (const name of ['--chart-tooltip-text', '--chart-tooltip-muted']) {
      const ratio = contrast(vars[variant][name], vars[variant]['--chart-tooltip-bg']);
      assert.ok(ratio >= 4.5, `${name} (${variant}) is ${ratio.toFixed(2)}:1`);
    }
  });
}

test('the series order is identical in both themes so a series keeps its hue across a theme switch', () => {
  const hue = (hex) => {
    const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;
    if (d === 0) return 0;
    const h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return Math.round((h * 60 + 360) % 360);
  };
  for (const name of SERIES) {
    const delta = Math.abs(hue(vars.light[name]) - hue(vars.dark[name]));
    assert.ok(Math.min(delta, 360 - delta) <= 20, `${name} changes hue family between themes`);
  }
});

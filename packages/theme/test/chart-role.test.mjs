import { test } from 'node:test';
import assert from 'node:assert/strict';

import { compileThemeVars } from '../src/tokens/theme-colors.js';

const SERIES = [1, 2, 3, 4, 5, 6, 7, 8].map((n) => `--chart-series-${n}`);
const STATUS = ['success', 'warning', 'danger', 'info'].map((s) => `--chart-status-${s}`);
const DIVERGING = [
  '--chart-diverging-negative',
  '--chart-diverging-negative-2',
  '--chart-diverging-negative-3',
  '--chart-diverging-neutral',
  '--chart-diverging-positive-3',
  '--chart-diverging-positive-2',
  '--chart-diverging-positive',
];
const DIVERGING_MARKS = DIVERGING.filter((name) => name !== '--chart-diverging-neutral');
const CHROME = [
  '--chart-series-other',
  '--chart-grid',
  '--chart-axis',
  '--chart-label',
  '--chart-crosshair',
  '--chart-tooltip-bg',
  '--chart-tooltip-text',
  '--chart-tooltip-muted',
  '--chart-tooltip-border',
  '--chart-status-success',
  '--chart-status-warning',
  '--chart-status-danger',
  '--chart-status-info',
  ...DIVERGING,
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

const saturation = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  return max === min ? 0 : (max - min) / (1 - Math.abs(2 * l - 1));
};

const oklab = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
};
const distance = (a, b) => {
  const [x, y] = [oklab(a), oklab(b)];
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
};
const chroma = (hex) => Math.hypot(...oklab(hex).slice(1));

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

  test(`${variant}: status marks clear 3:1 on the chart surfaces and stay apart from the text ink`, () => {
    const surfaces = ['--bg-surface', '--bg-canvas', '--chart-tooltip-bg'];
    for (const name of STATUS) {
      for (const surface of surfaces) {
        const ratio = contrast(vars[variant][name], vars[variant][surface]);
        assert.ok(ratio >= 3, `${name} on ${surface} (${variant}) is ${ratio.toFixed(2)}:1`);
      }
    }
    for (const name of ['--chart-series-other', ...STATUS]) {
      const ratio = contrast(vars[variant][name], vars[variant]['--text-default']);
      assert.ok(ratio >= 2.5, `${name} against --text-default (${variant}) is ${ratio.toFixed(2)}:1`);
    }
    for (const name of SERIES) {
      const ratio = contrast(vars[variant][name], vars[variant]['--text-default']);
      const chroma = saturation(vars[variant][name]);
      assert.ok(
        ratio >= 2.5 || chroma >= 0.5,
        `${name} against --text-default (${variant}) is ${ratio.toFixed(2)}:1 at saturation ${chroma.toFixed(2)}`,
      );
    }
  });

  test(`${variant}: gridlines sit halfway between the border line and the card surface`, () => {
    const lightness = (hex) => {
      const y = luminance(hex);
      return y > 216 / 24389 ? 116 * Math.cbrt(y) - 16 : (24389 / 27) * y;
    };
    const surface = lightness(vars[variant]['--bg-surface']);
    const border = lightness(vars[variant]['--border-default']);
    const share = (lightness(vars[variant]['--chart-grid']) - surface) / (border - surface);
    assert.ok(share >= 0.4 && share <= 0.6, `--chart-grid (${variant}) keeps ${share.toFixed(2)} of the border contrast`);
  });

  test(`${variant}: the eight series slots are eight distinct colors`, () => {
    const values = SERIES.map((name) => vars[variant][name].toUpperCase());
    assert.equal(new Set(values).size, SERIES.length);
  });

  test(`${variant}: the six coloured diverging steps clear 3:1 on the chart surfaces`, () => {
    const surfaces = ['--bg-surface', '--bg-canvas', '--chart-tooltip-bg'];
    for (const name of DIVERGING_MARKS) {
      for (const surface of surfaces) {
        const ratio = contrast(vars[variant][name], vars[variant][surface]);
        assert.ok(ratio >= 3, `${name} on ${surface} (${variant}) is ${ratio.toFixed(2)}:1`);
      }
    }
  });

  test(`${variant}: each diverging step stands apart from its neighbours and fades toward the neutral`, () => {
    for (let i = 1; i < DIVERGING.length; i += 1) {
      const [a, b] = [DIVERGING[i - 1], DIVERGING[i]];
      const delta = distance(vars[variant][a], vars[variant][b]);
      assert.ok(delta >= 0.05, `${a} and ${b} (${variant}) are only ${delta.toFixed(3)} apart in OKLab`);
    }
    for (const side of ['negative', 'positive']) {
      const steps = [`--chart-diverging-${side}`, `--chart-diverging-${side}-2`, `--chart-diverging-${side}-3`];
      const values = steps.map((name) => chroma(vars[variant][name]));
      assert.ok(
        values[0] > values[1] && values[1] > values[2],
        `${side} chroma (${variant}) does not fall toward the neutral: ${values.map((v) => v.toFixed(3)).join(', ')}`,
      );
    }
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

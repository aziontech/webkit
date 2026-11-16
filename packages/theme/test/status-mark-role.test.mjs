import { test } from 'node:test';
import assert from 'node:assert/strict';

import { compileThemeVars } from '../src/tokens/theme-colors.js';

const STATUSES = ['success', 'warning', 'danger', 'info'];
const MARKS = STATUSES.map((s) => `--${s}-mark`);
const ICON_MARKS = ['--success-mark', '--warning-mark', '--danger-mark'];
const SURFACES = ['--bg-canvas', '--bg-surface', '--bg-surface-raised'];

const channel = (hex, i) => parseInt(hex.slice(i, i + 2), 16) / 255;
const luminance = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = channel(hex, i);
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const screenY = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => channel(hex, i) ** 2.4);
  return 0.2126729 * r + 0.7151522 * g + 0.072175 * b;
};
const apca = (text, background) => {
  const clamp = (y) => (y > 0.022 ? y : y + (0.022 - y) ** 1.414);
  const yt = clamp(screenY(text));
  const yb = clamp(screenY(background));
  if (yb > yt) {
    const s = (yb ** 0.56 - yt ** 0.57) * 1.14;
    return s < 0.1 ? 0 : (s - 0.027) * 100;
  }
  const s = (yb ** 0.65 - yt ** 0.62) * 1.14;
  return s > -0.1 ? 0 : -(s + 0.027) * 100;
};

const vars = compileThemeVars();

for (const variant of ['light', 'dark']) {
  const v = vars[variant];

  test(`${variant}: every status mark resolves to a hex color`, () => {
    for (const name of MARKS) {
      assert.match(v[name] ?? '', /^#[0-9a-f]{6}$/i, `${name} unresolved in ${variant}`);
    }
  });

  test(`${variant}: a status mark is a solid mark on every surface (3:1, APCA Lc 30)`, () => {
    for (const name of MARKS) {
      for (const surface of SURFACES) {
        const ratio = contrast(v[name], v[surface]);
        const lc = apca(v[name], v[surface]);
        assert.ok(ratio >= 3, `${name} on ${surface} (${variant}) is ${ratio.toFixed(2)}:1`);
        assert.ok(lc >= 30, `${name} on ${surface} (${variant}) is Lc ${lc.toFixed(1)}`);
      }
    }
  });

  test(`${variant}: a status mark reads as its hue, apart from the text ink`, () => {
    for (const name of MARKS) {
      const ratio = contrast(v[name], v['--text-default']);
      assert.ok(ratio >= 2.5, `${name} against --text-default (${variant}) is ${ratio.toFixed(2)}:1`);
    }
  });

  test(`${variant}: an outcome glyph in --text-contrast reads on its mark disc (3:1, APCA Lc 45)`, () => {
    for (const name of ICON_MARKS) {
      const ratio = contrast(v['--text-contrast'], v[name]);
      const lc = apca(v['--text-contrast'], v[name]);
      assert.ok(ratio >= 3, `--text-contrast on ${name} (${variant}) is ${ratio.toFixed(2)}:1`);
      assert.ok(lc >= 45, `--text-contrast on ${name} (${variant}) is Lc ${lc.toFixed(1)}`);
    }
    for (const name of ICON_MARKS) {
      for (const surface of SURFACES) {
        const lc = apca(v[name], v[surface]);
        assert.ok(lc >= 45, `${name} disc on ${surface} (${variant}) is Lc ${lc.toFixed(1)}`);
      }
    }
  });
}

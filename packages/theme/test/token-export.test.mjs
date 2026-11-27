import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { shape } from '../src/tokens/primitives/shape/shape.js';
import { code } from '../src/tokens/semantic/code.js';
import { layout } from '../src/tokens/semantic/layout.js';
import { spacing } from '../src/tokens/semantic/spacing.js';
import { typography } from '../src/tokens/semantic/typography.js';
import { zIndex } from '../src/tokens/semantic/z-index.js';
import { compileThemeVars } from '../src/tokens/theme-colors.js';
import { buildTokenExport } from '../src/tokens/token-export.js';
import { tokenPurpose } from '../src/tokens/token-purpose.js';

const exported = buildTokenExport();
const byName = new Map(exported.tokens.map((t) => [t.name, t]));
const vars = compileThemeVars();
const globals = readFileSync(new URL('../dist/globals.css', import.meta.url), 'utf8');

const semanticNames = [
  ...Object.keys(vars.light),
  ...[spacing, layout, zIndex, code, shape].flatMap((group) => Object.keys(group).map((k) => `--${k}`)),
  ...Object.keys(typography),
];

test('every semantic token is in the export exactly once', () => {
  assert.equal(byName.size, exported.tokens.length, 'a token name repeats in the export');
  assert.deepEqual([...byName.keys()].sort(), [...new Set(semanticNames)].sort());
});

test('every exported token has a one-line purpose, and no purpose names a token that is gone', () => {
  for (const token of exported.tokens) {
    assert.equal(typeof token.purpose, 'string', `${token.name} has no purpose`);
    assert.ok(token.purpose.length >= 10 && token.purpose.length <= 120, `${token.name} purpose length ${token.purpose.length}`);
    assert.ok(!/\n/.test(token.purpose), `${token.name} purpose spans lines`);
    assert.match(token.purpose, /^[A-Z].*\.$/, `${token.name} purpose is not a sentence`);
  }
  for (const name of Object.keys(tokenPurpose)) {
    assert.ok(byName.has(name), `tokenPurpose names ${name}, which the theme no longer ships`);
  }
});

test('colour tokens carry the resolved light and dark values the theme compiles', () => {
  for (const name of Object.keys(vars.light)) {
    const token = byName.get(name);
    assert.equal(token.type, 'color');
    assert.equal(token.light, vars.light[name], `${name} light`);
    assert.equal(token.dark, vars.dark[name], `${name} dark`);
    assert.match(token.light, /^#[0-9a-f]{6}([0-9a-f]{2})?$/i, `${name} light is not a hex`);
    assert.match(token.dark, /^#[0-9a-f]{6}([0-9a-f]{2})?$/i, `${name} dark is not a hex`);
    for (const target of Object.values(token.alias || {})) {
      assert.ok(byName.has(target), `${name} aliases ${target}, which is not exported`);
    }
  }
});

test('every exported custom property is emitted in dist/globals.css', () => {
  for (const token of exported.tokens.filter((t) => t.name.startsWith('--'))) {
    assert.ok(globals.includes(`${token.name}:`), `${token.name} is exported but not in dist/globals.css`);
  }
  for (const token of exported.tokens.filter((t) => t.type === 'typography')) {
    assert.ok(globals.includes(`@utility ${token.name} {`), `${token.name} is not a utility in dist/globals.css`);
  }
});

test('theme-invariant tokens carry a base value and only real breakpoints', () => {
  for (const token of exported.tokens.filter((t) => t.type !== 'color')) {
    assert.ok(token.value != null && token.value !== '', `${token.name} has no value`);
    for (const bp of Object.keys(token.breakpoints || {})) {
      assert.ok(['sm', 'md', 'lg', 'xl', '2xl'].includes(bp), `${token.name} has breakpoint ${bp}`);
    }
  }
});

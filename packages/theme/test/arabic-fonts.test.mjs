import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { fontFamily } from '../src/tokens/primitives/typography/font-family.js';

const fontsCss = await readFile(new URL('../dist/fonts.css', import.meta.url), 'utf8');
const globalsCss = await readFile(new URL('../dist/globals.css', import.meta.url), 'utf8');

test('the sans stack falls back to an Arabic-capable face right after Rubik and its Latin fallback', () => {
  const stack = fontFamily.sans.split(',').map((name) => name.trim().replace(/^'|'$/g, ''));
  assert.equal(stack[0], 'Rubik');
  assert.equal(stack[1], 'Rubik Fallback');
  assert.equal(stack[2], 'Noto Sans Arabic');
  const fallback = fontsCss.match(/@font-face\s*{[^}]*'Rubik Fallback'[^}]*}/)?.[0] ?? '';
  assert.doesNotMatch(fallback, /U\+06/);
  assert.equal(stack.at(-1), 'sans-serif');
});

test('Noto Sans Arabic is declared, limited to the Arabic ranges', () => {
  const face = fontsCss.match(/@font-face\s*{[^}]*'Noto Sans Arabic'[^}]*}/)?.[0] ?? '';
  assert.match(face, /url\('\.\.\/fonts\/noto-sans-arabic\/[^']+\.woff2'\)/);
  assert.match(face, /unicode-range:[^;]*U\+0600-06FF/);
});

test('Arabic, Persian and Urdu text get a taller default line height, even without the font file', () => {
  assert.match(globalsCss, /:where\(:lang\(ar\), :lang\(fa\), :lang\(ur\)\)\s*{\s*line-height:/);
});

test('the font faces ship in their own entry, so an app that hosts its fonts can skip them', () => {
  assert.doesNotMatch(globalsCss, /@font-face/);
  assert.match(fontsCss, /font-family: Rubik;/);
});

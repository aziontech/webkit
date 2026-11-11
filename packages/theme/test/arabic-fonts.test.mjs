import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { fontFamily } from '../src/tokens/primitives/typography/font-family.js';

const fontsCss = await readFile(new URL('../src/tokens/primitives/fonts.css', import.meta.url), 'utf8');

test('the sans stack falls back to an Arabic-capable face right after Rubik', () => {
  const stack = fontFamily.sans.split(',').map((name) => name.trim().replace(/^'|'$/g, ''));
  assert.equal(stack[0], 'Rubik');
  assert.equal(stack[1], 'Noto Sans Arabic');
  assert.equal(stack.at(-1), 'sans-serif');
});

test('Noto Sans Arabic is declared, limited to the Arabic ranges', () => {
  const face = fontsCss.match(/@font-face\s*{[^}]*'Noto Sans Arabic'[^}]*}/)?.[0] ?? '';
  assert.match(face, /cdn\.jsdelivr\.net\/gh\/google\/fonts@main\/ofl\/notosansarabic\//);
  assert.match(face, /unicode-range:[^;]*U\+0600-06FF/);
});

test('Arabic, Persian and Urdu text get a taller default line height', () => {
  assert.match(fontsCss, /:where\(:lang\(ar\), :lang\(fa\), :lang\(ur\)\)\s*{\s*line-height:/);
});

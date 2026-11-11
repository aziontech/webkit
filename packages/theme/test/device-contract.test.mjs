import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { breakpoints } from '../src/tokens/primitives/breakpoints.js';
import { container } from '../src/tokens/primitives/shape/container.js';

const css = readFileSync(new URL('../dist/v4/globals.css', import.meta.url), 'utf8');
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

test('the viewport breakpoints are the documented five', () => {
  assert.deepEqual(breakpoints, {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  });
});

test('every breakpoint and container size ships in the stylesheet Tailwind reads', () => {
  for (const [name, value] of Object.entries(breakpoints)) {
    assert.match(css, new RegExp(`--breakpoint-${name}: ${value};`));
  }
  for (const [name, value] of Object.entries(container)) {
    assert.match(css, new RegExp(`--container-${name}: ${value};`));
  }
});

test('the README documents every size of both scales', () => {
  for (const [name, value] of Object.entries(breakpoints)) {
    assert.ok(readme.includes(`--breakpoint-${name}`), name);
    assert.ok(readme.includes(`${parseInt(value, 10)} px`), value);
  }
  for (const [name, value] of Object.entries(container)) {
    assert.ok(readme.includes(`\`@${name}\``), name);
    assert.ok(readme.includes(`${parseInt(value, 10)} px`), value);
  }
});

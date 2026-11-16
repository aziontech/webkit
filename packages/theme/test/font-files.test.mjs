import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fontFamily } from '../src/tokens/primitives/typography/font-family.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const fontsEntry = join(ROOT, pkg.exports['./fonts.css'].default);
const fontsCss = readFileSync(fontsEntry, 'utf8');
const faces = fontsCss.match(/@font-face\s*{[^}]*}/g) ?? [];
const urlsOf = (face) => [...face.matchAll(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g)].map((m) => m[2]);

const published = (rel) =>
  pkg.files.some((entry) => rel === entry.replace(/\/$/, '') || rel.startsWith(entry));

test('fonts.css declares faces', () => {
  assert.ok(faces.length > 0);
});

test('every @font-face src is a relative woff2 file that ships in the package', () => {
  for (const face of faces) {
    const urls = urlsOf(face);
    assert.ok(urls.length > 0, `a face without a url: ${face}`);
    for (const url of urls) {
      assert.doesNotMatch(url, /^(https?:)?\/\//, `fonts must ship in the package, not load from ${url}`);
      assert.match(url, /\.woff2$/, `${url}: woff2 only`);
      const file = resolve(dirname(fontsEntry), url);
      assert.ok(existsSync(file) && statSync(file).isFile(), `${url} does not resolve to a file`);
      const rel = file.slice(ROOT.length + 1);
      assert.ok(published(rel), `${rel} is not in package.json#files`);
      const magic = readFileSync(file).subarray(0, 4).toString('latin1');
      assert.equal(magic, 'wOF2', `${rel} is not a woff2 file`);
    }
  }
});

test('every shipped font folder carries its open font license', () => {
  const dir = join(ROOT, 'fonts');
  for (const family of readdirSync(dir)) {
    const license = join(dir, family, 'OFL.txt');
    assert.ok(existsSync(license), `fonts/${family} has no OFL.txt`);
    assert.match(readFileSync(license, 'utf8'), /SIL Open Font License, Version 1\.1/);
  }
});

test('every shipped font file is referenced by fonts.css', () => {
  const dir = join(ROOT, 'fonts');
  const referenced = new Set(faces.flatMap(urlsOf).map((url) => resolve(dirname(fontsEntry), url)));
  for (const family of readdirSync(dir)) {
    for (const file of readdirSync(join(dir, family)).filter((name) => name.endsWith('.woff2'))) {
      assert.ok(referenced.has(join(dir, family, file)), `fonts/${family}/${file} is never used`);
    }
  }
});

test('the first face of the sans and code stacks is declared', () => {
  for (const stack of [fontFamily.sans, fontFamily.code]) {
    const first = stack.split(',')[0].trim().replace(/^'|'$/g, '');
    const pattern = new RegExp(`font-family: '?${first}'?;`);
    assert.match(fontsCss, pattern, `${first} has no @font-face`);
  }
});

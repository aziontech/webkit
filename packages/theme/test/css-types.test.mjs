import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));

const cssEntries = Object.entries(pkg.exports).filter(([, target]) =>
  String(typeof target === 'string' ? target : target.default).endsWith('.css'),
);

test('every CSS entry declares types, so a side-effect import type-checks (TS2882)', () => {
  assert.ok(cssEntries.length > 0);
  for (const [key, target] of cssEntries) {
    assert.equal(typeof target, 'object', `${key} must be { types, default }`);
    assert.deepEqual(Object.keys(target), ['types', 'default'], `${key}: types comes first`);
    assert.match(target.types, /\.d\.ts$/, key);
    const declaration = join(ROOT, target.types);
    assert.ok(existsSync(declaration), `${key}: ${target.types} is missing`);
    assert.equal(readFileSync(declaration, 'utf8'), 'export {};\n', `${key}: an empty module`);
  }
  assert.equal(pkg.types, pkg.exports['.'].types);
});

test('the declarations ship: they sit in a published folder and the token build writes them', () => {
  const build = readFileSync(join(ROOT, 'src/scripts/build-tokens.mjs'), 'utf8');
  for (const [, target] of cssEntries) {
    const rel = target.types.replace(/^\.\//, '');
    assert.ok(
      pkg.files.some((f) => rel.startsWith(f.replace(/\/?$/, '/'))),
      `${rel} is outside files`,
    );
    const name = rel.split('/').pop();
    assert.ok(build.includes(`'${name}'`), `build-tokens.mjs does not write ${name}`);
  }
});

import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = (path) => JSON.parse(readFileSync(resolve(PKG_ROOT, path), 'utf8'))

test('webkit declares the icon package its components render as a peer, at the workspace major', () => {
  const webkit = read('package.json')
  const icons = read('../icons/package.json')
  const range = webkit.peerDependencies?.['@aziontech/icons']
  assert.ok(range, 'peerDependencies is missing @aziontech/icons')
  assert.equal(webkit.peerDependenciesMeta?.['@aziontech/icons']?.optional, undefined)
  const alternatives = range.split(' || ').map((part) => /^\^(\d+)\.(\d+)\.(\d+)$/.exec(part))
  assert.ok(alternatives.every(Boolean), `expected caret ranges joined by ||, got ${range}`)
  const [major, minor, patch] = icons.version.split('.').map(Number)
  assert.ok(
    alternatives.some(
      (match) =>
        Number(match[1]) === major &&
        (Number(match[2]) < minor || (Number(match[2]) === minor && Number(match[3]) <= patch))
    ),
    `${range} does not accept the workspace version ${icons.version}`
  )
  assert.equal(webkit.devDependencies?.['@aziontech/icons'], 'workspace:^')
})

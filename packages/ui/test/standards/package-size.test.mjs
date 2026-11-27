import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = join(dirname(fileURLToPath(import.meta.url)), '../..')
const budget = JSON.parse(readFileSync(join(PKG, 'scripts/package-size-budget.json'), 'utf-8'))

const [pack] = JSON.parse(
  execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
    cwd: PKG,
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'ignore'],
    maxBuffer: 64 * 1024 * 1024
  })
)

const isGenerated = (path) => budget.generated.some((prefix) => path.startsWith(prefix))
const shipped = pack.files.filter((file) => !isGenerated(file.path))
const generatedPresent = shipped.length !== pack.files.length
const sum = (files) => files.reduce((total, file) => total + file.size, 0)

function largest(files, count = 10) {
  const byFolder = new Map()
  for (const { path, size } of files) {
    const folder = path.split('/').slice(0, 3).join('/')
    byFolder.set(folder, (byFolder.get(folder) ?? 0) + size)
  }
  return [...byFolder]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([folder, size]) => `${(size / 1e6).toFixed(2)} MB ${folder}`)
    .join('\n  ')
}

test('the packed source stays under its unpacked size budget', () => {
  const unpacked = sum(shipped)
  assert.ok(
    unpacked <= budget.unpackedBytes,
    `@aziontech/ui unpacks to ${unpacked} bytes, over the ${budget.unpackedBytes} budget in scripts/package-size-budget.json. Largest folders:\n  ${largest(shipped)}`
  )
})

test('the tarball stays under its packed size budget', { skip: generatedPresent }, () => {
  assert.ok(
    pack.size <= budget.packedBytes,
    `@aziontech/ui packs to ${pack.size} bytes, over the ${budget.packedBytes} budget in scripts/package-size-budget.json`
  )
})

test('each asset folder stays under its own budget', () => {
  for (const [prefix, limit] of Object.entries(budget.files)) {
    const size = sum(shipped.filter((file) => file.path.startsWith(prefix)))
    assert.ok(size <= limit, `${prefix} ships ${size} bytes, over its ${limit} budget`)
  }
})

test('the package ships no dev-only files', () => {
  const devOnly =
    /(\.test\.[cm]?[jt]s|\.figma\.ts|\.d\.ts\.map|\.map)$|(^|\/)(__snapshots__|__screenshots__|fixtures)\/|^src\/test\//
  assert.deepEqual(
    pack.files.map((file) => file.path).filter((path) => devOnly.test(path)),
    []
  )
})

import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PACKAGES = join(dirname(fileURLToPath(import.meta.url)), '../../..')
const PUBLISHED = ['webkit', 'webkit-mcp', 'theme', 'icons']

function packedFiles(dir) {
  const [pack] = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--ignore-scripts', '--json'], {
      cwd: dir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'ignore'],
      maxBuffer: 64 * 1024 * 1024
    })
  )
  return pack.files.map((file) => file.path)
}

for (const name of PUBLISHED) {
  test(`@aziontech/${name} ships the MIT license text its package.json declares`, () => {
    const dir = join(PACKAGES, name)
    const manifest = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf-8'))
    assert.equal(manifest.license, 'MIT')
    assert.match(
      readFileSync(join(dir, 'LICENSE'), 'utf-8'),
      /MIT License[\s\S]*Azion Technologies/
    )
    assert.ok(
      packedFiles(dir).includes('LICENSE'),
      `npm pack of @aziontech/${name} lists no LICENSE`
    )
  })
}

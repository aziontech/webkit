import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))

const BUILD_TOOLS = ['fantasticon', 'ttf2woff2', 'svgicons2svgfont', 'svgo', 'handlebars']

const packed = () => {
  const out = execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore']
  })
  return JSON.parse(out)[0].files.map((file) => file.path)
}

test('the package has no runtime dependencies: it ships prebuilt CSS, a woff2 and JSON', () => {
  assert.deepEqual(Object.keys(pkg.dependencies ?? {}), [])
  assert.deepEqual(Object.keys(pkg.peerDependencies ?? {}), [])
})

test('the font build tools are dev dependencies', () => {
  for (const tool of BUILD_TOOLS) {
    assert.ok(!(tool in (pkg.dependencies ?? {})), `${tool} must not be a runtime dependency`)
  }
  assert.ok('fantasticon' in (pkg.devDependencies ?? {}))
})

test('the tarball holds only the built files, the license and the readme', () => {
  const allowed = new Set(['package.json', 'LICENSE', 'README.md'])
  const files = packed()
  assert.ok(files.includes('package.json'))
  for (const file of files) {
    assert.ok(
      allowed.has(file) || file.startsWith('dist/'),
      `${file} is a build input or log and must not be published`
    )
    assert.notEqual(file, 'dist/package.json', 'a nested manifest would shadow the real one')
  }
})

test('every export points into a published folder', () => {
  const targets = Object.values(pkg.exports).flatMap((target) =>
    typeof target === 'string' ? [target] : Object.values(target)
  )
  for (const target of [...targets, pkg.main, pkg.types, pkg.style]) {
    assert.match(target, /^\.\/dist\//, `${target} is outside dist/`)
  }
})

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'))
const manifest = JSON.parse(readFileSync(join(ROOT, 'src/icons.json'), 'utf8'))
const colorNames = manifest.icons.filter((i) => i.set === 'color').map((i) => `az-${i.name}`)

const built = (() => {
  const dir = mkdtempSync(join(tmpdir(), 'icons-color-css-'))
  try {
    execFileSync('node', [join(ROOT, 'scripts/build-color-css.mjs')], { cwd: dir, stdio: 'ignore' })
    return {
      all: readFileSync(join(dir, 'dist/azionicons-color.css'), 'utf8'),
      utilities: readFileSync(join(dir, 'dist/azionicons-color-utilities.css'), 'utf8')
    }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
})()

test('the default entry is the font only; the colour logos are opt-in exports', () => {
  const build = readFileSync(join(ROOT, 'scripts/build-icons.mjs'), 'utf8')
  const barrel = build.match(/const barrelContent = `([^`]*)`/)[1]
  assert.match(barrel, /azionicons\.css/)
  assert.doesNotMatch(barrel, /azionicons-color/)
  assert.equal(pkg.exports['./azionicons-color'].default, './dist/azionicons-color.css')
  assert.equal(
    pkg.exports['./azionicons-color-utilities'].default,
    './dist/azionicons-color-utilities.css'
  )
})

test('every colour logo is one Tailwind utility, so only the used ones compile', () => {
  const utilities = [...built.utilities.matchAll(/^@utility (az-[a-z0-9-]+) \{/gm)].map((m) => m[1])
  assert.deepEqual(utilities.sort(), [...colorNames].sort())
  assert.match(built.utilities, /^\.az-color \{/m)
})

test('a theme-aware logo keeps its dark ink in the utility', () => {
  const inked = colorNames.filter((name) =>
    new RegExp(`\\[data-theme=dark\\] \\.az-color\\.${name}[ ,]`).test(built.all)
  )
  assert.ok(inked.length > 0)
  for (const name of inked) {
    const block = built.utilities.split(`@utility ${name} {`)[1].split('\n}\n')[0]
    assert.match(block, /:is\(\[data-theme=dark\], \.dark\) &\.az-color \{/, name)
  }
})

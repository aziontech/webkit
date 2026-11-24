import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const sfcs = (dir) =>
  readdirSync(join(PKG, dir), { recursive: true })
    .filter((file) => String(file).endsWith('.vue'))
    .map((file) => join(PKG, dir, String(file)))

const files = [...sfcs('src/assets'), ...sfcs('src/svg')]

test('the asset and svg SFCs exist to check', () => {
  assert.ok(files.length > 50, `found only ${files.length}`)
})

test('every asset and svg SFC names itself in defineOptions', () => {
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    assert.match(source, /defineOptions\(\{\s*name: '[A-Z][A-Za-z0-9]*'/, relative(PKG, file))
  }
})

test('an asset SFC with props declares an exported Props interface named after it', () => {
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    if (!source.includes('defineProps')) continue
    const name = source.match(/defineOptions\(\{\s*name: '([A-Za-z0-9]+)'/)?.[1]
    const rel = relative(PKG, file)
    assert.ok(
      source.includes(`export interface ${name}Props {`),
      `${rel}: export interface ${name}Props`
    )
    assert.ok(source.includes(`defineProps<${name}Props>()`), `${rel}: defineProps<${name}Props>()`)
    assert.ok(!/\binterface Props\b/.test(source), `${rel}: a bare Props interface`)
  }
})

test('an asset SFC test id falls back to its own file name, with no category', () => {
  for (const file of files) {
    const source = readFileSync(file, 'utf8')
    const fallback = source.match(
      /attrs\['data-testid'\] as string(?: \| undefined)?\) \?\? '([^']+)'/
    )?.[1]
    if (!fallback) continue
    const own = basename(file, '.vue')
    assert.equal(fallback, own, `${relative(PKG, file)} falls back to ${fallback}`)
  }
})

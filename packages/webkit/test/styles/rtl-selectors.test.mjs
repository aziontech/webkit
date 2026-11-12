import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const THEME_SRC = join(PKG_ROOT, '..', 'theme', 'src')
const STYLES = join(PKG_ROOT, 'src', 'styles.css')
const requireFromWebkit = createRequire(join(PKG_ROOT, 'package.json'))

const flipped = [...new Set(readFileSync(STYLES, 'utf8').match(/\.(?:pi|ai)-[a-z-]+/g))]

async function buildConsumerCss() {
  const { build } = await import(requireFromWebkit.resolve('vite'))
  const { default: tailwindcss } = await import(requireFromWebkit.resolve('@tailwindcss/vite'))
  const dir = mkdtempSync(join(tmpdir(), 'webkit-rtl-'))
  try {
    writeFileSync(
      join(dir, 'app.css'),
      `@import '${requireFromWebkit.resolve('tailwindcss/index.css')}';\n@import '${STYLES}';\n`
    )
    writeFileSync(join(dir, 'main.js'), "import './app.css'\n")
    writeFileSync(
      join(dir, 'index.html'),
      '<!doctype html><html><body><script type="module" src="./main.js"></script></body></html>'
    )
    const result = await build({
      root: dir,
      configFile: false,
      logLevel: 'silent',
      plugins: [tailwindcss()],
      build: { write: false, outDir: join(dir, 'dist') }
    })
    const outputs = (Array.isArray(result) ? result : [result]).flatMap((r) => r.output)
    return outputs
      .filter((o) => o.fileName.endsWith('.css'))
      .map((o) => String(o.source))
      .join('\n')
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

function rulesWith(css, declaration) {
  return css
    .split('}')
    .filter((chunk) => chunk.includes(declaration))
    .map((chunk) => chunk.slice(0, chunk.lastIndexOf('{')))
}

test('styles.css flips at least the chevrons and arrows', () => {
  for (const name of ['.pi-chevron-right', '.pi-arrow-left', '.ai-chevron-left', '.ai-arrow-right']) {
    assert.ok(flipped.includes(name), `${name} is not in the flip list`)
  }
})

test('the RTL icon flip survives a consumer Vite + Tailwind build keyed on the dir attribute', async () => {
  const css = await buildConsumerCss()
  const selectors = rulesWith(css, 'scale:-1 1').join(',')
  assert.ok(selectors, 'no scale:-1 1 rule in the built CSS')
  for (const name of flipped) {
    assert.ok(selectors.includes(name), `${name} lost from the flip rule`)
  }
  assert.match(selectors, /\[dir=["']?rtl["']?\]/, 'the flip rule is not keyed on [dir=rtl]')
  assert.doesNotMatch(
    selectors,
    /:lang\(|:dir\(/,
    'the flip rule depends on :dir()/:lang(), which a consumer build turns into a language list'
  )

  const rtlUtility = css.match(/\.rtl\\:[^{]*\{/)
  assert.ok(rtlUtility, 'no rtl: utility compiled from the components')
  assert.match(rtlUtility[0], /\[dir=["']?rtl["']?\]/, 'the rtl: variant lost its [dir=rtl] branch')
})

function walk(dir, exts, out = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) walk(path, exts, out)
    else if (exts.some((ext) => path.endsWith(ext)) && !/\.test\.[jt]s$/.test(path)) out.push(path)
  }
  return out
}

test('no source stylesheet or component keys styles on :dir()', () => {
  const files = [
    ...walk(join(PKG_ROOT, 'src'), ['.css', '.vue', '.ts', '.js']),
    ...walk(THEME_SRC, ['.css', '.js', '.mjs', '.ts'])
  ]
  const offenders = files
    .filter((file) => /:dir\((?:rtl|ltr)\)/.test(readFileSync(file, 'utf8')))
    .map((file) => relative(join(PKG_ROOT, '..'), file))
  assert.deepEqual(
    offenders,
    [],
    'use [dir=rtl] or the rtl: variant: a consumer build compiles :dir(rtl) into :lang(ar, he, …)'
  )
})

#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const ROOTS = ['src/components', 'src/composables', 'src/utils']

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, out)
    else if (name.endsWith('.js') && !name.endsWith('.test.js')) out.push(path)
  }
  return out
}

export function runtimeJsFiles() {
  return ROOTS.flatMap((root) => walk(resolve(PKG, root))).sort()
}

function loadTypeScript() {
  const require = createRequire(join(PKG, 'package.json'))
  const vueTsc = require.resolve('vue-tsc/package.json')
  return createRequire(vueTsc)('typescript')
}

export function buildDeclarations(files = runtimeJsFiles()) {
  const ts = loadTypeScript()
  const out = new Map()
  const program = ts.createProgram(files, {
    allowJs: true,
    declaration: true,
    emitDeclarationOnly: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    lib: ['lib.esnext.d.ts', 'lib.dom.d.ts', 'lib.dom.iterable.d.ts'],
    rootDir: resolve(PKG, 'src'),
    outDir: resolve(PKG, '.js-dts')
  })
  const result = program.emit(undefined, (name, text) => {
    out.set(resolve(PKG, 'src', relative(resolve(PKG, '.js-dts'), resolve(name))), text)
  })
  const errors = result.diagnostics.map((d) => ts.flattenDiagnosticMessageText(d.messageText, '\n'))
  return { out, errors }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  const check = process.argv.includes('--check')
  const files = runtimeJsFiles()
  const { out, errors } = buildDeclarations(files)
  if (errors.length) {
    console.error(errors.join('\n'))
    process.exit(1)
  }
  const stale = []
  for (const file of files) {
    const target = file.replace(/\.js$/, '.d.ts')
    const text = out.get(target)
    if (text === undefined) {
      stale.push(`${relative(PKG, target)} (not emitted)`)
      continue
    }
    const current = existsSync(target) ? readFileSync(target, 'utf8') : null
    if (current === text) continue
    if (check) stale.push(relative(PKG, target))
    else writeFileSync(target, text)
  }
  if (stale.length) {
    console.error(`Declarations for runtime .js modules are stale (${stale.length}):`)
    for (const s of stale) console.error(`  - ${s}`)
    console.error('Run: node scripts/build-js-dts.mjs')
    process.exit(1)
  }
  if (!check) console.log(`Wrote declarations for ${files.length} runtime .js modules.`)
}

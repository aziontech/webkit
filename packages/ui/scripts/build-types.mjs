#!/usr/bin/env node

import { spawnSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync
} from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { buildDeclarations } from './build-js-dts.mjs'
import { CSS_TYPES, TYPES_DIR, exportTarget, typesTargets } from './lib/exports.mjs'

const PKG = resolve(dirname(fileURLToPath(import.meta.url)), '..')

function walk(dir, match, out = []) {
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) walk(path, match, out)
    else if (match(name)) out.push(path)
  }
  return out
}

function emitWithVueTsc(pkgDir) {
  const bin = createRequire(join(pkgDir, 'package.json')).resolve('vue-tsc/bin/vue-tsc.js')
  const res = spawnSync(
    process.execPath,
    [
      bin,
      '--declaration',
      '--emitDeclarationOnly',
      '--rootDir',
      'src',
      '--declarationDir',
      TYPES_DIR
    ],
    { cwd: pkgDir, stdio: 'inherit' }
  )
  if (res.status !== 0) throw new Error(`vue-tsc exited with ${res.status ?? res.signal}`)
}

function untypedJsEntries(pkg, pkgDir) {
  return Object.values(pkg.exports ?? {})
    .map(exportTarget)
    .filter((t) => t.startsWith('./src/') && t.endsWith('.js'))
    .map((t) => join(pkgDir, t))
    .filter((file) => !existsSync(file.replace(/\.js$/, '.d.ts')))
}

function emitJsEntries(files, pkgDir, typesDir) {
  if (!files.length) return 0
  const { out, errors } = buildDeclarations(files)
  if (errors.length) throw new Error(`declarations for .js entries failed:\n${errors.join('\n')}`)
  for (const [file, text] of out) {
    const dest = join(typesDir, relative(join(pkgDir, 'src'), file))
    mkdirSync(dirname(dest), { recursive: true })
    writeFileSync(dest, text)
  }
  return out.size
}

function copyHandWritten(pkgDir, typesDir) {
  const src = join(pkgDir, 'src')
  const files = walk(src, (name) => name.endsWith('.d.ts')).filter((file) =>
    existsSync(file.replace(/\.d\.ts$/, '.js'))
  )
  for (const file of files) cpSync(file, join(typesDir, relative(src, file)))
  return files.length
}

const RELATIVE_IMPORT = /(?:\bfrom\s+|\bimport\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g

export function danglingImports(typesDir) {
  const out = []
  for (const file of walk(typesDir, (name) => name.endsWith('.d.ts'))) {
    for (const [, spec] of readFileSync(file, 'utf8').matchAll(RELATIVE_IMPORT)) {
      const base = resolve(dirname(file), spec)
      const candidates = [`${base}.d.ts`, base.replace(/\.js$/, '.d.ts'), join(base, 'index.d.ts')]
      if (!candidates.some((c) => existsSync(c))) {
        out.push(`${relative(typesDir, file)} imports ${spec}`)
      }
    }
  }
  return out
}

export function cleanTypes(pkgDir = PKG) {
  rmSync(join(pkgDir, TYPES_DIR), { recursive: true, force: true })
}

export function buildTypes(pkgDir = PKG) {
  const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'))
  const typesDir = join(pkgDir, TYPES_DIR)
  cleanTypes(pkgDir)
  emitWithVueTsc(pkgDir)
  const jsCount = emitJsEntries(untypedJsEntries(pkg, pkgDir), pkgDir, typesDir)
  const copied = copyHandWritten(pkgDir, typesDir)
  writeFileSync(join(pkgDir, CSS_TYPES), 'export {}\n')

  const missing = typesTargets(pkg.exports ?? {}).filter((t) => !existsSync(join(pkgDir, t)))
  const dangling = danglingImports(typesDir)
  if (missing.length || dangling.length) {
    const lines = [...missing.map((t) => `missing ${t}`), ...dangling.map((d) => `dangling ${d}`)]
    throw new Error(`declarations are incomplete (${lines.length}):\n  ${lines.join('\n  ')}`)
  }
  const count = walk(typesDir, (name) => name.endsWith('.d.ts')).length
  return { count, jsCount, copied }
}

const invoked = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (invoked) {
  if (process.argv.includes('--clean')) {
    cleanTypes()
    process.stdout.write(`${TYPES_DIR}/ removed\n`)
  } else {
    try {
      const { count, jsCount, copied } = buildTypes()
      process.stdout.write(
        `${TYPES_DIR}/: ${count} declarations (${jsCount} from .js entries, ${copied} hand-written)\n`
      )
    } catch (error) {
      process.stderr.write(`build-types: ${error.message}\n`)
      process.exit(1)
    }
  }
}

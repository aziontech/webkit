import { existsSync, statSync } from 'node:fs'
import { basename, dirname, extname, join, posix, resolve } from 'node:path'

import { PACKAGE_NAME } from '../source.js'
import { read } from './manifest.js'
import { extraFile, variantFile } from './targets.js'

const WEBKIT_SUBPATH = /['"`]@aziontech\/webkit\/([^'"`\s]+)['"`]/g

const BARE_IMPORT = /(?:\bfrom\s+|\bimport\s*\(\s*|^\s*import\s+)['"]([^./'"][^'"]*)['"]/gm

const LOCAL_SPECIFIER = /(\bfrom\s+|\bimport\s*\(\s*)(['"])(\.{1,2}\/[^'"]+)\2/g

const RESOLVE_SUFFIXES = ['', '.ts', '.vue', '.js', '/index.ts']

const isFile = (p) => existsSync(p) && statSync(p).isFile()

const pascal = (s) => s.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())

function packageInstalled(projectDir, spec) {
  const parts = spec.split('/')
  const name = spec.startsWith('@') ? parts.slice(0, 2).join('/') : parts[0]
  let dir = resolve(projectDir)
  for (;;) {
    if (existsSync(join(dir, 'node_modules', name, 'package.json'))) return { name, ok: true }
    const parent = dirname(dir)
    if (parent === dir) return { name, ok: false }
    dir = parent
  }
}

export function checkImports(projectDir, webkit, sources) {
  const webkitSubpaths = new Set()
  const foreign = new Set()
  for (const src of sources) {
    for (const m of src.matchAll(WEBKIT_SUBPATH)) webkitSubpaths.add(m[1])
    for (const m of src.matchAll(BARE_IMPORT)) {
      if (m[1] !== PACKAGE_NAME && !m[1].startsWith(`${PACKAGE_NAME}/`)) foreign.add(m[1])
    }
  }
  const webkitImports = [...webkitSubpaths].sort().map((sub) => ({
    spec: `${PACKAGE_NAME}/${sub}`,
    ok: webkit.exports.has(sub)
  }))
  const packages = new Map()
  for (const spec of foreign) {
    const hit = packageInstalled(projectDir, spec)
    if (!packages.has(hit.name)) packages.set(hit.name, hit)
  }
  return {
    webkit: webkitImports,
    missing: webkitImports.filter((i) => !i.ok).map((i) => i.spec),
    packages: [...packages.values()].sort((a, b) => a.name.localeCompare(b.name))
  }
}

export function rewriteImports(content, imports) {
  if (!imports || !Object.keys(imports).length) return content
  return String(content).replace(LOCAL_SPECIFIER, (match, lead, quote, spec) =>
    Object.hasOwn(imports, spec) ? `${lead}${quote}${imports[spec]}${quote}` : match
  )
}

export function localImports(content, fromFile, targets, toPath) {
  const out = {}
  for (const m of String(content).matchAll(LOCAL_SPECIFIER)) {
    const spec = m[3]
    const resolved = posix.normalize(posix.join(posix.dirname(fromFile), spec))
    const suffix = RESOLVE_SUFFIXES.find((s) => targets[resolved + s])
    if (suffix === undefined) continue
    const target = targets[resolved + suffix]
    let next = posix.relative(posix.dirname(toPath), target)
    if (!extname(spec)) next = next.slice(0, next.length - extname(next).length)
    if (!next.startsWith('.')) next = `./${next}`
    if (next !== spec) out[spec] = next
  }
  return out
}

function blockImports(content, fromFile, blockDir) {
  const out = new Set()
  for (const m of String(content).matchAll(LOCAL_SPECIFIER)) {
    const resolved = posix.normalize(
      posix.join(posix.dirname(fromFile), m[3].replace(/[?#].*$/, ''))
    )
    if (resolved.startsWith('..')) continue
    const suffix = RESOLVE_SUFFIXES.find((s) => isFile(join(blockDir, resolved + s)))
    if (suffix !== undefined) out.add(resolved + suffix)
  }
  return [...out]
}

function dependencyPiece(file, block, paths, taken) {
  const declared = (block.meta.variants || []).find((v) => posix.normalize(v.file) === file)
  const sibling =
    declared ||
    (file.startsWith('variants/') && file.endsWith('.vue')
      ? { name: pascal(basename(file, '.vue')), file }
      : null)
  const short = paths.at(sibling ? variantFile(paths.stem, sibling) : extraFile(paths.stem, file))
  const long = paths.at(extraFile(paths.stem, file.split('/').join('.')))
  return { path: taken.has(short) ? long : short, file, variant: declared ? declared.name : 'Data' }
}

export function dependencyPieces(block, paths, targets) {
  const taken = new Set(Object.values(targets))
  const queue = Object.keys(targets)
  const found = []
  for (let i = 0; i < queue.length; i += 1) {
    const content = read(join(block.dir, queue[i])) ?? ''
    for (const file of blockImports(content, queue[i], block.dir)) {
      if (targets[file]) continue
      const piece = dependencyPiece(file, block, paths, taken)
      targets[file] = piece.path
      taken.add(piece.path)
      queue.push(file)
      found.push(piece)
    }
  }
  return found
}

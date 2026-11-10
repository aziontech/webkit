#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = resolve(SCRIPT_DIR, '../../..')
const CATALOG_PATH = resolve(SCRIPT_DIR, '../catalog.json')
const DOC_DIRS = ['skills', 'rules', 'adapters']
const IMPORT_RE = /(node_modules\/)?@aziontech\/webkit\/([a-z0-9][a-z0-9./-]*[a-z0-9])(-\*|\/<)?/g
const NOT_A_SUBPATH = new Set(['src'])
const NEGATION_RE =
  /\b(no|never|not|nonexistent|instead of|wrong|don't|do not|flag|mismatch(es)?)\b|❌|✗/i

function markdownFiles(dir) {
  if (!existsSync(dir)) return []
  const out = []
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory()) out.push(...markdownFiles(p))
    else if (e.isFile() && e.name.endsWith('.md')) out.push(p)
  }
  return out
}

export function citedSubpaths(text) {
  const found = new Set()
  for (const line of String(text).split('\n')) {
    if (NEGATION_RE.test(line)) continue
    for (const m of line.matchAll(IMPORT_RE)) {
      if (m[1] || m[3]) continue
      const sub = m[2].replace(/\.(vue|js|ts)$/, '')
      if (NOT_A_SUBPATH.has(sub.split('/')[0])) continue
      found.add(sub)
    }
  }
  return [...found]
}

export function unknownCitations(catalog, sources) {
  const known = new Set(Object.keys(catalog.imports || {}))
  const problems = []
  for (const { source, text } of sources) {
    for (const sub of citedSubpaths(text)) {
      if (!known.has(sub)) problems.push({ source, cited: `@aziontech/webkit/${sub}` })
    }
  }
  return problems
}

function main() {
  const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf-8'))
  const sources = []
  for (const dir of DOC_DIRS) {
    for (const file of markdownFiles(join(REPO_ROOT, dir))) {
      sources.push({ source: relative(REPO_ROOT, file), text: readFileSync(file, 'utf-8') })
    }
  }
  for (const [id, p] of Object.entries(catalog.patterns || {})) {
    sources.push({ source: `catalog.json#patterns/${id}`, text: (p.imports || []).join('\n') })
  }
  const problems = unknownCitations(catalog, sources)
  if (problems.length) {
    for (const p of problems)
      process.stderr.write(`✖ ${p.source}: ${p.cited} is not in catalog.json\n`)
    process.stderr.write(
      '\nA skill, rule or pattern names a webkit export that does not exist (renamed, removed or never published). Fix the citation or the export.\n'
    )
    process.exit(1)
  }
  process.stdout.write(
    `✓ every @aziontech/webkit/* cited in skills/, rules/, adapters/ and patterns exists (${sources.length} sources)\n`
  )
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) main()

import assert from 'node:assert/strict'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

// The cited-names gate (scripts/check-cited-names.mjs) skips every negated line, so a doc that
// says "there is no `@aziontech/webkit/app-layout`" passes it even after the export ships, and
// keeps teaching agents to hand-build what the package already has. This test reads those
// denials and fails when the export they deny is in the catalog.

const PKG_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REPO_ROOT = resolve(PKG_ROOT, '..', '..')
const SOURCES = [
  'skills',
  'rules',
  'adapters',
  '.claude/skills',
  '.claude/docs',
  'packages/webkit/README.md'
]

const DENIAL =
  /\b(there (is|are) no|there's no|does not exist|doesn't exist|do not exist|non-?existent|not importable|not exported|no such (export|import|subpath|component)|dead import|not a webkit (import|export|component))\b|\bno\s+`@aziontech\/webkit\//i
const CITATION =
  /@aziontech\/webkit\/([a-z0-9][a-z0-9-]*[a-z0-9])(?![\w/*<-])|`\/([a-z0-9][a-z0-9-]*[a-z0-9])`/g

function markdownFiles(path, out = []) {
  if (!existsSync(path)) return out
  if (path.endsWith('.md')) return [...out, path]
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const p = join(path, entry.name)
    if (entry.isDirectory()) markdownFiles(p, out)
    else if (entry.name.endsWith('.md')) out.push(p)
  }
  return out
}

function sentences(markdown) {
  const out = []
  let fenced = false
  let paragraph = []
  const flush = () => {
    if (paragraph.length) out.push(...paragraph.join(' ').split(/(?<=[.!?])\s+(?=[A-Z*`(])/))
    paragraph = []
  }
  for (const line of markdown.split('\n')) {
    if (/^\s*```/.test(line)) {
      flush()
      fenced = !fenced
    } else if (fenced) continue
    else if (!line.trim() || /^\s*(#|[-*] |\d+\. |\|)/.test(line)) {
      flush()
      if (line.trim()) paragraph.push(line)
    } else paragraph.push(line)
  }
  flush()
  return out
}

export function deniedSubpaths(markdown) {
  const denied = new Set()
  for (const sentence of sentences(markdown)) {
    if (!DENIAL.test(sentence)) continue
    for (const m of sentence.matchAll(CITATION)) denied.add(m[1] ?? m[2])
  }
  return [...denied]
}

test('a denial of an export is read across a wrapped line and in its short form', () => {
  const text = [
    'The primitives you compose the shells from all resolve this way. **There is no',
    '`@aziontech/webkit/app-layout` and no `@aziontech/webkit/creation-header`:** the two shells are',
    'components _you_ compose.',
    '',
    '- There is no `@aziontech/webkit/console-layout` or `/doc-layout` — do not import one.',
    '- Never import a nonexistent `@aziontech/webkit/site-layout`.',
    '',
    'Use `@aziontech/webkit/button` and never `@aziontech/webkit/feedback/skeleton`.',
    '',
    '```vue',
    "import ConsoleLayout from '@aziontech/webkit/console-layout' // there is no catch here",
    '```'
  ].join('\n')
  assert.deepEqual(deniedSubpaths(text).sort(), [
    'app-layout',
    'console-layout',
    'creation-header',
    'doc-layout',
    'site-layout'
  ])
})

test('no skill, rule or doc denies an export the package ships', () => {
  const catalog = JSON.parse(readFileSync(join(PKG_ROOT, 'catalog.json'), 'utf8'))
  const shipped = new Set(Object.keys(catalog.imports ?? {}))
  assert.ok(shipped.has('console-layout'), 'catalog.json lists console-layout')
  const failures = []
  for (const source of SOURCES) {
    for (const file of markdownFiles(join(REPO_ROOT, source))) {
      for (const sub of deniedSubpaths(readFileSync(file, 'utf8'))) {
        if (shipped.has(sub))
          failures.push(
            `${relative(REPO_ROOT, file)}: says @aziontech/webkit/${sub} does not exist, but the package exports it`
          )
      }
    }
  }
  assert.deepEqual(failures, [])
})

#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on Storybook *.stories.* files
// whose Docs "Show code" output would not be a single, runnable, PascalCase SFC,
// or whose controls/docs wiring breaks the canonical story shape.
// Enforces .claude/rules/storybook-source.md:
//   - `parameters.docs` is a plain OBJECT LITERAL (a function call there makes
//     Storybook print the raw CSF story object instead of the snippet);
//   - the snippet comes from an explicit `source.code` built with `toSfc`
//     (no dynamic `source.transform`, no `source.type: 'dynamic'`);
//   - no lowercase/kebab tag of an imported component, no nested <template>;
//   - stories import the shared helper and set `canvas.sourceState`;
//   - no `argTypesRegex`, no legacy `Name.args = {...}` CSF2 form;
//   - no Figma parameters/links (`addon-designs`, figma.com URLs);
//   - `args` is never destructured/spread (it freezes the reactive proxy and
//     silently breaks the Controls panel).
//
// STRICT MODE: the whole stories tree was migrated to the canonical pattern on
// 2026-07-03, so every check applies to the RESULT of the write — there is no
// legacy to grandfather. Foundations catalog pages (stories/foundations/*) are
// exempt from the toSfc/helper requirement (they document tokens, not a
// component API) but must still keep `docs` a literal and set
// `canvas.sourceState` (use 'none' — a copy-paste SFC is meaningless there).
//
// Standalone audit mode: `node .claude/hooks/validate-story-source.mjs --all`
// scans every story file under apps/storybook/src/stories and exits 1 when any
// file violates the contract. Wire it in CI or run it manually after bulk edits.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

const ROOT = process.cwd()
const STORY_RE = /\.stories\.(js|jsx|mjs|ts|tsx)$/
const STORIES_DIR = 'apps/storybook/src/stories'

function readStdin() {
  return new Promise((resolveStdin) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolveStdin(data))
  })
}

function readExistingFile(filePath) {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

// Reconstruct the content the Write/Edit/MultiEdit would produce, so whole-file
// checks (import present, sourceState present) see the real result.
function computeResult(tool, ti, baseline) {
  if (tool === 'Write') return ti.content ?? ''
  if (tool === 'Edit') {
    if (typeof ti.old_string !== 'string') return baseline
    return baseline.replace(ti.old_string, ti.new_string ?? '')
  }
  if (tool === 'MultiEdit') {
    let out = baseline
    for (const e of ti.edits ?? []) {
      if (typeof e.old_string === 'string') out = out.replace(e.old_string, e.new_string ?? '')
    }
    return out
  }
  return baseline
}

const toKebab = (name) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const toPascal = (kebab) =>
  kebab
    .split(/[-/]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('')

// PascalCase components imported from the webkit package.
function importedComponents(content) {
  const names = new Set()
  const re = /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+['"]@aziontech\/webkit\/[^'"]+['"]/g
  let m
  while ((m = re.exec(content))) names.add(m[1])
  return [...names]
}

// Default imports of webkit components whose binding does not match the export
// subpath. `import Chip from '@aziontech/webkit/chips'` is wrong — the binding
// must be PascalCase(last segment of the subpath). This keeps the snippet, the
// component name, and the export path in lockstep.
function importBindingMismatches(content) {
  const out = []
  const re = /import\s+([A-Za-z_$][\w$]*)\s+from\s+['"]@aziontech\/webkit\/([^'"]+)['"]/g
  let m
  while ((m = re.exec(content))) {
    const binding = m[1]
    const subpath = m[2]
    if (subpath.startsWith('utils/') || subpath.startsWith('styles/')) continue // non-component helpers
    const expected = toPascal(subpath.split('/').pop())
    if (binding !== expected) out.push({ binding, subpath, expected })
  }
  return out
}

// Native HTML element names. A webkit component can share a name with one of
// these (Label/label, Table/table, Button/button, ...). A lowercase such tag in
// slot markup is legitimate native HTML, not a mis-cased component reference, so
// it is NOT flagged. The real target of this check is a lowercase tag of a
// NON-native component name (<skeleton>, <chips>, <avatar>, <empty-state>),
// which never resolves when pasted.
const NATIVE_HTML = new Set([
  'a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi',
  'bdo', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'cite', 'code',
  'col', 'colgroup', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog',
  'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'footer',
  'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'hgroup', 'hr',
  'html', 'i', 'iframe', 'img', 'input', 'ins', 'kbd', 'label', 'legend', 'li',
  'link', 'main', 'map', 'mark', 'menu', 'meta', 'meter', 'nav', 'object', 'ol',
  'optgroup', 'option', 'output', 'p', 'picture', 'pre', 'progress', 'q', 'rp',
  'rt', 'ruby', 's', 'samp', 'script', 'section', 'select', 'slot', 'small',
  'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody',
  'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr',
  'track', 'u', 'ul', 'var', 'video', 'wbr'
])

// Lowercase/kebab tags of imported PascalCase components present as real tags.
function lowercaseTagHits(content, components) {
  const hits = []
  for (const name of components) {
    if (name === name.toLowerCase()) continue
    for (const tag of new Set([name.toLowerCase(), toKebab(name)])) {
      if (NATIVE_HTML.has(tag)) continue // legitimate native element, not a mis-cased component
      const re = new RegExp(`<\\/?${tag}(?=[\\s/>])`, 'g')
      if (re.test(content)) hits.push({ tag, expected: name })
    }
  }
  return hits
}

function checks(result, relPath) {
  const violations = []
  const has = (s, str) => s.includes(str)

  const isFoundations = relPath.includes('stories/foundations/')
  const usesHelper = has(result, '_shared/story-source')
  const usesToSfc = has(result, 'toSfc(')
  const hasDocsConfig = has(result, 'autodocs') || /\bdocs\s*:/.test(result)

  // ---- anti-patterns (always blocked) ----

  // `docs:` set to a function call rather than a plain object literal. Storybook
  // then prints the raw CSF story object instead of the runnable snippet.
  if (/\bdocs:\s*[A-Za-z_$][\w$]*\s*\(/.test(result)) {
    violations.push({
      id: 'docs-not-literal',
      message:
        'parameters.docs is a function call. It must be a plain object literal; build the snippet with source.code: toSfc(...).'
    })
  }

  // Dynamic source — we use explicit source.code, never a transform or 'dynamic'.
  if (/\btransform:\s*(\(|async|function)/.test(result)) {
    violations.push({
      id: 'handrolled-transform',
      message: 'docs.source.transform is forbidden. Set an explicit source.code: toSfc(IMPORT, TEMPLATE) instead.'
    })
  }
  if (/\btype:\s*['"]dynamic['"]/.test(result)) {
    violations.push({
      id: 'dynamic-source',
      message: "docs.source.type: 'dynamic' is forbidden. Set an explicit source.code: toSfc(IMPORT, TEMPLATE)."
    })
  }

  // Nested <template>.
  if (/<template>\s*<template>/.test(result)) {
    violations.push({
      id: 'nested-template',
      message: 'Nested <template> in the snippet. toSfc adds exactly one wrapper — the body must not contain <template>.'
    })
  }

  // Lowercase/kebab tag of an imported component.
  const hits = lowercaseTagHits(result, importedComponents(result))
  if (hits.length) {
    violations.push({
      id: 'lowercase-tag',
      message: `Lowercase/kebab component tag(s): ${hits
        .map((h) => `<${h.tag}> → <${h.expected}>`)
        .join(', ')}. Tags must match the PascalCase import.`
    })
  }

  // Import binding must match the export subpath (PascalCase). Catches
  // `import Chip from '@aziontech/webkit/chips'` (binding Chip vs subpath chips).
  const bindHits = importBindingMismatches(result)
  if (bindHits.length) {
    violations.push({
      id: 'import-binding-mismatch',
      message: `Import binding(s) do not match the export subpath: ${bindHits
        .map((h) => `import ${h.binding} from '@aziontech/webkit/${h.subpath}' → expected '${h.expected}'`)
        .join('; ')}. Rename the binding, or the component/export, so file ↔ export ↔ name ↔ binding all agree.`
    })
  }

  // Deprecated Storybook wiring.
  if (/argTypesRegex/.test(result)) {
    violations.push({
      id: 'argtypes-regex',
      message: 'parameters.actions.argTypesRegex is deprecated. Declare each event explicitly in argTypes with { action }.'
    })
  }
  if (/^[A-Z][A-Za-z0-9]*\.(args|argTypes|parameters)\s*=/m.test(result)) {
    violations.push({
      id: 'legacy-csf2-assignment',
      message: 'Legacy `Story.args = {...}` assignment. Use CSF3 object-form stories (export const X = { args, render, parameters }).'
    })
  }

  // Figma references live in <name>.figma.ts (Code Connect), never in stories.
  if (/addon-designs|figma\.com/.test(result)) {
    violations.push({
      id: 'figma-reference',
      message: 'Figma links/addon-designs are forbidden in stories. The Figma mapping is owned by the component `.figma.ts` (Code Connect).'
    })
  }

  // Destructuring/spreading the reactive `args` proxy freezes property reads at
  // setup time and silently breaks the Controls panel.
  if (/(?:const|let|var)\s*\{[^}]*\}\s*=\s*args\b/.test(result) || /\{\s*\.\.\.args\b/.test(result)) {
    violations.push({
      id: 'args-destructure',
      message:
        'Destructuring or spreading `args` breaks Controls reactivity. Return { args } from setup() and bind v-bind="args" directly.'
    })
  }

  // ---- presence (every story file that emits docs) ----
  if (hasDocsConfig) {
    if (!isFoundations && !usesHelper) {
      violations.push({
        id: 'missing-helper',
        message: 'Story emits docs but does not import the shared helper (_shared/story-source).'
      })
    }
    if (!isFoundations && !usesToSfc) {
      violations.push({
        id: 'missing-source-code',
        message: 'Story does not build its Show code with source.code: toSfc(IMPORT, TEMPLATE).'
      })
    }
    if (!has(result, 'sourceState')) {
      violations.push({
        id: 'missing-sourcestate',
        message:
          "Missing canvas.sourceState in the meta docs block ('shown' for component/template stories, 'none' for foundations catalogs)."
      })
    }
  }

  return violations
}

function walkStories(dir) {
  const out = []
  let entries
  try {
    entries = readdirSync(dir)
  } catch {
    return out
  }
  for (const entry of entries) {
    const full = join(dir, entry)
    const st = statSync(full)
    if (st.isDirectory()) out.push(...walkStories(full))
    else if (STORY_RE.test(entry)) out.push(full)
  }
  return out
}

function runAll() {
  const files = walkStories(resolve(ROOT, STORIES_DIR))
  let failed = 0
  for (const file of files) {
    const relPath = relative(ROOT, file)
    const violations = checks(readExistingFile(file), relPath)
    if (violations.length) {
      failed++
      process.stderr.write(`\n${relPath}\n`)
      for (const v of violations) process.stderr.write(`  [${v.id}] ${v.message}\n`)
    }
  }
  if (failed) {
    process.stderr.write(`\n${failed} story file(s) violate .claude/rules/storybook-source.md\n`)
    process.exit(1)
  }
  process.stdout.write(`OK: ${files.length} story files comply with .claude/rules/storybook-source.md\n`)
  process.exit(0)
}

async function main() {
  if (process.argv.includes('--all')) return runAll()

  const raw = await readStdin()
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    process.exit(0)
  }

  const tool = input.tool_name
  if (!['Write', 'Edit', 'MultiEdit'].includes(tool)) process.exit(0)

  const filePath = input.tool_input?.file_path
  if (!filePath || !STORY_RE.test(filePath)) process.exit(0)

  const relPath = relative(ROOT, resolve(filePath))
  const baseline = readExistingFile(filePath)
  const result = computeResult(tool, input.tool_input ?? {}, baseline)

  const violations = checks(result, relPath)
  if (violations.length === 0) process.exit(0)

  const lines = [`BLOCKED: Storybook "Show code" validation failed on ${relPath}.`, '']
  for (const v of violations) lines.push(`  [${v.id}] ${v.message}`)
  lines.push('')
  lines.push('Build the snippet with toSfc from apps/storybook/src/stories/_shared/story-source.js.')
  lines.push('Rule: .claude/rules/storybook-source.md')

  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  if (process.argv.includes('--all')) {
    process.stderr.write(`validate-story-source --all error: ${err?.message ?? err}\n`)
    process.exit(1) // audit mode fails loud
  }
  process.stderr.write(`validate-story-source hook error: ${err?.message ?? err}\n`)
  process.exit(0) // hook mode fails open
})

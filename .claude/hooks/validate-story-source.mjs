#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on Storybook *.stories.* files
// whose Docs "Show code" output would not be a single, runnable, PascalCase SFC.
// Enforces .claude/rules/storybook-source.md:
//   - `parameters.docs` is a plain OBJECT LITERAL (a function call there makes
//     Storybook print the raw CSF story object instead of the snippet);
//   - the snippet comes from an explicit `source.code` built with `toSfc`
//     (no dynamic `source.transform`);
//   - no lowercase/kebab tag of an imported component, no nested <template>;
//   - new stories import the shared helper and set `sourceState: 'shown'`.
// Only NEWLY introduced violations block; pre-existing legacy is left alone.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const ROOT = process.cwd()
const STORY_RE = /\.stories\.(js|jsx|mjs|ts|tsx)$/

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

// PascalCase components imported from the webkit package.
function importedComponents(content) {
  const names = new Set()
  const re = /import\s+([A-Z][A-Za-z0-9]*)\s+from\s+['"]@aziontech\/webkit\/[^'"]+['"]/g
  let m
  while ((m = re.exec(content))) names.add(m[1])
  return [...names]
}

// Lowercase/kebab tags of imported PascalCase components present as real tags.
function lowercaseTagHits(content, components) {
  const hits = []
  for (const name of components) {
    if (name === name.toLowerCase()) continue
    for (const tag of new Set([name.toLowerCase(), toKebab(name)])) {
      const re = new RegExp(`<\\/?${tag}(?=[\\s/>])`, 'g')
      if (re.test(content)) hits.push({ tag, expected: name })
    }
  }
  return hits
}

function checks(result, baseline, isNew) {
  const violations = []
  const has = (s, str) => s.includes(str)

  const usesHelper = has(result, '_shared/story-source')
  const usesToSfc = has(result, 'toSfc(')
  const hasDocsConfig = has(result, 'autodocs') || /\bdocs\s*:/.test(result)

  // ---- anti-patterns (block when newly introduced) ----

  // `docs:` set to a function call rather than a plain object literal. Storybook
  // then prints the raw CSF story object instead of the runnable snippet.
  const docsCall = /\bdocs:\s*[A-Za-z_$][\w$]*\s*\(/
  if (docsCall.test(result) && !docsCall.test(baseline)) {
    violations.push({
      id: 'docs-not-literal',
      message: 'parameters.docs is a function call. It must be a plain object literal; build the snippet with source.code: toSfc(...).'
    })
  }

  // Dynamic source transform — we use explicit source.code, never a transform.
  const transform = /\btransform:\s*(\(|async|function)/
  if (transform.test(result) && !transform.test(baseline)) {
    violations.push({
      id: 'handrolled-transform',
      message: 'docs.source.transform is forbidden. Set an explicit source.code: toSfc(IMPORT, TEMPLATE) instead.'
    })
  }

  // Nested <template>.
  if (/<template>\s*<template>/.test(result) && !/<template>\s*<template>/.test(baseline)) {
    violations.push({
      id: 'nested-template',
      message: 'Nested <template> in the snippet. toSfc adds exactly one wrapper — the body must not contain <template>.'
    })
  }

  // Lowercase/kebab tag of an imported component.
  const hits = lowercaseTagHits(result, importedComponents(result))
  const baseHits = new Set(lowercaseTagHits(baseline, importedComponents(baseline)).map((h) => h.tag))
  const newHits = hits.filter((h) => !baseHits.has(h.tag))
  if (newHits.length) {
    violations.push({
      id: 'lowercase-tag',
      message: `Lowercase/kebab component tag(s): ${newHits
        .map((h) => `<${h.tag}> → <${h.expected}>`)
        .join(', ')}. Tags must match the PascalCase import.`
    })
  }

  // ---- presence (enforced for NEW story files that emit docs) ----
  if (isNew && hasDocsConfig) {
    if (!usesHelper) {
      violations.push({
        id: 'missing-helper',
        message: 'New story emits docs but does not import the shared helper (_shared/story-source).'
      })
    }
    if (!usesToSfc) {
      violations.push({
        id: 'missing-source-code',
        message: 'New story does not build its Show code with source.code: toSfc(IMPORT, TEMPLATE).'
      })
    }
    if (!has(result, 'sourceState')) {
      violations.push({
        id: 'missing-sourcestate',
        message: "Missing canvas.sourceState: 'shown' in the meta docs block."
      })
    }
  }

  return violations
}

async function main() {
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
  const isNew = baseline === ''
  const result = computeResult(tool, input.tool_input ?? {}, baseline)

  const violations = checks(result, baseline, isNew)
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
  process.stderr.write(`validate-story-source hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

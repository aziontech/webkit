#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on Storybook *.stories.* files
// whose Docs "Show code" output would not be a single, runnable, PascalCase SFC.
// Enforces .claude/rules/storybook-source.md:
//   - new stories must route docs.source through apps/.../_shared/story-source
//     (runnableDocs / sfcTransform / toSfc) and set sourceState: 'shown';
//   - no hand-rolled transform, no lowercase/kebab tag of an imported component,
//     no nested <template>.
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

// Reconstruct the file content that the Write/Edit/MultiEdit would produce, so
// whole-file checks (import present, sourceState present) see the real result.
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
    if (name === name.toLowerCase()) continue // single-letter / already-lowercase: nothing to restore
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
  const usesRunnable = has(result, 'runnableDocs(')
  const usesTransform = has(result, 'sfcTransform(')
  const hasDocsConfig = has(result, 'autodocs') || /docs\s*:/.test(result)

  // ---- anti-patterns (block when newly introduced) ----

  // Nested <template>.
  if (/<template>\s*<template>/.test(result) && !/<template>\s*<template>/.test(baseline)) {
    violations.push({
      id: 'nested-template',
      message: 'Nested <template> in the snippet. toSfc adds exactly one wrapper — the body must not contain <template>.'
    })
  }

  // Hand-rolled transform (a `transform:` key not produced by the helper).
  if (/transform\s*:/.test(result) && !usesTransform && !usesRunnable) {
    const newlyAdded = !/transform\s*:/.test(baseline)
    if (newlyAdded) {
      violations.push({
        id: 'handrolled-transform',
        message: 'Hand-rolled docs.source.transform. Use runnableDocs / sfcTransform from _shared/story-source instead.'
      })
    }
  }

  // Lowercase/kebab tag of an imported component.
  const components = importedComponents(result)
  const hits = lowercaseTagHits(result, components)
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
    if (!usesRunnable && !usesTransform) {
      violations.push({
        id: 'missing-runnable-source',
        message: 'New story does not route docs.source through runnableDocs / sfcTransform.'
      })
    }
    if (usesTransform && !usesRunnable && !has(result, 'sourceState')) {
      violations.push({
        id: 'missing-sourcestate',
        message: "Missing canvas.sourceState: 'shown' (use runnableDocs, which sets it)."
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
  const baseline = tool === 'Write' && !readExistingFile(filePath) ? '' : readExistingFile(filePath)
  const isNew = baseline === ''
  const result = computeResult(tool, input.tool_input ?? {}, baseline)

  const violations = checks(result, baseline, isNew)
  if (violations.length === 0) process.exit(0)

  const lines = [`BLOCKED: Storybook "Show code" validation failed on ${relPath}.`, '']
  for (const v of violations) lines.push(`  [${v.id}] ${v.message}`)
  lines.push('')
  lines.push('Route docs.source through apps/storybook/src/stories/_shared/story-source.js.')
  lines.push('Rule: .claude/rules/storybook-source.md')

  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-story-source hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

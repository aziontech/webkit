#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on Storybook *.stories.* files
// whose Docs "Show code" output would not be a single, runnable, PascalCase SFC,
// or whose controls/docs wiring breaks the canonical story shape.
// The checks live in ./_lib/story-source-checks.mjs and are ALSO run repo-wide by the
// CI ratchet (packages/webkit/scripts/check-authoring.mjs) — one definition, two
// surfaces. The whole stories tree was migrated to the canonical pattern on
// 2026-07-03, so every check applies to the RESULT of the write — no grandfathering.
//
// Standalone audit mode: `node .claude/hooks/validate-story-source.mjs --all`
// scans every story file under apps/storybook/src/stories and exits 1 when any
// file violates the contract. Wire it in CI or run it manually after bulk edits.

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { checks, STORY_RE } from './_lib/story-source-checks.mjs'

const ROOT = process.cwd()
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
// checks (import present, sourceState present) see the real result. Honors replace_all.
function applyEdit(base, oldS, newS, replaceAll) {
  if (typeof oldS !== 'string' || !base.includes(oldS)) return base
  return replaceAll ? base.split(oldS).join(newS ?? '') : base.replace(oldS, newS ?? '')
}

function computeResult(tool, ti, baseline) {
  if (tool === 'Write') return ti.content ?? ''
  if (tool === 'Edit') return applyEdit(baseline, ti.old_string, ti.new_string, ti.replace_all)
  if (tool === 'MultiEdit') {
    let out = baseline
    for (const e of ti.edits ?? []) out = applyEdit(out, e.old_string, e.new_string, e.replace_all)
    return out
  }
  return baseline
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
  lines.push(
    'Build the snippet with toSfc from apps/storybook/src/stories/_shared/story-source.js.'
  )
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

#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on Storybook *.stories.* files
// whose Docs "Show code" output would not be a single, runnable, PascalCase SFC.
// The checks live in ./_lib/story-source-checks.mjs and are ALSO run repo-wide by the
// CI ratchet (packages/webkit/scripts/check-authoring.mjs) — one definition, two
// surfaces. Only NEWLY introduced violations block here; legacy migrates when touched.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { checks, STORY_RE } from './_lib/story-source-checks.mjs'

const ROOT = process.cwd()

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
  lines.push(
    'Build the snippet with toSfc from apps/storybook/src/stories/_shared/story-source.js.'
  )
  lines.push('Rule: .claude/rules/storybook-source.md')

  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-story-source hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

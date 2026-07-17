#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on packages/webkit/src/** (excluding the
// wip/ legacy zone) that INTRODUCE a wrong construction pattern the .claude/rules define:
//   - hand-rolled modelValue prop + update:modelValue emit   → use defineModel (v-model.md)
//   - runtime object defineProps({...})                      → typed defineProps<Props>() (props.md)
//   - runtime defineEmits([...]) / ({...})                   → typed defineEmits<{...}>() (emits.md)
//   - <slot> in template without a typed defineSlots         → declare the slots (slots.md)
//   - composable returns reactive()                          → refs/computed + readonly() (composables.md)
//   - a new composable authored as .js                       → composables are .ts (composables.md)
//   - @deprecated with no replacement/version                → name it (deprecation.md)
//
// Same discipline as validate-tokens.mjs: reconstruct the RESULTING file content, and only
// block a pattern that is NOT already present in the baseline (we block NEW sins, never
// grandfathered ones — so legacy components migrate as they are touched, not all at once).
// Fail-open on any error.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { CONTENT_CHECKS, MESSAGES } from './_lib/authoring-checks.mjs'

const ROOT = process.cwd()
const TARGET_PREFIX = 'packages/webkit/src/'
const WIP_PREFIX = 'packages/webkit/src/components/wip/'

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

// Reconstruct the file content AFTER the tool runs, so negative checks (must-have-X) are
// correct instead of seeing only an edit fragment. Honors replace_all.
function applyEdit(base, oldS, newS, replaceAll) {
  if (typeof oldS !== 'string' || oldS === '' || !base.includes(oldS)) return base
  return replaceAll ? base.split(oldS).join(newS ?? '') : base.replace(oldS, newS ?? '')
}

function resultingContent(tool, ti, baseline) {
  if (tool === 'Write') return ti.content ?? ''
  if (tool === 'Edit') return applyEdit(baseline, ti.old_string, ti.new_string, ti.replace_all)
  if (tool === 'MultiEdit') {
    let result = baseline
    for (const e of ti.edits ?? []) {
      result = applyEdit(result, e.old_string, e.new_string, e.replace_all)
    }
    return result
  }
  return ''
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

  const ti = input.tool_input ?? {}
  const filePath = ti.file_path
  if (!filePath) process.exit(0)

  const relPath = relative(ROOT, resolve(filePath))
  if (!relPath.startsWith(TARGET_PREFIX) || relPath.startsWith(WIP_PREFIX)) process.exit(0)
  if (!/\.(vue|ts|js)$/.test(relPath)) process.exit(0)

  const baseline = tool === 'Write' ? '' : readExistingFile(filePath)
  const result = resultingContent(tool, ti, baseline)

  const violations = []

  // Path-based: a NEW composable must be .ts, not .js (only on Write of a fresh file).
  if (tool === 'Write' && /(^|\/)use-[^/]*\.js$/.test(relPath) && !baseline) {
    violations.push({ id: 'composable-js', message: MESSAGES['composable-js'] })
  }

  for (const c of CONTENT_CHECKS) {
    if (!c.applies(relPath)) continue
    if (c.violated(result) && !c.violated(baseline)) {
      violations.push({ id: c.id, message: c.message })
    }
  }

  if (violations.length === 0) process.exit(0)

  const lines = [`Webkit authoring validation blocked ${tool} on ${relPath}.`, '']
  for (const v of violations) lines.push(`  [${v.id}] ${v.message}`)
  lines.push('')
  lines.push(
    'These are the construction standards in .claude/rules/. Fix the pattern — do not work around the hook.'
  )
  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-authoring hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

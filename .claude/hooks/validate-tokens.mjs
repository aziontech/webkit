#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on packages/webkit/src/components/**
// when the content violates DESIGN.md /
// COMPONENT_REQUIREMENTS.md rules: hex/rgb/hsl colors, Tailwind palette, raw
// typography, PrimeVue color utils, `class` in defineProps, `any`, `@ts-ignore`.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { TOKEN_CHECKS as VIOLATIONS } from './_lib/token-checks.mjs'

const ROOT = process.cwd()
const TARGET_PREFIX = 'packages/webkit/src/components/'

function readStdin() {
  return new Promise((resolveStdin) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolveStdin(data))
  })
}

// Reconstruct the file content AFTER the tool runs (same discipline as
// validate-authoring): scanning only the edit fragments lets a forbidden token be
// introduced split across two edits. Honors replace_all.
function applyEdit(base, oldS, newS, replaceAll) {
  if (typeof oldS !== 'string' || !base.includes(oldS)) return base
  return replaceAll ? base.split(oldS).join(newS ?? '') : base.replace(oldS, newS ?? '')
}

function resultingContent(tool, ti, baseline) {
  if (tool === 'Write') return ti.content ?? ''
  if (tool === 'Edit') return applyEdit(baseline, ti.old_string, ti.new_string, ti.replace_all)
  if (tool === 'MultiEdit') {
    let out = baseline
    for (const e of ti.edits ?? []) out = applyEdit(out, e.old_string, e.new_string, e.replace_all)
    return out
  }
  return baseline
}

function readExistingFile(filePath) {
  try {
    return readFileSync(filePath, 'utf-8')
  } catch {
    return ''
  }
}

function findViolations(text, baseline) {
  const found = []
  for (const rule of VIOLATIONS) {
    const matches = text.match(rule.regex)
    if (!matches || matches.length === 0) continue
    // Skip rules whose matches were ALREADY present in the baseline (pre-existing
    // violation, not introduced by this Write/Edit). We only block new sins.
    const baselineMatches = baseline.match(rule.regex) || []
    const baselineSet = new Set(baselineMatches)
    const newOnes = matches.filter((m) => !baselineSet.has(m))
    if (newOnes.length === 0) continue
    const unique = [...new Set(newOnes)].slice(0, 5)
    found.push({ id: rule.id, message: rule.message, samples: unique })
  }
  return found
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
  if (!filePath) process.exit(0)

  const relPath = relative(ROOT, resolve(filePath))
  if (!relPath.startsWith(TARGET_PREFIX)) process.exit(0)
  if (!/\.(vue|css|scss|ts)$/.test(filePath)) process.exit(0)

  // For Edit/MultiEdit, baseline = existing file. For Write of new file, baseline = ''.
  const baseline = tool === 'Write' ? '' : readExistingFile(filePath)

  const newContents = resultingContent(tool, input.tool_input ?? {}, baseline)
  const violations = findViolations(newContents, baseline)
  if (violations.length === 0) process.exit(0)

  const lines = [`Webkit token validation blocked ${tool} on ${relPath}.`, '']
  for (const v of violations) {
    lines.push(`  [${v.id}] ${v.message}`)
    lines.push(`    Found: ${v.samples.join(', ')}`)
  }
  lines.push('')
  lines.push(
    'Sources of truth: .claude/docs/DESIGN.md and .claude/docs/COMPONENT_REQUIREMENTS.md § "Webkit Layer Pattern (in-depth)".'
  )
  lines.push(
    'Workflow: /spec-create then /component-create. The orchestrator runs token-mapper which resolves Figma variables to DESIGN.md classes / var(--*) tokens; the catalog mirror lives at .claude/docs/DESIGN.md.'
  )

  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-tokens hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

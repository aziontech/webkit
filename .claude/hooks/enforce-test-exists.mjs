#!/usr/bin/env node
// PreToolUse hook: blocks Write of a webkit-layer root .vue when the sibling
// <name>.test.ts is missing.
//
// Triggered only by Write (not Edit) — same model as enforce-spec-exists.mjs.
// Fires only for the *root* .vue of a component (filename matches the parent
// directory), so composition sub-components (<name>-<part>/<name>-<part>.vue)
// are not required to ship their own test.
//
// Bypassed for components on the legacy whitelist
// (.claude/hooks/_lib/legacy-components.json).
//
// Rationale: see .claude/rules/testing.md.

import { existsSync } from 'node:fs'
import { dirname, relative, resolve } from 'node:path'
import { isLegacyComponent, resolveSpecForComponentPath } from './_lib/spec.mjs'

const ROOT = process.cwd()

function readStdin() {
  return new Promise((res) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => res(data))
  })
}

async function main() {
  const raw = await readStdin()
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    process.exit(0)
  }

  if (input.tool_name !== 'Write') process.exit(0)
  const filePath = input.tool_input?.file_path
  if (!filePath) process.exit(0)

  const abs = resolve(filePath)
  const info = resolveSpecForComponentPath(abs, ROOT)
  if (!info) process.exit(0)

  // Only fire for the ROOT .vue of a component (filename === <name>.vue).
  // Composition sub-components live at <name>/<name>-<part>/<name>-<part>.vue;
  // they do not get their own *.test.ts unless the root test cannot reach them.
  const expectedRoot = resolve(dirname(abs), `${info.name}.vue`)
  if (abs !== expectedRoot) process.exit(0)

  // Legacy components bypass.
  if (isLegacyComponent(info.category, info.name, ROOT)) process.exit(0)

  const testPath = resolve(dirname(abs), `${info.name}.test.ts`)
  if (existsSync(testPath)) process.exit(0)

  process.stderr.write(
    `enforce-test-exists: blocked Write to ${relative(ROOT, abs)}\n\n` +
      `Test file missing: ${relative(ROOT, testPath)}\n\n` +
      `Every webkit component ships a sibling <name>.test.ts — see\n` +
      `.claude/rules/testing.md. Write the smoke + a11y test first; the\n` +
      `component-scaffold skill emits the test alongside the .vue.\n`
  )
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`enforce-test-exists hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

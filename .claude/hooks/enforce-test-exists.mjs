#!/usr/bin/env node
// PostToolUse hook: after a ROOT component .vue is written OR edited, blocks
// (exit 2) when the co-located <name>.test.ts is missing. You cannot create a
// component without a test, nor update one whose test does not exist — every
// component ships a browser-mode functional suite next to its .vue
// (.claude/rules/testing.md, a `general` standard). Freshness on update (a
// changed .vue whose test was NOT touched) is the CI gate check-tests; this
// write-time hook owns existence, on both create (Write) and update (Edit/MultiEdit).
//
// Why PostToolUse (not Pre): /component-create writes the .vue before any test
// can exist, so a Pre block would deadlock the pipeline. Post surfaces the
// blocking reminder without undoing the write — same wiring as validate-spec-compliance.
//
// Only the ROOT .vue is checked (basename === folder name). Composition
// sub-components are tested through their root (testing.md), and resolveSpec…
// already returns null for sub-components nested in their own folder.
//
// Bypassed for components on the legacy whitelist
// (.claude/hooks/_lib/legacy-components.json).

import { existsSync } from 'node:fs'
import { basename, dirname, relative, resolve } from 'node:path'
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

  // Creating (Write) OR updating (Edit/MultiEdit) a component .vue both require the
  // co-located test to exist — you cannot land a new or changed component untested.
  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) process.exit(0)
  const filePath = input.tool_input?.file_path
  if (!filePath) process.exit(0)

  const abs = resolve(filePath)
  const info = resolveSpecForComponentPath(abs, ROOT)
  if (!info) process.exit(0)

  // Root component only: <category>/<name>/<name>.vue. Composition sub-components
  // (<name>-part.vue) are tested through their root, so skip them.
  if (basename(abs, '.vue') !== info.name) process.exit(0)

  // Legacy components bypass.
  if (isLegacyComponent(info.category, info.name, ROOT)) process.exit(0)

  const testPath = resolve(dirname(abs), `${info.name}.test.ts`)
  if (existsSync(testPath)) process.exit(0)

  process.stderr.write(
    `enforce-test-exists: ${info.category}/${info.name} has no co-located ${info.name}.test.ts\n\n` +
      `Every webkit component ships a browser-mode functional suite next to its .vue\n` +
      `(.claude/rules/testing.md). Missing:\n` +
      `  ${relative(ROOT, testPath)}\n\n` +
      `Reuse the story via composeStories, assert the functional surface (render,\n` +
      `props -> data-*, events, disabled/loading suppression, v-model, ARIA, and\n` +
      `a11y via expectNoA11yViolations), and run it in Vitest browser mode (never\n` +
      `jsdom). If this is a legacy component, add\n` +
      `  { "category": "${info.category}", "name": "${info.name}" }\n` +
      `to .claude/hooks/_lib/legacy-components.json.\n`
  )
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`enforce-test-exists hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

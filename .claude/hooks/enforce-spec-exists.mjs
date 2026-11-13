#!/usr/bin/env node
// PreToolUse hook: blocks Write of a webkit-layer .vue when the matching spec
// at .specs/<name>.md is missing, not approved, or its body checksum no longer
// matches the frontmatter.checksum (tamper detection). The checks live in
// _lib/spec-integrity.mjs, shared with packages/webkit/scripts/check-spec-integrity.mjs (CI).
//
// Bypassed for components on the legacy whitelist
// (.claude/hooks/_lib/legacy-components.json).

import { existsSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import { isLegacyComponent, resolveSpecForComponentPath } from './_lib/spec.mjs'
import { checkSpecFile } from './_lib/spec-integrity.mjs'

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

  // Legacy components bypass.
  if (isLegacyComponent(info.category, info.name, ROOT)) process.exit(0)

  const fail = (lines) => {
    process.stderr.write(
      `enforce-spec-exists: blocked Write to ${relative(ROOT, abs)}\n\n${lines.join('\n')}\n`
    )
    process.exit(2)
  }

  if (!existsSync(info.specPath)) {
    fail([
      `Spec missing: .specs/${info.name}.md`,
      ``,
      `Run /spec-create ${info.name} first. The .vue cannot be written until the spec`,
      `exists and is approved.`
    ])
  }

  const errors = checkSpecFile(info.specPath, ROOT, { forWrite: true, shipped: false })
  if (errors.length > 0) {
    fail([
      ...errors.flatMap((e, i) => (i ? ['', ...e.lines] : e.lines)),
      '',
      `Run /component-create ${info.name} (spec-validator runs first) or /component-verify ${info.name}.`
    ])
  }

  process.exit(0)
}

main().catch((err) => {
  process.stderr.write(`enforce-spec-exists hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

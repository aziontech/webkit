#!/usr/bin/env node
// PreToolUse hook: blocks Write of a webkit-layer .vue when the matching spec
// at .specs/<name>.md is missing, not approved, or its body checksum no longer
// matches the frontmatter.checksum (tamper detection).
//
// Bypassed for components on the legacy whitelist
// (.claude/hooks/_lib/legacy-components.json).

import { existsSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import {
  bodyChecksum,
  isLegacyComponent,
  parseSpecFile,
  resolveSpecForComponentPath,
  validateFrontmatter
} from './_lib/spec.mjs'

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
    process.stderr.write(`enforce-spec-exists: blocked Write to ${relative(ROOT, abs)}\n\n${lines.join('\n')}\n`)
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

  let parsed
  try {
    parsed = parseSpecFile(info.specPath)
  } catch (e) {
    fail([`Cannot read spec: ${e?.message ?? e}`])
  }

  const { frontmatter, body } = parsed
  const fmErrors = validateFrontmatter(frontmatter)
  if (fmErrors.length > 0) {
    fail([`Spec frontmatter invalid:`, ...fmErrors.map((e) => `  - ${e}`)])
  }

  if (!['approved', 'implemented'].includes(frontmatter.status)) {
    fail([
      `Spec status is "${frontmatter.status}". /component-create requires "approved" or "implemented".`,
      ``,
      `If you just drafted the spec, run /component-create ${info.name} — it will call`,
      `spec-validator first, which flips draft → approved when the body satisfies every rule.`
    ])
  }

  if (frontmatter.status === 'locked') {
    fail([
      `Spec is locked. Edits require bumping spec_version and re-running /spec-create.`
    ])
  }

  const expected = bodyChecksum(body)
  if (expected !== frontmatter.checksum) {
    fail([
      `Spec body was modified after approval (checksum mismatch).`,
      `  expected: ${frontmatter.checksum}`,
      `  actual:   ${expected}`,
      ``,
      `Re-run /component-verify ${info.name} or re-approve the spec.`
    ])
  }

  process.exit(0)
}

main().catch((err) => {
  process.stderr.write(`enforce-spec-exists hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

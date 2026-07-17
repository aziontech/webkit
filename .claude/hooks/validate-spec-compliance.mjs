#!/usr/bin/env node
// PostToolUse hook: after a Write/Edit/MultiEdit on a webkit-layer .vue,
// re-read the file and verify the props/events/slots/animations in the code
// match the spec at .specs/<name>.md 1-to-1. Blocks on any divergence.
//
// The checks themselves live in ./_lib/spec-compliance-checks.mjs and are ALSO run
// repo-wide by the CI ratchet (packages/webkit/scripts/check-authoring.mjs) — one
// definition, two surfaces, so an editor push can't bypass this hook.

import { readFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'
import { collectSpecViolations } from './_lib/spec-compliance-checks.mjs'

const ROOT = process.cwd()

// Same ratchet baseline the CI reads (`<rel>::spec:<violation>` keys): pre-existing,
// grandfathered violations never block an unrelated edit — only NEW divergence does.
function baselinedSpecKeys() {
  try {
    const entries = JSON.parse(
      readFileSync(resolve(ROOT, 'packages/webkit/scripts/authoring-baseline.json'), 'utf-8')
    )
    return new Set(Array.isArray(entries) ? entries : [])
  } catch {
    return new Set()
  }
}

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

  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) process.exit(0)
  const filePath = input.tool_input?.file_path
  if (!filePath) process.exit(0)

  const abs = resolve(filePath)
  const result = collectSpecViolations(abs, ROOT)
  if (!result || result.violations.length === 0) process.exit(0)

  const { info } = result
  const rel = relative(ROOT, abs).split(sep).join('/')
  const baseline = baselinedSpecKeys()
  const violations = result.violations.filter((v) => !baseline.has(`${rel}::spec:${v}`))
  if (violations.length === 0) process.exit(0)
  const header = `validate-spec-compliance: .vue diverges from .specs/${info.name}.md`
  const msg = [
    header,
    ``,
    `File: ${relative(ROOT, abs)}`,
    `Spec: .specs/${info.name}.md`,
    ``,
    ...violations.map((v) => `  - ${v}`),
    ``,
    `Fix the spec OR the .vue so they match 1-to-1. Run /component-verify ${info.name} to re-check.`
  ].join('\n')

  process.stderr.write(msg + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-spec-compliance hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

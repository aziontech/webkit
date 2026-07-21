#!/usr/bin/env node
// PostToolUse hook: after Write/Edit/MultiEdit on a skill (SKILL.md) or agent (.md) —
// internal (.claude/skills, .claude/agents) or consumer bundle
// (packages/webkit/cli-templates/claude/{skills,agents}) — re-read the file and verify
// its frontmatter + body match .claude/rules/authoring-docs.md. Blocks (exit 2) on any
// NEW violation; pre-existing debt is grandfathered via doc-standards-baseline.json,
// exactly like validate-spec-compliance reads authoring-baseline.json. Same engine
// (_lib/authoring-docs-checks.mjs) as the CI ratchet. Fail-open on any error.

import { readFileSync } from 'node:fs'
import { relative, resolve, sep } from 'node:path'

import { scanDoc, docFileKind } from './_lib/authoring-docs-checks.mjs'

const ROOT = process.cwd()

function baselinedKeys() {
  try {
    const entries = JSON.parse(
      readFileSync(
        resolve(ROOT, 'packages/webkit/scripts/doc-standards-baseline.json'),
        'utf-8'
      )
    )
    return new Set(Array.isArray(entries) ? entries : [])
  } catch {
    return new Set()
  }
}

function readStdin() {
  return new Promise((res) => {
    let data = ''
    process.stdin.on('data', (c) => (data += c))
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
  const rel = relative(ROOT, abs).split(sep).join('/')
  if (!docFileKind(rel)) process.exit(0)

  let content
  try {
    content = readFileSync(abs, 'utf-8')
  } catch {
    process.exit(0)
  }

  const baseline = baselinedKeys()
  const violations = scanDoc(rel, content).filter((v) => !baseline.has(`${rel}::doc:${v.id}`))
  if (violations.length === 0) process.exit(0)

  const lines = [`Webkit authoring-docs validation blocked ${input.tool_name} on ${rel}.`, '']
  for (const v of violations) lines.push(`  [${v.id}] ${v.message}`)
  lines.push('')
  lines.push(
    'These are the doc standards in .claude/rules/authoring-docs.md. Fix the frontmatter ' +
      '(name==folder/filename, non-empty description, correct scope; consumer skills webkit-* + ' +
      'status + last_updated) or remove the file-as-example reference (find components via the ' +
      'MCP/catalog). Do not work around the hook.'
  )
  process.stderr.write(lines.join('\n') + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`validate-authoring-docs hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

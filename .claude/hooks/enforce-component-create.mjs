#!/usr/bin/env node
// PreToolUse hook: blocks the FIRST Write that creates a new component file under
// packages/webkit/src/components/<category>/<name>/<file>.vue when the agent
// has not yet read or invoked the `component-create` skill in this session.

import { existsSync, readFileSync, statSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const ROOT = process.cwd()
const CATEGORIES = [
  'actions',
  'content',
  'data',
  'feedback',
  'inputs',
  'layout',
  'navigation',
  'overlay',
  'utils'
]

function readStdin() {
  return new Promise((res) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => res(data))
  })
}

function pipelineReferencedInTranscript(transcriptPath) {
  if (!transcriptPath || !existsSync(transcriptPath)) return false
  try {
    const content = readFileSync(transcriptPath, 'utf-8')
    // The gate is satisfied when ANY of these markers appears in the transcript.
    // Each marker is concrete evidence that the agent loaded the workflow:
    //
    //  1. New pipeline — the orchestrator command or any of its skills/agents.
    //  2. A spec file under .specs/ was read (the agent is following the contract).
    //  3. Cultural anchors — root or package AGENTS.md.
    //  4. Backward-compat — the legacy skill or the literal token.
    //
    // The hook fails open by design; any of the markers is enough.
    return (
      // 1. New pipeline
      /\.claude\/commands\/(component-create|spec-create|component-verify)\.md/i.test(content) ||
      /\.claude\/skills\/(component-scaffold|spec-create|spec-validate|figma-discover|token-map|reuse-audit|structure-decide|storybook-write|code-connect-write|validate-component|echo-report)\/SKILL\.md/i.test(content) ||
      /\.claude\/agents\/(scaffolder|spec-author|spec-validator|figma-extractor|token-mapper|reuse-auditor|structure-decider|storybook-writer|code-connect-writer|echo-reporter)\.md/i.test(content) ||
      // 2. Spec was loaded
      /\.specs\/[a-z][a-z0-9-]*\.md/i.test(content) ||
      // 3. Cultural anchors
      /packages\/webkit\/AGENTS\.md/i.test(content) ||
      /(?:^|\/)AGENTS\.md\b/i.test(content) ||
      // 4. Backward-compat
      /skills\/component-create\.md/i.test(content) ||
      /\bcomponent-create\b/i.test(content)
    )
  } catch {
    return false
  }
}

function fileIsRecent(filePath, maxAgeSeconds = 10) {
  // If the file exists and was created very recently (within the same Write
  // burst), still treat as "creation" — let the gate fire.
  try {
    const st = statSync(filePath)
    const ageSec = (Date.now() - st.birthtimeMs) / 1000
    return ageSec <= maxAgeSeconds
  } catch {
    return false
  }
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

  const relPath = relative(ROOT, resolve(filePath))
  const match = relPath.match(
    /^packages\/webkit\/src\/components\/([^/]+)\/([^/]+)\/[^/]+\.vue$/
  )
  if (!match) process.exit(0)

  const [, category] = match
  if (!CATEGORIES.includes(category)) process.exit(0)

  // If the .vue already exists and is not a brand-new creation, this is an
  // edit-via-Write — let it pass (validate-tokens.mjs still applies).
  if (existsSync(filePath) && !fileIsRecent(filePath)) process.exit(0)

  if (skillReferencedInTranscript(input.transcript_path)) process.exit(0)

  const msg = [
    `Component-create gate: blocked Write to ${relPath}`,
    '',
    `This file is a new webkit-layer component. Before creating it, the agent`,
    `MUST run the spec-driven pipeline:`,
    '',
    `  1. /spec-create <name>          — drafts .specs/<name>.md`,
    `  2. /component-create <name>     — orchestrates the isolated sub-agents`,
    '',
    `Entry points and rules:`,
    `  .claude/commands/component-create.md   (orchestrator)`,
    `  .claude/commands/spec-create.md        (spec drafting)`,
    `  .claude/skills/<phase>/SKILL.md        (focused skills)`,
    `  .claude/rules/*.md                     (immutable rules)`,
    `  .specs/<name>.md                       (per-component contract)`,
    '',
    `See also: .claude/AGENTS.md § 11.2, packages/webkit/AGENTS.md,`,
    `         .claude/docs/DESIGN.md (authoritative tokens),`,
    `         .claude/docs/COMPONENT_REQUIREMENTS.md § "Webkit Layer Pattern (in-depth)".`
  ].join('\n')

  process.stderr.write(msg + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`enforce-component-create hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

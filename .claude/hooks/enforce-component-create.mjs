#!/usr/bin/env node
// PreToolUse hook: blocks the FIRST Write that creates a new component file under
// packages/webkit/src/components/webkit/<category>/<name>/<file>.vue when the agent
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

function skillReferencedInTranscript(transcriptPath) {
  if (!transcriptPath || !existsSync(transcriptPath)) return false
  try {
    const content = readFileSync(transcriptPath, 'utf-8')
    // Trigger considered satisfied when ANY of these markers appears anywhere
    // in the transcript:
    //  - explicit mention of the skill name `component-create`
    //  - file path of the skill itself
    //  - reference to AGENTS.md § 11 or packages/webkit/AGENTS.md (the skill
    //    pointers; if the agent loaded those, it saw the trigger spec)
    return (
      /\bcomponent-create\b/i.test(content) ||
      /skills\/component-create\.md/i.test(content) ||
      /packages\/webkit\/AGENTS\.md/i.test(content)
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
    /^packages\/webkit\/src\/components\/webkit\/([^/]+)\/([^/]+)\/[^/]+\.vue$/
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
    `MUST follow the skill at skills/component-create.md (Figma token discovery,`,
    `Design.md mapping, monolithic vs Composition Pattern decision, package.json,`,
    `exports entry, Storybook story with full features, a11y/UX checklists).`,
    '',
    `Read skills/component-create.md and follow its workflow before retrying.`,
    `See also: AGENTS.md § 11, packages/webkit/AGENTS.md,`,
    `         packages/webkit/docs/COMPONENT_REQUIREMENTS.md § "Webkit Layer Pattern (in-depth)".`
  ].join('\n')

  process.stderr.write(msg + '\n')
  process.exit(2)
}

main().catch((err) => {
  process.stderr.write(`enforce-component-create hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

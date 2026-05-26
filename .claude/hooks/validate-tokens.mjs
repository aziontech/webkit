#!/usr/bin/env node
// PreToolUse hook: blocks Write/Edit/MultiEdit on packages/webkit/src/components/**
// (excluding the wip/ legacy zone) when the content violates DESIGN.md /
// COMPONENT_REQUIREMENTS.md rules: hex/rgb/hsl colors, Tailwind palette, raw
// typography, PrimeVue color utils, `class` in defineProps, `any`, `@ts-ignore`.

import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

const ROOT = process.cwd()
const TARGET_PREFIX = 'packages/webkit/src/components/'
const WIP_PREFIX = 'packages/webkit/src/components/wip/'

const VIOLATIONS = [
  {
    id: 'hex-color',
    regex: /#[0-9a-fA-F]{3,8}\b/g,
    message:
      'Hex color hardcoded. Use semantic tokens (var(--primary), var(--bg-surface), var(--text-default), ...).'
  },
  {
    id: 'rgb-hsl',
    regex: /\b(rgba?|hsla?)\s*\(/g,
    message: 'RGB/HSL hardcoded. Use semantic tokens via var(--*).'
  },
  {
    id: 'tailwind-palette',
    regex:
      /\b(?:bg|text|border|ring|outline|fill|stroke|divide|placeholder|caret|accent)-(?:gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b/g,
    message:
      'Tailwind palette color. Use semantic webkit tokens (var(--primary), var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'typography-raw-size',
    regex: /\btext-(?:xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)\b(?!-)/g,
    message:
      'Raw Tailwind text size. Use generated class from DESIGN.md (text-heading-md, text-body-sm, text-button-lg, text-label-md, ...).'
  },
  {
    id: 'typography-raw-length',
    regex: /text-\[length:var\(--text-/g,
    message:
      'Raw typography token. Use generated class from DESIGN.md (text-heading-md, text-body-sm, text-button-lg, ...).'
  },
  {
    id: 'leading-raw',
    regex: /\bleading-(?:3|4|5|6|7|8|9|10|11|12|tight|snug|relaxed|loose|\[)/g,
    message:
      'Raw leading-* class. Line-height is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'tracking-raw',
    regex: /\btracking-(?:tighter|tight|wide|wider|widest|\[)/g,
    message:
      'Raw tracking-* class. Letter-spacing is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'font-family-raw',
    regex: /\b(?:font-(?:sans|serif|mono|sora|proto-mono)\b|font-\[family-name:)/g,
    message:
      'Raw font-family. Font family is part of the generated typography class (DESIGN.md); do not override.'
  },
  {
    id: 'primevue-color',
    regex:
      /\b(?:text-color|surface-(?:0|50|100|200|300|400|500|600|700|800|900|ground|section|card|overlay|border|hover))\b/g,
    message:
      'PrimeVue color utility. Use semantic webkit tokens (var(--text-default), var(--bg-surface), ...).'
  },
  {
    id: 'class-in-defineprops',
    regex: /defineProps\s*[<(][^>)]*['"]?class['"]?\s*:/s,
    message:
      '`class` declared in defineProps. Use useAttrs() + inheritAttrs:false + rootClasses with attrs.class.'
  },
  {
    id: 'any-type',
    regex: /(?::\s*any\b(?!-)|<any>|\bas\s+any\b|Array<any>|Record<[^>]*any[^>]*>)/g,
    message: '`any` type. Provide a proper TypeScript type.'
  },
  {
    id: 'ts-ignore',
    regex: /\/\/\s*@ts-(?:ignore|nocheck|expect-error)\b/g,
    message: '`@ts-ignore`/`@ts-nocheck`/`@ts-expect-error`. Fix the underlying type issue.'
  }
]

function readStdin() {
  return new Promise((resolveStdin) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => resolveStdin(data))
  })
}

function collectContent(input) {
  const tool = input.tool_name
  const ti = input.tool_input ?? {}
  if (tool === 'Write') return [ti.content ?? '']
  if (tool === 'Edit') return [ti.new_string ?? '']
  if (tool === 'MultiEdit') return (ti.edits ?? []).map((e) => e.new_string ?? '')
  return []
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

  const newContents = collectContent(input).join('\n')
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

#!/usr/bin/env node

import { readdirSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import {
  CURRENT_TEMPLATE,
  TEMPLATE_2_SECTIONS,
  TEMPLATE_2_SINCE,
  parseSpecFile,
  templateSectionErrors,
  templateVersion
} from '../../../.claude/hooks/_lib/spec.mjs'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_SPECS_DIR = resolve(SCRIPT_DIR, '../../../.specs')
const EXEMPT = new Set(['_template.md'])

export function checkSpecTemplates(specsDir = DEFAULT_SPECS_DIR) {
  const findings = []
  let current = 0
  let legacy = 0
  const names = readdirSync(specsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md') && !EXEMPT.has(e.name))
    .map((e) => e.name)
    .sort()
  for (const name of names) {
    const { frontmatter, body } = parseSpecFile(join(specsDir, name))
    if (!frontmatter) continue
    if (templateVersion(frontmatter) >= CURRENT_TEMPLATE) current++
    else legacy++
    for (const error of templateSectionErrors(frontmatter, body)) findings.push({ name, error })
  }
  return { findings, current, legacy }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const { findings, current, legacy } = checkSpecTemplates()
  if (findings.length) {
    process.stderr.write(
      `✖ ${findings.length} spec template finding(s):\n` +
        findings.map((f) => `  .specs/${f.name}: ${f.error}`).join('\n') +
        `\n\nTemplate ${CURRENT_TEMPLATE} specs fill ${TEMPLATE_2_SECTIONS.map((s) => `## ${s}`).join(', ')}` +
        ` (see .specs/_template.md); every spec created on or after ${TEMPLATE_2_SINCE} is on template ${CURRENT_TEMPLATE}.\n`
    )
    process.exit(1)
  }
  process.stdout.write(
    `✓ spec template: ${current} spec(s) on template ${CURRENT_TEMPLATE} complete, ${legacy} older spec(s) exempt\n`
  )
}

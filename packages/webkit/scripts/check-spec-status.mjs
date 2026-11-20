#!/usr/bin/env node

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DEFAULT_SPECS_DIR = resolve(SCRIPT_DIR, '../../../.specs')
const EXEMPT = new Set(['_template.md'])

export function findDraftSpecs(specsDir = DEFAULT_SPECS_DIR) {
  return readdirSync(specsDir, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.md') && !EXEMPT.has(e.name))
    .map((e) => e.name)
    .filter((name) => {
      const head = readFileSync(join(specsDir, name), 'utf-8').match(/^---\n([\s\S]*?)\n---/)
      return head ? /^status:\s*draft\s*$/m.test(head[1]) : false
    })
    .sort()
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const drafts = findDraftSpecs()
  if (drafts.length) {
    process.stderr.write(
      `✖ ${drafts.length} spec(s) in status: draft — a draft never lands on main.\n` +
        drafts.map((name) => `  .specs/${name}`).join('\n') +
        '\n\nApprove the spec (spec-validator) or keep it on your branch until it is approved.\n'
    )
    process.exit(1)
  }
  process.stdout.write('✓ no spec in status: draft (.specs/_template.md excepted)\n')
}

#!/usr/bin/env node

import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { checkAllSpecs, specFiles } from '../../../.claude/hooks/_lib/spec-integrity.mjs'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

export function formatFailures(failures) {
  return failures
    .map(({ file, errors }) =>
      [`✖ ${file}`, ...errors.flatMap((e) => e.lines.map((l) => (l ? `    ${l}` : '')))].join('\n')
    )
    .join('\n\n')
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const failures = checkAllSpecs(ROOT)
  const total = specFiles(resolve(ROOT, '.specs')).length
  if (failures.length) {
    process.stderr.write(
      `${formatFailures(failures)}\n\n${failures.length} of ${total} spec(s) fail the integrity check (frontmatter, template, status, checksum).\n`
    )
    process.exit(1)
  }
  process.stdout.write(
    `✓ ${total} spec(s): valid frontmatter, approved or beyond, shipped components implemented, body checksum matches\n`
  )
}

#!/usr/bin/env node

import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { checkDocsMarkdown } from './lib/docs-markdown.mjs'

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), '../../..')

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const findings = checkDocsMarkdown(REPO)
  if (findings.length) {
    process.stderr.write(
      `✖ ${findings.length} docs Markdown finding(s) (.claude/rules/authoring-docs.md § Rendered docs):\n` +
        findings
          .map(
            (finding) => `  ${finding.path}:${finding.line} [${finding.rule}] ${finding.message}`
          )
          .join('\n') +
        '\n'
    )
    process.exit(1)
  }
  process.stdout.write(
    "✓ docs Markdown: one example-pair vocabulary (Do / Don't), no task list in a rendered page\n"
  )
}

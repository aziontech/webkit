import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import { loadCatalog } from '../eslint-plugin/lib/catalog.js'
import { resolveEslintBin } from './report.js'

export const CANARY_DIR = '.webkit-canary'

const ASTRO_LINT_PACKAGES = ['astro-eslint-parser', 'eslint-plugin-astro']

function astroParserAvailable(cwd) {
  const require = createRequire(join(cwd, '__webkit_canary__.js'))
  try {
    for (const name of ASTRO_LINT_PACKAGES) require.resolve(name)
    return true
  } catch {
    return false
  }
}

function buildFixtures(cwd) {
  const astroAvailable = astroParserAvailable(cwd)
  return [
    {
      file: 'denied-import.vue',
      rule: 'webkit/no-deep-internal-import',
      optional: false,
      content: `<script setup>
import Button from '@aziontech/webkit/src/components/action/button/button.vue'
</script>

<template>
  <Button>deliberately reaching into internals</Button>
</template>
`
    },
    {
      file: 'unknown-export.vue',
      rule: 'webkit/no-unknown-import',
      optional: false,
      content: `<script setup>
import Nope from '@aziontech/webkit/this-export-does-not-exist'
</script>

<template>
  <Nope />
</template>
`
    },
    {
      file: 'hardcoded-color.vue',
      rule: 'webkit/no-hardcoded-color',
      optional: false,
      content: `<template>
  <div class="bg-[#ff0000]">deliberately hardcoded</div>
</template>
`
    },
    {
      file: 'hardcoded-color.astro',
      rule: 'webkit/no-hardcoded-color',
      optional: !astroAvailable,
      why: `${ASTRO_LINT_PACKAGES.join(' / ')} is not installed in this project`,
      content: `---
const label = 'deliberately hardcoded'
---

<div class="bg-[#ff0000]">{label}</div>
`
    }
  ]
}

function lintFixtures(cwd, command, dir) {
  const proc = spawnSync(
    command.command,
    [...command.prefix, dir, '--format', 'json', '--no-ignore', '--no-error-on-unmatched-pattern'],
    { cwd, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 }
  )
  if (proc.error) return { ok: false, reason: proc.error.message }
  let results
  try {
    results = JSON.parse(proc.stdout)
  } catch {
    const detail = (proc.stderr || proc.stdout || '').trim().split('\n').slice(0, 6).join('\n')
    return { ok: false, reason: `ESLint produced no JSON report (exit ${proc.status}).\n${detail}` }
  }

  const byFile = new Map()
  for (const result of results) {
    const name = result.filePath.slice(result.filePath.lastIndexOf('/') + 1)
    const rules = new Set()
    let fatal = null
    for (const message of result.messages) {
      if (message.fatal) fatal = message.message
      else if (message.ruleId) rules.add(message.ruleId)
    }
    byFile.set(name, { rules, fatal })
  }
  return { ok: true, byFile }
}

function verdict(fixture, seen) {
  if (!seen) {
    if (fixture.optional) {
      return {
        status: 'skip',
        line: `SKIP  ${fixture.rule} ${fixture.file} — not linted by this project (${fixture.why}).`
      }
    }
    return {
      status: 'fail',
      line: `FAIL  ${fixture.rule} ${fixture.file} — was not linted at all.`
    }
  }
  if (seen.fatal) {
    return {
      status: 'fail',
      line: `FAIL  ${fixture.rule} ${fixture.file} — failed to parse (${seen.fatal}); the rule never ran.`
    }
  }
  if (seen.rules.has(fixture.rule))
    return { status: 'ok', line: `OK    ${fixture.rule} ${fixture.file}` }
  if (fixture.optional) {
    return {
      status: 'skip',
      line: `SKIP  ${fixture.rule} ${fixture.file} — did not reach this file type (${fixture.why || 'no matching preset'}).`
    }
  }
  return { status: 'fail', line: `FAIL  ${fixture.rule} ${fixture.file} — did not fire.` }
}

function summaryLine(fixtures, failed, skipped) {
  const required = fixtures.filter((f) => !f.optional).length
  if (failed !== 0) {
    return (
      `${failed} canary/canaries did not fire. The design-system rules are NOT reaching ` +
      'this project, so any adoption number it reports is too low.'
    )
  }
  return (
    `${required} of ${required} required canaries fired` +
    (skipped ? `, ${skipped} skipped` : '') +
    ' — the rules reach this project.'
  )
}

function reportCanaries(fixtures, lint, catalog) {
  const verdicts = fixtures.map((fixture) => verdict(fixture, lint.byFile.get(fixture.file)))
  const failed = verdicts.filter((v) => v.status === 'fail').length
  const skipped = verdicts.filter((v) => v.status === 'skip').length
  const lines = [...verdicts.map((v) => v.line), '']
  if (!catalog.available) {
    lines.push('The webkit catalog did not resolve, which disables the catalog-backed rules.')
  }
  lines.push(summaryLine(fixtures, failed, skipped))
  return { exitCode: failed === 0 ? 0 : 1, lines }
}

export function runCanary(cwd, options = {}) {
  let command
  try {
    command = resolveEslintBin(cwd)
  } catch (error) {
    return { exitCode: 1, lines: [`FAIL  could not resolve ESLint from ${cwd}: ${error.message}`] }
  }

  const catalog = loadCatalog(cwd)
  const dir = join(cwd, CANARY_DIR)
  const fixtures = options.fixtures ?? buildFixtures(cwd)

  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  try {
    for (const fixture of fixtures) writeFileSync(join(dir, fixture.file), fixture.content)
    const lint = lintFixtures(cwd, command, CANARY_DIR)
    if (!lint.ok) {
      return { exitCode: 1, lines: [`FAIL  could not lint the canaries: ${lint.reason}`] }
    }
    return reportCanaries(fixtures, lint, catalog)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

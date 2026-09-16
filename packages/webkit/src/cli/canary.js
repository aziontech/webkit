// `webkit canary` — proves the design-system rules still reach this project.
//
// Inverted logic: each fixture violates one rule on purpose and must keep being flagged
// by that exact rule. A fixture that comes back clean means the rules stopped arriving,
// which otherwise only ever makes the adoption number look better. See
// docs/toolkit/report.md § Why canary exists.

import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { join } from 'node:path'

import { loadCatalog } from '../eslint-plugin/catalog.js'
import { resolveEslintBin } from './report.js'

/** Written under the project root so the project's own ESLint config resolves for them. */
export const CANARY_DIR = '.webkit-canary'

/** True when the consumer's project can actually parse `.astro` files. */
function astroParserAvailable(cwd) {
  const require = createRequire(join(cwd, '__webkit_canary__.js'))
  try {
    require.resolve('astro-eslint-parser')
    require.resolve('eslint-plugin-astro')
    return true
  } catch {
    return false
  }
}

/** One fixture per guarded rule. The `.astro` entry catches a preset that skips Astro. */
export function buildFixtures(cwd) {
  const astroAvailable = astroParserAvailable(cwd)
  return [
    {
      file: 'denied-import.vue',
      rule: 'webkit/no-deep-internal-import',
      optional: false,
      content: `<script setup>
import Button from '@aziontech/webkit/src/components/actions/button/button.vue'
</script>

<template>
  <Button>deliberately reaching into internals</Button>
</template>
`
    },
    {
      file: 'unknown-export.vue',
      rule: 'webkit/valid-import-path',
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
      why: 'astro-eslint-parser / eslint-plugin-astro is not installed in this project',
      content: `---
const label = 'deliberately hardcoded'
---

<div class="bg-[#ff0000]">{label}</div>
`
    }
  ]
}

/** Which rules fired per fixture. A fatal parse error is reported, never counted as a pass. */
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

/**
 * Runs the canary and returns `{exitCode, lines}`; the caller writes, so this stays
 * testable. `options.fixtures` lets tests inject a fixture list instead of the real one.
 */
export function runCanary(cwd, options = {}) {
  const lines = []
  const say = (line = '') => lines.push(line)

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

    let failed = 0
    let skipped = 0
    for (const fixture of fixtures) {
      const seen = lint.byFile.get(fixture.file)
      if (!seen) {
        if (fixture.optional) {
          skipped += 1
          say(
            `SKIP  ${fixture.rule} ${fixture.file} — not linted by this project (${fixture.why}).`
          )
          continue
        }
        failed += 1
        say(`FAIL  ${fixture.rule} ${fixture.file} — was not linted at all.`)
        continue
      }
      if (seen.fatal) {
        failed += 1
        say(
          `FAIL  ${fixture.rule} ${fixture.file} — failed to parse (${seen.fatal}); the rule never ran.`
        )
        continue
      }
      if (seen.rules.has(fixture.rule)) {
        say(`OK    ${fixture.rule} ${fixture.file}`)
        continue
      }
      if (fixture.optional) {
        skipped += 1
        say(
          `SKIP  ${fixture.rule} ${fixture.file} — did not reach this file type (${fixture.why || 'no matching preset'}).`
        )
        continue
      }
      failed += 1
      say(`FAIL  ${fixture.rule} ${fixture.file} — did not fire.`)
    }

    say()
    if (!catalog.available) {
      say('The webkit catalog did not resolve, which disables the catalog-backed rules.')
    }
    const required = fixtures.filter((f) => !f.optional).length
    say(
      failed === 0
        ? `${required} of ${required} required canaries fired` +
            (skipped ? `, ${skipped} skipped` : '') +
            ' — the rules reach this project.'
        : `${failed} canary/canaries did not fire. The design-system rules are NOT reaching ` +
            'this project, so any adoption number it reports is too low.'
    )
    return { exitCode: failed === 0 ? 0 : 1, lines }
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

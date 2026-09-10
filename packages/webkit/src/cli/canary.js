// `webkit canary` — proves the design-system rules still reach this project.
//
// Inverted logic: each fixture violates one rule on purpose and must keep being flagged by
// that exact rule. A fixture that comes back clean means the rules stopped arriving, which
// otherwise only ever makes the adoption number look better. See docs/toolkit/report.md.

import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import { loadCatalog } from '../eslint-plugin/catalog.js'

/** Written under the project root so the project's ESLint config resolves for them. */
export const CANARY_DIR = '.webkit-canary'

/** One fixture per guarded rule. The `.astro` entry catches a preset that skips Astro. */
export const FIXTURES = [
  {
    file: 'denied-import.vue',
    rule: 'webkit/no-deep-internal-import',
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
    content: `<template>
  <div class="bg-[#ff0000]">deliberately hardcoded</div>
</template>
`
  },
  {
    file: 'foreign-library.vue',
    rule: 'webkit/prefer-webkit-component',
    content: `<script setup>
import Dropdown from 'primevue/dropdown'
</script>

<template>
  <Dropdown />
</template>
`
  },
  {
    file: 'hardcoded-color.astro',
    rule: 'webkit/no-hardcoded-color',
    optional: true,
    why: 'the project may not lint .astro at all',
    content: `---
const label = 'deliberately hardcoded'
---

<div class="bg-[#ff0000]">{label}</div>
`
  }
]

function eslintCommand(cwd) {
  const shim = join(
    cwd,
    'node_modules',
    '.bin',
    process.platform === 'win32' ? 'eslint.cmd' : 'eslint'
  )
  // The shim, not the bin file: pnpm's shim exports NODE_PATH before exec'ing node, and
  // without it ESLint cannot resolve some parsers and silently uses the default one.
  return existsSync(shim) ? shim : null
}

/** Which rules fired per fixture. A fatal parse error is reported, never counted as a pass. */
function lintFixtures(cwd, command, dir) {
  const proc = spawnSync(
    command,
    [dir, '--format', 'json', '--no-ignore', '--no-error-on-unmatched-pattern'],
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

/** Returns `{ exitCode, lines }`; the caller writes, so the checks stay testable. */
export function runCanary(cwd, options = {}) {
  const lines = []
  const say = (line = '') => lines.push(line)

  const command = eslintCommand(cwd)
  if (!command) {
    return {
      exitCode: 1,
      lines: ['FAIL  no node_modules/.bin/eslint in this project — install ESLint, then re-run.']
    }
  }

  const catalog = loadCatalog(cwd)
  const dir = join(cwd, CANARY_DIR)
  const fixtures = options.fixtures ?? FIXTURES

  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  try {
    for (const fixture of fixtures) writeFileSync(join(dir, fixture.file), fixture.content)
    const lint = lintFixtures(cwd, command, CANARY_DIR)
    if (!lint.ok)
      return { exitCode: 1, lines: [`FAIL  could not lint the canaries: ${lint.reason}`] }

    let failed = 0
    let skipped = 0
    for (const fixture of fixtures) {
      const seen = lint.byFile.get(fixture.file)
      if (!seen) {
        if (fixture.optional) {
          skipped += 1
          say(`SKIP  ${fixture.file} — not linted by this project (${fixture.why}).`)
          continue
        }
        failed += 1
        say(`FAIL  ${fixture.file} was not linted at all — expected ${fixture.rule}.`)
        continue
      }
      if (seen.fatal) {
        failed += 1
        say(`FAIL  ${fixture.file} failed to parse (${seen.fatal}) — the rule never ran.`)
        continue
      }
      if (seen.rules.has(fixture.rule)) {
        say(`OK    ${fixture.file} — ${fixture.rule}`)
        continue
      }
      if (fixture.optional) {
        skipped += 1
        say(`SKIP  ${fixture.file} — ${fixture.rule} does not reach this file type.`)
        continue
      }
      failed += 1
      say(`FAIL  ${fixture.file} — ${fixture.rule} did not fire.`)
    }

    say()
    if (!catalog.available) {
      say('The webkit catalog did not resolve, which disables the catalog-backed rules.')
    }
    const required = fixtures.filter((f) => !f.optional).length
    const optionalFired = fixtures.filter((f) => f.optional).length - skipped
    say(
      failed === 0
        ? `${required} of ${required} required canaries fired` +
            (optionalFired ? `, plus ${optionalFired} optional` : '') +
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

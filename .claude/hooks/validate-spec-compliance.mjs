#!/usr/bin/env node
// PostToolUse hook: after a Write/Edit/MultiEdit on a webkit-layer .vue,
// re-read the file and verify the props/events/slots/animations in the code
// match the spec at .specs/<name>.md 1-to-1. Blocks on any divergence.

import { existsSync, readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'
import {
  extractAnimationClasses,
  getSection,
  hasMotionReduceEscape,
  isLegacyComponent,
  parseSpecFile,
  parseTable,
  parseVueSfc,
  resolveSpecForComponentPath
} from './_lib/spec.mjs'

const ROOT = process.cwd()

function readStdin() {
  return new Promise((res) => {
    let data = ''
    process.stdin.on('data', (chunk) => (data += chunk))
    process.stdin.on('end', () => res(data))
  })
}

function diff(actualSet, expectedSet) {
  const missing = [...expectedSet].filter((x) => !actualSet.has(x))
  const extra = [...actualSet].filter((x) => !expectedSet.has(x))
  return { missing, extra }
}

async function main() {
  const raw = await readStdin()
  let input
  try {
    input = JSON.parse(raw)
  } catch {
    process.exit(0)
  }

  if (!['Write', 'Edit', 'MultiEdit'].includes(input.tool_name)) process.exit(0)
  const filePath = input.tool_input?.file_path
  if (!filePath) process.exit(0)

  const abs = resolve(filePath)
  const info = resolveSpecForComponentPath(abs, ROOT)
  if (!info) process.exit(0)
  if (isLegacyComponent(info.category, info.name, ROOT)) process.exit(0)
  if (!existsSync(abs)) process.exit(0)
  if (!existsSync(info.specPath)) process.exit(0)

  const violations = []

  const vueText = readFileSync(abs, 'utf-8')
  const sfc = parseVueSfc(vueText)
  const { body } = parseSpecFile(info.specPath)

  // Determine if this is the root .vue or a sub-component .vue.
  const fileName = abs.split('/').pop().replace(/\.vue$/, '')
  const isRoot = fileName === info.name

  if (isRoot) {
    // ---- Props ----
    const specPropsRows = parseTable(getSection(body, 'Props'))
    const specPropNames = new Set(
      specPropsRows.map((r) => (r.prop ?? '').replace(/^`|`$/g, '').trim()).filter(Boolean)
    )
    const codePropNames = new Set(sfc.props.map((p) => p.name))
    const propsDiff = diff(codePropNames, specPropNames)
    if (propsDiff.missing.length) violations.push(`Props missing in .vue: ${propsDiff.missing.join(', ')}`)
    if (propsDiff.extra.length) violations.push(`Props in .vue not in spec: ${propsDiff.extra.join(', ')}`)

    // ---- Events ----
    const specEventsRows = parseTable(getSection(body, 'Events'))
    const specEventNames = new Set(
      specEventsRows.map((r) => (r.event ?? '').replace(/^`|`$/g, '').trim()).filter(Boolean)
    )
    const codeEventNames = new Set(sfc.emits.map((e) => e.name))
    const eventsDiff = diff(codeEventNames, specEventNames)
    if (eventsDiff.missing.length) violations.push(`Events missing in .vue: ${eventsDiff.missing.join(', ')}`)
    if (eventsDiff.extra.length) violations.push(`Events in .vue not in spec: ${eventsDiff.extra.join(', ')}`)

    // ---- Slots ----
    const specSlotsRows = parseTable(getSection(body, 'Slots'))
    const specSlotNames = new Set(
      specSlotsRows.map((r) => (r.slot ?? '').replace(/^`|`$/g, '').trim()).filter(Boolean)
    )
    const codeSlotNames = new Set(sfc.slots.map((s) => s.name))
    const slotsDiff = diff(codeSlotNames, specSlotNames)
    if (slotsDiff.missing.length) violations.push(`Slots missing in .vue: ${slotsDiff.missing.join(', ')}`)
    if (slotsDiff.extra.length) violations.push(`Slots in .vue not in spec: ${slotsDiff.extra.join(', ')}`)

    // ---- defineOptions.name ----
    const expectedName = toPascal(info.name)
    if (sfc.defineOptionsName !== expectedName) {
      violations.push(
        `defineOptions.name "${sfc.defineOptionsName ?? '(missing)'}" must equal "${expectedName}"`
      )
    }

    // ---- BEM testid fallback ----
    const expectedTestId = `'${info.category}-${info.name}'`
    if (!vueText.includes(expectedTestId)) {
      violations.push(
        `data-testid fallback "${expectedTestId}" not found in <script setup>. Expected: ?? ${expectedTestId}`
      )
    }
  }

  // ---- Animations cross-check (applies to both root and sub-components) ----
  const motionSection = getSection(body, 'Motion & Animations')
  if (motionSection !== null) {
    const codeAnimClasses = new Set(extractAnimationClasses(vueText).filter((c) => c.startsWith('animate-')))
    const specAnimMatches = (motionSection.match(/animate-[a-z0-9-]+/g) ?? []).filter(
      (c) => c !== 'animate-none'
    )
    const specAnimClasses = new Set(specAnimMatches)
    const isNone = /^_none_/.test(motionSection.trim().split('\n').slice(2).join('\n').trim())

    if (isNone) {
      if (codeAnimClasses.size > 0 || /\btransition-/.test(vueText)) {
        violations.push(
          `Motion & Animations says _none_ but .vue contains: ${[...codeAnimClasses].join(', ') || 'transition-*'}`
        )
      }
    } else {
      const animDiff = diff(codeAnimClasses, specAnimClasses)
      if (animDiff.missing.length) {
        violations.push(`Animation classes in spec but missing in .vue: ${animDiff.missing.join(', ')}`)
      }
      if (animDiff.extra.length) {
        violations.push(`Animation classes in .vue but not in spec: ${animDiff.extra.join(', ')}`)
      }
      if (codeAnimClasses.size > 0 && !hasMotionReduceEscape(vueText)) {
        violations.push(
          `Animations present without motion-reduce:* escape. Add motion-reduce:animate-none on the same class string.`
        )
      }
    }
  }

  if (violations.length === 0) process.exit(0)

  const header = `validate-spec-compliance: .vue diverges from .specs/${info.name}.md`
  const msg = [
    header,
    ``,
    `File: ${relative(ROOT, abs)}`,
    `Spec: .specs/${info.name}.md`,
    ``,
    ...violations.map((v) => `  - ${v}`),
    ``,
    `Fix the spec OR the .vue so they match 1-to-1. Run /component-verify ${info.name} to re-check.`
  ].join('\n')

  process.stderr.write(msg + '\n')
  process.exit(2)
}

function toPascal(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

main().catch((err) => {
  process.stderr.write(`validate-spec-compliance hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

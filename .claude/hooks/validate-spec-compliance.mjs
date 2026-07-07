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

/** Valid animate-* names from the generated catalog, or null if it can't be read. */
function loadCatalogAnimations() {
  try {
    const raw = readFileSync(resolve(ROOT, 'packages/webkit/catalog.json'), 'utf-8')
    const anims = JSON.parse(raw)?.tokens?.animations
    return Array.isArray(anims) ? new Set(anims) : null
  } catch {
    return null
  }
}

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

    // ---- Naming conventions (B1): things the spec tables can't catch ----
    // Visual-variant prop must be `kind` (never variant/appearance/intent). `color` is
    // left out on purpose — some components legitimately take a color value.
    const FORBIDDEN_PROP = { variant: 'kind', appearance: 'kind', intent: 'kind' }
    for (const p of sfc.props) {
      const alt = FORBIDDEN_PROP[p.name]
      if (alt) {
        violations.push(`Prop "${p.name}" is not allowed — use "${alt}" (.claude/rules/naming.md).`)
      }
      if (/^(is|has)[A-Z]/.test(p.name)) {
        const suggested = p.name.replace(/^(is|has)/, '').replace(/^./, (c) => c.toLowerCase())
        violations.push(`Boolean prop "${p.name}" must drop the is/has prefix (use "${suggested}").`)
      }
    }
    // Events are kebab-case (update:value, before-close). Flag a camelCase event name,
    // but never a v-model `update:*` event (its payload segment can be camelCase).
    for (const e of sfc.emits) {
      if (!e.name.includes(':') && /^[a-z]+[A-Z]/.test(e.name)) {
        const suggested = e.name.replace(/([A-Z])/g, '-$1').toLowerCase()
        violations.push(`Event "${e.name}" must be kebab-case (use "${suggested}").`)
      }
    }

    // ---- defineOptions.name ----
    const expectedName = toPascal(info.name)
    if (sfc.defineOptionsName !== expectedName) {
      violations.push(
        `defineOptions.name "${sfc.defineOptionsName ?? '(missing)'}" must equal "${expectedName}"`
      )
    }

    // ---- BEM testid fallback ----
    const expectedTestId = `'${testIdFallback(info.category, info.name)}'`
    if (!vueText.includes(expectedTestId)) {
      violations.push(
        `data-testid fallback "${expectedTestId}" not found in <script setup>. Expected: ?? ${expectedTestId}`
      )
    }
  }

  // ---- Animation catalog cross-check (independent of the spec Motion table) ----
  // Every animate-* used in code must be a real utility in the theme animation catalog
  // (semantic/animations.js + primitive --animate-*). Catches a spec + code that agree
  // on a non-existent animation (which would silently produce no CSS at build time).
  const catalogAnims = loadCatalogAnimations()
  if (catalogAnims) {
    const usedAnims = new Set(
      extractAnimationClasses(vueText)
        .filter((c) => c.startsWith('animate-') && c !== 'animate-none')
        .map((c) => c.replace(/^animate-/, ''))
    )
    for (const nameOnly of usedAnims) {
      if (!catalogAnims.has(nameOnly)) {
        violations.push(
          `Animation "animate-${nameOnly}" is not in the theme catalog. Run /add-animation ${nameOnly} ` +
            `to add it to packages/theme/src/tokens/semantic/animations.js + record a Theme gap.`
        )
      }
    }
  }

  // ---- Animations cross-check (applies to both root and sub-components) ----
  const motionSection = getSection(body, 'Motion & Animations')
  if (motionSection !== null) {
    const codeAnimClasses = new Set(
      extractAnimationClasses(vueText)
        .filter((c) => c.startsWith('animate-'))
        .filter((c) => c !== 'animate-none')
    )
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

/** inputs category: `input-<name>`, except when name already starts with `input-`. */
function testIdFallback(category, name) {
  if (category === 'inputs') {
    return name.startsWith('input-') ? name : `input-${name}`
  }
  return `${category}-${name}`
}

main().catch((err) => {
  process.stderr.write(`validate-spec-compliance hook error: ${err?.message ?? err}\n`)
  process.exit(0) // fail open
})

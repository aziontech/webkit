// Single source of truth for the spec⇄code compliance checks (no-invention, naming,
// prop/event vocabulary, defaults drift, testid, animations vs the spec/catalog).
// Consumed by TWO enforcement surfaces so they can never drift:
//   - .claude/hooks/validate-spec-compliance.mjs  → write-time gate (AI pipeline)
//   - packages/webkit/scripts/check-authoring.mjs → DS CI ratchet (repo-wide), so an
//     editor push that never ran the hook cannot merge off-spec code either.
// DS-internal only (depends on .specs/), so it lives in _lib — not in the package.

import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import {
  componentRootName,
  extractAnimationClasses,
  getSection,
  hasMotionReduceEscape,
  isLegacyComponent,
  parseSpecFile,
  parseTable,
  parseTable2,
  parseVueSfc,
  resolveSpecForComponentPath,
  resolveTypeUnion
} from './spec.mjs'
import { checkEventVocabulary, checkPropVocabulary } from './prop-vocabulary.mjs'

/** Valid animate-* names from the generated catalog, or null if it can't be read. */
function loadCatalogAnimations(ROOT) {
  try {
    const raw = readFileSync(resolve(ROOT, 'packages/webkit/catalog.json'), 'utf-8')
    const anims = JSON.parse(raw)?.tokens?.animations
    return Array.isArray(anims) ? new Set(anims) : null
  } catch {
    return null
  }
}

function diff(actualSet, expectedSet) {
  const missing = [...expectedSet].filter((x) => !actualSet.has(x))
  const extra = [...actualSet].filter((x) => !expectedSet.has(x))
  return { missing, extra }
}

export function toPascal(kebab) {
  return kebab
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('')
}

/**
 * Normalize a default value (from a spec cell or a withDefaults entry) to a comparable
 * scalar string, or null when it is not a plain scalar (skip drift check).
 */
function normalizeDefault(raw) {
  if (raw == null) return null
  const s = String(raw).trim().replace(/^`|`$/g, '').trim()
  if (s === '' || s === 'undefined' || s === 'null') return null
  if (s === 'true' || s === 'false') return s
  if (/^-?\d+(\.\d+)?$/.test(s)) return s
  const str = s.match(/^['"](.*)['"]$/)
  if (str) return `'${str[1]}'`
  return null // arrow/factory/object default — not comparable
}

/** inputs category: `input-<name>`, except when name already starts with `input-`. */
export function testIdFallback(category, name) {
  if (category === 'inputs') {
    return name.startsWith('input-') ? name : `input-${name}`
  }
  return `${category}-${name}`
}

/**
 * Run every spec⇄code compliance check for one component .vue file.
 * Returns null when the file is out of scope (no spec mapping, legacy-whitelisted, or
 * the .vue/spec is missing) — mirroring the write-time hook's skip conditions exactly.
 * Otherwise returns { info, violations: string[] } (empty array = compliant).
 */
export function collectSpecViolations(abs, ROOT, { requireSpec = false } = {}) {
  const info = resolveSpecForComponentPath(abs, ROOT)
  if (!info) return null
  if (isLegacyComponent(info.category, info.name, ROOT)) return null
  if (!existsSync(abs)) return null
  if (!existsSync(info.specPath)) {
    // The write-time hook skips spec-less files (enforce-spec-exists owns creation);
    // the CI ratchet passes requireSpec so DELETING a spec can't evade the gate.
    if (requireSpec) {
      return { info, violations: [`Spec file missing: .specs/${info.name}.md`] }
    }
    return null
  }

  const violations = []

  const vueText = readFileSync(abs, 'utf-8')
  const sfc = parseVueSfc(vueText)
  const { body } = parseSpecFile(info.specPath)

  // Root vs sub-component: the shared componentRootName predicate (spec.mjs) — the
  // same definition check-tests.mjs and enforce-test-exists.mjs use, so `<name>-root.vue`
  // compositions (tab-view, navigation-menu) count as roots on every surface.
  const isRoot = componentRootName(abs.split('/src/components/').pop()) === info.name

  if (isRoot) {
    // ---- Props ----
    const specPropsRows = parseTable(getSection(body, 'Props'))
    const specPropNames = new Set(
      specPropsRows.map((r) => (r.prop ?? '').replace(/^`|`$/g, '').trim()).filter(Boolean)
    )
    const codePropNames = new Set(sfc.props.map((p) => p.name))
    const propsDiff = diff(codePropNames, specPropNames)
    if (propsDiff.missing.length)
      violations.push(`Props missing in .vue: ${propsDiff.missing.join(', ')}`)
    if (propsDiff.extra.length)
      violations.push(`Props in .vue not in spec: ${propsDiff.extra.join(', ')}`)

    // ---- Events ----
    const specEventsRows = parseTable(getSection(body, 'Events'))
    const specEventNames = new Set(
      specEventsRows.map((r) => (r.event ?? '').replace(/^`|`$/g, '').trim()).filter(Boolean)
    )
    const codeEventNames = new Set(sfc.emits.map((e) => e.name))
    const eventsDiff = diff(codeEventNames, specEventNames)
    if (eventsDiff.missing.length)
      violations.push(`Events missing in .vue: ${eventsDiff.missing.join(', ')}`)
    if (eventsDiff.extra.length)
      violations.push(`Events in .vue not in spec: ${eventsDiff.extra.join(', ')}`)

    // ---- Slots ----
    const specSlotsRows = parseTable(getSection(body, 'Slots'))
    const specSlotNames = new Set(
      specSlotsRows.map((r) => (r.slot ?? '').replace(/^`|`$/g, '').trim()).filter(Boolean)
    )
    const codeSlotNames = new Set(sfc.slots.map((s) => s.name))
    const slotsDiff = diff(codeSlotNames, specSlotNames)
    if (slotsDiff.missing.length)
      violations.push(`Slots missing in .vue: ${slotsDiff.missing.join(', ')}`)
    if (slotsDiff.extra.length)
      violations.push(`Slots in .vue not in spec: ${slotsDiff.extra.join(', ')}`)

    // ---- Canonical prop/event vocabulary ----
    for (const v of checkPropVocabulary(sfc.props, {
      resolveTypeUnion: (t) => resolveTypeUnion(sfc.raw, t)
    })) {
      violations.push(v.message)
    }
    for (const v of checkEventVocabulary(sfc.emits)) {
      violations.push(v.message)
    }

    // ---- Default drift: spec Props "Default" column vs .vue withDefaults ----
    const specPropRows = parseTable2(getSection(body, 'Props'), 'type')
    for (const row of specPropRows) {
      const name = (row.prop ?? '').replace(/^`|`$/g, '').trim()
      if (!name) continue
      const codeRaw = sfc.defaults[name]
      if (codeRaw == null) continue // no withDefaults entry (required/controlled prop)
      const specN = normalizeDefault(row.default)
      const codeN = normalizeDefault(codeRaw)
      if (specN == null || codeN == null) continue
      if (specN !== codeN) {
        violations.push(
          `Default drift for prop "${name}": spec says ${row.default || '(empty)'} but .vue withDefaults has ${codeRaw}.`
        )
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
  // Loud, not conditional: a component that uses animate-* classes fails when the
  // generated catalog cannot be read, instead of silently skipping the check.
  const usedAnims = new Set(
    extractAnimationClasses(vueText)
      .filter((c) => c.startsWith('animate-') && c !== 'animate-none')
      .map((c) => c.replace(/^animate-/, ''))
  )
  if (usedAnims.size) {
    const catalogAnims = loadCatalogAnimations(ROOT)
    if (!catalogAnims) {
      violations.push(
        'Cannot validate animate-* classes: packages/webkit/catalog.json is missing or unreadable. ' +
          'Run `pnpm --filter @aziontech/webkit catalog:build`.'
      )
    } else {
      for (const nameOnly of usedAnims) {
        if (!catalogAnims.has(nameOnly)) {
          violations.push(
            `Animation "animate-${nameOnly}" is not in the theme catalog. Run /add-animation ${nameOnly} ` +
              `to add it to packages/theme/src/tokens/semantic/animations.js + record a Theme gap.`
          )
        }
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
        violations.push(
          `Animation classes in spec but missing in .vue: ${animDiff.missing.join(', ')}`
        )
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

  return { info, violations }
}

import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe-core against a rendered container and asserts zero violations.
 *
 * Scope: STRUCTURAL a11y only — roles, accessible names, ARIA relationships /
 * nesting, required children, hidden-focus, etc. That is what unit tests can
 * trust, and what has caught this suite's real defects (nested-interactive,
 * aria-required-children, aria-hidden-focus).
 *
 * The visual / layout rules are DISABLED below because this env does not run
 * Tailwind (components render unstyled), so they would mislead rather than help:
 *   - color-contrast / color-contrast-enhanced — need real foreground/background colors
 *   - target-size                              — needs the real rendered size
 *   - link-in-text-block                       — needs styling to tell a link from its text
 *   - scrollable-region-focusable              — needs real overflow / layout
 * Pixels & contrast belong to Storybook + visual regression, not to units.
 * See docs/TESTING_AUDIT_2026-07-02.md §2.0.
 *
 * On top of axe it also runs `expectNoPlaceholderOnlyLabels` (below) — a custom
 * guard for a real defect axe cannot express. Every suite that asserts a11y
 * through this helper gets that check for free.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container, {
    rules: {
      'color-contrast': { enabled: false },
      'color-contrast-enhanced': { enabled: false },
      'link-in-text-block': { enabled: false },
      'scrollable-region-focusable': { enabled: false },
      'target-size': { enabled: false }
    }
  })

  expect(results.violations).toEqual([])
  expectNoPlaceholderOnlyLabels(container)
}

/** Form controls axe's `label` rule applies to. */
const LABELABLE = 'input:not([type="hidden"]):not([type="submit"]):not([type="button"]), textarea'

/**
 * Fails when a form control's ONLY accessible name comes from its `placeholder`.
 *
 * axe-core does not catch this: `placeholder` is a legitimate accname fallback per
 * HTML-AAM, so `label` passes, and `label-title-only` only covers `title` /
 * `aria-describedby`. Empirically, both a bare placeholder-only input AND the
 * "<span>Start</span> + placeholder" shape produce ZERO axe violations.
 *
 * It is still a defect: the placeholder disappears as soon as the user types, so the
 * field loses its name mid-interaction, and a visible `<span>` that reads as a label
 * is not programmatically associated with anything. Every field needs a real name —
 * a `<label for>`, `aria-label`, or `aria-labelledby`.
 *
 * Known limit: this checks name SOURCES, not the full accname algorithm — an
 * `aria-labelledby` target is only credited for its `textContent` (a target named
 * solely by its own `aria-label` is not seen). If that false positive ever bites,
 * swap `hasNonPlaceholderName` for `computeAccessibleName` from
 * `dom-accessibility-api` (remove the placeholder, compute, restore).
 */
export function expectNoPlaceholderOnlyLabels(container: Element): void {
  const controls = Array.from(container.querySelectorAll<globalThis.HTMLInputElement>(LABELABLE))

  const offenders = controls
    .filter((el) => (el.getAttribute('placeholder') ?? '').trim() !== '')
    .filter((el) => !hasNonPlaceholderName(el))
    .map((el) => {
      const testId = el.getAttribute('data-testid')
      return `<${el.tagName.toLowerCase()}${testId ? ` data-testid="${testId}"` : ''} placeholder="${el.getAttribute('placeholder')}">`
    })

  expect(
    offenders,
    'Form control(s) are labelled ONLY by their placeholder, which vanishes on input. ' +
      'Add a <label for> (bind the id with useId()), an aria-label, or aria-labelledby. ' +
      'axe cannot catch this — see expectNoPlaceholderOnlyLabels.'
  ).toEqual([])
}

function hasNonPlaceholderName(el: globalThis.HTMLInputElement): boolean {
  if ((el.getAttribute('aria-label') ?? '').trim() !== '') return true
  if ((el.getAttribute('title') ?? '').trim() !== '') return true

  // Native association: `for=` and wrapping <label> both land in `.labels`.
  const labels = Array.from(el.labels ?? [])
  if (labels.some((label) => (label.textContent ?? '').trim() !== '')) return true

  const labelledBy = (el.getAttribute('aria-labelledby') ?? '').trim()
  if (labelledBy !== '') {
    const doc = el.ownerDocument
    const named = labelledBy
      .split(/\s+/)
      .map((id) => doc.getElementById(id))
      .some((node) => (node?.textContent ?? '').trim() !== '')
    if (named) return true
  }

  return false
}

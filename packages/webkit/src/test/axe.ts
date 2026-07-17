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
}

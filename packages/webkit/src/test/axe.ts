import axe from 'axe-core'
import { expect } from 'vitest'

/**
 * Runs axe-core against a rendered container and asserts zero WCAG 2.1 AA
 * violations. Meaningful only because tests render with the theme CSS loaded
 * (see setup.ts) — contrast checks would be unreliable on unstyled DOM.
 */
export async function expectNoA11yViolations(container: Element): Promise<void> {
  const results = await axe.run(container)
  expect(results.violations).toEqual([])
}

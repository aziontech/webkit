import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import PlatformShell from './platform-shell.vue'

// No story exists for this template — render it directly per .claude/rules/testing.md.
describe('PlatformShell', () => {
  it('mounts with its default testid and renders the default slot content', () => {
    const { getByTestId, getByText } = render(PlatformShell, {
      slots: { default: '<p>page body</p>' }
    })
    expect(getByTestId('template-platform-shell')).toBeTruthy()
    expect(getByText('page body')).toBeTruthy()
  })

  it('lets a consumer data-testid override the fallback', () => {
    const { getByTestId } = render(PlatformShell, { attrs: { 'data-testid': 'my-shell' } })
    expect(getByTestId('my-shell')).toBeTruthy()
  })

  it('exposes the header landmark with the provided aria-label', () => {
    const { getByTestId } = render(PlatformShell, {
      props: { headerAriaLabel: 'Main navigation' }
    })
    expect(getByTestId('template-platform-shell__header')).toBeTruthy()
  })

  it('has no structural a11y violations', async () => {
    // plain content — the shell provides its own <main> landmark, so nesting another here
    // would (correctly) trip landmark-no-duplicate-main; that would be a test bug, not a defect.
    const { container } = render(PlatformShell, { slots: { default: '<p>content</p>' } })
    await expectNoA11yViolations(container)
  })
})

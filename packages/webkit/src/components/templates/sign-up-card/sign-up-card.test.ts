import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import SignUpCard from './sign-up-card.vue'

// No story exists for this template — render it directly per .claude/rules/testing.md.
describe('SignUpCard', () => {
  it('mounts with its default testid and renders the title', () => {
    const { getByTestId, getByText } = render(SignUpCard, {
      props: { title: 'Create your account' }
    })
    expect(getByTestId('template-sign-up-card')).toBeTruthy()
    expect(getByText('Create your account')).toBeTruthy()
  })

  it('lets a consumer data-testid override the fallback', () => {
    const { getByTestId } = render(SignUpCard, { attrs: { 'data-testid': 'my-signup' } })
    expect(getByTestId('my-signup')).toBeTruthy()
  })

  it('emits github-click when the GitHub button is pressed', async () => {
    const { getByTestId, emitted } = render(SignUpCard)
    await fireEvent.click(getByTestId('template-sign-up-card__github'))
    expect(emitted()['github-click']).toBeTruthy()
  })

  it('emits google-click when the Google button is pressed', async () => {
    const { getByTestId, emitted } = render(SignUpCard)
    await fireEvent.click(getByTestId('template-sign-up-card__google'))
    expect(emitted()['google-click']).toBeTruthy()
  })

  it('has no structural a11y violations', async () => {
    const { container } = render(SignUpCard)
    await expectNoA11yViolations(container)
  })
})

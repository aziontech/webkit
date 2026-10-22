import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import OnboardingForm from './onboarding-form.vue'

// No story exists for this template — render it directly per .claude/rules/testing.md.
const usageItems = [
  { label: 'Websites', value: 'websites' },
  { label: 'APIs', value: 'apis' }
]

describe('OnboardingForm', () => {
  it('mounts with its default testid and renders the title', () => {
    const { getByTestId, getByText } = render(OnboardingForm, {
      props: { usageItems, title: 'Finish your onboarding' }
    })
    expect(getByTestId('templates-onboarding-form')).toBeTruthy()
    expect(getByText('Finish your onboarding')).toBeTruthy()
  })

  it('lets a consumer data-testid override the fallback', () => {
    const { getByTestId } = render(OnboardingForm, {
      props: { usageItems },
      attrs: { 'data-testid': 'my-onboarding' }
    })
    expect(getByTestId('my-onboarding')).toBeTruthy()
  })

  it('emits continue-click once when the continue button is clicked', async () => {
    const { getByTestId, emitted } = render(OnboardingForm, { props: { usageItems } })
    const button = getByTestId('templates-onboarding-form__continue')
    expect(button.getAttribute('type')).toBe('submit')
    await fireEvent.click(button)
    expect(emitted()['continue-click']).toHaveLength(1)
  })

  it('does not emit continue-click while continueDisabled', async () => {
    const { getByTestId, emitted } = render(OnboardingForm, {
      props: { usageItems, continueDisabled: true }
    })
    await fireEvent.click(getByTestId('templates-onboarding-form__continue'))
    expect(emitted()['continue-click']).toBeUndefined()
  })

  it('has no structural a11y violations', async () => {
    const { container } = render(OnboardingForm, { props: { usageItems } })
    await expectNoA11yViolations(container)
  })
})

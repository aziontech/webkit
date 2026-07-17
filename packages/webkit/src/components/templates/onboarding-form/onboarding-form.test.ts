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

  it('emits continue-click when the form is submitted (the continue button is type=submit)', async () => {
    const { container, getByTestId, emitted } = render(OnboardingForm, { props: { usageItems } })
    // the continue button is a submit button inside the form (@submit.prevent)
    expect(getByTestId('templates-onboarding-form__continue')).toBeTruthy()
    const form = container.querySelector('form')
    expect(form).toBeTruthy()
    await fireEvent.submit(form)
    expect(emitted()['continue-click']).toBeTruthy()
  })

  it('has no structural a11y violations', async () => {
    const { container } = render(OnboardingForm, { props: { usageItems } })
    await expectNoA11yViolations(container)
  })
})

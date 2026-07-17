import { fireEvent, render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import PlanSuccess from './plan-success.vue'

// No story exists for this template — render it directly per .claude/rules/testing.md.
const steps = [
  { title: 'Deploy', description: 'Ship your first application.' },
  { title: 'Invite', description: 'Add your teammates.' }
]

describe('PlanSuccess', () => {
  it('mounts with its default testid and renders the success title', () => {
    const { getByTestId, getByText } = render(PlanSuccess, {
      props: { steps, title: 'Your Pro Plan is now Active' }
    })
    expect(getByTestId('templates-plan-success')).toBeTruthy()
    expect(getByText('Your Pro Plan is now Active')).toBeTruthy()
  })

  it('lets a consumer data-testid override the fallback', () => {
    const { getByTestId } = render(PlanSuccess, {
      props: { steps },
      attrs: { 'data-testid': 'my-plan' }
    })
    expect(getByTestId('my-plan')).toBeTruthy()
  })

  it('emits action-click when the primary action is pressed', async () => {
    const { getByTestId, emitted } = render(PlanSuccess, { props: { steps } })
    await fireEvent.click(getByTestId('templates-plan-success__action'))
    expect(emitted()['action-click']).toBeTruthy()
  })

  it('has no structural a11y violations', async () => {
    const { container } = render(PlanSuccess, { props: { steps } })
    await expectNoA11yViolations(container)
  })
})

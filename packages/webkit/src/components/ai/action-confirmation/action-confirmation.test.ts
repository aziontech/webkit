import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ActionConfirmation from './action-confirmation.vue'

const base = { title: 'Allow `npm test`?', description: 'Runs the test suite of `storefront`.' }

describe('ActionConfirmation', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(
      render(ActionConfirmation, { props: base }).getByTestId('ai-action-confirmation')
    ).toBeTruthy()
    expect(
      render(ActionConfirmation, { props: base, attrs: { 'data-testid': 'mine' } }).getByTestId(
        'mine'
      )
    ).toBeTruthy()
  })

  it('is a group named by its title, with backticks as code and no HTML', () => {
    const { getByRole, getByTestId } = render(ActionConfirmation, {
      props: { title: 'Allow `rm <b>x</b>`?' }
    })
    expect(getByRole('group', { name: 'Allow rm <b>x</b>?' })).toBeTruthy()
    const title = getByTestId('ai-action-confirmation__title')
    expect(title.querySelector('code')).toHaveTextContent('rm <b>x</b>')
    expect(title.querySelector('b')).toBeNull()
  })

  it('emits approve and deny from the buttons, without stealing focus', async () => {
    const { getByRole, emitted } = render(ActionConfirmation, { props: base })
    expect(document.activeElement).toBe(document.body)
    await userEvent.click(getByRole('button', { name: 'Deny' }))
    await userEvent.click(getByRole('button', { name: 'Approve' }))
    expect(emitted('deny')).toHaveLength(1)
    expect(emitted('approve')).toHaveLength(1)
  })

  it('uses the approve label and the danger kind', () => {
    const { getByRole, getByTestId } = render(ActionConfirmation, {
      props: { ...base, kind: 'danger', approveLabel: 'Delete' }
    })
    expect(getByRole('button', { name: 'Delete' })).toBeTruthy()
    expect(getByTestId('ai-action-confirmation')).toHaveAttribute('data-kind', 'danger')
  })

  it('keeps Approve disabled until the phrase is typed', async () => {
    const { getByRole, getByLabelText, emitted } = render(ActionConfirmation, {
      props: { ...base, confirmationPhrase: 'storefront' }
    })
    const approve = getByRole('button', { name: 'Approve' })
    expect(approve).toBeDisabled()
    await userEvent.type(getByLabelText('Type storefront to confirm'), 'storefront')
    expect(approve).not.toBeDisabled()
    await userEvent.click(approve)
    expect(emitted('approve')).toHaveLength(1)
  })

  it('emits nothing while loading', async () => {
    const { getByRole, emitted } = render(ActionConfirmation, { props: { ...base, loading: true } })
    await userEvent.click(getByRole('button', { name: 'Deny' }))
    expect(emitted('deny')).toBeUndefined()
  })

  it.each([
    ['approved', 'Approved'],
    ['denied', 'Denied'],
    ['expired', 'Request expired']
  ] as const)('replaces the buttons with the %s outcome in text', async (state, text) => {
    const { queryByRole, getByTestId, rerender } = render(ActionConfirmation, { props: base })
    await rerender({ ...base, state })
    expect(queryByRole('button')).toBeNull()
    expect(getByTestId('ai-action-confirmation__outcome')).toHaveTextContent(text)
    expect(getByTestId('ai-action-confirmation__announcer')).toHaveTextContent(text)
    expect(getByTestId('ai-action-confirmation')).toHaveAttribute('data-status', state)
  })

  it('moves focus to its heading through focus()', async () => {
    const wrapper = render(ActionConfirmation, { props: base })
    const heading = wrapper.getByTestId('ai-action-confirmation__title')
    heading.focus()
    await nextTick()
    expect(document.activeElement).toBe(heading)
    expect(heading).toHaveAttribute('tabindex', '-1')
  })

  it('has no axe violations pending and resolved', async () => {
    const pending = render(ActionConfirmation, {
      props: { ...base, confirmationPhrase: 'x' },
      slots: { default: () => 'npm test' }
    })
    await expectNoA11yViolations(pending.container)
    pending.unmount()
    const resolved = render(ActionConfirmation, { props: { ...base, state: 'approved' } })
    await expectNoA11yViolations(resolved.container)
  })
})

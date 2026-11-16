import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import ToolApproval from './tool-approval.vue'

const base = { title: 'Allow `npm test`?', description: 'Runs the test suite of `storefront`.' }

describe('ToolApproval', () => {
  it('renders the fallback data-testid and lets a consumer override it', () => {
    expect(render(ToolApproval, { props: base }).getByTestId('tool-approval')).toBeTruthy()
    expect(
      render(ToolApproval, { props: base, attrs: { 'data-testid': 'mine' } }).getByTestId('mine')
    ).toBeTruthy()
  })

  it('is a group named by its title, with backticks as code and no HTML', () => {
    const { getByRole, getByTestId } = render(ToolApproval, {
      props: { title: 'Allow `rm <b>x</b>`?' }
    })
    expect(getByRole('group', { name: 'Allow rm <b>x</b>?' })).toBeTruthy()
    const title = getByTestId('tool-approval__title')
    expect(title.querySelector('code')).toHaveTextContent('rm <b>x</b>')
    expect(title.querySelector('b')).toBeNull()
  })

  it('emits approve and deny from the buttons, without stealing focus', async () => {
    const { getByRole, emitted } = render(ToolApproval, { props: base })
    expect(document.activeElement).toBe(document.body)
    await userEvent.click(getByRole('button', { name: 'Deny' }))
    await userEvent.click(getByRole('button', { name: 'Approve' }))
    expect(emitted('deny')).toHaveLength(1)
    expect(emitted('approve')).toHaveLength(1)
    expect(emitted<unknown[]>('deny')![0]![0]).toBeInstanceOf(MouseEvent)
    expect(emitted<unknown[]>('approve')![0]![0]).toBeInstanceOf(MouseEvent)
  })

  it('emits deny with the event from the keyboard', async () => {
    const { getByRole, emitted } = render(ToolApproval, { props: base })
    getByRole('button', { name: 'Deny' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(emitted<unknown[]>('deny')![0]![0]).toBeInstanceOf(Event)
  })

  it('uses the approve label and the danger variant', () => {
    const { getByRole, getByTestId } = render(ToolApproval, {
      props: { ...base, variant: 'danger', approveLabel: 'Delete' }
    })
    expect(getByRole('button', { name: 'Delete' })).toBeTruthy()
    expect(getByTestId('tool-approval')).toHaveAttribute('data-variant', 'danger')
  })

  it('keeps Approve disabled until the phrase is typed', async () => {
    const { getByRole, getByLabelText, emitted } = render(ToolApproval, {
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
    const { getByRole, emitted } = render(ToolApproval, { props: { ...base, loading: true } })
    await userEvent.click(getByRole('button', { name: 'Deny' }))
    expect(emitted('deny')).toBeUndefined()
  })

  it.each([
    ['approved', 'Approved'],
    ['denied', 'Denied'],
    ['expired', 'Request expired']
  ] as const)('replaces the buttons with the %s outcome in text', async (status, text) => {
    const { queryByRole, getByTestId, rerender } = render(ToolApproval, { props: base })
    await rerender({ ...base, status })
    expect(queryByRole('button')).toBeNull()
    expect(getByTestId('tool-approval__outcome')).toHaveTextContent(text)
    expect(getByTestId('tool-approval__announcer')).toHaveTextContent(text)
    expect(getByTestId('tool-approval')).toHaveAttribute('data-status', status)
  })

  it('moves focus to its heading through focus()', async () => {
    const wrapper = render(ToolApproval, { props: base })
    const heading = wrapper.getByTestId('tool-approval__title')
    heading.focus()
    await nextTick()
    expect(document.activeElement).toBe(heading)
    expect(heading).toHaveAttribute('tabindex', '-1')
  })

  it('has no axe violations pending and resolved', async () => {
    const pending = render(ToolApproval, {
      props: { ...base, confirmationPhrase: 'x' },
      slots: { default: () => 'npm test' }
    })
    await expectNoA11yViolations(pending.container)
    pending.unmount()
    const resolved = render(ToolApproval, { props: { ...base, status: 'approved' } })
    await expectNoA11yViolations(resolved.container)
  })
})

import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClosingCallToActionNewsletter from './closing-call-to-action-newsletter.vue'

const TESTID = 'sections-closing-call-to-action-newsletter'
const TITLE = 'Subscribe to our newsletter'
const DESCRIPTION =
  'Product updates, event highlights, and industry insights, delivered to your inbox.'

const form = {
  placeholder: 'Your email',
  submitLabel: 'Subscribe',
  successMessage: 'Thanks for subscribing to the Azion newsletter',
  errorMessage: 'We could not subscribe you. Try again.',
  requiredMessage: 'Enter your email address.',
  invalidMessage: 'Enter an email address like name@example.com.'
}

const band = (props: Record<string, unknown> = {}) =>
  render(ClosingCallToActionNewsletter, {
    props: { eyebrow: 'Stay up to date', title: TITLE, description: DESCRIPTION, form, ...props }
  })

const field = (getByLabelText: (text: string, options: { selector: string }) => HTMLElement) =>
  getByLabelText(TITLE, { selector: 'input' }) as HTMLInputElement

describe('ClosingCallToActionNewsletter', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClosingCallToActionNewsletter, {
      props: { title: TITLE, form },
      attrs: { 'data-testid': 'newsletter' }
    })

    expect(getByTestId('newsletter')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'contact' })

    expect(getByTestId(TESTID).id).toBe('contact')
  })

  it('names the section by its title and sets the description as the h2', () => {
    const { getByRole, getByTestId } = band()

    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe(TITLE)
    expect(getByRole('heading', { level: 2, name: DESCRIPTION })).toBeInTheDocument()
  })

  it('labels the email field with the title', () => {
    const { getByLabelText } = band()

    expect(field(getByLabelText).getAttribute('placeholder')).toBe(form.placeholder)
  })

  it('puts type="email" and autocomplete="email" on the <input>, not on the field wrapper', () => {
    const { getByLabelText } = band()
    const input = field(getByLabelText)

    expect(input.getAttribute('type')).toBe('email')
    expect(input.getAttribute('autocomplete')).toBe('email')
    const wrapper = input.closest(
      '[data-testid$="field-text"], [data-testid*="field-text"]:not(input)'
    )
    expect(wrapper?.hasAttribute('type') ?? false).toBe(false)
    expect(wrapper?.hasAttribute('autocomplete') ?? false).toBe(false)
  })

  it('emits submit once with the event and the trimmed address on a valid submit', async () => {
    const { getByLabelText, getByRole, emitted } = band()

    await userEvent.type(field(getByLabelText), '  name@example.com ')
    await userEvent.click(getByRole('button', { name: form.submitLabel }))

    const calls = emitted<[SubmitEvent, Record<string, string>]>('submit')
    expect(calls).toHaveLength(1)
    expect(calls[0][0]).toBeInstanceOf(Event)
    expect(calls[0][0].type).toBe('submit')
    expect(calls[0][1]).toEqual({ email: 'name@example.com' })
  })

  it('emits submit on Enter in the field', async () => {
    const { getByLabelText, emitted } = band()

    await userEvent.type(field(getByLabelText), 'name@example.com{Enter}')

    expect(emitted('submit')).toHaveLength(1)
  })

  it('shows the required message and emits nothing when submitted empty', async () => {
    const { getByRole, getByText, getByLabelText, emitted } = band()

    await userEvent.click(getByRole('button', { name: form.submitLabel }))

    expect(getByText(form.requiredMessage)).toBeInTheDocument()
    expect(field(getByLabelText).getAttribute('aria-invalid')).toBe('true')
    expect(emitted('submit')).toBeUndefined()
  })

  it('shows the invalid message for a malformed address and clears it on typing', async () => {
    const { getByRole, getByLabelText, queryByText, getByText, emitted } = band()

    await userEvent.type(field(getByLabelText), 'name@')
    await userEvent.click(getByRole('button', { name: form.submitLabel }))
    expect(getByText(form.invalidMessage)).toBeInTheDocument()
    expect(emitted('submit')).toBeUndefined()

    await userEvent.type(field(getByLabelText), 'x')
    expect(queryByText(form.invalidMessage)).toBeNull()
  })

  it('disables the field and suppresses submit while loading', async () => {
    const { getByLabelText, getByRole, emitted } = band({ loading: true })

    expect(field(getByLabelText).disabled).toBe(true)
    getByRole('button', { name: form.submitLabel }).closest('form')?.requestSubmit()
    await userEvent.click(getByRole('button', { name: form.submitLabel }))

    expect(emitted('submit')).toBeUndefined()
  })

  it('replaces the form with the success message when submitted', () => {
    const { getByRole, queryByRole } = band({ submitted: true })

    expect(getByRole('status').textContent).toContain(form.successMessage)
    expect(queryByRole('textbox')).toBeNull()
    expect(queryByRole('button', { name: form.submitLabel })).toBeNull()
  })

  it('shows the error message under the form on error', () => {
    const { getByRole } = band({ error: true })

    expect(getByRole('alert').textContent).toContain(form.errorMessage)
    expect(getByRole('button', { name: form.submitLabel })).toBeInTheDocument()
  })

  it('renders no message by default', () => {
    const { queryByRole } = band()

    expect(queryByRole('status')).toBeNull()
    expect(queryByRole('alert')).toBeNull()
  })

  it('renders no overline and no headline when they are empty', () => {
    const { queryByRole, queryByText } = band({ eyebrow: '', description: '' })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByText('Stay up to date')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations while invalid', async () => {
    const { container, getByRole } = band()

    await userEvent.click(getByRole('button', { name: form.submitLabel }))

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when submitted or on error', async () => {
    const submitted = band({ submitted: true })
    await expectNoA11yViolations(submitted.container)
    submitted.unmount()

    const failed = band({ error: true })
    await expectNoA11yViolations(failed.container)
  })
})

import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import HeroFormSection from './hero-form-section.vue'

const TESTID = 'hero-form-section'
const TITLE = 'Talk to our sales team'
const SUBMIT = 'Contact sales'

const messages = {
  missing: 'This field is required.',
  invalidEmail: 'Enter a valid email address.',
  success: 'We will be in touch.',
  error: 'We could not send your message. Try again.'
}

const items = [
  { icon: 'ai ai-edge-ai', title: 'Build AI applications', description: 'Run AI agents.' },
  { icon: 'ai ai-build-pillar', title: 'Modernize applications', description: 'Ship in minutes.' }
]

const fields = [
  { name: 'firstname', type: 'text', label: 'First name', half: true, required: true },
  { name: 'lastname', type: 'text', label: 'Last name', half: true },
  { name: 'email', type: 'email', label: 'Work email', required: true },
  { name: 'domain', type: 'text', label: 'Website' },
  { name: 'message', type: 'textarea', label: 'How can we help?' }
]

const band = (props: Record<string, unknown> = {}) =>
  render(HeroFormSection, {
    props: {
      eyebrow: 'Sales',
      title: TITLE,
      description: 'Get a custom demo.',
      items,
      formAriaLabel: 'Contact sales form',
      fields,
      submitLabel: SUBMIT,
      messages,
      marqueeLabel: 'Trusted by teams',
      marqueeMarks: ['itau', 'netshoes'],
      ...props
    }
  })

describe('HeroFormSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(HeroFormSection, {
      props: { title: TITLE, messages },
      attrs: { 'data-testid': 'contact' }
    })

    expect(getByTestId('contact')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('stands the client marquee on the floor from marqueeMarks and ignores the removed carouselMarks', async () => {
    const current = band()
    expect(await current.findByTestId('marquee', {}, { timeout: 5000 })).toHaveTextContent(
      'Trusted by teams'
    )
    current.unmount()

    const old = band({
      marqueeLabel: '',
      marqueeMarks: [],
      carouselLabel: 'Old label',
      carouselMarks: ['itau']
    })
    expect(old.queryByTestId('marquee')).toBeNull()
  })

  it('names the hero region by the title and renders the h1', () => {
    const { getByRole } = band()

    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
    expect(getByRole('heading', { level: 1, name: TITLE })).toBeInTheDocument()
  })

  it('renders nothing but the root without a title', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID).children).toHaveLength(0)
    expect(queryByRole('heading', { level: 1 })).toBeNull()
  })

  it('sets the anchor as the band id, and no id without one', () => {
    const { getByTestId, unmount } = band({ anchor: 'contact' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'contact')
    unmount()
    expect(band().getByTestId(TESTID)).not.toHaveAttribute('id')
  })

  it('continues the description with an inline link and the copy after it', () => {
    const { getByRole, getByTestId } = band({
      description: 'Call us at',
      descriptionLink: { label: '+1 555-0100', href: 'tel:+15550100' },
      descriptionAfter: ' or fill in the form.'
    })

    const link = getByRole('link', { name: '+1 555-0100' })
    expect(link).toHaveAttribute('href', 'tel:+15550100')
    expect(link.parentElement?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Call us at +1 555-0100 or fill in the form.'
    )
    expect(getByTestId('hero-title')).toContainElement(link)
  })

  it('renders the actions under the copy only with a label and a link', () => {
    const { getByRole, queryByRole } = band({
      primaryAction: { label: 'Talk to sales', href: '/contact' },
      secondaryAction: { label: 'Docs', href: '' }
    })

    expect(getByRole('link', { name: 'Talk to sales' })).toHaveAttribute('href', '/contact')
    expect(queryByRole('link', { name: 'Docs' })).toBeNull()
  })

  it('keeps the copy sticky only when there are no highlights', () => {
    const withItems = band()
    expect(withItems.getByTestId('hero-title')).not.toHaveAttribute('data-sticky')
    withItems.unmount()

    expect(band({ items: [] }).getByTestId('hero-title')).toHaveAttribute('data-sticky')
  })

  it('has no a11y violations with the inline link and the actions', async () => {
    const { container } = band({
      items: [],
      descriptionLink: { label: '+1 555-0100', href: 'tel:+15550100' },
      descriptionAfter: '.',
      primaryAction: { label: 'Talk to sales', href: '/contact' },
      secondaryAction: { label: 'Docs', href: '/docs', trailing: true }
    })

    await expectNoA11yViolations(container)
  })

  it('renders one highlight per item, in order', () => {
    const { getAllByRole } = band()

    const headings = getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)
    expect(headings.map((text) => text?.trim())).toEqual(items.map((item) => item.title))
  })

  it('omits the highlight list when there are no items', () => {
    const { queryByRole } = band({ items: [] })

    expect(queryByRole('list')).toBeNull()
  })

  it('renders one labelled control per field, with the legend as the group name', () => {
    const { getByLabelText, getByRole } = band()

    expect(getByRole('group', { name: 'Contact sales form' })).toBeInTheDocument()
    expect(getByLabelText(/First name/, { selector: 'input' }).getAttribute('name')).toBe(
      'firstname'
    )
    expect(getByLabelText(/Website/, { selector: 'input' }).getAttribute('name')).toBe('domain')
    expect(getByLabelText(/How can we help/, { selector: 'textarea' })).toBeInTheDocument()
  })

  it('emits submit once with the event and every value by name on a valid submit', async () => {
    const { getByLabelText, getByRole, emitted } = band()

    await userEvent.type(getByLabelText(/First name/, { selector: 'input' }), 'Ada')
    await userEvent.type(getByLabelText(/Work email/, { selector: 'input' }), ' ada@example.com ')
    await userEvent.type(getByLabelText(/How can we help/, { selector: 'textarea' }), 'Hi')
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    const calls = emitted<[SubmitEvent, Record<string, string>]>('submit')
    expect(calls).toHaveLength(1)
    expect(calls[0][0].type).toBe('submit')
    expect(calls[0][1]).toEqual({
      firstname: 'Ada',
      lastname: '',
      email: 'ada@example.com',
      domain: '',
      message: 'Hi'
    })
  })

  it('prefixes a phone value with the dial code of its country', async () => {
    const { getByLabelText, getByRole, emitted } = band({
      fields: [{ name: 'mobilephone', type: 'phone', label: 'Phone', country: 'US' }]
    })

    await userEvent.type(getByLabelText(/Phone/, { selector: 'input' }), '2025550123')
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    expect(emitted<[SubmitEvent, Record<string, string>]>('submit')[0][1]).toEqual({
      mobilephone: '+12025550123'
    })
  })

  it('keeps a visually hidden label as the accessible name of its control', () => {
    const { getByLabelText } = band({
      fields: [
        {
          name: 'mobilephone',
          type: 'phone',
          label: 'Phone',
          placeholder: '(999) 999-9999',
          visuallyHiddenLabel: true
        },
        { name: 'email', type: 'email', label: 'Work email' }
      ]
    })

    const phone = getByLabelText(/Phone/, { selector: 'input' })
    expect(phone).toHaveAttribute('placeholder', '(999) 999-9999')
    const hidden = document.querySelector(`label[for="${phone.id}"]`)
    expect(hidden?.closest('[data-visually-hidden]')).not.toBeNull()
    const email = getByLabelText(/Work email/, { selector: 'input' })
    expect(
      document.querySelector(`label[for="${email.id}"]`)?.closest('[data-visually-hidden]')
    ).toBeNull()
  })

  it('shows the field errors and emits nothing on an invalid submit', async () => {
    const { getByLabelText, getByRole, getByText, getAllByText, emitted } = band()

    await userEvent.type(getByLabelText(/Work email/, { selector: 'input' }), 'ada@')
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    expect(emitted('submit')).toBeUndefined()
    expect(getAllByText(messages.missing)).toHaveLength(1)
    expect(getByText(messages.invalidEmail)).toBeInTheDocument()
    const firstName = getByLabelText(/First name/, { selector: 'input' })
    expect(firstName.getAttribute('aria-required')).toBe('true')
    expect(firstName.getAttribute('aria-invalid')).toBeNull()
    const email = getByLabelText(/Work email/, { selector: 'input' })
    expect(email.getAttribute('aria-invalid')).toBe('true')
    expect(email.getAttribute('aria-required')).toBeNull()
  })

  it('moves focus to the first field in error on an invalid submit', async () => {
    const { getByLabelText, getByRole } = band()

    await userEvent.type(getByLabelText(/First name/, { selector: 'input' }), 'Ada')
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    await vi.waitFor(() =>
      expect(document.activeElement).toBe(getByLabelText(/Work email/, { selector: 'input' }))
    )
  })

  it('gives an email field the native email hints', () => {
    const { getByLabelText } = band()

    const email = getByLabelText(/Work email/, { selector: 'input' })
    expect(email.getAttribute('type')).toBe('email')
    expect(email.getAttribute('autocomplete')).toBe('email')
    expect(email.getAttribute('spellcheck')).toBe('false')
    expect(getByLabelText(/Website/, { selector: 'input' }).getAttribute('type')).toBe('text')
  })

  it('tags required labels from the first render but holds the field states until a submit', () => {
    const { getByLabelText, getAllByText } = band()

    expect(getAllByText('(Required)')).toHaveLength(2)
    const firstName = getByLabelText(/First name/, { selector: 'input' })
    expect(firstName.getAttribute('aria-required')).toBeNull()
    expect(firstName.getAttribute('aria-invalid')).toBeNull()
  })

  it('clears a field error once the field is edited', async () => {
    const { getByLabelText, getByRole, getAllByText } = band()

    await userEvent.click(getByRole('button', { name: SUBMIT }))
    expect(getAllByText(messages.missing)).toHaveLength(2)

    await userEvent.type(getByLabelText(/First name/, { selector: 'input' }), 'A')
    expect(getAllByText(messages.missing)).toHaveLength(1)
    expect(
      getByLabelText(/First name/, { selector: 'input' }).getAttribute('aria-invalid')
    ).not.toBe('true')
  })

  it('locks the fields and suppresses submit while loading', async () => {
    const { container, getByLabelText, getByRole, emitted } = band({ loading: true })

    expect(getByLabelText(/First name/, { selector: 'input' })).toBeDisabled()
    expect(getByLabelText(/How can we help/, { selector: 'textarea' })).toBeDisabled()
    expect(container.querySelector('fieldset')).toHaveAttribute('disabled')
    getByRole('button', { name: SUBMIT }).closest('form')?.requestSubmit()
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    expect(emitted('submit')).toBeUndefined()
  })

  it('moves focus to the success message when the form it replaces held focus', async () => {
    const view = band()

    view.getByRole('button', { name: SUBMIT }).focus()
    await view.rerender({ submitted: true })

    await vi.waitFor(() => expect(document.activeElement).toBe(view.getByRole('status')))
  })

  it('replaces the form with the success message when submitted', () => {
    const { getByRole, queryByRole } = band({ submitted: true })

    expect(getByRole('status').textContent).toContain(messages.success)
    expect(queryByRole('button', { name: SUBMIT })).toBeNull()
  })

  it('shows the error message under the form on error', () => {
    const { getByRole, getByTestId } = band({ failed: true })
    expect(getByTestId(TESTID)).toHaveAttribute('data-failed', 'true')

    expect(getByRole('alert').textContent).toContain(messages.error)
    expect(getByRole('button', { name: SUBMIT })).toBeInTheDocument()
  })

  it('renders no outcome message by default', () => {
    const { queryByRole } = band()

    expect(queryByRole('status')).toBeNull()
    expect(queryByRole('alert')).toBeNull()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations while invalid', async () => {
    const { container, getByRole } = band()

    await userEvent.click(getByRole('button', { name: SUBMIT }))

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when submitted or on error', async () => {
    const submitted = band({ submitted: true })
    await expectNoA11yViolations(submitted.container)
    submitted.unmount()

    const failed = band({ failed: true })
    await expectNoA11yViolations(failed.container)
  })
})

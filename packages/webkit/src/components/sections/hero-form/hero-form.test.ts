import { userEvent } from '@storybook/test'
import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import HeroForm from './hero-form.vue'

const TESTID = 'sections-hero-form'
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
  { name: 'firstname', kind: 'text', label: 'First name', half: true, required: true },
  { name: 'lastname', kind: 'text', label: 'Last name', half: true },
  { name: 'email', kind: 'email', label: 'Work email', required: true },
  { name: 'domain', kind: 'text', label: 'Website' },
  { name: 'message', kind: 'textarea', label: 'How can we help?' }
]

const band = (props: Record<string, unknown> = {}) =>
  render(HeroForm, {
    props: {
      eyebrow: 'Sales',
      title: TITLE,
      description: 'Get a custom demo.',
      items,
      formAriaLabel: 'Contact sales form',
      fields,
      submitLabel: SUBMIT,
      messages,
      carouselLabel: 'Trusted by teams',
      carouselMarks: ['itau', 'netshoes'],
      ...props
    }
  })

describe('HeroForm', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(HeroForm, {
      props: { title: TITLE, messages },
      attrs: { 'data-testid': 'contact' }
    })

    expect(getByTestId('contact')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
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
      fields: [{ name: 'mobilephone', kind: 'phone', label: 'Phone', country: 'US' }]
    })

    await userEvent.type(getByLabelText(/Phone/, { selector: 'input' }), '2025550123')
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    expect(emitted<[SubmitEvent, Record<string, string>]>('submit')[0][1]).toEqual({
      mobilephone: '+12025550123'
    })
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

  it('suppresses submit while loading', async () => {
    const { getByLabelText, getByRole, emitted } = band({ loading: true })

    await userEvent.type(getByLabelText(/First name/, { selector: 'input' }), 'Ada')
    await userEvent.type(getByLabelText(/Work email/, { selector: 'input' }), 'ada@example.com')
    getByRole('button', { name: SUBMIT }).closest('form')?.requestSubmit()
    await userEvent.click(getByRole('button', { name: SUBMIT }))

    expect(emitted('submit')).toBeUndefined()
  })

  it('replaces the form with the success message when submitted', () => {
    const { getByRole, queryByRole } = band({ submitted: true })

    expect(getByRole('status').textContent).toContain(messages.success)
    expect(queryByRole('button', { name: SUBMIT })).toBeNull()
  })

  it('shows the error message under the form on error', () => {
    const { getByRole } = band({ error: true })

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

    const failed = band({ error: true })
    await expectNoA11yViolations(failed.container)
  })
})

import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'

import Default from '../../../../examples/job-posting/default.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import JobPosting from './job-posting.vue'

const TESTID = 'sections-job-posting'

const form = {
  anchor: 'apply',
  title: 'Apply for this position',
  description: 'Fill in the form to apply.',
  submitLabel: 'Submit application',
  fields: [
    { name: 'name', kind: 'text' as const, label: 'Name', required: true },
    { name: 'email', kind: 'email' as const, label: 'Email address', required: true },
    {
      name: 'resume',
      kind: 'file' as const,
      label: 'Resume',
      accept: '.pdf',
      helper: '.pdf, up to 5 MB'
    },
    { name: 'portfolio', kind: 'url' as const, label: 'Portfolio URL', helper: 'Optional.' }
  ]
}

const messages = {
  missing: 'This field is required.',
  invalidEmail: 'Enter an email address like name@example.com.',
  invalidUrl: 'Enter the full URL, starting with https://.',
  error: 'We could not send your application.',
  successTitle: 'Application sent',
  successDescription: 'We will reply by email.',
  done: 'Done',
  browse: 'Browse files'
}

const sections = [
  {
    title: 'About the role',
    blocks: [{ kind: 'text' as const, text: 'You will build the tools our engineers ship with.' }]
  },
  {
    title: 'What you will do',
    blocks: [{ kind: 'list' as const, items: ['Own the release pipeline', 'Mentor engineers'] }]
  }
]

const facets = [
  { label: 'Engineering', icon: 'pi pi-sitemap' },
  { label: 'San Francisco, California', icon: 'pi pi-map-marker' }
]

const band = (props: Record<string, unknown> = {}) =>
  render(JobPosting, {
    props: {
      area: 'Engineering',
      title: 'Senior Platform Engineer',
      applyLabel: 'Apply for this position',
      facets,
      sections,
      form,
      messages,
      secondaryAction: { label: 'See open positions', href: '/careers' },
      ...props
    }
  })

afterEach(() => {
  document.body.querySelectorAll('[role="dialog"]').forEach((el) => el.remove())
})

describe('JobPosting', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(JobPosting, {
      props: { title: 'Senior Platform Engineer', form, messages },
      attrs: { 'data-testid': 'careers-posting' }
    })

    expect(getByTestId('careers-posting')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'posting' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'posting')
  })

  it('renders nothing but the root without a title', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('button')).toBeNull()
  })

  it('renders one h2 per description section, then the form title', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent?.trim())
    ).toEqual(['About the role', 'What you will do', 'Apply for this position'])
  })

  it('renders text blocks as paragraphs and list blocks as lists, ruling every row after the first', () => {
    const { getAllByTestId, getByText } = band()

    const rows = getAllByTestId(`${TESTID}__section`)
    expect(rows.map((row) => row.hasAttribute('data-ruled'))).toEqual([false, true])
    expect(getByText('You will build the tools our engineers ship with.').tagName).toBe('P')
    expect(
      within(rows[1]!)
        .getAllByRole('listitem')
        .map((item) => item.textContent?.trim())
    ).toEqual(['Own the release pipeline', 'Mentor engineers'])
  })

  it('restates the posting in the rail with its facets and the apply link', () => {
    const { getByTestId } = band()

    const rail = getByTestId(`${TESTID}__rail`)
    expect(within(rail).getByText('Senior Platform Engineer').tagName).toBe('P')
    expect(within(rail).getAllByText('Engineering')).toHaveLength(2)
    expect(
      within(rail)
        .getAllByRole('listitem')
        .map((item) => item.textContent?.trim())
    ).toEqual(facets.map((facet) => facet.label))
    expect(within(rail).getByRole('link', { name: 'Apply for this position' })).toHaveAttribute(
      'href',
      '#apply'
    )
    expect(getByTestId(`${TESTID}__apply`)).toHaveAttribute('id', 'apply')
  })

  it('leaves the apply button out without applyLabel', () => {
    const { getByTestId } = band({ applyLabel: '' })

    expect(within(getByTestId(`${TESTID}__rail`)).queryByRole('link')).toBeNull()
  })

  it('shows the messages of empty required and malformed fields on submit and emits nothing', async () => {
    const { getByRole, getByLabelText, getByText, emitted } = band()

    await fireEvent.update(getByLabelText(/Email address/), 'not-an-email')
    await fireEvent.update(getByLabelText(/Portfolio URL/), 'example.com')
    await fireEvent.click(getByRole('button', { name: 'Submit application' }))

    expect(getByText('This field is required.')).toBeInTheDocument()
    expect(getByText('Enter an email address like name@example.com.')).toBeInTheDocument()
    expect(getByText('Enter the full URL, starting with https://.')).toBeInTheDocument()
    expect(getByLabelText(/Email address/)).toHaveAttribute('aria-invalid', 'true')
    expect(emitted('submit')).toBeUndefined()
    await waitFor(() => expect(document.activeElement).toBe(getByLabelText(/^Name/)))
  })

  it('clears a field message when the field is edited', async () => {
    const { getByRole, getByLabelText, queryByText } = band()

    await fireEvent.click(getByRole('button', { name: 'Submit application' }))
    await fireEvent.update(getByLabelText(/^Name/), 'Jane Doe')
    await fireEvent.update(getByLabelText(/Email address/), 'jane.doe@example.com')

    expect(queryByText('This field is required.')).toBeNull()
  })

  it('emits submit with the DOM event first and the trimmed values', async () => {
    const { getByRole, getByLabelText, emitted } = band()

    await fireEvent.update(getByLabelText(/^Name/), '  Jane Doe ')
    await fireEvent.update(getByLabelText(/Email address/), 'jane.doe@example.com')
    await fireEvent.update(getByLabelText(/Portfolio URL/), 'https://example.com/jane')
    await fireEvent.click(getByRole('button', { name: 'Submit application' }))

    const [event, values] = emitted('submit')![0] as [Event, Record<string, string>]
    expect(event).toBeInstanceOf(Event)
    expect(values).toEqual({
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      resume: '',
      portfolio: 'https://example.com/jane'
    })
  })

  it('takes a picked file, lists it, and submits its name', async () => {
    const { container, getByRole, getByLabelText, getByText, emitted } = band()

    const input = container.querySelector<HTMLInputElement>('input[type="file"][name="resume"]')!
    const file = new File(['%PDF'], 'jane-doe.pdf', { type: 'application/pdf' })
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    await fireEvent.change(input)

    expect(getByText('jane-doe.pdf')).toBeInTheDocument()

    await fireEvent.update(getByLabelText(/^Name/), 'Jane Doe')
    await fireEvent.update(getByLabelText(/Email address/), 'jane.doe@example.com')
    await fireEvent.click(getByRole('button', { name: 'Submit application' }))

    const [, values] = emitted('submit')![0] as [Event, Record<string, string>]
    expect(values.resume).toBe('jane-doe.pdf')
  })

  it('names the browse button with the field label', () => {
    const { getByRole } = band()

    expect(getByRole('button', { name: 'Browse files, Resume' })).toBeInTheDocument()
  })

  it('suppresses submit and disables the controls while loading', async () => {
    const { container, emitted } = band({ loading: true })

    expect(container.querySelector('input[name="name"]')).toBeDisabled()
    expect(container.querySelector('fieldset')).toHaveAttribute('disabled')
    await fireEvent.submit(container.querySelector('form')!)
    expect(emitted('submit')).toBeUndefined()
  })

  it('shows the error alert under the form', () => {
    const { getByRole, getByTestId } = band({ error: true })

    expect(getByRole('alert')).toHaveTextContent('We could not send your application.')
    expect(getByTestId(TESTID)).toHaveAttribute('data-error', 'true')
  })

  it('opens the confirmation dialog when submitted turns on, and Done closes it', async () => {
    const { rerender } = band()

    await rerender({ submitted: true })

    const dialog = await waitFor(() => {
      const panel = document.body.querySelector<HTMLElement>('[role="dialog"]')
      expect(panel).not.toBeNull()
      return panel as HTMLElement
    })
    expect(within(dialog).getByText('Application sent')).toBeInTheDocument()
    expect(within(dialog).getByRole('link', { name: 'See open positions' })).toHaveAttribute(
      'href',
      '/careers'
    )

    await fireEvent.click(within(dialog).getByRole('button', { name: 'Done' }))
    await waitFor(() => expect(document.body.querySelector('[role="dialog"]')).toBeNull())
  })

  it('renders the documented Default example', () => {
    const { getByTestId } = render(Default)

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('has no a11y violations', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with field messages and the error alert', async () => {
    const { container, getByRole } = band({ error: true })

    await fireEvent.click(getByRole('button', { name: 'Submit application' }))
    await expectNoA11yViolations(container)
  })
})

import { userEvent } from '@storybook/test'
import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import FaqSection from './faq-section.vue'

const TESTID = 'sections-faq-section'
const TITLE = 'Frequently asked questions'

const items = [
  {
    question: 'What are Functions?',
    answer: 'Azion Functions runs JavaScript and TypeScript in the request flow.'
  },
  {
    question: 'Which frameworks are compatible?',
    answer:
      'See the full [frameworks list](/en/documentation/frameworks/), **all** of them *supported*.'
  },
  {
    question: 'Where is the reference?',
    answer: 'Read the [API reference](https://api.azion.com/).'
  },
  {
    question: 'What is GDPR?',
    answer:
      'GDPR is a data privacy law.\n\nIt protects these rights:\n\n- Right to be informed\n- Right of access, see the [Vanta](https://vanta.com) report\n- Right to **erasure**'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(FaqSection, {
    props: {
      title: TITLE,
      items,
      ...props
    }
  })

const open = async (getByRole: ReturnType<typeof band>['getByRole'], question: string) => {
  await userEvent.click(getByRole('button', { name: question }))
}

describe('FaqSection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(FaqSection, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'retail-faq' }
    })

    expect(getByTestId('retail-faq')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'faq' })

    expect(getByTestId(TESTID).id).toBe('faq')
  })

  it('renders no id when the anchor is empty', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('renders the title as the h2 that names the FAQ region', () => {
    const { getByRole } = band()

    const heading = getByRole('heading', { level: 2, name: TITLE })
    expect(getByRole('region', { name: TITLE })).toContainElement(heading)
  })

  it('keeps one landmark: the root is not a section', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID).tagName).toBe('DIV')
  })

  it('renders one question per item, in order', () => {
    const { getAllByTestId } = band()

    expect(
      getAllByTestId('content-accordion-trigger').map((trigger) => trigger.textContent?.trim())
    ).toEqual(items.map((item) => item.question))
  })

  it('opens an answer as plain text', async () => {
    const { getByRole, getByText } = band()

    await open(getByRole, items[0]!.question)

    expect(getByText(items[0]!.answer)).toBeInTheDocument()
  })

  it('renders inline markdown links, bold and italic in an answer', async () => {
    const { getByRole } = band()

    await open(getByRole, items[1]!.question)

    const link = getByRole('link', { name: 'frameworks list' })
    expect(link.getAttribute('href')).toBe('/en/documentation/frameworks/')
    expect(link.hasAttribute('target')).toBe(false)
    expect(link.closest('p')?.querySelector('strong')?.textContent).toBe('all')
    expect(link.closest('p')?.querySelector('em')?.textContent).toBe('supported')
    expect(link.closest('p')?.textContent).not.toContain('**')
  })

  it('opens an absolute link in a new tab', async () => {
    const { getByRole } = band()

    await open(getByRole, items[2]!.question)

    const link = getByRole('link', { name: 'API reference' })
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
  })

  it('renders a single-paragraph answer as inline text with no block wrappers', async () => {
    const { getByRole } = band()

    await open(getByRole, items[1]!.question)

    const paragraph = getByRole('link', { name: 'frameworks list' }).closest('p')!
    expect(paragraph.querySelector('span')).toBeNull()
    expect(paragraph.querySelector('[role="list"]')).toBeNull()
  })

  it('renders blank-line separated paragraphs as separate blocks', async () => {
    const { getByRole, getByText } = band()

    await open(getByRole, items[3]!.question)

    const first = getByText('GDPR is a data privacy law.')
    const second = getByText('It protects these rights:')
    expect(first).not.toBe(second)
    expect(first.contains(second) || second.contains(first)).toBe(false)
    expect(first.closest('p')).toBe(second.closest('p'))
    expect(first.textContent).not.toContain('\n')
  })

  it('renders dash lines as a list with one item per line', async () => {
    const { getByRole } = band()

    await open(getByRole, items[3]!.question)

    const list = getByRole('list')
    const entries = within(list).getAllByRole('listitem')
    expect(entries.map((entry) => entry.textContent?.trim())).toEqual([
      'Right to be informed',
      'Right of access, see the Vanta report',
      'Right to erasure'
    ])
    expect(list.textContent).not.toContain('- ')
  })

  it('renders inline markdown inside list items', async () => {
    const { getByRole } = band()

    await open(getByRole, items[3]!.question)

    const link = getByRole('link', { name: 'Vanta' })
    expect(link.getAttribute('href')).toBe('https://vanta.com')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.closest('[role="listitem"]')).not.toBeNull()
    const entries = within(getByRole('list')).getAllByRole('listitem')
    expect(entries[2]!.querySelector('strong')?.textContent).toBe('erasure')
  })

  it('renders only the root when items is empty', () => {
    const { getByTestId, queryByRole } = band({ items: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByRole('button')).toBeNull()
  })

  it('has no a11y violations closed', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with a rich answer open', async () => {
    const { container, getByRole } = band()

    await open(getByRole, items[3]!.question)

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an answer open', async () => {
    const { container, getByRole } = band()

    await open(getByRole, items[1]!.question)

    await expectNoA11yViolations(container)
  })
})

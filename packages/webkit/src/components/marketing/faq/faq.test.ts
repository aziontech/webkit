import { userEvent } from '@storybook/test'
import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import { expectNoA11yViolations } from '../../../test/axe'
import Faq from './faq.vue'

const TESTID = 'marketing-faq'
const TITLE = 'Frequently asked questions'

const items = [
  {
    value: 'edge',
    question: 'What is edge computing?',
    answer: 'Running your code in the locations closest to your users.'
  },
  {
    value: 'pricing',
    question: 'How does pricing work?',
    answer: 'You pay for what you use, with no upfront commitment.'
  },
  {
    value: 'trial',
    question: 'Is there a free tier?',
    answer: 'Yes, every core feature is available on the free tier.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(Faq, { props: { title: TITLE, items, ...props } })

describe('Faq', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(Faq, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'pricing-faq' }
    })

    expect(getByTestId('pricing-faq')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 that names the section', () => {
    const { getByRole, getByTestId } = band()

    const heading = getByRole('heading', { level: 2, name: TITLE })
    expect(heading.id).not.toBe('')
    expect(getByTestId(TESTID).getAttribute('aria-labelledby')).toBe(heading.id)
  })

  it('leaves the section unnamed when no title is set', () => {
    const { getByTestId, queryByRole } = render(Faq, { props: { items } })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-labelledby')).toBe(false)
  })

  it('renders one question trigger per item, in order', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('button').map((trigger) => trigger.textContent?.trim())).toEqual(
      items.map((item) => item.question)
    )
  })

  it('starts with every answer closed', () => {
    const { getAllByRole, queryByText } = band()

    for (const item of items) {
      expect(queryByText(item.answer)).toBeNull()
    }
    for (const trigger of getAllByRole('button')) {
      expect(trigger.getAttribute('aria-expanded')).toBe('false')
    }
  })

  it('reveals the answer of the clicked question and leaves the others closed', async () => {
    const { getByRole, getByText, queryByText } = band()

    await userEvent.click(getByRole('button', { name: items[1].question }))

    await waitFor(() => expect(getByText(items[1].answer)).toBeInTheDocument())
    expect(getByRole('button', { name: items[1].question }).getAttribute('aria-expanded')).toBe(
      'true'
    )
    expect(queryByText(items[0].answer)).toBeNull()
    expect(queryByText(items[2].answer)).toBeNull()
  })

  it('lets the answer slot replace the rendered answer and hands it the item', async () => {
    const { getByRole, queryByText } = render(Faq, {
      props: { title: TITLE, items },
      slots: {
        answer: (slotProps: { item: (typeof items)[number] }) =>
          h('a', { href: `/docs/${slotProps.item.value}` }, `More about ${slotProps.item.question}`)
      }
    })

    await userEvent.click(getByRole('button', { name: items[0].question }))

    const link = await waitFor(() => getByRole('link', { name: `More about ${items[0].question}` }))
    expect(link).toHaveAttribute('href', '/docs/edge')
    expect(queryByText(items[0].answer)).toBeNull()
  })

  it('renders no question and no frame when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByTestId } = render(Faq, {
      props: { title: TITLE, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('button')).toHaveLength(0)
    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('renders no question when items is omitted', () => {
    const { queryAllByRole } = render(Faq)

    expect(queryAllByRole('button')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an open answer', async () => {
    const { container, getByRole, getByText } = band()

    await userEvent.click(getByRole('button', { name: items[0].question }))
    await waitFor(() => expect(getByText(items[0].answer)).toBeInTheDocument())

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(Faq, { props: { title: TITLE, items: [] } })

    await expectNoA11yViolations(container)
  })

  it('draws no frame of its own by default', () => {
    const { queryByTestId } = render(Faq, { props: { title: TITLE, items } })

    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('draws its own registration frame when framed', () => {
    const { getByTestId } = render(Faq, { props: { title: TITLE, items, framed: true } })

    expect(getByTestId('layout-frame-box')).toBeInTheDocument()
  })

  it('keeps the heading and the questions in one band when framed', () => {
    const { getByRole } = render(Faq, { props: { title: TITLE, items, framed: true } })

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(TITLE)
    expect(getByRole('button', { name: items[0].question })).toBeInTheDocument()
  })
})

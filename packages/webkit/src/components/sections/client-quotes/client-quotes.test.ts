import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClientQuotes from './client-quotes.vue'

const TESTID = 'sections-client-quotes'
const QUOTE_TESTID = 'marketing-quote-tabs__quote'
const primaryAction = { label: 'Read the stories', href: '/customers', trailing: true }

const items = [
  {
    text: 'We moved our edge logic in a week.',
    name: 'Ana Souza',
    jobTitle: 'CTO, Acme',
    clientName: 'Acme'
  },
  {
    text: 'Latency dropped across every region.',
    name: 'Bruno Lima',
    jobTitle: 'Head of Infra, Globex',
    clientName: 'Globex'
  },
  {
    text: 'Our on-call pages fell by half.',
    name: 'Carla Dias',
    jobTitle: 'SRE Lead, Initech',
    clientName: 'Initech'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(ClientQuotes, {
    props: {
      primaryAction,
      items,
      ...props
    }
  })

describe('ClientQuotes', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClientQuotes, {
      props: { items },
      attrs: { 'data-testid': 'home-client-quotes' }
    })

    expect(getByTestId('home-client-quotes')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the first quote as the featured quotation', () => {
    const { getByTestId } = band()

    expect(getByTestId(QUOTE_TESTID).textContent).toContain(items[0].text)
  })

  it('renders one tab per item', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('tab')).toHaveLength(items.length)
  })

  it('renders the primary action as a link to its href', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
  })

  it('renders no link when the primary action is omitted', () => {
    const { queryByRole } = render(ClientQuotes, { props: { items } })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByTestId } = render(ClientQuotes, {
      props: { primaryAction, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('tab')).toHaveLength(0)
    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations when empty', async () => {
    const { container } = render(ClientQuotes, { props: { items: [] } })

    await expectNoA11yViolations(container)
  })
})

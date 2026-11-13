import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import UseCases from './use-cases.vue'

const TESTID = 'sections-use-cases'
const EYEBROW = 'SQL Database'
const TITLE = 'What teams use SQL Database for'
const DESCRIPTION = 'Teams use it to:'
const primaryAction = { label: 'Docs', href: '/docs', trailing: true }

const items = [
  {
    icon: 'pi pi-comments',
    title: 'RAG Applications',
    description: 'Build topic-specific chatbots with the data stored in SQL Database.'
  },
  {
    icon: 'pi pi-search',
    title: 'Search Applications',
    description: 'Power search with vector similarity queries on stored embeddings.'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Analytics',
    description: 'Run aggregations close to the user without leaving the edge.'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(UseCases, {
    props: {
      eyebrow: EYEBROW,
      title: TITLE,
      description: DESCRIPTION,
      primaryAction,
      items,
      ...props
    }
  })

describe('UseCases', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(UseCases, {
      props: { title: TITLE, items },
      attrs: { 'data-testid': 'sql-use-cases' }
    })

    expect(getByTestId('sql-use-cases')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 that names the section', () => {
    const { getByRole, getByTestId } = band()

    const heading = getByRole('heading', { level: 2, name: TITLE })
    expect(heading.id).not.toBe('')
    expect(getByTestId(TESTID).getAttribute('aria-labelledby')).toBe(heading.id)
  })

  it('leaves the section unnamed when no title is set', () => {
    const { getByTestId, queryByRole } = render(UseCases, { props: { items } })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(getByTestId(TESTID).hasAttribute('aria-labelledby')).toBe(false)
  })

  it('renders one h3 per item, in order', () => {
    const { getAllByRole } = band()

    expect(
      getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent?.trim())
    ).toEqual(items.map((item) => item.title))
  })

  it('renders the primary action as a link to its href', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
  })

  it('renders no link when the primary action is omitted', () => {
    const { queryByRole } = render(UseCases, { props: { title: TITLE, items } })

    expect(queryByRole('link')).toBeNull()
  })

  it('renders only the section when items is empty', () => {
    const { getByTestId, queryAllByRole, queryByRole, queryByTestId } = render(UseCases, {
      props: { eyebrow: EYEBROW, title: TITLE, description: DESCRIPTION, primaryAction, items: [] }
    })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    expect(queryByTestId('layout-frame-box')).toBeNull()
  })

  it('renders only the section when items is omitted', () => {
    const { getByTestId, queryAllByRole } = render(UseCases)

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = render(UseCases, { props: { title: TITLE, items: [] } })

    await expectNoA11yViolations(container)
  })
})

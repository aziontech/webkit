import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import SubjectLibrary from './subject-library.vue'

const TESTID = 'sections-subject-library'

const subjects = [
  {
    slug: 'api-security',
    title: 'API Security',
    description: 'Protect your applications with API Security best practices.',
    articles: [
      { label: 'What is API Security?', href: '/learning/api/what-is-api-security/' },
      { label: 'API Security Checklist', href: '/learning/api/api-security-checklist/' }
    ]
  },
  {
    slug: 'cdn',
    title: 'CDN',
    description: 'Reduce latency by caching content close to users.',
    articles: [{ label: 'What is a CDN?', href: '/learning/cdn/what-is-a-cdn/' }]
  }
]

const closing = {
  eyebrow: 'Next step',
  title: 'Put what you learned to work.',
  titleMuted: 'On Azion.',
  description: 'Deploy your first application in minutes.',
  primaryAction: { label: 'Start for free', href: '/signup' },
  secondaryAction: { label: 'Talk to a specialist', href: '/contact', trailing: true }
}

const band = (props: Record<string, unknown> = {}) =>
  render(SubjectLibrary, { props: { anchor: 'subjects', subjects, closing, ...props } })

describe('SubjectLibrary', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(SubjectLibrary, {
      props: { subjects },
      attrs: { 'data-testid': 'learning-subjects' }
    })

    expect(getByTestId('learning-subjects')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('sets anchor as the id of the band', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'subjects')
  })

  it('sets no id without an anchor', () => {
    const { getByTestId } = band({ anchor: '' })

    expect(getByTestId(TESTID).hasAttribute('id')).toBe(false)
  })

  it('renders one h3 per subject, in order, on a card carrying its slug as id', () => {
    const { getAllByRole } = band()

    const headings = getAllByRole('heading', { level: 3 })
    expect(headings.map((heading) => heading.textContent?.trim())).toEqual(
      subjects.map((subject) => subject.title)
    )
    subjects.forEach((subject, index) => {
      expect(headings[index].closest(`#${subject.slug}`)).not.toBeNull()
    })
  })

  it('renders each subject article as a link to its href, in order', () => {
    const { getByText } = band()

    subjects.forEach((subject) => {
      const card = getByText(subject.title).closest(`#${subject.slug}`) as HTMLElement
      const links = Array.from(card.querySelectorAll('a'))
      expect(links.map((link) => link.textContent?.trim())).toEqual(
        subject.articles.map((article) => article.label)
      )
      expect(links.map((link) => link.getAttribute('href'))).toEqual(
        subject.articles.map((article) => article.href)
      )
    })
  })

  it('skips subjects without a title or a linked article, and articles without a link', () => {
    const { getAllByRole, queryByText } = band({
      subjects: [
        {
          slug: 'bots',
          title: 'Bots',
          description: '',
          articles: [
            { label: 'What is a Bot?', href: '/learning/bots/what-is-a-bot/' },
            { label: 'Unlinked', href: '' }
          ]
        },
        { slug: 'empty', title: 'Empty', description: '', articles: [] },
        { slug: 'untitled', title: '', description: '', articles: subjects[0].articles }
      ],
      closing: undefined
    })

    expect(getAllByRole('heading', { level: 3 })).toHaveLength(1)
    expect(queryByText('Unlinked')).toBeNull()
    expect(queryByText('Empty')).toBeNull()
    expect(getAllByRole('link')).toHaveLength(1)
  })

  it('renders the closing call to action with both actions', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2 })).toHaveTextContent(closing.title)
    expect(getByRole('link', { name: closing.primaryAction.label })).toHaveAttribute(
      'href',
      closing.primaryAction.href
    )
    expect(getByRole('link', { name: closing.secondaryAction.label })).toHaveAttribute(
      'href',
      closing.secondaryAction.href
    )
  })

  it('renders no closing cell when closing is omitted', () => {
    const { queryByRole } = band({ closing: undefined })

    expect(queryByRole('heading', { level: 2 })).toBeNull()
    expect(queryByRole('link', { name: closing.primaryAction.label })).toBeNull()
  })

  it('renders only the section when subjects is empty', () => {
    const { getByTestId, queryAllByRole } = band({ subjects: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryAllByRole('heading')).toHaveLength(0)
    expect(queryAllByRole('link')).toHaveLength(0)
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations without a closing cell', async () => {
    const { container } = band({ closing: undefined })

    await expectNoA11yViolations(container)
  })
})

import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import TemplateGallery from './template-gallery.vue'

const TESTID = 'sections-template-gallery'
const TITLE = 'Quick Start with Templates'
const WALL_LABEL = 'Templates you can deploy'
const DEPLOY = 'Deploy now'

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Talk to a specialist', href: '/contact', trailing: true }

const templates = [
  {
    title: 'Astro Odyssey',
    description: 'A marketing website starter built with Astro.',
    icon: 'ai-cor ai-astro',
    href: '/templates/astro-odyssey'
  },
  {
    title: 'Next.js Commerce',
    description: 'Ecommerce template built with Next.js.',
    icon: 'ai-cor ai-next',
    invertInDark: true,
    href: '/templates/nextjs-commerce'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(TemplateGallery, {
    props: {
      eyebrow: 'Your Stack, Your Way',
      title: TITLE,
      description: 'Deploy complete projects in seconds.',
      primaryAction,
      secondaryAction,
      templates,
      deployLabel: DEPLOY,
      templatesAriaLabel: WALL_LABEL,
      tickerLabel: 'Compatible with Your Stack',
      tickerMarks: ['nextjs', 'astro'],
      ...props
    }
  })

describe('TemplateGallery', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(TemplateGallery, {
      props: { title: TITLE, templates },
      attrs: { 'data-testid': 'retail-templates' }
    })

    expect(getByTestId('retail-templates')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 that names the band region', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
  })

  it('names the scrolling wall with templatesAriaLabel', () => {
    const { getByLabelText } = band()

    expect(getByLabelText(WALL_LABEL)).toBeInTheDocument()
  })

  it('renders one card per template, in order, each with a deploy link to its href', () => {
    const { getAllByRole, getByText } = band()

    templates.forEach((template) => {
      expect(getByText(template.title)).toBeInTheDocument()
      expect(getByText(template.description)).toBeInTheDocument()
    })
    const deploys = getAllByRole('link', { name: DEPLOY })
    expect(deploys.map((link) => link.getAttribute('href'))).toEqual(
      templates.map((template) => template.href)
    )
  })

  it('flags only the marks that invert in dark', () => {
    const { container } = band()

    const marks = Array.from(container.querySelectorAll('i.ai-cor'))
    expect(marks.map((mark) => mark.hasAttribute('data-invert'))).toEqual([false, true])
  })

  it('renders no deploy button without a deploy label or a template href', () => {
    const withoutLabel = band({ deployLabel: '' })
    expect(withoutLabel.queryAllByRole('link', { name: DEPLOY })).toHaveLength(0)
    withoutLabel.unmount()

    const withoutHref = band({ templates: [{ title: 'Bare', description: 'No link.' }] })
    expect(withoutHref.queryAllByRole('link', { name: DEPLOY })).toHaveLength(0)
    expect(withoutHref.getByText('Bare')).toBeInTheDocument()
  })

  it('skips templates without a title', () => {
    const { getAllByRole } = band({
      templates: [...templates, { title: '', description: 'Untitled', href: '/untitled' }]
    })

    expect(getAllByRole('link', { name: DEPLOY })).toHaveLength(templates.length)
  })

  it('renders both actions as links to their href', () => {
    const { getByRole } = band()

    expect(getByRole('link', { name: primaryAction.label })).toHaveAttribute(
      'href',
      primaryAction.href
    )
    expect(getByRole('link', { name: secondaryAction.label })).toHaveAttribute(
      'href',
      secondaryAction.href
    )
  })

  it('renders no action when both are omitted', () => {
    const { queryByRole } = band({ primaryAction: undefined, secondaryAction: undefined })

    expect(queryByRole('link', { name: primaryAction.label })).toBeNull()
    expect(queryByRole('link', { name: secondaryAction.label })).toBeNull()
  })

  it('renders the ticker label only when there are marks', () => {
    const withMarks = band()
    expect(withMarks.getByText('Compatible with Your Stack')).toBeInTheDocument()
    withMarks.unmount()

    const withoutMarks = band({ tickerMarks: [] })
    expect(withoutMarks.queryByText('Compatible with Your Stack')).toBeNull()
  })

  it('renders only the root when templates is empty', () => {
    const { getByTestId, queryByRole } = band({ templates: [] })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations with an empty band', async () => {
    const { container } = band({ templates: [] })

    await expectNoA11yViolations(container)
  })
})

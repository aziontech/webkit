import { render } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import ClosingCallToActionTemplates from './closing-call-to-action-templates.vue'

const TESTID = 'sections-closing-call-to-action-templates'
const TITLE = 'Start from a template. Ship today.'
const GRID_LABEL = 'Templates you can deploy'
const DEPLOY = 'Deploy'

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Browse all templates', href: '/templates', trailing: true }

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
  render(ClosingCallToActionTemplates, {
    props: {
      anchor: 'contact',
      title: TITLE,
      description: 'Pick a starter and deploy it in seconds.',
      primaryAction,
      secondaryAction,
      templates,
      deployLabel: DEPLOY,
      templatesAriaLabel: GRID_LABEL,
      ...props
    }
  })

describe('ClosingCallToActionTemplates', () => {
  it('renders the band under the default testid with the anchor as its id', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'contact')
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(ClosingCallToActionTemplates, {
      props: { title: TITLE, templates },
      attrs: { 'data-testid': 'retail-close' }
    })

    expect(getByTestId('retail-close')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders the title as the h2 that names the band region', () => {
    const { getByRole } = band()

    expect(getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
    expect(getByRole('region', { name: TITLE })).toBeInTheDocument()
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

  it('names the scrolling grid of templates with templatesAriaLabel', () => {
    const { getByLabelText } = band()

    expect(getByLabelText(GRID_LABEL)).toBeInTheDocument()
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

  it('skips templates without a title and omits the grid when none is left', () => {
    const skipped = band({
      templates: [...templates, { title: '', description: 'Untitled', href: '/untitled' }]
    })
    expect(skipped.getAllByRole('link', { name: DEPLOY })).toHaveLength(templates.length)
    skipped.unmount()

    const empty = band({ templates: [] })
    expect(empty.queryByLabelText(GRID_LABEL)).toBeNull()
    expect(empty.getByRole('heading', { level: 2, name: TITLE })).toBeInTheDocument()
  })

  it('renders only the root when the title is empty', () => {
    const { getByTestId, queryByRole } = band({ title: '' })

    expect(getByTestId(TESTID)).toBeInTheDocument()
    expect(queryByRole('heading')).toBeNull()
    expect(queryByRole('link')).toBeNull()
  })

  it('has no a11y violations with a full band', async () => {
    const { container } = band()

    await expectNoA11yViolations(container)
  })

  it('has no a11y violations without templates', async () => {
    const { container } = band({ templates: [] })

    await expectNoA11yViolations(container)
  })
})

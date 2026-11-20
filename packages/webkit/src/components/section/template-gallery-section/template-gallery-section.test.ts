import '../../../test/reflow.css'

import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page } from 'vitest/browser'

import { expectNoA11yViolations } from '../../../test/axe'
import TemplateGallerySection from './template-gallery-section.vue'

const TESTID = 'template-gallery-section'
const TITLE = 'Quick Start with Templates'
const WALL_LABEL = 'Templates you can deploy'
const DEPLOY = 'Deploy now'

const primaryAction = { label: 'Start for free', href: '/signup' }
const secondaryAction = { label: 'Talk to sales', href: '/contact', trailing: true }

const templates = [
  {
    title: 'Astro Odyssey',
    description: 'A marketing website starter built with Astro.',
    icon: 'az-color az-astro',
    href: '/templates/astro-odyssey'
  },
  {
    title: 'Next.js Commerce',
    description: 'Ecommerce template built with Next.js.',
    icon: 'az-color az-nextjs',
    invertInDark: true,
    href: '/templates/nextjs-commerce'
  }
]

const band = (props: Record<string, unknown> = {}) =>
  render(TemplateGallerySection, {
    props: {
      eyebrow: 'Your Stack, Your Way',
      title: TITLE,
      description: 'Deploy complete projects in seconds.',
      primaryAction,
      secondaryAction,
      templates,
      deployLabel: DEPLOY,
      templatesAriaLabel: WALL_LABEL,
      marqueeLabel: 'Compatible with Your Stack',
      marqueeMarks: ['nextjs', 'astro'],
      ...props
    }
  })

describe('TemplateGallerySection', () => {
  it('renders the band under the default testid', () => {
    const { getByTestId } = band()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = render(TemplateGallerySection, {
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

    const marks = Array.from(container.querySelectorAll('i.az-color'))
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

  it('makes the whole card a pointer link to its href, hidden behind the deploy button', () => {
    const { getAllByTestId } = band()

    const cardLinks = getAllByTestId(`${TESTID}__card-link`)
    expect(cardLinks.map((link) => link.getAttribute('href'))).toEqual(
      templates.map((template) => template.href)
    )
    cardLinks.forEach((link) => {
      expect(link).toHaveAttribute('tabindex', '-1')
      expect(link).toHaveAttribute('aria-hidden', 'true')
      expect(link.parentElement).toHaveAttribute('data-linked', 'true')
    })
  })

  it('keeps one tab stop per card', () => {
    const { getAllByRole } = band()

    expect(getAllByRole('link', { name: DEPLOY })).toHaveLength(templates.length)
    expect(
      getAllByRole('link').filter((link) => link.getAttribute('tabindex') === '-1')
    ).toHaveLength(0)
  })

  it('names the card link by the template title when the card has no deploy button', () => {
    const { getByRole } = band({ deployLabel: '' })

    templates.forEach((template) => {
      const link = getByRole('link', { name: template.title })
      expect(link).toHaveAttribute('href', template.href)
      expect(link.hasAttribute('tabindex')).toBe(false)
    })
  })

  it('renders no card link and no pointer for a card without an href', () => {
    const { getByText, queryByTestId } = band({
      templates: [{ title: 'Bare', description: 'No link.' }]
    })

    expect(queryByTestId(`${TESTID}__card-link`)).toBeNull()
    expect(getByText('Bare').closest('[data-linked]')).toBeNull()
  })

  it('sets the anchor as the band id', () => {
    const { getByTestId } = band({ anchor: 'templates' })

    expect(getByTestId(TESTID)).toHaveAttribute('id', 'templates')
  })

  it('has no a11y violations when the cards link without a deploy button', async () => {
    const { container } = band({ deployLabel: '' })

    await expectNoA11yViolations(container)
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

  it('renders the marquee label only when there are marks', () => {
    const withMarks = band()
    expect(withMarks.getByText('Compatible with Your Stack')).toBeInTheDocument()
    withMarks.unmount()

    const withoutMarks = band({ marqueeMarks: [] })
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

  it('draws no closing frame unless the band is closing', () => {
    const { getByTestId } = render(TemplateGallerySection, { props: { title: 'Start', templates } })

    expect(getByTestId(TESTID).querySelector('[data-hatch="true"]')).toBeNull()
  })

  it('draws the closing frame under a closing band and drops it when hatch is off', () => {
    const on = render(TemplateGallerySection, {
      props: { title: 'Start', templates, closing: true }
    })
    expect(on.getByTestId(TESTID).querySelector('[data-hatch="true"]')).not.toBeNull()
    on.unmount()

    const off = render(TemplateGallerySection, {
      props: { title: 'Start', templates, closing: true, hatch: false }
    })
    expect(off.getByTestId(TESTID).querySelector('[data-hatch="true"]')).toBeNull()
    expect(off.getByRole('heading', { level: 2, name: 'Start' })).toBeInTheDocument()
  })

  it('draws no closing frame when no template carries a title', () => {
    const { getByTestId } = render(TemplateGallerySection, {
      props: { title: 'Start', templates: [], closing: true }
    })

    expect(getByTestId(TESTID).children).toHaveLength(0)
  })

  describe('layout', () => {
    const CLOSING_TITLE = 'Start from a template. Ship it today.'

    afterEach(async () => {
      await page.viewport(414, 896)
    })

    const mountIn = (width: number) => {
      const host = document.createElement('div')
      host.style.width = `${width}px`
      document.body.appendChild(host)
      return render(TemplateGallerySection, {
        props: {
          eyebrow: 'Your Stack, Your Way',
          title: CLOSING_TITLE,
          description:
            'Launch storefronts faster with pre-built templates and starter kits. Deploy complete projects in seconds with popular frameworks.',
          primaryAction,
          secondaryAction,
          templates,
          deployLabel: DEPLOY
        },
        container: host
      })
    }

    const linesOf = (heading: HTMLElement) =>
      Math.round(
        heading.getBoundingClientRect().height /
          Number.parseFloat(getComputedStyle(heading).lineHeight)
      )

    const cellsOf = (view: ReturnType<typeof mountIn>) => {
      const copy = view.getByTestId('media-split__copy-cell').getBoundingClientRect()
      const media = view.getByTestId('media-split__media-cell').getBoundingClientRect()
      return { copy, media }
    }

    const deployButtonsOutsideTheirCard = (view: ReturnType<typeof mountIn>) =>
      view.getAllByRole('link', { name: DEPLOY }).filter((button) => {
        const card = button.parentElement as HTMLElement
        const inner =
          card.getBoundingClientRect().right -
          Number.parseFloat(getComputedStyle(card).paddingRight)
        return button.getBoundingClientRect().right > inner + 0.5
      })

    it.each([
      [1440, 1376],
      [1440, 1200],
      [1440, 1000],
      [1920, 1120],
      [1024, 960]
    ])(
      "splits a %ipx screen's %ipx band in two equal halves, the headline in two lines and the cards inside theirs",
      async (screen, width) => {
        await page.viewport(screen, 900)
        const view = mountIn(width)
        const heading = view.getByRole('heading', { level: 2, name: CLOSING_TITLE })
        const { copy, media } = cellsOf(view)

        expect(media.left).toBeGreaterThanOrEqual(copy.right)
        expect(Math.abs(copy.width - media.width)).toBeLessThanOrEqual(1)
        expect(linesOf(heading)).toBe(2)
        expect(heading.getBoundingClientRect().right).toBeLessThanOrEqual(copy.right)
        expect(view.getAllByRole('link', { name: DEPLOY })).toHaveLength(templates.length)
        expect(deployButtonsOutsideTheirCard(view)).toHaveLength(0)
      }
    )

    it('stacks the copy over the templates in a band narrower than 60rem, even on a wide screen', async () => {
      await page.viewport(1920, 900)
      const view = mountIn(900)
      const heading = view.getByRole('heading', { level: 2, name: CLOSING_TITLE })
      const { copy, media } = cellsOf(view)

      expect(media.top).toBeGreaterThanOrEqual(copy.bottom)
      expect(media.width).toBeCloseTo(900, 0)
      expect(linesOf(heading)).toBe(2)
    })

    it('keeps the band inside a 320 px screen', async () => {
      await page.viewport(320, 800)
      const view = mountIn(320)
      const root = view.getByTestId(TESTID)
      const heading = view.getByRole('heading', { level: 2, name: CLOSING_TITLE })

      expect(root.scrollWidth).toBeLessThanOrEqual(320)
      expect(heading.getBoundingClientRect().right).toBeLessThanOrEqual(320)
      expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320)
    })
  })
})

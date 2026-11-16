import userEvent from '@testing-library/user-event'
import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import legacyPropMaps from '../../../cli/migrations/v6-props.json'
import { expectNoA11yViolations } from '../../../test/axe'
import SitePage, { type SitePageSection, type SitePageSubmit } from './site-page.vue'
import { resolveSectionEntry, sitePageSectionAliases, sitePageSections } from './site-page-sections'

const TESTID = 'site-page'
const HEADLINE = 'Deliver content fast, worldwide'
const FAQ_TITLE = 'Frequently asked questions'
const USES_TITLE = 'What teams use it for'

const hero: SitePageSection[] = [
  {
    _id: 'hero-section',
    props: { variant: 'title-band', title: HEADLINE, description: 'From data.' }
  }
]

const faq: SitePageSection = {
  _id: 'faq-section',
  props: {
    title: FAQ_TITLE,
    items: [{ question: 'What is it?', answer: 'A page rendered from data.' }]
  }
}

const uses: SitePageSection = {
  _id: 'customer-use-cases-section',
  props: {
    title: USES_TITLE,
    items: [{ icon: 'ai ai-bolt', title: 'Fast pages', description: 'Served close to the reader.' }]
  }
}

const newsletterForm = {
  placeholder: 'Your email',
  submitLabel: 'Subscribe',
  successMessage: 'Subscribed.',
  errorMessage: 'Could not subscribe.',
  requiredMessage: 'Enter your email address.',
  invalidMessage: 'Enter an email address like name@example.com.'
}

const page = (props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) =>
  render(SitePage, { props: { hero, sections: [uses, faq], ...props }, attrs })

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SitePage', () => {
  it('renders under the default testid', () => {
    const { getByTestId } = page()

    expect(getByTestId(TESTID)).toBeInTheDocument()
  })

  it('lets a consumer data-testid win over the fallback', () => {
    const { getByTestId, queryByTestId } = page({}, { 'data-testid': 'landing' })

    expect(getByTestId('landing')).toBeInTheDocument()
    expect(queryByTestId(TESTID)).toBeNull()
  })

  it('renders each entry with the section its _id names, binding its props', async () => {
    const { findByRole } = page()

    expect(await findByRole('heading', { level: 1, name: HEADLINE })).toBeInTheDocument()
    expect(await findByRole('heading', { level: 2, name: USES_TITLE })).toBeInTheDocument()
    expect(await findByRole('heading', { level: 2, name: FAQ_TITLE })).toBeInTheDocument()
  })

  it('renders the openings before the column, and the column in data order', async () => {
    const { findByRole } = page()

    const opening = await findByRole('heading', { level: 1, name: HEADLINE })
    const first = await findByRole('heading', { level: 2, name: USES_TITLE })
    const second = await findByRole('heading', { level: 2, name: FAQ_TITLE })

    expect(opening.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(first.compareDocumentPosition(second) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })

  it('draws a hatched gap before each column section and one after the last', () => {
    const { getAllByTestId } = page()

    const gaps = getAllByTestId('section-gap')
    expect(gaps).toHaveLength(3)
    for (const gap of gaps) expect(gap.getAttribute('data-hatch')).toBe('true')
  })

  it('follows the gap of an entry: none drops the break, small narrows it', () => {
    const { getAllByTestId } = page({
      sections: [
        { ...uses, gap: 'none' },
        { ...faq, gap: 'small' }
      ]
    })

    const gaps = getAllByTestId('section-gap')
    expect(gaps).toHaveLength(2)
    expect(gaps[0].getAttribute('data-size')).toBe('small')
    expect(gaps[1].getAttribute('data-size')).toBe('medium')
  })

  it('closes a page that ends on a closing band with its frame, not a trailing gap', async () => {
    const closing: SitePageSection = {
      _id: 'closing-call-to-action-section',
      props: { variant: 'panel', title: 'Ready to start?' }
    }
    const { findByTestId, getAllByTestId } = page({ sections: [uses, closing] })

    const band = await findByTestId('closing-call-to-action-section')
    expect(band.querySelector('[data-hatch="true"]')).not.toBeNull()
    expect(getAllByTestId('section-gap')).toHaveLength(2)
  })

  it('binds hatch off on a closing band stacked over another, so the page closes once', async () => {
    const { findAllByRole, findAllByTestId, getAllByTestId } = page({
      sections: [
        { _id: 'closing-call-to-action-section', props: { variant: 'panel', title: 'Join us' } },
        {
          _id: 'closing-call-to-action-section',
          props: { variant: 'primary', title: 'Start for free' }
        }
      ]
    })

    await waitFor(async () => expect(await findAllByRole('heading', { level: 2 })).toHaveLength(2))
    const bands = await findAllByTestId('closing-call-to-action-section')
    expect(bands).toHaveLength(2)
    expect(bands[0].querySelector('[data-hatch="true"]')).toBeNull()
    expect(bands[1].querySelector('[data-hatch="true"]')).not.toBeNull()
    expect(getAllByTestId('section-gap')).toHaveLength(2)
  })

  it('draws no gap before a frame close, and no trailing gap after it', async () => {
    const { findByTestId, getAllByTestId } = page({
      sections: [uses, { _id: 'closing-call-to-action-section', props: { variant: 'frame' } }]
    })

    const frame = await findByTestId('closing-call-to-action-section')
    expect(frame.getAttribute('data-variant')).toBe('frame')
    expect(getAllByTestId('section-gap')).toHaveLength(1)
  })

  it('keeps the trailing gap after a closing band whose page data turns hatch off', async () => {
    const { findByTestId, getAllByTestId } = page({
      sections: [
        { _id: 'closing-call-to-action-section', props: { title: 'Ready?', hatch: false } }
      ]
    })

    await findByTestId('closing-call-to-action-section')
    expect(getAllByTestId('section-gap')).toHaveLength(2)
  })

  it('renders no column at all when there are no column sections', () => {
    const { queryAllByTestId, queryByTestId } = page({ sections: [] })

    expect(queryAllByTestId('section-gap')).toHaveLength(0)
    expect(queryByTestId('section-container')).toBeNull()
  })

  it('skips an unknown _id with a development warning naming it, and renders the rest', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { findByRole, getAllByTestId } = page({
      sections: [{ _id: 'not-a-section-for-the-test', props: {} }, faq]
    })

    expect(await findByRole('heading', { level: 2, name: FAQ_TITLE })).toBeInTheDocument()
    expect(getAllByTestId('section-gap')).toHaveLength(2)
    expect(warn.mock.calls.flat().join(' ')).toContain('"not-a-section-for-the-test"')
  })

  it('draws a named scene in the slot of the same name, merged with the slot props', async () => {
    const { findByTestId } = page({
      hero: [],
      sections: [
        {
          _id: 'console-showcase-section',
          props: { variant: 'diagram', title: 'Requests take the shortest path' },
          scenes: {
            scene: {
              component: 'Illustration',
              props: {
                name: 'global-network',
                ariaLabel: 'Requests routed to the nearest location'
              }
            }
          }
        }
      ]
    })

    expect(await findByTestId('illustration')).toBeInTheDocument()
  })

  it.each([
    ['ConsoleApplicationScene', 'assets-console-application-scene'],
    ['ConsoleTraceScene', 'assets-console-trace-scene'],
    ['FunctionsHeroCanvas', 'assets-runtime-api-scene'],
    ['RuntimeApiCloud', 'assets-runtime-api-cloud']
  ])('draws the ported %s scene by name', async (component, testId) => {
    const { findByTestId } = page({
      hero: [],
      sections: [
        {
          _id: 'console-showcase-section',
          props: { variant: 'diagram', title: 'Requests take the shortest path' },
          scenes: { scene: { component, props: { animated: false } } }
        }
      ]
    })

    expect(await findByTestId(testId)).toBeInTheDocument()
  })

  it('skips a scene the registry does not hold, with a development warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { findByRole, queryByTestId } = page({
      hero: [],
      sections: [
        {
          _id: 'console-showcase-section',
          props: { variant: 'diagram', title: 'Requests take the shortest path' },
          scenes: { scene: { component: 'NotASceneForTheTest' } }
        }
      ]
    })

    expect(
      await findByRole('heading', { level: 2, name: 'Requests take the shortest path' })
    ).toBeInTheDocument()
    expect(queryByTestId('illustration')).toBeNull()
    expect(warn.mock.calls.flat().join(' ')).toContain('"NotASceneForTheTest"')
  })

  it('emits submit with the event first, then the entry and the values of its form', async () => {
    const newsletter: SitePageSection = {
      _id: 'newsletter-section',
      props: { title: 'Subscribe to our newsletter', form: newsletterForm },
      submission: { endpoint: '/subscribe' }
    }
    const { findByLabelText, getByRole, emitted } = page({ hero: [], sections: [newsletter] })

    const input = await findByLabelText('Subscribe to our newsletter', { selector: 'input' })
    await userEvent.type(input, 'ada@example.com')
    await userEvent.click(getByRole('button', { name: 'Subscribe' }))

    const calls = emitted<[SubmitEvent, SitePageSubmit]>('submit')
    expect(calls).toHaveLength(1)
    expect(calls[0][0].type).toBe('submit')
    expect(calls[0][1].section).toEqual(newsletter)
    expect(Object.values(calls[0][1].values)).toContain('ada@example.com')
  })

  it('emits nothing for a form that fails its own validation', async () => {
    const { findByRole, emitted } = page({
      hero: [],
      sections: [
        {
          _id: 'newsletter-section',
          props: { title: 'Subscribe to our newsletter', form: newsletterForm }
        }
      ]
    })

    await userEvent.click(await findByRole('button', { name: 'Subscribe' }))

    expect(emitted('submit')).toBeUndefined()
  })

  it('registers every page section except the site frame', () => {
    const folders = Object.keys(import.meta.glob('../../section/*/*.vue'))
      .map((path) => path.split('/')[3])
      .filter((name, index, all) => all.indexOf(name) === index)
      .filter((name) => name !== 'site-header-section' && name !== 'site-footer-section')
      .sort()

    expect(Object.keys(sitePageSections).sort()).toEqual(folders)
  })

  it('maps every retired _id to a registered section, and registers no retired one', () => {
    for (const [id, alias] of Object.entries(sitePageSectionAliases)) {
      expect(Object.keys(sitePageSections)).toContain(alias.target)
      expect(Object.keys(sitePageSections)).not.toContain(id)
    }
  })

  it.each([
    ['hero-copy-on-top-art', { title: 'T' }, 'hero-section', { variant: 'copy-on-top-art' }],
    ['hero-with-opening', { title: 'T' }, 'hero-section', { variant: 'title-band', size: 'large' }],
    [
      'closing-call-to-action-agents',
      { title: 'T' },
      'closing-call-to-action-section',
      { variant: 'primary' }
    ],
    [
      'closing-call-to-action-templates',
      { title: 'T' },
      'template-gallery-section',
      { closing: true }
    ],
    [
      'sticky-carousel',
      { items: [{ title: 'Plan' }] },
      'process-scroll-section',
      { steps: [{ title: 'Plan' }], pinned: true }
    ],
    ['sticky-scroll-code', { title: 'T' }, 'feature-scroll-section', { title: 'T' }],
    [
      'compare-support-tiers',
      { tiers: [{ name: 'Pro' }] },
      'plan-comparison-section',
      { plans: [{ name: 'Pro' }] }
    ],
    ['article-index-blog', {}, 'article-index-section', { filters: 'category-search' }],
    ['article-index-resource-hub', {}, 'article-index-section', { filters: 'facets' }],
    ['use-case-links', { items: [] }, 'capability-grid-section', { titleAlign: 'start' }],
    [
      'resource-grid',
      { items: [{ title: 'A' }, {}] },
      'capability-grid-section',
      { items: [{ title: 'A' }] }
    ],
    [
      'code-split',
      { primaryAction: { label: 'Go' } },
      'media-split-section',
      { primaryAction: { variant: 'secondary', label: 'Go' } }
    ],
    [
      'customer-spotlight',
      { items: [{ name: 'Acme', description: 'Story' }] },
      'client-story-columns-section',
      { reveal: 'hover', cells: [{ name: 'Acme', story: 'Story' }] }
    ]
  ])('renders the retired _id %s with its successor', (id, props, target, expected) => {
    const resolved = resolveSectionEntry(id, props)
    expect(resolved.id).toBe(target)
    expect(resolved.props).toMatchObject(expected)
    expect(resolved.props).not.toHaveProperty('tiers')
  })

  it('leaves a current _id and its props untouched', () => {
    const props = { title: 'T' }
    expect(resolveSectionEntry('faq-section', props)).toEqual({ id: 'faq-section', props })
  })

  it('renders an entry under a retired _id with its successor, without a warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { findByTestId } = page({
      hero: [{ _id: 'hero-copy-on-top-art', props: { title: HEADLINE } }],
      sections: [uses]
    })

    const band = await findByTestId('hero-section')
    expect(band.getAttribute('data-variant')).toBe('copy-on-top-art')
    expect(warn).not.toHaveBeenCalled()
  })

  it('renders an old hero-band entry with its old kind value on the renamed layout', async () => {
    const { findByTestId } = page({
      hero: [{ _id: 'hero-band', props: { kind: 'centered', title: HEADLINE } }],
      sections: [uses]
    })

    const band = await findByTestId('hero-section')
    expect(band.getAttribute('data-variant')).toBe('center')
    expect(band.hasAttribute('kind')).toBe(false)
  })

  it('translates old props on a current _id and keeps a new prop that is already set', () => {
    expect(resolveSectionEntry('hero-section', { kind: 'centered-band', title: 'T' })).toEqual({
      id: 'hero-section',
      props: { variant: 'center-band', title: 'T' }
    })
    expect(resolveSectionEntry('network-section', { kind: 'a', variant: 'b' }).props).toEqual({
      kind: 'a',
      variant: 'b'
    })
    expect(
      resolveSectionEntry('hero-with-opening', { highlight: 'Build', title: 'fast' }).props
    ).toMatchObject({ variant: 'title-band', titleHighlight: 'Build', title: 'fast' })
  })

  const sectionRenames = Object.entries(legacyPropMaps as Record<string, Record<string, unknown>>)
    .filter(([id]) => Object.prototype.hasOwnProperty.call(sitePageSections, id))
    .flatMap(([id, renames]) =>
      Object.entries(renames)
        .filter(
          ([from, rename]) => !from.startsWith('#') && !(rename as { removed?: string }).removed
        )
        .map(([from, rename]) => {
          const to = typeof rename === 'string' ? rename : (rename as { to: string }).to
          const values =
            typeof rename === 'string' ? {} : (rename as { values: Record<string, string> }).values
          const [oldValue, newValue] = Object.entries(values)[0] ?? ['old', 'old']
          return [id, from, to, oldValue, newValue] as const
        })
    )

  it.each(sectionRenames)(
    'translates %s %s to %s from the v6 props map',
    (id, from, to, oldValue, newValue) => {
      expect(resolveSectionEntry(id, { [from]: oldValue }).props).toEqual({ [to]: newValue })
    }
  )

  it('closes the page on a template gallery set as closing, with no trailing gap after it', async () => {
    const { findByTestId, getAllByTestId } = page({
      sections: [
        uses,
        {
          _id: 'closing-call-to-action-templates',
          props: { title: 'Start from a template', templates: [{ title: 'Astro', href: '#' }] }
        }
      ]
    })

    const band = await findByTestId('template-gallery-section')
    expect(band.querySelector('[data-hatch="true"]')).not.toBeNull()
    expect(getAllByTestId('section-gap')).toHaveLength(2)
  })

  it('has no a11y violations', async () => {
    const { container, findByRole } = page()

    await findByRole('heading', { level: 2, name: FAQ_TITLE })
    await expectNoA11yViolations(container)
  })
})

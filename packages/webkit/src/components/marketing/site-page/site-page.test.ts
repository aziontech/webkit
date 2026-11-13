import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { expectNoA11yViolations } from '../../../test/axe'
import SitePage, { type SitePageSection, type SitePageSubmit } from './site-page.vue'
import { sitePageSections } from './site-page-sections'

const TESTID = 'marketing-site-page'
const HEADLINE = 'Deliver content fast, worldwide'
const FAQ_TITLE = 'Frequently asked questions'
const USES_TITLE = 'What teams use it for'

const hero: SitePageSection[] = [
  { _id: 'hero-band', props: { kind: 'title-band', title: HEADLINE, description: 'From data.' } }
]

const faq: SitePageSection = {
  _id: 'faq-section',
  props: {
    title: FAQ_TITLE,
    items: [{ question: 'What is it?', answer: 'A page rendered from data.' }]
  }
}

const uses: SitePageSection = {
  _id: 'use-cases',
  props: {
    title: USES_TITLE,
    items: [{ icon: 'pi pi-bolt', title: 'Fast pages', description: 'Served close to the reader.' }]
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

    const gaps = getAllByTestId('marketing-section-gap')
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

    const gaps = getAllByTestId('marketing-section-gap')
    expect(gaps).toHaveLength(2)
    expect(gaps[0].getAttribute('data-size')).toBe('small')
    expect(gaps[1].getAttribute('data-size')).toBe('medium')
  })

  it('renders no column at all when there are no column sections', () => {
    const { queryAllByTestId, queryByTestId } = page({ sections: [] })

    expect(queryAllByTestId('marketing-section-gap')).toHaveLength(0)
    expect(queryByTestId('marketing-section-container')).toBeNull()
  })

  it('skips an unknown _id with a development warning naming it, and renders the rest', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { findByRole, getAllByTestId } = page({
      sections: [{ _id: 'not-a-section-for-the-test', props: {} }, faq]
    })

    expect(await findByRole('heading', { level: 2, name: FAQ_TITLE })).toBeInTheDocument()
    expect(getAllByTestId('marketing-section-gap')).toHaveLength(2)
    expect(warn.mock.calls.flat().join(' ')).toContain('"not-a-section-for-the-test"')
  })

  it('draws a named scene in the slot of the same name, merged with the slot props', async () => {
    const { findByTestId } = page({
      hero: [],
      sections: [
        {
          _id: 'console-panel',
          props: { kind: 'diagram', title: 'Requests take the shortest path' },
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

    expect(await findByTestId('content-illustration')).toBeInTheDocument()
  })

  it('skips a scene the registry does not hold, with a development warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const { findByRole, queryByTestId } = page({
      hero: [],
      sections: [
        {
          _id: 'console-panel',
          props: { kind: 'diagram', title: 'Requests take the shortest path' },
          scenes: { scene: { component: 'NotASceneForTheTest' } }
        }
      ]
    })

    expect(
      await findByRole('heading', { level: 2, name: 'Requests take the shortest path' })
    ).toBeInTheDocument()
    expect(queryByTestId('content-illustration')).toBeNull()
    expect(warn.mock.calls.flat().join(' ')).toContain('"NotASceneForTheTest"')
  })

  it('emits submit with the event first, then the entry and the values of its form', async () => {
    const newsletter: SitePageSection = {
      _id: 'closing-call-to-action-newsletter',
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
          _id: 'closing-call-to-action-newsletter',
          props: { title: 'Subscribe to our newsletter', form: newsletterForm }
        }
      ]
    })

    await userEvent.click(await findByRole('button', { name: 'Subscribe' }))

    expect(emitted('submit')).toBeUndefined()
  })

  it('registers every page section except the site frame', () => {
    const folders = Object.keys(import.meta.glob('../../sections/*/*.vue'))
      .map((path) => path.split('/')[3])
      .filter((name, index, all) => all.indexOf(name) === index)
      .filter((name) => name !== 'site-nav' && name !== 'site-footer')
      .sort()

    expect(Object.keys(sitePageSections).sort()).toEqual(folders)
  })

  it('has no a11y violations', async () => {
    const { container, findByRole } = page()

    await findByRole('heading', { level: 2, name: FAQ_TITLE })
    await expectNoA11yViolations(container)
  })
})

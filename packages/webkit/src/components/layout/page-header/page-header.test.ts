import '../../../test/reflow.css'

import { render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Default from '../../../../examples/page-header/default.vue'
import DetailPage from '../../../../examples/page-header/detail-page.vue'
import RichDescription from '../../../../examples/page-header/rich-description.vue'
import Sizes from '../../../../examples/page-header/sizes.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import PageHeader from './page-header.vue'

describe('PageHeader', () => {
  it('renders a header landmark with the title as the h1 and the default testid', () => {
    const { getByTestId, getByRole } = within(
      render(PageHeader, { props: { title: 'Resources' } }).container as HTMLElement
    )

    expect(getByTestId('page-header').tagName).toBe('HEADER')
    expect(getByRole('heading', { level: 1 }).textContent?.trim()).toBe('Resources')
  })

  it('honours a consumer data-testid across the subtree', () => {
    const { getByTestId } = within(
      render(PageHeader, {
        props: { title: 'Resources', description: 'All of them.' },
        attrs: { 'data-testid': 'resources-header' }
      }).container as HTMLElement
    )

    expect(getByTestId('resources-header__title').textContent?.trim()).toBe('Resources')
    expect(getByTestId('resources-header__description').textContent?.trim()).toBe('All of them.')
  })

  it.each(['small', 'medium', 'large'] as const)('mirrors size=%s onto data-size', (size) => {
    const { getByTestId } = within(
      render(PageHeader, { props: { title: 'Resources', size } }).container as HTMLElement
    )

    expect(getByTestId('page-header').getAttribute('data-size')).toBe(size)
    expect(getByTestId('page-header__title').getAttribute('data-size')).toBe(size)
  })

  it('defaults to the medium size', () => {
    const { getByTestId } = within(
      render(PageHeader, { props: { title: 'Resources' } }).container as HTMLElement
    )

    expect(getByTestId('page-header').getAttribute('data-size')).toBe('medium')
  })

  it('renders the description and actions regions only when given', () => {
    const bare = within(
      render(PageHeader, { props: { title: 'Resources' } }).container as HTMLElement
    )
    expect(bare.queryByTestId('page-header__description')).toBeNull()
    expect(bare.queryByTestId('page-header__actions')).toBeNull()

    const full = within(
      render(PageHeader, {
        props: { title: 'Resources' },
        slots: {
          description: 'Read the <a href="#docs">docs</a>.',
          actions: '<button type="button">Create Resource</button>'
        }
      }).container as HTMLElement
    )
    expect(full.getByTestId('page-header__description').querySelector('a')).toBeTruthy()
    expect(full.getByRole('button', { name: 'Create Resource' })).toBeTruthy()
  })

  it('sets titleId on the h1 so a landmark can reference it', () => {
    const { getByRole } = within(
      render(PageHeader, { props: { title: 'Profile', titleId: 'profile-title' } })
        .container as HTMLElement
    )

    expect(getByRole('heading', { level: 1 }).id).toBe('profile-title')
  })

  it('renders the examples', () => {
    const def = within(render(Default).container as HTMLElement)
    expect(def.getAllByRole('link').length + def.getAllByRole('button').length).toBe(2)

    const sizes = within(render(Sizes).container as HTMLElement)
    expect(sizes.getAllByTestId('page-header').map((el) => el.dataset['size'])).toEqual([
      'large',
      'medium',
      'small'
    ])

    const rich = within(render(RichDescription).container as HTMLElement)
    expect(rich.getAllByRole('button')).toHaveLength(2)
  })

  it('has no accessibility violations', async () => {
    const { container } = render(Default)
    await expectNoA11yViolations(container)
  })

  const boxOf = (width: number) => {
    const host = document.createElement('div')
    host.style.width = `${width}px`
    document.body.appendChild(host)
    return host
  }

  describe('in a narrow box', () => {
    const mountIn = (width: number) =>
      render(PageHeader, {
        props: { title: 'Resources' },
        slots: { actions: '<button type="button">Create</button>' },
        container: boxOf(width)
      })

    it('stretches each action to the full width of a narrow box', () => {
      const view = mountIn(320)
      const action = view.getByRole('button', { name: 'Create' })
      const header = view.getByTestId('page-header')

      expect(Math.round(action.getBoundingClientRect().width)).toBe(
        Math.round(header.getBoundingClientRect().width)
      )
    })

    it('keeps the actions at their own width beside the title in a wide box', () => {
      const view = mountIn(1024)
      const action = view.getByRole('button', { name: 'Create' })

      expect(action.getBoundingClientRect().width).toBeLessThan(200)
    })
  })

  describe('regions', () => {
    it('renders no region wrapper when no region slot is filled', () => {
      const { queryByTestId } = within(
        render(PageHeader, { props: { title: 'Resources' } }).container as HTMLElement
      )

      for (const part of ['breadcrumbs', 'icon', 'meta', 'tabs']) {
        expect(queryByTestId(`page-header__${part}`)).toBeNull()
      }
    })

    it('renders each filled region in reading order around the title', () => {
      const { getByTestId } = within(
        render(PageHeader, {
          props: { title: 'acme-store' },
          slots: {
            breadcrumbs: '<nav aria-label="Breadcrumb"><a href="/resources">Resources</a></nav>',
            icon: '<i class="ai ai-box"></i>',
            meta: '<span>Active</span>',
            actions: '<button type="button">Deploy</button>',
            tabs: '<div role="tablist"><button role="tab" aria-selected="true">Overview</button></div>'
          }
        }).container as HTMLElement
      )

      const order = ['breadcrumbs', 'icon', 'title', 'meta', 'actions', 'tabs'].map((part) =>
        getByTestId(`page-header__${part}`)
      )
      for (let index = 1; index < order.length; index += 1) {
        expect(
          order[index - 1].compareDocumentPosition(order[index]) & Node.DOCUMENT_POSITION_FOLLOWING
        ).toBeTruthy()
      }
      expect(getByTestId('page-header__meta').textContent).toBe('Active')
    })

    it('hides the decorative icon from assistive technology', () => {
      const { getByTestId } = within(
        render(PageHeader, {
          props: { title: 'acme-store' },
          slots: { icon: '<i class="ai ai-box"></i>' }
        }).container as HTMLElement
      )

      expect(getByTestId('page-header__icon')).toHaveAttribute('aria-hidden', 'true')
    })

    it('renders the DetailPage example with its trail, tags and tabs and no a11y violations', async () => {
      const { container } = render(DetailPage)
      const view = within(container as HTMLElement)

      expect(view.getByRole('heading', { level: 1 }).textContent?.trim()).toBe('acme-store')
      expect(view.getByRole('link', { name: 'Resources' })).toHaveAttribute('href', '/resources')
      expect(view.getByTestId('page-header__meta').textContent).toContain('Active')
      expect(view.getAllByRole('tab')).toHaveLength(3)
      await expectNoA11yViolations(container)
    })
  })
})

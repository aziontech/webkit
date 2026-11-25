import '../../../test/reflow.css'

import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/breadcrumb/default.vue'
import Depths from '../../../../examples/breadcrumb/depths.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import BreadcrumbItem from './breadcrumb-item/breadcrumb-item.vue'
import BreadcrumbList from './breadcrumb-list.vue'
import BreadcrumbSeparator from './breadcrumb-separator.vue'
import Breadcrumb from './index.js'

const TESTID = 'breadcrumb'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const renderMounted = async (...args: Parameters<typeof render>) => {
  const view = render(...args)
  await nextTick()
  await frame()
  return view
}

// The suite is styled: the trail folds only when its segments do not fit its own box,
// so every fold below is rendered in a box of a fixed width.
const FIVE = [
  { label: 'Home', href: '/home' },
  { label: 'Projects', href: '/projects' },
  { label: 'Acme', href: '/projects/acme' },
  { label: 'Domains', href: '/projects/acme/domains' },
  { label: 'Settings' }
]

// The three short segments of a trail that fits a phone row.
const TRAIL = [
  { label: 'Home', href: '/home' },
  { label: 'Projects', href: '/projects' },
  { label: 'Settings' }
]

const inBox = (
  width: number,
  props: Record<string, unknown> = {},
  attrs: Record<string, unknown> = {}
) =>
  defineComponent({
    setup: () => () =>
      h('div', { style: { width: `${width}px` } }, [
        h(Breadcrumb, { items: FIVE, ...props, ...attrs })
      ])
  })

// FIVE in a 320px box keeps the first segment, the parent and the current page, and
// folds Projects and Acme into the overflow menu.
const folded = (props: Record<string, unknown> = {}, attrs: Record<string, unknown> = {}) =>
  renderMounted(inBox(320, props, attrs))

const shown = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[data-slot="label"]')).map((el) =>
    el.textContent?.trim()
  )

describe('Breadcrumb', () => {
  describe('composition, data-driven root', () => {
    describe('compound API', () => {
      it('attaches List, Item and Separator to the compound root', async () => {
        const compound = Breadcrumb
        expect(compound.List).toBe(BreadcrumbList)
        expect(compound.Item).toBe(BreadcrumbItem)
        expect(compound.Separator).toBe(BreadcrumbSeparator)
        const members = Object.keys(compound).filter((key) => /^[A-Z]/.test(key))
        expect(members.sort()).toEqual(['Item', 'List', 'Separator'])
      })
    })

    describe('full trail', () => {
      it('renders a nav with aria-label Breadcrumb over an ordered list', async () => {
        const { getByTestId } = await renderMounted(Breadcrumb, { props: { items: TRAIL } })

        const nav = getByTestId(TESTID)
        expect(nav.tagName).toBe('NAV')
        expect(nav.getAttribute('aria-label')).toBe('Breadcrumb')
        expect(getByTestId(`${TESTID}__list`).tagName).toBe('OL')
      })

      it('renders every segment, ancestors as links and the last as the current page', async () => {
        const { getByTestId, queryByTestId } = await renderMounted(Breadcrumb, {
          props: { items: TRAIL }
        })

        expect(queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
        const first = getByTestId(`${TESTID}__item-0`)
        expect(first.tagName).toBe('A')
        expect(first.getAttribute('href')).toBe('/home')
        const last = getByTestId(`${TESTID}__item-2`)
        expect(last.tagName).toBe('SPAN')
        expect(last.getAttribute('aria-current')).toBe('page')
        expect(getByTestId(`${TESTID}__separator-0`).getAttribute('aria-hidden')).toBe('true')
      })
    })

    describe('folded trail', () => {
      it('keeps the first segment, the parent and the current page around the overflow menu', async () => {
        const { container, getByTestId } = await folded()

        expect(shown(container)).toEqual(['Home', 'Domains', 'Settings'])
        expect(getByTestId(`${TESTID}__segment-0-mobile`).tagName).toBe('LI')
        expect(getByTestId(`${TESTID}__item-0`).getAttribute('href')).toBe('/home')
        expect(getByTestId(`${TESTID}__item-parent`).getAttribute('href')).toBe(
          '/projects/acme/domains'
        )
        const last = getByTestId(`${TESTID}__item-last`)
        expect(last.tagName).toBe('SPAN')
        expect(last.getAttribute('aria-current')).toBe('page')
        expect(last.getAttribute('data-active')).toBe('true')
      })

      it('renders the separators around the overflow menu as aria-hidden presentation lis', async () => {
        const { getByTestId } = await folded()

        for (const id of ['overflow-before', 'overflow-after', 'parent']) {
          const separator = getByTestId(`${TESTID}__separator-${id}`)
          expect(separator.tagName).toBe('LI')
          expect(separator.getAttribute('role')).toBe('presentation')
          expect(separator.getAttribute('aria-hidden')).toBe('true')
        }
      })

      it('renders the ellipsis trigger closed by default', async () => {
        const { getByTestId } = await folded()

        expect(getByTestId(`${TESTID}__overflow-menu`).getAttribute('data-state')).toBe('closed')
        expect(getByTestId(`${TESTID}__overflow-trigger`).getAttribute('aria-label')).toBe(
          'Show pages in between'
        )
      })

      it('opens the overflow menu with the folded segments as links, teleported to the body', async () => {
        const { getByTestId } = await folded()

        await fireEvent.click(getByTestId(`${TESTID}__overflow-trigger`))

        expect(getByTestId(`${TESTID}__overflow-menu`).getAttribute('data-state')).toBe('open')
        expect(document.body.querySelector('[role="menu"]')).toBeTruthy()
        const option = document.body.querySelector(
          `[data-testid="${TESTID}__overflow-item-0"]`
        ) as HTMLElement
        expect(option.getAttribute('role')).toBe('menuitem')
        expect(option.tagName).toBe('A')
        expect(option.getAttribute('href')).toBe('/projects')
        expect(
          document.body.querySelector(`[data-testid="${TESTID}__overflow-item-1"]`)?.textContent
        ).toContain('Acme')
      })

      it('renders a folded segment icon inside its overflow option', async () => {
        const items = FIVE.map((item) =>
          item.label === 'Projects' ? { ...item, showIcon: true, icon: 'az az-folder' } : item
        )
        const { getByTestId } = await folded({ items })

        await fireEvent.click(getByTestId(`${TESTID}__overflow-trigger`))

        const option = document.body.querySelector(
          `[data-testid="${TESTID}__overflow-item-0"]`
        ) as HTMLElement | null
        expect(option?.querySelector('i.az-folder')).toBeTruthy()
      })

      // The listener sits on the DropdownMenu root, which is what emits `select`.
      it('emits navigate with the folded segment href when its overflow option is selected', async () => {
        const onNavigate = vi.fn()
        const { getByTestId } = await folded({ onNavigate })

        await fireEvent.click(getByTestId(`${TESTID}__overflow-trigger`))
        const option = document.body.querySelector(
          `[data-testid="${TESTID}__overflow-item-0"]`
        ) as HTMLElement
        await userEvent.click(option)

        expect(onNavigate).toHaveBeenCalled()
        expect(onNavigate.mock.calls[0]![1]).toBe('/projects')
      })

      it('threads a custom testid through the list, segments and overflow menu', async () => {
        const { getByTestId } = await folded({}, { 'data-testid': 'crumbs' })

        expect(getByTestId('crumbs__list')).toBeTruthy()
        expect(getByTestId('crumbs__segment-0-mobile')).toBeTruthy()
        expect(getByTestId('crumbs__item-0')).toBeTruthy()
        expect(getByTestId('crumbs__overflow-menu')).toBeTruthy()
      })

      it('has no a11y violations for a folded trail', async () => {
        const { container } = await folded()

        await expectNoA11yViolations(container)
      })
    })

    describe('fold levels', () => {
      it('keeps a short trail whole in an article column (A6-101, A6-235)', async () => {
        const view = await renderMounted(inBox(640, { items: TRAIL }))
        expect(view.queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
        expect(shown(view.container)).toEqual(['Home', 'Projects', 'Settings'])
      })

      it('keeps the parent of a two-segment trail on a phone (A6-067)', async () => {
        const items = [{ label: 'Services', href: '/services' }, { label: 'web-app-prod' }]
        const view = await renderMounted(inBox(358, { items }))
        expect(view.queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
        expect(shown(view.container)).toEqual(['Services', 'web-app-prod'])
      })

      it('folds the first segment before the parent when the row is narrower', async () => {
        const view = await renderMounted(inBox(220))
        expect(view.queryByTestId(`${TESTID}__item-0`)).toBeNull()
        expect(view.queryByTestId(`${TESTID}__separator-overflow-before`)).toBeNull()
        expect(shown(view.container)).toEqual(['Domains', 'Settings'])
      })

      it('folds every ancestor so the current page keeps the row when the parent does not fit', async () => {
        const two = [{ label: 'Domains', href: '/domains' }, { label: 'Create domain' }]
        const view = await renderMounted(inBox(100, { items: two }))
        expect(view.queryByTestId(`${TESTID}__item-0`)).toBeNull()
        expect(view.getByTestId(`${TESTID}__item-last`).textContent).toContain('Create domain')
        await fireEvent.click(view.getByTestId(`${TESTID}__overflow-trigger`))
        const option = document.body.querySelector(
          `[data-testid="${TESTID}__overflow-item-0"]`
        ) as HTMLElement
        expect(option.getAttribute('href')).toBe('/domains')
      })

      it('unfolds again when its box grows (A6-066)', async () => {
        const width = ref(220)
        const view = await renderMounted(
          defineComponent({
            setup: () => () =>
              h('div', { style: { width: `${width.value}px` } }, [h(Breadcrumb, { items: FIVE })])
          })
        )
        expect(view.getByTestId(`${TESTID}__overflow-menu`)).toBeTruthy()

        width.value = 1000
        await nextTick()
        await frame()
        await frame()

        expect(view.queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
        expect(shown(view.container)).toEqual(FIVE.map((item) => item.label))
      })
    })

    describe('navigate event', () => {
      it('emits navigate(event, href) when an ancestor segment is clicked', async () => {
        const { getByTestId, emitted } = await renderMounted(Breadcrumb, {
          props: { items: TRAIL }
        })

        await fireEvent.click(getByTestId(`${TESTID}__item-0`))

        const navigate = emitted().navigate as Array<[unknown, string]>
        expect(navigate).toHaveLength(1)
        expect(navigate[0][0]).toBeInstanceOf(MouseEvent)
        expect(navigate[0][1]).toBe('/home')
      })

      it('does NOT emit navigate when the current segment is clicked', async () => {
        const { getByTestId, emitted } = await renderMounted(Breadcrumb, {
          props: { items: TRAIL }
        })

        await fireEvent.click(getByTestId(`${TESTID}__item-2`))

        expect(emitted().navigate).toBeUndefined()
      })

      it('emits navigate on keyboard activation of an ancestor link', async () => {
        const { getByTestId, emitted } = await renderMounted(Breadcrumb, {
          props: { items: TRAIL }
        })

        const first = getByTestId(`${TESTID}__item-0`) as HTMLElement
        first.focus()
        expect(document.activeElement).toBe(first)

        await userEvent.keyboard('{Enter}')

        const navigate = emitted().navigate as Array<[unknown, string]>
        expect(navigate).toBeTruthy()
        expect(navigate[0][1]).toBe('/home')
      })
    })

    describe('single item', () => {
      it('renders a lone current item with no overflow menu', async () => {
        const { getByTestId, queryByTestId } = await renderMounted(
          inBox(140, {
            items: [{ label: 'Only', active: true }]
          })
        )

        const first = getByTestId(`${TESTID}__item-0`)
        expect(first.tagName).toBe('SPAN')
        expect(first.getAttribute('aria-current')).toBe('page')
        expect(queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
      })
    })

    describe('empty items -> default slot', () => {
      it('renders default slot content when items is empty', async () => {
        const { queryByTestId, getByText } = await renderMounted(Breadcrumb, {
          props: { items: [] },
          slots: { default: '<span>custom trail</span>' }
        })

        expect(queryByTestId(`${TESTID}__list`)).toBeNull()
        expect(getByText('custom trail')).toBeTruthy()
      })
    })

    describe('manual composition via compound sub-components', () => {
      it('renders a hand-composed trail through the root, List, Item and Separator', async () => {
        const { getByTestId, getByText } = await renderMounted({
          components: {
            BreadcrumbRoot: Breadcrumb,
            BreadcrumbList: BreadcrumbList,
            BreadcrumbItem: BreadcrumbItem,
            BreadcrumbSeparator: BreadcrumbSeparator
          },
          template: `
          <BreadcrumbRoot>
            <BreadcrumbList data-testid="manual__list">
              <li>
                <BreadcrumbItem label="Root" href="/root" data-testid="manual__item-0" />
              </li>
              <BreadcrumbSeparator data-testid="manual__sep-0" />
              <li>
                <BreadcrumbItem label="Leaf" active data-testid="manual__item-1" />
              </li>
            </BreadcrumbList>
          </BreadcrumbRoot>
        `
        })

        // With items empty, the slot content renders instead of the data trail.
        expect(getByTestId('manual__list').tagName).toBe('OL')
        expect(getByTestId('manual__sep-0').getAttribute('aria-hidden')).toBe('true')

        const rootItem = getByTestId('manual__item-0')
        expect(rootItem.tagName).toBe('A')
        expect(rootItem.getAttribute('href')).toBe('/root')

        const leaf = getByTestId('manual__item-1')
        expect(leaf.tagName).toBe('SPAN')
        expect(leaf.getAttribute('aria-current')).toBe('page')

        expect(getByText('Root')).toBeTruthy()
        expect(getByText('Leaf')).toBeTruthy()
      })

      it('keeps every hand-composed segment: a slot trail never folds', async () => {
        const { getByTestId, queryByTestId } = await renderMounted({
          components: {
            BreadcrumbRoot: Breadcrumb,
            BreadcrumbList: BreadcrumbList,
            BreadcrumbItem: BreadcrumbItem,
            BreadcrumbSeparator: BreadcrumbSeparator
          },
          template: `
          <BreadcrumbRoot>
            <BreadcrumbList data-testid="slot__list">
              <li><BreadcrumbItem label="Home" href="/" data-testid="slot__item-0" /></li>
              <BreadcrumbSeparator />
              <li><BreadcrumbItem label="Workspaces" href="/w" data-testid="slot__item-1" /></li>
              <BreadcrumbSeparator />
              <li><BreadcrumbItem label="Projects" href="/p" data-testid="slot__item-2" /></li>
              <BreadcrumbSeparator />
              <li><BreadcrumbItem label="Settings" active data-testid="slot__item-3" /></li>
            </BreadcrumbList>
          </BreadcrumbRoot>
        `
        })

        for (const index of [0, 1, 2, 3]) {
          expect(getByTestId(`slot__item-${index}`)).toBeTruthy()
        }
        // None of the collapse machinery appears for a slot-composed trail.
        expect(queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
        expect(queryByTestId(`${TESTID}__segment-overflow`)).toBeNull()
      })

      it('emits its own click on a manually composed BreadcrumbItem', async () => {
        const { getByTestId, emitted } = await renderMounted(BreadcrumbItem, {
          props: { label: 'Standalone', href: '/x', 'data-testid': 'solo' }
        })

        await fireEvent.click(getByTestId('solo'))

        expect(emitted().click).toHaveLength(1)
        expect(emitted<unknown[]>().click[0][0]).toBeInstanceOf(MouseEvent)
      })
    })

    describe('story fixtures', () => {
      it('composes the Default story into a nav trail', async () => {
        const { getByTestId } = await renderMounted(Default)

        expect(getByTestId(TESTID).getAttribute('aria-label')).toBe('Breadcrumb')
        expect(getByTestId(`${TESTID}__list`).tagName).toBe('OL')
      })

      it('composes the Depths story: single, two-level and full five-level trails', async () => {
        const { getAllByTestId } = await renderMounted(Depths)

        const [single, two, full] = getAllByTestId(TESTID)

        expect(within(single).getByTestId(`${TESTID}__item-0`).getAttribute('aria-current')).toBe(
          'page'
        )
        expect(within(two).getByTestId(`${TESTID}__item-0`).tagName).toBe('A')
        expect(within(two).queryByTestId(`${TESTID}__overflow-menu`)).toBeNull()
        expect(within(full).getAllByRole('link').length).toBeGreaterThan(0)
      })
    })

    describe('accessibility', () => {
      it('has no a11y violations for a full trail', async () => {
        const { container } = await renderMounted(Breadcrumb, { props: { items: TRAIL } })

        await expectNoA11yViolations(container)
      })

      it('has no a11y violations for a trail with leading icons', async () => {
        const { container } = await renderMounted(Breadcrumb, {
          props: {
            items: [
              { label: 'Home', href: '/home', showIcon: true, icon: 'az az-home' },
              { label: 'Current' }
            ]
          }
        })

        await expectNoA11yViolations(container)
      })
    })
  })

  it('lets a consumer aria-label name the landmark', async () => {
    const { getByTestId } = await renderMounted(Breadcrumb, {
      props: { items: TRAIL },
      attrs: { 'aria-label': 'You are here' }
    })
    expect(getByTestId(TESTID).getAttribute('aria-label')).toBe('You are here')
  })
})

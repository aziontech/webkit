import './reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { h, nextTick } from 'vue'

import AppLayoutDefault from '../../examples/app-layout/default.vue'
import AppLayoutSplitPanelSide from '../../examples/app-layout/split-panel-side.vue'
import BreadcrumbLongLabel from '../../examples/breadcrumb/long-label.vue'
import ConsoleLayoutDefault from '../../examples/console-layout/default.vue'
import DropdownMenuSubMenus from '../../examples/dropdown-menu/sub-menus.vue'
import PageTabsWithActions from '../../examples/page-tabs/with-actions.vue'

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

async function headerHeight(component: object, width: number) {
  await page.viewport(width, 900)
  const view = render({ render: () => h(component) })
  await nextTick()
  await frame()
  const panel = view.container.querySelector<HTMLElement>('[data-testid="app-layout__split-panel"]')
  const heading = panel?.querySelector('h2')
  const height = heading?.parentElement?.getBoundingClientRect().height ?? 0
  view.unmount()
  return height
}

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('shell chrome keeps one height at every width (styled)', () => {
  it.each([
    ['bottom', AppLayoutDefault],
    ['side', AppLayoutSplitPanelSide]
  ])('the %s split-panel header is 56px on a phone and on a desktop', async (_name, component) => {
    const phone = await headerHeight(component, 390)
    const desktop = await headerHeight(component, 1280)
    if (phone > 0) expect(phone).toBe(56)
    expect(desktop).toBe(56)
  })
})

describe('a squeezed breadcrumb keeps the way back readable (styled)', () => {
  it('truncates the current page before the parent link on a phone', async () => {
    await page.viewport(390, 844)
    const view = render({
      render: () => h('div', { style: 'width: 358px' }, [h(BreadcrumbLongLabel)])
    })
    await nextTick()
    await frame()
    await frame()
    const labels = Array.from(
      view.container.querySelectorAll<HTMLElement>('a span.truncate, span.truncate')
    )
    const parent = view.container.querySelector<HTMLElement>(
      '[data-testid="breadcrumb__item-0"] .truncate'
    )!
    expect(labels.length).toBeGreaterThan(1)
    expect(parent.scrollWidth).toBeLessThanOrEqual(parent.clientWidth)
    const current = labels[labels.length - 1]!
    expect(current.scrollWidth).toBeGreaterThan(current.clientWidth)
  })
})

describe('page tabs keep the strip for the sections on a phone (styled)', () => {
  it('moves the actions to their own line so the tablist gets the full width', async () => {
    await page.viewport(390, 844)
    const view = render(PageTabsWithActions)
    await nextTick()
    await frame()
    const row = view.container.querySelector<HTMLElement>('[data-testid="page-tabs__row"]')!
    const list = view.container.querySelector<HTMLElement>('[role="tablist"]')!
    const actions = view.container.querySelector<HTMLElement>('[data-testid="page-tabs__actions"]')!
    expect(list.getBoundingClientRect().width).toBeGreaterThan(
      row.getBoundingClientRect().width * 0.8
    )
    expect(actions.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      list.getBoundingClientRect().bottom
    )
  })
})

describe('the compact console header still says where the page is (styled)', () => {
  const header = async (width: number) => {
    await page.viewport(width, 900)
    const view = render(ConsoleLayoutDefault)
    await nextTick()
    await frame()
    await frame()
    const banner = view.container.querySelector<HTMLElement>(
      '[data-testid="console-layout__header"]'
    )!
    const trail = view.container.querySelector<HTMLElement>(
      '[data-testid="console-layout__breadcrumbs"]'
    )
    return { view, banner, trail }
  }

  it('keeps the trail and the Agent action on a tablet', async () => {
    const { view, banner, trail } = await header(760)
    expect(banner.querySelector('[aria-label="Open navigation"]')).not.toBeNull()
    expect(trail?.getClientRects().length).toBeGreaterThan(0)
    expect(trail?.textContent).toContain('Workloads')
    expect(banner.querySelector('[aria-label="Agent"]')).not.toBeNull()
    view.unmount()
  })

  it('puts the navigation in a drawer on a tablet, so the page keeps the width', async () => {
    const { view } = await header(900)
    const rail = view.container.querySelector<HTMLElement>(
      '[data-testid="console-layout__navigation"]'
    )
    expect(rail?.getClientRects().length ?? 0).toBe(0)
    view.unmount()
  })

  it('drops the trail on a phone, where the header has no room', async () => {
    const { view, trail } = await header(390)
    expect(trail?.getClientRects().length ?? 0).toBe(0)
    view.unmount()
  })
})

describe('a sub-menu with no room beside its parent (styled)', () => {
  it('opens inline under its sub-trigger on a phone', async () => {
    await page.viewport(390, 844)
    const view = render(DropdownMenuSubMenus)
    await userEvent.click(view.getByRole('button', { name: /Actions/ }))
    const panel = () =>
      document.body.querySelector<HTMLElement>('[data-testid="dropdown-menu__panel"]')
    const subs = () =>
      Array.from(
        document.body.querySelectorAll<HTMLElement>('[data-testid="dropdown-menu-sub-content"]')
      )
    await waitFor(() => expect(subs()).toHaveLength(1))
    const trigger = Array.from(
      document.body.querySelectorAll<HTMLElement>('[role="menuitem"]')
    ).find((el) => el.textContent?.includes('Move to'))!
    const sub = subs()[0]!
    expect(sub.hasAttribute('data-inline')).toBe(true)
    expect(panel()!.contains(sub)).toBe(true)
    expect(sub.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      trigger.getBoundingClientRect().bottom - 1
    )
    expect(sub.querySelector('[role="group"]')?.getAttribute('aria-labelledby')).toBe(trigger.id)
    trigger.focus()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement?.textContent).toContain('production'))
    await userEvent.keyboard('{ArrowDown}')
    expect(document.activeElement?.textContent).toContain('staging')
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(subs()).toHaveLength(0))
    expect(panel()).not.toBeNull()
    expect(document.activeElement).toBe(trigger)
    view.unmount()
  })
})

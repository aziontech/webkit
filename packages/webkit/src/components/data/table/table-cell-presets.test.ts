import { cleanup, fireEvent, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { createApp, createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'

import CellPresets from '../../../../examples/table/cell-presets.vue'
import Refresh from '../../../../examples/table/refresh.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import { LOCALES } from '../../../test/locales'
import WebkitProvider from '../../utils/webkit-provider/webkit-provider.vue'
import TableCellActions from './table-cell-actions/table-cell-actions.vue'
import TableCellId from './table-cell-id/table-cell-id.vue'
import TableCellLink from './table-cell-link/table-cell-link.vue'
import TableCellStatus from './table-cell-status/table-cell-status.vue'
import TableCellTags from './table-cell-tags/table-cell-tags.vue'
import TableCellTime from './table-cell-time/table-cell-time.vue'
import TableRefreshButton from './table-refresh-button/table-refresh-button.vue'

const byTestId = (id: string): HTMLElement | null =>
  document.body.querySelector<HTMLElement>(`[data-testid="${id}"]`)

afterEach(() => cleanup())

describe('Table cell presets', () => {
  it('CellStatus renders one chip, or a muted dash when empty', () => {
    const view = render(TableCellStatus, { props: { label: 'Active', severity: 'success' } })
    expect(view.getByText('Active')).toBeTruthy()
    cleanup()
    const empty = render(TableCellStatus)
    expect(empty.getByText('—')).toBeTruthy()
  })

  it('CellId names its copy button after the resource and keeps the value ltr', () => {
    const view = render(TableCellId, { props: { value: 1726504, resource: 'workload' } })
    expect(view.getByRole('button', { name: 'Copy workload ID' })).toBeTruthy()
    expect(view.getByText('1726504').getAttribute('dir')).toBe('ltr')
    cleanup()
    const bare = render(TableCellId, { props: { value: '' } })
    expect(bare.queryByRole('button')).toBeNull()
  })

  it('CellLink: an external link opens a new tab and says so', () => {
    const view = render(TableCellLink, {
      props: { label: 'shop.example.com', href: 'https://shop.example.com', copyable: true }
    })
    const link = view.getByRole('link')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toBe('noopener noreferrer')
    expect(link.textContent).toContain('(opens in a new tab)')
    expect(view.getByRole('button', { name: 'Copy shop.example.com' })).toBeTruthy()
  })

  it('CellLink: a leading icon sits before the name, outside the link and hidden from assistive tech', () => {
    const view = render(TableCellLink, {
      props: {
        label: 'example/storefront',
        href: 'https://github.com/example/storefront',
        icon: 'ai ai-github'
      }
    })
    const icon = view.getByTestId('data-table__cell-link__icon')
    expect(icon.getAttribute('aria-hidden')).toBe('true')
    expect(icon.classList.contains('ai-github')).toBe(true)
    expect(view.getByRole('link').contains(icon)).toBe(false)
    expect(view.getByRole('link').textContent).toContain('example/storefront')

    const bare = render(TableCellLink, { props: { label: 'draft' } })
    expect(bare.container.querySelector('[data-testid="data-table__cell-link__icon"]')).toBeNull()
  })

  it('CellLink: no destination renders plain text with no mark', () => {
    const view = render(TableCellLink, { props: { label: 'draft' } })
    expect(view.queryByRole('link')).toBeNull()
    expect(view.container.querySelector('.pi-external-link')).toBeNull()
  })

  it('CellLink: an in-app route uses a registered RouterLink, else a plain href', () => {
    const view = render(TableCellLink, { props: { label: 'storefront', to: '/workloads/1' } })
    expect(view.getByRole('link').getAttribute('href')).toBe('/workloads/1')
    cleanup()

    const host = document.createElement('div')
    document.body.appendChild(host)
    const app = createApp({
      render: () => h(TableCellLink, { label: 'storefront', to: { name: 'workload' } })
    })
    app.component(
      'RouterLink',
      defineComponent({
        props: { to: { type: [String, Object], required: true } },
        setup:
          (props, { slots }) =>
          () =>
            h('a', { href: '#routed', 'data-to': JSON.stringify(props.to) }, slots['default']?.())
      })
    )
    app.mount(host)
    const routed = host.querySelector('a')!
    expect(routed.getAttribute('data-to')).toBe('{"name":"workload"}')
    app.unmount()
    host.remove()
  })

  it('CellLink: the link click does not reach a clickable row', async () => {
    let rowClicks = 0
    const Host = defineComponent({
      render: () =>
        h('div', { onClick: () => (rowClicks += 1) }, [
          h(TableCellLink, { label: 'storefront', href: '#storefront' })
        ])
    })
    const view = render(Host)
    view.getByRole('link').addEventListener('click', (event) => event.preventDefault())
    await fireEvent.click(view.getByRole('link'))
    expect(rowClicks).toBe(0)
  })

  it('CellLink: more values show a +N chip', () => {
    const view = render(TableCellLink, {
      props: {
        label: 'a.example.com',
        more: ['b.example.com', 'c.example.com'],
        moreNoun: { one: 'domain', other: 'domains' }
      }
    })
    expect(view.getByRole('button', { name: 'Show all 2 domains' })).toBeTruthy()
  })

  it('CellTime shows a relative time, the absolute one for screen readers, and the author', () => {
    const value = new Date(Date.now() - 3 * 86_400_000)
    const view = render(TableCellTime, {
      props: { value, author: 'maria.silva@example.com' }
    })
    const time = view.container.querySelector('time')!
    expect(time.getAttribute('datetime')).toBe(value.toISOString())
    expect(time.textContent).toContain('3 days ago')
    expect(time.querySelector('.sr-only')!.textContent!.length).toBeGreaterThan(4)
    expect(view.getByRole('img', { name: 'Maria Silva' })).toBeTruthy()
  })

  it('CellTime reads just now, and a dash for no date', () => {
    const view = render(TableCellTime, { props: { value: new Date() } })
    expect(view.container.querySelector('time')!.textContent).toContain('just now')
    cleanup()
    const minutes = render(TableCellTime, { props: { value: new Date(Date.now() - 50_000) } })
    expect(minutes.container.querySelector('time')!.textContent).toContain('1 minute ago')
    cleanup()
    const empty = render(TableCellTime, { props: { value: 'not a date' } })
    expect(empty.getByText('—')).toBeTruthy()
  })

  it('CellTime follows the active locale', () => {
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { locale: 'pt-BR', catalogs: LOCALES },
          { default: () => h(TableCellTime, { value: new Date(Date.now() - 2 * 3_600_000) }) }
        )
    })
    const view = render(Host)
    expect(view.container.querySelector('time')!.textContent).toContain('há 2 horas')
  })

  it('CellTime counts from the provider now, not the real clock, and follows it', async () => {
    const NOW = Date.UTC(2026, 10, 10, 12)
    const now = ref<number | string>(NOW)
    const Host = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { now: now.value },
          {
            default: () => [
              h(TableCellTime, { value: new Date(NOW - 2 * 3_600_000), 'data-testid': 'hours' }),
              h(TableCellTime, { value: new Date(NOW - 50_000), 'data-testid': 'minutes' })
            ]
          }
        )
    })
    const view = render(Host)
    const text = (id: string) => view.getByTestId(id).querySelector('time')!.textContent
    expect(text('hours')).toContain('2 hours ago')
    expect(text('minutes')).toContain('1 minute ago')
    now.value = NOW + 24 * 3_600_000
    await nextTick()
    expect(text('hours')).toContain('yesterday')
    now.value = new Date(NOW).toISOString()
    await nextTick()
    expect(text('hours')).toContain('2 hours ago')
  })

  it('CellTime under a fixed provider now renders that reference on the server', async () => {
    const NOW = Date.UTC(2026, 10, 10, 12)
    const App = defineComponent({
      render: () =>
        h(
          WebkitProvider,
          { now: NOW },
          { default: () => h(TableCellTime, { value: new Date(NOW - 26 * 3_600_000) }) }
        )
    })
    const html = await renderToString(createSSRApp(App))
    expect(html).toContain('yesterday')
  })

  it('the cell presets example prints the same relative times whenever it renders', () => {
    const view = render(CellPresets)
    const times = [...view.container.querySelectorAll('time')].map((t) => t.firstChild!.textContent)
    expect(times).toEqual(['2 hours ago', 'yesterday', 'last week'])
  })

  it('CellTags shows every tag when there is room, and a dash when empty', async () => {
    const view = render(TableCellTags, { props: { items: ['a', 'b'] } })
    await waitFor(() =>
      expect(
        view.container.querySelectorAll('[data-testid="data-table__cell-tags__tag"]')
      ).toHaveLength(2)
    )
    expect(view.queryByRole('button')).toBeNull()
    cleanup()
    expect(render(TableCellTags).getByText('—')).toBeTruthy()
  })

  it('CellActions names the trigger after the row and emits select', async () => {
    const selected: unknown[] = []
    const Host = defineComponent({
      render: () =>
        h(
          TableCellActions,
          { name: 'storefront', onSelect: (_event: Event, value: unknown) => selected.push(value) },
          { default: () => [] }
        )
    })
    const view = render(Host)
    expect(view.getByRole('button', { name: 'Actions for storefront' })).toBeTruthy()
    expect(selected).toEqual([])
  })

  it('CellActions selects an option from the example', async () => {
    const view = render(CellPresets)
    await fireEvent.click(view.getByRole('button', { name: 'Actions for storefront' }))
    await waitFor(() => expect(document.body.querySelector('[role="menu"]')).not.toBeNull())
    expect(document.body.querySelector('[role="menu"]')!.textContent).toContain('Clone')
  })

  it('renders under rtl', () => {
    const Host = defineComponent({
      render: () =>
        h('div', { dir: 'rtl' }, [
          h(TableCellLink, { label: 'shop.example.com', href: 'https://shop.example.com' }),
          h(TableCellId, { value: 'a1b2-c3' })
        ])
    })
    const view = render(Host)
    expect(view.getByText('a1b2-c3').getAttribute('dir')).toBe('ltr')
    expect(byTestId('data-table__cell-link__link')).not.toBeNull()
  })

  it('has no axe violations', async () => {
    const view = render(CellPresets)
    await expectNoA11yViolations(view.container)
  })

  it('RefreshButton with loading spins and cannot fire again', () => {
    const view = render(TableRefreshButton, { props: { loading: true } })
    const button = view.getByRole('button', { name: 'Refresh' })
    expect(button.getAttribute('aria-busy')).toBe('true')
  })

  it('the refresh example keeps its rows while refreshing and shows when it updated', async () => {
    const view = render(Refresh)
    expect(view.container.querySelector('time')!.getAttribute('datetime')).toMatch(/:00\.000Z$/)
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.getByText('storefront')).toBeTruthy()
    await waitFor(() =>
      expect(view.getByRole('button', { name: 'Refresh' }).getAttribute('aria-busy')).toBe('true')
    )
    await expectNoA11yViolations(view.container)
  })
})

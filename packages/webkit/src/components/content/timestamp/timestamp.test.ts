import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/timestamp/default.vue'
import LogDetails from '../../../../examples/timestamp/log-details.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import WebkitProvider from '../../provider/webkit-provider/webkit-provider.vue'
import Timestamp from './timestamp.vue'
import { relativeText, toDate } from './timestamp-format'

const NOW = Date.UTC(2026, 10, 14, 12, 10)
const VALUE = '2026-11-14T12:04:31Z'
const ISO = '2026-11-14T12:04:31.000Z'

const inProvider = (props: Record<string, unknown>, provider: Record<string, unknown> = {}) =>
  defineComponent({
    setup: () => () =>
      h(WebkitProvider, { now: NOW, timeZone: 'UTC', ...provider }, () => h(Timestamp, props))
  })

const panel = () => document.body.querySelector<HTMLElement>('[data-testid="timestamp__panel"]')

describe('Timestamp', () => {
  it('renders the fallback data-testid, the local format and a time element with the ISO value', () => {
    render(inProvider({ value: VALUE }))

    const root = screen.getByTestId('timestamp')
    expect(root).toHaveAttribute('data-format', 'local')
    expect(root).toHaveAttribute('data-state', 'closed')
    const time = root.querySelector('time')
    expect(time).toHaveAttribute('datetime', ISO)
    expect(time?.textContent).toMatch(/12:04:31/)
    expect(time?.textContent).toMatch(/UTC/)
  })

  it('lets a consumer data-testid win', () => {
    render(inProvider({ value: VALUE, 'data-testid': 'started-at' }))

    expect(screen.getByTestId('started-at')).toBeInTheDocument()
    expect(screen.getByTestId('started-at__text')).toBeInTheDocument()
    expect(screen.queryByTestId('timestamp')).toBeNull()
  })

  it('shows the relative phrase and follows the provider now', async () => {
    const now = ref(NOW)
    const Host = defineComponent({
      setup: () => () =>
        h(WebkitProvider, { now: now.value, timeZone: 'UTC' }, () =>
          h(Timestamp, { value: VALUE, format: 'relative' })
        )
    })
    render(Host)
    expect(screen.getByTestId('timestamp__text')).toHaveTextContent('5 minutes ago')

    now.value = Date.UTC(2026, 10, 14, 12, 4, 40)
    await nextTick()
    expect(screen.getByTestId('timestamp__text')).toHaveTextContent('just now')
  })

  it('shows the UTC format regardless of the zone', () => {
    render(inProvider({ value: VALUE, format: 'utc' }, { timeZone: 'Asia/Tokyo' }))

    const text = screen.getByTestId('timestamp__text').textContent ?? ''
    expect(text).toMatch(/12:04:31/)
    expect(text).toMatch(/UTC/)
  })

  it('reads the provider time zone, and the prop wins over it', () => {
    const tokyo = render(inProvider({ value: VALUE }, { timeZone: 'Asia/Tokyo' }))
    expect(tokyo.getByTestId('timestamp__text').textContent).toMatch(/09:04:31/)
    tokyo.unmount()

    render(inProvider({ value: VALUE, timeZone: 'America/New_York' }, { timeZone: 'Asia/Tokyo' }))
    expect(screen.getByTestId('timestamp__text').textContent).toMatch(/07:04:31/)
  })

  it('falls back to UTC for an unknown time zone instead of throwing', () => {
    render(inProvider({ value: VALUE, timeZone: 'Mars/Olympus' }))
    expect(screen.getByTestId('timestamp__text').textContent).toMatch(/12:04:31/)
  })

  it.each([
    ['ISO string', VALUE],
    ['milliseconds', Date.parse(VALUE)],
    ['microseconds', Date.parse(VALUE) * 1000],
    ['numeric string of microseconds', String(Date.parse(VALUE) * 1000)],
    ['Date', new Date(VALUE)]
  ])('accepts %s', (_, value) => {
    render(inProvider({ value }))
    expect(screen.getByTestId('timestamp').querySelector('time')).toHaveAttribute('datetime', ISO)
  })

  it.each([undefined, '', 'not a date'])('renders a muted dash with no trigger for %s', (value) => {
    render(inProvider({ value }))

    const root = screen.getByTestId('timestamp')
    expect(root).toHaveAttribute('data-invalid')
    expect(root).toHaveTextContent('—')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('opens a dialog with UTC, local, relative and raw rows, each copyable, and Escape closes it', async () => {
    const user = userEvent.setup()
    const raw = Date.parse(VALUE) * 1000
    render(inProvider({ value: raw }))

    const trigger = screen.getByRole('button')
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    expect(panel()).toBeNull()

    await user.click(trigger)
    const dialog = screen.getByRole('dialog', { name: 'Timestamp details' })
    const armed = screen.getByTestId('timestamp__text')
    expect(armed).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByTestId('timestamp')).toHaveAttribute('data-state', 'open')

    const rows = [...dialog.querySelectorAll<HTMLElement>('[data-testid="timestamp__row"]')]
    expect(rows.map((row) => row.dataset['row'])).toEqual(['utc', 'local', 'relative', 'raw'])
    expect(rows[0]).toHaveTextContent(ISO)
    expect(rows[1]).toHaveTextContent('UTC')
    expect(rows[2]).toHaveTextContent('5 minutes ago')
    expect(rows[3]).toHaveTextContent(String(raw))
    for (const name of ['Copy UTC', 'Copy Local', 'Copy Relative', 'Copy Raw value'])
      expect(screen.getByRole('button', { name })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(panel()).toBeNull()
    expect(armed).toHaveFocus()
    expect(armed).toHaveAttribute('aria-expanded', 'false')

    await user.keyboard('{Enter}')
    expect(screen.getByRole('dialog', { name: 'Timestamp details' })).toBeInTheDocument()
  })

  it('adds the browser row when the app zone differs from the browser zone', async () => {
    const user = userEvent.setup()
    const browser = Intl.DateTimeFormat().resolvedOptions().timeZone
    const other = browser === 'Asia/Tokyo' ? 'America/New_York' : 'Asia/Tokyo'
    render(inProvider({ value: VALUE }, { timeZone: other }))

    await user.click(screen.getByRole('button'))
    const ids = [
      ...document.body.querySelectorAll<HTMLElement>('[data-testid="timestamp__row"]')
    ].map((row) => row.dataset['row'])
    expect(ids).toEqual(['utc', 'local', 'browser', 'relative', 'raw'])
  })

  it('names its panel and labels in the provider locale', async () => {
    const user = userEvent.setup()
    const { ptBR } = await import('../../../locales/pt-BR')
    render(inProvider({ value: VALUE }, { locale: 'pt-BR', catalogs: { 'pt-BR': ptBR } }))

    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('dialog', { name: 'Detalhes do horário' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Copiar Relativo' })).toBeInTheDocument()
  })

  it('shares parsing and relative phrasing with TableCellTime', () => {
    expect(toDate(null)).toBeNull()
    expect(toDate('1794657871000')?.toISOString()).toBe('2026-11-14T12:04:31.000Z')
    const format = (value: number | Date, unit?: Intl.RelativeTimeFormatUnit) =>
      `${String(value instanceof Date ? 'date' : value)} ${unit ?? ''}`.trim()
    expect(relativeText(new Date(NOW - 10_000), NOW, 'just now', format)).toBe('just now')
    expect(relativeText(new Date(NOW - 5 * 60_000), NOW, 'just now', format)).toBe('-5 minute')
    expect(relativeText(new Date(NOW - 5 * 3_600_000), NOW, 'just now', format)).toBe('date')
  })

  it('has no axe violations in the examples, closed and open', async () => {
    const user = userEvent.setup()
    const { container } = render(Default)
    await expectNoA11yViolations(container)
    const log = render(LogDetails)
    await expectNoA11yViolations(log.container)
    await user.click(log.getAllByRole('button')[0] as HTMLElement)
    await expectNoA11yViolations(panel() as HTMLElement)
  })
})

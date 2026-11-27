import { render, screen } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import Default from '../../../../examples/countdown/default.vue'
import TicketList from '../../../../examples/countdown/ticket-list.vue'
import { ptBR } from '../../../locales/pt-BR'
import { expectNoA11yViolations } from '../../../test/axe'
import ConfigProvider from '../../layout/config-provider/config-provider.vue'
import Countdown from './countdown.vue'
import { durationParts, roundedMinutes } from './lib/countdown-phrase'

const NOW = Date.UTC(2026, 10, 24, 14, 45)
const MINUTE = 60_000
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

const inProvider = (props: Record<string, unknown>, provider: Record<string, unknown> = {}) =>
  defineComponent({
    setup: () => () =>
      h(ConfigProvider, { now: NOW, locale: 'en-US', ...provider }, () => h(Countdown, props))
  })

const visible = (testId = 'countdown') =>
  screen.getByTestId(`${testId}__text`).querySelector('[aria-hidden="true"]')?.textContent
const spoken = (testId = 'countdown') =>
  screen.getByTestId(`${testId}__text`).querySelector('.sr-only')?.textContent

describe('Countdown', () => {
  it('renders the fallback data-testid as a neutral tag with a clock icon and a time element', () => {
    render(inProvider({ deadline: NOW + 5 * HOUR }))

    const root = screen.getByTestId('countdown')
    expect(root).toHaveAttribute('data-severity', 'neutral')
    expect(root).toHaveAttribute('data-type', 'due')
    expect(root).toHaveAttribute('data-size', 'medium')
    expect(root).not.toHaveAttribute('data-overdue')
    expect(screen.getByTestId('countdown__icon')).toHaveClass('az-clock')
    expect(screen.getByTestId('countdown__icon')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getByTestId('countdown__text').tagName).toBe('TIME')
    expect(screen.getByTestId('countdown__text')).toHaveAttribute(
      'datetime',
      new Date(NOW + 5 * HOUR).toISOString()
    )
    expect(visible()).toBe('Due in 5h')
    expect(spoken()).toBe('Due in 5 hours')
  })

  it('lets a consumer data-testid win on the root and the parts', () => {
    render(inProvider({ deadline: NOW + HOUR * 2, label: 'Resolution', 'data-testid': 'sla' }))

    expect(screen.getByTestId('sla')).toBeInTheDocument()
    expect(screen.getByTestId('sla__label')).toHaveTextContent('Resolution:')
    expect(screen.getByTestId('sla__icon')).toBeInTheDocument()
    expect(screen.queryByTestId('countdown')).toBeNull()
  })

  it('parses an ISO string, an epoch and a Date the same way', () => {
    const iso = new Date(NOW + 90 * MINUTE).toISOString()
    for (const deadline of [iso, NOW + 90 * MINUTE, new Date(NOW + 90 * MINUTE)]) {
      const view = render(inProvider({ deadline }))
      expect(visible()).toBe('Due in 1h 30m')
      expect(spoken()).toBe('Due in 1 hour 30 minutes')
      view.unmount()
    }
  })

  it('turns to warning at the threshold, with a triangle icon', () => {
    render(inProvider({ deadline: NOW + 45 * MINUTE }))

    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'warning')
    expect(screen.getByTestId('countdown__icon')).toHaveClass('az-triangle-alert')
    expect(visible()).toBe('Due in 45m')
  })

  it('reads the warning threshold prop, and 0 keeps it neutral', () => {
    const wide = render(inProvider({ deadline: NOW + 3 * HOUR, warningThreshold: 4 * HOUR }))
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'warning')
    wide.unmount()

    render(inProvider({ deadline: NOW + MINUTE, warningThreshold: 0 }))
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'neutral')
  })

  it('turns to danger once the deadline passes and says by how much', () => {
    render(inProvider({ deadline: NOW - 15 * MINUTE, label: 'First reply' }))

    const root = screen.getByTestId('countdown')
    expect(root).toHaveAttribute('data-severity', 'danger')
    expect(root).toHaveAttribute('data-overdue')
    expect(screen.getByTestId('countdown__icon')).toHaveClass('az-circle-alert')
    expect(visible()).toBe('Overdue by 15m')
    expect(screen.getByTestId('countdown__label').textContent).toBe('First reply: ')
    expect(spoken()).toBe('Overdue by 15 minutes')
  })

  it('rounds minutes up, so it never says overdue early', () => {
    const view = render(inProvider({ deadline: NOW + 20_000 }))
    expect(visible()).toBe('Due in 1m')
    view.unmount()

    render(inProvider({ deadline: NOW }))
    expect(visible()).toBe('Overdue by 1m')
  })

  it('writes days and hours when overdue for long, and a day phrase from 24 hours left', () => {
    const late = render(inProvider({ deadline: NOW - 2 * DAY - 3 * HOUR }))
    expect(visible()).toBe('Overdue by 2d 3h')
    late.unmount()

    const tomorrow = render(inProvider({ deadline: NOW + DAY }))
    expect(visible()).toBe('Due tomorrow')
    expect(spoken()).toBe('Due tomorrow')
    tomorrow.unmount()

    render(inProvider({ deadline: NOW + 3 * DAY }))
    expect(visible()).toBe('Due in 3 days')
  })

  it('says Expires and Expired with type expiry', () => {
    const soon = render(inProvider({ deadline: NOW + 2 * HOUR, type: 'expiry' }))
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-type', 'expiry')
    expect(visible()).toBe('Expires in 2h')
    soon.unmount()

    const later = render(inProvider({ deadline: NOW + 3 * DAY, type: 'expiry' }))
    expect(visible()).toBe('Expires in 3 days')
    later.unmount()

    render(inProvider({ deadline: NOW - DAY, type: 'expiry' }))
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'danger')
    expect(visible()).toBe('Expired yesterday')
  })

  it('shows Paused, neutral, with a pause icon, whatever the deadline', () => {
    render(inProvider({ deadline: NOW - HOUR, paused: true }))

    const root = screen.getByTestId('countdown')
    expect(root).toHaveAttribute('data-paused')
    expect(root).toHaveAttribute('data-severity', 'neutral')
    expect(root).not.toHaveAttribute('data-overdue')
    expect(screen.getByTestId('countdown__icon')).toHaveClass('az-circle-pause')
    expect(visible()).toBe('Paused')
  })

  it('renders a muted dash for an empty or unparseable deadline, even when paused', () => {
    for (const deadline of [undefined, '', 'not a date']) {
      const view = render(inProvider({ deadline, paused: true }))
      const root = screen.getByTestId('countdown')
      expect(root).toHaveAttribute('data-invalid')
      expect(root).toHaveTextContent('—')
      expect(screen.queryByTestId('countdown__text')).toBeNull()
      view.unmount()
    }
  })

  it('maps size to the tag', () => {
    render(inProvider({ deadline: NOW + HOUR * 2, size: 'small' }))
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-size', 'small')
  })

  it('follows the provider now, crossing into warning and overdue', async () => {
    const now = ref(NOW)
    render(
      defineComponent({
        setup: () => () =>
          h(ConfigProvider, { now: now.value, locale: 'en-US' }, () =>
            h(Countdown, { deadline: NOW + 2 * HOUR })
          )
      })
    )
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'neutral')

    now.value = NOW + 90 * MINUTE
    await nextTick()
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'warning')
    expect(visible()).toBe('Due in 30m')

    now.value = NOW + 2 * HOUR + 5 * MINUTE
    await nextTick()
    expect(screen.getByTestId('countdown')).toHaveAttribute('data-severity', 'danger')
    expect(visible()).toBe('Overdue by 5m')
  })

  it('writes the phrase in the provider locale', () => {
    render(
      inProvider(
        { deadline: NOW + 2 * HOUR + 15 * MINUTE },
        { locale: 'pt-BR', catalogs: { 'pt-BR': ptBR } }
      )
    )
    expect(visible()).toMatch(/^Vence em 2\s?h 15\s?min$/)
  })

  it('isolates the label for right-to-left pages', () => {
    render(inProvider({ deadline: NOW + 2 * HOUR, label: 'First reply' }, { dir: 'rtl' }))
    expect(screen.getByTestId('countdown__label')).toHaveAttribute('dir', 'auto')
  })

  it('orders the label and the phrase by the language of the phrase on right-to-left pages', () => {
    render(inProvider({ deadline: NOW - 20 * MINUTE, label: 'Next reply' }, { dir: 'rtl' }))
    const run = screen.getByTestId('countdown__label').parentElement
    expect(run).toHaveAttribute('dir', 'auto')
    expect(run?.matches(':dir(ltr)')).toBe(true)
    expect(run?.textContent).toMatch(/^Next reply: Overdue by 20m/)
  })

  it('keeps the phrase direction when the label is in another script', () => {
    render(inProvider({ deadline: NOW + 2 * HOUR, label: 'الرد التالي' }, { dir: 'rtl' }))
    const label = screen.getByTestId('countdown__label')
    expect(label.matches(':dir(rtl)')).toBe(true)
    expect(label.parentElement?.matches(':dir(ltr)')).toBe(true)
  })

  it('is not a live region and has no role', () => {
    render(inProvider({ deadline: NOW - MINUTE }))
    const root = screen.getByTestId('countdown')
    expect(root).not.toHaveAttribute('aria-live')
    expect(root).not.toHaveAttribute('role')
  })

  it('renders the examples with no accessibility violation', async () => {
    const view = render(Default)
    expect(view.container.querySelectorAll('[data-testid="countdown"]')).toHaveLength(3)
    await expectNoA11yViolations(view.container)
    view.unmount()

    const list = render(TicketList)
    const severities = [...list.container.querySelectorAll('[data-testid="countdown"]')].map((el) =>
      el.getAttribute('data-severity')
    )
    expect(severities).toEqual(['danger', 'warning', 'neutral', 'neutral'])
    const headings = [...list.container.querySelectorAll('[role="columnheader"]')].map((el) =>
      el.textContent?.trim()
    )
    expect(headings).toEqual(['Subject', 'First reply', 'Requester'])
    await expectNoA11yViolations(list.container)
  })

  describe('phrase helpers', () => {
    it('rounds to whole minutes, at least one', () => {
      expect(roundedMinutes(0)).toBe(1)
      expect(roundedMinutes(-61_000)).toBe(2)
      expect(roundedMinutes(14 * HOUR + 30_000)).toBe(14 * 60 + 1)
    })

    it('keeps the two largest non-zero units', () => {
      expect(durationParts(2 * 1440 + 3 * 60 + 5)).toEqual([
        { value: 2, unit: 'day' },
        { value: 3, unit: 'hour' }
      ])
      expect(durationParts(2 * 1440 + 5)).toEqual([{ value: 2, unit: 'day' }])
      expect(durationParts(45)).toEqual([{ value: 45, unit: 'minute' }])
    })
  })
})

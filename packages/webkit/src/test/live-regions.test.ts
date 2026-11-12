// Live regions: a message a screen reader should announce sits in, or is, one live region, is
// announced once (no second region carrying the same text, no live region nested in another),
// and streamed content appends inside one region instead of making a region per line.
import { cleanup, render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'

import AsyncSubmitSucceeded from '../../blocks/platform/states/async-submit/variants/succeeded.vue'
import FormErrorRejected from '../../blocks/platform/states/form-error/variants/rejected.vue'
import type { LogViewLine } from '../components/code/log-view/injection-key'
import LogView from '../components/code/log-view/log-view.vue'
import LogViewContent from '../components/code/log-view/log-view-content.vue'
import StatusIndicator from '../components/feedback/status-indicator/status-indicator.vue'
import Toaster from '../components/feedback/toast/toaster.vue'

const LIVE = '[aria-live]:not([aria-live="off"]),[role="status"],[role="alert"],[role="log"]'

const liveRegions = (): HTMLElement[] => [...document.querySelectorAll<HTMLElement>(LIVE)]

const regionsSaying = (text: string): HTMLElement[] =>
  liveRegions().filter((region) => region.textContent?.includes(text))

const politeness = (region: HTMLElement): string =>
  region.getAttribute('aria-live') ??
  (region.getAttribute('role') === 'alert' ? 'assertive' : 'polite')

const nested = (): HTMLElement[] =>
  liveRegions().filter((region) => region.parentElement?.closest(LIVE))

afterEach(() => cleanup())

describe('live regions', () => {
  it('StatusIndicator is one polite status that updates in place', async () => {
    const label = ref('Deploying')
    render(
      defineComponent({
        setup: () => () => h(StatusIndicator, { label: label.value, loading: true })
      })
    )
    const [region] = regionsSaying('Deploying')
    expect(region).toHaveAttribute('role', 'status')
    expect(politeness(region!)).toBe('polite')
    label.value = 'Deployed'
    await nextTick()
    expect(regionsSaying('Deployed')).toEqual([region])
    expect(nested()).toEqual([])
  })

  it('async-submit announces the result once, through the app Toaster region', async () => {
    render(
      defineComponent({
        setup: () => () => [h(Toaster, { position: 'bottom-right' }), h(AsyncSubmitSucceeded)]
      })
    )
    await waitFor(() => expect(regionsSaying('is live.').length).toBeGreaterThan(0))
    const regions = regionsSaying('is live.')
    expect(regions).toHaveLength(1)
    expect(politeness(regions[0]!)).toBe('polite')
    expect(nested()).toEqual([])
  })

  it('form-error puts the rejection in one alert, not repeated by another region', async () => {
    render(FormErrorRejected)
    await nextTick()
    const alerts = [...document.querySelectorAll<HTMLElement>('[role="alert"]')]
    expect(alerts.length).toBeGreaterThan(0)
    for (const alert of alerts) {
      const text = alert.textContent!.trim().slice(0, 40)
      expect(regionsSaying(text)).toEqual([alert])
    }
    expect(nested()).toEqual([])
  })

  it('LogView appends streamed lines inside one log region, never a region per line', async () => {
    const line = (i: number): LogViewLine => ({
      id: `l${i}`,
      time: '12:00:0' + (i % 10),
      type: 'text',
      message: `Building step ${i}`
    })
    const lines = ref<LogViewLine[]>([line(1), line(2)])
    render(
      defineComponent({
        setup: () => () => h(LogView, { lines: lines.value }, () => h(LogViewContent))
      })
    )
    await nextTick()
    const logs = document.querySelectorAll('[role="log"]')
    expect(logs).toHaveLength(1)
    const log = logs[0] as HTMLElement
    expect(politeness(log)).toBe('polite')
    expect(log.textContent?.trim()).toBe('')

    lines.value = [...lines.value, line(3), line(4)]
    await nextTick()
    await nextTick()
    expect(log.textContent).toContain('Building step 3')
    expect(log.textContent).toContain('Building step 4')
    expect(log.textContent).not.toContain('Building step 1')
    expect(regionsSaying('Building step 3')).toEqual([log])
    expect(
      liveRegions().filter((region) => region !== log && region.closest('[role="log"]'))
    ).toEqual([])
    expect(nested()).toEqual([])
  })
})

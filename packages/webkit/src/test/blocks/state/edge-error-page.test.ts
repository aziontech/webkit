import '../../reflow.css'

import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import type { Component } from 'vue'

import EdgeErrorPage from '../../../../blocks/state/edge-error-page/edge-error-page.vue'
import Blocked from '../../../../blocks/state/edge-error-page/variants/blocked.vue'
import NotFound from '../../../../blocks/state/edge-error-page/variants/not-found.vue'
import OriginError from '../../../../blocks/state/edge-error-page/variants/origin-error.vue'
import OriginTimeout from '../../../../blocks/state/edge-error-page/variants/origin-timeout.vue'
import OriginUnavailable from '../../../../blocks/state/edge-error-page/variants/origin-unavailable.vue'
import RateLimited from '../../../../blocks/state/edge-error-page/variants/rate-limited.vue'
import { expectNoA11yViolations } from '../../axe'

const STATES: Array<[string, Component, string]> = [
  ['Default', EdgeErrorPage, '502'],
  ['OriginTimeout', OriginTimeout, '504'],
  ['OriginError', OriginError, '500'],
  ['OriginUnavailable', OriginUnavailable, '503'],
  ['Blocked', Blocked, '403'],
  ['RateLimited', RateLimited, '429'],
  ['NotFound', NotFound, '404']
]

const ACCOUNT_WORDS = /sign in|log in|switch account|request access|account|console|upgrade/i

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const atWidth = async (width: number): Promise<void> => {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.innerWidth).toBe(width))
  await frame()
}

const visibleBoxes = (container: Element): DOMRect[] =>
  [...container.querySelectorAll<HTMLElement>('[data-hop]')]
    .map((hop) => hop.getBoundingClientRect())
    .filter((rect) => rect.width > 0)

afterEach(async () => {
  cleanup()
  await page.viewport(1280, 900)
})

describe('state/edge-error-page', () => {
  it.each(STATES)(
    '%s shows its code, the three hops and no account action',
    async (_, state, code) => {
      await atWidth(1280)
      const view = render(state)
      expect(view.getByTestId('status-code__code').textContent).toBe(code)
      expect(view.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(view.getByRole('heading', { name: 'What happened?' })).toBeTruthy()
      expect(view.getByRole('heading', { name: 'What can I do?' })).toBeTruthy()
      const hops = view.getByTestId('flow-diagram').querySelectorAll('[data-hop]')
      expect([...hops].map((hop) => hop.getAttribute('data-hop'))).toEqual([
        'visitor',
        'edge',
        'origin'
      ])
      const actions = [...view.container.querySelectorAll('button, a')]
        .map((el) => el.textContent?.trim() ?? '')
        .filter(Boolean)
      expect(actions.length).toBeGreaterThan(0)
      for (const label of actions) expect(label).not.toMatch(ACCOUNT_WORDS)
      expect(view.container.textContent).not.toMatch(/sign in|switch account|request access/i)
      expect(view.getByText('8f3c91ab2e4d7a10')).toBeTruthy()
      await expectNoA11yViolations(view.container)
    }
  )

  it.each(STATES)('%s draws every hop as the same box on a wide screen', async (_, state) => {
    await atWidth(1280)
    const view = render(state)
    const boxes = [
      ...view.getByTestId('flow-diagram').querySelectorAll('[data-slot="flow-diagram-node"]')
    ].map((node) => node.getBoundingClientRect())
    expect(boxes).toHaveLength(3)
    for (const box of boxes) {
      expect(Math.abs(box.width - boxes[0]!.width)).toBeLessThan(0.5)
      expect(Math.abs(box.height - boxes[0]!.height)).toBeLessThan(0.5)
      expect(Math.abs(box.top - boxes[0]!.top)).toBeLessThan(0.5)
    }
  })

  it.each(STATES)('%s stacks the hops as boxes of one size on a phone', async (_, state) => {
    await atWidth(375)
    const view = render(state)
    expect(view.getByTestId('flow-diagram').getBoundingClientRect().width).toBe(0)
    const list = view.container.querySelector('ol')!
    const boxes = visibleBoxes(list)
    expect(boxes).toHaveLength(3)
    for (const box of boxes) {
      expect(Math.abs(box.width - boxes[0]!.width)).toBeLessThan(0.5)
      expect(Math.abs(box.height - boxes[0]!.height)).toBeLessThan(0.5)
      expect(box.right).toBeLessThanOrEqual(375)
    }
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375)
  })

  it('fills the facts and the path from its props', () => {
    const view = render(EdgeErrorPage, {
      props: {
        host: 'shop.example.com',
        location: 'GRU',
        requestId: 'abc123',
        path: {
          visitor: { status: 'Working', severity: 'success' },
          edge: { status: 'Working', severity: 'success' },
          origin: { status: 'Timed out', severity: 'danger' }
        }
      }
    })
    expect(view.getAllByText('shop.example.com').length).toBeGreaterThan(0)
    expect(view.getAllByText('GRU').length).toBeGreaterThan(0)
    expect(view.getAllByText('Timed out').length).toBeGreaterThan(0)
    expect(view.getByText('abc123')).toBeTruthy()
  })

  it('emits retry and back before acting, and points Go to home page at the host', async () => {
    const view = render(EdgeErrorPage, {
      attrs: {
        onRetry: (event: MouseEvent) => event.preventDefault(),
        onBack: (event: MouseEvent) => event.preventDefault()
      }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Try again' }))
    await fireEvent.click(view.getByRole('button', { name: 'Go back' }))
    expect(view.emitted<unknown[]>('retry')?.[0][0]).toBeInstanceOf(MouseEvent)
    expect(view.emitted<unknown[]>('back')?.[0][0]).toBeInstanceOf(MouseEvent)
    cleanup()
    const blocked = render(Blocked)
    expect(blocked.queryByRole('button', { name: 'Try again' })).toBeNull()
    expect(blocked.getByRole('link', { name: /Go to home page/ }).getAttribute('href')).toBe(
      'https://www.example.com/'
    )
  })
})

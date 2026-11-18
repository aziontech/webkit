import '../../reflow.css'

import { cleanup, fireEvent, render, within } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import type { Component } from 'vue'

import EdgeErrorPage from '../../../../blocks/state/edge-error-page/edge-error-page.vue'
import ApplicationError from '../../../../blocks/state/edge-error-page/variants/application-error.vue'
import ApplicationTimeout from '../../../../blocks/state/edge-error-page/variants/application-timeout.vue'
import ApplicationUnavailable from '../../../../blocks/state/edge-error-page/variants/application-unavailable.vue'
import Blocked from '../../../../blocks/state/edge-error-page/variants/blocked.vue'
import NotFound from '../../../../blocks/state/edge-error-page/variants/not-found.vue'
import RateLimited from '../../../../blocks/state/edge-error-page/variants/rate-limited.vue'
import { expectNoA11yViolations } from '../../axe'

const STATES: Array<[string, Component, string]> = [
  ['Default', EdgeErrorPage, '502'],
  ['ApplicationTimeout', ApplicationTimeout, '504'],
  ['ApplicationError', ApplicationError, '500'],
  ['ApplicationUnavailable', ApplicationUnavailable, '503'],
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

const HOPS = ['You', 'Azion', 'Application']

const nodeBoxes = (diagram: Element): DOMRect[] =>
  [...diagram.querySelectorAll<HTMLElement>('[data-slot="flow-diagram-node"]')].map((node) =>
    node.getBoundingClientRect()
  )

const hopNames = (diagram: Element): string[] =>
  [...diagram.querySelectorAll('[data-slot="flow-diagram-header"]')].map(
    (header) => header.querySelector('.truncate')?.textContent?.trim() ?? ''
  )

const cardsLoaded = async (container: Element): Promise<void> => {
  await vi.waitFor(() =>
    expect(container.querySelectorAll('[data-slot="flow-diagram-header"]')).toHaveLength(6)
  )
}

const expectSameSize = (boxes: DOMRect[]): void => {
  expect(boxes).toHaveLength(3)
  for (const box of boxes) {
    expect(box.width).toBeGreaterThan(0)
    expect(Math.abs(box.width - boxes[0]!.width)).toBeLessThan(0.5)
    expect(Math.abs(box.height - boxes[0]!.height)).toBeLessThan(0.5)
  }
}

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
      await cardsLoaded(view.container)
      expect(view.getByTestId('status-code__code').textContent).toBe(code)
      expect(view.getAllByRole('heading', { level: 1 })).toHaveLength(1)
      expect(view.getByRole('heading', { name: 'What happened?' })).toBeTruthy()
      expect(view.getByRole('heading', { name: 'What can I do?' })).toBeTruthy()
      const diagram = view.getByTestId('edge-error-page__path')
      expect(hopNames(diagram)).toEqual(HOPS)
      expect(diagram.getAttribute('aria-labelledby')).toBe(
        view.getByRole('heading', { name: 'Request path' }).id
      )
      expect(view.container.textContent).not.toMatch(/\bedge\b|\borigin\b/i)
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

  it.each(STATES)(
    '%s draws every hop as the same card in one row on a wide screen',
    async (_, state) => {
      await atWidth(1280)
      const view = render(state)
      await cardsLoaded(view.container)
      expect(view.getByTestId('edge-error-page__path-stacked').getBoundingClientRect().width).toBe(
        0
      )
      const diagram = view.getByTestId('edge-error-page__path')
      const boxes = nodeBoxes(diagram)
      expectSameSize(boxes)
      for (const box of boxes) expect(Math.abs(box.top - boxes[0]!.top)).toBeLessThan(0.5)
      expect(boxes[1]!.left).toBeGreaterThan(boxes[0]!.right)
      expect(boxes[2]!.left).toBeGreaterThan(boxes[1]!.right)
      await vi.waitFor(() => expect(diagram.querySelectorAll('svg path')).toHaveLength(2))
      const scroller = diagram.querySelector<HTMLElement>('.overflow-x-auto')!
      expect(scroller.scrollWidth).toBeLessThanOrEqual(scroller.clientWidth)
    }
  )

  it.each(STATES)('%s stacks the hops as cards of one size on a phone', async (_, state) => {
    await atWidth(375)
    const view = render(state)
    await cardsLoaded(view.container)
    expect(view.getByTestId('edge-error-page__path').getBoundingClientRect().width).toBe(0)
    const diagram = view.getByTestId('edge-error-page__path-stacked')
    expect(diagram.querySelector('[role="list"]')?.getAttribute('data-orientation')).toBe(
      'vertical'
    )
    expect(hopNames(diagram)).toEqual(HOPS)
    const boxes = nodeBoxes(diagram)
    expectSameSize(boxes)
    expect(boxes[1]!.top).toBeGreaterThan(boxes[0]!.bottom)
    expect(boxes[2]!.top).toBeGreaterThan(boxes[1]!.bottom)
    for (const box of boxes) expect(box.right).toBeLessThanOrEqual(375)
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(375)
  })

  it('opens a hop to explain it', async () => {
    await atWidth(1280)
    const view = render(EdgeErrorPage)
    await cardsLoaded(view.container)
    const diagram = view.getByTestId('edge-error-page__path')
    const trigger = within(diagram).getAllByRole('button', { expanded: false })[2]!
    await fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(within(diagram).getByText(/The application that serves this site/)).toBeTruthy()
  })

  it('fills the facts and the path from its props', async () => {
    const view = render(EdgeErrorPage, {
      props: {
        host: 'shop.example.com',
        location: 'GRU',
        requestId: 'abc123',
        path: {
          visitor: { status: 'Working', severity: 'success' },
          azion: { status: 'Working', severity: 'success' },
          application: { status: 'Timed out', severity: 'danger' }
        }
      }
    })
    await cardsLoaded(view.container)
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

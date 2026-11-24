import '../../reflow.css'

import { cleanup, fireEvent, render } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'
import type { Component } from 'vue'

import StateErrorPage from '../../../../blocks/state/state-error-page/state-error-page.vue'
import Forbidden from '../../../../blocks/state/state-error-page/variants/forbidden.vue'
import Maintenance from '../../../../blocks/state/state-error-page/variants/maintenance.vue'
import RateLimited from '../../../../blocks/state/state-error-page/variants/rate-limited.vue'
import ResourceNotFound from '../../../../blocks/state/state-error-page/variants/resource-not-found.vue'
import ServerError from '../../../../blocks/state/state-error-page/variants/server-error.vue'
import SessionExpired from '../../../../blocks/state/state-error-page/variants/session-expired.vue'
import { expectNoA11yViolations } from '../../axe'

const STATES: Array<[string, Component, string, string]> = [
  ['Default', StateErrorPage, '404', 'NOT_FOUND'],
  ['SessionExpired', SessionExpired, '401', 'SESSION_EXPIRED'],
  ['Forbidden', Forbidden, '403', 'FORBIDDEN'],
  ['RateLimited', RateLimited, '429', 'RATE_LIMITED'],
  ['ServerError', ServerError, '500', 'INTERNAL_ERROR'],
  ['Maintenance', Maintenance, '503', 'MAINTENANCE'],
  ['ResourceNotFound', ResourceNotFound, '404', 'RESOURCE_NOT_FOUND']
]

afterEach(async () => {
  cleanup()
  await page.viewport(1280, 900)
})

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
describe('state/state-error-page', () => {
  it.each(STATES)(
    '%s shows the status code, at most two buttons and the reference line',
    async (_, state, code, errorCode) => {
      const view = render(state)
      expect(view.getByTestId('status-code__code').textContent).toBe(code)
      expect(view.getByRole('heading', { level: 1 }).textContent).toBe(`Error ${code}`)
      const actions = view.getByTestId('empty-state__actions')
      const buttons = actions.querySelectorAll('[data-testid="button"]')
      expect(buttons.length).toBeGreaterThan(0)
      expect(buttons.length).toBeLessThanOrEqual(2)
      expect(view.getByText(errorCode)).toBeTruthy()
      expect(view.getByText('req_7f3c91ab')).toBeTruthy()
      expect(view.getByRole('button', { name: 'Copy the request ID' })).toBeTruthy()
      await expectNoA11yViolations(view.container)
    }
  )

  it('renders the copy and links it is given and emits home', async () => {
    const view = render(StateErrorPage, {
      props: {
        title: 'Domain not found',
        description: 'No domain with this name exists in the account.',
        homeHref: '/domains',
        docsHref: 'https://example.com/docs/domains',
        requestId: 'req_1234'
      }
    })
    expect(view.getByText('Domain not found')).toBeTruthy()
    expect(view.getByText('No domain with this name exists in the account.')).toBeTruthy()
    expect(view.queryByText('Page not found')).toBeNull()
    expect(view.getByText('req_1234')).toBeTruthy()
    const home = view.getByRole('link', { name: 'Go to home' })
    expect(home.getAttribute('href')).toBe('/domains')
    expect(view.getByRole('link', { name: /Docs/ }).getAttribute('href')).toBe(
      'https://example.com/docs/domains'
    )
    home.addEventListener('click', (event) => event.preventDefault())
    await fireEvent.click(home)
    expect(view.emitted<unknown[]>('home')?.[0][0]).toBeInstanceOf(MouseEvent)
  })

  it.each([320, 390])(
    'stacks the Code and ID pairs at %ipx without an orphaned separator',
    async (width) => {
      await page.viewport(width, 900)
      await vi.waitFor(() => expect(window.innerWidth).toBe(width))
      await frame()
      const view = render(SessionExpired)
      const separator = view.getByTestId('state-error-page__separator')
      expect(getComputedStyle(separator).display).toBe('none')
      const [code, id] = [...view.getByTestId('state-error-page__reference').children].filter(
        (child) => child !== separator
      )
      expect(id!.getBoundingClientRect().top).toBeGreaterThanOrEqual(
        code!.getBoundingClientRect().bottom - 1
      )
    }
  )
})

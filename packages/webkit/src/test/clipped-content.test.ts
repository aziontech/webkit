import './reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { h } from 'vue'

import DeploymentSettings from '../../blocks/account/account-deployment-settings/account-deployment-settings.vue'
import OauthConsent from '../../blocks/auth/auth-sign-in/variants/oauth-consent.vue'
import DeleteSettingsRow from '../../blocks/edit/edit-delete-dialog/variants/settings-row.vue'
import FunctionArguments from '../../blocks/edit/edit-function/variants/arguments.vue'
import FunctionTestRun from '../../blocks/edit/edit-function/variants/test-run.vue'
import FirstUseLoading from '../../blocks/state/state-first-use/variants/loading.vue'
import NavigationMenuDefault from '../../examples/navigation-menu/default.vue'
import ToolCall from '../components/ai/tool-call/tool-call.vue'
import Skeleton from '../components/feedback/skeleton/skeleton.vue'

const overlaps = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom

describe('clipped content', () => {
  it('never draws a rectangle wider than its container', () => {
    const view = render(() =>
      h('div', { style: 'width: 100px' }, [h(Skeleton, { width: '16rem', height: '1rem' })])
    )
    const bar = view.getByTestId('skeleton')
    expect(bar.getBoundingClientRect().width).toBeLessThanOrEqual(100)
  })

  it('keeps the state-first-use loading rows apart on a phone', () => {
    const view = render(() => h('div', { style: 'width: 358px' }, [h(FirstUseLoading)]))
    const rows = view.container.querySelectorAll<HTMLElement>('[data-slot="item"]')
    expect(rows.length).toBeGreaterThan(0)
    for (const row of rows) {
      const bars = [...row.querySelectorAll('[data-slot="item-content"] [data-testid="skeleton"]')]
      const action = row.querySelector('[data-slot="item-actions"] [data-testid="skeleton"]')!
      const boxes = bars.map((bar) => bar.getBoundingClientRect())
      for (const box of boxes) expect(overlaps(box, action.getBoundingClientRect())).toBe(false)
      expect(overlaps(boxes[0]!, boxes[1]!)).toBe(false)
      expect(boxes[1]!.top - boxes[0]!.bottom).toBeGreaterThan(0)
    }
  })

  it('shows the whole irreversible warning of the delete settings row on a phone', () => {
    const view = render(() => h('div', { style: 'width: 358px' }, [h(DeleteSettingsRow)]))
    const description = view.container.querySelector<HTMLElement>('[data-slot="item-description"]')!
    expect(description.textContent).toContain('This cannot be undone.')
    expect(description.scrollHeight).toBeLessThanOrEqual(description.clientHeight + 1)
  })

  it.each([320, 768])('shows each argument field name in full at %ipx', async (width) => {
    const view = render(() => h('div', { style: `width: ${width}px` }, [h(FunctionArguments)]))
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    const headers = view.container.querySelectorAll<HTMLElement>('[data-slot="field-header"]')
    expect(headers.length).toBeGreaterThan(0)
    for (const header of headers) {
      const key = header.querySelector<HTMLElement>(
        '[data-slot="item-content"] .text-label-code-sm'
      )!
      expect(key.textContent?.trim()).not.toBe('')
      expect(key.getBoundingClientRect().width).toBeGreaterThan(0)
      expect(key.scrollWidth).toBeLessThanOrEqual(key.clientWidth + 1)
    }
  })

  it('shows the whole signed-in email on the consent screen at 320px', async () => {
    await page.viewport(320, 700)
    const view = render(OauthConsent)
    const email = await vi.waitFor(() => view.getByText('jane.doe@example.com'))
    expect(email.scrollWidth).toBeLessThanOrEqual(email.clientWidth + 1)
    expect(email.getBoundingClientRect().right).toBeLessThanOrEqual(320)
  })

  it('keeps the shared-setting tag inside the All services row at 320px', async () => {
    await page.viewport(320, 700)
    const view = render(DeploymentSettings)
    const tag = await vi.waitFor(() => view.getByText(/on a shared setting/))
    const trigger = tag.closest('button') as HTMLElement
    expect(tag.getBoundingClientRect().right).toBeLessThanOrEqual(
      trigger.getBoundingClientRect().right + 0.5
    )
  })

  it('shows the whole tool title and name of a call 288px wide', async () => {
    const view = render(() =>
      h('div', { style: 'width: 288px' }, [
        h(ToolCall, {
          name: 'get_build_artifacts',
          title: 'Read the latest build of storefront',
          status: 'success'
        })
      ])
    )
    await document.fonts.ready
    const code = view.container.querySelector('code') as HTMLElement
    expect(code.scrollWidth).toBeLessThanOrEqual(code.clientWidth + 1)
    const title = view.getByText('Read the latest build of storefront')
    expect(title.scrollHeight).toBeLessThanOrEqual(title.clientHeight + 1)
  })

  it('reads the whole test run below the editor on a phone, with no pane to scroll', async () => {
    await page.viewport(390, 844)
    const view = render(FunctionTestRun)
    const pane = await vi.waitFor(() => {
      const found = view.container.querySelector<HTMLElement>(
        'section[aria-labelledby="test-run-title"]'
      )
      expect(found).not.toBeNull()
      return found!
    })
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)))
    expect(pane.scrollHeight).toBeLessThanOrEqual(pane.clientHeight + 1)
    expect(view.container.querySelector('[role="separator"]')?.getBoundingClientRect().height).toBe(
      0
    )
  })
})

afterEach(async () => {
  await page.viewport(414, 896)
})

describe('a navigation menu panel on a phone (A6-074)', () => {
  it.each([320, 390])(
    'keeps every link of the Solutions panel inside the panel at %ipx',
    async (width) => {
      await page.viewport(width, 844)
      const view = render(NavigationMenuDefault)
      view.getByRole('button', { name: 'Solutions' }).focus()
      await userEvent.keyboard('{Enter}')
      const popover = () =>
        Array.from(
          document.body.querySelectorAll<HTMLElement>('[data-testid="navigation-menu-popover"]')
        ).find((el) => el.querySelectorAll('a').length > 3)
      await waitFor(() => expect(popover()?.textContent).toContain('Media and entertainment'))
      await new Promise((resolve) => setTimeout(resolve, 400))
      const box = popover()!.getBoundingClientRect()
      expect(box.right).toBeLessThanOrEqual(width)
      const links = Array.from(popover()!.querySelectorAll<HTMLElement>('a'))
      expect(links.length).toBeGreaterThan(3)
      for (const link of links) {
        const rect = link.getBoundingClientRect()
        expect(rect.left).toBeGreaterThanOrEqual(box.left - 1)
        expect(rect.right).toBeLessThanOrEqual(box.right + 1)
      }
      view.unmount()
    }
  )
})

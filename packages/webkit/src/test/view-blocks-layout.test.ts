import './reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { page } from 'vitest/browser'

import EventsExplorerEventDocument from '../../blocks/view/view-events-explorer/variants/event-document.vue'
import EventsExplorerQuery from '../../blocks/view/view-events-explorer/variants/query.vue'
import EventsExplorerSessions from '../../blocks/view/view-events-explorer/variants/sessions.vue'
import FileBrowserInsideAFolder from '../../blocks/view/view-file-browser/variants/inside-a-folder.vue'
import FileBrowserUploading from '../../blocks/view/view-file-browser/variants/uploading.vue'
import MarketplaceSolutionPage from '../../blocks/view/view-marketplace/variants/solution-page.vue'
import QueryEditorQuery from '../../blocks/view/view-query-editor/variants/query.vue'
import ViewTableDeployments from '../../blocks/view/view-table/variants/deployments.vue'
import ViewWafTuning from '../../blocks/view/view-waf-tuning/view-waf-tuning.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const frame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)))

const atWidth = async (width: number): Promise<void> => {
  await page.viewport(width, 900)
  await vi.waitFor(() => expect(window.innerWidth).toBe(width))
  await frame()
}

const settle = async () => {
  await frame()
  await frame()
  await frame()
}

const rowOf = (el: Element): HTMLElement => el.closest<HTMLElement>('[role="row"]')!

const clipped = (el: HTMLElement) => el.scrollWidth > el.clientWidth + 1

afterEach(async () => {
  document.documentElement.removeAttribute('dir')
  await page.viewport(414, 896)
})

describe('view blocks, styled layout', () => {
  it('fills the row whose event is open in the pane (events explorer)', async () => {
    await atWidth(1280)
    const view = render(EventsExplorerEventDocument)
    const open = await waitFor(() => {
      const button = view.container.querySelector('[data-open-event]')
      expect(button).not.toBeNull()
      return button!
    })
    const closed = view.container.querySelector(
      '[aria-expanded="false"][aria-label^="Open event"]'
    )!
    const openFill = getComputedStyle(rowOf(open)).backgroundColor
    const closedFill = getComputedStyle(rowOf(closed)).backgroundColor
    expect(openFill).not.toBe(closedFill)
  })

  it('fits every shown column at 1280 instead of cutting the last one (events explorer)', async () => {
    await atWidth(1280)
    const view = render(EventsExplorerSessions)
    const header = await waitFor(() => view.getByRole('columnheader', { name: /Remote address/ }))
    await settle()
    const scroller = header.closest<HTMLElement>('[data-testid$="__scroll"]')
    const edge = (scroller ?? view.container).getBoundingClientRect().right
    expect(header.getBoundingClientRect().right).toBeLessThanOrEqual(edge + 1)
  })

  it('lets the folder path take the free width of its row (file browser)', async () => {
    await atWidth(1280)
    const view = render(FileBrowserInsideAFolder)
    const labels = await waitFor(() => {
      const found = view.container.querySelectorAll<HTMLElement>(
        '[data-testid^="breadcrumb__item-"][data-testid$="__label"]'
      )
      expect(found.length).toBeGreaterThan(1)
      return Array.from(found)
    })
    await settle()
    expect(labels.filter(clipped).map((label) => label.textContent?.trim())).toEqual([])
  })

  it('keeps the integration page title the largest heading (marketplace solution page)', async () => {
    await atWidth(1280)
    const view = render(MarketplaceSolutionPage)
    const title = await waitFor(() => view.getByRole('heading', { level: 1 }))
    const size = (el: Element) => Number.parseFloat(getComputedStyle(el).fontSize)
    const sections = view.getAllByRole('heading', { level: 2 })
    expect(sections.length).toBeGreaterThan(0)
    for (const heading of sections) expect(size(heading)).toBeLessThan(size(title))
    const prose = view.container.querySelector('[role="tabpanel"] p')!
    for (const heading of sections) expect(size(heading)).toBeGreaterThan(size(prose))
    const description = title.parentElement?.parentElement?.textContent ?? ''
    const first = view.container.querySelector('[role="tabpanel"] p')?.textContent?.trim() ?? ''
    expect(description).not.toContain(first)
  })

  it('keeps the search row one height, the column settings included (file browser)', async () => {
    await atWidth(1280)
    const view = render(FileBrowserInsideAFolder)
    const refresh = await waitFor(() => view.getByRole('button', { name: 'Refresh' }))
    await settle()
    const height = (el: Element) => Math.round(el.getBoundingClientRect().height)
    const settings = view.getByTestId('collection-preferences__trigger')
    const search = view.getByRole('textbox', { name: /search/i })
    expect(height(settings)).toBe(height(refresh))
    expect(height(view.getByRole('button', { name: 'Download CSV' }))).toBe(height(refresh))
    expect(height(search.closest('[data-size]') ?? search)).toBe(height(refresh))
  })

  it('keeps the floating upload card inside a phone screen (file browser)', async () => {
    await atWidth(390)
    const view = render(FileBrowserUploading)
    const card = await waitFor(() => view.getByTestId('upload-progress'))
    await settle()
    const box = card.getBoundingClientRect()
    expect(box.left).toBeGreaterThanOrEqual(15)
    expect(box.right).toBeLessThanOrEqual(window.innerWidth - 15)
  })

  it('never cuts a deployment version to fit the Current tag on a phone (view table)', async () => {
    await atWidth(390)
    const view = render(ViewTableDeployments)
    const versions = await waitFor(() => {
      const found = view.getAllByTestId('deployment-version')
      expect(found.length).toBeGreaterThan(0)
      return found
    })
    await settle()
    expect(versions.filter(clipped).map((version) => version.textContent?.trim())).toEqual([])
    for (const version of versions) {
      const cell = version.closest<HTMLElement>('[role="cell"], [role="rowheader"]')!
      expect(version.getBoundingClientRect().right).toBeLessThanOrEqual(
        cell.getBoundingClientRect().right + 1
      )
    }
  })

  it('gives the query field its own full row on a phone (events explorer)', async () => {
    await atWidth(390)
    const view = render(EventsExplorerQuery)
    const query = await waitFor(() => view.getByTestId('events-query'))
    await settle()
    const header = query.closest('header')!
    expect(query.getBoundingClientRect().width).toBeGreaterThan(header.clientWidth * 0.9)
  })

  it('never clips Run query, and keeps the results search usable on a phone (query editor)', async () => {
    await atWidth(390)
    const view = render(QueryEditorQuery)
    const run = await waitFor(() => view.getByRole('button', { name: /^Run query/ }))
    await settle()
    expect(clipped(run)).toBe(false)
    const search = view.getByRole('textbox', { name: 'Search results' })
    expect(search.getBoundingClientRect().width).toBeGreaterThan(200)
  })

  it.each([
    ['at tablet width', 768, 'ltr'],
    ['in right-to-left', 1280, 'rtl']
  ])(
    'folds list cells into +N instead of truncating a chip %s (WAF tuning)',
    async (_l, w, dir) => {
      document.documentElement.dir = dir
      await atWidth(w)
      const view = render(ViewWafTuning)
      await waitFor(() => expect(view.getAllByTestId('table-cell-tags').length).toBeGreaterThan(0))
      await settle()
      const cells = view.getAllByTestId('table-cell-tags')
      for (const cell of cells) {
        const texts = Array.from(cell.querySelectorAll<HTMLElement>('[data-tag-text]'))
        if (texts.length < 2) continue
        expect(texts.filter(clipped).map((text) => text.textContent)).toEqual([])
      }
    }
  )
})

import './reflow.css'

import { render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ChecklistDrawer from '../../blocks/detail/detail-production-checklist/variants/drawer-detail.vue'
import VersionHistory from '../../blocks/detail/detail-version/variants/version-history.vue'
import TopBarCreation from '../../blocks/top-bar/top-bar-creation/top-bar-creation.vue'
import Trace from '../../examples/trace/default.vue'

const at = (width: number, page: object) =>
  render(() => h('div', { style: { width: `${width}px` } }, [h(page)]))

describe('detail and top-bar blocks on a phone', () => {
  it('gives the trace span names more than half of a 360px trace', () => {
    const view = at(360, Trace)
    const trace = view.getByTestId('trace')
    const cell = view.container
      .querySelector('[role="gridcell"] span[title]')!
      .closest('[role="gridcell"]') as HTMLElement
    expect(cell.getBoundingClientRect().width).toBeGreaterThan(
      trace.getBoundingClientRect().width * 0.5
    )
  })

  it('shows each checklist step explanation in full in the drawer', async () => {
    at(390, ChecklistDrawer)
    const title = await screen.findByText('Ship to production')
    const drawer = title.closest('[role="dialog"]') as HTMLElement
    const texts = [...drawer.querySelectorAll<HTMLElement>('p.text-body-sm')]
    expect(texts.length).toBeGreaterThan(1)
    for (const text of texts) {
      expect(getComputedStyle(text).webkitLineClamp).toBe('none')
      expect(text.scrollHeight).toBeLessThanOrEqual(text.clientHeight + 1)
    }
  })

  it('stacks the version history under the page instead of beside it', async () => {
    const view = at(390, VersionHistory)
    const workspace = view.getByRole('group', { name: 'Version workspace' })
    await waitFor(() => expect(workspace.getAttribute('data-orientation')).toBe('vertical'))
    const settings = view.getByRole('group', { name: 'Version settings' })
    expect(settings.getBoundingClientRect().width).toBeGreaterThan(300)
  })

  it('names both creation crumbs in full at 320px', () => {
    const view = at(320, TopBarCreation)
    for (const label of ['Resources', 'Create Resource']) {
      const crumb = view.getByText(label)
      expect(crumb.scrollWidth, label).toBeLessThanOrEqual(crumb.clientWidth + 1)
    }
  })
})

import '../../../test/reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Sidebar from './sidebar.vue'

describe('Sidebar', () => {
  describe('in a right-to-left subtree (styled)', () => {
    it('a collapsed rail and its expand affordance slide toward the inline start in right-to-left', async () => {
      const host = document.createElement('div')
      host.setAttribute('dir', 'rtl')
      document.body.appendChild(host)
      const { getByTestId } = render(Sidebar, {
        container: host,
        props: { collapsible: true, open: false },
        slots: { default: '<a href="/">Home</a>' }
      })
      const inner = getByTestId('sidebar__panel')
      expect(getComputedStyle(inner).translate).toBe('100%')
      await waitFor(() => expect(getByTestId('sidebar').getBoundingClientRect().width).toBe(0))
      const expand = await waitFor(() => getByTestId('sidebar__expand'))
      const label = expand.lastElementChild as HTMLElement
      expect(parseFloat(getComputedStyle(label).translate)).toBeGreaterThan(0)
      getByTestId('sidebar__expand-button').focus()
      await waitFor(() => expect(getComputedStyle(label).translate).toMatch(/^0px/))
      host.remove()
    })
  })

  describe('collapsed (styled)', () => {
    it('an icon rail narrows to the rail width, driven by the panel state', async () => {
      const { getByTestId } = render(Sidebar, {
        props: { collapsible: 'icon', open: false },
        slots: { default: '<a href="/">Home</a>' }
      })
      const root = getByTestId('sidebar')
      await waitFor(() => expect(root.getBoundingClientRect().width).toBeGreaterThan(0))
      expect(getComputedStyle(root).width).toBe(getComputedStyle(root).minWidth)
    })
  })
})

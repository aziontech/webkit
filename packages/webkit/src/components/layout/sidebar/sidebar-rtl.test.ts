import '../../../test/reflow.css'

import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import Sidebar from './sidebar.vue'

describe('Sidebar in a right-to-left subtree (styled)', () => {
  it('a collapsed rail and its expand affordance slide toward the inline start in right-to-left', async () => {
    const host = document.createElement('div')
    host.setAttribute('dir', 'rtl')
    document.body.appendChild(host)
    const { getByTestId } = render(Sidebar, {
      container: host,
      props: { collapsible: true, collapsed: true },
      slots: { default: '<a href="/">Home</a>' }
    })
    const inner = getByTestId('layout-sidebar__panel')
    expect(getComputedStyle(inner).translate).toBe('100%')
    const expand = await waitFor(() => getByTestId('layout-sidebar__expand'))
    const label = expand.lastElementChild as HTMLElement
    expect(parseFloat(getComputedStyle(label).translate)).toBeGreaterThan(0)
    getByTestId('layout-sidebar__expand-button').focus()
    await waitFor(() => expect(getComputedStyle(label).translate).toMatch(/^0px/))
    host.remove()
  })
})

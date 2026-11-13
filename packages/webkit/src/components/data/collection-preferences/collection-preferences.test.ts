import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import Default from '../../../../examples/collection-preferences/default.vue'
import InADrawer from '../../../../examples/collection-preferences/in-a-drawer.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import CollectionPreferences from './collection-preferences.vue'

const settle = async () => {
  await nextTick()
  await nextTick()
}

const dialog = () => document.body.querySelector<HTMLElement>('[role="dialog"]') as HTMLElement

const columns = [
  { id: 'name', label: 'Name', locked: true },
  { id: 'status', label: 'Status' },
  { id: 'region', label: 'Region' }
]

describe('CollectionPreferences', () => {
  it('opens from the cog button with every section', async () => {
    const view = render(Default)
    await fireEvent.click(view.getByRole('button', { name: 'Preferences' }))
    await settle()
    const panel = within(dialog())
    expect(panel.getByText('Page size')).toBeTruthy()
    expect(panel.getByRole('radio', { name: '25 items' })).toBeTruthy()
    expect(panel.getByText('Columns')).toBeTruthy()
    expect(panel.getByText('Wrap lines')).toBeTruthy()
    expect(panel.getByText('Striped rows')).toBeTruthy()
    expect(panel.getByRole('radio', { name: 'Compact' })).toBeTruthy()
  })

  it('applies the draft on Confirm only', async () => {
    const view = render(CollectionPreferences, {
      props: {
        open: true,
        columns,
        pageSizeOptions: [10, 25],
        preferences: { pageSize: 10, density: 'comfortable' }
      }
    })
    await settle()
    const panel = within(dialog())
    await fireEvent.click(panel.getByRole('radio', { name: '25 items' }))
    await fireEvent.click(panel.getByRole('radio', { name: 'Compact' }))
    await fireEvent.click(panel.getByRole('button', { name: 'Move Status down' }))
    const switches = panel.getAllByRole('switch')
    await fireEvent.click(switches[1] as HTMLElement)
    expect(view.emitted()['update:preferences']).toBeUndefined()
    await fireEvent.click(panel.getByRole('button', { name: 'Confirm' }))
    const value = view.emitted()['update:preferences']?.[0]?.[0]
    expect(value).toMatchObject({
      pageSize: 25,
      density: 'compact',
      wrapLines: false,
      striped: false,
      columns: [
        { id: 'name', visible: true },
        { id: 'region', visible: false },
        { id: 'status', visible: true }
      ]
    })
    expect(view.emitted()['update:open']?.at(-1)).toEqual([false])
  })

  it('discards the draft on Cancel', async () => {
    const view = render(CollectionPreferences, {
      props: { open: true, columns, pageSizeOptions: [10, 25], preferences: { pageSize: 10 } }
    })
    await settle()
    const panel = within(dialog())
    await fireEvent.click(panel.getByRole('radio', { name: '25 items' }))
    await fireEvent.click(panel.getByRole('button', { name: 'Cancel' }))
    expect(view.emitted()['cancel']).toHaveLength(1)
    expect(view.emitted()['cancel']?.[0]?.[0]).toBeInstanceOf(MouseEvent)
    expect(view.emitted()['update:preferences']).toBeUndefined()
  })

  it('emits confirm as (event, value) from a pointer click', async () => {
    const view = render(CollectionPreferences, {
      props: { open: true, columns, pageSizeOptions: [10, 25], preferences: { pageSize: 10 } }
    })
    await settle()
    const panel = within(dialog())
    await userEvent.click(panel.getByRole('radio', { name: '25 items' }))
    await userEvent.click(panel.getByRole('button', { name: 'Confirm' }))
    const payload = view.emitted()['confirm']?.[0] as unknown[]
    expect(payload[0]).toBeInstanceOf(MouseEvent)
    expect(payload[1]).toEqual(view.emitted()['update:preferences']?.[0]?.[0])
    expect(payload[1]).toMatchObject({ pageSize: 25 })
  })

  it('emits confirm with the DOM event first from the keyboard', async () => {
    const view = render(CollectionPreferences, {
      props: { open: true, columns, pageSizeOptions: [10, 25], preferences: { pageSize: 10 } }
    })
    await settle()
    within(dialog()).getByRole('button', { name: 'Confirm' }).focus()
    await userEvent.keyboard('{Enter}')
    const confirm = view.emitted()['confirm']?.[0] as unknown[]
    expect(confirm[0]).toBeInstanceOf(Event)
    expect(confirm[1]).toMatchObject({ pageSize: 10 })
  })

  it('emits cancel with the DOM event first from the keyboard', async () => {
    const second = render(CollectionPreferences, {
      props: { open: true, columns, preferences: { pageSize: 10 } }
    })
    await settle()
    within(dialog()).getByRole('button', { name: 'Cancel' }).focus()
    await userEvent.keyboard('{Enter}')
    expect(second.emitted()['cancel']?.[0]?.[0]).toBeInstanceOf(Event)
  })

  it('keeps a locked column on and hides empty sections', async () => {
    render(CollectionPreferences, {
      props: { open: true, columns, sections: ['columns', 'page-size'] }
    })
    await settle()
    const panel = within(dialog())
    const locked = panel.getAllByRole('switch')[0] as HTMLInputElement
    expect(locked.disabled).toBe(true)
    expect(panel.getByText('Always shown')).toBeTruthy()
    expect(panel.queryByText('Page size')).toBeNull()
    expect(panel.queryByText('Wrap lines')).toBeNull()
  })

  it('opens in a drawer from a custom trigger', async () => {
    const view = render(InADrawer)
    await fireEvent.click(view.getByRole('button', { name: 'Table settings' }))
    await settle()
    expect(dialog()).toBeTruthy()
    expect(within(dialog()).getByText('Density')).toBeTruthy()
  })

  it('has no axe violations, closed and open', async () => {
    const view = render(Default)
    await expectNoA11yViolations(view.container)
    await fireEvent.click(view.getByRole('button', { name: 'Preferences' }))
    await settle()
    await expectNoA11yViolations(dialog())
  })
})

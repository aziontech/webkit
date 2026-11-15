import userEvent from '@testing-library/user-event'
import { fireEvent, render, within } from '@testing-library/vue'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'

import Default from '../../../../examples/collection-preferences/default.vue'
import InADrawer from '../../../../examples/collection-preferences/in-a-drawer.vue'
import { expectNoA11yViolations } from '../../../test/axe'
import DataTable from '../data-table/data-table.vue'
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
  it('opens from defaultOpen and reports v-model:open', async () => {
    const view = render(CollectionPreferences, { props: { columns, defaultOpen: true } })
    await settle()
    expect(dialog()).toBeTruthy()
    expect(view.getByTestId('data-collection-preferences').getAttribute('data-state')).toBe('open')
    view.unmount()

    const closed = render(CollectionPreferences, { props: { columns } })
    await settle()
    expect(closed.getByTestId('data-collection-preferences').getAttribute('data-state')).toBe(
      'closed'
    )
    await fireEvent.click(closed.getByRole('button', { name: 'Preferences' }))
    expect(closed.emitted()['update:open']).toEqual([[true]])
  })

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

  it('reopens on the confirmed values with no v-model:preferences bound', async () => {
    const view = render(CollectionPreferences, {
      props: { columns, pageSizeOptions: [10, 25] }
    })
    await fireEvent.click(view.getByRole('button', { name: 'Preferences' }))
    await settle()
    await fireEvent.click(within(dialog()).getByRole('radio', { name: '25 items' }))
    await fireEvent.click(within(dialog()).getByRole('button', { name: 'Confirm' }))
    await settle()
    await fireEvent.click(view.getByRole('button', { name: 'Preferences' }))
    await settle()
    expect(
      (within(dialog()).getByRole('radio', { name: '25 items' }) as HTMLInputElement).checked
    ).toBe(true)
  })

  it('does not open while disabled', async () => {
    const view = render(CollectionPreferences, { props: { columns, disabled: true } })
    const trigger = view.getByRole('button', { name: 'Preferences' })
    expect((trigger as HTMLButtonElement).disabled).toBe(true)
    await fireEvent.click(trigger)
    await settle()
    expect(document.body.querySelector('[role="dialog"]')).toBeNull()
    expect(view.emitted()['update:open']).toBeUndefined()
  })

  for (const close of ['Cancel', 'Confirm', 'Escape'] as const) {
    it(`returns focus to the trigger after ${close}`, async () => {
      const view = render(CollectionPreferences, { props: { columns } })
      const trigger = view.getByRole('button', { name: 'Preferences' })
      trigger.focus()
      await userEvent.click(trigger)
      await settle()
      if (close === 'Escape') await userEvent.keyboard('{Escape}')
      else await userEvent.click(within(dialog()).getByRole('button', { name: close }))
      await settle()
      await settle()
      expect(document.activeElement).toBe(trigger)
    })
  }

  it('moves a column with its buttons and keeps focus on the moved row', async () => {
    const view = render(CollectionPreferences, { props: { open: true, columns } })
    await settle()
    const panel = within(dialog())
    await userEvent.click(panel.getByRole('button', { name: 'Move Region up' }))
    await settle()
    const rows = panel.getAllByTestId('data-collection-preferences__column')
    expect(rows.map((row) => row.textContent?.includes('Region'))).toEqual([false, true, false])
    expect(rows[1]?.contains(document.activeElement)).toBe(true)
    await fireEvent.click(panel.getByRole('button', { name: 'Confirm' }))
    expect(
      (view.emitted()['update:preferences']?.[0]?.[0] as { columns: { id: string }[] }).columns.map(
        (column) => column.id
      )
    ).toEqual(['name', 'region', 'status'])
  })

  it('takes the consumer data-testid over the fallback', () => {
    const view = render(CollectionPreferences, {
      props: { columns },
      attrs: { 'data-testid': 'domains-preferences' }
    })
    expect(view.getByTestId('domains-preferences')).toBeTruthy()
    expect(view.getByTestId('domains-preferences__trigger')).toBeTruthy()
    expect(view.queryByTestId('data-collection-preferences')).toBeNull()
  })

  it('marks a locked column label with data-locked', async () => {
    render(CollectionPreferences, { props: { open: true, columns } })
    await settle()
    const labels = Array.from(dialog().querySelectorAll('label[data-locked]'))
    expect(labels).toHaveLength(1)
    expect(labels[0]?.textContent).toContain('Name')
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

describe('CollectionPreferences inside a DataTable', () => {
  it('reads the table columns when it has none and writes visibility and order on Confirm', async () => {
    const view = render(
      defineComponent({
        setup: () => () =>
          h(
            DataTable,
            {
              data: [{ id: '1', name: 'storefront', status: 'Active', region: 'us-east' }],
              columns: [
                { accessorKey: 'name', header: 'Name', hideable: false },
                { accessorKey: 'status', header: 'Status' },
                { accessorKey: 'region', header: 'Region' }
              ],
              rowKey: 'id',
              'aria-label': 'Workloads'
            },
            { toolbar: () => h(CollectionPreferences, { sections: ['columns'] }) }
          )
      })
    )
    const headers = () =>
      [...view.container.querySelectorAll('[role="columnheader"]')].map((c) =>
        c.textContent?.trim()
      )
    await fireEvent.click(view.getByTestId('data-collection-preferences__trigger'))
    const columns = await within(document.body).findByTestId('data-collection-preferences__columns')
    const rows = within(columns).getAllByTestId('data-collection-preferences__column')
    expect(rows.map((row) => row.textContent?.includes('Name'))).toContain(true)
    expect(columns.querySelector('[data-locked]')?.textContent).toContain('Name')
    const region = rows.find((row) => row.textContent?.includes('Region')) as HTMLElement
    await userEvent.click(within(region).getByRole('switch'))
    await userEvent.click(within(document.body).getByTestId('data-collection-preferences__confirm'))
    await vi.waitFor(() => expect(headers()).toEqual(['Name', 'Status']))
  })
})

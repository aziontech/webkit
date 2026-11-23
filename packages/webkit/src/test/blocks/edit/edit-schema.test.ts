import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import type { SchemaEditorTable } from '../../../../blocks/edit/edit-schema/edit-schema.vue'
import EditSchema from '../../../../blocks/edit/edit-schema/edit-schema.vue'
import AddColumn from '../../../../blocks/edit/edit-schema/variants/add-column.vue'
import ChangeType from '../../../../blocks/edit/edit-schema/variants/change-type.vue'
import ImportCsv from '../../../../blocks/edit/edit-schema/variants/import-csv.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const drawer = () => document.querySelector('[role="dialog"]') as HTMLElement

const submitButton = (label: string) =>
  Array.from(drawer().querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label
  )!

const columnNames = () =>
  Array.from(drawer().querySelectorAll<HTMLInputElement>('input[placeholder="column_name"]'))
describe('edit/edit-schema Create Table', () => {
  it('reads a CSV into columns with guessed types and previews the rows', async () => {
    render(ImportCsv)
    await waitFor(() => expect(drawer()).not.toBeNull())
    expect(columnNames().map((input) => input.value)).toEqual([
      'id',
      'customer_id',
      'email',
      'plan',
      'active',
      'joined_at'
    ])
    expect(drawer().textContent).toContain('6 columns and 6 rows read')
    expect(drawer().querySelector('[aria-label="CSV preview"]')?.textContent).toContain(
      'kim, j@example.com'
    )
    expect(drawer().querySelector<HTMLInputElement>('input[placeholder="users"]')!.value).toBe(
      'subscribers'
    )
  })

  it('draws the columns and foreign keys with AttributeEditor and moves a column', async () => {
    render(EditSchema)
    await waitFor(() => expect(drawer()).not.toBeNull())
    expect(drawer().querySelector('[data-grip]')).toBeNull()
    const columns = drawer().querySelector('[aria-label="Columns"]')?.closest('[data-mode]')
    expect(columns).not.toBeNull()
    expect(drawer().textContent).toContain('No foreign keys.')
    await fireEvent.click(
      within(columns as HTMLElement).getByRole('button', { name: 'Move item 1 down' })
    )
    await waitFor(() =>
      expect(columnNames().map((input) => input.value)).toEqual(['created_at', 'id'])
    )
  })

  it('asks to complete a foreign key after Create', async () => {
    render(EditSchema)
    await waitFor(() => expect(drawer()).not.toBeNull())
    const add = Array.from(drawer().querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Add foreign key'
    )!
    await fireEvent.click(add)
    const create = Array.from(drawer().querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Create Table'
    )!
    await fireEvent.click(create)
    await waitFor(() =>
      expect(drawer().textContent).toContain(
        'Choose the column, the table and the column it references.'
      )
    )
  })
})

const invoices: SchemaEditorTable = {
  name: 'invoices',
  columns: [
    { name: 'id', type: 'int8', primaryKey: true, notNull: true, defaultValue: '' },
    { name: 'amount', type: 'numeric', primaryKey: false, notNull: true, defaultValue: '' }
  ],
  rowCount: 7
}

describe('edit/edit-schema data contract', () => {
  it('renders the tables it is given instead of the sample', async () => {
    const { container } = render(EditSchema, { props: { tables: [invoices], dialog: 'none' } })
    await waitFor(() => expect(container.textContent).toContain('invoices'))
    expect(container.textContent).toContain('7 rows')
    expect(container.textContent).toContain('amount')
    expect(container.textContent).not.toContain('customers')
  })

  it('shows only the type name in a column Type picker, not the type description', async () => {
    render(EditSchema, { props: { tables: [invoices] } })
    await waitFor(() => expect(drawer()).not.toBeNull())
    const trigger = drawer().querySelector<HTMLElement>('[data-testid="select-trigger"]')!
    await waitFor(() => expect(trigger.textContent).toContain('int8'))
    expect(trigger.textContent).not.toContain('Signed eight-byte integer')
  })

  it('emits create-table with the values and closes once the request ends', async () => {
    const { emitted, rerender } = render(EditSchema, { props: { tables: [invoices] } })
    await waitFor(() => expect(drawer()).not.toBeNull())
    const name = drawer().querySelector<HTMLInputElement>('input[placeholder="users"]')!
    await fireEvent.update(name, 'events')
    await fireEvent.click(submitButton('Create Table'))
    const [[event, table]] = emitted('create-table') as [
      [Event, { name: string; columns: { name: string }[] }]
    ]
    expect(event).toBeInstanceOf(Event)
    expect(table.name).toBe('events')
    expect(table.columns.map((column) => column.name)).toEqual(['id', 'created_at'])
    await rerender({ loading: true })
    await rerender({ loading: false })
    await waitFor(() => expect(document.body.textContent).toContain('Table events created.'))
  })

  it('shows a refused Create Table on the Name field and keeps the drawer', async () => {
    render(EditSchema, {
      props: { defaultDraft: { name: 'invoices' }, error: 'A table named invoices already exists.' }
    })
    await waitFor(() => expect(drawer()).not.toBeNull())
    expect(drawer().textContent).toContain('A table named invoices already exists.')
    expect(drawer().textContent).toContain("The table wasn't created.")
  })

  it('emits add-column and adds the column only after the request succeeds', async () => {
    const { emitted, rerender, container } = render(EditSchema, {
      props: { tables: [invoices], dialog: 'column', defaultColumn: { name: 'phone' } }
    })
    await waitFor(() => expect(drawer()).not.toBeNull())
    await fireEvent.click(submitButton('Add column'))
    const [[event, payload]] = emitted('add-column') as [
      [Event, { table: SchemaEditorTable; column: { name: string; type: string } }]
    ]
    expect(event).toBeInstanceOf(Event)
    expect(payload.table.name).toBe('invoices')
    expect(payload.column).toMatchObject({ name: 'phone', type: 'text' })
    expect(container.textContent).not.toContain('phone')
    await rerender({ loading: true })
    await rerender({ loading: false })
    await waitFor(() =>
      expect(document.body.textContent).toContain('Column phone added to invoices.')
    )
    expect(container.textContent).toContain('phone')
  })

  it('keeps the drawer and raises Retry when the change fails', async () => {
    const { emitted, rerender } = render(EditSchema, {
      props: { tables: [invoices], dialog: 'column', defaultColumn: { name: 'phone' } }
    })
    await waitFor(() => expect(drawer()).not.toBeNull())
    await fireEvent.click(submitButton('Add column'))
    await rerender({ loading: true })
    await rerender({ loading: false, error: 'The database did not answer.' })
    await waitFor(() => expect(document.body.textContent).toContain("The column wasn't added."))
    expect(drawer()).not.toBeNull()
    const retry = Array.from(document.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Retry'
    )!
    await fireEvent.click(retry)
    expect(emitted('add-column')).toHaveLength(2)
  })
})

describe('edit/edit-schema Type picker', () => {
  const typeTrigger = () =>
    Array.from(drawer().querySelectorAll<HTMLElement>('[data-testid="select-trigger"]')).find(
      (trigger) => trigger.textContent?.includes('varchar') || trigger.textContent?.includes('text')
    )!

  it('shows only the type name in the Add column and Change type triggers', async () => {
    const { unmount } = render(AddColumn)
    await waitFor(() => expect(typeTrigger().textContent).toContain('varchar'))
    expect(typeTrigger().textContent).not.toContain('Variable-length')
    unmount()
    render(ChangeType)
    const trigger = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(
        '[role="alertdialog"] [data-testid="select-trigger"], [role="dialog"] [data-testid="select-trigger"]'
      )
      expect(el?.textContent?.trim()).toBeTruthy()
      return el!
    })
    expect(trigger.textContent).not.toMatch(/[a-z0-9][A-Z][a-z]+/)
  })

  it('moves from the search field to the options with ArrowDown and closes on Escape', async () => {
    render(AddColumn)
    await waitFor(() => expect(typeTrigger()).toBeTruthy())
    await userEvent.click(typeTrigger())
    const search = await waitFor(() => {
      const field = document.querySelector<HTMLInputElement>('input[aria-label="Search types"]')
      expect(field).not.toBeNull()
      return field!
    })
    search.focus()
    await userEvent.keyboard('{ArrowDown}')
    await waitFor(() => expect(document.activeElement?.getAttribute('role')).toBe('option'))
    search.focus()
    await userEvent.keyboard('{Escape}')
    await waitFor(() =>
      expect(document.querySelector('input[aria-label="Search types"]')).toBeNull()
    )
    expect(drawer()).not.toBeNull()
  })
})

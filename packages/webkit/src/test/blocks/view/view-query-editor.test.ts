import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import CreateDatabase from '../../../../blocks/view/view-query-editor/variants/create-database.vue'
import ImportCsv from '../../../../blocks/view/view-query-editor/variants/import-csv.vue'
import QueryEditorQuery from '../../../../blocks/view/view-query-editor/variants/query.vue'
import TableData from '../../../../blocks/view/view-query-editor/variants/table-data.vue'
import Templates from '../../../../blocks/view/view-query-editor/variants/templates.vue'
import ViewQueryEditor, {
  type QueryEditorTable
} from '../../../../blocks/view/view-query-editor/view-query-editor.vue'
import { useToastRegion } from '../../toast-region'

useToastRegion()

const drawer = () => document.querySelector('[role="dialog"]') as HTMLElement

const trigger = (header: string) =>
  drawer().querySelector<HTMLElement>(`[aria-label="Table column for ${header}"]`)!

const button = (name: RegExp) =>
  Array.from(drawer().querySelectorAll('button')).find((item) =>
    name.test(item.textContent?.trim() ?? '')
  )!
describe('view/view-query-editor Import data from CSV', () => {
  it('maps by header name, skips the rest and lists the errors per line', async () => {
    render(ImportCsv)
    await waitFor(() => expect(drawer()).not.toBeNull())
    expect(drawer().textContent).toContain('Import data into subscribers')
    expect(trigger('Email').textContent).toContain('email')
    expect(trigger('plan_name').textContent).toContain('Skip')
    expect(drawer().textContent).toContain('4 of 7 rows are ready to insert.')
    const errors = drawer().querySelector('[aria-label="Rows with errors"]')!.textContent
    expect(errors).toContain('Line 4: active “maybe” is not true or false (bool).')
    expect(errors).toContain('Line 6: email is empty and cannot be.')
    expect(errors).toContain('Line 8: joined_at “next week” is not a date')
    expect(drawer().querySelector('[aria-label="Import preview"]')!.textContent).toContain(
      'kim, j@example.com'
    )
  })

  it('asks to map a required column on Insert, then inserts the valid rows', async () => {
    render(ImportCsv)
    await waitFor(() => expect(drawer()).not.toBeNull())
    await userEvent.click(button(/^Insert 4 rows$/))
    await waitFor(() => expect(drawer().textContent).toContain('Map a CSV column to plan'))

    await userEvent.click(trigger('plan_name'))
    const option = await waitFor(() => {
      const found = Array.from(document.querySelectorAll('[role="option"]')).find((item) =>
        item.textContent?.trim().startsWith('plan')
      )
      expect(found).toBeTruthy()
      return found as HTMLElement
    })
    await userEvent.click(option)
    await waitFor(() => expect(trigger('plan_name').textContent).toContain('plan'))
    expect(drawer().textContent).not.toContain('Map a CSV column to plan')

    await userEvent.click(button(/^Insert 4 rows$/))
    await waitFor(
      () => expect(document.body.textContent).toContain('4 rows inserted into subscribers.'),
      {
        timeout: 3000
      }
    )
    expect(document.body.textContent).toContain('3 rows with errors were skipped.')
    const rows = document.querySelector('[aria-label="Rows of subscribers"]')!
    expect(rows.textContent).toContain('jane.doe@example.com')
    expect(rows.textContent).not.toContain('ops@example.com')
  })
  it('opens the templates drawer without focusing its search, so a phone keeps its keyboard down', async () => {
    render(Templates)
    const drawer = await waitFor(() => document.querySelector<HTMLElement>('[role="dialog"]')!)
    await waitFor(() => expect(drawer.contains(document.activeElement)).toBe(true))
    expect(document.activeElement?.getAttribute('aria-label')).not.toBe('Search templates')
    expect(document.activeElement?.tagName).not.toBe('INPUT')
  })

  it('focuses Filter rows on / with nothing focused', async () => {
    const view = render(TableData)
    const field = await waitFor(() => view.getByRole('textbox', { name: 'Filter rows' }))
    ;(document.activeElement as HTMLElement | null)?.blur()
    await fireEvent.keyDown(document.body, { key: '/' })
    await waitFor(() => expect(document.activeElement).toBe(field))
    expect(field.getAttribute('aria-keyshortcuts')).toBe('/')
  })
})

const closeImport = async () => {
  await userEvent.click(button(/^Cancel$/))
  await waitFor(() => expect(document.querySelector('[role="dialog"]')).toBeNull())
}

describe('view/view-query-editor ImportCsv state wraps the block', () => {
  it('asks before the row trash deletes an imported row', async () => {
    const view = render(ImportCsv)
    await waitFor(() => expect(drawer()).not.toBeNull())
    await closeImport()
    const customers = Array.from(
      view.container.querySelectorAll<HTMLElement>('[data-slot="item"][aria-pressed]')
    ).find((item) => item.textContent?.trim() === 'customers')!
    await fireEvent.click(customers)
    await userEvent.click(view.getByRole('button', { name: 'Delete row 1' }))
    const dialog = await waitFor(() => {
      const found = document.querySelector('[role="alertdialog"]') as HTMLElement
      expect(found?.textContent).toContain('Delete row')
      return found
    })
    expect(view.container.textContent).toContain('jane.doe@example.com')
    expect(dialog.textContent).toContain('customers')
  })

  it('asks for the table name when Delete table is chosen', async () => {
    const view = render(ImportCsv)
    await waitFor(() => expect(drawer()).not.toBeNull())
    await closeImport()
    await fireEvent.click(view.container.querySelector('[aria-label="Actions for orders"]')!)
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Delete table' })))
    await waitFor(() =>
      expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain(
        'Type orders to confirm.'
      )
    )
  })
})

describe('view/view-query-editor empty table drop', () => {
  it('emits import-csv with the drop event when a file lands on the empty state', async () => {
    const empty: QueryEditorTable = {
      id: 'tbl-empty',
      name: 'empty_table',
      columns: [{ id: 'c-1', name: 'id', type: 'int8', primaryKey: true, notNull: true }],
      rows: []
    }
    const view = render(ViewQueryEditor, { props: { tables: [empty] } })
    const target = await waitFor(() => {
      const found = view.container.querySelector('[data-testid="empty-state"]')
      expect(found?.textContent).toContain('This table is empty')
      return found as HTMLElement
    })
    await fireEvent.drop(target)
    const [[event, table]] = view.emitted('import-csv') as [[Event, QueryEditorTable]]
    expect(event.type).toBe('drop')
    expect(table.id).toBe('tbl-empty')
  })
})

describe('view/view-query-editor block', () => {
  it('marks the open table as pressed and NULL cells with data-null', () => {
    const view = render(ViewQueryEditor)
    const options = Array.from(
      view.container.querySelectorAll<HTMLElement>('[data-slot="item"][aria-pressed]')
    ).map((item) => [item.textContent?.trim(), item.getAttribute('aria-pressed')])
    expect(options).toEqual([
      ['customers', 'true'],
      ['orders', 'false'],
      expect.arrayContaining(['false'])
    ])
    expect(view.container.querySelector('[data-null]')?.textContent?.trim()).toBe('NULL')
    expect(view.container.querySelector('[aria-label="Actions for customers"]')).not.toBeNull()
  })

  it('pages the result rows, announces them and drops the dead Insert from Results', async () => {
    const view = render(QueryEditorQuery)
    await waitFor(() =>
      expect(
        view.getAllByRole('status').some((el) => el.textContent?.trim() === '3 rows returned.')
      ).toBe(true)
    )
    expect(view.queryByRole('button', { name: 'Insert' })).toBeNull()
    expect(view.queryByRole('navigation', { name: 'Results pagination' })).toBeNull()
  })
})

describe('view/view-query-editor data contract', () => {
  const ledger: QueryEditorTable = {
    id: 'tbl-ledger',
    name: 'ledger',
    columns: [
      { id: 'c-1', name: 'id', type: 'int8', primaryKey: true, notNull: true },
      { id: 'c-2', name: 'memo', type: 'text', primaryKey: false, notNull: false }
    ],
    rows: [
      { __k: 'l-1', id: 7, memo: 'Acme invoice' },
      { __k: 'l-2', id: 8, memo: 'Refund' }
    ]
  }

  it('renders the tables it is given instead of the sample', () => {
    const view = render(ViewQueryEditor, { props: { tables: [ledger] } })
    expect(view.container.querySelector('[aria-label="Actions for ledger"]')).not.toBeNull()
    expect(view.container.querySelector('[aria-label="Actions for customers"]')).toBeNull()
    expect(view.container.textContent).toContain('Acme invoice')
  })

  it('shows the empty database for an empty list and never the sample while loading', () => {
    const empty = render(ViewQueryEditor, { props: { tables: [] } })
    expect(empty.container.textContent).toContain('No tables yet')
    empty.unmount()
    const loading = render(ViewQueryEditor, { props: { loading: true } })
    expect(loading.container.textContent).not.toContain('customers')
    expect(loading.container.querySelector('[aria-label="Loading tables"]')).not.toBeNull()
  })

  it('asks before it deletes a row, then emits delete-rows and drops it from the table', async () => {
    const view = render(ViewQueryEditor, { props: { tables: [ledger] } })
    await userEvent.click(view.getByRole('button', { name: 'Delete row 7' }))
    const confirm = await waitFor(() => {
      const dialog = document.querySelector('[role="alertdialog"]') as HTMLElement
      expect(dialog?.textContent).toContain('Delete row')
      return Array.from(dialog.querySelectorAll('button')).find(
        (item) => item.textContent?.trim() === 'Delete row'
      )!
    })
    expect(view.emitted('delete-rows')).toBeUndefined()
    expect(view.container.textContent).toContain('Acme invoice')
    await userEvent.click(confirm)
    const [[event, payload]] = view.emitted('delete-rows') as [
      [Event, { table: QueryEditorTable; rows: QueryEditorTable['rows'] }]
    ]
    expect(event).toBeInstanceOf(Event)
    expect(payload.table.id).toBe('tbl-ledger')
    expect(payload.rows.map((row) => row.__k)).toEqual(['l-1'])
    await waitFor(() => expect(view.container.textContent).not.toContain('Acme invoice'))
    expect(ledger.rows).toHaveLength(2)
  })

  it('keeps Sort in place and puts the bulk delete in a selection bar', async () => {
    const view = render(ViewQueryEditor, { props: { tables: [ledger] } })
    const sort = view.getByRole('button', { name: 'Sort' })
    await userEvent.click(view.getAllByRole('checkbox')[1]!)
    expect(view.getByRole('button', { name: 'Sort' })).toBe(sort)
    await userEvent.click(view.getByRole('button', { name: 'Delete 1 row' }))
    await waitFor(() =>
      expect(document.querySelector('[role="alertdialog"]')?.textContent).toContain('Delete row')
    )
    expect(view.emitted('delete-rows')).toBeUndefined()
  })

  it('asks for the table name before it emits delete-table', async () => {
    const view = render(ViewQueryEditor, { props: { tables: [ledger] } })
    await fireEvent.click(view.getByRole('button', { name: 'Actions for ledger' }))
    await fireEvent.click(await waitFor(() => view.getByRole('menuitem', { name: 'Delete table' })))
    const dialog = await waitFor(() => {
      const found = document.querySelector('[role="alertdialog"]') as HTMLElement
      expect(found?.textContent).toContain('Type ledger to confirm.')
      return found
    })
    const confirm = Array.from(dialog.querySelectorAll('button')).find(
      (item) => item.textContent?.trim() === 'Delete table'
    )!
    expect(confirm.disabled).toBe(true)
    await userEvent.fill(dialog.querySelector('input')!, 'ledger')
    await userEvent.click(confirm)
    const [[, table]] = view.emitted('delete-table') as [[Event, QueryEditorTable]]
    expect(table.id).toBe('tbl-ledger')
  })

  it('emits run with the statement and shows the result it is given', async () => {
    const view = render(ViewQueryEditor, {
      props: {
        tab: 'editor',
        sql: 'SELECT 1;',
        result: { type: 'message', text: 'Statement executed.' }
      }
    })
    expect(view.container.textContent).toContain('Statement executed.')
    await userEvent.click(view.getByRole('button', { name: 'Run query' }))
    const [[event, sql]] = view.emitted('run') as [[Event, string]]
    expect(event).toBeInstanceOf(Event)
    expect(sql).toBe('SELECT 1;')
  })

  it('shows the error with Retry and emits retry', async () => {
    const view = render(ViewQueryEditor, {
      props: { tables: [ledger], error: "Couldn't load the rows of ledger." }
    })
    expect(view.container.textContent).toContain("Couldn't load the rows of ledger.")
    await userEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })
})

const apple = /mac/i.test(navigator.platform || navigator.userAgent)
const pressShortcut = (key: string, target: Element = document.body) => {
  const event = new KeyboardEvent('keydown', {
    key,
    metaKey: apple,
    ctrlKey: !apple,
    bubbles: true,
    cancelable: true
  })
  target.dispatchEvent(event)
  return event
}

describe('view/view-query-editor keyboard', () => {
  it('runs the query on Command Enter from the SQL editor', async () => {
    const view = render(ViewQueryEditor, { props: { tab: 'editor', sql: 'SELECT 1;' } })
    const run = view.getByRole('button', { name: 'Run query' })
    expect(run.getAttribute('aria-keyshortcuts')).toBe('Meta+Enter Control+Enter')
    const editor = view.getByRole('textbox', { name: 'SQL editor' })
    editor.focus()
    const event = pressShortcut('Enter', editor)
    expect(event.defaultPrevented).toBe(true)
    const [[payload, sql]] = view.emitted('run') as [[Event, string]]
    expect(payload).toBe(event)
    expect(sql).toBe('SELECT 1;')
  })

  it('does not run on Command Enter while a query is in flight', () => {
    const view = render(ViewQueryEditor, {
      props: { tab: 'editor', sql: 'SELECT 1;', running: true }
    })
    pressShortcut('Enter')
    expect(view.emitted('run')).toBeUndefined()
  })

  it('submits Create Database on Command Enter', async () => {
    const view = render(CreateDatabase)
    const name = view.getByRole('textbox', { name: 'Name' })
    expect(
      view.getByRole('button', { name: 'Create Database' }).getAttribute('aria-keyshortcuts')
    ).toBe('Meta+Enter Control+Enter')
    pressShortcut('Enter', name)
    await waitFor(() => expect(view.getByText('This field is required.')).toBeTruthy())
  })
})

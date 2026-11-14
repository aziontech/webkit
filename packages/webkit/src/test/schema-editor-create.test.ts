import { fireEvent, render, waitFor, within } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import SchemaEditor from '../../blocks/platform/edit/schema-editor/schema-editor.vue'
import ImportCsv from '../../blocks/platform/edit/schema-editor/variants/import-csv.vue'
import { useToastRegion } from './toast-region'

useToastRegion()

const drawer = () => document.querySelector('[role="dialog"]') as HTMLElement
const columnNames = () =>
  Array.from(drawer().querySelectorAll<HTMLInputElement>('input[placeholder="column_name"]'))

describe('platform/edit/schema-editor Create Table', () => {
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
    render(SchemaEditor)
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
    render(SchemaEditor)
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

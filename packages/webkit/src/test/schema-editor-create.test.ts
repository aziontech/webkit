import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import SchemaEditor from '../../blocks/platform/edit/schema-editor/schema-editor.vue'
import ImportCsv from '../../blocks/platform/edit/schema-editor/variants/import-csv.vue'

const drawer = () => document.querySelector('[role="dialog"]') as HTMLElement
const columnNames = () =>
  Array.from(drawer().querySelectorAll<HTMLInputElement>('[data-column-key] input')).filter(
    (input) => input.getAttribute('aria-label')?.startsWith('Name of column')
  )

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

  it('drags a column row onto another and announces it', async () => {
    render(SchemaEditor)
    await waitFor(() => expect(drawer()).not.toBeNull())
    const grips = Array.from(drawer().querySelectorAll<HTMLElement>('[data-grip]'))
    const target = drawer().querySelectorAll<HTMLElement>('[data-column-key]')[1]
    const box = target.getBoundingClientRect()
    await fireEvent.pointerDown(grips[0], { button: 0, pointerId: 1 })
    await fireEvent.pointerMove(grips[0], {
      pointerId: 1,
      clientX: box.left + 4,
      clientY: box.top + box.height / 2
    })
    expect(target.getAttribute('data-drop')).toBe('after')
    await fireEvent.pointerUp(grips[0], { pointerId: 1 })
    await waitFor(() =>
      expect(columnNames().map((input) => input.value)).toEqual(['created_at', 'id'])
    )
    expect(drawer().textContent).toContain('Dropped id to position 2 of 2.')
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

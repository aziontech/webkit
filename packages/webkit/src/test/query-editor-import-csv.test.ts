import { render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

import ImportCsv from '../../blocks/platform/view/query-editor/variants/import-csv.vue'

const drawer = () => document.querySelector('[role="dialog"]') as HTMLElement
const trigger = (header: string) =>
  drawer().querySelector<HTMLElement>(`[aria-label="Table column for ${header}"]`)!
const button = (name: RegExp) =>
  Array.from(drawer().querySelectorAll('button')).find((item) =>
    name.test(item.textContent?.trim() ?? '')
  )!

describe('platform/view/query-editor Import data from CSV', () => {
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
    expect(rows.textContent).toContain('ada@example.com')
    expect(rows.textContent).not.toContain('ops@example.com')
  })
})

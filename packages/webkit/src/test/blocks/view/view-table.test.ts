import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'

import TableViewEmpty from '../../../../blocks/view/view-table/variants/empty.vue'
import TableViewFailed from '../../../../blocks/view/view-table/variants/error.vue'
import TableViewLoading from '../../../../blocks/view/view-table/variants/loading.vue'
import ViewTable from '../../../../blocks/view/view-table/view-table.vue'

const resourceNames = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('[role=row] a'))
    .map((a) => a.textContent?.trim() ?? '')
    .filter((text) => /^resource-\d+$/.test(text))
describe('view/view-table block', () => {
  it('sorts Last modified on the timestamp, not on a relative string', async () => {
    const view = render(ViewTable)
    const head = Array.from(view.container.querySelectorAll('[role=columnheader]')).find((th) =>
      th.textContent?.includes('Last modified')
    )
    await fireEvent.click(head!.querySelector('button')!)
    await waitFor(() =>
      expect(['resource-01', 'resource-10']).toContain(
        resourceNames(view.container as HTMLElement)[0]
      )
    )
    const first = resourceNames(view.container as HTMLElement)[0]
    const expected = Array.from(
      { length: 10 },
      (_, i) => `resource-${String(i + 1).padStart(2, '0')}`
    )
    expect(resourceNames(view.container as HTMLElement)).toEqual(
      first === 'resource-01' ? expected : [...expected].reverse()
    )
  })

  it('shows the skeleton table with the filter disabled while loading', () => {
    const view = render(TableViewLoading)
    expect(view.container.querySelector('[aria-busy="true"]')).not.toBeNull()
    expect(view.getByRole('button', { name: 'Download CSV' }).hasAttribute('disabled')).toBe(true)
  })

  it('replaces the table with a danger alert whose Retry emits retry', async () => {
    const failed = render(TableViewFailed)
    expect(failed.container.textContent).toContain("Couldn't load the resources.")
    expect(failed.container.querySelector('[role=table], [role=grid], table')).toBeNull()
    failed.unmount()
    const view = render(ViewTable, { props: { error: 'The API answered 503.' } })
    expect(view.container.textContent).toContain('The API answered 503.')
    expect(view.container.textContent).not.toContain('resource-01')
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted<unknown[]>('retry')).toHaveLength(1)
  })

  it('renders the rows it is given instead of the sample, and the empty card for none', async () => {
    const view = render(ViewTable, {
      props: {
        resources: [
          {
            id: '7',
            name: 'acme-store',
            domain: 'store.example.com',
            domains: ['store.example.com'],
            status: 'Live',
            owner: 'Jane Doe',
            modifiedAt: new Date(Date.UTC(2026, 10, 1))
          }
        ]
      }
    })
    await waitFor(() => expect(view.container.textContent).toContain('acme-store'))
    expect(resourceNames(view.container as HTMLElement)).toEqual([])
    view.unmount()
    const empty = render(TableViewEmpty)
    expect(empty.container.textContent).toContain('No resources yet')
    await fireEvent.click(empty.getAllByRole('button', { name: 'Create Resource' })[0])
  })

  it('emits create, refresh and the row actions instead of faking them', async () => {
    const view = render(ViewTable)
    await fireEvent.click(view.getByRole('button', { name: 'Create Resource' }))
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted<unknown[]>('create')).toHaveLength(1)
    expect(view.emitted<unknown[]>('refresh')).toHaveLength(1)
    expect(view.container.querySelector('[aria-busy="true"]')).toBeNull()
  })

  describe('keyboard', () => {
    const bodyRows = () =>
      Array.from(document.body.querySelectorAll<HTMLElement>('[data-focus-row]'))
    const key = (target: Element, init: ConstructorParameters<typeof KeyboardEvent>[1]) =>
      target.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, cancelable: true, ...init })
      )

    it('asks before deleting the focused row on Delete and then focuses the next row', async () => {
      const view = render(ViewTable)
      await waitFor(() => expect(bodyRows().length).toBeGreaterThan(2))
      const doomed = bodyRows()[1]!
      const doomedName = doomed.querySelector('a')!.textContent!.trim()
      const nextName = bodyRows()[2]!.querySelector('a')!.textContent!.trim()
      doomed.focus()
      key(doomed, { key: 'Delete' })
      const dialog = await waitFor(() => {
        const el = document.body.querySelector<HTMLElement>('[role=alertdialog]')
        expect(el).not.toBeNull()
        return el!
      })
      expect(dialog.textContent).toContain(doomedName)
      const phrase = dialog.querySelector<HTMLInputElement>('input')!
      await fireEvent.update(phrase, doomedName)
      const confirm = Array.from(dialog.querySelectorAll('button')).find(
        (button) => button.textContent?.trim() === 'Delete resource'
      )!
      await waitFor(() => expect(confirm.hasAttribute('disabled')).toBe(false))
      await fireEvent.click(confirm)
      await waitFor(() => expect(document.body.querySelector('[role=alertdialog]')).toBeNull())
      await waitFor(() => {
        expect(document.activeElement?.hasAttribute('data-focus-row')).toBe(true)
        expect(document.activeElement?.textContent).toContain(nextName)
      })
      expect(view.emitted<unknown[]>('delete')).toHaveLength(1)
    })

    it('opens the focused row on Enter as View details does', async () => {
      const view = render(ViewTable)
      await waitFor(() => expect(bodyRows().length).toBeGreaterThan(0))
      const row = bodyRows()[0]!
      row.focus()
      key(row, { key: 'Enter' })
      const emitted = view.emitted<[Event, { value: string }]>('row-action')
      expect(emitted).toHaveLength(1)
      expect(emitted[0]![0]).toBeInstanceOf(KeyboardEvent)
      expect(emitted[0]![1].value).toBe('view')
    })

    it('focuses the filter on / and types / while in it', async () => {
      const view = render(ViewTable)
      await nextTick()
      const field = view.getByRole('combobox', { name: 'Filter resources' })
      key(document.body, { key: '/' })
      await waitFor(() => expect(document.activeElement).toBe(field))
      const event = new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true })
      field.dispatchEvent(event)
      expect(event.defaultPrevented).toBe(false)
      expect(document.activeElement).toBe(field)
    })
  })
})

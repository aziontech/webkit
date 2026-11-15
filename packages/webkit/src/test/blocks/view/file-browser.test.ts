import { fireEvent, render, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import FileBrowser from '../../../../blocks/view/file-browser/file-browser.vue'
import InsideAFolder from '../../../../blocks/view/file-browser/variants/inside-a-folder.vue'

const firstCells = (root: HTMLElement) =>
  Array.from(root.querySelectorAll('[role=row]'))
    .map((row) => row.querySelector('[role=rowheader], [role=cell]')?.textContent?.trim() ?? '')
    .filter(Boolean)
describe('view/file-browser block', () => {
  it('sorts Size on bytes and keeps the parent row and the folders first', async () => {
    const view = render(InsideAFolder)
    const head = Array.from(view.container.querySelectorAll('[role=columnheader]')).find((th) =>
      th.textContent?.includes('Size')
    )
    await fireEvent.click(head!.querySelector('button')!)
    await waitFor(() => expect(firstCells(view.container)[0]).toBe('..'))
    const cells = firstCells(view.container)
    expect(cells.slice(1, 5)).toEqual(['assets/', 'css/', 'images/', 'js/'])
    const files = cells.slice(5)
    const ascending = ['project.json', 'favicon.svg', 'index.html', '404.html']
    expect([files.slice(0, 4), files.slice(-4).reverse()]).toContainEqual(ascending)
  })

  it('opens a folder from its name button and goes back up from the parent row', async () => {
    const view = render(FileBrowser)
    await fireEvent.click(view.getByRole('button', { name: 'logs/' }))
    await waitFor(() => expect(firstCells(view.container)).toContain('access.log'))
    await fireEvent.click(view.getByRole('button', { name: 'Go up to the parent folder' }))
    await waitFor(() => expect(firstCells(view.container)).toContain('robots.txt'))
  })

  it('tells a search miss apart from an empty folder and clears it', async () => {
    const view = render(FileBrowser)
    const search = view.getByPlaceholderText('Search in folder')
    await fireEvent.update(search, 'kubernetes')
    await waitFor(() => expect(view.getByText('No matching files')).toBeTruthy())
    expect(view.queryByText('This folder is empty')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(firstCells(view.container)).toContain('robots.txt'))
  })
})

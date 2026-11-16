import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { describe, expect, it } from 'vitest'

import {
  type AzionStorageObjectsResponse,
  toFileBrowserEntries
} from '../../../../blocks/view/file-browser/azion-storage'
import FileBrowser from '../../../../blocks/view/file-browser/file-browser.vue'
import InsideAFolder from '../../../../blocks/view/file-browser/variants/inside-a-folder.vue'

const firstCells = (root: Element) =>
  Array.from(root.querySelectorAll('[role=row]'))
    .map((row) => row.querySelector('[role=rowheader], [role=cell]')?.textContent?.trim() ?? '')
    .filter(Boolean)

const fixture: AzionStorageObjectsResponse = {
  continuation_token: null,
  results: [
    { key: 'robots.txt', last_modified: '2026-10-01T08:00:00Z', size: 64 },
    { key: 'site/', last_modified: '2026-10-02T08:00:00Z', size: 0, is_folder: true },
    { key: 'site/index.html', last_modified: '2026-10-03T09:30:00Z', size: 6175 },
    { key: 'site/about.html', last_modified: '2026-10-04T10:15:00Z', size: 18_176 },
    { key: 'site/css/main.css', last_modified: '2026-10-05T11:00:00Z', size: 52_100 },
    { key: 'site/css/print.css', last_modified: '2026-10-05T11:00:00Z', size: 2_048 },
    { key: 'site/images', last_modified: '2026-10-06T12:00:00Z', size: 0, is_folder: true },
    { key: 'site/images/logo.svg', last_modified: '2026-10-06T12:05:00Z', size: 1_280 }
  ]
}

describe('view/file-browser azion-storage adapter', () => {
  it('keeps only the immediate children of the prefix', () => {
    const entries = toFileBrowserEntries(fixture, 'site/')
    expect(entries.map((entry) => entry.name).sort()).toEqual([
      'about.html',
      'css/',
      'images/',
      'index.html'
    ])
  })

  it('detects folders from is_folder and from a slash deeper in the key', () => {
    const root = toFileBrowserEntries(fixture)
    expect(root).toContainEqual({ name: 'site/', kind: 'folder' })
    expect(root.filter((entry) => entry.kind === 'folder')).toHaveLength(1)
    const site = toFileBrowserEntries(fixture.results, 'site/')
    expect(site.filter((entry) => entry.kind === 'folder').map((entry) => entry.name)).toEqual([
      'css/',
      'images/'
    ])
  })

  it('carries the bytes and the last modified time of each file', () => {
    const [about] = toFileBrowserEntries(fixture, 'site/').filter(
      (entry) => entry.name === 'about.html'
    )
    expect(about).toEqual({
      name: 'about.html',
      kind: 'file',
      bytes: 18_176,
      modifiedAt: '2026-10-04T10:15:00Z'
    })
    expect(toFileBrowserEntries(fixture, 'site/css/')).toEqual([
      { name: 'main.css', kind: 'file', bytes: 52_100, modifiedAt: '2026-10-05T11:00:00Z' },
      { name: 'print.css', kind: 'file', bytes: 2_048, modifiedAt: '2026-10-05T11:00:00Z' }
    ])
  })
})

describe('view/file-browser block', () => {
  it('sorts Size on bytes and keeps the parent row and the folders first', async () => {
    const view = render(InsideAFolder)
    const head = Array.from(view.container.querySelectorAll('[role=columnheader]')).find((th) =>
      th.textContent?.includes('Size')
    )
    await fireEvent.click(head!.querySelector('button')!)
    await waitFor(() => expect(firstCells(view.container as HTMLElement)[0]).toBe('..'))
    const cells = firstCells(view.container as HTMLElement)
    expect(cells.slice(1, 5)).toEqual(['assets/', 'css/', 'images/', 'js/'])
    const files = cells.slice(5)
    const ascending = ['project.json', 'favicon.svg', 'index.html', '404.html']
    expect([files.slice(0, 4), files.slice(-4).reverse()]).toContainEqual(ascending)
  })

  it('opens a folder from its name button and goes back up from the parent row', async () => {
    const view = render(FileBrowser)
    await fireEvent.click(view.getByRole('button', { name: 'logs/' }))
    await waitFor(() => expect(firstCells(view.container as HTMLElement)).toContain('access.log'))
    await fireEvent.click(view.getByRole('button', { name: 'Go up to the parent folder' }))
    await waitFor(() => expect(firstCells(view.container as HTMLElement)).toContain('robots.txt'))
  })

  it('tells a search miss apart from an empty folder and clears it', async () => {
    const view = render(FileBrowser)
    const search = view.getByPlaceholderText('Search in folder')
    await fireEvent.update(search, 'kubernetes')
    await waitFor(() => expect(view.getByText('No matching files')).toBeTruthy())
    expect(view.queryByText('This folder is empty')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Clear search' }))
    await waitFor(() => expect(firstCells(view.container as HTMLElement)).toContain('robots.txt'))
  })

  it('renders the entries an Azion listing gives it instead of the sample', async () => {
    const view = render(FileBrowser, {
      props: {
        storageName: 'acme-site',
        path: 'site/',
        entries: toFileBrowserEntries(fixture, 'site/')
      }
    })
    expect(view.getByRole('heading', { level: 1 }).textContent?.trim()).toBe('acme-site')
    await waitFor(() =>
      expect(firstCells(view.container)).toEqual([
        '..',
        'css/',
        'images/',
        'about.html',
        'index.html'
      ])
    )
    expect(view.getByText('17.75 KB')).toBeTruthy()
    expect(view.queryByText('robots.txt')).toBeNull()
    expect(view.queryByText('favicon.svg')).toBeNull()
  })

  it('opens a folder by updating the path the parent owns and emitting open', async () => {
    const entries = toFileBrowserEntries(fixture, 'site/')
    const view = render(FileBrowser, { props: { path: 'site/', entries } })
    await fireEvent.click(view.getByRole('button', { name: 'css/' }))
    expect(view.emitted('update:path')?.at(-1)).toEqual(['site/css/'])
    const [event, entry] = view.emitted('open')!.at(-1) as [Event, unknown]
    expect(event).toBeInstanceOf(Event)
    expect(entry).toEqual({ name: 'css/', kind: 'folder' })
  })

  it('shows the empty folder state for an empty listing and emits refresh', async () => {
    const view = render(FileBrowser, { props: { storageName: 'acme-site', entries: [] } })
    await waitFor(() => expect(view.getByText('This folder is empty')).toBeTruthy())
    expect(view.queryByText('robots.txt')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Refresh' }))
    expect(view.emitted('refresh')).toHaveLength(1)
  })

  it('shows the error message with Retry in place of the table', async () => {
    const view = render(FileBrowser, {
      props: { error: "Couldn't load the files in this folder. Check your connection and retry." }
    })
    expect(view.getByText(/Couldn't load the files in this folder/)).toBeTruthy()
    expect(view.container.querySelector('[role=row]')).toBeNull()
    await fireEvent.click(view.getByRole('button', { name: 'Retry' }))
    expect(view.emitted('retry')).toHaveLength(1)
  })

  it('emits move with the selected files and the destination from the Move dialog', async () => {
    const view = render(FileBrowser, {
      props: {
        path: '20260622162046/',
        selectedKeys: ['index.html', '404.html'],
        movable: true,
        defaultMoveOpen: true
      }
    })
    await fireEvent.click(await screen.findByRole('button', { name: 'Move 2 files' }))
    const [event, payload] = view.emitted('move')!.at(-1) as [
      Event,
      { entries: { name: string }[]; destination: string }
    ]
    expect(event).toBeInstanceOf(Event)
    expect(payload.destination).toBe('')
    expect(payload.entries.map((entry) => entry.name)).toEqual(['index.html', '404.html'])
  })
})

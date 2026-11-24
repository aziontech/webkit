import type { TableColumn } from '@aziontech/webkit/data-table'

import type { FileBrowserEntry, FileBrowserEntryKind } from '../view-file-browser.vue'

/** What a row of the listing is: an entry, or the parent folder link. */
export type FileRowKind = FileBrowserEntryKind | 'parent'

/** One row of the listing table. */
export interface FileRow {
  /** The name shown; a folder ends in a slash, the parent link is two dots. */
  name: string
  /** The row key. */
  id: string
  /** Entry or parent link. */
  kind: FileRowKind
  /** The file glyph. */
  icon?: string
  /** The size as shown. */
  size: string
  /** The size in bytes, for sorting. */
  bytes: number
  /** When the file changed last. */
  modifiedAt?: string
  /** Who changed the file last. */
  author?: string
  /** The entry the row shows. */
  entry?: FileBrowserEntry
}

const GLYPHS: Record<string, string> = {
  svg: 'az az-image',
  webp: 'az az-image',
  png: 'az az-image',
  mp4: 'az az-video',
  html: 'az az-code',
  js: 'az az-code',
  css: 'az az-code',
  json: 'az az-database',
  woff2: 'az az-star',
  log: 'az az-align-left',
  txt: 'az az-file'
}

export const fileColumns: TableColumn[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    sortable: true,
    principal: true,
    hideable: false,
    grow: 3
  },
  { accessorKey: 'bytes', header: 'Size', sortable: true, minWidth: 80 },
  { accessorKey: 'modifiedAt', header: 'Last modified', sortable: true, minWidth: 80 },
  { id: 'actions', type: 'action', hideable: false }
]

export const addToFilesActions = [
  { label: 'Upload file', value: 'upload', icon: 'az az-upload' },
  { label: 'Upload folder', value: 'upload-folder', icon: 'az az-folder-open' },
  { label: 'Add folder', value: 'folder', icon: 'az az-folder-plus' }
]

export const UPLOAD_LIMIT = 300 * 1024 * 1024

type FormatSize = (bytes: number) => string

const extensionOf = (name: string) => name.split('.').pop()?.toLowerCase() ?? ''

const folderName = (name: string) => (name.endsWith('/') ? name : `${name}/`)

const fileRow = (name: string, formatSize: FormatSize, entry?: FileBrowserEntry): FileRow => {
  const bytes = entry?.bytes ?? 0
  return {
    name,
    id: name,
    kind: 'file',
    icon: GLYPHS[extensionOf(name)] ?? 'az az-file',
    size: formatSize(bytes),
    bytes,
    modifiedAt: entry?.modifiedAt,
    author: entry?.editor,
    entry
  }
}

const toRow = (
  kind: FileRowKind,
  name: string,
  formatSize: FormatSize,
  entry?: FileBrowserEntry
): FileRow => {
  if (kind === 'file') return fileRow(name, formatSize, entry)
  return {
    name,
    id: name,
    kind,
    icon: undefined,
    size: '-',
    bytes: 0,
    modifiedAt: undefined,
    author: undefined,
    entry
  }
}

export const listRows = (
  entries: FileBrowserEntry[],
  nested: boolean,
  formatSize: FormatSize
): FileRow[] => {
  const ofKind = (kind: FileBrowserEntryKind) =>
    entries
      .filter((entry) => entry.kind === kind)
      .map((entry) =>
        toRow(kind, kind === 'folder' ? folderName(entry.name) : entry.name, formatSize, entry)
      )
      .sort((a, b) => a.name.localeCompare(b.name))
  const list: FileRow[] = [...ofKind('folder'), ...ofKind('file')]
  if (nested && list.length) list.unshift(toRow('parent', '..', formatSize))
  return list
}

const compareFiles = (id: string) => (a: FileRow, b: FileRow) => {
  if (id === 'bytes') return a.bytes - b.bytes
  if (id === 'modifiedAt') return Date.parse(a.modifiedAt ?? '') - Date.parse(b.modifiedAt ?? '')
  return a.name.localeCompare(b.name)
}

export const sortRows = (rows: FileRow[], sort?: { desc: boolean; id: string }): FileRow[] => {
  if (!sort) return rows
  const direction = sort.desc ? -1 : 1
  const ordered = (kind: FileRowKind, id: string) =>
    rows.filter((item) => item.kind === kind).sort((a, b) => direction * compareFiles(id)(a, b))
  return [
    ...rows.filter((item) => item.kind === 'parent'),
    ...ordered('folder', sort.id === 'name' ? 'name' : ''),
    ...ordered('file', sort.id)
  ]
}

export const normalizeDestination = (raw: string) => {
  const target = raw.trim().replace(/\/+/g, '/').replace(/^\//, '')
  return target && !target.endsWith('/') ? `${target}/` : target
}

export const destinationProblem = (raw: string, path: string) => {
  const target = normalizeDestination(raw)
  if (/[^ -~]/.test(raw.trim())) return 'Use letters, numbers, dots, hyphens and slashes only.'
  if (target.split('/').includes('..'))
    return 'A destination cannot go up with "..". Type the full path.'
  if (target === path) return 'The files are already in this folder. Pick another one.'
  return ''
}

export const folderPathsIn = (entries: FileBrowserEntry[], path: string): string[] =>
  entries.filter((entry) => entry.kind === 'folder').map((entry) => path + folderName(entry.name))

export const destinationOptionsOf = (paths: string[]) => [
  { value: '/', label: '/', description: 'Storage root' },
  ...paths.map((value) => ({ value }))
]

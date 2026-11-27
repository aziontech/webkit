import type { FileBrowserEntry, FileBrowserTransfer } from './view-file-browser.vue'

const KB = 1024
const MB = 1024 * 1024
const modifiedAt = '2026-06-22T19:21:21Z'

const editors = [
  'Ethan Brooks',
  'Jordan Kim',
  'Taylor Reed',
  'John Smith',
  'Sam Lee',
  'Priya Patel',
  'Chris Taylor',
  'Riley Carter'
]

const folder = (name: string): FileBrowserEntry => ({ name, kind: 'folder' })

const files = (sizes: Record<string, number>): FileBrowserEntry[] =>
  Object.keys(sizes)
    .sort((a, b) => a.localeCompare(b))
    .map((name, index) => ({
      name,
      kind: 'file',
      bytes: Math.round(sizes[name]),
      modifiedAt,
      editor: editors[index % editors.length]
    }))

const BUILD_FOLDERS = ['assets/', 'css/', 'images/', 'js/']

const build: FileBrowserEntry[] = [
  ...BUILD_FOLDERS.map(folder),
  ...files({
    'favicon.svg': 1.25 * KB,
    '404.html': 17.75 * KB,
    'index.html': 6.03 * KB,
    'index.json': 183.1 * KB,
    'nunito-sans-bold-italic.woff2': 49.46 * KB,
    'nunito-sans-bold.woff2': 47.14 * KB,
    'nunito-sans-italic.woff2': 49.62 * KB,
    'nunito-sans-regular.woff2': 47.07 * KB,
    'project.json': 1.01 * KB
  })
]

const buildFolders = (prefix: string): Record<string, FileBrowserEntry[]> => ({
  [prefix]: build,
  ...Object.fromEntries(BUILD_FOLDERS.map((name) => [prefix + name, []]))
})

export const sampleStorageName = 'acme-assets'

export const sampleFolders: Record<string, FileBrowserEntry[]> = {
  '': [
    folder('20260622162046/'),
    folder('20260610093012/'),
    folder('logs/'),
    ...files({ 'robots.txt': 64 })
  ],
  ...buildFolders('20260622162046/'),
  ...buildFolders('20260610093012/'),
  'logs/': files({ 'access.log': 2.4 * MB, 'error.log': 128 * KB })
}

export const sampleTransfers: FileBrowserTransfer[] = [
  { id: 'u-1', name: 'index.html', size: 6175, status: 'success', target: '' },
  { id: 'u-2', name: 'app.js', size: 248_320, status: 'running', progress: 46, target: '' },
  { id: 'u-3', name: 'styles.css', size: 52_100, status: 'running', progress: 12, target: '' },
  { id: 'u-4', name: 'intro.mp4', size: 96_400_000, status: 'pending', target: '' },
  { id: 'u-5', name: 'hero.webp', size: 1_482_000, status: 'pending', target: '' }
]

import Avatar from '@aziontech/webkit/avatar'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import EmptyState from '@aziontech/webkit/empty-state'
import IconButton from '@aziontech/webkit/icon-button'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import SplitButton from '@aziontech/webkit/split-button'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import TableSearch from '@aziontech/webkit/table-search'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  COLUMNS_POPOVER,
  COLUMNS_SCRIPT,
  constLine,
  REFRESH_SCRIPT,
  useColumnsPanel,
  useListRefresh
} from './_lists-markup'

const components = {
  Avatar,
  Breadcrumb,
  Button,
  CardBox,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  EmptyState,
  IconButton,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  SplitButton,
  Switch,
  TableRoot,
  TableSearch,
  Tooltip
}

const BUCKET = 'webkit-storybook-dev'

const MODIFIED = 'Jun 22, 2026, 07:21:21 PM'

const file = (size, ext) => ({ size, ext, lastModified: MODIFIED })

const STORYBOOK_BUILD = {
  'assets/': { children: {} },
  'sb-addons/': { children: {} },
  'sb-common-assets/': { children: {} },
  'sb-manager/': { children: {} },
  'favicon.svg': file('1.25 KB', 'svg'),
  'iframe.html': file('17.75 KB', 'html'),
  'index.html': file('6.03 KB', 'html'),
  'index.json': file('183.1 KB', 'json'),
  'nunito-sans-bold-italic.woff2': file('49.46 KB', 'woff2'),
  'nunito-sans-bold.woff2': file('47.14 KB', 'woff2'),
  'nunito-sans-italic.woff2': file('49.62 KB', 'woff2'),
  'nunito-sans-regular.woff2': file('47.07 KB', 'woff2'),
  'project.json': file('1.01 KB', 'json')
}

const TREE = {
  '20260622162046/': { children: STORYBOOK_BUILD },
  '20260610093012/': { children: STORYBOOK_BUILD },
  'logs/': {
    children: {
      'access.log': file('2.4 MB', 'log'),
      'error.log': file('128 KB', 'log')
    }
  },
  'robots.txt': file('64 B', 'txt')
}

const PEOPLE = [
  'Robson Junior',
  'Isaque Böck',
  'Rafael Garbinatto',
  'Herbert Júlio',
  'Rafael Umman',
  'Marcus Grando',
  'Bruno Germano',
  'Gab Lisboa'
]

const GLYPHS = {
  svg: 'pi pi-image',
  html: 'pi pi-code',
  json: 'pi pi-database',
  woff2: 'pi pi-star',
  log: 'pi pi-align-left',
  txt: 'pi pi-file'
}

const COLUMNS = [
  {
    accessorKey: 'name',
    header: 'Name',
    enableSorting: true,
    principal: true,
    hideable: false,
    grow: 3
  },
  { accessorKey: 'size', header: 'Size', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const ADD_ACTIONS = [
  { label: 'Upload file', value: 'upload', icon: 'pi pi-upload' },
  { label: 'Add folder', value: 'folder', icon: 'pi pi-folder-plus' }
]

const relativeTime = (input) => {
  const days = Math.round((Date.now() - new Date(input).getTime()) / 86_400_000)
  if (days < 1) return 'today'
  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`
  if (days < 30) {
    const weeks = Math.round(days / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  const months = Math.round(days / 30)
  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`
  const years = Math.round(days / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

const useBucket = (initialPath) => {
  const folderPath = ref([...initialPath])
  const isFolder = (entry) => Boolean(entry && entry.children)
  const currentFolder = computed(() => {
    let node = TREE
    for (const segment of folderPath.value) {
      node = node?.[segment]?.children
      if (!node) return {}
    }
    return node
  })
  const rows = computed(() => {
    const entries = Object.entries(currentFolder.value)
    const folders = entries
      .filter(([, entry]) => isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name]) => ({ id: name, name, kind: 'folder', size: '-', lastModified: '' }))
    const files = entries
      .filter(([, entry]) => !isFolder(entry))
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, entry], index) => ({
        id: name,
        name,
        kind: 'file',
        icon: GLYPHS[entry.ext] ?? 'pi pi-file',
        size: entry.size,
        lastModified: relativeTime(entry.lastModified),
        author: PEOPLE[index % PEOPLE.length]
      }))
    const list = [...folders, ...files]
    if (folderPath.value.length) {
      list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', lastModified: '' })
    }
    return list
  })
  const enterFolder = (name) => {
    folderPath.value = [...folderPath.value, name]
  }
  const goUp = () => {
    folderPath.value = folderPath.value.slice(0, -1)
  }
  const onRowClick = (event, row) => {
    if (row.kind === 'parent') goUp()
    if (row.kind === 'folder') enterFolder(row.name)
  }
  const pathCrumbs = computed(() => [
    { label: BUCKET, href: '0' },
    ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))
  ])
  const onCrumb = (event, href) => {
    event.preventDefault()
    const depth = Number(href)
    if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth)
  }
  return {
    bucketName: BUCKET,
    addToFilesActions: ADD_ACTIONS,
    columns: COLUMNS,
    tableRef: ref(null),
    rows,
    onRowClick,
    pathCrumbs,
    onCrumb,
    ...useListRefresh(),
    ...useColumnsPanel(COLUMNS)
  }
}

const LARGE_COLUMNS = COLUMNS_POPOVER.replace(
  'size="medium" aria-label="Columns"',
  'size="large" aria-label="Columns"'
)

const TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="flex h-full min-h-0 flex-col">
    <section class="flex min-h-0 flex-col">
      <CardBox :padded="false">
        <template #content>
          <TableRoot
            ref="tableRef"
            v-model:columnVisibility="columnVisibility"
            :data="rows"
            :columns="columns"
            row-key="id"
            enable-sorting
            :border="false"
            :loading="loading"
            export-filename="objects.csv"
            @row-click="onRowClick"
          >
            <template #toolbar>
              <div class="flex w-full flex-col gap-(--spacing-sm)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i class="ai ai-edge-storage shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
                  <span class="min-w-0 truncate text-heading-xxs text-(--text-default)">{{ bucketName }}</span>
                </div>

                <div class="flex w-full items-center gap-(--spacing-xs)">
                  <TableSearch size="large" placeholder="Search in folder" class="flex-1" />
                  <Tooltip text="Refresh" class="shrink-0">
                    <IconButton icon="pi pi-refresh" kind="outlined" size="large" :loading="loading" aria-label="Refresh" @click="refresh" />
                  </Tooltip>
                  <Tooltip text="Download CSV" class="shrink-0">
                    <IconButton
                      icon="pi pi-download"
                      kind="outlined"
                      size="large"
                      :disabled="!tableRef"
                      aria-label="Download CSV"
                      @click="tableRef?.exportCsv({ filename: 'objects.csv' })"
                    />
                  </Tooltip>
${indent(LARGE_COLUMNS, 9)}
                </div>

                <div class="flex w-full items-center justify-between gap-(--spacing-xs)">
                  <Breadcrumb :items="pathCrumbs" class="min-w-0" @navigate="onCrumb" />
                  <SplitButton
                    label="Add to files"
                    icon="pi pi-plus"
                    kind="primary"
                    size="medium"
                    :model="addToFilesActions"
                    class="shrink-0"
                  />
                </div>
              </div>
            </template>

            <template #cell-name="{ value, row }">
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <i v-if="row.kind === 'parent'" class="pi pi-folder-open shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
                <i v-else-if="row.kind === 'folder'" class="pi pi-folder shrink-0 text-body-lg text-(--text-link)" aria-hidden="true" />
                <i v-else :class="row.icon" class="shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
                <span class="truncate" :class="row.kind !== 'file' ? 'cursor-pointer hover:underline' : ''">{{ value }}</span>
              </div>
            </template>

            <template #cell-size="{ value }">
              <span class="text-(--text-muted)">{{ value }}</span>
            </template>

            <template #cell-lastModified="{ value, row }">
              <div v-if="row.author || value" class="flex min-w-0 items-center gap-(--spacing-xs)">
                <Tooltip v-if="row.author" :text="row.author">
                  <Avatar :alt="row.author" :label="row.author" size="small" kind="square" />
                </Tooltip>
                <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
              </div>
            </template>

            <template #cell-actions="{ row }">
              <DropdownRoot v-if="row.kind !== 'parent'" placement="bottom-end">
                <DropdownTrigger>
                  <Tooltip text="Object actions">
                    <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Object actions" />
                  </Tooltip>
                </DropdownTrigger>
                <DropdownGroup>
                  <DropdownOption v-if="row.kind === 'folder'" key="open" value="open" label="Open">
                    <template #left><i class="pi pi-folder-open" aria-hidden="true" /></template>
                  </DropdownOption>
                  <DropdownOption v-else key="download" value="download" label="Download">
                    <template #left><i class="pi pi-download" aria-hidden="true" /></template>
                  </DropdownOption>
                </DropdownGroup>
                <DropdownGroup>
                  <DropdownOption value="delete" label="Delete">
                    <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
                  </DropdownOption>
                </DropdownGroup>
              </DropdownRoot>
            </template>

            <template #empty>
              <EmptyState size="medium" title="This folder is empty" description="Upload objects or create a folder to get started.">
                <template #actions>
                  <SplitButton
                    label="Add to files"
                    icon="pi pi-plus"
                    kind="secondary"
                    size="medium"
                    :model="addToFilesActions"
                  />
                </template>
              </EmptyState>
            </template>
          </TableRoot>
        </template>
      </CardBox>
    </section>
  </main>
</div>`

const SCRIPT_BODY = [
  `const bucketName = '${BUCKET}'`,
  '',
  `const file = (size, ext) => ({ size, ext, lastModified: '${MODIFIED}' })`,
  '',
  `const STORYBOOK_BUILD = {`,
  ...Object.entries(STORYBOOK_BUILD).map(
    ([name, entry], index, all) =>
      `  '${name}': ${entry.children ? '{ children: {} }' : `file('${entry.size}', '${entry.ext}')`}${index < all.length - 1 ? ',' : ''}`
  ),
  '}',
  '',
  'const tree = {',
  "  '20260622162046/': { children: STORYBOOK_BUILD },",
  "  '20260610093012/': { children: STORYBOOK_BUILD },",
  "  'logs/': {",
  '    children: {',
  "      'access.log': file('2.4 MB', 'log'),",
  "      'error.log': file('128 KB', 'log')",
  '    }',
  '  },',
  "  'robots.txt': file('64 B', 'txt')",
  '}',
  '',
  constLine('people', PEOPLE),
  '',
  constLine('GLYPHS', GLYPHS),
  '',
  constLine('columns', COLUMNS),
  '',
  constLine('addToFilesActions', ADD_ACTIONS),
  '',
  'const relativeTime = (input) => {',
  '  const days = Math.round((Date.now() - new Date(input).getTime()) / 86_400_000)',
  "  if (days < 1) return 'today'",
  "  if (days < 7) return `${days} ${days === 1 ? 'day' : 'days'} ago`",
  '  if (days < 30) {',
  '    const weeks = Math.round(days / 7)',
  "    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`",
  '  }',
  '  const months = Math.round(days / 30)',
  "  if (months < 12) return `${months} ${months === 1 ? 'month' : 'months'} ago`",
  '  const years = Math.round(days / 365)',
  "  return `${years} ${years === 1 ? 'year' : 'years'} ago`",
  '}',
  '',
  'const tableRef = ref(null)',
  'const isFolder = (entry) => Boolean(entry && entry.children)',
  '',
  'const currentFolder = computed(() => {',
  '  let node = tree',
  '  for (const segment of folderPath.value) {',
  '    node = node?.[segment]?.children',
  '    if (!node) return {}',
  '  }',
  '  return node',
  '})',
  '',
  'const rows = computed(() => {',
  '  const entries = Object.entries(currentFolder.value)',
  '  const folders = entries',
  '    .filter(([, entry]) => isFolder(entry))',
  '    .sort(([a], [b]) => a.localeCompare(b))',
  "    .map(([name]) => ({ id: name, name, kind: 'folder', size: '-', lastModified: '' }))",
  '  const files = entries',
  '    .filter(([, entry]) => !isFolder(entry))',
  '    .sort(([a], [b]) => a.localeCompare(b))',
  '    .map(([name, entry], index) => ({',
  '      id: name,',
  '      name,',
  "      kind: 'file',",
  "      icon: GLYPHS[entry.ext] ?? 'pi pi-file',",
  '      size: entry.size,',
  '      lastModified: relativeTime(entry.lastModified),',
  '      author: people[index % people.length]',
  '    }))',
  '  const list = [...folders, ...files]',
  '  if (folderPath.value.length) {',
  "    list.unshift({ id: '..', name: '..', kind: 'parent', size: '-', lastModified: '' })",
  '  }',
  '  return list',
  '})',
  '',
  'const enterFolder = (name) => {',
  '  folderPath.value = [...folderPath.value, name]',
  '}',
  'const goUp = () => {',
  '  folderPath.value = folderPath.value.slice(0, -1)',
  '}',
  'const onRowClick = (event, row) => {',
  "  if (row.kind === 'parent') goUp()",
  "  if (row.kind === 'folder') enterFolder(row.name)",
  '}',
  '',
  'const pathCrumbs = computed(() => [',
  "  { label: bucketName, href: '0' },",
  '  ...folderPath.value.map((segment, index) => ({ label: segment, href: String(index + 1) }))',
  '])',
  'const onCrumb = (event, href) => {',
  '  event.preventDefault()',
  '  const depth = Number(href)',
  '  if (Number.isFinite(depth)) folderPath.value = folderPath.value.slice(0, depth)',
  '}',
  '',
  ...REFRESH_SCRIPT,
  '',
  ...COLUMNS_SCRIPT.map((line) =>
    line === 'const columnVisibility = ref({ id: false })' ? 'const columnVisibility = ref({})' : line
  )
]

const script = (initialPath) => [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
  "import EmptyState from '@aziontech/webkit/empty-state'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import PopoverContent from '@aziontech/webkit/popover-content'",
  "import PopoverRoot from '@aziontech/webkit/popover-root'",
  "import PopoverTrigger from '@aziontech/webkit/popover-trigger'",
  "import SplitButton from '@aziontech/webkit/split-button'",
  "import Switch from '@aziontech/webkit/switch'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import TableSearch from '@aziontech/webkit/table-search'",
  "import Tooltip from '@aziontech/webkit/tooltip'",
  "import { computed, ref, watch } from 'vue'",
  '',
  `const folderPath = ref(${JSON.stringify(initialPath).replaceAll('"', "'")})`,
  ...SCRIPT_BODY
]

const setupWith = (initialPath) => () => {
  const bucket = useBucket(initialPath)
  bucket.columnVisibility.value = {}
  return bucket
}

const meta = {
  title: 'Templates/Platform/Detail/BucketBrowser',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The object browser a bucket opens on from Object Storage: one flush `CardBox` holding a borderless `Table` whose toolbar is the whole page header. The toolbar stacks the bucket name beside the storage glyph, a large row of the table’s own search plus the refresh, download and columns IconButtons, then a `Breadcrumb` of the folder path beside the Add to files `SplitButton` (Upload file, Add folder). Folders sort first with a link-coloured folder glyph and open on click, a .. row leads back up once inside a folder, files take a glyph by extension, Size is muted and Last Modified pairs the editor `Avatar` (named in a `Tooltip`) with the relative time; folders carry Open and files Download in their row menu, with Delete below. A bucket with nothing at its root renders the table’s empty slot: an `EmptyState` (This folder is empty) with a secondary Add to files split button; inside a folder the .. row always remains. Built from `CardBox`, `Table` with `Table.Search`, `IconButton`, `Tooltip`, `Popover`, `Switch`, `Breadcrumb`, `SplitButton`, `Avatar`, `Dropdown` and `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupWith([]), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The root of webkit-storybook-dev: two build folders and logs/ first, then robots.txt; click a folder or a crumb to move through the tree.'
      },
      source: { code: toSfc(script([]), TEMPLATE) }
    }
  }
}

export const InsideAFolder = {
  render: () => ({ components, setup: setupWith(['20260622162046/']), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Inside a Storybook build: the crumb gains the folder, a .. row leads back up, and the files carry their glyph, size, editor and age.'
      },
      source: { code: toSfc(script(['20260622162046/']), TEMPLATE) }
    }
  }
}

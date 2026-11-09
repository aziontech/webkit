import { computed, ref } from 'vue'

import { indent } from '../../_shared/markup'

const quote = (text) => `'${String(text).replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth + 1)
  const close = '  '.repeat(depth)
  if (Array.isArray(value)) {
    const items = value.map((item) => literal(item, depth + 1))
    const inline = `[${items.join(', ')}]`
    if (!items.some((item) => item.includes('\n')) && inline.length <= 80) return inline
    return `[\n${items.map((item) => `${pad}${item}`).join(',\n')}\n${close}]`
  }
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, item]) => `${key}: ${literal(item, depth + 1)}`
    )
    const inline = `{ ${entries.join(', ')} }`
    if (!entries.some((entry) => entry.includes('\n')) && inline.length <= 100) return inline
    return `{\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${close}}`
  }
  return typeof value === 'string' ? quote(value) : String(value)
}

export const constLine = (name, value) => `const ${name} = ${literal(value)}`

const aliases = (n, count) =>
  Array.from({ length: count }, (_, j) => `my-workload-${n}-alias-${j + 1}.azion.run`)

const workload = (n, { extra = 0, status = 'Live', owner, lastModified }) => {
  const domain = `my-workload-${n}.azion.run`
  return {
    id: String(1020482 + n * 173),
    name: `workload_${String(n).padStart(2, '0')}`,
    domain,
    domains: [domain, ...aliases(n, extra)],
    domainCount: extra,
    status,
    owner,
    lastModified
  }
}

export const WORKLOAD_ROWS = [
  workload(1, { extra: 3, owner: 'Robson Junior', lastModified: 'Just now' }),
  workload(2, { owner: 'Isaque Böck', lastModified: '2 weeks ago' }),
  workload(3, { extra: 2, owner: 'Rafael Garbinatto', lastModified: '1 month ago' }),
  workload(4, { owner: 'Herbert Júlio', lastModified: '2 months ago' }),
  workload(5, { status: 'Inactive', owner: 'Rafael Umman', lastModified: '2 months ago' }),
  workload(6, { extra: 5, owner: 'Marcus Grando', lastModified: '3 months ago' }),
  workload(7, { owner: 'Bruno Germano', lastModified: '4 months ago' })
]

export const WORKLOAD_COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'id', header: 'ID', minWidth: 80 },
  { accessorKey: 'domain', header: 'Domains', grow: 2 },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
  { accessorKey: 'owner', header: 'Last Editor', enableSorting: true, minWidth: 80 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

export const COLUMN_OPTIONS = WORKLOAD_COLUMNS.filter((column) => column.kind !== 'action').map(
  (column) => ({
    id: column.accessorKey,
    label: column.header,
    ...(column.hideable === false ? { locked: true } : {})
  })
)

export const useColumnVisibility = (columns, initial = { id: false }) => {
  const columnVisibility = ref({ ...initial })
  const isVisible = (id) => columnVisibility.value[id] !== false
  const setVisible = (id, visible) => {
    const next = { ...columnVisibility.value }
    if (visible) delete next[id]
    else next[id] = false
    columnVisibility.value = next
  }
  const hiddenCount = computed(() => columns.filter((column) => !isVisible(column.id)).length)
  const showAll = () => {
    columnVisibility.value = {}
  }
  return { columnVisibility, isVisible, setVisible, hiddenCount, showAll }
}

export const COLUMN_VISIBILITY_SCRIPT = [
  'const columnVisibility = ref({ id: false })',
  'const isVisible = (id) => columnVisibility.value[id] !== false',
  'const setVisible = (id, visible) => {',
  '  const next = { ...columnVisibility.value }',
  '  if (visible) delete next[id]',
  '  else next[id] = false',
  '  columnVisibility.value = next',
  '}',
  'const hiddenCount = computed(() => columns.filter((column) => !isVisible(column.id)).length)',
  'const showAll = () => {',
  '  columnVisibility.value = {}',
  '}'
]

export const filterButton = (count = 0) =>
  count
    ? `<span class="relative inline-flex shrink-0">
  <Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />
  <span class="pointer-events-none absolute -top-2 -right-2" aria-hidden="true">
    <Badge label="${count}" severity="primary" size="small" />
  </span>
</span>`
    : '<Button label="Filter" kind="outlined" size="medium" icon="pi pi-filter" />'

export const SEARCH_FIELD = `<div class="min-w-36 grow basis-(--container-2xs)">
  <InputText v-model="search" size="medium" placeholder="Search workloads" aria-label="Search workloads">
    <template #iconLeft>
      <i class="pi pi-search" aria-hidden="true" />
    </template>
  </InputText>
</div>`

export const REFRESH_BUTTON = `<Tooltip text="Refresh">
  <IconButton icon="pi pi-refresh" kind="outlined" size="medium" aria-label="Refresh" />
</Tooltip>`

export const EXPORT_BUTTON = `<Tooltip text="Download CSV">
  <IconButton icon="pi pi-download" kind="outlined" size="medium" aria-label="Download CSV" />
</Tooltip>`

export const COLUMNS_BUTTON = `<Tooltip text="Columns">
  <IconButton icon="ai ai-column" kind="outlined" size="medium" aria-label="Columns" />
</Tooltip>`

export const COLUMNS_POPOVER = `<PopoverRoot v-model:open="columnsOpen" placement="bottom-end">
  <PopoverTrigger>
    <Tooltip text="Columns" :disabled="columnsOpen">
      <IconButton icon="ai ai-column" kind="outlined" size="medium" aria-label="Columns" />
    </Tooltip>
  </PopoverTrigger>
  <PopoverContent>
    <div class="flex flex-col">
      <div class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs)">
        <p class="text-label-md text-(--text-default)">Columns</p>
      </div>
      <div class="flex max-h-(--container-xs) flex-col gap-(--spacing-xxs) overflow-y-auto overscroll-contain p-(--spacing-xxs)">
        <label
          v-for="column in columns"
          :key="column.id"
          class="flex w-full items-center gap-(--spacing-sm) rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-left text-label-sm transition-colors duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
          :class="column.locked ? 'cursor-default text-(--text-muted)' : 'cursor-pointer text-(--text-default) hover:bg-(--bg-hover)'"
        >
          <Switch
            :model-value="isVisible(column.id)"
            :disabled="column.locked"
            @update:model-value="(value) => setVisible(column.id, value)"
          />
          <span class="min-w-0 truncate">{{ column.label }}</span>
          <span v-if="column.locked" class="ml-auto shrink-0 text-label-xs text-(--text-muted)">Always shown</span>
        </label>
      </div>
      <div v-if="hiddenCount" class="grid border-t border-(--border-default) p-(--spacing-xxs)">
        <Button label="Show all columns" kind="text" size="small" @click="showAll" />
      </div>
    </div>
  </PopoverContent>
</PopoverRoot>`

export const controlsRow = ({ count = 0, columns = COLUMNS_BUTTON } = {}) =>
  `<header class="flex items-center gap-(--layout-group-gap)">
  <div class="flex min-w-0 grow items-center gap-(--spacing-xs)">
${indent(filterButton(count), 2)}
${indent(SEARCH_FIELD, 2)}
  </div>
  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
${indent(REFRESH_BUTTON, 2)}
${indent(EXPORT_BUTTON, 2)}
${indent(columns, 2)}
  </div>
</header>`

const chip = (field, value, extra = 0) => `<span class="inline-flex w-fit max-w-full">
  <Chip label="${field}" kind="filled" size="medium" clickable removable>
    <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
      <span class="truncate text-(--text-muted)">${field}</span>
      <span class="truncate">${value}</span>${
        extra ? `\n      <span class="shrink-0 text-(--text-muted)">+${extra}</span>` : ''
      }
    </span>
  </Chip>
</span>`

export const APPLIED_CHIPS = `<div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
${indent(chip('Author', 'Robson Junior', 1))}
${indent(chip('Status', 'Live'))}
</div>`

export const TABLE_CARD = `<CardBox :padded="false">
  <template #content>
    <TableRoot :data="rows" :columns="columns" row-key="id" enable-sorting paginated :page-size="10">
      <template #cell-name="{ value }">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <i class="ai ai-workloads shrink-0 text-(--text-muted)" aria-hidden="true" />
          <span class="truncate">{{ value }}</span>
        </div>
      </template>
      <template #cell-id="{ value }">
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <span class="min-w-0 flex-1 truncate tabular-nums">{{ value }}</span>
          <CopyButton kind="outlined" :value="value" aria-label="Copy workload ID" />
        </div>
      </template>
      <template #cell-domain="{ row, value }">
        <div class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
          <i class="ai ai-domains shrink-0 text-(--text-muted)" aria-hidden="true" />
          <Tooltip :text="'Open ' + value + ' in a new tab'" class="min-w-0 shrink!">
            <a
              :href="'https://' + value"
              target="_blank"
              rel="noopener noreferrer"
              class="group/link inline-flex min-w-0 items-center gap-(--spacing-xxs) text-body-sm text-(--text-default) no-underline"
              @click.stop
            >
              <span class="truncate underline-offset-2 group-hover/link:underline">{{ value }}</span>
              <span class="sr-only">(opens in a new tab)</span>
              <i class="pi pi-external-link shrink-0 text-body-xs" aria-hidden="true" />
            </a>
          </Tooltip>
          <PopoverRoot v-if="row.domainCount" placement="bottom-start" width="small">
            <PopoverTrigger @click.stop>
              <span class="cursor-pointer">
                <Tag :label="'+' + row.domainCount" severity="secondary" size="small" />
              </span>
            </PopoverTrigger>
            <PopoverContent @click.stop>
              <p class="border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-sm) text-label-sm text-(--text-muted)">
                {{ row.domains.length }} domains
              </p>
              <div class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)">
                <a
                  v-for="domain in row.domains"
                  :key="domain"
                  :href="'https://' + domain"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline"
                  @click.stop
                >
                  <span class="truncate">{{ domain }}</span>
                  <i class="pi pi-external-link ml-auto shrink-0 text-body-xs" aria-hidden="true" />
                </a>
              </div>
            </PopoverContent>
          </PopoverRoot>
          <span class="ml-auto flex shrink-0">
            <CopyButton kind="outlined" :value="value" aria-label="Copy domain name" />
          </span>
        </div>
      </template>
      <template #cell-status="{ value }">
        <Tag :label="value" :severity="value === 'Live' ? 'success' : 'secondary'" size="medium" />
      </template>
      <template #cell-owner="{ value }">
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <span class="flex shrink-0">
            <Avatar :label="value" :alt="value" size="small" kind="square" />
          </span>
          <span class="truncate text-body-sm text-(--text-default)">{{ value }}</span>
        </div>
      </template>
      <template #cell-lastModified="{ value }">
        <span class="truncate text-body-sm text-(--text-muted)">{{ value }}</span>
      </template>
      <template #cell-actions>
        <DropdownRoot placement="bottom-end">
          <DropdownTrigger>
            <Tooltip text="Row actions">
              <IconButton icon="pi pi-ellipsis-h" kind="outlined" size="small" aria-label="Row actions" />
            </Tooltip>
          </DropdownTrigger>
          <DropdownGroup>
            <DropdownOption value="deploy" label="Deploy">
              <template #left><i class="pi pi-cloud-upload" aria-hidden="true" /></template>
            </DropdownOption>
            <DropdownOption value="view" label="View details">
              <template #left><i class="pi pi-eye" aria-hidden="true" /></template>
            </DropdownOption>
            <DropdownOption value="duplicate" label="Clone">
              <template #left><i class="pi pi-clone" aria-hidden="true" /></template>
            </DropdownOption>
          </DropdownGroup>
          <DropdownGroup>
            <DropdownOption value="delete" label="Delete">
              <template #left><i class="pi pi-trash" aria-hidden="true" /></template>
            </DropdownOption>
          </DropdownGroup>
        </DropdownRoot>
      </template>
    </TableRoot>
  </template>
</CardBox>`

export const CONTROLS_IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import InputText from '@aziontech/webkit/input-text'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

export const TABLE_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import DropdownRoot from '@aziontech/webkit/dropdown-root'",
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import PopoverRoot from '@aziontech/webkit/popover-root'",
  "import PopoverContent from '@aziontech/webkit/popover-content'",
  "import PopoverTrigger from '@aziontech/webkit/popover-trigger'",
  "import TableRoot from '@aziontech/webkit/table-root'",
  "import Tag from '@aziontech/webkit/tag'",
  "import Tooltip from '@aziontech/webkit/tooltip'"
]

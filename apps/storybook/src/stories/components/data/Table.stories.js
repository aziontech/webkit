import Chip from '@aziontech/webkit/chip'
import Table from '@aziontech/webkit/table'
import TableBody from '@aziontech/webkit/table-body'
import TableCell from '@aziontech/webkit/table-cell'
import TableHeadCell from '@aziontech/webkit/table-head-cell'
import TableHeader from '@aziontech/webkit/table-header'
import TableRow from '@aziontech/webkit/table-row'
import TableSearch from '@aziontech/webkit/table-search'
import IconButton from '@aziontech/webkit/icon-button'
import DropdownMenu from '@aziontech/webkit/dropdown-menu'
import DropdownMenuContent from '@aziontech/webkit/dropdown-menu-content'
import {
  dropdownMenuItem,
  dropdownMenuSeparator
} from '@aziontech/webkit/dropdown-menu-factory'
import DropdownMenuFromModel from '@aziontech/webkit/dropdown-menu-from-model'
import DropdownMenuPortal from '@aziontech/webkit/dropdown-menu-portal'
import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

const components = {
  Table,
  Tag,
  Chip,
  IconButton,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuFromModel,
  // Compound sub-components registered under their dot-notation names so they
  // resolve in Storybook's runtime-compiled string templates: Vue compiles
  // `<Table.Header>` to `resolveComponent("Table.Header")`, an exact-name lookup
  // (a bare `Table` registration does not satisfy it). In a real SFC the dotted
  // tag resolves off the imported `Table` binding, so consumer code needs only
  // `import Table` — these extra registrations are a Storybook-runtime concern.
  'Table.Header': TableHeader,
  'Table.Body': TableBody,
  'Table.Row': TableRow,
  'Table.HeadCell': TableHeadCell,
  'Table.Cell': TableCell,
  'Table.Search': TableSearch
}

// --- Generic fixtures ------------------------------------------------------
// A small, anonymous dataset (10 rows, no real names/emails). Defined once at
// module scope and frozen so the rows carry no per-row reactivity and are shared
// across every render. Every column the stories use is present on each row, so a
// single dataset feeds the simple, fixed-width, and wide/sticky scenarios alike.

const STATUSES = ['Active', 'Inactive', 'Degraded']
const PROTOCOLS = ['HTTP & HTTPS', 'HTTP', 'HTTPS', 'gRPC']
const NAMES = [
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliet'
]

const rows = Object.freeze(
  NAMES.map((word, index) => ({
    id: String(1001 + index),
    name: `Workload ${word}`,
    status: STATUSES[index % STATUSES.length],
    editor: `user${index + 1}@example.com`,
    modified: `Jan ${index + 1}, 2026, 09:00 AM`,
    protocol: PROTOCOLS[index % PROTOCOLS.length],
    domains: (index % 5) + 1,
    origins: (index % 3) + 1,
    created: `Dec ${index + 1}, 2025, 10:00 AM`
  }))
)

// No explicit `width` — columns distribute across the full container via their
// `grow` flex weight, so the table fills the surface with no horizontal scroll.
// The first non-action column is the principal column (defaults to `grow: 2`),
// so `name` needs no explicit `grow`.
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'id', header: 'ID', enableSorting: false },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'editor', header: 'Last Editor', enableSorting: false, grow: 2 },
  { accessorKey: 'modified', header: 'Last Modified', grow: 2 },
  { id: 'actions', header: '', kind: 'action', enableSorting: false }
]

// Fixed-layout variant: every column carries an explicit pixel `width`, so the
// columns keep their declared size instead of distributing to fill the surface.
const sizedColumns = [
  { accessorKey: 'name', header: 'Name', width: 280 },
  { accessorKey: 'id', header: 'ID', enableSorting: false, width: 160 },
  { accessorKey: 'status', header: 'Status', width: 130 },
  { accessorKey: 'editor', header: 'Last Editor', enableSorting: false, width: 300 },
  { accessorKey: 'modified', header: 'Last Modified', width: 220 },
  { id: 'actions', header: '', kind: 'action', enableSorting: false }
]

// Wide variant: extra columns (Protocol, Domains, Origins, Created) push the row
// widths past the surface (horizontal scroll). Name is pinned to the start edge
// and the actions menu to the end edge — both stay put while the middle scrolls.
const wideColumns = [
  { accessorKey: 'name', header: 'Name', frozen: 'start', width: 260 },
  { accessorKey: 'id', header: 'ID', enableSorting: false, width: 170 },
  { accessorKey: 'status', header: 'Status', width: 140 },
  { accessorKey: 'protocol', header: 'Protocol', enableSorting: false, width: 170 },
  { accessorKey: 'domains', header: 'Domains', align: 'end', width: 130 },
  { accessorKey: 'origins', header: 'Origins', align: 'end', width: 130 },
  { accessorKey: 'editor', header: 'Last Editor', enableSorting: false, width: 280 },
  { accessorKey: 'created', header: 'Created', width: 220 },
  { accessorKey: 'modified', header: 'Last Modified', width: 220 },
  { id: 'actions', header: '', kind: 'action', frozen: 'end', enableSorting: false }
]

// Per-column resize is opt-in via `resizable: true`. The simple set with every
// column resizable powers the Resizable Columns story.
const resizableColumns = columns.map((col) => ({ ...col, resizable: true }))

// One shared, immutable action list — built once, reused by every row's menu.
const rowActionNodes = [
  dropdownMenuItem('View details', { value: 'view', icon: 'pi pi-eye' }),
  dropdownMenuItem('Edit', { value: 'edit', icon: 'pi pi-pencil' }),
  dropdownMenuItem('Duplicate', { value: 'duplicate', icon: 'pi pi-copy' }),
  dropdownMenuSeparator(),
  dropdownMenuItem('Delete', { value: 'delete', icon: 'pi pi-trash' })
]

const statusSeverity = (status) =>
  status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'

// --- Shared template fragments ---------------------------------------------
// The per-cell slots are identical across every data-driven story (the Name link,
// the Status Tag, and the trailing row-action menu), so they live in one constant
// interpolated into each template instead of being copy-pasted per story.

const CELL_SLOTS = `
        <template #cell-name="{ row, value }">
          <a
            :href="'/workloads/' + row.id"
            class="cursor-pointer truncate text-[var(--text-default)] no-underline hover:underline active:underline"
            @click="(event) => onLink(event, row)"
          >{{ value }}</a>
        </template>

        <template #cell-status="{ value }">
          <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
        </template>

        <template #header-actions>
          <span class="sr-only">Actions</span>
        </template>
        <template #cell-actions="{ row }">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <IconButton icon="pi pi-ellipsis-v" aria-label="Row actions" kind="transparent" size="small" />
            </DropdownMenuTrigger>
            <DropdownMenuPortal>
              <DropdownMenuContent>
                <DropdownMenuFromModel
                  :nodes="rowActionNodes"
                  @select="(action) => args.onRowAction({ id: row.id, action })"
                />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </template>
`

// The complete toolbar band — ONLY the Full Example uses it. A filter trigger, a
// context-aware Table.Search (drives the TanStack global filter through inject),
// and refresh / export / column-selector actions; the #filters slot renders a
// removable Chip mirroring the active search, clearing it via the scoped table.
const FULL_TOOLBAR = `
        <template #toolbar>
          <div class="flex w-full items-center justify-between gap-[var(--spacing-sm)]">
            <span class="flex items-center gap-[var(--spacing-xs)]">
              <IconButton icon="pi pi-filter" aria-label="Filter" kind="transparent" size="small" />
              <span class="w-[260px]">
                <Table.Search placeholder="Search keywords..." />
              </span>
            </span>
            <span class="flex items-center gap-[var(--spacing-xs)]">
              <IconButton icon="pi pi-refresh" aria-label="Refresh" kind="transparent" size="small" />
              <IconButton icon="pi pi-download" aria-label="Export" kind="transparent" size="small" />
              <IconButton icon="pi pi-objects-column" aria-label="Columns" kind="transparent" size="small" />
            </span>
          </div>
        </template>
        <template #filters="{ table }">
          <Chip
            v-if="table.getState().globalFilter"
            :label="'Search: ' + table.getState().globalFilter"
            removable
            @remove="() => table.setGlobalFilter('')"
          />
        </template>
`

// Link cell handler: a plain click is a cell action carrying the SAME payload as
// row-click (the full row record); a modified click (⌘/Ctrl/Shift) keeps the
// anchor's native open-in-new-tab behaviour.
const makeOnLink = (args) => (event, row) => {
  event.stopPropagation()
  if (event.metaKey || event.ctrlKey || event.shiftKey) return
  event.preventDefault()
  args.onCellClick(row)
}

// --- "Show code" source ----------------------------------------------------
// Storybook's default dynamic source for a custom-template story renders the
// internal markup (or the render function), not the authored `<Table>` usage.
// Each story therefore ships an explicit `docs.source.code` holding a complete,
// copy-pasteable SFC — the imports it needs, the `rows`/`columns` data, the cell
// handlers, and the `<template>` — built from its resolved args at module load
// (meta defaults + per-story overrides) rather than from a runtime transform.

const baseArgs = {
  maxHeight: '',
  border: false,
  paginated: true,
  pageSize: 5,
  enableSorting: true,
  enableRowSelection: false,
  selectOnRowClick: false,
  headerVariant: 'default'
}

// Clean, readable equivalents of CELL_SLOTS / FULL_TOOLBAR for the code snippet.
const SOURCE_CELL_SLOTS = `  <template #cell-name="{ row, value }">
    <a :href="'/workloads/' + row.id">{{ value }}</a>
  </template>
  <template #cell-status="{ value }">
    <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
  </template>
  <template #cell-actions="{ row }">
    <DropdownMenu>
      <DropdownMenuTrigger>
        <IconButton icon="pi pi-ellipsis-v" aria-label="Row actions" kind="transparent" size="small" />
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuFromModel :nodes="rowActionNodes" @select="onRowAction" />
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  </template>`

const SOURCE_TOOLBAR = `  <template #toolbar>
    <IconButton icon="pi pi-filter" aria-label="Filter" kind="transparent" size="small" />
    <Table.Search placeholder="Search keywords..." />
  </template>
  <template #filters="{ table }">
    <Chip
      v-if="table.getState().globalFilter"
      :label="'Search: ' + table.getState().globalFilter"
      removable
      @remove="() => table.setGlobalFilter('')"
    />
  </template>`

const dataDrivenSource = (args, { columnsName = 'columns', toolbar = false } = {}) => {
  const open = ['<Table', '  :data="rows"', `  :columns="${columnsName}"`, '  row-key="id"']
  if (args.enableSorting) open.push('  enable-sorting')
  if (args.enableRowSelection) open.push('  enable-row-selection')
  if (args.selectOnRowClick) open.push('  select-on-row-click')
  if (args.paginated) open.push('  paginated')
  if (args.paginated && args.pageSize !== 10) open.push(`  :page-size="${args.pageSize}"`)
  if (args.headerVariant && args.headerVariant !== 'default') {
    open.push(`  header-variant="${args.headerVariant}"`)
  }
  if (args.maxHeight) open.push(`  max-height="${args.maxHeight}"`)
  if (args.border) open.push('  border')
  if (args.enableRowSelection) open.push('  v-model:row-selection="rowSelection"')
  open.push('  v-model:sorting="sorting"')
  open.push('  @row-click="onRowClick"')
  open.push('>')
  const inner = [toolbar ? SOURCE_TOOLBAR : '', SOURCE_CELL_SLOTS].filter(Boolean).join('\n')
  return `${open.join('\n')}\n${inner}\n</Table>`
}

// Indent every non-empty line by `spaces`, so a fragment nests under a parent.
const indent = (text, spaces = 2) =>
  text
    .split('\n')
    .map((line) => (line ? ' '.repeat(spaces) + line : line))
    .join('\n')

// Assemble a complete, copy-pasteable SFC. `</script>` is kept as a discrete
// string (never inside a template literal) per the SFC-parser pitfall in
// .claude/rules/styling.md.
const sfc = (imports, script, template) =>
  [
    '<script setup>',
    imports,
    '',
    script,
    '</script>',
    '',
    '<template>',
    indent(template),
    '</template>'
  ].join('\n')

// Serialize a column array to a readable `const columns = [...]` JS literal, so
// each snippet shows the exact column config it renders (width / frozen / …).
const serializeColumns = (cols) => {
  const body = cols
    .map((col) => {
      const entries = Object.entries(col).map(
        ([key, value]) => `${key}: ${typeof value === 'string' ? `'${value}'` : value}`
      )
      return `  { ${entries.join(', ')} }`
    })
    .join(',\n')
  return `const columns = [\n${body}\n]`
}

// A small, complete sample dataset (every field any column reads).
const SOURCE_ROWS = `const rows = [
  { id: '1001', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com', modified: 'Jan 1, 2026, 09:00 AM', protocol: 'HTTP & HTTPS', domains: 2, origins: 1, created: 'Dec 1, 2025, 10:00 AM' },
  { id: '1002', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com', modified: 'Jan 2, 2026, 09:00 AM', protocol: 'HTTP', domains: 1, origins: 2, created: 'Dec 2, 2025, 10:00 AM' },
  { id: '1003', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com', modified: 'Jan 3, 2026, 09:00 AM', protocol: 'gRPC', domains: 3, origins: 1, created: 'Dec 3, 2025, 10:00 AM' }
]`

const SOURCE_ACTION_NODES = `const rowActionNodes = [
  dropdownMenuItem('View details', { value: 'view', icon: 'pi pi-eye' }),
  dropdownMenuItem('Edit', { value: 'edit', icon: 'pi pi-pencil' }),
  dropdownMenuItem('Duplicate', { value: 'duplicate', icon: 'pi pi-copy' }),
  dropdownMenuSeparator(),
  dropdownMenuItem('Delete', { value: 'delete', icon: 'pi pi-trash' })
]`

const SOURCE_STATUS_SEVERITY = `const statusSeverity = (status) =>
  status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'`

// A data-driven story's resolved args -> a complete SFC: the imports it needs,
// the data + columns + handlers, and the `<template>` (the same open tag the
// live render uses, via dataDrivenSource).
const dataDrivenSnippet = (args, { cols, toolbar = false } = {}) => {
  const imports = [
    "import { ref } from 'vue'",
    "import Table from '@aziontech/webkit/table'",
    "import Tag from '@aziontech/webkit/tag'",
    "import IconButton from '@aziontech/webkit/icon-button'",
    ...(toolbar ? ["import Chip from '@aziontech/webkit/chip'"] : []),
    "import DropdownMenu from '@aziontech/webkit/dropdown-menu'",
    "import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'",
    "import DropdownMenuPortal from '@aziontech/webkit/dropdown-menu-portal'",
    "import DropdownMenuContent from '@aziontech/webkit/dropdown-menu-content'",
    "import DropdownMenuFromModel from '@aziontech/webkit/dropdown-menu-from-model'",
    "import { dropdownMenuItem, dropdownMenuSeparator } from '@aziontech/webkit/dropdown-menu-factory'"
  ].join('\n')

  const script = [
    SOURCE_ROWS,
    '',
    serializeColumns(cols),
    '',
    'const sorting = ref([])',
    ...(args.enableRowSelection ? ['const rowSelection = ref({})'] : []),
    '',
    SOURCE_ACTION_NODES,
    '',
    SOURCE_STATUS_SEVERITY,
    '',
    'const onRowClick = (row) => {}',
    'const onRowAction = ({ action }) => {}'
  ].join('\n')

  return sfc(imports, script, dataDrivenSource(args, { toolbar }))
}

const COMPOSITION_SOURCE = sfc(
  "import Table from '@aziontech/webkit/table'",
  `const items = [
  { id: '1001', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
  { id: '1002', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
  { id: '1003', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' }
]`,
  `<Table border>
  <Table.Header>
    <Table.Row>
      <Table.HeadCell principal>Name</Table.HeadCell>
      <Table.HeadCell>Status</Table.HeadCell>
      <Table.HeadCell>Last Editor</Table.HeadCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row v-for="item in items" :key="item.id">
      <Table.Cell principal><span class="min-w-0 flex-1 truncate">{{ item.name }}</span></Table.Cell>
      <Table.Cell><span class="min-w-0 flex-1 truncate">{{ item.status }}</span></Table.Cell>
      <Table.Cell><span class="min-w-0 flex-1 truncate">{{ item.editor }}</span></Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>`
)

const EMPTY_SOURCE = sfc(
  "import Table from '@aziontech/webkit/table'",
  `const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' }
]`,
  `<!-- No rows -> the default empty state renders in the #empty slot -->
<Table :data="[]" :columns="columns" border>
  <!-- Override the default to supply your own copy + actions: -->
  <template #empty>
    <!-- illustration / title / description / Create button / docs link -->
  </template>
</Table>`
)

// Render factory (data-driven): every story is the same data-driven <Table> wired
// to the controls; only the data set, the column set, the pre-seeded selection,
// and (Full only) the toolbar differ.
const makeStory =
  ({ rows: data, columns: cols, selection = {}, toolbar = '' }) =>
  (args) => ({
    components,
    setup() {
      const sorting = ref([])
      const rowSelection = ref({ ...selection })
      const onLink = makeOnLink(args)
      return {
        args,
        rows: data,
        cols,
        rowActionNodes,
        sorting,
        rowSelection,
        statusSeverity,
        onLink
      }
    },
    template: `
      <Table
        :data="rows"
        :columns="cols"
        row-key="id"
        :max-height="args.maxHeight"
        :border="args.border"
        :paginated="args.paginated"
        :page-size="args.pageSize"
        :enable-sorting="args.enableSorting"
        :enable-row-selection="args.enableRowSelection"
        :select-on-row-click="args.selectOnRowClick"
        :header-variant="args.headerVariant"
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        @row-click="args.onRowClick"
        @update:sorting="args.onUpdateSorting"
        @update:row-selection="args.onUpdateRowSelection"
        @update:pagination="args.onUpdatePagination"
      >
        ${toolbar}${CELL_SLOTS}
      </Table>
    `
  })

// --- Docs ------------------------------------------------------------------

const docs = [
  'A data-driven table built on the headless TanStack engine and rendered entirely',
  'through our own primitives (markup, design tokens, a11y). It ships two writing',
  'styles: a **compound composition** form (`<Table.Header>` / `<Table.Row>` / …) you',
  'compose by hand, and a **data-driven** form (`data` + `columns`) where the engine',
  'renders rows, sorting, selection, pagination, and frozen columns for you.',
  '',
  '### Composition mode',
  '',
  'One import of the root; every part is reached via dot-notation. The root binding',
  'must be PascalCase (`Table`) — `table` lowercase collides with the native element.',
  '',
  'Each sub-component is also a standalone import (`@aziontech/webkit/table-row`, …)',
  '— the tree-shaking path when only a few parts are used.',
  '',
  '### Column options',
  '',
  'Each column entry accepts:',
  '',
  '- `grow` (`1 | 2 | 3`) — flex weight; a `grow` column expands to fill the surface (use `2` for the emphasized first column).',
  '- `width` (px) — a fixed-size column (fixed layout); overrides `grow`.',
  "- `frozen` (`'start' | 'end'`) — pins the column to an edge so it stays put while the rest scroll horizontally.",
  '- `resizable` (`boolean`) — opts the column into a drag-to-resize handle on its header; resizing one column freezes the others and grows the table (frozen/action columns ignore it).',
  "- `align` (`'start' | 'center' | 'end'`), `enableSorting`, and `kind: 'action'` for the trailing menu cell (auto-pinned to the right edge).",
  '',
  '### Selection, sorting & pagination',
  '',
  'Add `enable-row-selection` for a leading checkbox column (with select-all), `enable-sorting`',
  'for sortable headers, and `paginated` to render a Paginator in the footer. State is exposed',
  'through v-model (`sorting`, `row-selection`, `pagination`, `global-filter`).'
].join('\n')

/** @type {import('@storybook/vue3').Meta<typeof Table>} */
const meta = {
  title: 'Components/Data/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: { component: docs }
    }
  },
  argTypes: {
    maxHeight: {
      control: 'text',
      description:
        'Max height (CSS length). Vertical scroll engages only when set smaller than the content; horizontal scroll is always automatic.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "''" }, category: 'props' }
    },
    border: {
      control: 'boolean',
      description: 'Draw the outer card border around the table (off by default).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    paginated: {
      control: 'boolean',
      description: 'Render a Paginator in the footer and slice the rows by page.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    pageSize: {
      control: { type: 'number' },
      description: 'Rows per page when paginated.',
      table: { type: { summary: 'number' }, defaultValue: { summary: '10' }, category: 'props' }
    },
    enableSorting: {
      control: 'boolean',
      description: 'Enable sorting globally; per-column `enableSorting` overrides.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    enableRowSelection: {
      control: 'boolean',
      description: 'Add a leading selection-checkbox column.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    selectOnRowClick: {
      control: 'boolean',
      description: 'Clicking a row toggles its selection (requires enableRowSelection).',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    headerVariant: {
      control: 'inline-radio',
      options: ['default', 'compact'],
      description: 'Header density: `compact` shrinks the column-header row height and padding.',
      table: {
        type: { summary: "'default' | 'compact'" },
        defaultValue: { summary: "'default'" },
        category: 'props'
      }
    },
    onRowClick: { action: 'row-click', table: { category: 'events' } },
    onRowAction: { action: 'row-action', table: { category: 'events' } },
    onCellClick: { action: 'cell-click', table: { category: 'events (cell)' } },
    onUpdateSorting: { action: 'update:sorting', table: { category: 'events' } },
    onUpdateRowSelection: { action: 'update:rowSelection', table: { category: 'events' } },
    onUpdatePagination: { action: 'update:pagination', table: { category: 'events' } }
  },
  args: { ...baseArgs }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const Default = {
  name: 'Default',
  render: makeStory({ rows, columns }),
  args: {
    border: true
  },
  parameters: {
    docs: {
      source: { code: dataDrivenSnippet({ ...baseArgs, border: true }, { cols: columns }) },
      description: {
        story:
          'A standard data-driven table: pass `:data` and `:columns` and the engine renders sortable headers, status `Tag`s, per-row action menus, and pagination. The outer card border is drawn via the `border` prop — the table is borderless by default (it usually sits inside a surface that already frames it), so set `border` to draw the `var(--border-default)` outline; the internal row dividers are unaffected either way.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const Composition = {
  name: 'Composition',
  render: (args) => ({
    components,
    setup: () => ({ args, items: rows.slice(0, 5) }),
    template: `
      <Table :border="args.border">
        <Table.Header>
          <Table.Row>
            <Table.HeadCell principal>Name</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Last Editor</Table.HeadCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row v-for="item in items" :key="item.id">
            <Table.Cell principal><span class="min-w-0 flex-1 truncate">{{ item.name }}</span></Table.Cell>
            <Table.Cell><span class="min-w-0 flex-1 truncate">{{ item.status }}</span></Table.Cell>
            <Table.Cell><span class="min-w-0 flex-1 truncate">{{ item.editor }}</span></Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    `
  }),
  args: {
    border: true
  },
  parameters: {
    docs: {
      source: { code: COMPOSITION_SOURCE },
      description: {
        story:
          'The compound API: build the table by hand from `<Table.Header>` / `<Table.Row>` / `<Table.HeadCell>` / `<Table.Cell>`. The result is an ordinary table — the same as the data-driven API — but you control every cell. Reach for it when a cell needs custom content; otherwise prefer `:data` + `:columns`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const WithCheckboxes = {
  name: 'With Checkboxes',
  render: makeStory({ rows, columns }),
  args: {
    enableRowSelection: true
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet({ ...baseArgs, enableRowSelection: true }, { cols: columns })
      },
      description: {
        story:
          'A leading selection column (`enable-row-selection`): each row gets a checkbox and the header gets a select-all box that reflects the all/none/indeterminate state. Selection is exposed via `v-model:row-selection`; changes log to the Actions panel.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const CompactHeader = {
  name: 'Compact Header',
  render: makeStory({ rows, columns }),
  args: {
    paginated: false,
    headerVariant: 'compact'
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, paginated: false, headerVariant: 'compact' },
          { cols: columns }
        )
      },
      description: {
        story:
          'A denser header via `header-variant="compact"` (forwarded to `Table.Header`): the column-header row uses a reduced height and padding. No toolbar band, so the table opens straight onto that header row.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const SelectedRow = {
  name: 'Selected Row',
  render: makeStory({
    rows,
    columns,
    selection: { [rows[1].id]: true }
  }),
  args: {
    enableRowSelection: true,
    selectOnRowClick: true
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, enableRowSelection: true, selectOnRowClick: true },
          { cols: columns }
        )
      },
      description: {
        story:
          'A row in the selected state: the second row is pre-selected via `v-model:row-selection`, rendering the `var(--bg-selected)` surface and `aria-selected`. With `select-on-row-click`, clicking anywhere on an inert part of a row toggles its selection.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const FixedLayoutWithColumnSizes = {
  name: 'Fixed Layout with Column Sizes',
  render: makeStory({ rows, columns: sizedColumns }),
  parameters: {
    docs: {
      source: { code: dataDrivenSnippet({ ...baseArgs }, { cols: sizedColumns }) },
      description: {
        story:
          'Every column declares an explicit pixel `width`, so the layout is fixed: columns keep their declared size instead of distributing to fill the surface, and the viewport scrolls horizontally if the widths sum past it.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const ResizableColumns = {
  name: 'Resizable Columns',
  render: makeStory({ rows, columns: resizableColumns }),
  parameters: {
    docs: {
      source: { code: dataDrivenSnippet({ ...baseArgs }, { cols: resizableColumns }) },
      description: {
        story:
          'A simple table whose columns opt into drag-to-resize via per-column `resizable: true`. Drag a header divider: only that column resizes (the others freeze at their current width) and the table grows with horizontal scroll. A column can shrink only down to its own content width. Frozen and action columns ignore `resizable`.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const StickyColumn = {
  name: 'Sticky Column',
  render: makeStory({ rows, columns: wideColumns }),
  parameters: {
    docs: {
      source: { code: dataDrivenSnippet({ ...baseArgs }, { cols: wideColumns }) },
      description: {
        story:
          'Extra columns (Protocol, Domains, Origins, Created) push the rows past the surface. The **Name** column is pinned to the start edge (`frozen: "start"`) and the **actions** menu to the end edge (`frozen: "end"`): both stay put while the middle columns scroll horizontally underneath, with a CSS-only edge fade dissolving the scrolling content under each pinned column.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const CompactHeaderWithStickyColumn = {
  name: 'Compact Header with Sticky Column',
  render: makeStory({ rows, columns: wideColumns }),
  args: {
    paginated: false,
    headerVariant: 'compact'
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, paginated: false, headerVariant: 'compact' },
          { cols: wideColumns }
        )
      },
      description: {
        story:
          'A compact header (`header-variant="compact"`) combined with the freeze system: the frozen **Name** / **actions** columns stay pinned while the middle columns scroll horizontally, and the denser header is sticky within the scroll viewport. No toolbar or paginator.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const FullExample = {
  name: 'Full Example',
  render: makeStory({
    rows,
    columns,
    toolbar: FULL_TOOLBAR
  }),
  args: {
    border: true,
    enableRowSelection: true,
    selectOnRowClick: false
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, border: true, enableRowSelection: true },
          { cols: columns, toolbar: true }
        )
      },
      description: {
        story:
          'The complete data table over the generic ≤10-row dataset, paginated with a small `page-size` so the paginator spans a couple of pages: the only story with the toolbar band — a composed toolbar (filter / context-aware search / refresh / export / column-selector) wired through the scoped `#toolbar="{ table }"` / `#filters="{ table }"` slots — the search drives `table.setGlobalFilter` and the removable chip clears it — plus select-all + sortable headers, status Tags, per-row action menus, the `border` prop, and a paginator, over the same clean column layout as the other data-driven stories.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const Empty = {
  name: 'Empty',
  render: makeStory({ rows: [], columns }),
  args: {
    border: true,
    paginated: false
  },
  parameters: {
    docs: {
      source: {
        code: EMPTY_SOURCE
      },
      description: {
        story:
          'When `data` is empty, the table renders a default empty state in the `#empty` slot — an illustration, a title, and a short description, following Figma. Override the `#empty` slot to supply your own copy and call-to-action (e.g. a Create button or a documentation link).'
      }
    }
  }
}

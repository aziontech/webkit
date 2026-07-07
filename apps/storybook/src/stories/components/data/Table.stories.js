import Button from '@aziontech/webkit/button'
import Dropdown from '@aziontech/webkit/dropdown'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import IconButton from '@aziontech/webkit/icon-button'
import Table from '@aziontech/webkit/table'
import TableAppliedFilters from '@aziontech/webkit/table-applied-filters'
import TableBody from '@aziontech/webkit/table-body'
import TableCell from '@aziontech/webkit/table-cell'
import TableColumnSelector from '@aziontech/webkit/table-column-selector'
import TableExport from '@aziontech/webkit/table-export'
import TableFilter from '@aziontech/webkit/table-filter'
import TableHeadCell from '@aziontech/webkit/table-head-cell'
import TableHeader from '@aziontech/webkit/table-header'
import TableRefreshButton from '@aziontech/webkit/table-refresh-button'
import TableRow from '@aziontech/webkit/table-row'
import TableSearch from '@aziontech/webkit/table-search'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

const components = {
  Table,
  Tag,
  Button,
  IconButton,
  Dropdown,
  DropdownTrigger,
  DropdownGroup,
  DropdownOption,
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
  'Table.Search': TableSearch,
  'Table.Filter': TableFilter,
  'Table.AppliedFilters': TableAppliedFilters,
  'Table.ColumnSelector': TableColumnSelector,
  'Table.Export': TableExport,
  'Table.RefreshButton': TableRefreshButton
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

// Field catalog for the built-in advanced-filter builder (Table.Filter). The
// built-in value input is a text field; typed editors would use the escape slot.
const filterFields = [
  { id: 'name', label: 'Name', type: 'text' },
  {
    id: 'status',
    label: 'Status',
    type: 'select',
    options: STATUSES.map((status) => ({ label: status, value: status }))
  },
  { id: 'editor', label: 'Last Editor', type: 'text' }
]

// One shared, immutable action list — built once, reused by every row's menu.
// Split into two groups so the navigation `<Dropdown>` renders the divider
// between the safe actions and the destructive `Delete`.
const rowActionGroups = [
  [
    { value: 'view', label: 'View details', icon: 'pi pi-eye' },
    { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
    { value: 'duplicate', label: 'Duplicate', icon: 'pi pi-copy' }
  ],
  [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
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
          <Dropdown @select="({ value }) => args.onRowAction({ id: row.id, action: { value } })">
            <DropdownTrigger>
              <IconButton icon="pi pi-ellipsis-v" aria-label="Row actions" kind="transparent" size="small" />
            </DropdownTrigger>
            <DropdownGroup v-for="(group, gi) in rowActionGroups" :key="gi">
              <DropdownOption
                v-for="option in group"
                :key="option.value"
                :value="option.value"
                :label="option.label"
              >
                <template #left><i :class="option.icon" aria-hidden="true" /></template>
              </DropdownOption>
            </DropdownGroup>
          </Dropdown>
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
  headerKind: 'default'
}

// Clean, readable equivalent of CELL_SLOTS for the code snippet.
const SOURCE_CELL_SLOTS = `  <template #cell-name="{ row, value }">
    <a :href="'/workloads/' + row.id">{{ value }}</a>
  </template>
  <template #cell-status="{ value }">
    <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
  </template>
  <template #cell-actions="{ row }">
    <Dropdown @select="({ value }) => onRowAction({ id: row.id, action: { value } })">
      <DropdownTrigger>
        <IconButton icon="pi pi-ellipsis-v" aria-label="Row actions" kind="transparent" size="small" />
      </DropdownTrigger>
      <DropdownGroup v-for="(group, gi) in rowActionGroups" :key="gi">
        <DropdownOption v-for="option in group" :key="option.value" :value="option.value" :label="option.label">
          <template #left><i :class="option.icon" aria-hidden="true" /></template>
        </DropdownOption>
      </DropdownGroup>
    </Dropdown>
  </template>`

const dataDrivenSource = (args, { columnsName = 'columns' } = {}) => {
  const open = ['<Table', '  :data="rows"', `  :columns="${columnsName}"`, '  row-key="id"']
  if (args.enableSorting) open.push('  enable-sorting')
  if (args.enableRowSelection) open.push('  enable-row-selection')
  if (args.selectOnRowClick) open.push('  select-on-row-click')
  if (args.paginated) open.push('  paginated')
  if (args.paginated && args.pageSize !== 10) open.push(`  :page-size="${args.pageSize}"`)
  if (args.headerKind && args.headerKind !== 'default') {
    open.push(`  header-kind="${args.headerKind}"`)
  }
  if (args.maxHeight) open.push(`  max-height="${args.maxHeight}"`)
  if (args.border) open.push('  border')
  if (args.enableRowSelection) open.push('  v-model:row-selection="rowSelection"')
  open.push('  v-model:sorting="sorting"')
  open.push('  @row-click="onRowClick"')
  open.push('>')
  return `${open.join('\n')}\n${SOURCE_CELL_SLOTS}\n</Table>`
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

const SOURCE_ACTION_NODES = `const rowActionGroups = [
  [
    { value: 'view', label: 'View details', icon: 'pi pi-eye' },
    { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
    { value: 'duplicate', label: 'Duplicate', icon: 'pi pi-copy' }
  ],
  [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
]`

const SOURCE_STATUS_SEVERITY = `const statusSeverity = (status) =>
  status === 'Active' ? 'success' : status === 'Degraded' ? 'warning' : 'danger'`

// A data-driven story's resolved args -> a complete SFC: the imports it needs,
// the data + columns + handlers, and the `<template>` (the same open tag the
// live render uses, via dataDrivenSource).
const dataDrivenSnippet = (args, { cols } = {}) => {
  const imports = [
    "import { ref } from 'vue'",
    "import Table from '@aziontech/webkit/table'",
    "import Tag from '@aziontech/webkit/tag'",
    "import IconButton from '@aziontech/webkit/icon-button'",
    "import Dropdown from '@aziontech/webkit/dropdown'",
    "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
    "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
    "import DropdownOption from '@aziontech/webkit/dropdown-option'"
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

  return sfc(imports, script, dataDrivenSource(args))
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
// to the controls; only the data set, the column set, and the pre-seeded
// selection differ.
const makeStory =
  ({ rows: data, columns: cols, selection = {} }) =>
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
        rowActionGroups,
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
        :header-kind="args.headerKind"
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        @row-click="args.onRowClick"
        @update:sorting="args.onUpdateSorting"
        @update:row-selection="args.onUpdateRowSelection"
        @update:pagination="args.onUpdatePagination"
      >
        ${CELL_SLOTS}
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
    headerKind: {
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
    onRowAction: { action: 'row-action', table: { category: 'slot interactions (story only)' } },
    onCellClick: { action: 'cell-click', table: { category: 'slot interactions (story only)' } },
    onUpdateSorting: { action: 'update:sorting', table: { category: 'events' } },
    onUpdateRowSelection: { action: 'update:rowSelection', table: { category: 'events' } },
    onUpdatePagination: { action: 'update:pagination', table: { category: 'events' } },
    onUpdateFilters: { action: 'update:filters', table: { category: 'events' } },
    onUpdateState: { action: 'update:state', table: { category: 'events' } },
    onFilterApply: { action: 'filter-apply', table: { category: 'events' } },
    onFilterRemove: { action: 'filter-remove', table: { category: 'events' } },
    onRefresh: { action: 'refresh', table: { category: 'events' } },
    onExport: { action: 'export', table: { category: 'events' } }
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
    headerKind: 'compact'
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, paginated: false, headerKind: 'compact' },
          { cols: columns }
        )
      },
      description: {
        story:
          'A denser header via `header-kind="compact"` (forwarded to `Table.Header`): the column-header row uses a reduced height and padding, so the table opens straight onto that header row.'
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
    headerKind: 'compact'
  },
  parameters: {
    docs: {
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, paginated: false, headerKind: 'compact' },
          { cols: wideColumns }
        )
      },
      description: {
        story:
          'A compact header (`header-kind="compact"`) combined with the freeze system: the frozen **Name** / **actions** columns stay pinned while the middle columns scroll horizontally, and the denser header is sticky within the scroll viewport. No paginator.'
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

// --- New DataTable capability stories --------------------------------------

const FULL_SOURCE = `<script setup>
import Table from '@aziontech/webkit/table'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

const rows = ref([
  { id: '1', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
  { id: '2', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' }
])
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'editor', header: 'Last Editor' },
  { id: 'actions', header: '', kind: 'action' }
]
const filterFields = [
  { id: 'name', label: 'Name', type: 'text' },
  { id: 'status', label: 'Status', type: 'select', options: [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ] }
]
const filters = ref([])
const loading = ref(false)
const statusSeverity = (value) =>
  value === 'Active' ? 'success' : value === 'Degraded' ? 'warning' : 'danger'

// Reload signals a refetch; toggle loading to show skeleton rows while it resolves.
const reload = () => {
  loading.value = true
  setTimeout(() => { loading.value = false }, 700)
}
<\/script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    :filter-fields="filterFields"
    border
    paginated
    :page-size="5"
    enable-sorting
    enable-row-selection
    :loading="loading"
    export-filename="workloads.csv"
    v-model:filters="filters"
    @refresh="reload"
  >
    <template #toolbar>
      <Table.Filter :fields="filterFields" />
      <Table.Search placeholder="Search" />
      <Table.RefreshButton />
      <Table.Export />
      <Table.ColumnSelector />
    </template>
    <template #filters>
      <Table.AppliedFilters />
    </template>
    <template #cell-status="{ value }">
      <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
    </template>
  </Table>
</template>`

export const FullExample = {
  name: 'Full Example',
  render: (args) => ({
    components,
    setup() {
      const sorting = ref([])
      const rowSelection = ref({})
      const filters = ref([])
      const loading = ref(false)
      const onLink = makeOnLink(args)
      const reload = () => {
        loading.value = true
        args.onRefresh?.()
        setTimeout(() => {
          loading.value = false
        }, 700)
      }
      return {
        args,
        rows,
        cols: columns,
        filterFields,
        rowActionGroups,
        sorting,
        rowSelection,
        filters,
        loading,
        statusSeverity,
        onLink,
        reload
      }
    },
    template: `
      <Table
        :data="rows"
        :columns="cols"
        row-key="id"
        :border="args.border"
        :max-height="args.maxHeight"
        :paginated="args.paginated"
        :page-size="args.pageSize"
        :enable-sorting="args.enableSorting"
        :enable-row-selection="args.enableRowSelection"
        :select-on-row-click="args.selectOnRowClick"
        :header-kind="args.headerKind"
        :filter-fields="filterFields"
        :loading="loading"
        export-filename="workloads.csv"
        v-model:sorting="sorting"
        v-model:row-selection="rowSelection"
        v-model:filters="filters"
        @filter-apply="args.onFilterApply"
        @filter-remove="args.onFilterRemove"
        @refresh="reload"
      >
        <template #toolbar>
          <Table.Filter :fields="filterFields" />
          <Table.Search placeholder="Search" />
          <Table.RefreshButton />
          <Table.Export />
          <Table.ColumnSelector />
        </template>
        <template #filters>
          <Table.AppliedFilters />
        </template>
        ${CELL_SLOTS}
      </Table>
    `
  }),
  args: {
    border: true,
    paginated: true,
    pageSize: 5,
    enableSorting: true,
    enableRowSelection: true
  },
  parameters: {
    docs: {
      source: { code: FULL_SOURCE },
      description: {
        story:
          'The assembled DataTable: a `#toolbar` band composing context-aware `Table.Search`, `Table.Filter` (built-in field/operator/value builder), `Table.ColumnSelector`, `Table.Export` (CSV), and `Table.RefreshButton`, with a `#filters` row of removable `Table.AppliedFilters` chips. Every control reads the table through the injected context, so the consumer wires nothing. Structured filters are a first-class `v-model:filters`; the search box drives the separate global filter. Export downloads the visible, ordered, filtered rows as CSV.'
      }
    }
  }
}

const LOADING_SOURCE = `<script setup>
import Table from '@aziontech/webkit/table'
import { ref } from 'vue'

const rows = ref([])
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'editor', header: 'Last Editor' }
]
<\/script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    paginated
    :page-size="5"
    enable-sorting
    loading
  />
</template>`

export const Loading = {
  name: 'Loading',
  render: (args) => ({
    components,
    setup() {
      const onLink = makeOnLink(args)
      return {
        args,
        rows,
        cols: columns,
        rowActionGroups,
        sorting: ref([]),
        rowSelection: ref({}),
        statusSeverity,
        onLink
      }
    },
    template: `
      <Table
        :data="rows"
        :columns="cols"
        row-key="id"
        :paginated="true"
        :page-size="5"
        :enable-sorting="true"
        loading
      >
        ${CELL_SLOTS}
      </Table>
    `
  }),
  args: { paginated: true, pageSize: 5, enableSorting: true },
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: LOADING_SOURCE },
      description: {
        story:
          'Dynamic (server-side) mode shows skeleton rows while `loading` is true — aligned to the columns and setting `aria-busy` on the table. Loading takes precedence over both the data rows and the empty state, so the empty illustration never flashes before the first fetch resolves.'
      }
    }
  }
}

const STATE_SOURCE = `<script setup>
import Table from '@aziontech/webkit/table'
import Button from '@aziontech/webkit/button'
import { ref } from 'vue'

const tableRef = ref(null)
const state = ref()
const saved = ref(null)
const rows = ref([
  { id: '1', name: 'Workload Alpha', status: 'Active' },
  { id: '2', name: 'Workload Bravo', status: 'Inactive' }
])
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' }
]

// The app owns persistence — e.g. encode getState() into the URL:
//   router.replace({ query: { s: btoa(JSON.stringify(tableRef.value.getState())) } })
// and restore on mount with tableRef.value.setState(JSON.parse(atob(route.query.s))).
const save = () => (saved.value = tableRef.value?.getState())
const restore = () => saved.value && tableRef.value?.setState(saved.value)
<\/script>

<template>
  <div>
    <Button label="Save state" size="small" @click="save" />
    <Button label="Restore state" kind="outlined" size="small" :disabled="!saved" @click="restore" />
    <Table
      ref="tableRef"
      :data="rows"
      :columns="columns"
      paginated
      :page-size="5"
      enable-sorting
      v-model:state="state"
    />
  </div>
</template>`

export const SerializableState = {
  name: 'Serializable State',
  render: (args) => ({
    components,
    setup() {
      const tableRef = ref(null)
      const state = ref()
      const saved = ref(null)
      const onLink = makeOnLink(args)
      const save = () => (saved.value = tableRef.value?.getState())
      const restore = () => saved.value && tableRef.value?.setState(saved.value)
      return {
        args,
        rows,
        cols: columns,
        rowActionGroups,
        state,
        saved,
        tableRef,
        save,
        restore,
        statusSeverity,
        onLink
      }
    },
    template: `
      <div class="flex flex-col gap-[var(--spacing-sm)]">
        <div class="flex items-center gap-[var(--spacing-xs)]">
          <Button label="Save state" size="small" @click="save" />
          <Button label="Restore state" kind="outlined" size="small" :disabled="!saved" @click="restore" />
        </div>
        <Table
          ref="tableRef"
          :data="rows"
          :columns="cols"
          row-key="id"
          :paginated="true"
          :page-size="5"
          :enable-sorting="true"
          v-model:state="state"
          @update:state="args.onUpdateState"
        >
          ${CELL_SLOTS}
        </Table>
        <pre class="max-h-40 overflow-auto rounded-[var(--shape-elements)] bg-[var(--bg-canvas)] p-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]">{{ JSON.stringify(state, null, 2) }}</pre>
      </div>
    `
  }),
  args: { paginated: true, pageSize: 5, enableSorting: true },
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: STATE_SOURCE },
      description: {
        story:
          'The table exposes a JSON-serializable `TableStateSnapshot` via `v-model:state` + `getState()` / `setState()` (reach the methods through a template ref). Sort or paginate, then Save and Restore to round-trip the snapshot. The component stays router-agnostic — the app decides where to persist it (URL, localStorage, backend); the live snapshot is shown below.'
      }
    }
  }
}

const SERVER_SOURCE = `<script setup>
import Table from '@aziontech/webkit/table'
import { ref } from 'vue'

// Stand-in for your API/service.
const ALL = Array.from({ length: 23 }, (_, i) => ({
  id: String(i + 1),
  name: 'Workload ' + (i + 1),
  status: i % 3 === 0 ? 'Active' : 'Inactive'
}))
async function listService({ page, pageSize, search, ordering }) {
  await new Promise((resolve) => setTimeout(resolve, 600))
  let items = ALL.filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
  if (ordering) {
    const desc = ordering.startsWith('-')
    const key = ordering.replace('-', '')
    items = [...items].sort((a, b) => String(a[key]).localeCompare(String(b[key])) * (desc ? -1 : 1))
  }
  const start = (page - 1) * pageSize
  return { items: items.slice(start, start + pageSize), total: items.length }
}

const columns = [
  { accessorKey: 'name', header: 'Name', enableSorting: true },
  { accessorKey: 'status', header: 'Status' }
]
const rows = ref([])
const loading = ref(false)
const rowCount = ref(0)
const pagination = ref({ pageIndex: 0, pageSize: 5 })
const sorting = ref([])
const globalFilter = ref('')

async function reload() {
  loading.value = true
  const sort = sorting.value[0]
  const ordering = sort ? (sort.desc ? '-' : '') + sort.id : ''
  const result = await listService({
    page: pagination.value.pageIndex + 1,
    pageSize: pagination.value.pageSize,
    search: globalFilter.value,
    ordering
  })
  rows.value = result.items
  rowCount.value = result.total
  loading.value = false
}
const onSearch = () => {
  pagination.value = { ...pagination.value, pageIndex: 0 }
  reload()
}
reload()
<\/script>

<template>
  <Table
    :data="rows"
    :columns="columns"
    :loading="loading"
    manual-pagination
    manual-sorting
    manual-filtering
    :row-count="rowCount"
    paginated
    enable-sorting
    v-model:pagination="pagination"
    v-model:sorting="sorting"
    v-model:global-filter="globalFilter"
    @update:pagination="reload"
    @update:sorting="reload"
    @update:global-filter="onSearch"
    @refresh="reload"
  />
</template>`

export const ServerSide = {
  name: 'Server-Side (lazy)',
  render: () => ({
    components,
    setup() {
      const ALL = Array.from({ length: 23 }, (_, i) => ({
        id: String(i + 1),
        name: 'Workload ' + (i + 1),
        status: i % 3 === 0 ? 'Active' : 'Inactive'
      }))
      const cols = [
        { accessorKey: 'name', header: 'Name', enableSorting: true },
        { accessorKey: 'status', header: 'Status' }
      ]
      const rows = ref([])
      const loading = ref(false)
      const rowCount = ref(0)
      const pagination = ref({ pageIndex: 0, pageSize: 5 })
      const sorting = ref([])
      const globalFilter = ref('')
      const listService = async ({ page, pageSize, search, ordering }) => {
        await new Promise((resolve) => setTimeout(resolve, 600))
        let items = ALL.filter((row) => row.name.toLowerCase().includes(search.toLowerCase()))
        if (ordering) {
          const desc = ordering.startsWith('-')
          const key = ordering.replace('-', '')
          items = [...items].sort(
            (a, b) => String(a[key]).localeCompare(String(b[key])) * (desc ? -1 : 1)
          )
        }
        const start = (page - 1) * pageSize
        return { items: items.slice(start, start + pageSize), total: items.length }
      }
      const reload = async () => {
        loading.value = true
        const sort = sorting.value[0]
        const ordering = sort ? (sort.desc ? '-' : '') + sort.id : ''
        const result = await listService({
          page: pagination.value.pageIndex + 1,
          pageSize: pagination.value.pageSize,
          search: globalFilter.value,
          ordering
        })
        rows.value = result.items
        rowCount.value = result.total
        loading.value = false
      }
      const onSearch = () => {
        pagination.value = { ...pagination.value, pageIndex: 0 }
        reload()
      }
      reload()
      return { rows, cols, loading, rowCount, pagination, sorting, globalFilter, reload, onSearch }
    },
    template: `
      <Table
        :data="rows"
        :columns="cols"
        :loading="loading"
        :manual-pagination="true"
        :manual-sorting="true"
        :manual-filtering="true"
        :row-count="rowCount"
        :paginated="true"
        :enable-sorting="true"
        v-model:pagination="pagination"
        v-model:sorting="sorting"
        v-model:global-filter="globalFilter"
        @update:pagination="reload"
        @update:sorting="reload"
        @update:global-filter="onSearch"
        @refresh="reload"
      />
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: SERVER_SOURCE },
      description: {
        story:
          'Server-side (lazy) data: `manual-pagination` / `manual-sorting` / `manual-filtering` + `:row-count` delegate to a service. Page and sort changes call `listService` and show skeleton rows via `loading` while it resolves (the exposed `reload()` re-runs the fetch). The component owns no data source — the app performs the fetch.'
      }
    }
  }
}

// --- Reload Transition -----------------------------------------------------
// Toggling `loading` off → on → off replays the body's enter transition
// (an 8px translate-y + fade), so the data slides in each time it comes back.
// This isolates the "load and return" animation with a single Reload button.

const RELOAD_SOURCE = sfc(
  [
    "import { ref } from 'vue'",
    "import Table from '@aziontech/webkit/table'",
    "import Button from '@aziontech/webkit/button'"
  ].join('\n'),
  `const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'editor', header: 'Last Editor' }
]
const source = [
  { id: '1', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
  { id: '2', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
  { id: '3', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' },
  { id: '4', name: 'Workload Delta', status: 'Active', editor: 'user4@example.com' },
  { id: '5', name: 'Workload Echo', status: 'Inactive', editor: 'user5@example.com' },
  { id: '6', name: 'Workload Foxtrot', status: 'Degraded', editor: 'user6@example.com' },
  { id: '7', name: 'Workload Golf', status: 'Active', editor: 'user7@example.com' },
  { id: '8', name: 'Workload Hotel', status: 'Inactive', editor: 'user8@example.com' }
]

const rows = ref(source)
const loading = ref(false)

// Flip loading true then back to false to replay the body enter transition.
// The skeleton shows page-size (5) rows — the count the page will display.
const reload = () => {
  loading.value = true
  setTimeout(() => {
    rows.value = source
    loading.value = false
  }, 700)
}`,
  `<div class="flex flex-col gap-4">
  <div>
    <Button label="Reload" size="small" @click="reload" />
  </div>
  <Table
    :data="rows"
    :columns="columns"
    row-key="id"
    paginated
    :page-size="5"
    :loading="loading"
    @refresh="reload"
  />
</div>`
)

export const ReloadTransition = {
  name: 'Reload Transition',
  render: () => ({
    components,
    setup() {
      const source = [
        { id: '1', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
        { id: '2', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
        { id: '3', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' },
        { id: '4', name: 'Workload Delta', status: 'Active', editor: 'user4@example.com' },
        { id: '5', name: 'Workload Echo', status: 'Inactive', editor: 'user5@example.com' },
        { id: '6', name: 'Workload Foxtrot', status: 'Degraded', editor: 'user6@example.com' },
        { id: '7', name: 'Workload Golf', status: 'Active', editor: 'user7@example.com' },
        { id: '8', name: 'Workload Hotel', status: 'Inactive', editor: 'user8@example.com' }
      ]
      const cols = [
        { accessorKey: 'name', header: 'Name' },
        { accessorKey: 'status', header: 'Status' },
        { accessorKey: 'editor', header: 'Last Editor' }
      ]
      const data = ref(source)
      const loading = ref(false)
      const reload = () => {
        loading.value = true
        setTimeout(() => {
          data.value = source
          loading.value = false
        }, 700)
      }
      return { data, cols, loading, reload }
    },
    template: `
      <div class="flex flex-col gap-4">
        <div>
          <Button label="Reload" size="small" @click="reload" />
        </div>
        <Table
          :data="data"
          :columns="cols"
          row-key="id"
          :paginated="true"
          :page-size="5"
          :loading="loading"
          @refresh="reload"
        />
      </div>
    `
  }),
  parameters: {
    docs: {
      controls: { disable: true },
      source: { code: RELOAD_SOURCE },
      description: {
        story:
          'Click **Reload** to flip `loading` on and off. While it is true the table shows exactly `page-size` (5) skeleton rows — the number of rows the page will display — and when the data comes back the body plays its enter transition: an 8px `translate-y` with a fade (300ms `ease-out`, `motion-reduce`-safe). The animation replays on every load → data cycle, but not on client-side sorting or pagination (the body stays mounted).'
      }
    }
  }
}

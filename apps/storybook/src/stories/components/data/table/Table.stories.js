import Dropdown from '@aziontech/webkit/dropdown'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import IconButton from '@aziontech/webkit/icon-button'
import Table from '@aziontech/webkit/table'
import TableBody from '@aziontech/webkit/table-body'
import TableCell from '@aziontech/webkit/table-cell'
import TableHeadCell from '@aziontech/webkit/table-head-cell'
import TableHeader from '@aziontech/webkit/table-header'
import TableRow from '@aziontech/webkit/table-row'
import Tag from '@aziontech/webkit/tag'
import { ref } from 'vue'

import { toSfc } from '../../../_shared/story-source'

const components = {
  Table,
  Tag,
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
  'Table.Cell': TableCell
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
// Storybook's dynamic source for a custom-template story renders the internal
// markup (or the render function), not the authored `<Table>` usage. Each story
// therefore ships an explicit `docs.source.code` built with the shared `toSfc`
// helper: a complete, copy-pasteable SFC — the imports it needs, the
// `rows`/`columns` data, the cell handlers, and the template — assembled from its
// resolved args at module load (meta defaults + per-story overrides) rather than
// from a runtime transform.

const baseArgs = {
  maxHeight: '',
  border: false,
  paginated: true,
  pageSize: 5,
  enableSorting: true,
  enableRowSelection: false,
  selectOnRowClick: false,
  headerKind: 'default',
  loading: false
}

// Clean, readable equivalent of CELL_SLOTS for the code snippet. The anchor keeps
// the canvas classes so the pasted snippet renders identically.
const SOURCE_CELL_SLOTS = `  <template #cell-name="{ row, value }">
    <a
      :href="'/workloads/' + row.id"
      class="cursor-pointer truncate text-[var(--text-default)] no-underline hover:underline active:underline"
    >{{ value }}</a>
  </template>
  <template #cell-status="{ value }">
    <Tag :severity="statusSeverity(value)">{{ value }}</Tag>
  </template>
  <template #header-actions>
    <span class="sr-only">Actions</span>
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

const dataDrivenSource = (args) => {
  const open = ['<Table', '  :data="rows"', '  :columns="columns"', '  row-key="id"']
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

const SNIPPET_IMPORTS = [
  "import Table from '@aziontech/webkit/table'",
  "import Tag from '@aziontech/webkit/tag'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Dropdown from '@aziontech/webkit/dropdown'",
  "import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'",
  "import DropdownGroup from '@aziontech/webkit/dropdown-group'",
  "import DropdownOption from '@aziontech/webkit/dropdown-option'",
  "import { ref } from 'vue'"
]

// A data-driven story's resolved args -> a complete SFC via toSfc: the imports it
// needs, the data + columns + handlers, and the same `<Table>` open tag the live
// render resolves (via dataDrivenSource). `rowsLiteral` / `selectionLiteral` let
// a story mirror its exact canvas data (empty dataset, pre-seeded selection).
const dataDrivenSnippet = (
  args,
  { cols, rowsLiteral = SOURCE_ROWS, selectionLiteral = 'const rowSelection = ref({})' } = {}
) =>
  toSfc(
    [
      ...SNIPPET_IMPORTS,
      '',
      rowsLiteral,
      '',
      serializeColumns(cols),
      '',
      'const sorting = ref([])',
      ...(args.enableRowSelection ? [selectionLiteral] : []),
      '',
      SOURCE_ACTION_NODES,
      '',
      SOURCE_STATUS_SEVERITY,
      '',
      'const onRowClick = (row) => {}',
      'const onRowAction = ({ action }) => {}'
    ],
    dataDrivenSource(args)
  )

const COMPOSITION_SOURCE = toSfc(
  [
    "import Table from '@aziontech/webkit/table'",
    '',
    `const items = [
  { id: '1001', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
  { id: '1002', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
  { id: '1003', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' },
  { id: '1004', name: 'Workload Delta', status: 'Active', editor: 'user4@example.com' },
  { id: '1005', name: 'Workload Echo', status: 'Inactive', editor: 'user5@example.com' }
]`
  ],
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

// Render factory (data-driven): every story is the same data-driven <Table> wired
// to the controls via `v-bind="args"`; only the data set, the column set, and the
// pre-seeded selection differ. Sorting and selection are stateful (v-model), so
// the story holds local refs and the update handlers write the ref AND forward to
// the corresponding `args['onUpdate:*']` action so the Actions panel logs it. All
// remaining events (`row-click`, `update:pagination`, …) auto-wire through
// `v-bind="args"` from their `action` argTypes.
const makeStory =
  ({ rows: data, columns: cols, selection = {} }) =>
  (args) => ({
    components,
    setup() {
      const sorting = ref([])
      const rowSelection = ref({ ...selection })
      const onSorting = (next) => {
        sorting.value = next
        args['onUpdate:sorting']?.(next)
      }
      const onRowSelection = (next) => {
        rowSelection.value = next
        args['onUpdate:rowSelection']?.(next)
      }
      const onLink = makeOnLink(args)
      return {
        args,
        rows: data,
        cols,
        rowActionGroups,
        sorting,
        rowSelection,
        onSorting,
        onRowSelection,
        statusSeverity,
        onLink
      }
    },
    template: `
      <Table
        v-bind="args"
        :data="rows"
        :columns="cols"
        row-key="id"
        :sorting="sorting"
        :row-selection="rowSelection"
        @update:sorting="onSorting"
        @update:row-selection="onRowSelection"
      >
        ${CELL_SLOTS}
      </Table>
    `
  })

// --- Meta -------------------------------------------------------------------

/** @type {import('@storybook/vue3').Meta<typeof Table>} */
const meta = {
  title: 'Components/Data/Table',
  component: Table,
  subcomponents: {
    'Table.Header': TableHeader,
    'Table.Body': TableBody,
    'Table.Row': TableRow,
    'Table.HeadCell': TableHeadCell,
    'Table.Cell': TableCell
  },
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
      description: {
        component:
          'A data table with two writing styles: a compound composition form (`Table.Header` / `Table.Row` / `Table.Cell`, reached via dot-notation off the PascalCase `Table` import) composed by hand, and a data-driven form (`data` + `columns`) powered by the headless TanStack engine while rendering through our own primitives. Sorting, row selection, pagination, column sizing/resizing, and frozen (sticky) columns are built in, with state exposed via v-model.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    // --- props ---
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
    data: {
      control: false,
      description: 'Data-driven mode: row records. The stories bind a module-scope fixture.',
      table: {
        type: { summary: 'Record<string, unknown>[]' },
        defaultValue: { summary: '[]' },
        category: 'props'
      }
    },
    columns: {
      control: false,
      description:
        'Data-driven mode: column definitions (`accessorKey` / `header` / `enableSorting` / `grow` / `principal` / `width` / `frozen` / `align` / `kind` / `resizable` / `hideable` / `orderable`). When non-empty, the table renders itself via TanStack.',
      table: {
        type: { summary: 'TableColumn[]' },
        defaultValue: { summary: '[]' },
        category: 'props'
      }
    },
    rowKey: {
      control: false,
      description: 'Field used as the stable row id (for selection). The stories pin it to `id`.',
      table: { type: { summary: 'string' }, defaultValue: { summary: "'id'" }, category: 'props' }
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
      description: 'Clicking a row toggles its selection (requires `enableRowSelection`).',
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
    sorting: {
      control: false,
      description: 'v-model:sorting (TanStack SortingState). The stories hold it in a local ref.',
      table: {
        type: { summary: 'SortingState' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    rowSelection: {
      control: false,
      description:
        'v-model:rowSelection (TanStack RowSelectionState). The stories hold it in a local ref.',
      table: {
        type: { summary: 'RowSelectionState' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    columnVisibility: {
      control: false,
      description: 'v-model:columnVisibility (TanStack VisibilityState).',
      table: {
        type: { summary: 'VisibilityState' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    globalFilter: {
      control: false,
      description: 'v-model:globalFilter free-text filter (driven by `Table.Search`).',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    pagination: {
      control: false,
      description: 'v-model:pagination (TanStack PaginationState).',
      table: {
        type: { summary: 'PaginationState' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    manualSorting: {
      control: 'boolean',
      description: 'Server-side sorting: emit events, do not sort locally.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    manualPagination: {
      control: 'boolean',
      description: 'Server-side pagination: emit events, do not slice locally.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    manualFiltering: {
      control: 'boolean',
      description: 'Server-side filtering: emit events, do not filter locally.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    rowCount: {
      control: { type: 'number' },
      description: 'Total row count for manual pagination.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    rowsPerPageOptions: {
      control: 'object',
      description: 'Rows-per-page options shown in the footer selector.',
      table: {
        type: { summary: 'number[]' },
        defaultValue: { summary: '[10, 25, 50, 100]' },
        category: 'props'
      }
    },
    loading: {
      control: 'boolean',
      description:
        'Data-driven mode: render skeleton rows aligned to the visible columns and set `aria-busy`.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    filters: {
      control: false,
      description:
        'v-model:filters — structured applied conditions committed by `Table.Filter`, distinct from `globalFilter`.',
      table: {
        type: { summary: 'AppliedFilter[]' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    filterFields: {
      control: false,
      description: 'Field catalog the built-in `Table.Filter` builder offers.',
      table: {
        type: { summary: 'FilterField[]' },
        defaultValue: { summary: '[]' },
        category: 'props'
      }
    },
    state: {
      control: false,
      description:
        'v-model:state — aggregate serializable snapshot layered over the per-concern models.',
      table: {
        type: { summary: 'TableStateSnapshot' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    initialState: {
      control: false,
      description:
        'Uncontrolled seed applied once on mount; seeds only concerns not bound to their own v-model.',
      table: {
        type: { summary: 'Partial<TableStateSnapshot>' },
        defaultValue: { summary: 'undefined' },
        category: 'props'
      }
    },
    exportFilename: {
      control: 'text',
      description: 'Default filename for `Table.Export` and `exportCsv()`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: "'export.csv'" },
        category: 'props'
      }
    },
    // --- events ---
    'onUpdate:sorting': {
      action: 'update:sorting',
      description: 'v-model:sorting update.',
      table: { type: { summary: 'SortingState' }, category: 'events' }
    },
    'onUpdate:rowSelection': {
      action: 'update:rowSelection',
      description: 'v-model:rowSelection update.',
      table: { type: { summary: 'RowSelectionState' }, category: 'events' }
    },
    'onUpdate:columnVisibility': {
      action: 'update:columnVisibility',
      description: 'v-model:columnVisibility update.',
      table: { type: { summary: 'VisibilityState' }, category: 'events' }
    },
    'onUpdate:globalFilter': {
      action: 'update:globalFilter',
      description: 'v-model:globalFilter update.',
      table: { type: { summary: 'string' }, category: 'events' }
    },
    'onUpdate:pagination': {
      action: 'update:pagination',
      description: 'v-model:pagination update.',
      table: { type: { summary: 'PaginationState' }, category: 'events' }
    },
    onRowClick: {
      action: 'row-click',
      description: 'Fires when a rendered row is clicked (data-driven mode).',
      table: { type: { summary: '(event: MouseEvent, row: Record<string, unknown>)' }, category: 'events' }
    },
    'onUpdate:filters': {
      action: 'update:filters',
      description: 'v-model:filters update.',
      table: { type: { summary: 'AppliedFilter[]' }, category: 'events' }
    },
    'onUpdate:state': {
      action: 'update:state',
      description: 'v-model:state update (debounced so bursts of changes coalesce).',
      table: { type: { summary: 'TableStateSnapshot' }, category: 'events' }
    },
    onFilterApply: {
      action: 'filter-apply',
      description:
        'The filter builder was committed (Apply) — the re-query signal for `manualFiltering`.',
      table: { type: { summary: 'AppliedFilter[]' }, category: 'events' }
    },
    onFilterRemove: {
      action: 'filter-remove',
      description: 'One applied filter/chip was removed.',
      table: { type: { summary: 'AppliedFilter' }, category: 'events' }
    },
    onRefresh: {
      action: 'refresh',
      description: 'Refresh requested (`Table.RefreshButton` or `reload()`); the app refetches.',
      table: { type: { summary: '—' }, category: 'events' }
    },
    onExport: {
      action: 'export',
      description: 'Export requested with the resolved rows; a consumer may handle it server-side.',
      table: { type: { summary: 'Record<string, unknown>[]' }, category: 'events' }
    },
    // --- slots ---
    default: {
      control: false,
      description:
        'Composition mode: the scrollable region (TableCaption, TableHeader, TableBody).',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    title: {
      control: false,
      description: 'Title text at the start of the toolbar band, fixed above the scroll viewport.',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    toolbar: {
      control: false,
      description:
        'Action band above the scroll viewport, scoped with `{ table, selectedRows, selectedCount, clearSelection, loading }`. A sibling `filters` slot with the same scope renders the active-filter chips row below it (its row here is the `filters` prop — the names collide).',
      table: {
        type: { summary: '{ table, selectedRows, selectedCount, clearSelection, loading }' },
        category: 'slots'
      }
    },
    caption: {
      control: false,
      description: 'Data-driven mode: caption content (wrapped in TableCaption).',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    empty: {
      control: false,
      description:
        'Data-driven mode: shown when there are no rows. Defaults to an empty-state block; override for custom copy/actions.',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    footer: {
      control: false,
      description:
        'Footer region below the scroll viewport (never scrolls); auto-rendered when data-driven and paginated.',
      table: { type: { summary: '—' }, category: 'slots' }
    },
    'cell-<columnId>': {
      control: false,
      description:
        'Per-column body-cell slot (data-driven), resolved at runtime — e.g. `#cell-name`, `#cell-status`.',
      table: { type: { summary: '{ row, value }' }, category: 'slots' }
    },
    'header-<columnId>': {
      control: false,
      description:
        'Per-column header slot (data-driven), resolved at runtime — e.g. `#header-actions`.',
      table: { type: { summary: '{ column }' }, category: 'slots' }
    },
    // --- story-only actions (log slot interactions to the Actions panel) ---
    onRowAction: {
      action: 'row-action',
      description:
        'Story-only: logs the row-action menu selection made in the `cell-actions` slot.',
      table: { category: 'slot interactions (story only)' }
    },
    onCellClick: {
      action: 'cell-click',
      description: 'Story-only: logs the Name link click made in the `cell-name` slot.',
      table: { category: 'slot interactions (story only)' }
    }
  },
  args: { ...baseArgs }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const Default = {
  render: makeStory({ rows, columns }),
  args: {
    border: true
  },
  parameters: {
    docs: {
      description: {
        story:
          'A standard data-driven table: pass `:data` and `:columns` and the engine renders sortable headers, status `Tag`s, per-row action menus, and pagination. The outer card border is drawn via the `border` prop — the table is borderless by default (it usually sits inside a surface that already frames it), so set `border` to draw the `var(--border-default)` outline; the internal row dividers are unaffected either way.'
      },
      source: { code: dataDrivenSnippet({ ...baseArgs, border: true }, { cols: columns }) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const Composition = {
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
      description: {
        story:
          'The compound API: build the table by hand from `<Table.Header>` / `<Table.Row>` / `<Table.HeadCell>` / `<Table.Cell>`. The result is an ordinary table — the same as the data-driven API — but you control every cell. Reach for it when a cell needs custom content; otherwise prefer `:data` + `:columns`.'
      },
      source: { code: COMPOSITION_SOURCE }
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
      description: {
        story:
          'A leading selection column (`enable-row-selection`): each row gets a checkbox and the header gets a select-all box that reflects the all/none/indeterminate state. Selection is exposed via `v-model:row-selection`; changes log to the Actions panel.'
      },
      source: {
        code: dataDrivenSnippet({ ...baseArgs, enableRowSelection: true }, { cols: columns })
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
      description: {
        story:
          'A denser header via `header-kind="compact"` (forwarded to `Table.Header`): the column-header row uses a reduced height and padding, so the table opens straight onto that header row.'
      },
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, paginated: false, headerKind: 'compact' },
          { cols: columns }
        )
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
      description: {
        story:
          'A row in the selected state: the second row is pre-selected via `v-model:row-selection`, rendering the `var(--bg-selected)` surface and `aria-selected`. With `select-on-row-click`, clicking anywhere on an inert part of a row toggles its selection.'
      },
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, enableRowSelection: true, selectOnRowClick: true },
          { cols: columns, selectionLiteral: "const rowSelection = ref({ '1002': true })" }
        )
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
      description: {
        story:
          'Every column declares an explicit pixel `width`, so the layout is fixed: columns keep their declared size instead of distributing to fill the surface, and the viewport scrolls horizontally if the widths sum past it.'
      },
      source: { code: dataDrivenSnippet({ ...baseArgs }, { cols: sizedColumns }) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const ResizableColumns = {
  name: 'Resizable Columns',
  render: makeStory({ rows, columns: resizableColumns }),
  parameters: {
    docs: {
      description: {
        story:
          'A simple table whose columns opt into drag-to-resize via per-column `resizable: true`. Drag a header divider: only that column resizes (the others freeze at their current width) and the table grows with horizontal scroll. A column can shrink only down to its own content width. Frozen and action columns ignore `resizable`.'
      },
      source: { code: dataDrivenSnippet({ ...baseArgs }, { cols: resizableColumns }) }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const StickyColumn = {
  name: 'Sticky Column',
  render: makeStory({ rows, columns: wideColumns }),
  parameters: {
    docs: {
      description: {
        story:
          'Extra columns (Protocol, Domains, Origins, Created) push the rows past the surface. The **Name** column is pinned to the start edge (`frozen: "start"`) and the **actions** menu to the end edge (`frozen: "end"`): both stay put while the middle columns scroll horizontally underneath, with a CSS-only edge fade dissolving the scrolling content under each pinned column.'
      },
      source: { code: dataDrivenSnippet({ ...baseArgs }, { cols: wideColumns }) }
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
      description: {
        story:
          'A compact header (`header-kind="compact"`) combined with the freeze system: the frozen **Name** / **actions** columns stay pinned while the middle columns scroll horizontally, and the denser header is sticky within the scroll viewport. No paginator.'
      },
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, paginated: false, headerKind: 'compact' },
          { cols: wideColumns }
        )
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const Empty = {
  render: makeStory({ rows: [], columns }),
  args: {
    border: true,
    paginated: false
  },
  parameters: {
    docs: {
      description: {
        story:
          'When `data` is empty, the table renders a default empty state in the `#empty` slot — an illustration, a title, and a short description. Override the `#empty` slot to supply your own copy and call-to-action (e.g. a Create button or a documentation link).'
      },
      source: {
        code: dataDrivenSnippet(
          { ...baseArgs, border: true, paginated: false },
          { cols: columns, rowsLiteral: 'const rows = []' }
        )
      }
    }
  }
}

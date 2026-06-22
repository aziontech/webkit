import Chip from '@aziontech/webkit/chip'
import Table from '@aziontech/webkit/data/table'
import IconButton from '@aziontech/webkit/icon-button'
import DropdownMenu from '@aziontech/webkit/overlay/dropdown-menu'
import DropdownMenuContent from '@aziontech/webkit/overlay/dropdown-menu-content'
import {
  dropdownMenuItem,
  dropdownMenuSeparator
} from '@aziontech/webkit/overlay/dropdown-menu-factory'
import DropdownMenuFromModel from '@aziontech/webkit/overlay/dropdown-menu-from-model'
import DropdownMenuPortal from '@aziontech/webkit/overlay/dropdown-menu-portal'
import DropdownMenuTrigger from '@aziontech/webkit/overlay/dropdown-menu-trigger'
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
  DropdownMenuFromModel
}

// --- Static, non-reactive fixtures -----------------------------------------
// Defined once at module scope (never wrapped in ref/reactive) so the rows
// carry no per-row reactivity overhead and are shared across every render.

const applications = Object.freeze([
  {
    id: '1773684562',
    name: 'webkit-storybook',
    status: 'Active',
    editor: 'robson.junior+v4@azion.com',
    modified: 'Jun 18, 2026, 06:31:37 PM'
  },
  {
    id: '1780526808',
    name: 'teste app',
    status: 'Active',
    editor: 'guilherme.santana+v4@azion.com',
    modified: 'Jun 3, 2026, 07:35:44 PM'
  },
  {
    id: '1778769112',
    name: 'teste-do-ng-new-template',
    status: 'Active',
    editor: 'paulo.ferreira+v4@azion.com',
    modified: 'May 14, 2026, 11:46:14 AM'
  },
  {
    id: '1772542164',
    name: 'icons-gallery',
    status: 'Active',
    editor: 'robson.junior+v4@azion.com',
    modified: 'Apr 30, 2026, 02:24:06 PM'
  },
  {
    id: '1775518977',
    name: 'azion-console-kit-storybook',
    status: 'Active',
    editor: 'robson.junior+v4@azion.com',
    modified: 'Apr 13, 2026, 03:28:51 PM'
  },
  {
    id: '1779034218',
    name: 'edge-functions-demo',
    status: 'Active',
    editor: 'herbert.julio+v4@azion.com',
    modified: 'Apr 2, 2026, 09:12:08 AM'
  },
  {
    id: '1771902645',
    name: 'api-gateway-prod',
    status: 'Active',
    editor: 'maria.lima+v4@azion.com',
    modified: 'Mar 27, 2026, 05:48:19 PM'
  },
  {
    id: '1776510338',
    name: 'static-site-blog',
    status: 'Inactive',
    editor: 'lucas.alves+v4@azion.com',
    modified: 'Mar 19, 2026, 11:03:55 AM'
  },
  {
    id: '1770448901',
    name: 'image-optimizer',
    status: 'Active',
    editor: 'guilherme.santana+v4@azion.com',
    modified: 'Mar 8, 2026, 02:37:41 PM'
  },
  {
    id: '1778221764',
    name: 'waf-rules-staging',
    status: 'Degraded',
    editor: 'paulo.ferreira+v4@azion.com',
    modified: 'Feb 28, 2026, 07:54:12 PM'
  },
  {
    id: '1772990057',
    name: 'cache-purge-tool',
    status: 'Active',
    editor: 'robson.junior+v4@azion.com',
    modified: 'Feb 21, 2026, 10:26:30 AM'
  },
  {
    id: '1774663180',
    name: 'dns-manager',
    status: 'Active',
    editor: 'herbert.julio+v4@azion.com',
    modified: 'Feb 12, 2026, 04:09:47 PM'
  },
  {
    id: '1771135492',
    name: 'load-balancer-test',
    status: 'Inactive',
    editor: 'maria.lima+v4@azion.com',
    modified: 'Feb 3, 2026, 08:41:05 AM'
  },
  {
    id: '1779558613',
    name: 'video-streaming',
    status: 'Active',
    editor: 'lucas.alves+v4@azion.com',
    modified: 'Jan 27, 2026, 01:18:53 PM'
  },
  {
    id: '1773320926',
    name: 'auth-service',
    status: 'Active',
    editor: 'guilherme.santana+v4@azion.com',
    modified: 'Jan 19, 2026, 06:02:34 PM'
  },
  {
    id: '1776847209',
    name: 'analytics-dashboard',
    status: 'Degraded',
    editor: 'paulo.ferreira+v4@azion.com',
    modified: 'Jan 9, 2026, 09:47:21 AM'
  },
  {
    id: '1770773542',
    name: 'docs-portal',
    status: 'Active',
    editor: 'robson.junior+v4@azion.com',
    modified: 'Dec 30, 2025, 03:33:16 PM'
  },
  {
    id: '1778004885',
    name: 'marketplace-app',
    status: 'Active',
    editor: 'herbert.julio+v4@azion.com',
    modified: 'Dec 18, 2025, 11:55:48 AM'
  },
  {
    id: '1772457118',
    name: 'live-ingest-demo',
    status: 'Inactive',
    editor: 'maria.lima+v4@azion.com',
    modified: 'Dec 7, 2025, 05:24:09 PM'
  },
  {
    id: '1775190431',
    name: 'edge-sql-playground',
    status: 'Active',
    editor: 'lucas.alves+v4@azion.com',
    modified: 'Nov 26, 2025, 02:11:37 PM'
  },
  {
    id: '1779713764',
    name: 'network-lists-admin',
    status: 'Active',
    editor: 'guilherme.santana+v4@azion.com',
    modified: 'Nov 14, 2025, 08:39:50 AM'
  },
  {
    id: '1773846097',
    name: 'origin-shield-test',
    status: 'Active',
    editor: 'paulo.ferreira+v4@azion.com',
    modified: 'Nov 3, 2025, 04:57:22 PM'
  },
  {
    id: '1776239350',
    name: 'realtime-metrics',
    status: 'Degraded',
    editor: 'robson.junior+v4@azion.com',
    modified: 'Oct 22, 2025, 10:48:14 AM'
  },
  {
    id: '1771568683',
    name: 'certificate-manager',
    status: 'Active',
    editor: 'herbert.julio+v4@azion.com',
    modified: 'Oct 11, 2025, 01:29:06 PM'
  },
  {
    id: '1778392016',
    name: 'data-stream-pipeline',
    status: 'Active',
    editor: 'maria.lima+v4@azion.com',
    modified: 'Sep 30, 2025, 07:15:43 PM'
  }
])

// No explicit `width` — columns distribute across the full container via their
// `grow` flex weight, so the table fills the surface with no horizontal scroll.
const columns = [
  { accessorKey: 'name', header: 'Name', grow: 2 },
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

// Wide variant: the same rows extended with extra fields so the table has more
// columns than fit the surface. Derived deterministically (no per-row reactivity).
const protocols = ['HTTP & HTTPS', 'HTTP', 'HTTPS', 'gRPC']
const createdPool = [
  'Jan 14, 2026, 10:22:00 AM',
  'Nov 28, 2025, 03:41:18 PM',
  'Oct 5, 2025, 09:15:44 AM',
  'Sep 12, 2025, 06:50:09 PM',
  'Aug 1, 2025, 11:30:27 AM',
  'Jul 19, 2025, 02:08:53 PM',
  'Jun 6, 2025, 04:44:36 PM',
  'May 23, 2025, 08:17:12 AM'
]

const applicationsWide = Object.freeze(
  applications.map((app, index) => ({
    ...app,
    protocol: protocols[index % protocols.length],
    domains: (index % 5) + 1,
    origins: (index % 3) + 1,
    created: createdPool[index % createdPool.length]
  }))
)

// Larger dataset for the Full Example: the wide rows replicated to ~48 entries
// so the paginator spans several pages. Ids stay unique (base id + index) and
// later cycles get a numeric suffix on the name.
const applicationsLarge = Object.freeze(
  Array.from({ length: 48 }, (_, index) => {
    const base = applicationsWide[index % applicationsWide.length]
    const cycle = Math.floor(index / applicationsWide.length)
    return {
      ...base,
      id: String(Number(base.id) + index),
      name: cycle === 0 ? base.name : `${base.name}-${cycle}`
    }
  })
)

// Every column carries an explicit `width` so the row widths sum past the
// surface (horizontal scroll). Name is pinned to the start edge and the actions
// menu to the end edge — both stay put while the middle columns scroll under them.
const wideColumns = [
  { accessorKey: 'name', header: 'Name', grow: 2, frozen: 'start', width: 260 },
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
// column resizable powers the Resizable Columns story; the wide set with every
// column resizable powers Full Example (frozen Name + action ignore the flag).
const resizableColumns = columns.map((col) => ({ ...col, resizable: true }))
const fullColumns = wideColumns.map((col) => ({ ...col, resizable: true }))

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
// The per-cell slots are identical across every story (the Name link, the
// Status Tag, and the trailing row-action menu), so they live in one constant
// interpolated into each template instead of being copy-pasted per story.

const CELL_SLOTS = `
        <template #cell-name="{ row, value }">
          <a
            :href="'/applications/' + row.id"
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

// Render factory: every story is the same data-driven <Table> wired to the
// controls; only the data set, the column set, the pre-seeded selection, extra
// root attributes, and (Full only) the toolbar differ.
const makeStory =
  ({ rows, columns: cols, selection = {}, attrs = '', toolbar = '' }) =>
  (args) => ({
    components,
    setup() {
      const sorting = ref([])
      const rowSelection = ref({ ...selection })
      const onLink = makeOnLink(args)
      return { args, rows, cols, rowActionNodes, sorting, rowSelection, statusSeverity, onLink }
    },
    template: `
      <Table
        :data="rows"
        :columns="cols"
        row-key="id"
        :max-height="args.maxHeight"
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
        ${attrs}
      >
        ${toolbar}${CELL_SLOTS}
      </Table>
    `
  })

// --- Docs ------------------------------------------------------------------

const docs = [
  '## Table',
  '',
  'A data-driven table built on the headless TanStack engine and rendered entirely',
  'through our own primitives (markup, design tokens, a11y). Pass `data` + `columns`',
  'and the table renders rows, sorting, selection, pagination, and frozen columns for',
  'you; customise any cell with a `cell-<columnId>` slot.',
  '',
  '### Basic usage',
  '',
  '```vue',
  '<script setup>',
  "import { ref } from 'vue'",
  "import Table from '@aziontech/webkit/data/table'",
  "import Tag from '@aziontech/webkit/tag'",
  '',
  "const data = ref([{ id: '1', name: 'acme-prod', status: 'Active' }])",
  'const columns = [',
  "  { accessorKey: 'name', header: 'Name', grow: 2 },",
  "  { accessorKey: 'status', header: 'Status' },",
  "  { id: 'actions', header: '', kind: 'action' }",
  ']',
  '</script>',
  '',
  '<template>',
  '  <Table :data="data" :columns="columns" row-key="id" enable-sorting paginated>',
  '    <template #cell-status="{ value }"><Tag>{{ value }}</Tag></template>',
  '    <template #cell-actions="{ row }"><!-- row menu --></template>',
  '  </Table>',
  '</template>',
  '```',
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
  'through v-model (`sorting`, `row-selection`, `pagination`, `global-filter`).',
  '',
  '### Toolbar (optional)',
  '',
  'The `toolbar` / `filters` slots add an action band above the viewport, scoped with the',
  'TanStack `table` instance — a context-aware `Table.Search` drives the global filter and a',
  'removable `Chip` clears it (see **Full Example**). Omit the slots for a compact,',
  'header-only table.'
].join('\n')

// Inline SVG mock of the assembled table, embedded in the Full Example docs as a
// reference preview (dark theme, matching the design tokens visually).
const FULL_EXAMPLE_PREVIEW_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="1180" height="384" viewBox="0 0 1180 384" font-family="-apple-system,Segoe UI,Roboto,sans-serif">
  <rect x="6" y="6" width="1168" height="372" rx="10" fill="#1b1b1e" stroke="#34343a"/>
  <rect x="22" y="20" width="40" height="30" rx="7" fill="#232327" stroke="#3a3a40"/>
  <path d="M32 28h20l-7 8v8l-6 3v-11z" fill="none" stroke="#9a9aa2" stroke-width="1.6" stroke-linejoin="round"/>
  <rect x="72" y="20" width="300" height="30" rx="7" fill="#232327" stroke="#3a3a40"/>
  <circle cx="90" cy="34" r="5" fill="none" stroke="#7a7a82" stroke-width="1.6"/>
  <line x1="94" y1="38" x2="98" y2="42" stroke="#7a7a82" stroke-width="1.6"/>
  <text x="108" y="39" fill="#6c6c74" font-size="13">Search keywords...</text>
  <rect x="1050" y="20" width="34" height="30" rx="7" fill="#232327" stroke="#3a3a40"/>
  <path d="M1059 36a8 8 0 1 0 2-6" fill="none" stroke="#9a9aa2" stroke-width="1.6"/>
  <path d="M1061 24v6h6" fill="none" stroke="#9a9aa2" stroke-width="1.6"/>
  <rect x="1090" y="20" width="34" height="30" rx="7" fill="#232327" stroke="#3a3a40"/>
  <path d="M1107 26v12m-5-5l5 5l5-5M1101 44h12" fill="none" stroke="#9a9aa2" stroke-width="1.6"/>
  <rect x="1130" y="20" width="34" height="30" rx="7" fill="#232327" stroke="#3a3a40"/>
  <path d="M1140 27v12M1147 27v12M1136 27h16" fill="none" stroke="#9a9aa2" stroke-width="1.6"/>
  <line x1="6" y1="64" x2="1174" y2="64" stroke="#2c2c32"/>
  <rect x="22" y="76" width="150" height="26" rx="13" fill="#2a2a30"/>
  <text x="34" y="93" fill="#d3d3d8" font-size="12.5">Name is: test</text>
  <circle cx="160" cy="89" r="7" fill="#3a3a42"/>
  <path d="M157 86l6 6M163 86l-6 6" stroke="#c9c9d0" stroke-width="1.3"/>
  <line x1="6" y1="116" x2="1174" y2="116" stroke="#2c2c32"/>
  <rect x="26" y="129" width="16" height="16" rx="4" fill="none" stroke="#5a5a62" stroke-width="1.6"/>
  <text x="60" y="141" fill="#8b8b92" font-size="12.5" font-weight="600">Name</text>
  <text x="320" y="141" fill="#8b8b92" font-size="12.5" font-weight="600">ID</text>
  <text x="470" y="141" fill="#8b8b92" font-size="12.5" font-weight="600">Status</text>
  <text x="600" y="141" fill="#8b8b92" font-size="12.5" font-weight="600">Last Editor</text>
  <text x="880" y="141" fill="#8b8b92" font-size="12.5" font-weight="600">Last Modified</text>
  <line x1="6" y1="153" x2="1174" y2="153" stroke="#2c2c32"/>
  <g>
    <rect x="26" y="173" width="16" height="16" rx="4" fill="#1f6feb"/>
    <path d="M30 181l3 3l5-6" fill="none" stroke="#fff" stroke-width="1.6"/>
    <text x="60" y="186" fill="#e7e7ea" font-size="13">webkit-storybook</text>
    <text x="320" y="186" fill="#9a9aa2" font-size="13">1773684562</text>
    <rect x="470" y="173" width="62" height="22" rx="11" fill="#123524"/>
    <text x="483" y="188" fill="#52d07f" font-size="12">Active</text>
    <text x="600" y="186" fill="#9a9aa2" font-size="13">robson.junior@azion.com</text>
    <text x="880" y="186" fill="#9a9aa2" font-size="13">Jun 18, 2026, 06:31:37 PM</text>
    <circle cx="1147" cy="178" r="1.6" fill="#9a9aa2"/><circle cx="1147" cy="184" r="1.6" fill="#9a9aa2"/><circle cx="1147" cy="190" r="1.6" fill="#9a9aa2"/>
    <line x1="6" y1="207" x2="1174" y2="207" stroke="#26262b"/>
  </g>
  <g>
    <rect x="26" y="227" width="16" height="16" rx="4" fill="none" stroke="#5a5a62" stroke-width="1.6"/>
    <text x="60" y="240" fill="#e7e7ea" font-size="13">teste app</text>
    <text x="320" y="240" fill="#9a9aa2" font-size="13">1780526808</text>
    <rect x="470" y="227" width="62" height="22" rx="11" fill="#123524"/>
    <text x="483" y="242" fill="#52d07f" font-size="12">Active</text>
    <text x="600" y="240" fill="#9a9aa2" font-size="13">guilherme.santana@azion.com</text>
    <text x="880" y="240" fill="#9a9aa2" font-size="13">Jun 3, 2026, 07:35:44 PM</text>
    <circle cx="1147" cy="232" r="1.6" fill="#9a9aa2"/><circle cx="1147" cy="238" r="1.6" fill="#9a9aa2"/><circle cx="1147" cy="244" r="1.6" fill="#9a9aa2"/>
    <line x1="6" y1="261" x2="1174" y2="261" stroke="#26262b"/>
  </g>
  <g>
    <rect x="26" y="281" width="16" height="16" rx="4" fill="none" stroke="#5a5a62" stroke-width="1.6"/>
    <text x="60" y="294" fill="#e7e7ea" font-size="13">static-site-blog</text>
    <text x="320" y="294" fill="#9a9aa2" font-size="13">1776510338</text>
    <rect x="470" y="281" width="70" height="22" rx="11" fill="#3a1a1c"/>
    <text x="483" y="296" fill="#f0656f" font-size="12">Inactive</text>
    <text x="600" y="294" fill="#9a9aa2" font-size="13">lucas.alves@azion.com</text>
    <text x="880" y="294" fill="#9a9aa2" font-size="13">Mar 19, 2026, 11:03:55 AM</text>
    <circle cx="1147" cy="286" r="1.6" fill="#9a9aa2"/><circle cx="1147" cy="292" r="1.6" fill="#9a9aa2"/><circle cx="1147" cy="298" r="1.6" fill="#9a9aa2"/>
  </g>
  <line x1="6" y1="320" x2="1174" y2="320" stroke="#2c2c32"/>
  <text x="470" y="356" fill="#8b8b92" font-size="12.5">Showing 1 to 10 of 48 entries</text>
  <g fill="none" stroke="#6a6a72" stroke-width="1.5">
    <path d="M724 346l-4 4l4 4M732 346l-4 4l4 4"/>
    <path d="M756 346l-4 4l4 4"/>
  </g>
  <rect x="776" y="340" width="24" height="22" rx="6" fill="#1f6feb"/>
  <text x="784" y="356" fill="#fff" font-size="12.5">1</text>
  <text x="812" y="356" fill="#9a9aa2" font-size="12.5">2</text>
  <text x="838" y="356" fill="#9a9aa2" font-size="12.5">3</text>
  <text x="864" y="356" fill="#9a9aa2" font-size="12.5">4</text>
  <g fill="none" stroke="#6a6a72" stroke-width="1.5">
    <path d="M892 346l4 4l-4 4"/>
    <path d="M916 346l4 4l-4 4M924 346l4 4l-4 4"/>
  </g>
  <rect x="1004" y="340" width="58" height="24" rx="6" fill="#232327" stroke="#3a3a40"/>
  <text x="1014" y="356" fill="#c9c9d0" font-size="12.5">10</text>
  <path d="M1048 350l4 4l4-4" fill="none" stroke="#9a9aa2" stroke-width="1.5"/>
  <rect x="1130" y="340" width="34" height="24" rx="6" fill="#232327" stroke="#3a3a40"/>
  <text x="1143" y="356" fill="#c9c9d0" font-size="12.5">1</text>
</svg>
`

const fullExamplePreview =
  'data:image/svg+xml;utf8,' + encodeURIComponent(FULL_EXAMPLE_PREVIEW_SVG.trim())

/** @type {import('@storybook/vue3').Meta<typeof Table>} */
const meta = {
  title: 'Webkit/Data/Table',
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
  args: {
    maxHeight: '',
    paginated: true,
    pageSize: 10,
    enableSorting: true,
    enableRowSelection: false,
    selectOnRowClick: false,
    headerVariant: 'default'
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const WithCheckboxes = {
  name: 'With Checkboxes',
  render: makeStory({ rows: applications, columns }),
  args: {
    enableRowSelection: true
  },
  parameters: {
    docs: {
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
  render: makeStory({ rows: applications, columns }),
  args: {
    paginated: false,
    headerVariant: 'compact'
  },
  parameters: {
    docs: {
      description: {
        story:
          'A denser header via `header-variant="compact"` (forwarded to `Table.Header`): the column-header row uses a reduced height and padding. No toolbar band, so the table opens straight onto that header row.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const NoBorder = {
  name: 'No Border',
  render: makeStory({ rows: applications, columns, attrs: 'class="!border-0"' }),
  parameters: {
    docs: {
      description: {
        story:
          'The outer card border removed by passing a utility class (`class="!border-0"`) — it flows onto the root via attribute fallthrough. Useful when the table sits inside a surface that already provides its own framing. The internal row dividers remain.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const SelectedRow = {
  name: 'Selected Row',
  render: makeStory({
    rows: applications,
    columns,
    selection: { [applications[1].id]: true }
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
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof Table>} */
export const FixedLayoutWithColumnSizes = {
  name: 'Fixed Layout with Column Sizes',
  render: makeStory({ rows: applications, columns: sizedColumns }),
  parameters: {
    docs: {
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
  render: makeStory({ rows: applications, columns: resizableColumns }),
  parameters: {
    docs: {
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
  render: makeStory({ rows: applicationsWide, columns: wideColumns }),
  parameters: {
    docs: {
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
  render: makeStory({ rows: applicationsWide, columns: wideColumns }),
  args: {
    paginated: false,
    headerVariant: 'compact'
  },
  parameters: {
    docs: {
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
    rows: applicationsLarge,
    columns: fullColumns,
    toolbar: FULL_TOOLBAR
  }),
  args: {
    enableRowSelection: true,
    selectOnRowClick: false
  },
  parameters: {
    docs: {
      description: {
        story:
          'The complete data table over a larger dataset (48 rows across several pages): a composed toolbar (filter / context-aware search / refresh / export / column-selector) wired through the scoped `#toolbar="{ table }"` / `#filters="{ table }"` slots — the search drives `table.setGlobalFilter` and the removable chip clears it — plus select-all + sortable headers, status Tags, per-row actions, frozen Name + actions columns, every other column `resizable`, and a paginator.\n\nReference preview:\n\n![Full data table example](' +
          fullExamplePreview +
          ')'
      }
    }
  }
}

import Avatar from '@aziontech/webkit/avatar'
import Badge from '@aziontech/webkit/badge'
import Button from '@aziontech/webkit/button'
import CalendarRoot from '@aziontech/webkit/calendar-root'
import CardBox from '@aziontech/webkit/card-box'
import Chip from '@aziontech/webkit/chip'
import CopyButton from '@aziontech/webkit/copy-button'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
import DropdownRoot from '@aziontech/webkit/dropdown-root'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import EmptyState from '@aziontech/webkit/empty-state'
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLIED_CHIPS,
  constLine,
  controlsRow,
  DATE_FILTER_SCRIPT,
  DATE_PRESETS,
  dateRange,
  daysAgo,
  exportButton,
  formatDateRange,
  idCell,
  lastModifiedCell,
  LIST_COMPONENT_IMPORTS,
  listPage,
  listStateScript,
  mergeImports,
  pageHeading,
  rowActions,
  searchField,
  useListPage,
  withinRange} from './_lists-markup'

const components = {
  Avatar,
  Badge,
  Button,
  CalendarRoot,
  CardBox,
  Chip,
  CopyButton,
  DropdownRoot,
  DropdownGroup,
  DropdownOption,
  DropdownTrigger,
  EmptyState,
  IconButton,
  InputText,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const COLUMNS = [
  { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'id', header: 'ID', minWidth: 80 },
  { accessorKey: 'mode', header: 'Mode', enableSorting: true, minWidth: 80 },
  { accessorKey: 'threatLabels', header: 'Threat Types', grow: 3 },
  { accessorKey: 'sensitivity', header: 'Sensitivity', enableSorting: true, minWidth: 80 },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
  { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const RULE_SETS = [
  {
    id: '9930041',
    name: 'OWASP Core',
    mode: 'Blocking',
    threatLabels: [
      'SQL Injection',
      'Cross-Site Scripting (XSS)',
      'Remote File Inclusion (RFI)',
      'Directory Traversal',
      'Identified Attack'
    ],
    sensitivity: 'High',
    status: 'Active',
    author: 'Robson Junior',
    days: 8,
    lastModified: '1 week ago'
  },
  {
    id: '9930042',
    name: 'API Strict',
    mode: 'Blocking',
    threatLabels: ['SQL Injection', 'Identified Attack', 'Evading Tricks'],
    sensitivity: 'Highest',
    status: 'Active',
    author: 'Isaque Böck',
    days: 3,
    lastModified: '3 days ago'
  },
  {
    id: '9930043',
    name: 'Upload Guard',
    mode: 'Learning',
    threatLabels: ['File Upload', 'Remote File Inclusion (RFI)'],
    sensitivity: 'Medium',
    status: 'Active',
    author: 'Rafael Garbinatto',
    days: 23,
    lastModified: '3 weeks ago'
  },
  {
    id: '9930044',
    name: 'Marketing Lenient',
    mode: 'Learning',
    threatLabels: ['Cross-Site Scripting (XSS)'],
    sensitivity: 'Low',
    status: 'Inactive',
    author: 'Herbert Júlio',
    days: 71,
    lastModified: '2 months ago'
  },
  {
    id: '9930045',
    name: 'Checkout Hardened',
    mode: 'Blocking',
    threatLabels: [
      'SQL Injection',
      'Cross-Site Scripting (XSS)',
      'Identified Attack',
      'Evading Tricks'
    ],
    sensitivity: 'Highest',
    status: 'Active',
    author: 'Rafael Umman',
    days: 1,
    lastModified: '1 day ago'
  }
]

const ROWS = RULE_SETS.map((row) => ({ ...row, modifiedAt: daysAgo(row.days) }))

const FIELDS = [
  {
    id: 'mode',
    label: 'Mode',
    kind: 'options',
    options: [
      { value: 'Blocking', label: 'Blocking' },
      { value: 'Learning', label: 'Learning' }
    ],
    match: (row, values) => values.includes(row.mode)
  },
  {
    id: 'sensitivity',
    label: 'Sensitivity',
    kind: 'options',
    options: [
      { value: 'Low', label: 'Low' },
      { value: 'Medium', label: 'Medium' },
      { value: 'High', label: 'High' },
      { value: 'Highest', label: 'Highest' }
    ],
    match: (row, values) => values.includes(row.sensitivity)
  },
  {
    id: 'status',
    label: 'Status',
    kind: 'options',
    options: [
      { value: 'Active', label: 'Active' },
      { value: 'Inactive', label: 'Inactive' }
    ],
    match: (row, values) => values.includes(row.status)
  },
  {
    id: 'modified',
    label: 'Last Modified',
    kind: 'range',
    options: DATE_PRESETS,
    formatValue: formatDateRange,
    match: (row, values) => withinRange(row.modifiedAt, dateRange(values[0]))
  }
]

const FIELDS_SCRIPT = [
  'const filterFields = [',
  '  {',
  "    id: 'mode',",
  "    label: 'Mode',",
  "    kind: 'options',",
  '    options: [',
  "      { value: 'Blocking', label: 'Blocking' },",
  "      { value: 'Learning', label: 'Learning' }",
  '    ],',
  '    match: (row, values) => values.includes(row.mode)',
  '  },',
  '  {',
  "    id: 'sensitivity',",
  "    label: 'Sensitivity',",
  "    kind: 'options',",
  '    options: [',
  "      { value: 'Low', label: 'Low' },",
  "      { value: 'Medium', label: 'Medium' },",
  "      { value: 'High', label: 'High' },",
  "      { value: 'Highest', label: 'Highest' }",
  '    ],',
  '    match: (row, values) => values.includes(row.sensitivity)',
  '  },',
  '  {',
  "    id: 'status',",
  "    label: 'Status',",
  "    kind: 'options',",
  '    options: [',
  "      { value: 'Active', label: 'Active' },",
  "      { value: 'Inactive', label: 'Inactive' }",
  '    ],',
  '    match: (row, values) => values.includes(row.status)',
  '  },',
  '  {',
  "    id: 'modified',",
  "    label: 'Last Modified',",
  "    kind: 'range',",
  '    options: DATE_PRESETS,',
  '    formatValue: formatDateRange,',
  '    match: (row, values) => withinRange(row.modifiedAt, dateRange(values[0]))',
  '  }',
  ']'
]

const HEADING = pageHeading({
  title: 'WAF Rules',
  description:
    'Manage the rule sets that inspect traffic for injection, scripting, and file-inclusion attempts.',
  docs: 'https://www.azion.com/en/documentation/products/secure/edge-firewall/web-application-firewall/',
  action: 'Create WAF Rule Set'
})

const CONTROLS = controlsRow({
  search: searchField('Search rule sets'),
  exportButton: exportButton('waf-rule-sets.csv')
})

const TABLE = `<section class="flex min-h-0 flex-col">
  <CardBox :padded="false">
    <template #content>
      <TableRoot
        ref="tableRef"
        v-model:pagination="pagination"
        v-model:globalFilter="search"
        v-model:columnVisibility="columnVisibility"
        :data="visibleRows"
        :columns="columns"
        row-key="id"
        enable-sorting
        paginated
        :page-size="8"
        :border="false"
        :loading="loading"
      >
        <template #cell-name="{ value }">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <i class="ai ai-waf-rules shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
            <span class="truncate cursor-pointer hover:underline">{{ value }}</span>
          </div>
        </template>
${indent(idCell('WAF rule set'), 4)}
        <template #cell-mode="{ value }">
          <span class="truncate text-body-sm text-(--text-default)">{{ value }}</span>
        </template>
        <template #cell-threatLabels="{ row }">
          <span v-if="!row.threatLabels.length" class="text-body-sm text-(--text-muted)">—</span>
          <span v-else class="flex w-full min-w-0 items-center gap-(--spacing-xs)">
            <span class="min-w-0 truncate text-body-sm text-(--text-default)">{{ row.threatLabels[0] }}</span>
            <PopoverRoot v-if="row.threatLabels.length > 1" placement="bottom-start" width="small">
              <PopoverTrigger @click.stop>
                <Tag :label="'+' + (row.threatLabels.length - 1)" severity="secondary" size="small" class="shrink-0 cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent @click.stop>
                <div class="flex max-h-(--container-xs) flex-col overflow-auto overscroll-contain p-(--spacing-xxs)">
                  <p class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)">
                    {{ row.threatLabels.length }} threat types
                  </p>
                  <span
                    v-for="item in row.threatLabels"
                    :key="item"
                    class="truncate px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default)"
                  >{{ item }}</span>
                </div>
              </PopoverContent>
            </PopoverRoot>
          </span>
        </template>
        <template #cell-status="{ value }">
          <Tag :label="value" :severity="value === 'Active' ? 'success' : 'secondary'" size="medium" />
        </template>
${indent(lastModifiedCell('lastModified', 'author'), 4)}
${indent(
  rowActions({
    tooltip: 'Actions',
    groups: [
      [
        { value: 'edit', label: 'Edit', icon: 'pi pi-pencil' },
        { value: 'clone', label: 'Clone', icon: 'pi pi-clone' }
      ],
      [{ value: 'delete', label: 'Delete', icon: 'pi pi-trash' }]
    ]
  }),
  4
)}
      </TableRoot>
    </template>
  </CardBox>
</section>`

const DEFAULT_TEMPLATE = listPage({
  heading: HEADING,
  body: `${CONTROLS}
${APPLIED_CHIPS}
${TABLE}`
})

const EMPTY_CARD = `<section class="flex min-h-0 flex-1 items-center justify-center">
  <CardBox class="w-full max-w-(--container-2xl)">
    <template #content>
      <EmptyState
        size="medium"
        title="No WAF rule sets yet"
        description="Create a rule set to inspect traffic for injection, scripting and file-inclusion attempts."
        class="flex-1 rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
      >
        <template #icon>
          <span class="relative flex size-10 items-center justify-center">
            <span
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
            />
            <span
              aria-hidden="true"
              class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
            />
            <span class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)">
              <i class="ai ai-waf-rules text-body-md leading-none text-(--text-default)" aria-hidden="true" />
            </span>
          </span>
        </template>
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <Button label="Create WAF Rule Set" icon="pi pi-plus" kind="secondary" size="small" />
            <Button
              label="Docs"
              icon="pi pi-book"
              kind="outlined"
              size="small"
              href="https://www.azion.com/en/documentation/products/secure/edge-firewall/web-application-firewall/"
              target="_blank"
            />
          </div>
        </template>
      </EmptyState>
    </template>
  </CardBox>
</section>`

const EMPTY_TEMPLATE = listPage({ heading: HEADING, body: EMPTY_CARD })

const ROWS_SCRIPT = [
  'const daysAgo = (days) => new Date(Date.now() - days * 86_400_000)',
  '',
  `const rows = ${constLine('x', RULE_SETS).slice('const x = '.length)}.map((row) => ({`,
  '  ...row,',
  '  modifiedAt: daysAgo(row.days)',
  '}))'
]

const SCRIPT = [
  ...LIST_COMPONENT_IMPORTS,
  "import { computed, nextTick, ref, watch } from 'vue'",
  '',
  ...DATE_FILTER_SCRIPT,
  '',
  ...FIELDS_SCRIPT,
  '',
  constLine('columns', COLUMNS),
  '',
  ...ROWS_SCRIPT,
  '',
  ...listStateScript({}, 8)
]

const EMPTY_SCRIPT = mergeImports([
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import EmptyState from '@aziontech/webkit/empty-state'"
])

const meta = {
  title: 'Templates/Platform/Lists/WafRules',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The WAF Rules index under Secure: the ModuleList page with the WAF rule set columns and the in-list empty card every console index now keeps. Status is the one chip in the row, a success or secondary `Tag`; Mode and Sensitivity are plain text; Threat Types shows the first threat as text and a +N `Tag` that opens a `Popover` listing all of them; Last Modified is the editor’s `Avatar`, named on its `Tooltip`, beside the relative time. The filter offers Mode, Sensitivity, Status and Last Modified, the table pages eight at a time and the row menu (Edit, Clone, then Delete) sits behind an Actions Tooltip. When the account has no rule sets left but is not a first-use account, the controls and chips step aside and a dashed `EmptyState` inside a `CardBox` (glyph in a stacked frame, then a small secondary Create and a small outlined Docs on one row) holds the page, so the list survives its last row being deleted; Certificates, Network Lists, Edge DNS, Object Storage, Connectors, Custom Pages, Firewall, Functions, SQL Database, Data Stream and Real-Time Purge render the same card with their own noun. Built from the ListControls and ResourceTable recipes plus `EmptyState`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => useListPage({ fields: FIELDS, rows: ROWS, columns: COLUMNS, pageSize: 8 }),
    template: DEFAULT_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Five rule sets, three blocking and two learning: each row leads its Threat Types with the first threat and a +N that opens the rest.'
      },
      source: { code: toSfc(SCRIPT, DEFAULT_TEMPLATE) }
    }
  }
}

export const NoRuleSets = {
  render: () => ({ components, template: EMPTY_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Every rule set deleted on an account that is not new: the page heading stays and the empty card replaces the controls and the table.'
      },
      source: { code: toSfc(EMPTY_SCRIPT, EMPTY_TEMPLATE) }
    }
  }
}

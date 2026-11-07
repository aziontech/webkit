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
import IconButton from '@aziontech/webkit/icon-button'
import InputText from '@aziontech/webkit/input-text'
import PopoverContent from '@aziontech/webkit/popover-content'
import PopoverRoot from '@aziontech/webkit/popover-root'
import PopoverTrigger from '@aziontech/webkit/popover-trigger'
import StatusIndicator from '@aziontech/webkit/status-indicator'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLIED_CHIPS,
  authorCell,
  constLine,
  controlsRow,
  DATE_FILTER_SCRIPT,
  DATE_PRESETS,
  dateRange,
  exportButton,
  formatDateRange,
  idCell,
  LIST_COMPONENT_IMPORTS,
  listPage,
  listStateScript,
  mergeImports,
  pageHeading,
  relativeCell,
  rowActions,
  searchField,
  useListPage,
  withinRange
} from './_lists-markup'

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
  IconButton,
  InputText,
  PopoverRoot,
  PopoverContent,
  PopoverTrigger,
  StatusIndicator,
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const COLUMNS = [
  { accessorKey: 'versionId', header: 'Version', enableSorting: true, principal: true, hideable: false },
  { accessorKey: 'id', header: 'ID', minWidth: 80 },
  { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 80 },
  { accessorKey: 'workloadName', header: 'Workload', enableSorting: true, grow: 2 },
  { accessorKey: 'environment', header: 'Environment', enableSorting: true, minWidth: 136 },
  { accessorKey: 'author', header: 'Last Editor', enableSorting: true, minWidth: 80 },
  { accessorKey: 'date', header: 'Deployed', enableSorting: true, minWidth: 80 },
  { id: 'actions', kind: 'action', hideable: false }
]

const STATUS = {
  Ready: { severity: 'success', loading: false },
  Building: { severity: 'info', loading: true },
  Queued: { severity: 'warning', loading: false },
  Error: { severity: 'danger', loading: false },
  Draft: { severity: 'neutral', loading: false }
}

const deployment = (
  id,
  versionId,
  status,
  duration,
  workloadName,
  workloadId,
  environment,
  author,
  hours,
  date,
  resourceType = 'application',
  current = false
) => ({
  id,
  versionId,
  current,
  status,
  duration,
  workloadName,
  workloadId,
  environment,
  author,
  hours,
  date,
  resourceType
})

const DEPLOYMENTS = [
  deployment('d_p4Rt9LmQ2', 'd_p4Rt9LmQ2', 'Building', '', 'webkit-sample', '1784675753', 'Preview', 'Rafael Umman', 0, 'just now'),
  deployment('dep-1020655-1', '1213268515', 'Ready', '99s', 'workload_01', '1020655', 'Production', 'Robson Junior', 1, '1 hour ago', 'application', true),
  deployment('d_xyCGVY2X4', 'd_xyCGVY2X4', 'Error', '48s', 'webkit-sample', '1784675753', 'Preview', 'Herbert Júlio', 1, '1 hour ago'),
  deployment('dep-1031410002-A2V7QK4M-stage', 'A2V7QK4M', 'Ready', '1m 12s', 'azion-com-br-prod', '1031410002', 'Stage', 'Isaque Böck', 5, '5 hours ago', 'application', true),
  deployment('dep-1031410003-A2V7QK4M-preview', 'A2V7QK4M', 'Ready', '1m 12s', 'azion-stage-preview', '1031410003', 'Preview', 'Isaque Böck', 5, '5 hours ago', 'application', true),
  deployment('dep-1031410003-A2V7QK4M-stage', 'A2V7QK4M', 'Ready', '1m 12s', 'azion-stage-preview', '1031410003', 'Stage', 'Isaque Böck', 5, '5 hours ago', 'application', true),
  deployment('dep-1020655-2', '1213268522', 'Error', '', 'workload_01', '1020655', 'Preview', 'Isaque Böck', 12, '12 hours ago', 'firewall'),
  deployment('dep-1020655-3', '1213268529', 'Error', '', 'workload_01', '1020655', 'Production', 'Rafael Garbinatto', 23, '23 hours ago', 'custom-page'),
  deployment('dep-1031410001-A1M3RT8C-production', 'A1M3RT8C', 'Ready', '99s', 'azion-com-prod', '1031410001', 'Production', 'Robson Junior', 70, '3 days ago', 'application', true),
  deployment('dep-1031410002-A1M3RT8C-production', 'A1M3RT8C', 'Ready', '99s', 'azion-com-br-prod', '1031410002', 'Production', 'Robson Junior', 70, '3 days ago', 'application', true)
]

const ROWS = DEPLOYMENTS.map((row) => ({
  ...row,
  deployedAt: new Date(Date.now() - row.hours * 3_600_000)
}))

const AUTHORS = [
  'Bruno Germano',
  'Gab Lisboa',
  'Herbert Júlio',
  'Isaque Böck',
  'Marcus Grando',
  'Rafael Garbinatto',
  'Rafael Umman',
  'Robson Junior'
]

const options = (values) => values.map((value) => ({ value, label: value }))

const FIELDS = [
  {
    id: 'status',
    label: 'Status',
    kind: 'options',
    options: options(['Ready', 'Building', 'Queued', 'Error', 'Draft']),
    match: (row, values) => values.includes(row.status)
  },
  {
    id: 'resourceType',
    label: 'Type',
    kind: 'options',
    options: [
      { value: 'application', label: 'Application' },
      { value: 'custom-page', label: 'Custom Pages' },
      { value: 'firewall', label: 'Firewall' }
    ],
    match: (row, values) => values.includes(row.resourceType)
  },
  {
    id: 'environment',
    label: 'Environment',
    kind: 'options',
    options: options(['Production', 'Preview', 'Stage']),
    match: (row, values) => values.includes(row.environment)
  },
  {
    id: 'author',
    label: 'Author',
    kind: 'options',
    options: AUTHORS.map((author) => ({ value: author, label: author, avatar: '' })),
    match: (row, values) => values.includes(row.author)
  },
  {
    id: 'deployed',
    label: 'Deployed',
    kind: 'range',
    options: DATE_PRESETS,
    formatValue: formatDateRange,
    match: (row, values) => withinRange(row.deployedAt, dateRange(values[0]))
  }
]

const FIELDS_SCRIPT = [
  'const options = (values) => values.map((value) => ({ value, label: value }))',
  '',
  'const filterFields = [',
  '  {',
  "    id: 'status',",
  "    label: 'Status',",
  "    kind: 'options',",
  "    options: options(['Ready', 'Building', 'Queued', 'Error', 'Draft']),",
  '    match: (row, values) => values.includes(row.status)',
  '  },',
  '  {',
  "    id: 'resourceType',",
  "    label: 'Type',",
  "    kind: 'options',",
  '    options: [',
  "      { value: 'application', label: 'Application' },",
  "      { value: 'custom-page', label: 'Custom Pages' },",
  "      { value: 'firewall', label: 'Firewall' }",
  '    ],',
  '    match: (row, values) => values.includes(row.resourceType)',
  '  },',
  '  {',
  "    id: 'environment',",
  "    label: 'Environment',",
  "    kind: 'options',",
  "    options: options(['Production', 'Preview', 'Stage']),",
  '    match: (row, values) => values.includes(row.environment)',
  '  },',
  '  {',
  "    id: 'author',",
  "    label: 'Author',",
  "    kind: 'options',",
  `    options: ${constLine('x', AUTHORS).slice('const x = '.length).replaceAll('\n', '\n    ')}.map((author) => ({`,
  '      value: author,',
  '      label: author,',
  "      avatar: ''",
  '    })),',
  '    match: (row, values) => values.includes(row.author)',
  '  },',
  '  {',
  "    id: 'deployed',",
  "    label: 'Deployed',",
  "    kind: 'range',",
  '    options: DATE_PRESETS,',
  '    formatValue: formatDateRange,',
  '    match: (row, values) => withinRange(row.deployedAt, dateRange(values[0]))',
  '  }',
  ']'
]

const HEADING = pageHeading({
  title: 'Deployments',
  description:
    'Track every deployment your workloads have published, across all of your resources.',
  docs: 'https://www.azion.com/en/documentation/products/deploy/'
})

const CONTROLS = controlsRow({
  search: searchField('Search deployments'),
  exportButton: exportButton('deployments.csv')
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
        :page-size="10"
        :border="false"
        :loading="loading"
      >
        <template #cell-versionId="{ value, row }">
          <div class="flex min-w-0 items-start gap-(--spacing-xxs)">
            <span class="truncate tabular-nums text-body-sm text-(--text-default)">{{ value }}</span>
            <Tag v-if="row.current" label="Current" severity="info" size="small" icon="pi pi-arrow-circle-up" />
          </div>
        </template>
${indent(idCell('deployment'), 4)}
        <template #cell-status="{ row }">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <StatusIndicator
              :severity="statusMeta[row.status].severity"
              :loading="statusMeta[row.status].loading"
              :label="row.status"
            />
            <span v-if="row.duration" class="shrink-0 text-body-xs text-(--text-muted)">{{ row.duration }}</span>
          </div>
        </template>
        <template #cell-workloadName="{ value, row }">
          <div class="flex min-w-0 items-center gap-(--spacing-xs)">
            <i class="ai ai-workloads shrink-0 text-body-lg text-(--text-muted)" aria-hidden="true" />
            <Tooltip :text="'Open ' + value + ' in Workloads'" class="min-w-0 shrink!">
              <a
                :href="'/workloads/' + row.workloadId"
                data-link
                class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                @click.stop
              >
                <span class="truncate underline-offset-2 group-hover/link:underline">{{ value }}</span>
                <i class="pi pi-external-link shrink-0 text-body-xs leading-none" aria-hidden="true" />
              </a>
            </Tooltip>
          </div>
        </template>
        <template #cell-environment="{ value }">
          <Tag :label="value" severity="secondary" size="medium" rounded />
        </template>
${indent(authorCell('author'), 4)}
${indent(relativeCell('date'), 4)}
${indent(
  rowActions({
    tooltip: 'Deployment actions',
    ariaLabel: 'Deployment actions',
    groups: [
      [
        { value: 'details', label: 'View details', icon: 'pi pi-eye' },
        { value: 'redeploy', label: 'Redeploy', icon: 'pi pi-refresh' },
        { value: 'promote', label: 'Promote to production', icon: 'pi pi-arrow-circle-up' }
      ]
    ]
  }),
  4
)}
      </TableRoot>
    </template>
  </CardBox>
</section>`

const TEMPLATE = listPage({
  heading: HEADING,
  body: `${CONTROLS}
${APPLIED_CHIPS}
${TABLE}`
})

const ROWS_SCRIPT = [
  `const rows = ${constLine('x', DEPLOYMENTS).slice('const x = '.length)}.map((row) => ({`,
  '  ...row,',
  '  deployedAt: new Date(Date.now() - row.hours * 3_600_000)',
  '}))'
]

const script = (initial) => [
  ...mergeImports(LIST_COMPONENT_IMPORTS, ["import StatusIndicator from '@aziontech/webkit/status-indicator'"]),
  "import { computed, nextTick, ref, watch } from 'vue'",
  '',
  ...DATE_FILTER_SCRIPT,
  '',
  ...FIELDS_SCRIPT,
  '',
  constLine('statusMeta', STATUS),
  '',
  constLine('columns', COLUMNS),
  '',
  ...ROWS_SCRIPT,
  '',
  ...listStateScript(initial, 10)
]

const ERRORS = { status: ['Error'] }

const setupWith = (initial) => () => ({
  statusMeta: STATUS,
  ...useListPage({ fields: FIELDS, rows: ROWS, columns: COLUMNS, initial, pageSize: 10 })
})

const meta = {
  title: 'Templates/Platform/Lists/Deployments',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The account-wide Deployments history: a medium page heading with only the Documentation action (deployments are created from a workload or an application, never here), the ListControls row and the deployments table. Its cells differ from the resource indexes: Version is the principal tabular id with an info Current `Tag` on the live version; Status is a `StatusIndicator` (Ready success, Building info and spinning, Queued warning, Error danger, Draft neutral) followed by the build duration; Workload links to the workload with the module glyph; Environment is a rounded secondary `Tag`; Deployed is the relative time; and the row menu (View details, Redeploy, Promote to production) sits behind a Deployment actions Tooltip. The filter offers Status, Type, Environment, Author and Deployed. The same table renders inside the Deployments tab of a workload and of an application. Built from the ListControls recipes, `Table`, `CardBox`, `StatusIndicator`, `Tag`, `Tooltip`, `CopyButton`, `Avatar`, `Dropdown` and `IconButton`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupWith({}), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'The ten newest deployments across the account: one still building, three failed and six ready, the live versions tagged Current.'
      },
      source: { code: toSfc(script({}), TEMPLATE) }
    }
  }
}

export const Failed = {
  render: () => ({ components, setup: setupWith(ERRORS), template: TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'Status narrowed to Error: one chip under the row and only the three failed deployments.'
      },
      source: { code: toSfc(script(ERRORS), TEMPLATE) }
    }
  }
}

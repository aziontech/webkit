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
import Skeleton from '@aziontech/webkit/skeleton'
import Switch from '@aziontech/webkit/switch'
import TableRoot from '@aziontech/webkit/table-root'
import Tag from '@aziontech/webkit/tag'
import Tooltip from '@aziontech/webkit/tooltip'
import { computed, ref, watch } from 'vue'

import { indent } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'
import {
  APPLIED_CHIPS,
  COLUMNS_SCRIPT,
  constLine,
  CONTROLS_IMPORTS,
  controlsRow,
  DOMAIN_SCRIPT,
  FILTER_FIELDS_SCRIPT,
  filterStateScript,
  mergeImports,
  REFRESH_SCRIPT,
  ROWS_SCRIPT,
  TABLE_IMPORTS,
  tableCard,
  useColumnsPanel,
  useDomainOverflow,
  useFilterPanel,
  useListRefresh,
  WIRED_EXPORT_BUTTON,
  WORKLOAD_COLUMNS,
  WORKLOAD_FILTER_FIELDS,
  WORKLOAD_ROWS
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
  Skeleton,
  Switch,
  TableRoot,
  Tag,
  Tooltip
}

const APPLIED = { owner: ['Robson Junior', 'Isaque Böck'], status: ['Live'] }

const PAGE_HEADING = `<header class="flex flex-col gap-(--spacing-md) md:flex-row md:items-start md:justify-between">
  <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 class="text-balance text-heading-sm text-(--text-default)">Workloads</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your workloads.</p>
  </div>
  <div class="flex w-full flex-wrap items-center gap-(--spacing-sm) md:w-auto md:shrink-0 md:flex-nowrap">
    <Button
      label="Documentation"
      icon="pi pi-book"
      kind="outlined"
      size="medium"
      href="https://www.azion.com/en/documentation/products/build/edge-application/workloads/"
      target="_blank"
      class="w-full md:w-auto"
    />
    <Button label="Create Workload" icon="pi pi-plus" kind="outlined" size="medium" class="w-full md:w-auto" />
  </div>
</header>`

const PAGE_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex min-h-full flex-col">
${indent(PAGE_HEADING, 2)}
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(controlsRow({ exportButton: WIRED_EXPORT_BUTTON }), 4)}
${indent(APPLIED_CHIPS, 4)}
        <section class="flex min-h-0 flex-col">
${indent(tableCard({ wired: true }), 5)}
        </section>
      </section>
    </section>
  </main>
</div>`

const LIST_SCRIPT = [
  'const tableRef = ref(null)',
  'const pagination = ref({ pageIndex: 0, pageSize: 10 })',
  'const visibleRows = computed(() =>',
  '  rows.filter((row) =>',
  '    filterFields.every((field) => {',
  '      const values = filters.value[field.id]',
  '      return !values?.length || field.match(row, values)',
  '    })',
  '  )',
  ')',
  'watch(filters, () => {',
  '  pagination.value = { ...pagination.value, pageIndex: 0 }',
  '})'
]

const script = (initial) => [
  ...mergeImports(CONTROLS_IMPORTS, TABLE_IMPORTS, ["import Chip from '@aziontech/webkit/chip'"]),
  "import { computed, nextTick, ref, watch } from 'vue'",
  '',
  ...FILTER_FIELDS_SCRIPT,
  '',
  constLine('columns', WORKLOAD_COLUMNS),
  '',
  ...ROWS_SCRIPT,
  '',
  "const search = ref('')",
  '',
  ...filterStateScript(initial),
  '',
  ...REFRESH_SCRIPT,
  '',
  ...COLUMNS_SCRIPT,
  '',
  ...LIST_SCRIPT,
  '',
  ...DOMAIN_SCRIPT
]

const setupWith = (initial) => () => {
  const panel = useFilterPanel(WORKLOAD_FILTER_FIELDS, initial)
  const tableRef = ref(null)
  const pagination = ref({ pageIndex: 0, pageSize: 10 })
  const visibleRows = computed(() =>
    WORKLOAD_ROWS.filter((row) =>
      WORKLOAD_FILTER_FIELDS.every((field) => {
        const values = panel.filters.value[field.id]
        return !values?.length || field.match(row, values)
      })
    )
  )
  watch(panel.filters, () => {
    pagination.value = { ...pagination.value, pageIndex: 0 }
  })
  return {
    search: ref(''),
    columns: WORKLOAD_COLUMNS,
    tableRef,
    pagination,
    visibleRows,
    ...panel,
    ...useListRefresh(),
    ...useColumnsPanel(WORKLOAD_COLUMNS),
    ...useDomainOverflow()
  }
}

const meta = {
  title: 'Templates/Platform/Lists/ModuleList',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The canonical first-level list page: a medium page heading with the module name and its one-line description, the Documentation and Create actions on the medium step (full width below md), then the controls row, the applied-filter chips and the resource table, laid out with the console page column and section rhythm. The controls are wired to the table: the filters narrow the rows and send the table back to its first page, the search drives the table’s global filter, the columns panel drives its column visibility, Refresh puts it in its loading state and Download CSV exports it. Workloads is plotted here; Applications, Functions, Connectors, Custom Pages, Variables, Certificates, Network Lists, Firewall, Edge DNS, Object Storage, SQL Database, Data Stream (`/data-stream`) and Real-Time Purge take this shape with their own columns (WAF Rules and Deployments have their own templates for the cells and states they add). Composed from the ListControls and ResourceTable templates, with the theme’s `layout-boundary`, `layout-column` and `layout-section-start` utilities carrying the inset, the measure and the vertical rhythm.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupWith({}), template: PAGE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'Workloads with nothing applied: the first ten workloads, the ID column hidden.'
      },
      source: { code: toSfc(script({}), PAGE_TEMPLATE) }
    }
  }
}

export const Filtered = {
  render: () => ({ components, setup: setupWith(APPLIED), template: PAGE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story:
          'Author and Status applied: the count Badge reads 2, two chips sit under the row and the table keeps only the live workloads edited by Robson Junior or Isaque Böck.'
      },
      source: { code: toSfc(script(APPLIED), PAGE_TEMPLATE) }
    }
  }
}

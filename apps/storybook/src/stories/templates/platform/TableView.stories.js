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
  emptyCard,
  FILTER_FIELDS_SCRIPT,
  filterStateScript,
  LIST_COMPONENT_IMPORTS,
  listStateScript,
  mergeImports,
  REFRESH_SCRIPT,
  RESOURCE_COLUMNS,
  RESOURCE_EMPTY,
  RESOURCE_FILTER_FIELDS,
  RESOURCE_ROWS,
  ROWS_SCRIPT,
  TABLE_IMPORTS,
  tableCard,
  useColumnsPanel,
  useDomainOverflow,
  useFilterPanel,
  useListPage,
  useListRefresh,
  WIRED_EXPORT_BUTTON
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
  EmptyState,
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

const PAGE_HEADING = `<header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <h1 class="text-balance text-heading-sm text-(--text-default)">Resources</h1>
    </div>
    <p class="text-pretty text-body-sm text-(--text-muted)">View and manage your resources.</p>
  </div>
  <div class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-sm) md:w-auto md:max-w-full">
    <div class="w-full md:w-fit">
      <Button
        label="Documentation"
        icon="pi pi-book"
        kind="outlined"
        size="medium"
        href="https://example.com/docs/resources"
        target="_blank"
        class="w-full"
      />
    </div>
    <div class="w-full md:w-fit">
      <Button label="Create Resource" icon="pi pi-plus" kind="outlined" size="medium" class="w-full" />
    </div>
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

const EMPTY_TEMPLATE = `<div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
  <main class="layout-column flex min-h-full flex-col">
${indent(PAGE_HEADING, 2)}
    <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
      <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
${indent(controlsRow({ exportButton: WIRED_EXPORT_BUTTON }), 4)}
${indent(APPLIED_CHIPS, 4)}
${indent(emptyCard(RESOURCE_EMPTY), 4)}
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
  constLine('columns', RESOURCE_COLUMNS),
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

const EMPTY_SCRIPT = [
  ...mergeImports(LIST_COMPONENT_IMPORTS, [
    "import Button from '@aziontech/webkit/button'",
    "import EmptyState from '@aziontech/webkit/empty-state'"
  ]),
  "import { computed, nextTick, ref, watch } from 'vue'",
  '',
  ...FILTER_FIELDS_SCRIPT,
  '',
  constLine('columns', RESOURCE_COLUMNS),
  '',
  'const rows = []',
  '',
  ...listStateScript({})
]

const setupWith = (initial) => () => {
  const panel = useFilterPanel(RESOURCE_FILTER_FIELDS, initial)
  const tableRef = ref(null)
  const pagination = ref({ pageIndex: 0, pageSize: 10 })
  const visibleRows = computed(() =>
    RESOURCE_ROWS.filter((row) =>
      RESOURCE_FILTER_FIELDS.every((field) => {
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
    columns: RESOURCE_COLUMNS,
    tableRef,
    pagination,
    visibleRows,
    ...panel,
    ...useListRefresh(),
    ...useColumnsPanel(RESOURCE_COLUMNS),
    ...useDomainOverflow()
  }
}

const meta = {
  title: 'Templates/Platform/Lists/TableView',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The canonical first-level list page: a medium page heading with the resource name and its one-line description, the Documentation and Create actions on the medium step (on a phone they stack below the copy, each at full width), then the controls row, the applied-filter chips and the resource table, laid out with the console page column and section rhythm. The controls are wired to the table: the filters narrow the rows and send the table back to its first page, the search drives the table’s global filter, the columns panel drives its column visibility, Refresh puts it in its loading state and Download CSV exports it. Any resource index takes this shape with its own columns. When the account has no resources left, the page keeps its heading and the controls row, and the table, without its header and footer, gives way to a flush `CardBox` holding only a medium `EmptyState` (the resource glyph, then a small secondary Create and a small outlined Docs on one row), so the list survives its last row being deleted. Laid out with the theme’s `layout-boundary`, `layout-column` and `layout-section-start` utilities carrying the inset, the measure and the vertical rhythm.'
      },
      canvas: { sourceState: 'shown' }
    },
    webkit: {
      intents: [
        'list',
        'list page',
        'resource list',
        'module list',
        'index page',
        'resources index',
        'list with filters',
        'workloads list',
        'listagem',
        'lista de recursos',
        'página de listagem',
        'resource table',
        'data table',
        'table',
        'sortable table',
        'paginated table',
        'table with copy id',
        'listing table',
        'tabela de listagem',
        'tabela',
        'tabela de recursos',
        'tabela paginada',
        'list controls',
        'filter bar',
        'search and filter',
        'table toolbar',
        'filter chips',
        'column visibility',
        'filtros',
        'barra de filtros',
        'busca e filtro',
        'users',
        'users management',
        'users list',
        'team members',
        'members list',
        'invite user',
        'invite teammate',
        'manage users',
        'remove user',
        'usuários',
        'gestão de usuários',
        'lista de usuários',
        'convidar usuário',
        'membros',
        'teams and permissions',
        'teams',
        'permissions',
        'roles and permissions',
        'access control',
        'team list',
        'create team',
        'user groups',
        'times e permissões',
        'permissões',
        'controle de acesso',
        'equipes',
        'credentials',
        'api tokens',
        'personal tokens',
        'api keys',
        'access tokens',
        'token list',
        'revoke token',
        'credenciais',
        'tokens de api',
        'chaves de api',
        'environments',
        'environments list',
        'production stage preview',
        'deployment environments',
        'deployment policies',
        'create environment',
        'ambientes',
        'lista de ambientes',
        'ambientes de deploy',
        'activity history',
        'audit log',
        'activity log',
        'audit trail',
        'account activity',
        'event history',
        'user actions log',
        'histórico de atividades',
        'log de auditoria',
        'registro de atividades',
        'table view',
        'index table',
        'visualização em tabela'
      ],
      skills: ['webkit-lists', 'webkit-tables', 'webkit-ui-states']
    }
  }
}

export default meta

export const Default = {
  render: () => ({ components, setup: setupWith({}), template: PAGE_TEMPLATE }),
  parameters: {
    docs: {
      description: {
        story: 'Nothing applied: the first ten resources, the ID column hidden.'
      },
      source: { code: toSfc(script({}), PAGE_TEMPLATE) }
    }
  }
}

export const Empty = {
  render: () => ({
    components,
    setup: () =>
      useListPage({ fields: RESOURCE_FILTER_FIELDS, rows: [], columns: RESOURCE_COLUMNS }),
    template: EMPTY_TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'Every resource deleted on an account that is not new: the page keeps its heading and controls, and the table, without its header or footer, gives way to a flush CardBox that holds only a medium EmptyState led by the resource glyph, with a small secondary Create Resource and a small outlined Docs button.'
      },
      source: { code: toSfc(EMPTY_SCRIPT, EMPTY_TEMPLATE) }
    }
  }
}

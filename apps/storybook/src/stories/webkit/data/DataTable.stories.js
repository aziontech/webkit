import IconButton from '@aziontech/webkit/icon-button'
import Avatar from '@aziontech/webkit/avatar'
import Tag from '@aziontech/webkit/content/tag'
import DataTable from '@aziontech/webkit/data/data-table'
import DataTableActions from '@aziontech/webkit/data/data-table-actions'
import DataTableColumn from '@aziontech/webkit/data/data-table-column'
import DataTableExport from '@aziontech/webkit/data/data-table-export'
import DataTableFilter from '@aziontech/webkit/data/data-table-filter'
import DataTableFilterChips from '@aziontech/webkit/data/data-table-filter-chips'
import DataTableRowActions from '@aziontech/webkit/data/data-table-row-actions'
import DataTableSearch from '@aziontech/webkit/data/data-table-search'
import DataTableToolbar from '@aziontech/webkit/data/data-table-toolbar'
import StatusIndicator from '@aziontech/webkit/feedback/status-indicator'
import DropdownMenu from '@aziontech/webkit/overlay/dropdown-menu'
import DropdownMenuContent from '@aziontech/webkit/overlay/dropdown-menu-content'
import DropdownMenuItem from '@aziontech/webkit/overlay/dropdown-menu-item'
import DropdownMenuTrigger from '@aziontech/webkit/overlay/dropdown-menu-trigger'
import { ref } from 'vue'

const workloads = [
  {
    id: 'wl-001',
    name: 'edge-service',
    domains: ['mydomain.azion.app', 'api.azion.app', 'cdn.azion.app'],
    status: 'Active',
    lastModified: 'May 15, 2026, 11:00:25 am',
    ownerEmail: 'rafael.umman@azion.com'
  },
  {
    id: 'wl-002',
    name: 'billing-api',
    domains: ['billing.azion.app'],
    status: 'Active',
    lastModified: 'May 14, 2026, 9:12:10 am',
    ownerEmail: 'maria.silva@azion.com'
  },
  {
    id: 'wl-003',
    name: 'analytics-worker',
    domains: ['analytics.azion.app', 'metrics.azion.app'],
    status: 'Inactive',
    lastModified: 'May 10, 2026, 4:45:00 pm',
    ownerEmail: 'joao.pereira@azion.com'
  }
]

const defaultColumns = [
  { field: 'name', header: 'Name' },
  { field: 'domains', header: 'Domain' },
  { field: 'status', header: 'Status' },
  { field: 'lastModified', header: 'Last Modified' },
  { field: 'ownerEmail', header: 'Owner' }
]

/** @type {import('@storybook/vue3').Meta<typeof DataTable>} */
const meta = {
  title: 'Webkit/Data/DataTable',
  component: DataTable,
  subcomponents: {
    DataTableColumn,
    DataTableToolbar,
    DataTableSearch,
    DataTableActions,
    DataTableExport,
    DataTableFilter,
    DataTableFilterChips,
    DataTableRowActions
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
          'Composition-based data table for listing, filtering, sorting, and acting on tabular records. Mirrors the core list-data-table API using webkit primitives.'
      }
    }
  },
  argTypes: {
    data: {
      control: false,
      description: 'Row records to render.',
      table: { type: { summary: 'Record<string, unknown>[]' }, category: 'props' }
    },
    hideHeader: {
      control: 'boolean',
      description: 'Hides column headers; renders headerless list rows.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    paginator: {
      control: 'boolean',
      description: 'Enables pagination controls.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    lazy: {
      control: 'boolean',
      description: 'When true, pagination and sort emit events for server fetch.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    loading: {
      control: 'boolean',
      description: 'Shows loading skeleton rows when true.',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' }, category: 'props' }
    },
    onPage: {
      action: 'page',
      table: { type: { summary: '(event: PageEvent) => void' }, category: 'events' }
    },
    onSort: {
      action: 'sort',
      table: { type: { summary: '(event: SortEvent) => void' }, category: 'events' }
    },
    'onRow-click': {
      action: 'row-click',
      table: {
        type: { summary: '(event: { data: Record<string, unknown>; originalEvent: MouseEvent }) => void' },
        category: 'events'
      }
    },
    'onClick-to-create': {
      action: 'click-to-create',
      table: { type: { summary: '() => void' }, category: 'events' }
    },
    header: {
      control: false,
      description: 'Toolbar area; typically DataTableToolbar.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    },
    default: {
      control: false,
      description: 'DataTableColumn children.',
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    data: workloads,
    columns: defaultColumns,
    hideHeader: false,
    paginator: false,
    lazy: false,
    loading: false
  }
}

export default meta

/** @type {import('@storybook/vue3').StoryObj<typeof DataTable>} */
export const Default = {
  render: (args) => ({
    components: { DataTable, DataTableColumn },
    setup() {
      return { args }
    },
    template: `
      <DataTable v-bind="args">
        <DataTableColumn field="name" header="Name" sortable />
        <DataTableColumn field="status" header="Status" />
        <DataTableColumn field="ownerEmail" header="Owner" />
      </DataTable>
    `
  }),
  parameters: {
    docs: { description: { story: 'Basic three-column table with sortable name column.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof DataTable>} */
export const WithFilters = {
  render: (args) => ({
    components: {
      DataTable,
      DataTableColumn,
      DataTableToolbar,
      DataTableSearch,
      DataTableActions,
      DataTableExport,
      DataTableFilter,
      DataTableFilterChips,
      DataTableRowActions,
      IconButton,
      StatusIndicator,
      Tag,
      Avatar,
      DropdownMenu,
      DropdownMenuTrigger,
      DropdownMenuContent,
      DropdownMenuItem
    },
    setup() {
      const items = ref([...workloads])
      const searchValue = ref('')
      const appliedFilters = ref([])
      const filterRef = ref(null)

      const onSearch = (value) => {
        searchValue.value = value
      }

      const toggleFilter = () => {
        filterRef.value?.toggle()
      }

      const handleApplyFilter = (filter) => {
        const idx = appliedFilters.value.findIndex((item) => item.field === filter.field)
        if (idx >= 0) appliedFilters.value[idx] = filter
        else appliedFilters.value.push(filter)
      }

      const handleRemoveFilter = (field) => {
        appliedFilters.value = appliedFilters.value.filter((item) => item.field !== field)
      }

      const handleEditFilter = ({ filter }) => {
        filterRef.value?.openForFilter(filter)
      }

      const getActions = (rowData) => [
        { label: 'Clone', icon: 'pi pi-clone', command: () => console.log('Clone', rowData.name) },
        { separator: true },
        { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('Delete', rowData.name) }
      ]

      return {
        args,
        items,
        searchValue,
        appliedFilters,
        filterRef,
        onSearch,
        toggleFilter,
        handleApplyFilter,
        handleRemoveFilter,
        handleEditFilter,
        getActions,
        defaultColumns
      }
    },
    template: `
      <DataTable
        v-bind="args"
        :data="items"
        :columns="defaultColumns"
        :searchValue="searchValue"
        :appliedFilters="appliedFilters"
        :globalFilterFields="['name', 'id', 'status', 'ownerEmail', 'domains']"
        hideHeader
      >
        <template #header>
          <DataTableToolbar :showDivider="appliedFilters.length > 0">
            <template #first-line>
              <div class="flex w-full items-center justify-between gap-[var(--spacing-3)]">
                <span class="flex items-center gap-[var(--spacing-2)]">
                  <IconButton
                    icon="pi pi-filter"
                    ariaLabel="Open filters"
                    kind="outlined"
                    size="small"
                    @click="toggleFilter"
                  />
                  <DataTableSearch
                    v-model="searchValue"
                    placeholder="Search Workloads"
                    :debounce="300"
                    @search="onSearch"
                  />
                </span>
                <DataTableActions>
                  <DataTableExport />
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <IconButton icon="pi pi-ellipsis-h" ariaLabel="Table actions" kind="outlined" size="small" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem label="Refresh" />
                      <DropdownMenuItem label="Settings" />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </DataTableActions>
              </div>
            </template>
            <template #second-line v-if="appliedFilters.length > 0">
              <DataTableFilterChips
                :appliedFilters="appliedFilters"
                @remove="handleRemoveFilter"
                @edit="handleEditFilter"
              />
            </template>
          </DataTableToolbar>
        </template>

        <DataTableColumn field="name" header="Name">
          <template #body="{ data }">
            <div class="flex flex-col">
              <span class="text-body-sm text-[var(--text-default)]">{{ data.name }}</span>
              <span class="text-body-xs text-[var(--text-muted)]">{{ data.id }}</span>
            </div>
          </template>
        </DataTableColumn>

        <DataTableColumn field="domains" header="Domain">
          <template #body="{ data }">
            <div class="flex items-center gap-[var(--spacing-2)]">
              <span class="text-body-sm text-[var(--text-default)]">{{ data.domains[0] }}</span>
              <Tag v-if="data.domains.length > 1" :value="'+' + (data.domains.length - 1)" severity="secondary" />
            </div>
          </template>
        </DataTableColumn>

        <DataTableColumn field="status" header="Status">
          <template #body="{ data }">
            <StatusIndicator :label="data.status" :status="data.status === 'Active' ? 'positive' : 'neutral'" />
          </template>
        </DataTableColumn>

        <DataTableColumn field="lastModified" header="Last Modified" />

        <DataTableColumn field="ownerEmail" header="Owner">
          <template #body="{ data }">
            <div class="flex items-center gap-[var(--spacing-2)]">
              <span class="text-body-sm text-[var(--text-default)]">{{ data.ownerEmail }}</span>
              <Avatar :label="data.ownerEmail.slice(0, 1).toUpperCase()" size="small" />
            </div>
          </template>
        </DataTableColumn>

        <DataTableColumn field="actions" header="">
          <template #body="{ data }">
            <DataTableRowActions :rowData="data" :actions="getActions" />
          </template>
        </DataTableColumn>

        <DataTableFilter ref="filterRef" :filters="defaultColumns" @apply="handleApplyFilter" />
      </DataTable>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Workloads-like layout with filter toggle, search, chips, and headerless rich rows.'
      }
    }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof DataTable>} */
export const WithLazyLoad = {
  render: (args) => ({
    components: { DataTable, DataTableColumn },
    setup() {
      const items = ref(workloads.slice(0, 2))
      const totalRecords = ref(workloads.length)
      const first = ref(0)
      const rows = ref(2)
      const loading = ref(false)

      const onPage = (event) => {
        loading.value = true
        first.value = event.first
        setTimeout(() => {
          items.value = workloads.slice(event.first, event.first + event.rows)
          loading.value = false
        }, 400)
      }

      return { args, items, totalRecords, first, rows, loading, onPage }
    },
    template: `
      <DataTable
        v-bind="args"
        :data="items"
        :totalRecords="totalRecords"
        :first="first"
        :rows="rows"
        :loading="loading"
        lazy
        paginator
        @page="onPage"
      >
        <DataTableColumn field="name" header="Name" sortable />
        <DataTableColumn field="status" header="Status" />
        <DataTableColumn field="ownerEmail" header="Owner" />
      </DataTable>
    `
  }),
  parameters: {
    docs: { description: { story: 'Server-driven pagination using lazy mode and totalRecords.' } }
  }
}

/** @type {import('@storybook/vue3').StoryObj<typeof DataTable>} */
export const Empty = {
  render: (args) => ({
    components: { DataTable, DataTableColumn },
    setup() {
      return { args: { ...args, data: [] } }
    },
    template: `
      <DataTable v-bind="args">
        <DataTableColumn field="name" header="Name" />
        <DataTableColumn field="status" header="Status" />
      </DataTable>
    `
  }),
  parameters: {
    docs: { description: { story: 'Empty block when no data, search, or filters are active.' } }
  }
}

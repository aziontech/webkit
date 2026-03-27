import ListDataTable from '@aziontech/webkit/list-data-table'

// ─── Real Console Data ────────────────────────────────────────────────────────

const edgeApplications = [
  { id: 1001, name: 'My Website', status: 'Active', lastEditor: 'john@azion.com', lastModified: '2026-03-20T14:30:00Z' },
  { id: 1002, name: 'API Gateway', status: 'Active', lastEditor: 'maria@azion.com', lastModified: '2026-03-19T09:15:00Z' },
  { id: 1003, name: 'Mobile Backend', status: 'Inactive', lastEditor: 'carlos@azion.com', lastModified: '2026-03-18T16:45:00Z' },
  { id: 1004, name: 'CDN Distribution', status: 'Active', lastEditor: 'ana@azion.com', lastModified: '2026-03-17T11:00:00Z' },
  { id: 1005, name: 'Edge Functions App', status: 'Active', lastEditor: 'pedro@azion.com', lastModified: '2026-03-16T08:20:00Z' },
  { id: 1006, name: 'Staging Environment', status: 'Inactive', lastEditor: 'john@azion.com', lastModified: '2026-03-15T13:10:00Z' },
  { id: 1007, name: 'Load Balancer Prod', status: 'Active', lastEditor: 'maria@azion.com', lastModified: '2026-03-14T17:30:00Z' },
  { id: 1008, name: 'Internal Dashboard', status: 'Active', lastEditor: 'carlos@azion.com', lastModified: '2026-03-13T10:45:00Z' }
]

const users = [
  { id: 1, firstName: 'John', lastName: 'Silva', email: 'john@company.com', teams: ['Default Team', 'Engineering'], mfa: 'Enabled', status: 'Active', accountOwner: 'Yes' },
  { id: 2, firstName: 'Maria', lastName: 'Santos', email: 'maria@company.com', teams: ['Default Team'], mfa: 'Disabled', status: 'Active', accountOwner: 'No' },
  { id: 3, firstName: 'Carlos', lastName: 'Oliveira', email: 'carlos@company.com', teams: ['Default Team', 'DevOps'], mfa: 'Enabled', status: 'Active', accountOwner: 'No' },
  { id: 4, firstName: 'Ana', lastName: 'Costa', email: 'ana@company.com', teams: ['Default Team'], mfa: 'Disabled', status: 'Inactive', accountOwner: 'No' },
  { id: 5, firstName: 'Pedro', lastName: 'Lima', email: 'pedro@company.com', teams: ['Engineering', 'QA'], mfa: 'Enabled', status: 'Active', accountOwner: 'No' }
]

const variables = [
  { id: 1, key: 'API_URL', value: 'https://api.example.com/v2', lastEditor: 'john@azion.com', lastModified: '2026-03-20T10:00:00Z' },
  { id: 2, key: 'DATABASE_HOST', value: 'db.internal.azion.net', lastEditor: 'maria@azion.com', lastModified: '2026-03-19T14:30:00Z' },
  { id: 3, key: 'CACHE_TTL', value: '3600', lastEditor: 'carlos@azion.com', lastModified: '2026-03-18T09:00:00Z' },
  { id: 4, key: 'LOG_LEVEL', value: 'info', lastEditor: 'ana@azion.com', lastModified: '2026-03-17T16:00:00Z' },
  { id: 5, key: 'SECRET_KEY', value: '••••••••', lastEditor: 'pedro@azion.com', lastModified: '2026-03-16T11:30:00Z' }
]

const storageObjects = [
  { id: 1, name: 'assets/', size: '-', type: 'folder', lastModified: '2026-03-20T10:00:00Z' },
  { id: 2, name: 'images/', size: '-', type: 'folder', lastModified: '2026-03-19T09:00:00Z' },
  { id: 3, name: 'index.html', size: '2.4 KB', type: 'file', lastModified: '2026-03-18T14:30:00Z' },
  { id: 4, name: 'app.js', size: '15.2 KB', type: 'file', lastModified: '2026-03-17T11:00:00Z' },
  { id: 5, name: 'styles.css', size: '8.7 KB', type: 'file', lastModified: '2026-03-16T16:45:00Z' },
  { id: 6, name: 'logo.png', size: '48 KB', type: 'file', lastModified: '2026-03-15T13:20:00Z' }
]

const rulesEngine = [
  { id: 1, name: 'Redirect HTTP to HTTPS', order: 1, phase: 'Request', status: 'Active', description: 'Force all traffic to use HTTPS' },
  { id: 2, name: 'Cache Static Assets', order: 2, phase: 'Request', status: 'Active', description: 'Cache CSS, JS, and images for 24h' },
  { id: 3, name: 'Block Bad Bots', order: 3, phase: 'Request', status: 'Active', description: 'Block known malicious user agents' },
  { id: 4, name: 'Rate Limiting', order: 4, phase: 'Request', status: 'Inactive', description: 'Limit requests to 100/min per IP' },
  { id: 5, name: 'Set Security Headers', order: 5, phase: 'Response', status: 'Active', description: 'Add HSTS, CSP, and X-Frame headers' }
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// ─── Story Config ─────────────────────────────────────────────────────────────

export default {
  title: 'Core/ListDataTable',
  component: ListDataTable,
  tags: ['autodocs'],
  argTypes: {
    loading: { control: 'boolean', description: 'Show skeleton loading state' },
    paginator: { control: 'boolean', description: 'Enable pagination' },
    rows: { control: 'number', description: 'Rows per page' },
    skeletonRows: { control: 'number', description: 'Number of skeleton rows when loading' },
    emptyListMessage: { control: 'text', description: 'Message when table is empty' }
  }
}

// ─── Simple Examples ──────────────────────────────────────────────────────────

export const Basic = {
  render: () => ({
    components: { ListDataTable, Column: ListDataTable.Column },
    setup() {
      return { variables }
    },
    template: `
      <ListDataTable :data="variables">
        <Column field="key" header="Key" sortable />
        <Column field="value" header="Value" />
      </ListDataTable>
    `
  })
}

export const Loading = {
  render: () => ({
    components: { ListDataTable, Column: ListDataTable.Column },
    setup() {
      const columns = [
        { field: 'name', header: 'Name' },
        { field: 'id', header: 'ID' },
        { field: 'status', header: 'Status' },
        { field: 'lastModified', header: 'Last Modified' }
      ]
      return { columns }
    },
    template: `
      <ListDataTable :data="[]" loading :columns="columns" :skeletonRows="5">
        <Column field="name" header="Name" />
        <Column field="id" header="ID" />
        <Column field="status" header="Status" />
        <Column field="lastModified" header="Last Modified" />
      </ListDataTable>
    `
  })
}

export const EmptyState = {
  render: () => ({
    components: { ListDataTable },
    template: `
      <ListDataTable
        :data="[]"
        :columns="[]"
        :emptyBlock="{
          title: 'No Edge Applications found',
          description: 'Create your first edge application to start delivering content at the edge.',
          createButtonLabel: 'Create Edge Application'
        }"
      />
    `
  })
}

// ─── Real Console Patterns ────────────────────────────────────────────────────

export const EdgeApplicationsList = {
  render: () => ({
    components: {
      ListDataTable,
      Column: ListDataTable.Column,
      Header: ListDataTable.Header,
      Search: ListDataTable.Search,
      Actions: ListDataTable.Actions,
      ColumnSelector: ListDataTable.ColumnSelector,
      Export: ListDataTable.Export,
      RowActions: ListDataTable.RowActions
    },
    data() {
      return {
        items: edgeApplications,
        searchValue: '',
        filters: { global: { value: '', matchMode: 'contains' } },
        allColumns: [
          { field: 'name', header: 'Name' },
          { field: 'id', header: 'ID' },
          { field: 'status', header: 'Status' },
          { field: 'lastEditor', header: 'Last Editor' },
          { field: 'lastModified', header: 'Last Modified' }
        ],
        selectedColumns: [
          { field: 'name', header: 'Name' },
          { field: 'id', header: 'ID' },
          { field: 'status', header: 'Status' },
          { field: 'lastEditor', header: 'Last Editor' },
          { field: 'lastModified', header: 'Last Modified' }
        ]
      }
    },
    methods: {
      formatDate,
      onSearch(value) {
        this.filters.global.value = value
      },
      getActions(rowData) {
        return [
          { label: 'Clone', icon: 'pi pi-clone', command: () => console.log(`Clone: ${rowData.name}`) },
          { separator: true },
          { label: 'Delete', icon: 'pi pi-trash', command: () => console.log(`Delete: ${rowData.name}`) }
        ]
      }
    },
    template: `
      <ListDataTable
        :data="items"
        :columns="allColumns"
        paginator
        :rows="10"
        :filters="filters"
        :globalFilterFields="['name', 'id', 'status', 'lastEditor']"
        :searchValue="searchValue"
      >
        <template #header>
          <Header :showDivider="false">
            <template #first-line>
              <div class="flex justify-between w-full items-center">
                <Search v-model="searchValue" placeholder="Search..." @search="onSearch" :debounce="300" />
                <Actions>
                  <Export @export="console.log('Export CSV')" tooltipText="Export to CSV" />
                  <ColumnSelector :columns="allColumns" :selectedColumns="selectedColumns" @update:selectedColumns="selectedColumns = $event" />
                </Actions>
              </div>
            </template>
          </Header>
        </template>
        <Column v-for="col in selectedColumns" :key="col.field" :field="col.field" :header="col.header" sortable :frozen="col.field === 'name'" :style="col.field === 'name' ? 'max-width: 300px' : ''">
          <template #body="{ data }" v-if="col.field === 'status'">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column v-if="selectedColumns.some(c => c.field === 'lastModified')" field="lastModified" header="Last Modified" sortable>
          <template #body="{ data }">
            {{ formatDate(data.lastModified) }}
          </template>
        </Column>
        <Column header="" frozen alignFrozen="right" style="width: 60px">
          <template #body="{ data }">
            <RowActions :rowData="data" :actions="getActions" />
          </template>
        </Column>
      </ListDataTable>
    `
  })
}

export const UsersManagement = {
  render: () => ({
    components: {
      ListDataTable,
      Column: ListDataTable.Column,
      Header: ListDataTable.Header,
      Search: ListDataTable.Search,
      RowActions: ListDataTable.RowActions
    },
    data() {
      return {
        items: users,
        searchValue: '',
        filters: { global: { value: '', matchMode: 'contains' } }
      }
    },
    methods: {
      onSearch(value) {
        this.filters.global.value = value
      },
      getActions(rowData) {
        return [
          { label: 'Delete', icon: 'pi pi-trash', command: () => console.log(`Delete: ${rowData.email}`) }
        ]
      }
    },
    template: `
      <ListDataTable
        :data="items"
        :columns="[
          { field: 'firstName', header: 'First Name' },
          { field: 'lastName', header: 'Last Name' },
          { field: 'email', header: 'Email' },
          { field: 'teams', header: 'Teams' },
          { field: 'mfa', header: 'MFA' },
          { field: 'status', header: 'Status' }
        ]"
        :filters="filters"
        :globalFilterFields="['firstName', 'lastName', 'email']"
        :searchValue="searchValue"
      >
        <template #header>
          <Header :showDivider="false">
            <template #first-line>
              <Search v-model="searchValue" placeholder="Search by name or email..." @search="onSearch" :debounce="300" />
            </template>
          </Header>
        </template>
        <Column field="firstName" header="First Name" sortable frozen style="max-width: 200px" />
        <Column field="lastName" header="Last Name" sortable />
        <Column field="email" header="Email Address" />
        <Column field="teams" header="Teams">
          <template #body="{ data }">
            {{ data.teams.join(', ') }}
          </template>
        </Column>
        <Column field="mfa" header="MFA">
          <template #body="{ data }">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.mfa === 'Enabled' ? 'bg-green-900/30 text-green-400' : 'bg-orange-900/30 text-orange-400']">
              {{ data.mfa }}
            </span>
          </template>
        </Column>
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column header="" frozen alignFrozen="right" style="width: 60px">
          <template #body="{ data }">
            <RowActions :rowData="data" :actions="getActions" />
          </template>
        </Column>
      </ListDataTable>
    `
  })
}

export const EnvironmentVariables = {
  render: () => ({
    components: {
      ListDataTable,
      Column: ListDataTable.Column,
      Header: ListDataTable.Header,
      Search: ListDataTable.Search,
      Export: ListDataTable.Export,
      Actions: ListDataTable.Actions,
      RowActions: ListDataTable.RowActions
    },
    data() {
      return {
        items: variables,
        searchValue: '',
        filters: { global: { value: '', matchMode: 'contains' } }
      }
    },
    methods: {
      formatDate,
      onSearch(value) {
        this.filters.global.value = value
      },
      getActions(rowData) {
        return [
          { label: 'Delete', icon: 'pi pi-trash', command: () => console.log(`Delete: ${rowData.key}`) }
        ]
      }
    },
    template: `
      <ListDataTable
        :data="items"
        :columns="[
          { field: 'key', header: 'Key' },
          { field: 'value', header: 'Value' },
          { field: 'lastEditor', header: 'Last Editor' },
          { field: 'lastModified', header: 'Last Modified' }
        ]"
        :filters="filters"
        :globalFilterFields="['key', 'value']"
        :searchValue="searchValue"
      >
        <template #header>
          <Header :showDivider="false">
            <template #first-line>
              <div class="flex justify-between w-full items-center">
                <Search v-model="searchValue" placeholder="Search by key..." @search="onSearch" :debounce="300" />
                <Actions>
                  <Export @export="console.log('Export')" tooltipText="Export to CSV" />
                </Actions>
              </div>
            </template>
          </Header>
        </template>
        <Column field="key" header="Key" sortable />
        <Column field="value" header="Value">
          <template #body="{ data }">
            <code class="text-sm px-2 py-0.5 rounded bg-[var(--surface-hover)] text-color">{{ data.value }}</code>
          </template>
        </Column>
        <Column field="lastEditor" header="Last Editor" />
        <Column field="lastModified" header="Last Modified" sortable>
          <template #body="{ data }">
            {{ formatDate(data.lastModified) }}
          </template>
        </Column>
        <Column header="" frozen alignFrozen="right" style="width: 60px">
          <template #body="{ data }">
            <RowActions :rowData="data" :actions="getActions" />
          </template>
        </Column>
      </ListDataTable>
    `
  })
}

export const WithPagination = {
  render: () => ({
    components: { ListDataTable, Column: ListDataTable.Column },
    setup() {
      return { items: edgeApplications, formatDate }
    },
    template: `
      <ListDataTable :data="items" paginator :rows="5" :rowsPerPageOptions="[5, 10, 25]" :columns="[{ field: 'name', header: 'Name' }]">
        <Column field="name" header="Name" sortable />
        <Column field="id" header="ID" sortable />
        <Column field="status" header="Status" sortable>
          <template #body="{ data }">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column field="lastModified" header="Last Modified" sortable>
          <template #body="{ data }">
            {{ formatDate(data.lastModified) }}
          </template>
        </Column>
      </ListDataTable>
    `
  })
}

export const WithFilters = {
  render: () => ({
    components: {
      ListDataTable,
      Column: ListDataTable.Column,
      Header: ListDataTable.Header,
      Search: ListDataTable.Search,
      Actions: ListDataTable.Actions,
      Export: ListDataTable.Export,
      Filter: ListDataTable.Filter,
      AppliedFilters: ListDataTable.AppliedFilters,
      RowActions: ListDataTable.RowActions
    },
    data() {
      return {
        items: edgeApplications,
        searchValue: '',
        filters: { global: { value: '', matchMode: 'contains' } },
        appliedFilters: [],
        allColumns: [
          { field: 'name', header: 'Name' },
          { field: 'id', header: 'ID' },
          { field: 'status', header: 'Status', sortField: 'status' },
          { field: 'lastEditor', header: 'Last Editor', sortField: 'last_editor' },
          { field: 'lastModified', header: 'Last Modified' }
        ]
      }
    },
    methods: {
      formatDate,
      onSearch(value) {
        this.filters.global.value = value
      },
      toggleFilter(event) {
        this.$refs.filterRef?.toggle(event)
      },
      handleApplyFilter(filter) {
        const idx = this.appliedFilters.findIndex(f => f.field === filter.field)
        if (idx >= 0) {
          this.appliedFilters[idx] = filter
        } else {
          this.appliedFilters.push(filter)
        }
      },
      handleRemoveFilter(field) {
        this.appliedFilters = this.appliedFilters.filter(f => f.field !== field)
      },
      handleEditFilter({ filter, event }) {
        this.$refs.filterRef?.openForFilter?.(filter, event)
      },
      getActions(rowData) {
        return [
          { label: 'Clone', icon: 'pi pi-clone', command: () => console.log('Clone: ' + rowData.name) },
          { separator: true },
          { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('Delete: ' + rowData.name) }
        ]
      }
    },
    template: `
      <ListDataTable
        :data="items"
        :columns="allColumns"
        paginator
        :rows="10"
        :filters="filters"
        :globalFilterFields="['name', 'id', 'status', 'lastEditor']"
        :searchValue="searchValue"
        :appliedFilters="appliedFilters"
      >
        <template #header>
          <Header :showDivider="appliedFilters.length > 0">
            <template #first-line>
              <div class="flex justify-between w-full items-center">
                <span class="flex items-center gap-2">
                  <button
                    class="p-button p-button-outlined p-button-sm"
                    @click="toggleFilter"
                  >
                    <i class="pi pi-filter" />
                  </button>
                  <Search v-model="searchValue" placeholder="Search..." @search="onSearch" :debounce="300" />
                </span>
                <Actions>
                  <Export @export="console.log('Export CSV')" tooltipText="Export to CSV" />
                </Actions>
              </div>
            </template>
            <template #second-line v-if="appliedFilters.length > 0">
              <AppliedFilters
                :appliedFilters="appliedFilters"
                @remove="handleRemoveFilter"
                @edit="handleEditFilter"
              />
            </template>
          </Header>
        </template>
        <Column v-for="col in allColumns" :key="col.field" :field="col.field" :header="col.header" sortable>
          <template #body="{ data }" v-if="col.field === 'status'">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column header="" frozen alignFrozen="right" style="width: 60px">
          <template #body="{ data }">
            <RowActions :rowData="data" :actions="getActions" />
          </template>
        </Column>
        <Filter
          ref="filterRef"
          :filters="allColumns.filter(c => c.field !== 'lastModified')"
          @apply="handleApplyFilter"
        />
      </ListDataTable>
    `
  })
}

export const WithMultiselect = {
  render: () => ({
    components: {
      ListDataTable,
      Column: ListDataTable.Column,
      Header: ListDataTable.Header,
      Search: ListDataTable.Search
    },
    data() {
      return {
        items: edgeApplications,
        selectedItems: [],
        searchValue: '',
        filters: { global: { value: '', matchMode: 'contains' } }
      }
    },
    methods: {
      formatDate,
      onSearch(value) {
        this.filters.global.value = value
      },
      handleDelete() {
        const ids = this.selectedItems.map(i => i.id)
        this.items = this.items.filter(i => !ids.includes(i.id))
        this.selectedItems = []
      }
    },
    template: `
      <div class="flex flex-col gap-3">
        <div v-if="selectedItems.length > 0" class="flex items-center gap-3 px-4 py-2 bg-[var(--surface-ground)] border border-[var(--surface-border)] rounded-md">
          <span class="text-sm text-color-secondary whitespace-nowrap">
            {{ selectedItems.length }} {{ selectedItems.length === 1 ? 'item' : 'items' }} selected
          </span>
          <button class="p-button p-button-outlined p-button-danger p-button-sm" @click="handleDelete">
            <i class="pi pi-trash mr-1" /> Delete
          </button>
        </div>
        <ListDataTable
          :data="items"
          :columns="[
            { field: 'name', header: 'Name' },
            { field: 'id', header: 'ID' },
            { field: 'status', header: 'Status' },
            { field: 'lastEditor', header: 'Last Editor' },
            { field: 'lastModified', header: 'Last Modified' }
          ]"
          v-model:selection="selectedItems"
          :filters="filters"
          :globalFilterFields="['name', 'id', 'status', 'lastEditor']"
          :searchValue="searchValue"
        >
          <template #header>
            <Header :showDivider="false">
              <template #first-line>
                <Search v-model="searchValue" placeholder="Search..." @search="onSearch" :debounce="300" />
              </template>
            </Header>
          </template>
          <Column selectionMode="multiple" headerStyle="width: 3rem" />
          <Column field="name" header="Name" sortable frozen style="max-width: 300px" />
          <Column field="id" header="ID" sortable />
          <Column field="status" header="Status" sortable>
            <template #body="{ data }">
              <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
                {{ data.status }}
              </span>
            </template>
          </Column>
          <Column field="lastEditor" header="Last Editor" />
          <Column field="lastModified" header="Last Modified" sortable>
            <template #body="{ data }">
              {{ formatDate(data.lastModified) }}
            </template>
          </Column>
        </ListDataTable>
      </div>
    `
  })
}

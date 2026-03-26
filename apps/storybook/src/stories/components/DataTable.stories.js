import DataTable from '@aziontech/webkit/data-table'

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
  title: 'Components/DataTable',
  component: DataTable,
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
    components: { DataTable, Column: DataTable.Column },
    setup() {
      return { variables }
    },
    template: `
      <DataTable :value="variables">
        <Column field="key" header="Key" sortable />
        <Column field="value" header="Value" />
      </DataTable>
    `
  })
}

export const Loading = {
  render: () => ({
    components: { DataTable, Column: DataTable.Column },
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
      <DataTable :value="[]" loading :columns="columns" :skeletonRows="5">
        <Column field="name" header="Name" />
        <Column field="id" header="ID" />
        <Column field="status" header="Status" />
        <Column field="lastModified" header="Last Modified" />
      </DataTable>
    `
  })
}

export const EmptyState = {
  render: () => ({
    components: { DataTable },
    template: `
      <DataTable
        :value="[]"
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
      DataTable,
      Column: DataTable.Column,
      Header: DataTable.Header,
      Search: DataTable.Search,
      Actions: DataTable.Actions,
      ColumnSelector: DataTable.ColumnSelector,
      Export: DataTable.Export,
      RowActions: DataTable.RowActions
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
      <DataTable
        :value="items"
        :columns="allColumns"
        paginator
        :rows="10"
        :filters="filters"
        :globalFilterFields="['name', 'id', 'status', 'lastEditor']"
        :searchValue="searchValue"
      >
        <template #header>
          <Header>
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
      </DataTable>
    `
  })
}

export const UsersManagement = {
  render: () => ({
    components: {
      DataTable,
      Column: DataTable.Column,
      Header: DataTable.Header,
      Search: DataTable.Search,
      RowActions: DataTable.RowActions
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
      <DataTable
        :value="items"
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
      </DataTable>
    `
  })
}

export const EnvironmentVariables = {
  render: () => ({
    components: {
      DataTable,
      Column: DataTable.Column,
      Header: DataTable.Header,
      Search: DataTable.Search,
      Export: DataTable.Export,
      Actions: DataTable.Actions,
      RowActions: DataTable.RowActions
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
      <DataTable
        :value="items"
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
      </DataTable>
    `
  })
}

export const EdgeStorageBrowser = {
  render: () => ({
    components: {
      DataTable,
      Column: DataTable.Column,
      Header: DataTable.Header,
      Breadcrumb: DataTable.Breadcrumb,
      Search: DataTable.Search,
      Actions: DataTable.Actions,
      BatchActions: DataTable.BatchActions,
      RowActions: DataTable.RowActions
    },
    data() {
      return {
        items: storageObjects,
        selectedItems: [],
        currentPath: '/my-bucket/assets/images'
      }
    },
    methods: {
      formatDate,
      onNavigate(path) {
        console.log(`Navigate to: ${path}`)
      },
      getActions(rowData) {
        const actions = [
          { label: 'Download', icon: 'pi pi-download', command: () => console.log(`Download: ${rowData.name}`) }
        ]
        if (rowData.type === 'file') {
          actions.push({ separator: true })
          actions.push({ label: 'Delete', icon: 'pi pi-trash', command: () => console.log(`Delete: ${rowData.name}`) })
        }
        return actions
      }
    },
    template: `
      <DataTable
        :value="items"
        :columns="[{ field: 'name', header: 'Name' }, { field: 'size', header: 'Size' }, { field: 'lastModified', header: 'Last Modified' }]"
        v-model:selection="selectedItems"
        selectionMode="multiple"
      >
        <template #header>
          <Header>
            <template #first-line>
              <BatchActions
                v-if="selectedItems.length > 0"
                :selectedCount="selectedItems.length"
                :actions="[
                  { label: 'Download', icon: 'pi pi-download', command: () => console.log('Download selected') },
                  { label: 'Move', icon: 'pi pi-arrow-right', command: () => console.log('Move selected') },
                  { label: 'Delete', icon: 'pi pi-trash', command: () => console.log('Delete selected'), severity: 'danger' }
                ]"
              />
              <Breadcrumb v-else :path="currentPath" :containerWidth="600" @navigate="onNavigate" />
            </template>
          </Header>
        </template>
        <Column selectionMode="multiple" headerStyle="width: 3rem" />
        <Column field="name" header="Name" sortable>
          <template #body="{ data }">
            <div class="flex items-center gap-2 cursor-pointer">
              <i :class="[data.type === 'folder' ? 'pi pi-folder text-yellow-500' : 'pi pi-file text-color-secondary']" />
              <span>{{ data.name }}</span>
            </div>
          </template>
        </Column>
        <Column field="size" header="Size" style="width: 120px" />
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
      </DataTable>
    `
  })
}

export const RulesEngineWithReorder = {
  render: () => ({
    components: {
      DataTable,
      Column: DataTable.Column,
      PositionInput: DataTable.PositionInput,
      ReviewChanges: DataTable.ReviewChanges
    },
    data() {
      return {
        rules: rulesEngine.map(r => ({ ...r })),
        originalRules: rulesEngine.map(r => ({ ...r })),
        alteredCount: 0
      }
    },
    methods: {
      changePosition(row, newPos) {
        const oldPos = row.order
        this.rules.forEach(r => {
          if (r.id === row.id) {
            r.order = newPos
          } else if (newPos < oldPos && r.order >= newPos && r.order < oldPos) {
            r.order++
          } else if (newPos > oldPos && r.order <= newPos && r.order > oldPos) {
            r.order--
          }
        })
        this.rules.sort((a, b) => a.order - b.order)
        this.alteredCount = this.rules.filter((r, i) => r.order !== this.originalRules[i].order).length
      },
      onDiscard() {
        this.rules = this.originalRules.map(r => ({ ...r }))
        this.alteredCount = 0
      }
    },
    template: `
      <DataTable
        :value="rules"
        :columns="[
          { field: 'order', header: 'Order' },
          { field: 'name', header: 'Name' },
          { field: 'phase', header: 'Phase' },
          { field: 'status', header: 'Status' }
        ]"
        reorderableRows
      >
        <Column header="Order" style="width: 100px">
          <template #body="{ data }">
            <PositionInput :modelValue="data.order" :min="1" :max="rules.length" @update:modelValue="(v) => changePosition(data, v)" />
          </template>
        </Column>
        <Column field="name" header="Name" />
        <Column field="phase" header="Phase" />
        <Column field="status" header="Status">
          <template #body="{ data }">
            <span :class="['px-2 py-1 rounded-full text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <template #footer v-if="alteredCount > 0">
          <ReviewChanges :alteredCount="alteredCount" @discard="onDiscard" @review="console.log('Review changes')" />
        </template>
      </DataTable>
    `
  })
}

export const WithInlineCreate = {
  render: () => ({
    components: {
      DataTable,
      Column: DataTable.Column,
      InlineCreate: DataTable.InlineCreate
    },
    data() {
      return {
        showCreate: true,
        newName: '',
        items: [
          { id: 'new', isNew: true },
          ...storageObjects
        ]
      }
    },
    methods: {
      formatDate,
      noSpecialChars(value) {
        return !/[<>:"/\\|?*]/.test(value)
      },
      onSave() {
        const name = this.newName.endsWith('/') ? this.newName : this.newName + '/'
        this.items = [
          { id: Date.now(), name, size: '-', type: 'folder', lastModified: new Date().toISOString() },
          ...this.items.filter(i => !i.isNew)
        ]
        this.newName = ''
        this.showCreate = false
      },
      onCancel() {
        this.items = this.items.filter(i => !i.isNew)
        this.showCreate = false
      }
    },
    template: `
      <DataTable
        :value="items"
        :columns="[{ field: 'name', header: 'Name' }, { field: 'size', header: 'Size' }, { field: 'lastModified', header: 'Last Modified' }]"
      >
        <Column field="name" header="Name">
          <template #body="{ data }">
            <InlineCreate
              v-if="data.isNew"
              v-model="newName"
              placeholder="Enter folder name..."
              :validator="noSpecialChars"
              errorMessage="Special characters are not allowed"
              @save="onSave"
              @cancel="onCancel"
            />
            <div v-else class="flex items-center gap-2">
              <i :class="[data.type === 'folder' ? 'pi pi-folder text-yellow-500' : 'pi pi-file text-color-secondary']" />
              <span>{{ data.name }}</span>
            </div>
          </template>
        </Column>
        <Column field="size" header="Size" style="width: 120px">
          <template #body="{ data }">
            <span v-if="!data.isNew">{{ data.size }}</span>
          </template>
        </Column>
        <Column field="lastModified" header="Last Modified">
          <template #body="{ data }">
            <span v-if="!data.isNew">{{ formatDate(data.lastModified) }}</span>
          </template>
        </Column>
      </DataTable>
    `
  })
}

export const WithPagination = {
  render: () => ({
    components: { DataTable, Column: DataTable.Column },
    setup() {
      return { items: edgeApplications, formatDate }
    },
    template: `
      <DataTable :value="items" paginator :rows="5" :rowsPerPageOptions="[5, 10, 25]" :columns="[{ field: 'name', header: 'Name' }]">
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
      </DataTable>
    `
  })
}

export const WithViewAllFooter = {
  render: () => ({
    components: {
      DataTable,
      Column: DataTable.Column,
      ViewAllFooter: DataTable.ViewAllFooter
    },
    setup() {
      return { items: edgeApplications.slice(0, 5), formatDate }
    },
    template: `
      <DataTable
        :value="items"
        :columns="[{ field: 'name', header: 'Name' }]"
      >
        <Column field="name" header="Name" />
        <Column field="status" header="Status" style="width: 100px">
          <template #body="{ data }">
            <span :class="['px-2 py-0.5 rounded text-xs font-medium', data.status === 'Active' ? 'bg-green-900/30 text-green-400' : 'bg-gray-700/30 text-gray-400']">
              {{ data.status }}
            </span>
          </template>
        </Column>
        <Column field="lastModified" header="Last Modified">
          <template #body="{ data }">
            {{ formatDate(data.lastModified) }}
          </template>
        </Column>
        <template #footer>
          <ViewAllFooter label="View all Edge Applications..." />
        </template>
      </DataTable>
    `
  })
}

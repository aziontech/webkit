<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  type EntryStatus = 'Active' | 'Inactive'

  type Entry = {
    id: string
    name: string
    status: EntryStatus
    owner: string
    modifiedAt: Date
  }

  type Sibling = {
    id: string
    label: string
    noun: string
  }

  const tabs = [
    { value: 'web-security', label: 'Web security' },
    { value: 'network-security', label: 'Network security' },
    { value: 'private-access', label: 'Private access' },
    { value: 'data-protection', label: 'Data protection' },
    { value: 'objects', label: 'Objects' },
    { value: 'settings', label: 'Settings' },
    { value: 'versions', label: 'Versions' }
  ]

  const activeTab = ref('network-security')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const siblings: Sibling[] = [
    { id: 'network-lists', label: 'Network lists', noun: 'List' },
    { id: 'firewall-rules', label: 'Firewall rules', noun: 'Rule' },
    { id: 'rate-limits', label: 'Rate limits', noun: 'Limit' },
    { id: 'geo-blocks', label: 'Geo blocks', noun: 'Geo Block' },
    { id: 'port-rules', label: 'Port rules', noun: 'Port Rule' },
    { id: 'exceptions', label: 'Exceptions', noun: 'Exception' }
  ]

  const base = '/policies/acme-default/network-security'

  const options = siblings.map((sibling) => ({ label: sibling.label, value: sibling.id }))

  const page = ref('firewall-rules')

  const current = computed(
    () => siblings.find((sibling) => sibling.id === page.value) ?? siblings[0]
  )

  const owners = ['Jane Doe', 'John Smith', 'Alex Morgan', 'Sam Lee', 'Priya Patel']

  const referenceTime = Date.UTC(2026, 10, 10, 12)

  const entries = computed<Entry[]>(() =>
    Array.from({ length: 6 }, (_, index) => {
      const n = index + 1
      const slug = current.value.noun.toLowerCase().replace(/\s+/g, '-')
      return {
        id: `${30410 + n * 157}`,
        name: `${slug}-${String(n).padStart(2, '0')}`,
        status: n === 5 ? 'Inactive' : 'Active',
        owner: owners[index % owners.length],
        modifiedAt: new Date(referenceTime - n * 9 * 86_400_000)
      }
    })
  )

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'status', label: 'Status', options: [{ value: 'Active' }, { value: 'Inactive' }] },
    { key: 'owner', label: 'Author', options: owners.map((owner) => ({ value: owner })) }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'modifiedAt', header: 'Last Modified', enableSorting: true, minWidth: 80 }
  ]

  const {
    tableProps,
    propertyFilterProps,
    clearFilters,
    loading: fetching
  } = useCollection({
    items: () => entries.value,
    columns,
    filtering: { fields: ['name', 'id', 'status', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10 }
  })

  const pick = (value: string | undefined) => {
    if (!value || value === page.value) return
    page.value = value
    clearFilters()
  }

  const loading = ref(false)
  let refreshTimer: ReturnType<typeof setTimeout> | undefined
  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Item
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <section class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1">
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <div class="flex min-w-0">
            <ToggleGroup
              :model-value="page"
              :options="options"
              size="medium"
              :aria-label="tabLabel"
              @update:model-value="pick"
            />
          </div>
          <div class="flex min-w-0 flex-1 flex-col">
            <PageHeader
              :title="current.label"
              :description="`${current.label} of the acme-default policy.`"
              size="small"
            >
              <template #actions>
                <Button
                  label="Documentation"
                  icon="pi pi-book"
                  kind="outlined"
                  size="medium"
                  href="https://example.com/docs/private-access"
                  target="_blank"
                />
                <Button
                  :label="`Add ${current.noun}`"
                  icon="pi pi-plus"
                  kind="outlined"
                  size="medium"
                />
              </template>
            </PageHeader>
            <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
              <header class="flex items-start gap-(--layout-group-gap)">
                <div class="flex min-w-0 grow">
                  <PropertyFilter
                    v-bind="propertyFilterProps"
                    :placeholder="`Filter ${current.label.toLowerCase()}`"
                    :aria-label="`Filter ${current.label.toLowerCase()}`"
                  />
                </div>
                <Tooltip
                  text="Refresh"
                  class="shrink-0"
                >
                  <IconButton
                    icon="pi pi-refresh"
                    kind="outlined"
                    size="medium"
                    :loading="loading"
                    aria-label="Refresh"
                    @click="refresh"
                  />
                </Tooltip>
              </header>
              <Card :padded="false">
                <template #content>
                  <TableRoot
                    v-bind="tableProps"
                    :loading="loading || fetching"
                    enable-sorting
                    :bordered="false"
                  >
                    <template #cell-name="{ row }">
                      <Table.CellLink
                        :label="row.name"
                        :to="`${base}/${page}/${row.id}`"
                        :destination="current.label"
                      />
                    </template>
                    <template #cell-id="{ value }">
                      <Table.CellId
                        :value="value"
                        :resource="current.noun.toLowerCase()"
                      />
                    </template>
                    <template #cell-status="{ value }">
                      <Table.CellStatus
                        :label="value"
                        :severity="value === 'Active' ? 'success' : 'secondary'"
                      />
                    </template>
                    <template #cell-modifiedAt="{ row }">
                      <Table.CellTime
                        :value="row.modifiedAt"
                        :author="row.owner"
                      />
                    </template>
                    <template #empty>
                      <EmptyState
                        size="medium"
                        icon="pi pi-filter-slash"
                        :title="`No matching ${current.label.toLowerCase()}`"
                        description="Nothing matches these filters."
                      >
                        <template #actions>
                          <Button
                            label="Clear filters"
                            kind="outlined"
                            size="small"
                            @click="clearFilters"
                          />
                        </template>
                      </EmptyState>
                    </template>
                  </TableRoot>
                </template>
              </Card>
            </section>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

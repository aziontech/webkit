<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import type { MenuGroupNode, MenuNode } from '@aziontech/webkit/menu'
  import MenuRoot from '@aziontech/webkit/menu-root'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import TableRoot, { type TableColumn } from '@aziontech/webkit/table-root'
  import Tabs from '@aziontech/webkit/tabs'
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

  const activeTab = ref('private-access')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const base = '/policies/acme-default/private-access'

  const sections: { label: string; items: Sibling[] }[] = [
    {
      label: 'Applications',
      items: [
        { id: 'app-segments', label: 'App segments', noun: 'Segment' },
        { id: 'segment-groups', label: 'Segment groups', noun: 'Group' },
        { id: 'server-groups', label: 'Server groups', noun: 'Server Group' },
        { id: 'connectors', label: 'Connectors', noun: 'Connector' }
      ]
    },
    {
      label: 'Access',
      items: [
        { id: 'access-rules', label: 'Access rules', noun: 'Rule' },
        { id: 'identity-providers', label: 'Identity providers', noun: 'Provider' },
        { id: 'posture-checks', label: 'Posture checks', noun: 'Check' },
        { id: 'device-groups', label: 'Device groups', noun: 'Device Group' }
      ]
    },
    {
      label: 'Network',
      items: [
        { id: 'tunnels', label: 'Tunnels', noun: 'Tunnel' },
        { id: 'dns-resolvers', label: 'DNS resolvers', noun: 'Resolver' },
        { id: 'split-routes', label: 'Split routes', noun: 'Route' },
        { id: 'ip-pools', label: 'IP pools', noun: 'Pool' }
      ]
    },
    {
      label: 'Monitoring',
      items: [
        { id: 'alerts', label: 'Alerts', noun: 'Alert' },
        { id: 'reports', label: 'Reports', noun: 'Report' },
        { id: 'log-streams', label: 'Log streams', noun: 'Stream' },
        { id: 'webhooks', label: 'Webhooks', noun: 'Webhook' }
      ]
    }
  ]

  const hrefOf = (sibling: Sibling) => `${base}/${sibling.id}`

  const groups: MenuGroupNode[] = sections.map((section) => ({
    label: section.label,
    items: section.items.map((sibling) => ({
      id: sibling.id,
      label: sibling.label,
      href: hrefOf(sibling)
    }))
  }))

  const siblings = sections.flatMap((section) => section.items)

  const routePath = ref(`${base}/access-rules`)

  const match = computed(() => siblings.find((sibling) => hrefOf(sibling) === routePath.value))
  const current = computed(() => match.value ?? siblings[0])

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

  const go = (href: string) => {
    if (href === routePath.value) return
    routePath.value = href
    clearFilters()
  }

  const navigate = (event: MouseEvent, node: MenuNode) => {
    if (!node.href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    go(node.href)
  }

  const pick = (value: string | undefined) => {
    if (value) go(value)
  }

  const labelOf = (value: string | undefined) =>
    siblings.find((sibling) => hrefOf(sibling) === value)?.label ?? ''

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
      <div class="layout-column layout-boundary @container/tab flex min-w-0 flex-col">
        <div
          class="flex min-w-0 flex-col gap-(--layout-group-gap) @3xl/tab:flex-row @3xl/tab:items-start @3xl/tab:gap-(--layout-section-gap)"
        >
          <div class="hidden w-(--container-3xs) shrink-0 @3xl/tab:block">
            <MenuRoot
              :groups="groups"
              :active-id="match?.id ?? ''"
              :aria-label="tabLabel"
              @navigate="navigate"
            />
          </div>

          <div class="w-full max-w-(--layout-measure-control) @3xl/tab:hidden">
            <Field>
              <Field.Label>{{ tabLabel }}</Field.Label>
              <Select
                :model-value="routePath"
                size="medium"
                :display-value="labelOf"
                @update:model-value="pick"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Group
                    v-for="section in sections"
                    :key="section.label"
                    :label="section.label"
                  >
                    <Select.Option
                      v-for="sibling in section.items"
                      :key="sibling.id"
                      :value="hrefOf(sibling)"
                    >
                      {{ sibling.label }}
                    </Select.Option>
                  </Select.Group>
                </Select.Content>
              </Select>
            </Field>
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
                        :to="`${routePath}/${row.id}`"
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

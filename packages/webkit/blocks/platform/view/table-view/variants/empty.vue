<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Table from '@aziontech/webkit/table'
  import TableRoot, {
    type DropdownMenuOptionValue,
    type TableColumn
  } from '@aziontech/webkit/table-root'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, ref, useId } from 'vue'

  type ResourceStatus = 'Live' | 'Inactive'

  type Resource = {
    id: string
    name: string
    domain: string
    domains: string[]
    domainCount: number
    status: ResourceStatus
    owner: string
    modifiedAt: Date
    lastModified: string
  }

  const owners = [
    'Ethan Brooks',
    'Jordan Kim',
    'Taylor Reed',
    'John Smith',
    'Sam Lee',
    'Priya Patel',
    'Chris Taylor',
    'Riley Carter'
  ]

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'owner',
      label: 'Author',
      options: owners.map((owner) => ({ value: owner }))
    },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'lastModified', header: 'Last Modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const rows: Resource[] = []

  const items = ref<Resource[]>(rows)

  const {
    tableProps,
    propertyFilterProps,
    preferencesProps,
    status,
    matchingItems,
    clearFilters,
    loading: fetching
  } = useCollection({
    items,
    columns,
    filtering: { fields: ['name', 'id', 'domain', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: {
      storageKey: 'resources-table',
      defaults: { columns: [{ id: 'id', visible: false }] }
    },
    url: true
  })

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

  const exportCsv = () =>
    downloadCsv(
      'resources.csv',
      toCsv({
        columns: columns
          .filter((column) => column.kind !== 'action')
          .map((column) => ({ id: column.accessorKey ?? '', header: column.header ?? '' })),
        rows: matchingItems.value
      })
    )

  const pending = ref<Resource | null>(null)
  const deleteOpen = ref(false)
  const confirmation = ref('')
  const confirmLabelId = useId()
  const canDelete = computed(
    () => pending.value !== null && confirmation.value.trim() === pending.value.name
  )

  const onRowAction = (value: DropdownMenuOptionValue, row: Resource) => {
    if (value !== 'delete') return
    pending.value = row
    confirmation.value = ''
    deleteOpen.value = true
  }

  const confirmDelete = () => {
    if (!canDelete.value) return
    items.value = items.value.filter((item) => item.id !== pending.value?.id)
    deleteOpen.value = false
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Resources"
        description="View and manage your resources."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            label="Create Resource"
            icon="pi pi-plus"
            kind="primary"
            size="large"
          />
        </template>
      </PageHeader>
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter resources"
                aria-label="Filter resources"
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
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
              <Tooltip
                text="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-download"
                  kind="outlined"
                  size="medium"
                  :disabled="!matchingItems.length"
                  aria-label="Download CSV"
                  @click="exportCsv"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
              />
            </div>
          </header>
          <section class="flex min-h-0 flex-col">
            <Card
              key="card-1"
              v-if="status === 'empty'"
              :padded="false"
            >
              <template #content>
                <EmptyState
                  size="medium"
                  icon="pi pi-box"
                  title="No resources yet"
                  description="Create a resource to start serving traffic on your domains."
                >
                  <template #actions>
                    <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
                      <Button
                        label="Create Resource"
                        icon="pi pi-plus"
                        kind="secondary"
                        size="small"
                      />
                      <Button
                        label="Documentation"
                        icon="pi pi-book"
                        kind="outlined"
                        size="small"
                        href="https://example.com/docs/resources"
                        target="_blank"
                      />
                    </div>
                  </template>
                </EmptyState>
              </template>
            </Card>
            <Card
              key="card-2"
              v-else
              :padded="false"
            >
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
                      :to="`/resources/${row.id}`"
                      destination="Resources"
                    />
                  </template>
                  <template #cell-id="{ value }">
                    <Table.CellId
                      :value="value"
                      resource="resource"
                    />
                  </template>
                  <template #cell-domain="{ row }">
                    <Table.CellLink
                      :label="row.domain"
                      :href="`https://${row.domain}`"
                      :more="
                        row.domains.slice(1).map((label) => ({ label, href: `https://${label}` }))
                      "
                      :more-noun="{ one: 'domain', other: 'domains' }"
                      copyable
                    />
                  </template>
                  <template #cell-status="{ value }">
                    <Table.CellStatus
                      :label="value"
                      :severity="value === 'Live' ? 'success' : 'secondary'"
                    />
                  </template>
                  <template #cell-lastModified="{ row }">
                    <Table.CellTime
                      :value="row.modifiedAt"
                      :author="row.owner"
                    />
                  </template>
                  <template #cell-actions="{ row }">
                    <Table.CellActions
                      :name="row.name"
                      @select="(_event, value) => onRowAction(value, row)"
                    >
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="deploy"
                          label="Deploy"
                        >
                          <template #left
                            ><i
                              class="pi pi-cloud-upload"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                        <DropdownMenuOption
                          value="view"
                          label="View details"
                        >
                          <template #left
                            ><i
                              class="pi pi-eye"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                        <DropdownMenuOption
                          value="duplicate"
                          label="Clone"
                        >
                          <template #left
                            ><i
                              class="pi pi-clone"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                      <DropdownMenuGroup>
                        <DropdownMenuOption
                          value="delete"
                          label="Delete"
                        >
                          <template #left
                            ><i
                              class="pi pi-trash"
                              aria-hidden="true"
                          /></template>
                        </DropdownMenuOption>
                      </DropdownMenuGroup>
                    </Table.CellActions>
                  </template>
                  <template #empty>
                    <EmptyState
                      size="medium"
                      icon="pi pi-filter-slash"
                      title="No matching resources"
                      description="No resource matches these filters."
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
        </section>
      </section>
    </div>
    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete resource"
      size="medium"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <Alert
          severity="warning"
          label="Once confirmed, this action can't be reversed."
        />
        <p class="m-0 text-body-sm text-(--text-muted)">
          The selected resource will be deleted, along with its domains and settings.
        </p>
        <p
          :id="confirmLabelId"
          class="m-0 text-body-sm text-(--text-default)"
        >
          Type <code class="text-label-code-sm">{{ pending?.name }}</code> to confirm.
        </p>
        <Input
          v-model="confirmation"
          :aria-labelledby="confirmLabelId"
          autocomplete="off"
          class="w-full"
          @keydown.enter="confirmDelete"
        />
      </div>
      <template #actions="{ close }">
        <Button
          label="Cancel"
          kind="outlined"
          size="medium"
          @click="close"
        />
        <Button
          label="Delete resource"
          kind="danger"
          size="medium"
          :disabled="!canDelete"
          @click="confirmDelete"
        />
      </template>
    </ConfirmDialog>
  </div>
</template>

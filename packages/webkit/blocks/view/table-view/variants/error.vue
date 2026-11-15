<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import { type TableColumn } from '@aziontech/webkit/data-table'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'owner', label: 'Author' },
    { key: 'status', label: 'Status', options: [{ value: 'Live' }, { value: 'Inactive' }] },
    { key: 'domain', label: 'Domain' }
  ]

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'id', header: 'ID', minWidth: 80 },
    { accessorKey: 'domain', header: 'Domains', grow: 2 },
    { accessorKey: 'status', header: 'Status', enableSorting: true, minWidth: 104 },
    { accessorKey: 'modifiedAt', header: 'Last modified', enableSorting: true, minWidth: 80 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const { propertyFilterProps, preferencesProps } = useCollection({
    items: [],
    columns,
    filtering: { fields: ['name', 'id', 'domain', 'owner', 'status'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
    preferences: { defaults: { columns: [{ id: 'id', visible: false }] } }
  })
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
            icon="ai ai-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/resources"
            target="_blank"
          />
          <Button
            label="Create Resource"
            icon="ai ai-plus"
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
                disabled
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Tooltip
                text="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="ai ai-refresh"
                  kind="outlined"
                  size="medium"
                  aria-label="Refresh"
                  @click="(event: MouseEvent) => emit('retry', event)"
                />
              </Tooltip>
              <Tooltip
                text="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="ai ai-download"
                  kind="outlined"
                  size="medium"
                  disabled
                  aria-label="Download CSV"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
                disabled
              />
            </div>
          </header>
          <Alert
            severity="danger"
            label="Couldn't load the resources. Check your connection and retry."
            action-label="Retry"
            @action="(event) => emit('retry', event)"
          />
        </section>
      </section>
    </div>
  </div>
</template>

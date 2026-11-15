<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CardList from '@aziontech/webkit/card-list'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'

  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    {
      key: 'status',
      label: 'Status',
      options: [{ value: 'Active' }, { value: 'Degraded' }, { value: 'Inactive' }]
    },
    {
      key: 'region',
      label: 'Region',
      options: [{ value: 'sa-east' }, { value: 'us-east' }, { value: 'eu-west' }]
    },
    { key: 'requests', label: 'Requests in 24h', type: 'number' }
  ]

  const { cardListProps, propertyFilterProps, preferencesProps } = useCollection({
    items: [],
    columns: [
      { id: 'status', header: 'Status' },
      { id: 'domain', header: 'Domain' },
      { id: 'region', header: 'Region' },
      { id: 'requests', header: 'Requests in 24h' },
      { id: 'owner', header: 'Owner' }
    ],
    filtering: { fields: ['name', 'domain', 'owner'] },
    propertyFiltering: { properties },
    pagination: { pageSize: 12, pageSizeOptions: [12, 24, 48] },
    selection: { mode: 'multiple' },
    preferences: { defaults: { columns: [{ id: 'owner', visible: false }] } }
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Applications"
        description="View and manage your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/applications"
            target="_blank"
          />
          <Button
            label="Create Application"
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
                placeholder="Filter applications"
                aria-label="Filter applications"
                disabled
              />
            </div>
            <div class="flex shrink-0 items-center gap-(--spacing-xs)">
              <Button
                label="Delete"
                icon="ai ai-trash"
                kind="outlined"
                size="medium"
                disabled
              />
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Card preferences"
                :sections="['page-size', 'columns']"
                disabled
              />
            </div>
          </header>
          <CardList
            v-bind="cardListProps"
            loading
            aria-label="Applications"
          />
        </section>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const { propertyFilterProps } = useCollection({
    items: [],
    filtering: { fields: ['name', 'vendor', 'description'] },
    propertyFiltering: { properties: [{ key: 'name', label: 'Name' }] }
  })
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Marketplace"
        description="Find integrations that run on your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="ai ai-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <section
          class="flex min-w-0 flex-col gap-(--layout-group-gap) pt-(--layout-group-gap)"
          aria-busy="true"
          aria-label="Loading integrations"
        >
          <PropertyFilter
            v-bind="propertyFilterProps"
            placeholder="Search integrations"
            aria-label="Search integrations"
            disabled
          />
          <ul
            class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 xl:grid-cols-3"
          >
            <li
              v-for="tile in 6"
              :key="tile"
              class="flex min-w-0"
            >
              <Card class="w-full">
                <template #default>
                  <div class="flex flex-col gap-(--spacing-md)">
                    <div class="flex items-start gap-(--spacing-md)">
                      <Skeleton
                        width="2.5rem"
                        height="2.5rem"
                      />
                      <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                        <Skeleton
                          width="50%"
                          height="1rem"
                        />
                        <Skeleton height="0.875rem" />
                        <Skeleton
                          width="75%"
                          height="0.875rem"
                        />
                      </div>
                    </div>
                    <div class="flex items-center justify-between">
                      <Skeleton
                        width="5rem"
                        height="1.25rem"
                      />
                      <Skeleton
                        width="4.5rem"
                        height="2rem"
                      />
                    </div>
                  </div>
                </template>
              </Card>
            </li>
          </ul>
        </section>
      </div>
    </div>
  </div>
</template>

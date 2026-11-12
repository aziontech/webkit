<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const { propertyFilterProps } = useCollection({
    items: [],
    filtering: { fields: ['title', 'description'] },
    propertyFiltering: { properties: [{ key: 'title', label: 'Name' }] }
  })

  const sections = [
    { id: 'frameworks', tiles: 6 },
    { id: 'starters', tiles: 3 }
  ]
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Templates"
        description="Start a project from a template and deploy it in a few steps."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/templates"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)"
        aria-busy="true"
        aria-label="Loading templates"
      >
        <PropertyFilter
          v-bind="propertyFilterProps"
          placeholder="Search templates"
          aria-label="Search templates"
          disabled
        />
        <div
          v-for="section in sections"
          :key="section.id"
          class="flex min-w-0 flex-col gap-(--layout-group-gap)"
        >
          <Skeleton
            width="6rem"
            height="1rem"
          />
          <ul
            class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
          >
            <li
              v-for="tile in section.tiles"
              :key="tile"
              class="flex min-w-0"
            >
              <Card class="w-full">
                <template #content>
                  <div class="flex flex-col items-start gap-(--spacing-md)">
                    <Skeleton
                      width="2.5rem"
                      height="2.5rem"
                    />
                    <div class="flex w-full flex-col gap-(--spacing-xs)">
                      <Skeleton
                        width="60%"
                        height="1rem"
                      />
                      <Skeleton height="0.875rem" />
                      <Skeleton
                        width="80%"
                        height="0.875rem"
                      />
                    </div>
                    <Skeleton
                      width="4rem"
                      height="1.25rem"
                    />
                  </div>
                </template>
              </Card>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

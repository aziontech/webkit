<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  const activeTab = ref('integrations')

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
        description="Find integrations and templates that run on your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/marketplace"
            target="_blank"
          />
        </template>
      </PageHeader>

      <div class="layout-section-start">
        <Tabs.Root v-model="activeTab">
          <Tabs.List align="center">
            <Tabs.Item
              value="integrations"
              label="Integrations"
            />
            <Tabs.Item
              value="templates"
              label="Templates"
            />
          </Tabs.List>
          <Tabs.Content>
            <Tabs.Panel value="integrations">
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
                      <template #content>
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
            </Tabs.Panel>
            <Tabs.Panel value="templates" />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  </div>
</template>

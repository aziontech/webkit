<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import PageHeader from '@aziontech/webkit/page-header'
  import { computed, ref } from 'vue'

  import ResourceTabBar from '../parts/resource-tab-bar.vue'
  import ResourceVersionsTable from '../parts/resource-versions-table.vue'
  import TabRouteEmpty from '../parts/tab-route-empty.vue'
  import { resourceTabs as tabs } from '../sample'

  const activeTab = ref('versions')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <ResourceTabBar
      v-model="activeTab"
      :tabs="tabs"
    />

    <div
      v-if="activeTab === 'versions'"
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="layout-column layout-boundary flex min-w-0 flex-col">
            <PageHeader
              title="Versions"
              description="Each version is an isolated snapshot of this resource's configuration. Open one to view it, or deploy a Ready version."
              size="small"
            >
              <template #actions>
                <Button
                  label="Add Version"
                  icon="az az-plus"
                  variant="outline"
                  size="medium"
                />
              </template>
            </PageHeader>

            <ResourceVersionsTable />
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <TabRouteEmpty
        :label="tabLabel"
        :href="`/resources/analytics-app/${activeTab}`"
      />
    </div>
  </div>
</template>

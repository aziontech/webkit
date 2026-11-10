<script setup>
  import TabView from '@aziontech/webkit/tab-view'
  import { ref } from 'vue'

  const activeTab = ref('overview')
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'variables', label: 'Variables' },
    { value: 'rules', label: 'Rules' },
    { value: 'logs', label: 'Logs' },
    { value: 'metrics', label: 'Metrics' },
    { value: 'settings', label: 'Settings' }
  ]
</script>

<template>
  <div class="border-b border-(--border-default)">
    <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
      <div class="flex -ml-(--spacing-xs) min-w-0 flex-1">
        <TabView
          v-model:value="activeTab"
          class="w-full"
        >
          <TabView.List>
            <TabView.Item
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              :label="tab.label"
            />
          </TabView.List>
        </TabView>
      </div>
    </div>
  </div>
</template>

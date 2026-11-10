<script setup>
  import Tabs from '@aziontech/webkit/tabs'
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
        <Tabs
          v-model:value="activeTab"
          class="w-full"
        >
          <Tabs.List>
            <Tabs.Item
              v-for="tab in tabs"
              :key="tab.value"
              :value="tab.value"
              :label="tab.label"
            />
          </Tabs.List>
        </Tabs>
      </div>
    </div>
  </div>
</template>

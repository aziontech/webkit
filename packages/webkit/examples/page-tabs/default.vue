<script setup>
  import PageTabs from '@aziontech/webkit/page-tabs'
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
  <PageTabs v-model="activeTab">
    <Tabs.Item
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
  </PageTabs>
</template>

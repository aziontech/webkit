<script setup>
  import Button from '@aziontech/ui/button'
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs from '@aziontech/ui/tabs'
  import Tag from '@aziontech/ui/tag'
  import { ref } from 'vue'

  const activeTab = ref('overview')
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]
</script>

<template>
  <PageTabs v-model="activeTab">
    <Tabs.Trigger
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
    <template #actions>
      <Tag
        severity="warning"
        size="small"
        label="2 changes"
      />
      <Button
        label="Deploy"
        variant="outline"
        size="medium"
        icon="az az-cloud-upload"
      />
    </template>
  </PageTabs>
</template>

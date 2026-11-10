<script setup>
  import Button from '@aziontech/webkit/button'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const activeTab = ref('overview')
  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
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
      <div class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)">
        <Tag
          severity="warning"
          size="small"
          label="2 changes"
        />
        <Button
          label="Deploy"
          kind="outlined"
          size="medium"
          icon="pi pi-cloud-upload"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs from '@aziontech/ui/tabs'
  import { ref } from 'vue'

  const activeTab = ref('general')
  const tabs = [
    { value: 'general', label: 'General' },
    { value: 'members', label: 'Members' },
    { value: 'billing', label: 'Billing' }
  ]
</script>

<template>
  <PageTabs
    v-model="activeTab"
    column="form"
  >
    <Tabs.Trigger
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :label="tab.label"
    />
  </PageTabs>
</template>

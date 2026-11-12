<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const tabs = [
    {
      value: 'tab-1',
      label: 'Overview'
    },
    {
      value: 'tab-2',
      label: 'Metrics'
    },
    {
      value: 'tab-3',
      label: 'Logs'
    },
    {
      value: 'tab-4',
      label: 'Settings'
    },
    {
      value: 'tab-5',
      label: 'Security'
    },
    {
      value: 'tab-6',
      label: 'Integrations'
    },
    {
      value: 'tab-7',
      label: 'Billing'
    },
    {
      value: 'tab-8',
      label: 'Advanced'
    }
  ]
  const active = ref('tab-1')
</script>

<template>
  <Tabs.Root
    v-model="active"
    class="w-full max-w-[20rem]"
  >
    <Tabs.List>
      <Tabs.Item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
    </Tabs.List>
    <div class="mt-(--spacing-4)">
      <Tabs.Content>
        <Tabs.Panel
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
        >
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for {{ tab.label }}</p>
          </div>
        </Tabs.Panel>
      </Tabs.Content>
    </div>
  </Tabs.Root>
</template>

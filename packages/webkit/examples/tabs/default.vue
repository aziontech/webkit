<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('tab-1')
</script>

<template>
  <Tabs.Root
    v-model:value="active"
    class="w-full max-w-[40rem]"
  >
    <Tabs.List>
      <Tabs.Item
        value="tab-1"
        label="Tab Item"
      />
      <Tabs.Item
        value="tab-2"
        label="Tab Item"
      />
      <Tabs.Item
        value="tab-3"
        label="Tab Item"
      />
    </Tabs.List>
    <Tabs.Content class="mt-(--spacing-4)">
      <Tabs.Panel
        value="tab-1"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 1</p>
      </Tabs.Panel>
      <Tabs.Panel
        value="tab-2"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 2</p>
      </Tabs.Panel>
      <Tabs.Panel
        value="tab-3"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 3</p>
      </Tabs.Panel>
    </Tabs.Content>
  </Tabs.Root>
</template>

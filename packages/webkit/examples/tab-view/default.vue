<script setup>
  import TabView from '@aziontech/webkit/tab-view'
  import { ref } from 'vue'

  const active = ref('tab-1')
</script>

<template>
  <TabView.Root
    v-model:value="active"
    class="w-full max-w-[40rem]"
  >
    <TabView.List>
      <TabView.Item
        value="tab-1"
        label="Tab Item"
      />
      <TabView.Item
        value="tab-2"
        label="Tab Item"
      />
      <TabView.Item
        value="tab-3"
        label="Tab Item"
      />
    </TabView.List>
    <TabView.Content class="mt-(--spacing-4)">
      <TabView.Panel
        value="tab-1"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 1</p>
      </TabView.Panel>
      <TabView.Panel
        value="tab-2"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 2</p>
      </TabView.Panel>
      <TabView.Panel
        value="tab-3"
        class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)"
      >
        <p class="text-body-sm text-(--text-default)">Content for tab 3</p>
      </TabView.Panel>
    </TabView.Content>
  </TabView.Root>
</template>

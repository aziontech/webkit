<script setup>
  import Tabs from '@aziontech/webkit/tabs'
  import { ref } from 'vue'

  const active = ref('tab-1')
</script>

<template>
  <Tabs.Root
    v-model="active"
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
    <div class="w-full pt-(--spacing-4)">
      <Tabs.Content>
        <Tabs.Panel value="tab-1">
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for tab 1</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="tab-2">
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for tab 2</p>
          </div>
        </Tabs.Panel>
        <Tabs.Panel value="tab-3">
          <div class="rounded-(--shape-card) border border-(--border-default) p-(--spacing-4)">
            <p class="text-body-sm text-(--text-default)">Content for tab 3</p>
          </div>
        </Tabs.Panel>
      </Tabs.Content>
    </div>
  </Tabs.Root>
</template>

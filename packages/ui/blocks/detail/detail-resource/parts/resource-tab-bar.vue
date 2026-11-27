<script setup lang="ts">
  import PageTabs from '@aziontech/ui/page-tabs'
  import Tabs from '@aziontech/ui/tabs'

  defineProps<{
    /** The tabs, in order. */
    tabs: { value: string; label: string }[]
    /** The tab that holds unsaved changes; empty when none does. */
    dirtyTab?: string
  }>()

  const model = defineModel<string>({ required: true })

  defineSlots<{ actions?(): unknown }>()
</script>

<template>
  <div class="sticky top-0 z-1 bg-(--bg-canvas)">
    <PageTabs v-model="model">
      <Tabs.Trigger
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
        :dirty="Boolean(dirtyTab) && tab.value === dirtyTab"
      />
      <template
        v-if="$slots.actions"
        #actions
      >
        <slot name="actions" />
      </template>
    </PageTabs>
  </div>
</template>

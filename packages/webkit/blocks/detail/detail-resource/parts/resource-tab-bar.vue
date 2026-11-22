<script setup lang="ts" generic="T extends string">
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Tabs from '@aziontech/webkit/tabs'

  defineProps<{
    /** The tabs, in order. */
    tabs: { value: T; label: string }[]
    /** The tab that holds unsaved changes; empty when none does. */
    dirtyTab?: string
  }>()

  const model = defineModel<T>({ required: true })

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

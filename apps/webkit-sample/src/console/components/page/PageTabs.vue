<script setup lang="ts">
  import TabView from '@aziontech/webkit/tab-view'

  const COLUMN_CLASS = {
    full: '',
    data: 'layout-column',
    form: 'layout-column-form',
    focused: 'layout-column-focused'
  }

  interface Props {
    tabs: unknown[]
    column?: 'full' | 'data' | 'form' | 'focused'
  }

  withDefaults(defineProps<Props>(), {
    column: 'full'
  })

  defineSlots<{
    actions(): unknown
  }>()

  const activeTab = defineModel('value', { type: [String, Number], default: null })
</script>

<template>
  <div class="border-b border-(--border-default)">
    <div
      :class="[
        'layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)',
        COLUMN_CLASS[column]
      ]"
    >
      <TabView
        v-model:value="activeTab"
        class="-ml-(--spacing-xs) min-w-0 flex-1"
      >
        <TabView.List>
          <TabView.Item
            v-for="tab in tabs"
            :key="tab.value"
            :value="tab.value"
            :label="tab.label"
          />
        </TabView.List>
      </TabView>
      <div
        v-if="$slots.actions"
        class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

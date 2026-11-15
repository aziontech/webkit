<script setup lang="ts">
  import { inject } from 'vue'

  import { TabsInjectionKey, type TabsValue } from './injection-key'
  import TabsPanel from './tabs-panel.vue'

  defineOptions({
    name: 'TabsContent',
    inheritAttrs: false
  })

  interface Props {
    /** Tab value this panel is bound to. */
    value: TabsValue
  }

  const props = defineProps<Props>()

  defineSlots<{ default(): unknown }>()

  if (!inject(TabsInjectionKey, null)) {
    throw new Error('Tabs.Content must be used within Tabs (Root).')
  }
</script>

<template>
  <TabsPanel
    v-bind="$attrs"
    :value="props.value"
  >
    <slot />
  </TabsPanel>
</template>

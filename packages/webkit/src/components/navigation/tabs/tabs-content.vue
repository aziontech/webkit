<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { type TabsContext, TabsInjectionKey, type TabsValue } from './injection-key'
  import TabsPanel from './tabs-panel.vue'

  defineOptions({
    name: 'TabsContent',
    inheritAttrs: false
  })

  interface Props {
    /** Tab value this panel is bound to; without it the part renders the deprecated wrapper around the panels. */
    value?: TabsValue
  }

  const props = withDefaults(defineProps<Props>(), {
    value: undefined
  })

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabsInjectionKey) as TabsContext | null

  if (!context) {
    throw new Error('Tabs.Content must be used within Tabs (Root).')
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId}__content`
  )

  const passthroughAttrs = computed(() => {
    const { class: omittedClass, ...rest } = attrs
    void omittedClass
    return rest
  })
</script>

<template>
  <TabsPanel
    v-if="props.value !== undefined"
    v-bind="$attrs"
    :value="props.value"
  >
    <slot />
  </TabsPanel>
  <div
    v-else
    v-bind="passthroughAttrs"
    :class="cn('relative isolate w-full', attrs.class as string | undefined)"
    :data-testid="testId"
    data-tabs-content=""
    data-tab-view-content=""
  >
    <slot />
  </div>
</template>

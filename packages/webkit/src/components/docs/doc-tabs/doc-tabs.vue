<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import TabsRoot from '../../navigation/tabs/tabs.vue'
  import TabsContent from '../../navigation/tabs/tabs-content.vue'
  import TabsList from '../../navigation/tabs/tabs-list.vue'
  import TabsTrigger from '../../navigation/tabs/tabs-trigger.vue'
  import { flattenSlot } from '../doc-frame/flatten-slot'

  defineOptions({ name: 'DocTabs', inheritAttrs: false })

  const slots = defineSlots<{
    /** The `DocTab` children, in strip order. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'doc-tabs')

  const panels = computed(() =>
    flattenSlot((slots.default?.() as unknown[] | undefined) ?? []).map((child, position) => ({
      value: `tab-${position}`,
      title:
        String((child.props as Record<string, unknown> | null)?.['title'] ?? '') ||
        `${position + 1}`,
      node: child
    }))
  )

  const defaultValue = computed(() => panels.value[0]?.value ?? '')
</script>

<template>
  <div
    v-bind="$attrs"
    data-doc-block
    :data-testid="testId"
    class="w-full"
  >
    <TabsRoot :default-value="defaultValue">
      <TabsList data-doc-chrome>
        <TabsTrigger
          v-for="panel in panels"
          :key="panel.value"
          :value="panel.value"
          :label="panel.title"
        />
      </TabsList>
      <div class="relative isolate w-full">
        <TabsContent
          v-for="panel in panels"
          :key="panel.value"
          :value="panel.value"
        >
          <component :is="panel.node" />
        </TabsContent>
      </div>
    </TabsRoot>
  </div>
</template>

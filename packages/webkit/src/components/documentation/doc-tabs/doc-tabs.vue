<script setup lang="ts">
  import { computed, useAttrs, useSlots } from 'vue'

  import TabsContent from '../../navigation/tabs/tabs-content.vue'
  import TabsItem from '../../navigation/tabs/tabs-item.vue'
  import TabsList from '../../navigation/tabs/tabs-list.vue'
  import TabsPanel from '../../navigation/tabs/tabs-panel.vue'
  import TabsRoot from '../../navigation/tabs/tabs-root.vue'
  import { flattenSlot } from '../doc-frame/flatten-slot'

  defineOptions({ name: 'DocTabs', inheritAttrs: false })

  defineSlots<{
    /** The `DocTab` children, in strip order. */
    default(): unknown
  }>()

  const slots = useSlots()
  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'documentation-doc-tabs'
  )

  const panels = computed(() =>
    flattenSlot(slots.default?.() ?? []).map((child, position) => ({
      value: `tab-${position}`,
      title:
        String((child.props as Record<string, unknown> | null)?.title ?? '') || `${position + 1}`,
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
        <TabsItem
          v-for="panel in panels"
          :key="panel.value"
          :value="panel.value"
          :label="panel.title"
        />
      </TabsList>
      <TabsContent>
        <TabsPanel
          v-for="panel in panels"
          :key="panel.value"
          :value="panel.value"
        >
          <component :is="panel.node" />
        </TabsPanel>
      </TabsContent>
    </TabsRoot>
  </div>
</template>

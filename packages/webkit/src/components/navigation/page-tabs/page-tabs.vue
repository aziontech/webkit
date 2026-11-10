<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { TabsValue } from '../tabs/injection-key'
  import TabsList from '../tabs/tabs-list.vue'
  import TabsRoot from '../tabs/tabs-root.vue'

  defineOptions({
    name: 'PageTabs',
    inheritAttrs: false
  })

  const value = defineModel<TabsValue | null>({ default: null })

  defineSlots<{
    /** One Tabs.Item per section of the resource. */
    default(): unknown
    /** The actions the whole resource owns, on the right of the strip: a staged-changes Tag, Deploy. */
    actions(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'navigation-page-tabs'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="border-b border-(--border-default)"
  >
    <div class="layout-boundary-inline flex items-center gap-(--spacing-sm) py-(--spacing-sm)">
      <div class="flex -ml-(--spacing-xs) min-w-0 flex-1">
        <TabsRoot
          v-model="value"
          :data-testid="`${testId}__tabs`"
          class="w-full"
        >
          <TabsList>
            <slot />
          </TabsList>
        </TabsRoot>
      </div>
      <div
        v-if="$slots['actions']"
        :data-testid="`${testId}__actions`"
        class="flex min-h-8 shrink-0 items-center gap-(--spacing-xs)"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

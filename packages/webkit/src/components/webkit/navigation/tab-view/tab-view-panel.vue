<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { type TabViewContext, TabViewInjectionKey, type TabViewValue } from './injection-key'

  defineOptions({
    name: 'TabViewPanel',
    inheritAttrs: false
  })

  interface Props {
    /** Tab value this panel is bound to. */
    value: TabViewValue
  }

  const props = defineProps<Props>()

  defineSlots<{ default(): unknown }>()

  const attrs = useAttrs()
  const context = inject(TabViewInjectionKey) as TabViewContext | null

  if (!context) {
    throw new Error('TabView.Panel must be used within TabView (Root).')
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${context.testId}__panel`
  )

  const isActive = computed(() => context.value.value === props.value)

  /** TODO: tokenizar — Figma `--tabview/tabviewcontentborder`. */
  const panelClasses = computed(() =>
    cn(
      'relative w-full shrink-0',
      'rounded-b-[var(--shape-card)]',
      'border border-solid border-[var(--border-default)]',
      !isActive.value && 'hidden',
      attrs.class as string | undefined
    )
  )

  const tabId = computed(() => context.tabId(props.value))
  const panelId = computed(() => context.panelId(props.value))

  const contentKey = computed(() => String(context.value.value))
</script>

<template>
  <div
    role="tabpanel"
    :id="panelId"
    :class="panelClasses"
    :data-testid="testId"
    :data-state="isActive ? 'active' : 'inactive'"
    :aria-labelledby="tabId"
    :hidden="!isActive ? true : undefined"
    tabindex="0"
  >
    <div
      v-if="isActive"
      :key="contentKey"
      class="animate-fade-in motion-reduce:animate-none"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import { ItemInjectionKey } from './injection-key'

  defineOptions({
    name: 'ItemMedia',
    inheritAttrs: false
  })

  export type ItemMediaKind = 'default' | 'icon' | 'image'

  interface Props {
    /** ItemMedia region variant (icon frame, image frame). */
    kind?: ItemMediaKind
  }

  withDefaults(defineProps<Props>(), {
    kind: 'default'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(ItemInjectionKey)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'content-item'}__media`
  )
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-media"
    :data-testid="testId"
    :data-kind="kind"
    class="flex shrink-0 items-center justify-center gap-[var(--spacing-xs)] group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none data-[kind=icon]:size-8 data-[kind=icon]:rounded-[var(--shape-button)] data-[kind=icon]:border data-[kind=icon]:border-[var(--border-default)] data-[kind=icon]:bg-[var(--bg-hover)] data-[kind=icon]:[&_svg:not([class*='size-'])]:size-4 data-[kind=image]:size-10 data-[kind=image]:overflow-hidden data-[kind=image]:rounded-[var(--shape-button)] data-[kind=image]:[&_img]:size-full data-[kind=image]:[&_img]:object-cover"
  >
    <slot />
  </div>
</template>

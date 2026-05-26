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
    mediaKind?: ItemMediaKind
  }

  withDefaults(defineProps<Props>(), {
    mediaKind: 'default'
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
    :data-media-kind="mediaKind"
    class="flex shrink-0 items-center justify-center gap-[var(--spacing-xs)] group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start [&_svg]:pointer-events-none data-[media-kind=icon]:size-8 data-[media-kind=icon]:rounded-[var(--shape-button)] data-[media-kind=icon]:border data-[media-kind=icon]:border-[var(--border-default)] data-[media-kind=icon]:bg-[var(--bg-hover)] data-[media-kind=icon]:[&_svg:not([class*='size-'])]:size-4 data-[media-kind=image]:size-10 data-[media-kind=image]:overflow-hidden data-[media-kind=image]:rounded-[var(--shape-button)] data-[media-kind=image]:[&_img]:size-full data-[media-kind=image]:[&_img]:object-cover"
  >
    <slot />
  </div>
</template>

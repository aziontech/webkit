<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({
    name: 'ItemMedia',
    inheritAttrs: false
  })

  export type ItemMediaType = 'default' | 'icon' | 'image'

  export interface ItemMediaProps {
    /** ItemMedia region variant (icon frame, image frame). */
    type?: ItemMediaType
  }

  withDefaults(defineProps<ItemMediaProps>(), {
    type: 'default'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'item-media')

  const ROOT_CLASS =
    'flex shrink-0 items-center justify-center gap-(--spacing-xs) ' +
    'group-has-[[data-slot=item-description]]/item:translate-y-0.5 group-has-[[data-slot=item-description]]/item:self-start ' +
    '[&_svg]:pointer-events-none ' +
    'data-[type=icon]:size-8 data-[type=icon]:rounded-(--shape-button) data-[type=icon]:border data-[type=icon]:border-(--border-default) data-[type=icon]:bg-(--bg-hover) ' +
    "data-[type=icon]:[&_svg:not([class*='size-'])]:size-4 data-[type=image]:size-10 data-[type=image]:overflow-hidden data-[type=image]:rounded-(--shape-button) " +
    'data-[type=image]:[&_img]:size-full data-[type=image]:[&_img]:object-cover'
</script>

<template>
  <div
    v-bind="$attrs"
    data-slot="item-media"
    :data-testid="testId"
    :data-type="type"
    :class="ROOT_CLASS"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import type { SourcesItem } from '../types'
  import { sourceHue, sourceImage, sourceMonogram } from '../types'

  defineOptions({
    name: 'SourcesMark',
    inheritAttrs: false
  })

  export interface SourcesMarkProps {
    /** The source whose mark is drawn: its favicon, its icon, or the first letter of its site on a colour of its own. */
    item: SourcesItem
    /** `tiny` (14 px) leads an inline citation, `small` (20 px) overlaps in the pill, `medium` (24 px) leads a list row. */
    size?: 'tiny' | 'small' | 'medium'
  }

  const props = withDefaults(defineProps<SourcesMarkProps>(), {
    size: 'small'
  })

  const attrs = useAttrs()
  const failed = ref<boolean>(false)

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'sources-mark'
  })
  const image = computed<string>(() => (failed.value ? '' : sourceImage(props.item)))
  const letter = computed<string>(() => sourceMonogram(props.item))
  const type = computed<'image' | 'icon' | 'letter'>(() => {
    if (image.value) return 'image'
    return props.item.icon ? 'icon' : 'letter'
  })
  const hue = computed<number | null>(() =>
    type.value === 'letter' ? sourceHue(props.item) : null
  )

  watch(
    () => props.item.image,
    () => {
      failed.value = false
    }
  )

  const MARK_CLASS =
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--border-default) bg-(--bg-surface-raised) text-(--text-default) ' +
    'data-[size=tiny]:size-3.5 data-[size=tiny]:text-body-2xs data-[size=small]:size-5 data-[size=small]:text-label-sm data-[size=medium]:size-6 data-[size=medium]:text-label-sm ' +
    "data-[hue='1']:border-(--chart-series-1) data-[hue='1']:bg-[color-mix(in_srgb,var(--chart-series-1)_30%,var(--bg-surface-raised))] " +
    "data-[hue='2']:border-(--chart-series-2) data-[hue='2']:bg-[color-mix(in_srgb,var(--chart-series-2)_30%,var(--bg-surface-raised))] " +
    "data-[hue='3']:border-(--chart-series-3) data-[hue='3']:bg-[color-mix(in_srgb,var(--chart-series-3)_30%,var(--bg-surface-raised))] " +
    "data-[hue='5']:border-(--chart-series-5) data-[hue='5']:bg-[color-mix(in_srgb,var(--chart-series-5)_30%,var(--bg-surface-raised))] " +
    "data-[hue='6']:border-(--chart-series-6) data-[hue='6']:bg-[color-mix(in_srgb,var(--chart-series-6)_30%,var(--bg-surface-raised))] " +
    "data-[hue='7']:border-(--chart-series-7) data-[hue='7']:bg-[color-mix(in_srgb,var(--chart-series-7)_30%,var(--bg-surface-raised))] " +
    "data-[hue='8']:border-(--chart-series-8) data-[hue='8']:bg-[color-mix(in_srgb,var(--chart-series-8)_30%,var(--bg-surface-raised))]"
</script>

<template>
  <span
    v-bind="$attrs"
    aria-hidden="true"
    :data-testid="testId"
    :data-size="size"
    :data-type="type"
    :data-hue="hue"
    :class="MARK_CLASS"
  >
    <img
      v-if="type === 'image'"
      :src="image"
      alt=""
      loading="lazy"
      decoding="async"
      referrerpolicy="no-referrer"
      class="size-full object-cover"
      @error="failed = true"
    />
    <i
      v-else-if="type === 'icon'"
      :class="item.icon"
    />
    <template v-else>{{ letter }}</template>
  </span>
</template>

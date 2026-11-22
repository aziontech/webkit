<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import type { SourcesItem } from '../types'
  import { sourceMonogram } from '../types'

  defineOptions({
    name: 'SourcesMark',
    inheritAttrs: false
  })

  export interface SourcesMarkProps {
    /** The source whose mark is drawn: its icon, or the first letter of its site. */
    item: SourcesItem
    /** `small` (20 px) overlaps in the pill, `medium` (24 px) leads a list row. */
    size?: 'small' | 'medium'
  }

  const props = withDefaults(defineProps<SourcesMarkProps>(), {
    size: 'small'
  })

  const attrs = useAttrs()

  const testId = computed<string>(() => {
    const id = attrs['data-testid']
    return typeof id === 'string' ? id : 'sources-mark'
  })
  const letter = computed<string>(() => sourceMonogram(props.item))

  const MARK_CLASS =
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-(--border-default) ' +
    'bg-(--bg-surface-raised) text-label-sm text-(--text-default) data-[size=medium]:size-6 data-[size=small]:size-5'
</script>

<template>
  <span
    v-bind="$attrs"
    aria-hidden="true"
    :data-testid="testId"
    :data-size="size"
    :class="MARK_CLASS"
  >
    <i
      v-if="item.icon"
      :class="item.icon"
    />
    <template v-else>{{ letter }}</template>
  </span>
</template>

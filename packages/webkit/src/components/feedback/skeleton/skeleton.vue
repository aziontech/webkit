<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type SkeletonKind = 'shape' | 'circle'

  defineOptions({
    name: 'Skeleton',
    inheritAttrs: false
  })

  interface Props {
    /** Geometry: a rounded rectangular block (`shape`) or a circle. */
    kind?: SkeletonKind
    /** CSS width (any length). */
    width?: string
    /** CSS height (any length); for a circle, set equal to `width`. */
    height?: string
    /** Pulse while loading; suppressed under reduced motion. */
    animated?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'shape',
    width: '100%',
    height: '1rem',
    animated: true
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-skeleton')
</script>

<template>
  <div
    v-bind="$attrs"
    role="presentation"
    aria-hidden="true"
    :data-testid="testId"
    :data-kind="kind"
    :data-animated="animated || null"
    :style="{ width, height }"
    class="block bg-[var(--bg-surface-overlay)] data-[kind=shape]:rounded-[var(--shape-elements)] data-[kind=circle]:rounded-full data-[animated]:animate-pulse motion-reduce:animate-none"
  />
</template>

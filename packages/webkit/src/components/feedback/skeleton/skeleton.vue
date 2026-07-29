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
    /** Shimmer while loading; suppressed under reduced motion. */
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
    class="block bg-[var(--bg-placeholder)] data-[kind=shape]:rounded-[var(--shape-elements)] data-[kind=circle]:rounded-full data-[animated]:motion-safe:bg-[linear-gradient(90deg,transparent_0%,transparent_35%,var(--bg-placeholder-highlight)_50%,transparent_65%,transparent_100%)] data-[animated]:motion-safe:bg-[length:200%_100%] data-[animated]:motion-safe:animate-[var(--animate-shimmer)] motion-reduce:animate-none"
  />
</template>

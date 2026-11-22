<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /** Geometry of the placeholder. */
  export type SkeletonVariant = 'rectangle' | 'circle'

  defineOptions({
    name: 'Skeleton',
    inheritAttrs: false
  })

  export interface SkeletonProps {
    /** Geometry: a rounded rectangular block (`rectangle`) or a circle. */
    variant?: SkeletonVariant
    /** CSS width (any length). */
    width?: string
    /** CSS height (any length); for a circle, set equal to `width`. */
    height?: string
    /** Shimmer while loading; suppressed under reduced motion. */
    animated?: boolean
  }

  withDefaults(defineProps<SkeletonProps>(), {
    variant: 'rectangle',
    width: '100%',
    height: '1rem',
    animated: true
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'skeleton')

  const ROOT_CLASS =
    'block bg-(--bg-placeholder) ' +
    'data-[variant=rectangle]:rounded-(--shape-control) data-[variant=circle]:rounded-full ' +
    'data-[animated]:motion-safe:bg-[linear-gradient(90deg,transparent_0%,transparent_35%,var(--bg-placeholder-highlight)_50%,transparent_65%,transparent_100%)] ' +
    'data-[animated]:motion-safe:bg-[length:200%_100%] data-[animated]:motion-safe:animate-shimmer ' +
    'motion-reduce:animate-none'
</script>

<template>
  <div
    v-bind="$attrs"
    role="presentation"
    aria-hidden="true"
    :data-testid="testId"
    :data-variant="variant"
    :data-animated="animated || null"
    :style="{ width, height }"
    :class="ROOT_CLASS"
  />
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  /** Geometry of the placeholder. `shape` is deprecated since 6.0 — use `rectangle`. Removed in 7.0. */
  export type SkeletonKind = 'rectangle' | 'circle' | 'shape'

  defineOptions({
    name: 'Skeleton',
    inheritAttrs: false
  })

  interface Props {
    /** Geometry: a rounded rectangular block (`rectangle`) or a circle. */
    kind?: SkeletonKind
    /** CSS width (any length). */
    width?: string
    /** CSS height (any length); for a circle, set equal to `width`. */
    height?: string
    /** Shimmer while loading; suppressed under reduced motion. */
    animated?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'rectangle',
    width: '100%',
    height: '1rem',
    animated: true
  })

  const attrs = useAttrs()

  const geometry = computed(() => (props.kind === 'shape' ? 'rectangle' : props.kind))

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-skeleton')
</script>

<template>
  <div
    v-bind="$attrs"
    role="presentation"
    aria-hidden="true"
    :data-testid="testId"
    :data-kind="geometry"
    :data-animated="animated || null"
    :style="{ width, height }"
    class="block bg-(--bg-placeholder) data-[kind=rectangle]:rounded-(--shape-elements) data-[kind=circle]:rounded-full data-[animated]:motion-safe:bg-[linear-gradient(90deg,transparent_0%,transparent_35%,var(--bg-placeholder-highlight)_50%,transparent_65%,transparent_100%)] data-[animated]:motion-safe:bg-[length:200%_100%] data-[animated]:motion-safe:animate-(--animate-shimmer) motion-reduce:animate-none"
  />
</template>

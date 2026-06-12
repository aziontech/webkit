<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type SkeletonKind = 'shape' | 'circular'

  defineOptions({
    name: 'Skeleton',
    inheritAttrs: false
  })

  interface Props {
    /** Visual shape variant; controls the border radius token. */
    kind?: SkeletonKind
    /** CSS width applied as inline style (e.g. 240px, 100%). */
    width?: string
    /** CSS height applied as inline style (e.g. 120px, 1rem); use a 1:1 width/height for a square. */
    height?: string
  }

  withDefaults(defineProps<Props>(), {
    kind: 'shape',
    width: '100%',
    height: '16px'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-skeleton')
</script>

<template>
  <div
    v-bind="$attrs"
    aria-hidden="true"
    :data-testid="testId"
    :data-kind="kind"
    :style="{ width, height }"
    class="relative overflow-hidden bg-[var(--bg-surface-overlay)] animate-pulse motion-reduce:animate-none data-[kind=shape]:rounded-[var(--shape-elements)] data-[kind=circular]:rounded-full"
  />
</template>

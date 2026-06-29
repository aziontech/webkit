<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  export type ProgressBarShape = 'rounded' | 'flat'
  export type ProgressBarSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'ProgressBar',
    inheritAttrs: false
  })

  interface Props {
    /** Current progress, relative to `max`. */
    value?: number
    /** Upper bound; percentage = `value / max * 100`. */
    max?: number
    /** Track and fill corner-radius variant. */
    shape?: ProgressBarShape
    /** Bar height token. */
    size?: ProgressBarSize
    /** Loading state; animates a sliding segment and ignores `value`. */
    indeterminate?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    max: 100,
    shape: 'flat',
    size: 'small',
    indeterminate: false
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'feedback-progress-bar'
  )

  const percent = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <div
    v-bind="$attrs"
    role="progressbar"
    :data-testid="testId"
    :data-shape="shape"
    :data-size="size"
    :data-indeterminate="indeterminate || null"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : max"
    :aria-valuenow="indeterminate ? undefined : value"
    :aria-busy="indeterminate || undefined"
    class="relative block w-full overflow-hidden bg-[var(--bg-surface-raised)] data-[size=small]:h-2 data-[size=medium]:h-3 data-[size=large]:h-4 data-[shape=rounded]:rounded-[var(--shape-elements)] data-[shape=flat]:rounded-[var(--shape-flat)]"
  >
    <div
      :data-indeterminate="indeterminate || null"
      :style="indeterminate ? undefined : { width: percent + '%' }"
      class="absolute inset-y-0 left-0 rounded-[inherit] bg-[var(--primary)] transition-[width] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none motion-reduce:animate-none data-[indeterminate]:right-0 data-[indeterminate]:bg-transparent data-[indeterminate]:before:absolute data-[indeterminate]:before:inset-y-0 data-[indeterminate]:before:rounded-[inherit] data-[indeterminate]:before:bg-[var(--primary)] data-[indeterminate]:before:content-[''] data-[indeterminate]:before:animate-progress-indeterminate motion-reduce:before:animate-none motion-reduce:before:inset-x-0 data-[indeterminate]:after:absolute data-[indeterminate]:after:inset-y-0 data-[indeterminate]:after:rounded-[inherit] data-[indeterminate]:after:bg-[var(--primary)] data-[indeterminate]:after:content-[''] data-[indeterminate]:after:animate-progress-indeterminate-short motion-reduce:after:animate-none motion-reduce:after:hidden"
    />
  </div>
</template>

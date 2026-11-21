<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'

  export type ProgressVariant = 'rounded' | 'flat'
  export type ProgressSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Progress',
    inheritAttrs: false
  })

  export interface ProgressProps {
    /** Current progress, relative to `max`. */
    value?: number
    /** Upper bound; percentage = `value / max * 100`. */
    max?: number
    /** Track and fill corner-radius variant. */
    variant?: ProgressVariant
    /** Bar height token. */
    size?: ProgressSize
    /** Loading state; animates a sliding segment and ignores `value`. */
    indeterminate?: boolean
  }

  const props = withDefaults(defineProps<ProgressProps>(), {
    value: 0,
    max: 100,
    variant: 'flat',
    size: 'medium',
    indeterminate: false
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ progress: en.progress })

  const accessibleName = computed(
    () =>
      (attrs['aria-label'] as string | undefined) ??
      (attrs['aria-labelledby'] ? undefined : t('progress.label'))
  )

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'progress')

  const percent = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))

  const ROOT_CLASS =
    'relative block w-full overflow-hidden bg-(--bg-placeholder) ' +
    'data-[size=small]:h-2 data-[size=medium]:h-3 data-[size=large]:h-4 ' +
    'data-[variant=rounded]:rounded-(--shape-control) data-[variant=flat]:rounded-(--shape-flat)'

  const INDICATOR_CLASS =
    'absolute inset-y-0 start-0 rounded-[inherit] bg-(--primary) transition-[width] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none motion-reduce:animate-none ' +
    'data-[indeterminate]:end-0 data-[indeterminate]:bg-transparent data-[indeterminate]:before:absolute data-[indeterminate]:before:inset-y-0 ' +
    "data-[indeterminate]:before:rounded-[inherit] data-[indeterminate]:before:bg-(--primary) data-[indeterminate]:before:content-[''] " +
    'data-[indeterminate]:before:animate-progress-indeterminate ' +
    'motion-reduce:data-[indeterminate]:before:animate-none motion-reduce:before:inset-x-1/3 ' +
    'data-[indeterminate]:after:absolute data-[indeterminate]:after:inset-y-0 data-[indeterminate]:after:rounded-[inherit] data-[indeterminate]:after:bg-(--primary) ' +
    "data-[indeterminate]:after:content-[''] data-[indeterminate]:after:animate-progress-indeterminate-short " +
    'motion-reduce:data-[indeterminate]:after:animate-none motion-reduce:after:hidden'
</script>

<template>
  <div
    v-bind="$attrs"
    role="progressbar"
    :aria-label="accessibleName"
    :data-testid="testId"
    :data-variant="variant"
    :data-size="size"
    :data-indeterminate="indeterminate || null"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : max"
    :aria-valuenow="indeterminate ? undefined : value"
    :aria-busy="indeterminate || undefined"
    :class="ROOT_CLASS"
  >
    <div
      :data-indeterminate="indeterminate || null"
      :style="indeterminate ? undefined : { width: percent + '%' }"
      :class="INDICATOR_CLASS"
    />
  </div>
</template>

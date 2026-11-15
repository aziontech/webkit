<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'

  export type ProgressKind = 'rounded' | 'flat'
  /**
   * Legacy name of the corner variant union.
   * @deprecated since 6.0 — use `ProgressKind`. Removed in 7.0.
   */
  export type ProgressShape = ProgressKind
  export type ProgressSize = 'small' | 'medium' | 'large'

  defineOptions({
    name: 'Progress',
    inheritAttrs: false
  })

  interface Props {
    /** Current progress, relative to `max`. */
    value?: number
    /** Upper bound; percentage = `value / max * 100`. */
    max?: number
    /** Track and fill corner-radius variant. */
    kind?: ProgressKind
    /**
     * Track and fill corner-radius variant; read only when `kind` is unset.
     * @deprecated since 6.0 — use `kind`. Removed in 7.0.
     */
    shape?: ProgressShape
    /** Bar height token. */
    size?: ProgressSize
    /** Loading state; animates a sliding segment and ignores `value`. */
    indeterminate?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    value: 0,
    max: 100,
    kind: undefined,
    shape: undefined,
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'feedback-progress')

  const resolvedKind = computed<ProgressKind>(() => props.kind ?? props.shape ?? 'flat')

  const percent = computed(() => Math.min(100, Math.max(0, (props.value / props.max) * 100)))
</script>

<template>
  <div
    v-bind="$attrs"
    role="progressbar"
    :aria-label="accessibleName"
    :data-testid="testId"
    :data-kind="resolvedKind"
    :data-shape="resolvedKind"
    :data-size="size"
    :data-indeterminate="indeterminate || null"
    :aria-valuemin="indeterminate ? undefined : 0"
    :aria-valuemax="indeterminate ? undefined : max"
    :aria-valuenow="indeterminate ? undefined : value"
    :aria-busy="indeterminate || undefined"
    class="relative block w-full overflow-hidden bg-(--bg-placeholder) data-[size=small]:h-2 data-[size=medium]:h-3 data-[size=large]:h-4 data-[kind=rounded]:rounded-(--shape-elements) data-[kind=flat]:rounded-(--shape-flat)"
  >
    <div
      :data-indeterminate="indeterminate || null"
      :style="indeterminate ? undefined : { width: percent + '%' }"
      class="absolute inset-y-0 start-0 rounded-[inherit] bg-(--primary) transition-[width] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none motion-reduce:animate-none data-[indeterminate]:end-0 data-[indeterminate]:bg-transparent data-[indeterminate]:before:absolute data-[indeterminate]:before:inset-y-0 data-[indeterminate]:before:rounded-[inherit] data-[indeterminate]:before:bg-(--primary) data-[indeterminate]:before:content-[''] data-[indeterminate]:before:animate-progress-indeterminate motion-reduce:data-[indeterminate]:before:animate-none motion-reduce:before:inset-x-0 data-[indeterminate]:after:absolute data-[indeterminate]:after:inset-y-0 data-[indeterminate]:after:rounded-[inherit] data-[indeterminate]:after:bg-(--primary) data-[indeterminate]:after:content-[''] data-[indeterminate]:after:animate-progress-indeterminate-short motion-reduce:data-[indeterminate]:after:animate-none motion-reduce:after:hidden"
    />
  </div>
</template>

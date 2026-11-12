<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { KeyValuePairsInjectionKey, type KeyValuePairsKind } from './injection-key'

  defineOptions({
    name: 'KeyValuePairs',
    inheritAttrs: false
  })

  export type { KeyValuePairsKind }

  /** Number of columns at full width. */
  export type KeyValuePairsColumns = 1 | 2 | 3 | 4

  interface Props {
    /** How each pair is laid out: `stacked` puts the label over the value, `split` puts the label at the start and the value at the end of one row. */
    kind?: KeyValuePairsKind
    /** Columns at full width; collapses to one column below md and to two at md when set to 3 or 4. */
    columns?: KeyValuePairsColumns
    /** Replaces every value with a skeleton while the data loads; labels stay visible. */
    loading?: boolean
    /** Accessible name of the list when no visible heading names it. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'stacked',
    columns: 1,
    loading: false,
    ariaLabel: ''
  })

  defineSlots<{
    /** KeyValuePairs.Item children, or KeyValuePairs.Group children, one shape per instance. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-key-value-pairs'
  )

  provide(KeyValuePairsInjectionKey, {
    testId,
    loading: computed(() => props.loading),
    kind: computed(() => props.kind)
  })
</script>

<template>
  <dl
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-columns="columns"
    :data-loading="loading || null"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel || undefined"
    class="grid w-full grid-cols-1 gap-x-(--spacing-lg) gap-y-(--spacing-md) data-[kind=split]:gap-y-(--spacing-sm) data-[columns=2]:grid-cols-[repeat(auto-fill,minmax(min(100%,max(var(--container-3xs),calc((100%_-_var(--spacing-lg))/2))),1fr))] data-[columns=3]:grid-cols-[repeat(auto-fill,minmax(min(100%,max(var(--container-3xs),calc((100%_-_2*var(--spacing-lg))/3))),1fr))] data-[columns=4]:grid-cols-[repeat(auto-fill,minmax(min(100%,max(var(--container-3xs),calc((100%_-_3*var(--spacing-lg))/4))),1fr))]"
  >
    <slot />
  </dl>
</template>

<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { KeyValueListInjectionKey, type KeyValueListVariant } from './injection-key'

  defineOptions({
    name: 'KeyValueList',
    inheritAttrs: false
  })

  export type { KeyValueListVariant }

  /** Number of columns at full width. */
  export type KeyValueListColumns = 1 | 2 | 3 | 4

  export interface KeyValueListProps {
    /** How each pair is laid out: `stacked` puts the label over the value, `split` puts the label at the start and the value at the end of one row. */
    variant?: KeyValueListVariant
    /** Columns at full width; collapses to one column below md and to two at md when set to 3 or 4. */
    columns?: KeyValueListColumns
    /** Replaces every value with a skeleton while the data loads; labels stay visible. */
    loading?: boolean
    /** Accessible name of the list when no visible heading names it. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<KeyValueListProps>(), {
    variant: 'stacked',
    columns: 1,
    loading: false,
    ariaLabel: ''
  })

  defineSlots<{
    /** KeyValueList.Item children, or KeyValueList.Group children, one shape per instance. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-key-value-list'
  )

  provide(KeyValueListInjectionKey, {
    testId,
    loading: computed(() => props.loading),
    variant: computed(() => props.variant)
  })
</script>

<template>
  <dl
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-columns="columns"
    :data-loading="loading || null"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel || undefined"
    class="grid w-full grid-cols-1 gap-x-(--spacing-lg) gap-y-(--spacing-md) data-[variant=split]:gap-y-(--spacing-sm) data-[columns=2]:grid-cols-[repeat(auto-fill,minmax(min(100%,max(var(--container-3xs),calc((100%_-_var(--spacing-lg))/2))),1fr))] data-[columns=3]:grid-cols-[repeat(auto-fill,minmax(min(100%,max(var(--container-3xs),calc((100%_-_2*var(--spacing-lg))/3))),1fr))] data-[columns=4]:grid-cols-[repeat(auto-fill,minmax(min(100%,max(var(--container-3xs),calc((100%_-_3*var(--spacing-lg))/4))),1fr))]"
  >
    <slot />
  </dl>
</template>

<script setup lang="ts">
  import { computed, provide, useAttrs } from 'vue'

  import { KeyValuePairsInjectionKey } from './injection-key'

  defineOptions({
    name: 'KeyValuePairs',
    inheritAttrs: false
  })

  /** Number of columns at full width. */
  export type KeyValuePairsColumns = 1 | 2 | 3 | 4

  interface Props {
    /** Columns at full width; collapses to one column below md and to two at md when set to 3 or 4. */
    columns?: KeyValuePairsColumns
    /** Replaces every value with a skeleton while the data loads; labels stay visible. */
    loading?: boolean
    /** Accessible name of the list when no visible heading names it. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
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
    loading: computed(() => props.loading)
  })
</script>

<template>
  <dl
    v-bind="$attrs"
    :data-testid="testId"
    :data-columns="columns"
    :data-loading="loading || null"
    :aria-busy="loading ? 'true' : undefined"
    :aria-label="ariaLabel || undefined"
    class="grid w-full grid-cols-1 gap-x-(--spacing-lg) gap-y-(--spacing-md) md:data-[columns=2]:grid-cols-2 md:data-[columns=3]:grid-cols-2 md:data-[columns=4]:grid-cols-2 lg:data-[columns=3]:grid-cols-3 lg:data-[columns=4]:grid-cols-4"
  >
    <slot />
  </dl>
</template>

<script setup lang="ts">
  import { computed, provide, reactive, useAttrs } from 'vue'

  import { type TableDensity, TableRowGroupInjectionKey } from '../injection-key'

  defineOptions({
    name: 'TableHeader',
    inheritAttrs: false
  })

  export interface TableHeaderProps {
    /** Sticks the header to the top of the scroll container. */
    frozen?: boolean
    /** `compact` shrinks the header cells' height and padding for a denser header. */
    density?: TableDensity
  }

  const props = withDefaults(defineProps<TableHeaderProps>(), {
    frozen: false,
    density: undefined
  })

  provide(
    TableRowGroupInjectionKey,
    reactive({
      hoverable: false,
      compact: computed(() => props.density === 'compact')
    })
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'table-header'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="rowgroup"
    :data-testid="testId"
    :data-frozen="frozen || null"
    class="flex w-full flex-col bg-(--bg-surface) data-[frozen]:sticky data-[frozen]:top-0 data-[frozen]:z-20"
  >
    <slot />
  </div>
</template>

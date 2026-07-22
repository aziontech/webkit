<script setup lang="ts">
  import { computed, inject, provide, reactive, useAttrs } from 'vue'

  import { TableInjectionKey, TableRowGroupKey } from '../injection-key'

  defineOptions({
    name: 'TableHeader',
    inheritAttrs: false
  })

  type TableHeaderKind = 'default' | 'compact'

  interface Props {
    /** Sticks the header to the top of the scroll container. */
    frozen?: boolean
    /** `compact` shrinks the header cells' height and padding for a denser header. */
    kind?: TableHeaderKind
  }

  const props = withDefaults(defineProps<Props>(), {
    frozen: false,
    kind: 'default'
  })

  // Density flows to the head cells through the row-group context, so the
  // consumer sets it once on the header instead of on every cell. `reactive`
  // unwraps the computed, keeping `compact` a plain (but live) boolean.
  provide(
    TableRowGroupKey,
    reactive({
      hoverable: false,
      compact: computed(() => props.kind === 'compact')
    })
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__header` : 'data-table__header')
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="rowgroup"
    :data-testid="testId"
    :data-frozen="frozen || null"
    class="flex w-full flex-col bg-[var(--bg-surface)] data-[frozen]:sticky data-[frozen]:top-0 data-[frozen]:z-20"
  >
    <slot />
  </div>
</template>

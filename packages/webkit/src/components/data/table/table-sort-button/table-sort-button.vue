<script setup lang="ts">
  import { computed, inject, useAttrs } from 'vue'

  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import { TableInjectionKey } from '../injection-key'

  export type SortDirection = 'none' | 'ascending' | 'descending'

  defineOptions({
    name: 'TableSortButton',
    inheritAttrs: false
  })

  interface Props {
    /** Current sort direction shown by the glyph. */
    direction?: SortDirection
    /** Hides the button while keeping its layout slot. */
    hidden?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    direction: 'none',
    hidden: false
  })

  const emit = defineEmits<{
    toggle: [direction: 'ascending' | 'descending']
  }>()

  const attrs = useAttrs()
  const ctx = inject(TableInjectionKey, null)

  const testId = computed<string>(
    () =>
      (attrs['data-testid'] as string | undefined) ??
      (ctx ? `${ctx.testId}__sort-button` : 'data-table__sort-button')
  )

  const icon = computed<string>(() => {
    if (props.direction === 'ascending') return 'pi pi-sort-amount-up'
    if (props.direction === 'descending') return 'pi pi-sort-amount-down'
    return 'pi pi-sort-alt'
  })

  const ariaLabel = computed<string>(() => {
    if (props.direction === 'ascending') return 'Sorted ascending'
    if (props.direction === 'descending') return 'Sorted descending'
    return 'Sort column'
  })

  const handleClick = () => {
    emit('toggle', props.direction === 'ascending' ? 'descending' : 'ascending')
  }
</script>

<template>
  <IconButton
    :icon="icon"
    v-bind="{ ariaLabel }"
    kind="transparent"
    size="small"
    :data-testid="testId"
    :class="hidden ? 'invisible pointer-events-none' : undefined"
    @click="handleClick"
  />
</template>

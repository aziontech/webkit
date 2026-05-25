<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import IconButton from '../../actions/icon-button/icon-button.vue'
  import Checkbox from '../../inputs/checkbox/checkbox.vue'
  import { useDataTableContext } from './composables/use-data-table-context'
  import type { ColumnDefinition } from './injection-key'

  defineOptions({
    name: 'DataTableColumnSelector',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** All available columns. */
      columns?: ColumnDefinition[]
      /** Currently visible column fields. */
      selectedColumns?: string[]
    }>(),
    {
      columns: () => [],
      selectedColumns: () => []
    }
  )

  const emit = defineEmits<{
    'update:selectedColumns': [value: string[]]
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__column-selector`
  )

  const open = ref(false)

  const internalSelected = computed({
    get: () => props.selectedColumns,
    set: (value: string[]) => emit('update:selectedColumns', value)
  })

  function toggle() {
    open.value = !open.value
  }

  function isVisible(field: string) {
    return internalSelected.value.includes(field)
  }

  function toggleColumn(field: string) {
    if (isVisible(field)) {
      internalSelected.value = internalSelected.value.filter((item) => item !== field)
      ctx.toggleColumnVisibility(field, false)
    } else {
      internalSelected.value = [...internalSelected.value, field]
      ctx.toggleColumnVisibility(field, true)
    }
  }

  defineExpose({ toggle })
</script>

<template>
  <div
    v-bind="attrs"
    class="relative"
    :data-testid="testId"
  >
    <IconButton
      icon="pi pi-table"
      ariaLabel="Toggle columns"
      kind="outlined"
      size="small"
      :data-testid="`${testId}__trigger`"
      @click="toggle"
    />
    <div
      v-if="open"
      class="absolute right-0 top-full z-10 mt-[var(--spacing-elements-xs)] min-w-[12rem] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-spacing-elements-sm"
      :data-testid="`${testId}__panel`"
    >
      <p class="mb-[var(--spacing-elements-xs)] text-body-sm text-[var(--text-default)]">Columns</p>
      <label
        v-for="column in columns"
        :key="column.field"
        class="flex cursor-pointer items-center gap-spacing-elements-xs py-[var(--spacing-elements-xs)] text-body-sm text-[var(--text-default)]"
        :data-testid="`${testId}__option-${column.field}`"
      >
        <Checkbox
          :binary="true"
          :modelValue="isVisible(column.field)"
          @update:modelValue="() => toggleColumn(column.field)"
        />
        <span>{{ column.header }}</span>
      </label>
    </div>
  </div>
</template>

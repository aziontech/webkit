<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Dropdown from '../../inputs/dropdown/dropdown.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
  import { useDataTableContext } from './composables/use-data-table-context'
  import type { ColumnDefinition } from './injection-key'

  defineOptions({
    name: 'DataTableFilter',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Column definitions available for filtering. */
      filters?: ColumnDefinition[]
    }>(),
    {
      filters: () => []
    }
  )

  const emit = defineEmits<{
    apply: [filter: { field: string; label: string; value: unknown; matchMode?: string }]
  }>()

  defineSlots<{
    'filter-field'(scope: {
      field: string
      value: unknown
      onUpdate: (value: unknown) => void
    }): unknown
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__filter`
  )

  const open = ref(false)
  const selectedField = ref<string | null>(null)
  const filterValue = ref<unknown>('')

  const filterOptions = computed(() =>
    props.filters
      .filter((column) => column.header)
      .map((column) => ({
        label: column.header,
        value: column.sortField || column.field
      }))
  )

  const selectedLabel = computed(() => {
    const match = filterOptions.value.find((option) => option.value === selectedField.value)
    return match?.label ?? ''
  })

  function toggle(_event?: unknown) {
    open.value = !open.value
  }

  function handleFieldChange(value: string) {
    selectedField.value = value
    filterValue.value = ''
  }

  function openForFilter(filter: { field?: string; value?: unknown } = {}, _event?: unknown) {
    selectedField.value = filter.field ?? null
    filterValue.value = filter.value ?? ''
    open.value = true
  }

  function handleCancel() {
    open.value = false
    selectedField.value = null
    filterValue.value = ''
  }

  function handleApply() {
    if (!selectedField.value) return
    const hasValue =
      filterValue.value !== null && filterValue.value !== undefined && filterValue.value !== ''
    if (!hasValue) return
    emit('apply', {
      field: selectedField.value,
      label: selectedLabel.value,
      value: filterValue.value,
      matchMode: 'is'
    })
    handleCancel()
  }

  function updateFilterValue(value: unknown) {
    filterValue.value = value
  }

  defineExpose({
    toggle,
    openForFilter
  })
</script>

<template>
  <div
    v-bind="attrs"
    class="relative"
    :data-testid="testId"
  >
    <div
      v-if="open"
      tabindex="-1"
      class="absolute left-0 top-full z-10 mt-[var(--spacing-elements-xs)] w-[20rem] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-spacing-elements-sm focus:outline-none"
      :data-testid="`${testId}__panel`"
    >
      <div class="flex flex-col gap-spacing-elements-sm">
        <Dropdown
          :modelValue="selectedField"
          :options="filterOptions"
          optionLabel="label"
          optionValue="value"
          placeholder="Select field"
          :data-testid="`${testId}__field`"
          @update:modelValue="handleFieldChange"
        />
        <slot
          v-if="selectedField && $slots['filter-field']"
          name="filter-field"
          :field="selectedField"
          :value="filterValue"
          :onUpdate="updateFilterValue"
        />
        <InputText
          v-else-if="selectedField"
          :modelValue="String(filterValue ?? '')"
          placeholder="Filter value"
          :data-testid="`${testId}__value`"
          @update:modelValue="(value: string) => updateFilterValue(value)"
        />
        <div class="flex justify-end gap-spacing-elements-xs">
          <Button
            label="Cancel"
            kind="text"
            size="small"
            :data-testid="`${testId}__cancel`"
            @click="handleCancel"
          />
          <Button
            label="Apply"
            kind="primary"
            size="small"
            :data-testid="`${testId}__apply`"
            @click="handleApply"
          />
        </div>
      </div>
    </div>
  </div>
</template>

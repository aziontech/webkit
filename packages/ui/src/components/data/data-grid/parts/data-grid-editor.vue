<script setup lang="ts">
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import type { UseDataGridEditReturn } from '../composables/use-data-grid-edit'
  import { ERROR_CLASS, INPUT_EDITOR_CLASS, SELECT_EDITOR_CLASS } from '../lib/grid-classes'
  import type { DataGridColumn } from '../types'

  defineOptions({ name: 'DataGridEditor', inheritAttrs: false })

  interface Props {
    /** Column of the edited cell. */
    column: DataGridColumn | undefined
    /** Id of the edited cell. */
    cellId: string
    /** Edit state of the grid. */
    edit: UseDataGridEditReturn
    /** Test id of the grid. */
    testId: string
  }

  defineProps<Props>()

  const { t } = useTranslate({ dataGrid: en.dataGrid })
</script>

<template>
  <select
    v-if="column?.type === 'select'"
    :id="`${cellId}-editor`"
    :value="edit.draft.value"
    :aria-label="column?.header"
    :data-testid="`${testId}__editor`"
    :class="SELECT_EDITOR_CLASS"
    @keydown="edit.onEditorKeydown"
    @change="edit.onEditorInput"
    @blur="edit.commit"
  >
    <option
      v-for="option in column?.options ?? []"
      :key="String(option.value)"
      :value="String(option.value)"
    >
      {{ option.label }}
    </option>
  </select>
  <template v-else>
    <input
      :id="`${cellId}-editor`"
      :value="edit.draft.value"
      type="text"
      :inputmode="column?.type === 'number' ? 'decimal' : undefined"
      :aria-label="column?.header"
      :aria-invalid="edit.invalid.value || undefined"
      :aria-describedby="edit.invalid.value ? `${cellId}-error` : undefined"
      :data-align="column?.align ?? 'start'"
      :data-invalid="edit.invalid.value || null"
      :data-testid="`${testId}__editor`"
      :class="INPUT_EDITOR_CLASS"
      @input="edit.onEditorInput"
      @keydown="edit.onEditorKeydown"
      @blur="edit.commit"
    />
    <span
      v-if="edit.invalid.value"
      :id="`${cellId}-error`"
      role="alert"
      :data-testid="`${testId}__error`"
      :class="ERROR_CLASS"
      >{{ t('dataGrid.invalidNumber') }}</span
    >
  </template>
</template>

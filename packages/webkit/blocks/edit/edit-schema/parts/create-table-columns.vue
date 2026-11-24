<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Button from '@aziontech/webkit/button'
  import Checkbox from '@aziontech/webkit/checkbox'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import SettingsGroup from '@aziontech/webkit/settings-group'

  import { columnDefinition, type DraftColumn } from '../lib/draft-table'
  import ColumnTypeSelect from './column-type-select.vue'

  defineProps<{
    errors: (Record<string, string> | undefined)[]
    error: string
    disabled: boolean
    newItem: () => DraftColumn
  }>()

  const columns = defineModel<DraftColumn[]>('columns', { required: true })
  const query = defineModel<string>('query', { required: true })
</script>

<template>
  <SettingsGroup
    label="Columns"
    hint="The table's schema, created in this order. A primary key is NOT NULL."
  >
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
        <Button
          type="button"
          label="About data types"
          aria-label="About data types (opens in a new tab)"
          variant="outline"
          size="small"
          icon="az az-external-link"
          href="https://www.azion.com/en/documentation/"
          target="_blank"
        />
      </div>
      <AttributeEditor
        v-model:items="columns"
        :definition="columnDefinition"
        :errors="errors"
        :new-item="newItem"
        :min-items="1"
        :disabled="disabled"
        reorderable
        size="large"
        add-button-label="Add column"
        remove-button-label="Remove column"
        aria-label="Columns"
      >
        <template #cell-name="{ index, invalid }">
          <Input
            v-model="columns[index].name"
            size="large"
            class="w-full"
            placeholder="column_name"
            :invalid="invalid"
          />
        </template>
        <template #cell-type="{ index }">
          <ColumnTypeSelect
            v-model:type="columns[index].type"
            v-model:query="query"
            searchable
          />
        </template>
        <template #cell-defaultValue="{ index }">
          <Input
            v-model="columns[index].defaultValue"
            size="large"
            class="w-full"
            placeholder="NULL"
          />
        </template>
        <template #cell-primaryKey="{ index }">
          <Checkbox v-model="columns[index].primaryKey" />
        </template>
      </AttributeEditor>
      <FieldError v-if="error">{{ error }}</FieldError>
    </div>
  </SettingsGroup>
</template>

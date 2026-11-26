<script setup lang="ts">
  import AttributeEditor from '@aziontech/ui/attribute-editor'
  import Select from '@aziontech/ui/select'
  import SettingsGroup from '@aziontech/ui/settings-group'

  import type { SchemaEditorRelation, SchemaEditorTable } from '../edit-schema.vue'
  import { ON_DELETE } from '../lib/column-types'
  import { type DraftColumn, relationDefinition } from '../lib/draft-table'

  const props = defineProps<{
    tables: SchemaEditorTable[]
    columns: DraftColumn[]
    errors: (Record<string, string> | undefined)[]
    disabled: boolean
    newItem: () => SchemaEditorRelation
  }>()

  const relations = defineModel<SchemaEditorRelation[]>('relations', { required: true })

  const referenceColumns = (relation: SchemaEditorRelation) =>
    props.tables.find((item) => item.name === relation.table)?.columns ?? []
</script>

<template>
  <SettingsGroup
    label="Foreign keys"
    hint="Optional. Tie a column to a row in another table, so a value that does not exist there is refused."
  >
    <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
      <AttributeEditor
        v-model:items="relations"
        :definition="relationDefinition"
        :errors="errors"
        :new-item="newItem"
        :disabled="disabled"
        size="large"
        add-button-label="Add foreign key"
        remove-button-label="Remove foreign key"
        empty-title="No foreign keys."
        aria-label="Foreign keys"
      >
        <template #cell-column="{ index, invalid }">
          <Select
            v-model="relations[index].column"
            size="large"
            class="w-full"
            placeholder="Column"
            :invalid="invalid"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                v-for="column in columns"
                :key="column.key"
                :value="column.name.trim()"
                >{{ column.name.trim() }}</Select.Item
              >
            </Select.Content>
          </Select>
        </template>
        <template #cell-table="{ index, invalid }">
          <Select
            v-model="relations[index].table"
            size="large"
            class="w-full"
            placeholder="Table"
            :invalid="invalid"
            @update:model-value="relations[index].references = ''"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                v-for="item in tables"
                :key="item.name"
                :value="item.name"
                >{{ item.name }}</Select.Item
              >
            </Select.Content>
          </Select>
        </template>
        <template #cell-references="{ item, index, invalid }">
          <Select
            v-model="relations[index].references"
            size="large"
            class="w-full"
            placeholder="Column"
            :invalid="invalid"
            :disabled="!item.table"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                v-for="column in referenceColumns(item)"
                :key="column.name"
                :value="column.name"
                >{{ column.name }}</Select.Item
              >
            </Select.Content>
          </Select>
        </template>
        <template #cell-onDelete="{ index }">
          <Select
            v-model="relations[index].onDelete"
            size="large"
            class="w-full"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Item
                v-for="option in ON_DELETE"
                :key="option.value"
                :value="option.value"
                >{{ option.label }}</Select.Item
              >
            </Select.Content>
          </Select>
        </template>
      </AttributeEditor>
    </div>
  </SettingsGroup>
</template>

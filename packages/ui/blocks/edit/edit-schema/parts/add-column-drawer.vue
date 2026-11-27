<script setup lang="ts">
  import DrawerContent from '@aziontech/ui/drawer-content'
  import Drawer from '@aziontech/ui/drawer-root'
  import DrawerTitle from '@aziontech/ui/drawer-title'
  import Field from '@aziontech/ui/field'
  import Input from '@aziontech/ui/input'
  import PanelBody from '@aziontech/ui/panel-body'
  import PanelHeader from '@aziontech/ui/panel-header'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import Switch from '@aziontech/ui/switch'
  import { computed, reactive, ref, watch } from 'vue'

  import type {
    SchemaEditorColumn,
    SchemaEditorColumnForm,
    SchemaEditorTable
  } from '../edit-schema.vue'
  import ColumnTypeSelect from './column-type-select.vue'
  import DrawerFormFooter from './drawer-form-footer.vue'

  const props = defineProps<{
    table: SchemaEditorTable | undefined
    submitting: boolean
    defaultColumn: Partial<SchemaEditorColumnForm>
    defaultSubmitted: boolean
  }>()

  const emit = defineEmits<{
    submit: [event: Event, column: SchemaEditorColumn]
  }>()

  const open = defineModel<boolean>('open', { required: true })
  const typeQuery = defineModel<string>('typeQuery', { required: true })

  const blankColumn = (): SchemaEditorColumnForm => ({
    name: '',
    type: 'text',
    defaultValue: '',
    primaryKey: false,
    notNull: false
  })
  const columnForm = reactive<SchemaEditorColumnForm>({ ...blankColumn(), ...props.defaultColumn })
  const columnSubmitted = ref(props.defaultSubmitted)
  const columnNameError = computed(() => {
    if (!columnSubmitted.value) return ''
    const name = columnForm.name.trim()
    if (!name) return 'This field is required.'
    if (props.table?.columns.some((column) => column.name === name.toLowerCase())) {
      return `${props.table.name} already has a column named ${name}.`
    }
    return ''
  })

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.assign(columnForm, blankColumn())
    columnSubmitted.value = false
    typeQuery.value = ''
  })

  const submit = (event: Event) => {
    columnSubmitted.value = true
    if (props.submitting || columnNameError.value || !props.table) return
    emit('submit', event, {
      name: columnForm.name.trim(),
      type: columnForm.type,
      primaryKey: columnForm.primaryKey,
      notNull: columnForm.notNull || columnForm.primaryKey,
      defaultValue: columnForm.defaultValue.trim()
    })
  }

  defineExpose({ submit })
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Add column"
        novalidate
        @submit.prevent="submit"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Add column</DrawerTitle>
            <p class="text-body-sm text-(--text-muted)">
              The column is added at the end of {{ table?.name }}.
            </p>
          </div>
        </PanelHeader>
        <PanelBody>
          <fieldset
            class="m-0 flex min-w-0 flex-col border-0 p-0"
            :disabled="submitting"
          >
            <legend class="sr-only">Add column</legend>
            <SettingsGroup
              label="Column"
              hint="Its name, type and the value rows get when they leave it empty."
            >
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-md)">
                <Field :invalid="!!columnNameError">
                  <Field.Label>Name</Field.Label>
                  <Input
                    v-model="columnForm.name"
                    size="large"
                    class="w-full"
                    placeholder="column_name"
                    autocomplete="off"
                  />
                  <Field.Error v-if="columnNameError">{{ columnNameError }}</Field.Error>
                </Field>
                <Field>
                  <Field.Label>Type</Field.Label>
                  <ColumnTypeSelect
                    v-model:type="columnForm.type"
                    v-model:query="typeQuery"
                    searchable
                  />
                </Field>
                <Field>
                  <Field.Label>Default value</Field.Label>
                  <Input
                    v-model="columnForm.defaultValue"
                    size="large"
                    class="w-full"
                    placeholder="NULL"
                    autocomplete="off"
                  />
                  <Field.Description
                    >Applies to rows that do not supply a value. Leave it empty for NULL, or use an
                    expression such as now().</Field.Description
                  >
                </Field>
              </div>
            </SettingsGroup>
            <SettingsGroup
              label="Constraints"
              hint="A primary key is always NOT NULL, so turning it on also turns on Not null."
            >
              <div class="flex w-full min-w-0 flex-col gap-(--spacing-sm)">
                <Field orientation="horizontal">
                  <Field.Content>
                    <Field.Title>Primary key</Field.Title>
                    <Field.Description
                      >Use this column as the table's primary key.</Field.Description
                    >
                  </Field.Content>
                  <Switch
                    v-model="columnForm.primaryKey"
                    aria-label="Primary key"
                  />
                </Field>
                <Field orientation="horizontal">
                  <Field.Content>
                    <Field.Title>Not null</Field.Title>
                    <Field.Description>{{
                      columnForm.primaryKey
                        ? 'Always on for a primary key.'
                        : 'Require a value in every row.'
                    }}</Field.Description>
                  </Field.Content>
                  <Switch
                    :model-value="columnForm.notNull || columnForm.primaryKey"
                    :disabled="columnForm.primaryKey"
                    aria-label="Not null"
                    @update:model-value="(value) => (columnForm.notNull = !!value)"
                  />
                </Field>
              </div>
            </SettingsGroup>
          </fieldset>
        </PanelBody>
        <DrawerFormFooter
          submit-label="Add column"
          :submitting="submitting"
          @cancel="open = false"
        />
      </form>
    </DrawerContent>
  </Drawer>
</template>

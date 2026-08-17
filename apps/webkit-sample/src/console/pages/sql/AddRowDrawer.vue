<script setup>
  // Insert Row — adds a row to the selected SQL table, in a MEDIUM right Drawer.
  //
  // FIELDS ARE SEPARATED (./ui/FieldStack.vue, the Variables shape): one field per
  // column, its `<Label for>` the column name in code type with the Postgres type beside
  // it. Every value here is TYPED, and several of them are long — a URL, a JSON blob, a
  // timestamp — so a 256px control pinned to the right of a description was the wrong
  // half of the row to spend the width on.
  //
  // A primary-key integer column is auto-generated (disabled input, and the field says
  // so); a column with a default is prefilled with it; everything else is optional and
  // becomes NULL when left blank. Validation is minimal (values are coerced on insert);
  // one `submitting` flag locks the scope; on success it emits the entered values and
  // the parent builds + appends the row.
  import InputText from '@aziontech/webkit/input-text'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { isIntegerType } from '../../lib/format/postgres-types'

  const open = defineModel('open', { type: Boolean, default: false })
  const props = defineProps({
    // The table being inserted into: { name, columns: [{ name, type, primaryKey, defaultValue }] }.
    table: { type: Object, default: null }
  })
  const emit = defineEmits(['created'])

  const columns = () => props.table?.columns ?? []
  // A primary-key integer column is generated on insert (not typed by the user).
  const isAuto = (column) => column.primaryKey && isIntegerType(column.type)

  const form = reactive({})
  const submitting = ref(false)

  // Seed the form each time the drawer opens: defaults prefilled, auto columns blank.
  watch(open, (isOpen) => {
    if (!isOpen) return
    for (const key of Object.keys(form)) delete form[key]
    for (const column of columns()) {
      form[column.name] = isAuto(column) ? '' : column.defaultValue || ''
    }
  })

  const placeholderFor = (column) => {
    if (isAuto(column)) return 'Automatically generated'
    if (column.defaultValue) return column.defaultValue
    return 'NULL'
  }

  const submit = async () => {
    if (submitting.value) return
    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      emit('created', { ...form })
      toast.success('Row inserted.')
      open.value = false
    } catch (error) {
      toast.error('Could not insert the row.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false
    }
  }
</script>

<template>
  <ResourceDrawer
    v-model:open="open"
    size="medium"
    title="Insert Row"
    save-label="Save"
    :submitting="submitting"
    @submit="submit"
  >
    <Section
      stacked
      :divided="false"
      title="Values"
      hint="One field per column, in the table's own order. A column the database fills in itself is shown but not editable, and an empty optional column is stored as NULL."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
        <!-- The LABEL is the column name, in code type, with its Postgres type beside it —
             that pair IS the field's identity here, so it belongs in the label rather
             than in a sentence next to it. -->
        <FieldStack
          v-for="column in columns()"
          :key="column.name"
          :description="
            isAuto(column)
              ? 'Automatically generated.'
              : column.defaultValue
                ? `Default: ${column.defaultValue}`
                : 'Optional — leave empty for NULL.'
          "
        >
          <template #label>
            <span class="font-code">{{ column.name }}</span>
          </template>
          <template #action>
            <span class="font-code text-body-xs text-(--text-muted)">{{ column.type }}</span>
          </template>
          <template #default="{ controlId }">
            <InputText
              :id="controlId"
              v-model="form[column.name]"
              size="large"
              class="w-full font-code"
              :aria-label="column.name"
              :placeholder="placeholderFor(column)"
              :disabled="submitting || isAuto(column)"
            />
          </template>
        </FieldStack>
      </div>
    </Section>
  </ResourceDrawer>
</template>

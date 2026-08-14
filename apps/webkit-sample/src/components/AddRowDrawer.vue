<script setup>
  // Insert Row — adds a row to the selected SQL table, in a MEDIUM right Drawer.
  // ItemGroup form (/form Approach A): one field per column, its label the column
  // name + type. A primary-key integer column is auto-generated (disabled input,
  // note); a column with a default is prefilled with it; everything else is
  // optional and becomes NULL when left blank. Validation is minimal (values are
  // coerced on insert); one `submitting` flag locks the scope; on success it emits
  // the entered values and the parent builds + appends the row.
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import { isIntegerType } from '../lib/postgres-types'
  import ResourceDrawer from './ui/ResourceDrawer.vue'
  import Section from './ui/Section.vue'

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
    >
      <CardBox :padded="false">
        <template #content>
          <Item.List>
            <Item
              v-for="column in columns()"
              :key="column.name"
              size="small"
              class="items-start"
            >
              <Item.Content>
                <Item.Title>
                  <span class="font-code">{{ column.name }}</span>
                  <span
                    class="ml-[var(--spacing-xxs)] font-code text-body-xs text-[var(--text-muted)]"
                  >
                    {{ column.type }}
                  </span>
                </Item.Title>
                <Item.Description>
                  {{
                    isAuto(column)
                      ? 'Automatically generated.'
                      : column.defaultValue
                        ? `Default: ${column.defaultValue}`
                        : 'Optional — leave empty for NULL.'
                  }}
                </Item.Description>
              </Item.Content>
              <Item.Actions class="justify-end flex-1 max-w-[var(--container-3xs)]">
                <InputText
                  v-model="form[column.name]"
                  size="large"
                  class="w-full font-code"
                  :aria-label="column.name"
                  :placeholder="placeholderFor(column)"
                  :disabled="submitting || isAuto(column)"
                />
              </Item.Actions>
            </Item>
          </Item.List>
        </template>
      </CardBox>
    </Section>
  </ResourceDrawer>
</template>

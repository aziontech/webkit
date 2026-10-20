<script setup lang="ts">
  import InputText from '@aziontech/webkit/input-text'
  import { toast } from '@aziontech/webkit/toast'
  import { reactive, ref, watch } from 'vue'

  import FieldStack from '../../components/form/FieldStack.vue'
  import ResourceDrawer from '../../components/form/ResourceDrawer.vue'
  import Section from '../../components/page/Section.vue'
  import { isIntegerType } from '../../lib/format/postgres-types'

  const open = defineModel('open', { type: Boolean, default: false })
  interface Props {
    table?: Record<string, unknown>
  }

  const props = withDefaults(defineProps<Props>(), {
    table: null
  })
  const emit = defineEmits<{
    created: [value: unknown]
  }>()

  const columns = () => props.table?.columns ?? []
  const isAuto = (column) => column.primaryKey && isIntegerType(column.type)

  const form = reactive({})
  const submitting = ref(false)

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
      hint="One field per column, in the table's own order."
    >
      <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
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

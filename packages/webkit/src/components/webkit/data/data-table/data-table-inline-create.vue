<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import InputText from '../../inputs/input-text/input-text.vue'
  import { useDataTableContext } from './composables/use-data-table-context'

  defineOptions({
    name: 'DataTableInlineCreate',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Placeholder for the name field. */
      placeholder?: string
      /** Disables the inline create form. */
      disabled?: boolean
    }>(),
    {
      placeholder: 'Name',
      disabled: false
    }
  )

  const emit = defineEmits<{
    save: [name: string]
    cancel: []
  }>()

  const attrs = useAttrs()
  const ctx = useDataTableContext()
  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx.testId}__inline-create`
  )

  const name = ref('')

  function handleSave() {
    if (!name.value.trim()) return
    emit('save', name.value.trim())
    name.value = ''
  }

  function handleCancel() {
    name.value = ''
    emit('cancel')
  }
</script>

<template>
  <div
    v-bind="attrs"
    class="flex items-center gap-[var(--spacing-2)]"
    :data-testid="testId"
  >
    <InputText
      :modelValue="name"
      :placeholder="placeholder"
      @update:modelValue="
        (value: string) => {
          name = value
        }
      "
      :disabled="disabled"
      :data-testid="`${testId}__input`"
      @keyup.enter="handleSave"
    />
    <Button
      label="Save"
      kind="primary"
      size="small"
      :disabled="disabled"
      :data-testid="`${testId}__save`"
      @click="handleSave"
    />
    <Button
      label="Cancel"
      kind="text"
      size="small"
      :disabled="disabled"
      :data-testid="`${testId}__cancel`"
      @click="handleCancel"
    />
  </div>
</template>

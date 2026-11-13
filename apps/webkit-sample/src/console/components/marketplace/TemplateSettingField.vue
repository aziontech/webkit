<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import InputText from '@aziontech/webkit/input-text'
  import Label from '@aziontech/webkit/label'
  import { computed } from 'vue'

  defineOptions({ name: 'TemplateSettingField' })

  interface Props {
    /** Input id; also links the label and the helper text. */
    name: string
    /** Field label. */
    label?: string
    /** Placeholder shown while the field is empty. */
    placeholder?: string
    /** Guidance shown under the field while it has no error. */
    description?: string
    /** Marks the field as mandatory in its label. */
    required?: boolean
    /** Error message shown after a failed submit. */
    error?: string
    /** Locks the field while a deploy runs. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    placeholder: '',
    description: '',
    required: false,
    error: '',
    disabled: false
  })

  const model = defineModel<string>({ default: '' })

  const helperId = computed(() => `${props.name}-helper`)
  const helperLabel = computed(() => props.error || props.description)
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xs)">
    <Label
      :label="label"
      :required="required"
      :for="name"
    />
    <InputText
      :id="name"
      v-model="model"
      size="large"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="!!error"
      :aria-describedby="helperLabel ? helperId : undefined"
    />
    <HelperText
      v-if="helperLabel"
      :id="helperId"
      :kind="error ? 'required' : 'helper'"
      :label="helperLabel"
    />
  </div>
</template>

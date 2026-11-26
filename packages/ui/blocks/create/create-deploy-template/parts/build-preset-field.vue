<script setup lang="ts">
  import Field from '@aziontech/webkit/field'
  import Select from '@aziontech/webkit/select'
  import { computed } from 'vue'

  import { samplePresets } from '../sample'

  export interface BuildPresetFieldProps {
    /** The preset found in the project; empty when nothing in it names a framework. */
    detectedPreset?: string
  }

  const props = withDefaults(defineProps<BuildPresetFieldProps>(), { detectedPreset: '' })

  const preset = defineModel<string>({ default: '' })

  const helper = computed(() => {
    if (!preset.value)
      return 'Nothing here names a framework. Pick one to build the project, or leave it empty to serve the files as they are.'
    if (preset.value === props.detectedPreset)
      return 'Detected from your project. Change it if it is wrong.'
    return 'The project is built with this preset.'
  })
</script>

<template>
  <Field>
    <Field.Label>Build preset</Field.Label>
    <Select
      v-model="preset"
      size="large"
      placeholder="Select a preset"
    >
      <Select.Trigger />
      <Select.Content>
        <Select.Item
          v-for="option in samplePresets"
          :key="String(option.value)"
          :value="option.value"
        >
          {{ option.label }}
        </Select.Item>
      </Select.Content>
    </Select>
    <Field.Description>{{ helper }}</Field.Description>
  </Field>
</template>

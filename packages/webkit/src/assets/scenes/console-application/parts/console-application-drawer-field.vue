<script setup lang="ts">
  import CodeBlock from '../../../../components/code/code-block/code-block.vue'
  import Field from '../../../../components/input/field/field.vue'
  import FieldLabel from '../../../../components/input/field/field-label/field-label.vue'
  import Input from '../../../../components/input/input/input.vue'
  import RadioGroup from '../../../../components/input/radio-group/radio-group.vue'
  import Select from '../../../../components/input/select/select.vue'
  import SelectTrigger from '../../../../components/input/select/select-trigger/select-trigger.vue'
  import Switch from '../../../../components/input/switch/switch.vue'
  import Textarea from '../../../../components/input/textarea/textarea.vue'
  import type { ConsoleApplicationField } from '../console-application-data'

  defineOptions({ name: 'ConsoleApplicationDrawerField' })

  interface Props {
    /** The drawer field to draw. */
    field: ConsoleApplicationField
  }

  defineProps<Props>()

  function displayAs(value: string): () => string {
    return () => value
  }
</script>

<template>
  <RadioGroup
    v-if="field.kind === 'choice'"
    :model-value="field.value"
    variant="card"
    orientation="horizontal"
    :options="field.options.map((option) => ({ value: option, label: option }))"
    :aria-label="field.label"
  />
  <Field
    key="field-1"
    v-else-if="field.kind === 'switch'"
    orientation="horizontal"
  >
    <Switch
      :model-value="field.on"
      :aria-label="field.label"
    />
    <FieldLabel>{{ field.label }}</FieldLabel>
  </Field>
  <Field
    key="field-2"
    v-else
  >
    <FieldLabel>{{ field.label }}</FieldLabel>
    <Input
      v-if="field.kind === 'text'"
      :model-value="field.value"
      size="medium"
      readonly
    />
    <Textarea
      v-else-if="field.kind === 'textarea'"
      :model-value="field.value"
      readonly
    />
    <Select
      v-else-if="field.kind === 'select'"
      :model-value="field.value"
      :display-value="displayAs(field.value)"
      size="medium"
    >
      <SelectTrigger
        class="w-full"
        :aria-label="field.label"
      />
    </Select>
    <CodeBlock
      v-else
      :tabs="[
        {
          label: field.label,
          value: field.label,
          code: field.value,
          language: 'json'
        }
      ]"
      :copyable="false"
    />
  </Field>
</template>

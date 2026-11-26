<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import Textarea from '@aziontech/webkit/textarea'

  export interface PastePanelProps {
    /** The id of the text field; the panel and its report derive theirs from it. */
    id: string
    /** The label of the text field. */
    label: string
    /** The rows of the text field. */
    rows: number
    /** The text of the apply button. */
    applyLabel: string
    /** The test id of the apply button. */
    applyTestid: string
    /** True when the text holds nothing to apply. */
    applyDisabled?: boolean
    /** True when the text holds lines that will be skipped. */
    invalid?: boolean
    /** Writes the text in the code font through the Textarea monospace look. */
    monospace?: boolean
  }

  withDefaults(defineProps<PastePanelProps>(), {
    applyDisabled: false,
    invalid: false,
    monospace: false
  })

  const text = defineModel<string>({ default: '' })

  const emit = defineEmits<{
    apply: [event: MouseEvent]
    cancel: [event: MouseEvent]
  }>()

  defineSlots<{
    /** What the text holds, read with the field. */
    report(): unknown
  }>()
</script>

<template>
  <div
    :id="`${id}-panel`"
    class="flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
  >
    <Field>
      <Field.Label :for="id">{{ label }}</Field.Label>
      <Textarea
        :id="id"
        v-model="text"
        :rows="rows"
        :monospace="monospace"
        spellcheck="false"
        :invalid="invalid"
        :aria-describedby="`${id}-report`"
      />
    </Field>
    <div
      :id="`${id}-report`"
      class="flex flex-col gap-(--spacing-2xs)"
    >
      <slot name="report" />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Button
        :label="applyLabel"
        variant="primary"
        size="medium"
        :disabled="applyDisabled"
        :data-testid="applyTestid"
        @click="(event) => emit('apply', event)"
      />
      <Button
        label="Cancel"
        variant="ghost"
        size="medium"
        @click="(event) => emit('cancel', event)"
      />
    </div>
  </div>
</template>

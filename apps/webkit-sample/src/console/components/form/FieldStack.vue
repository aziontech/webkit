<script setup lang="ts">
  import HelperText from '@aziontech/webkit/helper-text'
  import Label from '@aziontech/webkit/label'
  import { computed, useId } from 'vue'

  interface Props {
    label?: string
    description?: string
    hint?: string
    message?: string
    messageKind?: 'helper' | 'required' | 'invalid'
    required?: boolean
    group?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    label: '',
    description: '',
    hint: '',
    message: '',
    messageKind: 'helper',
    required: false,
    group: false
  })

  const slots = defineSlots()

  const controlId = useId()
  const helperId = useId()
  const labelId = useId()

  const helperShown = computed(() => !!(props.message || props.description || slots.description))
  const helperKind = computed(() => (props.message ? props.messageKind : 'helper'))
  const describedBy = computed(() => (helperShown.value ? helperId : undefined))

  const blocking = computed(() => !!props.message && props.messageKind !== 'helper')
</script>

<template>
  <div
    :data-field-invalid="blocking || null"
    class="flex w-full min-w-0 flex-col gap-(--spacing-xs)"
  >
    <div
      v-if="label || $slots.label || $slots.action"
      class="flex min-w-0 items-center justify-between gap-(--spacing-xs)"
    >
      <Label
        :id="group ? labelId : undefined"
        :for="group ? undefined : controlId"
        :required="required"
        :hint="hint"
      >
        <slot name="label">{{ label }}</slot>
      </Label>
      <slot name="action" />
    </div>

    <slot
      :control-id="controlId"
      :described-by="describedBy"
      :label-id="labelId"
    />

    <HelperText
      v-if="helperShown"
      :id="helperId"
      :kind="helperKind"
    >
      <template v-if="message">{{ message }}</template>
      <slot
        v-else
        name="description"
        >{{ description }}</slot
      >
    </HelperText>
  </div>
</template>

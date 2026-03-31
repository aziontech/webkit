<script setup>
import Checkbox from 'primevue/checkbox'

defineOptions({ name: 'Checkbox' })

const props = defineProps({
  modelValue: {
    type: null,
    default: undefined
  },
  value: {
    type: null,
    default: undefined
  },
  binary: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  inputId: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  },
  tabindex: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <Checkbox
    :modelValue="props.modelValue"
    :value="props.value"
    :binary="props.binary"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :inputId="props.inputId"
    :class="props.class"
    :tabindex="props.tabindex"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

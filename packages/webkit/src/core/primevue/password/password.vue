<script setup>
import Password from 'primevue/password'

defineOptions({ name: 'Password' })

const props = defineProps({
  modelValue: {
    type: String,
    default: undefined
  },
  feedback: {
    type: Boolean,
    default: true
  },
  toggleMask: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  inputId: {
    type: String,
    default: undefined
  },
  appendTo: {
    type: [String, Object],
    default: 'body'
  },
  autocomplete: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  },
  pt: {
    type: Object,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <Password
    :modelValue="props.modelValue"
    :feedback="props.feedback"
    :toggleMask="props.toggleMask"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :inputId="props.inputId"
    :appendTo="props.appendTo"
    :autocomplete="props.autocomplete"
    :class="props.class"
    :pt="props.pt"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

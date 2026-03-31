<script setup>
import Chips from 'primevue/chips'

defineOptions({ name: 'Chips' })

const props = defineProps({
  modelValue: {
    type: Array,
    default: undefined
  },
  max: {
    type: Number,
    default: undefined
  },
  separator: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  class: {
    type: String,
    default: ''
  },
  pt: {
    type: Object,
    default: undefined
  },
  inputId: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'add', 'remove'])
</script>

<template>
  <Chips
    :modelValue="props.modelValue"
    :max="props.max"
    :separator="props.separator"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :class="props.class"
    :pt="props.pt"
    :inputId="props.inputId"
    @update:modelValue="emit('update:modelValue', $event)"
    @add="emit('add', $event)"
    @remove="emit('remove', $event)"
  />
</template>

<script setup>
  import InputNumber from 'primevue/inputnumber'

  defineOptions({ name: 'InputNumber' })

  const props = defineProps({
    modelValue: {
      type: Number,
      default: undefined
    },
    mode: {
      type: String,
      default: 'decimal',
      validator: (val) => ['decimal', 'currency'].includes(val)
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    },
    step: {
      type: Number,
      default: 1
    },
    minFractionDigits: {
      type: Number,
      default: undefined
    },
    maxFractionDigits: {
      type: Number,
      default: undefined
    },
    currency: {
      type: String,
      default: undefined
    },
    locale: {
      type: String,
      default: undefined
    },
    showButtons: {
      type: Boolean,
      default: false
    },
    buttonLayout: {
      type: String,
      default: 'stacked',
      validator: (val) => ['horizontal', 'vertical', 'stacked'].includes(val)
    },
    prefix: {
      type: String,
      default: undefined
    },
    suffix: {
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
    },
    inputClass: {
      type: [String, Object],
      default: undefined
    },
    highlightOnFocus: {
      type: Boolean,
      default: false
    }
  })

  const emit = defineEmits(['update:modelValue', 'input'])
</script>

<template>
  <InputNumber
    :modelValue="props.modelValue"
    :mode="props.mode"
    :min="props.min"
    :max="props.max"
    :step="props.step"
    :minFractionDigits="props.minFractionDigits"
    :maxFractionDigits="props.maxFractionDigits"
    :currency="props.currency"
    :locale="props.locale"
    :showButtons="props.showButtons"
    :buttonLayout="props.buttonLayout"
    :prefix="props.prefix"
    :suffix="props.suffix"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :class="props.class"
    :pt="props.pt"
    :inputId="props.inputId"
    :inputClass="props.inputClass"
    :highlightOnFocus="props.highlightOnFocus"
    @update:modelValue="emit('update:modelValue', $event)"
    @input="emit('input', $event)"
  />
</template>

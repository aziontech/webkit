<script setup>
  import InputSwitch from 'primevue/inputswitch'

  defineOptions({ name: 'InputSwitch' })

  const props = defineProps({
    modelValue: {
      type: null,
      default: undefined
    },
    trueValue: {
      type: null,
      default: true
    },
    falseValue: {
      type: null,
      default: false
    },
    disabled: {
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
    }
  })

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <InputSwitch
    :modelValue="props.modelValue"
    :trueValue="props.trueValue"
    :falseValue="props.falseValue"
    :disabled="props.disabled"
    :inputId="props.inputId"
    :class="props.class"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

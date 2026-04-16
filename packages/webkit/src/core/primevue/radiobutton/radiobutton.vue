<script setup>
  import RadioButton from 'primevue/radiobutton'

  defineOptions({ name: 'RadioButton' })

  const props = defineProps({
    modelValue: {
      type: null,
      default: undefined
    },
    value: {
      type: null,
      default: undefined
    },
    name: {
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
    class: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <RadioButton
    :modelValue="props.modelValue"
    :value="props.value"
    :name="props.name"
    :disabled="props.disabled"
    :inputId="props.inputId"
    :class="props.class"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

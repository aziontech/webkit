<script setup>
  import InputText from 'primevue/inputtext'

  defineOptions({ name: 'InputText' })

  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined
    },
    placeholder: {
      type: String,
      default: undefined
    },
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: undefined,
      validator: (val) => ['small', 'large'].includes(val)
    },
    invalid: {
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
    }
  })

  const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <InputText
    :modelValue="props.modelValue"
    :placeholder="props.placeholder"
    :type="props.type"
    :disabled="props.disabled"
    :size="props.size"
    :invalid="props.invalid"
    :class="props.class"
    :pt="props.pt"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

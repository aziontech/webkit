<script setup>
  import Textarea from 'primevue/textarea'

  defineOptions({ name: 'Textarea' })

  const props = defineProps({
    modelValue: {
      type: String,
      default: undefined
    },
    autoResize: {
      type: Boolean,
      default: false
    },
    rows: {
      type: Number,
      default: undefined
    },
    cols: {
      type: Number,
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
    maxlength: {
      type: Number,
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
  <Textarea
    :modelValue="props.modelValue"
    :autoResize="props.autoResize"
    :rows="props.rows"
    :cols="props.cols"
    :placeholder="props.placeholder"
    :disabled="props.disabled"
    :maxlength="props.maxlength"
    :class="props.class"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>

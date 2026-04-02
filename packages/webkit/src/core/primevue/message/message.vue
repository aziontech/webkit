<script setup>
import Message from 'primevue/message'

defineOptions({ name: 'Message' })

const props = defineProps({
  severity: {
    type: String,
    default: 'info',
    validator: (val) => ['success', 'info', 'warn', 'error'].includes(val)
  },
  closable: {
    type: Boolean,
    default: false
  },
  sticky: {
    type: Boolean,
    default: true
  },
  life: {
    type: Number,
    default: 3000
  },
  icon: {
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

const emit = defineEmits(['close'])
</script>

<template>
  <Message
    :severity="props.severity"
    :closable="props.closable"
    :sticky="props.sticky"
    :life="props.life"
    :icon="props.icon"
    :class="props.class"
    :pt="props.pt"
    @close="emit('close')"
  >
    <slot />
  </Message>
</template>

<script setup>
import InlineMessage from 'primevue/inlinemessage'

defineOptions({ name: 'InlineMessage' })

const props = defineProps({
  severity: {
    type: String,
    default: 'error',
    validator: (val) => ['success', 'info', 'warn', 'error'].includes(val)
  },
  icon: {
    type: String,
    default: undefined
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <InlineMessage
    :severity="props.severity"
    :icon="props.icon"
    :class="props.class"
  >
    <slot />
  </InlineMessage>
</template>

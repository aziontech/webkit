<script setup>
import Toast from 'primevue/toast'

defineOptions({ name: 'Toast' })

const props = defineProps({
  group: {
    type: String,
    default: undefined
  },
  position: {
    type: String,
    default: 'top-right',
    validator: (val) => ['top-right', 'top-left', 'bottom-right', 'bottom-left', 'center', 'top-center', 'bottom-center'].includes(val)
  },
  breakpoints: {
    type: Object,
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
</script>

<template>
  <Toast
    :group="props.group"
    :position="props.position"
    :breakpoints="props.breakpoints"
    :class="props.class"
    :pt="props.pt"
  >
    <template v-if="$slots.message" #message="slotProps">
      <slot name="message" :message="slotProps.message" />
    </template>
  </Toast>
</template>

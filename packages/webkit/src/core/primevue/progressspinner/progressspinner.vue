<script setup>
import ProgressSpinner from 'primevue/progressspinner'

defineOptions({ name: 'ProgressSpinner' })

const props = defineProps({
  strokeWidth: {
    type: String,
    default: '2'
  },
  fill: {
    type: String,
    default: 'none'
  },
  animationDuration: {
    type: String,
    default: '2s'
  },
  class: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <ProgressSpinner
    :strokeWidth="props.strokeWidth"
    :fill="props.fill"
    :animationDuration="props.animationDuration"
    :class="props.class"
  />
</template>

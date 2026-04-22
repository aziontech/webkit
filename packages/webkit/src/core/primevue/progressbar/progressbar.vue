<script setup>
  import ProgressBar from 'primevue/progressbar'

  defineOptions({ name: 'ProgressBar' })

  const props = defineProps({
    value: {
      type: Number,
      default: 0
    },
    mode: {
      type: String,
      default: 'determinate',
      validator: (val) => ['determinate', 'indeterminate'].includes(val)
    },
    showValue: {
      type: Boolean,
      default: true
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
  <ProgressBar
    :value="props.value"
    :mode="props.mode"
    :showValue="props.showValue"
    :class="props.class"
    :pt="props.pt"
  />
</template>

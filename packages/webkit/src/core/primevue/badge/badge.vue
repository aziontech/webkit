<script setup>
  import Badge from 'primevue/badge'

  defineOptions({ name: 'Badge' })

  const props = defineProps({
    value: {
      type: [String, Number],
      default: undefined
    },
    severity: {
      type: String,
      default: undefined,
      validator: (val) =>
        ['secondary', 'success', 'info', 'warning', 'danger', 'contrast'].includes(val)
    },
    size: {
      type: String,
      default: undefined,
      validator: (val) => ['large', 'xlarge'].includes(val)
    },
    class: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <Badge
    :value="props.value"
    :severity="props.severity"
    :size="props.size"
    :class="props.class"
  />
</template>

<script setup>
  import Skeleton from 'primevue/skeleton'

  defineOptions({ name: 'Skeleton' })

  const props = defineProps({
    shape: {
      type: String,
      default: 'rectangle',
      validator: (val) => ['rectangle', 'circle'].includes(val)
    },
    size: {
      type: String,
      default: undefined,
      validator: (val) => ['normal', 'large'].includes(val)
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '1rem'
    },
    borderRadius: {
      type: String,
      default: undefined
    },
    animation: {
      type: String,
      default: 'wave',
      validator: (val) => ['wave', 'none'].includes(val)
    },
    class: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <Skeleton
    :shape="props.shape"
    :size="props.size"
    :width="props.width"
    :height="props.height"
    :borderRadius="props.borderRadius"
    :animation="props.animation"
    :class="props.class"
  />
</template>

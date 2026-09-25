<script setup>
  import Avatar from 'primevue/avatar'

  defineOptions({ name: 'Avatar' })

  const props = defineProps({
    label: {
      type: String,
      default: undefined
    },
    icon: {
      type: String,
      default: undefined
    },
    image: {
      type: String,
      default: undefined
    },
    size: {
      type: String,
      default: undefined,
      validator: (val) => ['normal', 'large', 'xlarge'].includes(val)
    },
    shape: {
      type: String,
      default: undefined,
      validator: (val) => ['square', 'circle'].includes(val)
    },
    class: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <Avatar
    :label="props.label"
    :icon="props.icon"
    :image="props.image"
    :size="props.size"
    :shape="props.shape"
    :class="props.class"
  >
    <slot />
  </Avatar>
</template>

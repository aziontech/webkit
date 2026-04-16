<script setup>
  import Chip from 'primevue/chip'

  defineOptions({ name: 'Chip' })

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
    removable: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['remove'])
</script>

<template>
  <Chip
    :label="props.label"
    :icon="props.icon"
    :image="props.image"
    :removable="props.removable"
    :class="props.class"
    @remove="emit('remove')"
  >
    <template
      v-if="$slots.default"
      #default
    >
      <slot />
    </template>
  </Chip>
</template>

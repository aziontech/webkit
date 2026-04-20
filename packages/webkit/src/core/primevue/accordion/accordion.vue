<script setup>
  import Accordion from 'primevue/accordion'

  defineOptions({ name: 'Accordion' })

  const props = defineProps({
    activeIndex: {
      type: [Number, Array],
      default: null
    },
    multiple: {
      type: Boolean,
      default: false
    },
    class: {
      type: String,
      default: ''
    }
  })

  const emit = defineEmits(['tab-open', 'tab-close', 'update:activeIndex'])
</script>

<template>
  <Accordion
    :activeIndex="props.activeIndex"
    :multiple="props.multiple"
    :class="props.class"
    @tab-open="emit('tab-open', $event)"
    @tab-close="emit('tab-close', $event)"
    @update:activeIndex="emit('update:activeIndex', $event)"
  >
    <slot />
  </Accordion>
</template>

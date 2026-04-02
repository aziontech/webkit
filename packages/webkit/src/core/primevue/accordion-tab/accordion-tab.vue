<script setup>
import AccordionTab from 'primevue/accordiontab'

defineOptions({ name: 'AccordionTab' })

const props = defineProps({
  header: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
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
  <AccordionTab
    :header="props.header"
    :disabled="props.disabled"
    :class="props.class"
    :pt="props.pt"
  >
    <slot />
  </AccordionTab>
</template>

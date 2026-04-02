<script setup>
import TabPanel from 'primevue/tabpanel'

defineOptions({ name: 'TabPanel' })

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
  <TabPanel
    :header="props.header"
    :disabled="props.disabled"
    :class="props.class"
    :pt="props.pt"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.default" #default>
      <slot />
    </template>
  </TabPanel>
</template>

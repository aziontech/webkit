<script setup>
import Steps from 'primevue/steps'

defineOptions({ name: 'Steps' })

const props = defineProps({
  model: {
    type: Array,
    default: () => []
  },
  activeStep: {
    type: Number,
    default: 0
  },
  readonly: {
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

const emit = defineEmits(['step-change'])
</script>

<template>
  <Steps
    :model="props.model"
    :activeStep="props.activeStep"
    :readonly="props.readonly"
    :class="props.class"
    :pt="props.pt"
    @step-change="emit('step-change', $event)"
  >
    <template v-if="$slots.item" #item="slotProps">
      <slot name="item" :item="slotProps.item" :index="slotProps.index" />
    </template>
  </Steps>
</template>

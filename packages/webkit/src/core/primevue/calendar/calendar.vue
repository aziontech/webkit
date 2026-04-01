<script setup>
import Calendar from 'primevue/calendar'

defineOptions({ name: 'Calendar' })

const props = defineProps({
  modelValue: {
    type: [Date, Array],
    default: undefined
  },
  selectionMode: {
    type: String,
    default: 'single',
    validator: (val) => ['single', 'multiple', 'range'].includes(val)
  },
  dateFormat: {
    type: String,
    default: undefined
  },
  placeholder: {
    type: String,
    default: undefined
  },
  showIcon: {
    type: Boolean,
    default: false
  },
  showTime: {
    type: Boolean,
    default: false
  },
  timeOnly: {
    type: Boolean,
    default: false
  },
  inline: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  minDate: {
    type: Date,
    default: undefined
  },
  maxDate: {
    type: Date,
    default: undefined
  },
  hourFormat: {
    type: String,
    default: undefined
  },
  showButtonBar: {
    type: Boolean,
    default: false
  },
  showWeek: {
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
  },
  manualInput: {
    type: Boolean,
    default: true
  },
  iconDisplay: {
    type: String,
    default: 'button'
  }
})

const emit = defineEmits(['update:modelValue', 'date-select', 'show', 'hide', 'blur'])
</script>

<template>
  <Calendar
    :modelValue="props.modelValue"
    :selectionMode="props.selectionMode"
    :dateFormat="props.dateFormat"
    :placeholder="props.placeholder"
    :showIcon="props.showIcon"
    :showTime="props.showTime"
    :timeOnly="props.timeOnly"
    :inline="props.inline"
    :disabled="props.disabled"
    :minDate="props.minDate"
    :maxDate="props.maxDate"
    :hourFormat="props.hourFormat"
    :showButtonBar="props.showButtonBar"
    :showWeek="props.showWeek"
    :class="props.class"
    :pt="props.pt"
    :manualInput="props.manualInput"
    :iconDisplay="props.iconDisplay"
    @update:modelValue="emit('update:modelValue', $event)"
    @date-select="emit('date-select', $event)"
    @show="emit('show')"
    @hide="emit('hide')"
    @blur="emit('blur', $event)"
  >
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.date" #date="slotProps">
      <slot name="date" v-bind="slotProps" />
    </template>
  </Calendar>
</template>

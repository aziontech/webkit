<script setup>
import Listbox from 'primevue/listbox'

defineOptions({ name: 'Listbox' })

const props = defineProps({
  modelValue: {
    type: null,
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  },
  optionLabel: {
    type: [String, Function],
    default: undefined
  },
  optionValue: {
    type: [String, Function],
    default: undefined
  },
  optionDisabled: {
    type: [String, Function],
    default: undefined
  },
  optionGroupLabel: {
    type: [String, Function],
    default: undefined
  },
  optionGroupChildren: {
    type: [String, Function],
    default: undefined
  },
  multiple: {
    type: Boolean,
    default: false
  },
  filter: {
    type: Boolean,
    default: false
  },
  filterPlaceholder: {
    type: String,
    default: undefined
  },
  disabled: {
    type: Boolean,
    default: false
  },
  listStyle: {
    type: String,
    default: undefined
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

const emit = defineEmits(['update:modelValue', 'change', 'filter'])
</script>

<template>
  <Listbox
    :modelValue="props.modelValue"
    :options="props.options"
    :optionLabel="props.optionLabel"
    :optionValue="props.optionValue"
    :optionDisabled="props.optionDisabled"
    :optionGroupLabel="props.optionGroupLabel"
    :optionGroupChildren="props.optionGroupChildren"
    :multiple="props.multiple"
    :filter="props.filter"
    :filterPlaceholder="props.filterPlaceholder"
    :disabled="props.disabled"
    :listStyle="props.listStyle"
    :class="props.class"
    :pt="props.pt"
    @update:modelValue="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @filter="emit('filter', $event)"
  >
    <template v-if="$slots.option" #option="slotProps">
      <slot name="option" v-bind="slotProps" />
    </template>
    <template v-if="$slots.header" #header>
      <slot name="header" />
    </template>
    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
    <template v-if="$slots.empty" #empty>
      <slot name="empty" />
    </template>
    <template v-if="$slots.optiongroup" #optiongroup="slotProps">
      <slot name="optiongroup" v-bind="slotProps" />
    </template>
  </Listbox>
</template>

<script setup>
import Dropdown from 'primevue/dropdown'

defineOptions({ name: 'Dropdown' })

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
  placeholder: {
    type: String,
    default: undefined
  },
  filter: {
    type: Boolean,
    default: false
  },
  filterPlaceholder: {
    type: String,
    default: undefined
  },
  showClear: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  autoFilterFocus: {
    type: Boolean,
    default: false
  },
  autoOptionFocus: {
    type: Boolean,
    default: false
  },
  resetFilterOnHide: {
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
  appendTo: {
    type: [String, Object],
    default: 'body'
  },
  emptyMessage: {
    type: String,
    default: undefined
  },
  filterIcon: {
    type: String,
    default: undefined
  },
  scrollHeight: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'filter', 'show', 'hide'])

</script>

<template>
  <Dropdown
    :modelValue="props.modelValue"
    :options="props.options"
    :optionLabel="props.optionLabel"
    :optionValue="props.optionValue"
    :optionDisabled="props.optionDisabled"
    :optionGroupLabel="props.optionGroupLabel"
    :optionGroupChildren="props.optionGroupChildren"
    :placeholder="props.placeholder"
    :filter="props.filter"
    :filterPlaceholder="props.filterPlaceholder"
    :showClear="props.showClear"
    :disabled="props.disabled"
    :loading="props.loading"
    :autoFilterFocus="props.autoFilterFocus"
    :autoOptionFocus="props.autoOptionFocus"
    :resetFilterOnHide="props.resetFilterOnHide"
    :class="props.class"
    :pt="props.pt"
    :appendTo="props.appendTo"
    :emptyMessage="props.emptyMessage"
    :filterIcon="props.filterIcon"
    :scrollHeight="props.scrollHeight"
    @update:modelValue="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @filter="emit('filter', $event)"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <template v-if="$slots.value" #value="slotProps">
      <slot name="value" v-bind="slotProps" />
    </template>
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
    <template v-if="$slots.dropdownicon" #dropdownicon>
      <slot name="dropdownicon" />
    </template>
  </Dropdown>
</template>

<script setup>
  import MultiSelect from 'primevue/multiselect'

  defineOptions({ name: 'MultiSelect' })

  const props = defineProps({
    modelValue: {
      type: Array,
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
    placeholder: {
      type: String,
      default: undefined
    },
    display: {
      type: String,
      default: 'comma',
      validator: (val) => ['comma', 'chip'].includes(val)
    },
    maxSelectedLabels: {
      type: Number,
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
    showToggleAll: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectionLimit: {
      type: Number,
      default: undefined
    },
    appendTo: {
      type: [String, Object],
      default: 'body'
    },
    autoFilterFocus: {
      type: Boolean,
      default: false
    },
    resetFilterOnHide: {
      type: Boolean,
      default: false
    },
    scrollHeight: {
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

  const emit = defineEmits(['update:modelValue', 'change', 'filter', 'show', 'hide'])
</script>

<template>
  <MultiSelect
    :modelValue="props.modelValue"
    :options="props.options"
    :optionLabel="props.optionLabel"
    :optionValue="props.optionValue"
    :optionDisabled="props.optionDisabled"
    :placeholder="props.placeholder"
    :display="props.display"
    :maxSelectedLabels="props.maxSelectedLabels"
    :filter="props.filter"
    :filterPlaceholder="props.filterPlaceholder"
    :showToggleAll="props.showToggleAll"
    :disabled="props.disabled"
    :loading="props.loading"
    :selectionLimit="props.selectionLimit"
    :appendTo="props.appendTo"
    :autoFilterFocus="props.autoFilterFocus"
    :resetFilterOnHide="props.resetFilterOnHide"
    :scrollHeight="props.scrollHeight"
    :class="props.class"
    :pt="props.pt"
    @update:modelValue="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @filter="emit('filter', $event)"
    @show="emit('show')"
    @hide="emit('hide')"
  >
    <template
      v-if="$slots.value"
      #value="slotProps"
    >
      <slot
        name="value"
        v-bind="slotProps"
      />
    </template>
    <template
      v-if="$slots.option"
      #option="slotProps"
    >
      <slot
        name="option"
        v-bind="slotProps"
      />
    </template>
    <template
      v-if="$slots.header"
      #header
    >
      <slot name="header" />
    </template>
    <template
      v-if="$slots.footer"
      #footer
    >
      <slot name="footer" />
    </template>
    <template
      v-if="$slots.empty"
      #empty
    >
      <slot name="empty" />
    </template>
  </MultiSelect>
</template>

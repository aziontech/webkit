<script setup>
  import SelectButton from 'primevue/selectbutton'

  defineOptions({ name: 'SelectButton' })

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
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    dataKey: {
      type: String,
      default: undefined
    },
    ariaLabel: {
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

  const emit = defineEmits(['update:modelValue', 'change'])
</script>

<template>
  <SelectButton
    :modelValue="props.modelValue"
    :options="props.options"
    :optionLabel="props.optionLabel"
    :optionValue="props.optionValue"
    :optionDisabled="props.optionDisabled"
    :multiple="props.multiple"
    :disabled="props.disabled"
    :dataKey="props.dataKey"
    :ariaLabel="props.ariaLabel"
    :class="props.class"
    :pt="props.pt"
    @update:modelValue="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
  >
    <template
      v-if="$slots.option"
      #option="slotProps"
    >
      <slot
        name="option"
        v-bind="slotProps"
      />
    </template>
  </SelectButton>
</template>

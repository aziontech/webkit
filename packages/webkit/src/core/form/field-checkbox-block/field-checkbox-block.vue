<script setup>
  import PrimeCheckbox from 'primevue/checkbox'
  import { useField } from 'vee-validate'
  import { toRefs } from 'vue'

  import SelectorBlock from '../../selector-block/selector-block.vue'

  defineOptions({ name: 'FieldCheckboxBlock' })

  const props = defineProps({
    title: {
      type: String,
      default: ''
    },
    isLabel: {
      type: Boolean,
      default: false
    },
    subtitle: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    auto: {
      type: Boolean,
      default: false
    },
    isCard: {
      type: Boolean,
      default: true
    },
    hideSelector: {
      type: Boolean,
      default: false
    },
    nameField: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: [Boolean, String, Object],
      default: false
    },
    binary: {
      type: Boolean,
      default: false
    }
  })

  const { nameField } = toRefs(props)

  const {
    value: inputValue,
    checked,
    handleChange
  } = useField(nameField, undefined, {
    type: 'checkbox',
    checkedValue: props.binary ? true : props.value,
    uncheckedValue: props.binary ? false : ''
  })

  const stopPropagation = (event) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const clickCard = (event) => {
    if (props.binary && !props.disabled) {
      stopPropagation(event)
      handleChange(!inputValue.value)
      return
    }
  }
</script>

<template>
  <SelectorBlock
    v-bind="props"
    :selected="checked"
    :nameId="props.name"
    @click="clickCard"
  >
    <template #selector>
      <PrimeCheckbox
        :disabled="props.disabled"
        :inputId="props.name"
        :name="props.name"
        @click="stopPropagation"
        :value="props.value"
        v-model="inputValue"
        :binary="props.binary"
      />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </SelectorBlock>
</template>

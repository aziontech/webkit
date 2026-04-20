<script setup>
  import InputText from 'primevue/inputtext'
  import { useField } from 'vee-validate'
  import { computed, ref, toRef, useAttrs, useSlots } from 'vue'

  import Label from '../label'
  import InputSlot from '../slots/input-slot'

  const emit = defineEmits(['blur', 'input'])
  const props = defineProps({
    value: {
      type: String,
      default: ''
    },
    class: {
      type: String
    },
    name: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
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
    readonly: {
      type: Boolean,
      default: false
    },
    sensitive: {
      type: Boolean,
      default: false
    },
    additionalError: {
      type: String,
      default: ''
    }
  })
  const inputRef = ref(null)
  const name = toRef(props, 'name')
  const slots = useSlots()
  const attrs = useAttrs()
  const hasDescriptionSlot = !!slots.description

  const customTestId = computed(() => {
    const id = attrs['data-testid'] || 'field-text'

    return {
      label: `${id}__label`,
      input: `${id}__input`,
      description: `${id}__description`,
      error: `${id}__error-message`
    }
  })

  const {
    value: inputValue,
    errorMessage: veeValidateErrorMessage,
    handleBlur,
    handleChange
  } = useField(name, undefined, {
    initialValue: props.value
  })

  const onBlur = (event) => {
    handleBlur(event)
    emit('blur', event)
  }

  const onChange = (event) => {
    handleChange(event)
    emit('input', event.target.value)
  }

  defineExpose({ inputRef })
</script>

<template>
  <InputSlot>
    <Label
      :for="props.name"
      :data-testid="customTestId.label"
      :label="props.label"
      :isRequired="attrs.required"
    />
    <InputText
      v-bind="sensitive ? { 'data-sentry-mask': '' } : {}"
      v-model="inputValue"
      ref="inputRef"
      type="text"
      :data-testid="customTestId.input"
      :id="name"
      :name="name"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="props.placeholder"
      :class="[{ 'p-invalid': additionalError || veeValidateErrorMessage }, props.class]"
      @input="onChange"
      @keypress.enter.prevent
      @blur="onBlur"
    />
    <small
      v-if="additionalError || veeValidateErrorMessage"
      class="p-error text-xs font-normal leading-tight"
      :data-testid="customTestId.error"
    >
      {{ additionalError || veeValidateErrorMessage }}
    </small>
    <small
      v-if="props.description || hasDescriptionSlot"
      class="text-xs text-color-secondary font-normal leading-5"
      :data-testid="customTestId.description"
    >
      <slot name="description">
        {{ props.description }}
      </slot>
    </small>
  </InputSlot>
</template>

<script setup>
  import { computed, ref, toRef, useAttrs, useSlots } from 'vue'
  import { useField } from 'vee-validate'
  import Password from 'primevue/password'
  import Divider from 'primevue/divider'
  import Label from '../label'
  import InputSlot from '../slots/input-slot'

  const emit = defineEmits(['blur', 'input', 'submit', 'focus'])
  const props = defineProps({
    value: {
      type: String,
      default: ''
    },
    class: {
      type: String,
      default: ''
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
    additionalError: {
      type: String,
      default: ''
    },
    promptLabel: {
      type: String,
      default: 'Choose a password'
    },
    weakLabel: {
      type: String,
      default: 'Weak'
    },
    mediumLabel: {
      type: String,
      default: 'Medium'
    },
    strongLabel: {
      type: String,
      default: 'Strong'
    },
    strongRegex: {
      type: String,
      default: '^(?=.*[-_!@#$%^&*(),.?":{}|<>])(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.{8,})'
    },
    requirements: {
      type: Array,
      default: () => [
        { text: '8 characters' },
        { text: '1 uppercase letter' },
        { text: '1 lowercase letter' },
        { text: '1 number' },
        { text: '1 special character' }
      ],
      validator: (value) => value.every((item) => typeof item.text === 'string')
    },
    requirementsLabel: {
      type: String,
      default: 'Must have at least:'
    }
  })

  const inputPasswordRef = ref(null)
  const name = toRef(props, 'name')
  const slots = useSlots()
  const attrs = useAttrs()
  const hasDescriptionSlot = computed(() => !!slots.description)

  const hasError = computed(() => !!(props.additionalError || veeValidateErrorMessage.value))

  const customTestId = computed(() => {
    const id = attrs['data-testid'] || 'field-password-strength'

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
    emit('input', event?.target?.value ?? inputValue.value)
  }

  const onFocus = (event) => {
    emit('focus', event)
  }

  const onKeydown = (event) => {
    if (event.key === 'Enter' && !props.disabled && !props.readonly) {
      event.preventDefault()
      emit('submit', inputValue.value)
    }
  }

  defineExpose({ inputPasswordRef })
</script>

<template>
  <InputSlot>
    <Label
      v-if="props.label"
      :for="props.name"
      :data-testid="customTestId.label"
      :label="props.label"
      :isRequired="attrs.required"
    />
    <Password
      toggleMask
      ref="inputPasswordRef"
      v-model="inputValue"
      :id="name"
      :name="name"
      :readonly="readonly"
      :disabled="disabled"
      :placeholder="props.placeholder"
      :class="[{ 'p-invalid': hasError }, props.class]"
      :aria-invalid="hasError"
      :aria-describedby="`${name}-error ${name}-description`"
      :promptLabel="props.promptLabel"
      :weakLabel="props.weakLabel"
      :mediumLabel="props.mediumLabel"
      :strongLabel="props.strongLabel"
      :strongRegex="props.strongRegex"
      :pt="{ meter: 'rounded-md', meterLabel: 'text-sm' }"
      :data-testid="customTestId.input"
      autocomplete="off"
      @input="onChange"
      @blur="onBlur"
      @focus="onFocus"
      @keydown="onKeydown"
    >
      <template #header> </template>
      <template #footer v-if="props.requirements.length">
        <div class="mt-4 text-sm space-y-4">
          <Divider />
          <p class="font-medium">{{ props.requirementsLabel }}</p>
        </div>
        <div class="text-sm p-4 py-0 mt-2">
          <ul
            :aria-label="props.requirementsLabel"
            class="list-square font-normal space-y-2 text-color-secondary"
          >
            <li v-for="(requirement, index) in props.requirements" :key="requirement.text || index">
              <span>{{ requirement.text }}</span>
            </li>
          </ul>
        </div>
      </template>
    </Password>
    <small
      v-if="hasError"
      :id="`${name}-error`"
      role="alert"
      aria-live="assertive"
      class="p-error text-xs font-normal leading-tight"
      :data-testid="customTestId.error"
    >
      {{ additionalError || veeValidateErrorMessage }}
    </small>
    <small
      v-if="props.description || hasDescriptionSlot"
      :id="`${name}-description`"
      class="text-xs text-color-secondary font-normal leading-5"
      :data-testid="customTestId.description"
    >
      <slot name="description">
        {{ props.description }}
      </slot>
    </small>
  </InputSlot>
</template>

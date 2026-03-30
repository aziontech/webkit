<script setup>
  import { computed, ref, toRef, useAttrs, useSlots, watch } from 'vue'
  import { useField } from 'vee-validate'
  import Password from 'primevue/password'
  import Divider from 'primevue/divider'
  import Label from '../label'
  import InputSlot from '../slots/input-slot'

  const emit = defineEmits(['blur', 'input', 'submit', 'focus', 'strength'])
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
    sensitive: {
      type: Boolean,
      default: false
    },
    additionalError: {
      type: String,
      default: ''
    },
    showStrength: {
      type: Boolean,
      default: false
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
        { text: '1 special character (example: !?<>@#$%)' }
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
    const id = attrs['data-testid'] || 'field-password'

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

  const strengthRules = [
    { key: 'minLength', regex: /.{8,}/, text: '8 characters' },
    { key: 'uppercase', regex: /[A-Z]/, text: '1 uppercase letter' },
    { key: 'lowercase', regex: /[a-z]/, text: '1 lowercase letter' },
    { key: 'number', regex: /[0-9]/, text: '1 number' },
    { key: 'specialChar', regex: /[-_!@#$%^&*(),.?":{}|<>]/, text: '1 special character' }
  ]

  const evaluateStrength = (password) => {
    const value = password || ''

    const minLength = strengthRules[0].regex.test(value)
    const uppercase = strengthRules[1].regex.test(value)
    const lowercase = strengthRules[2].regex.test(value)
    const number = strengthRules[3].regex.test(value)
    const specialChar = strengthRules[4].regex.test(value)

    const allValid = minLength && uppercase && lowercase && number && specialChar
    const passedCount = [minLength, uppercase, lowercase, number, specialChar].filter(Boolean).length

    let level = 'weak'
    if (allValid) {
      level = 'strong'
    } else if (passedCount >= 3) {
      level = 'medium'
    }

    return {
      value,
      level,
      minLength,
      uppercase,
      lowercase,
      number,
      specialChar
    }
  }

  const onBlur = (event) => {
    handleBlur(event)
    emit('blur', event)
  }

  const onChange = (event) => {
    handleChange(event)
    const val = event?.target?.value ?? inputValue.value
    emit('input', val)
    emit('strength', evaluateStrength(val))
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

  watch(inputValue, (val) => {
    emit('strength', evaluateStrength(val))
  })

  defineExpose({ inputPasswordRef })
</script>

<template>
  <InputSlot>
    <Label
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
      :feedback="showStrength"
      :promptLabel="showStrength ? props.promptLabel : undefined"
      :weakLabel="showStrength ? props.weakLabel : undefined"
      :mediumLabel="showStrength ? props.mediumLabel : undefined"
      :strongLabel="showStrength ? props.strongLabel : undefined"
      :strongRegex="showStrength ? props.strongRegex : undefined"
      :pt="showStrength ? { meter: 'rounded-md', meterLabel: 'text-sm' } : undefined"
      :data-testid="customTestId.input"
      autocomplete="off"
      @input="onChange"
      @blur="onBlur"
      @focus="onFocus"
      @keydown="onKeydown"
    >
      <template v-if="showStrength" #header> </template>
      <template v-if="showStrength && props.requirements.length" #footer>
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

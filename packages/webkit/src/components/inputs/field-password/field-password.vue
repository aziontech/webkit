<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import Label from '../label/label.vue'
  import PasswordInput, {
    type PasswordInputAutocomplete
  } from '../password-input/password-input.vue'
  import FieldPasswordRequirements from './field-password-requirements/field-password-requirements.vue'
  import {
    DEFAULT_PASSWORD_REQUIREMENTS,
    type PasswordRequirement as Requirement
  } from './password-requirements'

  defineOptions({
    name: 'FieldPassword',
    inheritAttrs: false
  })

  /**
   * One password rule: its stable key, its label, and the test the field evaluates against
   * the current value. Declared by the co-located rules module and re-exported here, because
   * this is the public entry a consumer types against.
   */
  export type PasswordRequirement = Requirement

  interface Props {
    /** Two-way bound value of the underlying PasswordInput. */
    modelValue?: string
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the PasswordInput. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Native maxlength forwarded to the PasswordInput. */
    maxLength?: number
    /** Disables the input; a supplied helperText switches to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the input read-only; value is visible but not editable. Native pass-through. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets native required + aria-required on the input. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid border/ring tokens on the input. */
    invalid?: boolean
    /** Forwards to PasswordInput. Renders the visibility toggle on the trailing edge when true. */
    toggleable?: boolean
    /** Forwarded to PasswordInput for password-manager hints. */
    autocomplete?: PasswordInputAutocomplete
    /** id for the native input; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
    /** HTML name for the underlying input (form + vee-validate integration). */
    name?: string
    /** Enables the requirements row: true uses the built-in rule set, an array replaces it. */
    requirements?: boolean | PasswordRequirement[]
    /** Caption that opens the requirements row and names the group for assistive tech. */
    requirementsTitle?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    helperText: '',
    maxLength: undefined,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    toggleable: true,
    autocomplete: 'current-password',
    inputId: '',
    name: '',
    requirements: false,
    requirementsTitle: 'Must contain:'
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
  }>()

  defineSlots<{
    iconLeft(): unknown
    iconRight(): unknown
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-password'
  )

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)
  const requirementsTitleId = computed(() => `${resolvedInputId.value}-requirements-title`)

  const resolvedRequirements = computed<PasswordRequirement[]>(() => {
    if (props.requirements === true) return DEFAULT_PASSWORD_REQUIREMENTS
    if (props.requirements === false) return []
    return props.requirements
  })

  const hasRequirements = computed(() => resolvedRequirements.value.length > 0)

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    :data-has-requirements="hasRequirements || null"
    class="flex flex-col gap-(--spacing-xs) w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <PasswordInput
      :model-value="modelValue"
      :placeholder="placeholder"
      :max-length="maxLength"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :toggleable="toggleable"
      :autocomplete="autocomplete"
      :id="resolvedInputId"
      :name="name"
      :aria-describedby="describedBy"
      :data-testid="`${testId}__input`"
      @update:model-value="(value) => emit('update:modelValue', value)"
    >
      <template
        v-if="$slots['iconLeft']"
        #iconLeft
      >
        <slot name="iconLeft" />
      </template>
      <template
        v-if="$slots['iconRight']"
        #iconRight
      >
        <slot name="iconRight" />
      </template>
    </PasswordInput>
    <HelperText
      v-if="helperText"
      :id="helperId"
      :label="helperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
    <FieldPasswordRequirements
      v-if="hasRequirements"
      :requirements="resolvedRequirements"
      :title="requirementsTitle"
      :value="modelValue"
      :title-id="requirementsTitleId"
      :data-testid="`${testId}__requirements`"
    />
  </div>
</template>

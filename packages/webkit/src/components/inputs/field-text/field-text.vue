<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputText from '../input-text/input-text.vue'
  import Label from '../label/label.vue'

  defineOptions({
    name: 'FieldText',
    inheritAttrs: false
  })

  type FieldTextSize = 'small' | 'medium' | 'large'

  interface Props {
    /** Two-way bound value of the underlying InputText. */
    modelValue?: string
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the InputText. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Size forwarded to the InputText. Heights: small=28px, medium=32px, large=40px. */
    size?: FieldTextSize
    /** Disables the input and switches the helper to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the input read-only; value is visible but not editable. Native pass-through. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets native required + aria-required on the input. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid border/ring tokens on the input. */
    invalid?: boolean
    /** id for the native input; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string | null
    /** HTML name for the underlying input (form + vee-validate integration). */
    name?: string | null
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: '',
    placeholder: '',
    helperText: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: null,
    name: null
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

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-text')

  const resolvedInputId = computed(() => props.inputId ?? generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const effectiveHelperText = computed(() => {
    if (props.helperText) return props.helperText
    if (props.disabled) return 'This field is locked.'
    return ''
  })

  const describedBy = computed(() => (effectiveHelperText.value ? helperId.value : undefined))
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    class="flex flex-col gap-[var(--spacing-xs)] w-full"
  >
    <Label
      v-if="label"
      :value="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <InputText
      :model-value="modelValue"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
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
    </InputText>
    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :value="effectiveHelperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs, useId, watch } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import Input from '../input/input.vue'
  import Label from '../label/label.vue'
  import {
    caretAfterDigits,
    digitsBeforeCaret,
    isTimeComplete,
    isTimeInRange,
    maskTime
  } from './time-mask'

  defineOptions({
    name: 'FieldTime',
    inheritAttrs: false
  })

  /** Time format, always 24-hour. */
  export type FieldTimeFormat = 'hh:mm' | 'hh:mm:ss'
  /** Size token; heights match the sibling field primitives. */
  export type FieldTimeSize = 'small' | 'medium' | 'large'

  interface Props {
    /**
     * Time format, always 24-hour. hh:mm accepts hours and minutes (5 characters). hh:mm:ss adds
     * seconds (8 characters). Drives the mask, the input maxlength, the placeholder fallback, and
     * the format hint.
     */
    format?: FieldTimeFormat
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /**
     * Placeholder forwarded to the Input. When empty, it falls back to the format in upper
     * case: HH:MM for hh:mm, HH:MM:SS for hh:mm:ss.
     */
    placeholder?: string
    /**
     * Text rendered inside HelperText. When empty, the helper row shows the format hint instead,
     * so the row is always present. A non-empty value replaces the hint.
     */
    helperText?: string
    /** Size forwarded to the Input. Heights: small=28px, medium=32px, large=40px. */
    size?: FieldTimeSize
    /** Disables the input and switches the helper to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the input read-only: the value is visible, focusable, and copyable, but not editable. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets native required and aria-required on the input. */
    required?: boolean
    /**
     * Forces the invalid state. The field also turns invalid on its own when the time is out of
     * range or left incomplete.
     */
    invalid?: boolean
    /** id for the native input; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
    /** HTML name for the underlying input (form and vee-validate integration). */
    name?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    format: 'hh:mm',
    label: '',
    placeholder: '',
    helperText: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    name: ''
  })

  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const generatedId = useId()

  const blurredIncomplete = ref(false)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-time')

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)

  const segments = computed(() => props.format.split(':').length)
  const maxLength = computed(() => props.format.length)
  const formatLabel = computed(() => props.format.toUpperCase())
  const effectivePlaceholder = computed(() => props.placeholder || formatLabel.value)
  const helperLabel = computed(() => props.helperText || `24-hour, ${formatLabel.value}`)

  const displayValue = computed(() => maskTime(model.value, segments.value))
  const complete = computed(() => isTimeComplete(displayValue.value, segments.value))
  const valid = computed(() => complete.value && isTimeInRange(displayValue.value))

  const formatError = computed(() => {
    if (!displayValue.value) return false
    if (complete.value) return !valid.value
    return blurredIncomplete.value
  })

  const effectiveInvalid = computed(() => props.invalid || formatError.value)

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (effectiveInvalid.value) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  watch(displayValue, (value) => {
    if (!value || valid.value) blurredIncomplete.value = false
  })

  const onInput = (event: globalThis.Event) => {
    const target = event.target as globalThis.HTMLInputElement
    const raw = target.value
    const masked = maskTime(raw, segments.value)
    if (masked !== raw) {
      const digits = digitsBeforeCaret(raw, target.selectionStart ?? raw.length, segments.value)
      target.value = masked
      if (target.ownerDocument.activeElement === target) {
        const caret = caretAfterDigits(masked, digits)
        target.setSelectionRange(caret, caret)
      }
    }
    model.value = masked
  }

  const onBlur = () => {
    if (props.disabled || props.readonly) return
    blurredIncomplete.value = Boolean(displayValue.value) && !complete.value
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-format="format"
    :data-disabled="disabled || null"
    :data-readonly="readonly || null"
    :data-required="required || null"
    :data-invalid="effectiveInvalid || null"
    class="flex flex-col gap-(--spacing-xs) w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <Input
      :model-value="displayValue"
      :placeholder="effectivePlaceholder"
      type="text"
      inputmode="numeric"
      :max-length="maxLength"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="effectiveInvalid"
      :id="resolvedInputId"
      :name="name"
      :aria-describedby="helperId"
      :data-testid="`${testId}__input`"
      @input="onInput"
      @blur="onBlur"
    >
      <template #iconLeft>
        <i
          class="pi pi-clock"
          :data-testid="`${testId}__icon`"
        />
      </template>
    </Input>
    <HelperText
      :id="helperId"
      :label="helperLabel"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>

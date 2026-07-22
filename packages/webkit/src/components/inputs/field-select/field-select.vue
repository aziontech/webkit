<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import Label from '../label/label.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectOption from '../select/select-option/select-option.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import Select from '../select/select.vue'

  defineOptions({
    name: 'FieldSelect',
    inheritAttrs: false
  })

  export type FieldSelectSize = 'small' | 'medium' | 'large'
  export type FieldSelectValue = string | number | unknown[] | undefined
  export interface FieldSelectOption {
    /** Stable value that identifies this option in the selection. */
    value: unknown
    /** Human-readable label rendered inside the option. */
    label: string
    /** Disables this individual option. */
    disabled?: boolean
  }

  interface Props {
    /** Two-way bound selection. Scalar in single mode; array in multi mode. */
    modelValue?: FieldSelectValue
    /** Options rendered inside the dropdown. When empty, no options render. */
    options?: FieldSelectOption[]
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder shown on the trigger when nothing is selected. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Size forwarded to the Select trigger. Heights: small=28px, medium=32px, large=40px. */
    size?: FieldSelectSize
    /** Switches the component to multi-select; modelValue becomes an array. */
    multiple?: boolean
    /** Disables the select and switches the helper to kind=disabled (lock icon). */
    disabled?: boolean
    /** Marks the select read-only; value is visible but the dropdown is locked. */
    readonly?: boolean
    /** Adds the Required tag to the Label and sets aria-required on the trigger. */
    required?: boolean
    /** Switches the helper to kind=invalid and applies invalid border/ring tokens. */
    invalid?: boolean
    /** id for the trigger; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: undefined,
    options: () => [],
    label: '',
    placeholder: '',
    helperText: '',
    size: 'medium',
    multiple: false,
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: FieldSelectValue]
  }>()

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-field-select')

  const resolvedInputId = computed(() => props.inputId || generatedId)
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
    :data-readonly="readonly || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    class="flex flex-col gap-[var(--spacing-xs)] w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <Select
      :model-value="modelValue"
      :multiple="multiple"
      :placeholder="placeholder"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :required="required"
      :invalid="invalid"
      :data-testid="`${testId}__select`"
      @update:model-value="(value) => emit('update:modelValue', value as FieldSelectValue)"
    >
      <SelectTrigger
        :id="resolvedInputId"
        :aria-describedby="describedBy"
        :data-testid="`${testId}__trigger`"
      />
      <SelectContent :data-testid="`${testId}__content`">
        <slot>
          <SelectOption
            v-for="option in options"
            :key="String(option.value)"
            :value="option.value"
            :disabled="option.disabled"
            :data-testid="`${testId}__option`"
          >
            {{ option.label }}
          </SelectOption>
        </slot>
      </SelectContent>
    </Select>
    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :label="effectiveHelperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>

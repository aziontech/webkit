<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputGroup from '../input-group/input-group.vue'
  import Label from '../label/label.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectOption from '../select/select-option/select-option.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import { applyMask, type Country, defaultCountries, maxDigits, stripToDigits } from './countries'

  defineOptions({
    name: 'FieldPhoneNumber',
    inheritAttrs: false
  })

  interface Props {
    /** Two-way bound national number as digits only (no dial code, no mask characters). */
    modelValue?: string
    /** Two-way bound ISO 3166-1 alpha-2 code of the selected country. */
    country?: string
    /** Countries offered by the dial-code Select. When omitted, uses the built-in curated list. */
    countries?: Country[]
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the internal input. Falls back to the selected country's mask when empty. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Disables both the dial-code Select and the internal input; switches helper to kind=disabled. */
    disabled?: boolean
    /** Marks the internal input read-only; dial-code Select is also disabled while readonly. */
    readonly?: boolean
    /** Adds the Required tag to Label and propagates required to InputGroup and input. */
    required?: boolean
    /** Applies invalid border on InputGroup and switches helper to kind=invalid. */
    invalid?: boolean
    /** id for the internal input; consumed by Label via for and by aria-describedby wiring. */
    inputId?: string
    /** HTML name for the internal input (form + vee-validate integration). */
    name?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    country: 'BR',
    countries: () => defaultCountries,
    label: '',
    placeholder: '',
    helperText: '',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    name: ''
  })

  const emit = defineEmits<{
    'update:modelValue': [value: string]
    'update:country': [code: string]
  }>()

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-phone-number'
  )

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)

  const selectedCountry = computed<Country>(
    () => props.countries.find((c) => c.code === props.country) ?? props.countries[0]
  )

  const displayValue = computed(() => applyMask(props.modelValue, selectedCountry.value.mask))

  const effectivePlaceholder = computed(() => props.placeholder || selectedCountry.value.mask)

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

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const digits = stripToDigits(target.value).slice(0, maxDigits(selectedCountry.value.mask))
    const formatted = applyMask(digits, selectedCountry.value.mask)
    if (target.value !== formatted) {
      target.value = formatted
    }
    emit('update:modelValue', digits)
  }

  const onCountryChange = (value: unknown) => {
    const code = typeof value === 'string' ? value : props.country
    emit('update:country', code)
    const next = props.countries.find((c) => c.code === code) ?? selectedCountry.value
    const digits = props.modelValue.slice(0, maxDigits(next.mask))
    emit('update:modelValue', digits)
  }
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
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
    <InputGroup
      :invalid="invalid"
      :required="required"
      :disabled="disabled"
      :data-testid="`${testId}__group`"
    >
      <Select
        :model-value="country"
        :disabled="disabled || readonly"
        :data-testid="`${testId}__country`"
        aria-label="Country dial code"
        @update:model-value="onCountryChange"
      >
        <SelectTrigger>{{ selectedCountry.dialCode }}</SelectTrigger>
        <SelectContent>
          <SelectOption
            v-for="c in countries"
            :key="c.code"
            :value="c.code"
          >
            {{ c.dialCode }} {{ c.label }}
          </SelectOption>
        </SelectContent>
      </Select>
      <input
        :id="resolvedInputId"
        :name="name"
        type="tel"
        inputmode="tel"
        autocomplete="tel-national"
        :value="displayValue"
        :placeholder="effectivePlaceholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :aria-invalid="invalid || undefined"
        :aria-required="required || undefined"
        :aria-describedby="describedBy"
        class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-[var(--spacing-md)] text-label-sm text-[var(--text-default)] placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
        @input="onInput"
      />
    </InputGroup>
    <HelperText
      v-if="effectiveHelperText"
      :id="helperId"
      :value="effectiveHelperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, useAttrs, useId, watch } from 'vue'

  import { useSelectSearch } from '../../../composables/use-select-search'
  import HelperText, { type HelperTextKind } from '../helper-text/helper-text.vue'
  import InputGroup from '../input-group/input-group.vue'
  import InputText from '../input-text/input-text.vue'
  import Label from '../label/label.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectOption from '../select/select-option/select-option.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import {
    type Country,
    defaultCountries,
    formatNational,
    isComplete,
    maxDigits,
    placeholderFor,
    stripToDigits
  } from './countries'

  defineOptions({
    name: 'FieldPhoneNumber',
    inheritAttrs: false
  })

  /** Size token; heights match the sibling field primitives. */
  export type FieldPhoneNumberSize = 'small' | 'medium' | 'large'

  /** Snapshot of the number emitted by update:phone. */
  export interface PhoneNumber {
    /** ISO 3166-1 alpha-2 code of the selected country. */
    country: string
    /** Dial code of the selected country, such as +55. */
    dialCode: string
    /** National number as digits only. */
    digits: string
    /** Full E.164 number (dial code followed by the digits); empty while there are no digits. */
    number: string
    /** True when the digit count is one the selected country allows. */
    complete: boolean
  }

  interface Props {
    /** Countries offered by the dial-code Select. When omitted, uses the built-in curated list. */
    countries?: Country[]
    /** Text rendered inside the Label. When empty, the label row is omitted. */
    label?: string
    /** Placeholder forwarded to the internal input. Falls back to the selected country's mask when empty. */
    placeholder?: string
    /** Auxiliary text rendered inside HelperText. When empty, the helper row is omitted. */
    helperText?: string
    /** Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px. */
    size?: FieldPhoneNumberSize
    /** Disables both the dial-code Select and the internal input; a supplied helperText switches to kind=disabled. */
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
    /** Placeholder of the search box that filters the dial-code list. */
    searchPlaceholder?: string
    /** Shown in the dial-code list when no country matches the search. */
    searchEmptyLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    countries: () => defaultCountries,
    label: '',
    placeholder: '',
    helperText: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    inputId: '',
    name: '',
    searchPlaceholder: 'Search country',
    searchEmptyLabel: 'No country found'
  })

  const emit = defineEmits<{
    'update:phone': [value: PhoneNumber]
  }>()

  const model = defineModel<string>({ default: '' })
  const country = defineModel<string>('country', { default: 'BR' })

  const attrs = useAttrs()
  const generatedId = useId()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'input-field-phone-number'
  )

  const resolvedInputId = computed(() => props.inputId || generatedId)
  const helperId = computed(() => `${resolvedInputId.value}-helper`)
  const triggerId = `${generatedId}-trigger`

  const selectedCountry = computed<Country>(
    () => props.countries.find((c) => c.code === country.value) ?? props.countries[0]
  )

  const displayValue = computed(() => formatNational(selectedCountry.value, model.value))

  const effectivePlaceholder = computed(
    () => props.placeholder || placeholderFor(selectedCountry.value)
  )

  const phone = computed<PhoneNumber>(() => {
    const { code, dialCode } = selectedCountry.value
    const digits = model.value
    return {
      country: code,
      dialCode,
      digits,
      number: digits ? `${dialCode}${digits}` : '',
      complete: isComplete(selectedCountry.value, digits)
    }
  })

  const helperKind = computed<HelperTextKind>(() => {
    if (props.disabled) return 'disabled'
    if (props.invalid) return 'invalid'
    if (props.required) return 'required'
    return 'helper'
  })

  const describedBy = computed(() => (props.helperText ? helperId.value : undefined))

  watch(phone, (value) => emit('update:phone', value), { immediate: true })

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const digits = stripToDigits(target.value).slice(0, maxDigits(selectedCountry.value))
    const formatted = formatNational(selectedCountry.value, digits)
    if (target.value !== formatted) {
      target.value = formatted
    }
    model.value = digits
  }

  const onCountryChange = (value: unknown) => {
    if (typeof value !== 'string') return
    country.value = value
    const next = props.countries.find((c) => c.code === value) ?? selectedCountry.value
    model.value = model.value.slice(0, maxDigits(next))
  }

  const {
    open,
    query,
    filtered,
    activeKey,
    activeIndex,
    searchId,
    optionId,
    setActive,
    onTriggerKeydown,
    onContentKeydown,
    onSearchKeydown
  } = useSelectSearch({
    items: () =>
      props.countries.map((c) => ({
        key: c.code,
        text: c.label,
        keywords: [c.code, c.dialCode, stripToDigits(c.dialCode)]
      })),
    selectedKeys: () => [country.value],
    idPrefix: generatedId,
    triggerId,
    locked: () => props.disabled || props.readonly,
    onPick: onCountryChange,
    onCommit: () => document.getElementById(resolvedInputId.value)?.focus()
  })

  const filteredCountries = computed(() => {
    const keys = new Set(filtered.value.map((item) => item.key))
    return props.countries.filter((c) => keys.has(c.code))
  })
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-size="size"
    :data-disabled="disabled || null"
    :data-invalid="invalid || null"
    :data-required="required || null"
    class="flex flex-col gap-(--spacing-xs) w-full"
  >
    <Label
      v-if="label"
      :label="label"
      :required="required"
      :for="resolvedInputId"
      :data-testid="`${testId}__label`"
    />
    <InputGroup
      :size="size"
      :invalid="invalid"
      :required="required"
      :disabled="disabled"
      :data-testid="`${testId}__group`"
    >
      <Select
        v-model:open="open"
        :model-value="country"
        :size="size"
        :disabled="disabled || readonly"
        :display-value="() => selectedCountry.dialCode"
        :data-testid="`${testId}__country`"
        @update:model-value="onCountryChange"
      >
        <SelectTrigger
          :id="triggerId"
          aria-label="Country dial code"
          @keydown="onTriggerKeydown"
        />
        <SelectContent
          class="min-w-max"
          @keydown="onContentKeydown"
        >
          <template #search>
            <InputText
              :id="searchId"
              v-model="query"
              :placeholder="searchPlaceholder"
              :aria-label="searchPlaceholder || 'Search country'"
              :aria-activedescendant="activeKey ? optionId(activeKey) : undefined"
              autocomplete="off"
              :data-testid="`${testId}__search`"
              @keydown="onSearchKeydown"
            >
              <template #iconLeft>
                <i class="pi pi-search" />
              </template>
            </InputText>
          </template>
          <SelectOption
            v-for="(c, index) in filteredCountries"
            :id="optionId(c.code)"
            :key="c.code"
            :value="c.code"
            :data-active="index === activeIndex || null"
            class="data-[active]:bg-(--bg-hover)"
            @mousemove="setActive(index)"
          >
            {{ c.dialCode }} {{ c.label }}
          </SelectOption>
          <p
            v-if="filteredCountries.length === 0"
            role="status"
            :data-testid="`${testId}__search-empty`"
            class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
          >
            {{ searchEmptyLabel }}
          </p>
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
        class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-(--spacing-md) text-label-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
        @input="onInput"
      />
    </InputGroup>
    <HelperText
      v-if="helperText"
      :id="helperId"
      :label="helperText"
      :kind="helperKind"
      :data-testid="`${testId}__helper`"
    />
  </div>
</template>

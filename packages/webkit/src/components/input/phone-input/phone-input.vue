<script setup lang="ts">
  import { computed, provide, shallowRef, useAttrs, useId, watch } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useSelectSearch } from '../../../composables/use-select-search'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { FieldInjectionKey } from '../field/injection-key'
  import Input from '../input/input.vue'
  import InputGroup from '../input-group/input-group.vue'
  import { FormValue } from '../parts/form-value'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectItem from '../select/select-item/select-item.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import {
    defaultCountries,
    flagStyle,
    formatNational,
    hasFlag,
    isComplete,
    loadFlagSprite,
    maxDigits,
    type PhoneInputCountry,
    placeholderFor,
    stripToDigits
  } from './countries'

  defineOptions({
    name: 'PhoneInput',
    inheritAttrs: false
  })

  /** Size token; heights match the sibling field primitives. */
  export type PhoneInputSize = 'small' | 'medium' | 'large'

  /** Snapshot of the number emitted by phone-change. */
  export interface PhoneInputValue {
    /** ISO 3166-1 alpha-2 code of the selected country. */
    country: string
    /** Dial code of the selected country, such as +1. */
    dialCode: string
    /** National number as digits only. */
    digits: string
    /** Full E.164 number (dial code followed by the digits); empty while there are no digits. */
    number: string
    /** True when the digit count is one the selected country allows. */
    complete: boolean
  }

  export interface PhoneInputProps {
    /** Countries offered by the dial-code Select. When omitted, uses the built-in curated list. */
    countries?: PhoneInputCountry[]
    /** Placeholder forwarded to the internal input. Falls back to the selected country's mask when empty. */
    placeholder?: string
    /** Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px. */
    size?: PhoneInputSize
    /** Disables both the dial-code Select and the internal input. */
    disabled?: boolean
    /** Marks the internal input read-only; dial-code Select is also disabled while readonly. */
    readonly?: boolean
    /** Applies the required border on the InputGroup and sets required on the input. */
    required?: boolean
    /** Applies the invalid border on the InputGroup and sets aria-invalid on the input. */
    invalid?: boolean
    /** Form field name: a hidden input submits the full E.164 number (dial code and digits) under this name; the visible input carries no name. */
    name?: string
    /** Placeholder of the search box that filters the dial-code list. Empty uses the locale catalog (`Search country`). */
    searchPlaceholder?: string
    /** Shown in the dial-code list when no country matches the search. Empty uses the locale catalog (`No country found.`). */
    searchEmptyLabel?: string
  }
  const props = withDefaults(defineProps<PhoneInputProps>(), {
    countries: () => defaultCountries,
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    name: '',
    searchPlaceholder: '',
    searchEmptyLabel: ''
  })

  const emit = defineEmits<{
    'phone-change': [value: PhoneInputValue]
  }>()

  const model = defineModel<string>({ default: '' })
  const country = defineModel<string>('country', { default: 'US' })

  const attrs = useAttrs()
  const { t } = useTranslate({ phoneInput: en.phoneInput })
  const generatedId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'phone-input')

  const {
    controlId,
    describedBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldControl({
    id: () => attrs['id'] as string | undefined,
    describedBy: () => attrs['aria-describedby'] as string | undefined,
    invalid: () => props.invalid,
    disabled: () => props.disabled,
    required: () => props.required
  })

  provide(FieldInjectionKey, null)

  const resolvedInputId = computed(() => controlId.value ?? generatedId)

  const rootAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['id']
    delete rest['aria-describedby']
    delete rest['data-testid']
    return rest
  })
  const triggerId = `${generatedId}-trigger`

  const selectedCountry = computed<PhoneInputCountry>(
    () => props.countries.find((c) => c.code === country.value) ?? props.countries[0]
  )

  const displayValue = computed(() => formatNational(selectedCountry.value, model.value))

  const effectivePlaceholder = computed(
    () => props.placeholder || placeholderFor(selectedCountry.value)
  )

  const phone = computed<PhoneInputValue>(() => {
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

  watch(phone, (value) => emit('phone-change', value), { immediate: true })

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
    setOpen,
    setQuery,
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
    locked: () => isDisabled.value || props.readonly,
    onPick: onCountryChange,
    onCommit: () => document.getElementById(resolvedInputId.value)?.focus()
  })

  const flagSprite = shallowRef('')
  watch(open, (isOpen) => {
    if (isOpen && !flagSprite.value) {
      loadFlagSprite().then((url) => {
        flagSprite.value = url
      })
    }
  })

  const filteredCountries = computed(() => {
    const keys = new Set(filtered.value.map((item) => item.key))
    return props.countries.filter((c) => keys.has(c.code))
  })
</script>

<template>
  <InputGroup
    v-bind="rootAttrs"
    :size="size"
    :invalid="isInvalid"
    :required="isRequired"
    :disabled="isDisabled"
    :data-testid="testId"
  >
    <Select
      :open="open"
      @update:open="setOpen"
      :model-value="country"
      :size="size"
      :disabled="isDisabled || readonly"
      :display-value="() => selectedCountry.dialCode"
      :data-testid="`${testId}__country`"
      @update:model-value="onCountryChange"
    >
      <SelectTrigger
        :id="triggerId"
        :aria-label="t('phoneInput.dialCode')"
        value-dir="ltr"
        @keydown="onTriggerKeydown"
      />
      <SelectContent
        class="min-w-max"
        @keydown="onContentKeydown"
      >
        <template #search>
          <Input
            :id="searchId"
            :model-value="query"
            @update:model-value="setQuery"
            :placeholder="searchPlaceholder || t('phoneInput.search')"
            :aria-label="searchPlaceholder || t('phoneInput.search')"
            :aria-activedescendant="activeKey ? optionId(activeKey) : undefined"
            autocomplete="off"
            :data-testid="`${testId}__search`"
            @keydown="onSearchKeydown"
          >
            <template #leading>
              <i class="az az-search" />
            </template>
          </Input>
        </template>
        <SelectItem
          v-for="(c, index) in filteredCountries"
          :id="optionId(c.code)"
          :key="c.code"
          :value="c.code"
          :data-active="index === activeIndex || null"
          class="data-[active]:bg-(--bg-hover)"
          @mousemove="setActive(index)"
        >
          <template #leading>
            <i
              v-if="hasFlag(c.code)"
              :style="flagStyle(c.code, flagSprite)"
              class="block w-4 aspect-[22/15] bg-no-repeat"
              aria-hidden="true"
              :data-country="c.code"
              :data-testid="`${testId}__flag`"
            />
          </template>
          {{ c.label }}
          <template #tag>
            <span
              dir="ltr"
              :data-testid="`${testId}__dial-code`"
              class="shrink-0 text-label-code-sm text-(--text-muted)"
            >
              {{ c.dialCode }}
            </span>
          </template>
        </SelectItem>
        <p
          v-if="filteredCountries.length === 0"
          role="status"
          :data-testid="`${testId}__search-empty`"
          class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
        >
          {{ searchEmptyLabel || t('phoneInput.noMatch') }}
        </p>
      </SelectContent>
      <FormValue
        :name="name"
        :value="phone.number"
        :disabled="isDisabled"
      />
    </Select>
    <input
      :id="resolvedInputId"
      type="tel"
      dir="ltr"
      inputmode="tel"
      autocomplete="tel-national"
      :value="displayValue"
      :placeholder="effectivePlaceholder"
      :disabled="isDisabled"
      :readonly="readonly"
      :required="isRequired"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="describedBy"
      :data-testid="`${testId}__input`"
      class="w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-(--spacing-md) rtl:text-end text-label-sm text-(--text-default) placeholder:text-(--text-muted) disabled:cursor-not-allowed disabled:text-(--text-disabled)"
      @input="onInput"
    />
  </InputGroup>
</template>

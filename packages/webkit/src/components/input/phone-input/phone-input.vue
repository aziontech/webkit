<script setup lang="ts">
  import { computed, onMounted, provide, shallowRef, useAttrs, useId, watch } from 'vue'

  import { useAnnouncer } from '../../../composables/use-announcer'
  import { useFieldAttrs } from '../../../composables/use-field-attrs'
  import { useSelectSearch } from '../../../composables/use-select-search'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { flagStyle, hasFlag, loadFlagSprite } from '../../../utils/country-flags'
  import { FieldInjectionKey } from '../field/injection-key'
  import Input from '../input/input.vue'
  import InputGroup from '../input-group/input-group.vue'
  import { FormValue } from '../parts/form-value'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectItem from '../select/select-item/select-item.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'
  import { type PhoneInputValue, usePhoneInputValue } from './composables/use-phone-input-value'
  import { defaultCountries, type PhoneInputCountry } from './lib/country-data'
  import { placeholderFor, stripToDigits } from './lib/phone-mask'

  export type { PhoneInputValue } from './composables/use-phone-input-value'
  export type { PhoneInputCountry } from './lib/country-data'

  defineOptions({
    name: 'PhoneInput',
    inheritAttrs: false
  })

  /** Size token; heights match the sibling field primitives. */
  export type PhoneInputSize = 'small' | 'medium' | 'large'

  export interface PhoneInputProps {
    /** Countries offered by the dial-code Select. When omitted, uses the built-in curated list. */
    countries?: PhoneInputCountry[]
    /** ISO 3166-1 alpha-2 code of the country selected at first, while v-model:country is empty. A code missing from countries falls back to the first country of the list. */
    defaultCountry?: string
    /** Placeholder forwarded to the internal input. Falls back to the selected country's mask when empty. */
    placeholder?: string
    /** Size forwarded to the InputGroup and the dial-code Select trigger. Heights: small=28px, medium=32px, large=40px. */
    size?: PhoneInputSize
    /** Disables both the dial-code Select and the internal input. */
    disabled?: boolean
    /** Marks the internal input read-only; dial-code Select is also disabled while readonly. */
    readonly?: boolean
    /** Sets required and aria-required on the phone number input; it draws no border of its own. */
    required?: boolean
    /** Applies the invalid border on the InputGroup and sets aria-invalid on the input. */
    invalid?: boolean
    /** Form field name: a hidden input submits the full E.164 number (dial code and digits) under this name; the visible input carries no name. */
    name?: string
    /** Placeholder of the search box that filters the dial-code list. Empty uses the locale catalog (`Search country`). */
    searchPlaceholder?: string
    /** Shown in the dial-code list, and announced, when no country matches the search. Empty uses the locale catalog (`No country found.`). */
    noMatch?: string
  }
  const props = withDefaults(defineProps<PhoneInputProps>(), {
    countries: () => defaultCountries,
    defaultCountry: 'US',
    placeholder: '',
    size: 'medium',
    disabled: false,
    readonly: false,
    required: false,
    invalid: false,
    name: '',
    searchPlaceholder: '',
    noMatch: ''
  })

  const emit = defineEmits<{
    'phone-change': [value: PhoneInputValue]
  }>()

  const model = defineModel<string>({ default: '' })
  const country = defineModel<string>('country', { default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ phoneInput: en.phoneInput })
  const { announce } = useAnnouncer()
  const generatedId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'phone-input')

  const {
    controlId,
    describedBy,
    invalid: isInvalid,
    disabled: isDisabled,
    required: isRequired
  } = useFieldAttrs(props)

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

  const { selectedCountry, displayValue, phone, typeDigits, pickCountry } = usePhoneInputValue({
    countries: () => props.countries,
    defaultCountry: () => props.defaultCountry,
    digits: model,
    country
  })

  const effectivePlaceholder = computed(
    () => props.placeholder || placeholderFor(selectedCountry.value)
  )

  watch(phone, (value) => emit('phone-change', value), { immediate: true })

  const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    const formatted = typeDigits(target.value)
    if (target.value !== formatted) target.value = formatted
  }

  const onCountryChange = (value: unknown) => {
    if (typeof value === 'string') pickCountry(value)
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
    selectedKeys: () => [selectedCountry.value.code],
    idPrefix: generatedId,
    triggerId,
    locked: () => isDisabled.value || props.readonly,
    onPick: onCountryChange,
    onCommit: () => document.getElementById(resolvedInputId.value)?.focus()
  })

  const INPUT_CLASS =
    'w-full h-full bg-transparent border-0 outline-none focus:ring-0 px-(--spacing-md) rtl:text-end ' +
    'text-label-sm text-(--text-default) placeholder:text-(--text-muted) ' +
    'disabled:cursor-not-allowed disabled:text-(--text-disabled)'

  const flagSprite = shallowRef('')
  onMounted(() => {
    loadFlagSprite().then((url) => {
      flagSprite.value = url
    })
  })

  const filteredCountries = computed(() => {
    const keys = new Set(filtered.value.map((item) => item.key))
    return props.countries.filter((c) => keys.has(c.code))
  })

  watch(
    () => [open.value, query.value, filteredCountries.value.length] as const,
    ([isOpen, text, count]) => {
      if (!isOpen || !text) return
      announce(
        count ? t('phoneInput.results', { count }) : props.noMatch || t('phoneInput.noMatch')
      )
    }
  )
</script>

<template>
  <InputGroup
    v-bind="rootAttrs"
    :size="size"
    :invalid="isInvalid"
    :required="isRequired"
    :disabled="isDisabled"
    :data-testid="testId"
    class="@container/phone-input"
  >
    <Select
      :open="open"
      @update:open="setOpen"
      :model-value="selectedCountry.code"
      :size="size"
      :disabled="isDisabled || readonly"
      :display-value="() => selectedCountry.label"
      :data-testid="`${testId}__country`"
      class="w-auto! min-w-0 max-w-[60%] shrink-0"
      @update:model-value="onCountryChange"
    >
      <SelectTrigger
        :id="triggerId"
        :aria-label="t('phoneInput.dialCode')"
        class="@max-[21rem]/phone-input:**:data-[slot=value]:hidden"
        @keydown="onTriggerKeydown"
      >
        <template #leading>
          <i
            v-if="hasFlag(selectedCountry.code)"
            data-slot="flag"
            :style="flagStyle(selectedCountry.code, flagSprite)"
            class="block w-4 shrink-0 aspect-[22/15] bg-no-repeat"
            aria-hidden="true"
            :data-country="selectedCountry.code"
            :data-testid="`${testId}__selected-flag`"
          />
        </template>
        <template #trailing>
          <span
            dir="ltr"
            data-slot="dial-code"
            :data-testid="`${testId}__selected-dial-code`"
            class="shrink-0 text-label-code-sm text-(--text-muted) group-data-[disabled]:text-(--text-disabled)"
          >
            {{ selectedCountry.dialCode }}
          </span>
        </template>
      </SelectTrigger>
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
          data-slot="no-match"
          :data-testid="`${testId}__search-empty`"
          class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
        >
          {{ noMatch || t('phoneInput.noMatch') }}
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
      data-slot="input"
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
      class="pointer-coarse:text-body-md"
      :class="INPUT_CLASS"
      @input="onInput"
    />
  </InputGroup>
</template>

<script setup lang="ts">
  import { computed, onMounted, shallowRef, useAttrs, useId } from 'vue'

  import { useFieldControl } from '../../../composables/use-field-control'
  import { useSelectSearch } from '../../../composables/use-select-search'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { flagStyle, hasFlag, loadFlagSprite } from '../../../utils/country-flags'
  import Input from '../input/input.vue'
  import Select from '../select/select.vue'
  import SelectContent from '../select/select-content/select-content.vue'
  import SelectItem from '../select/select-item/select-item.vue'
  import SelectTrigger from '../select/select-trigger/select-trigger.vue'

  defineOptions({
    name: 'LanguageSelect',
    inheritAttrs: false
  })

  /** Size token forwarded to the Select trigger. */
  export type LanguageSelectSize = 'small' | 'medium' | 'large'

  /** Trigger look: the full field, or the compact switcher for a header or a toolbar. */
  export type LanguageSelectVariant = 'outline' | 'ghost'

  /** One language offered by the picker. */
  export interface LanguageSelectOption {
    /** BCP 47 tag of the language, such as pt-BR. */
    value: string
    /** The language named in itself, such as Português (Brasil); named from the tag in its own language when omitted. */
    label?: string
    /** ISO 3166-1 alpha-2 code of the flag; taken from the tag's region, else its likely region, when omitted. */
    country?: string
  }

  export interface LanguageSelectProps {
    /** Languages offered, in order: value is a BCP 47 tag, label the language named in itself (derived from the tag when omitted), and country the ISO 3166-1 alpha-2 code of the flag (taken from the tag's region, else its likely region, when omitted). */
    options?: LanguageSelectOption[]
    /** Trigger look: outline is the full field (round flag and name) for forms and settings; ghost is the compact switcher (round flag and short code, no border until hover) for a header, a toolbar or a footer. */
    variant?: LanguageSelectVariant
    /** Trigger text while no language is picked. Empty uses the locale catalog (`Language`). */
    placeholder?: string
    /** Size token forwarded to the Select trigger. Heights: small=28px, medium=32px, large=40px. */
    size?: LanguageSelectSize
    /** Disables the trigger and keeps the list closed. */
    disabled?: boolean
    /** Accessible name of the trigger when no Field labels it. Empty uses the locale catalog (`Language`). */
    ariaLabel?: string
    /** Placeholder and accessible name of the search box. Empty uses the locale catalog (`Search language`). */
    searchPlaceholder?: string
    /** Shown in the list when no language matches the search. Empty uses the locale catalog (`No language found.`). */
    emptyTitle?: string
  }
  const props = withDefaults(defineProps<LanguageSelectProps>(), {
    options: () => [
      { value: 'en-US', label: 'English (United States)' },
      { value: 'pt-BR', label: 'Português (Brasil)' },
      { value: 'es-ES', label: 'Español (España)' }
    ],
    variant: 'outline',
    placeholder: '',
    size: 'medium',
    disabled: false,
    ariaLabel: '',
    searchPlaceholder: '',
    emptyTitle: ''
  })

  /** BCP 47 tag of the picked language. Empty shows the placeholder. */
  const model = defineModel<string>({ default: '' })

  const attrs = useAttrs()
  const { t, locale } = useTranslate({ languageSelect: en.languageSelect })
  const generatedId = useId()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'language-select')

  const { field, controlId } = useFieldControl({
    id: () => attrs['id'] as string | undefined
  })

  const triggerId = computed(() => controlId.value ?? `${generatedId}-trigger`)

  const rootAttrs = computed(() => {
    const rest: Record<string, unknown> = { ...attrs }
    delete rest['id']
    delete rest['data-testid']
    return rest
  })

  const triggerLabel = computed(
    () => props.ariaLabel || (field ? undefined : t('languageSelect.label'))
  )

  const countryOf = (option: LanguageSelectOption): string => {
    if (option.country) return option.country.toUpperCase()
    try {
      const region = new Intl.Locale(option.value).maximize().region ?? ''
      return /^[A-Za-z]{2}$/.test(region) ? region.toUpperCase() : ''
    } catch {
      return ''
    }
  }

  const labelOf = (option: LanguageSelectOption): string => {
    if (option.label) return option.label
    try {
      const name = new Intl.DisplayNames([option.value], {
        type: 'language',
        languageDisplay: 'standard'
      }).of(option.value)
      return name ? name.charAt(0).toLocaleUpperCase(option.value) + name.slice(1) : option.value
    } catch {
      return option.value
    }
  }

  const selectedOption = computed(() => props.options.find((o) => o.value === model.value))

  const selectedCountry = computed(() =>
    selectedOption.value ? countryOf(selectedOption.value) : ''
  )

  const shortCode = computed(() => {
    const option = selectedOption.value
    if (!option) return ''
    const country = selectedCountry.value
    if (!country) return option.value.split(/[-_]/)[0]?.toUpperCase() ?? ''
    const shared = props.options.some((o) => o.value !== option.value && countryOf(o) === country)
    return shared ? option.value.toUpperCase() : country
  })

  const namers = (type: 'language' | 'region') =>
    [...new Set(['en', locale.value])].flatMap((tag) => {
      try {
        return [new Intl.DisplayNames([tag], { type })]
      } catch {
        return []
      }
    })

  const languageNamers = computed(() => namers('language'))
  const regionNamers = computed(() => namers('region'))

  const namesOf = (namerList: Intl.DisplayNames[], code: string): string[] =>
    code
      ? namerList.flatMap((namer) => {
          try {
            const name = namer.of(code)
            return name && name !== code ? [name] : []
          } catch {
            return []
          }
        })
      : []

  const onPick = (value: unknown) => {
    if (typeof value !== 'string') return
    model.value = value
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
      props.options.map((o) => {
        const country = countryOf(o)
        return {
          key: o.value,
          text: labelOf(o),
          keywords: [
            o.value,
            country,
            ...namesOf(languageNamers.value, o.value),
            ...namesOf(regionNamers.value, country)
          ]
        }
      }),
    selectedKeys: () => (model.value ? [model.value] : []),
    idPrefix: generatedId,
    triggerId,
    locked: () => props.disabled || Boolean(field?.disabled.value),
    onPick
  })

  const flagSprite = shallowRef('')
  onMounted(() => {
    loadFlagSprite().then((url) => {
      flagSprite.value = url
    })
  })

  const filteredOptions = computed(() => {
    const keys = new Set(filtered.value.map((item) => item.key))
    return props.options.filter((o) => keys.has(o.value))
  })
</script>

<template>
  <Select
    v-bind="rootAttrs"
    :open="open"
    @update:open="setOpen"
    :model-value="model"
    :size="size"
    :variant="variant"
    :disabled="disabled"
    :placeholder="placeholder || t('languageSelect.label')"
    :display-value="() => (selectedOption ? labelOf(selectedOption) : model)"
    :data-testid="testId"
    @update:model-value="onPick"
  >
    <SelectTrigger
      :id="triggerId"
      :aria-label="triggerLabel"
      :data-testid="`${testId}__trigger`"
      class="pointer-coarse:min-h-11 data-[variant=ghost]:[&>[data-slot=value]]:sr-only"
      @keydown="onTriggerKeydown"
    >
      <template #leading>
        <i
          v-if="selectedCountry && hasFlag(selectedCountry)"
          :style="flagStyle(selectedCountry, flagSprite, 'round')"
          class="block size-4 shrink-0 rounded-full bg-no-repeat ring-1 ring-inset ring-(--border-muted)"
          aria-hidden="true"
          :data-country="selectedCountry"
          :data-testid="`${testId}__selected-flag`"
        />
        <span
          v-if="variant === 'ghost' && shortCode"
          aria-hidden="true"
          dir="ltr"
          :data-testid="`${testId}__code`"
          class="shrink-0 group-data-[disabled]:text-(--text-disabled)"
          >{{ shortCode }}</span
        >
      </template>
    </SelectTrigger>
    <SelectContent
      class="min-w-max"
      :data-testid="`${testId}__content`"
      @keydown="onContentKeydown"
    >
      <template #search>
        <Input
          :id="searchId"
          :model-value="query"
          @update:model-value="setQuery"
          :placeholder="searchPlaceholder || t('languageSelect.search')"
          :aria-label="searchPlaceholder || t('languageSelect.search')"
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
        v-for="(option, index) in filteredOptions"
        :id="optionId(option.value)"
        :key="option.value"
        :value="option.value"
        :data-active="index === activeIndex || null"
        :data-testid="`${testId}__item`"
        class="pointer-coarse:min-h-11 data-[active]:bg-(--bg-hover)"
        @mousemove="setActive(index)"
      >
        <template #leading>
          <i
            v-if="countryOf(option) && hasFlag(countryOf(option))"
            :style="flagStyle(countryOf(option), flagSprite, 'round')"
            class="block size-4 shrink-0 rounded-full bg-no-repeat ring-1 ring-inset ring-(--border-muted)"
            aria-hidden="true"
            :data-country="countryOf(option)"
            :data-testid="`${testId}__flag`"
          />
        </template>
        <span
          :lang="option.value"
          dir="auto"
          >{{ labelOf(option) }}</span
        >
      </SelectItem>
      <p
        v-if="filteredOptions.length === 0"
        role="status"
        :data-testid="`${testId}__search-empty`"
        class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
      >
        {{ emptyTitle || t('languageSelect.noMatch') }}
      </p>
    </SelectContent>
  </Select>
</template>

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

  /** One language offered by the picker. */
  export interface LanguageSelectOption {
    /** BCP 47 tag of the language, such as pt-BR. */
    value: string
    /** The language named in itself, such as Português (Brasil). */
    label: string
    /** ISO 3166-1 alpha-2 code of the flag; taken from the tag's region when omitted. */
    country?: string
  }

  export interface LanguageSelectProps {
    /** Languages offered, in order: value is a BCP 47 tag, label the language named in itself, and country the ISO 3166-1 alpha-2 code of the flag (taken from the tag's region when omitted). */
    options?: LanguageSelectOption[]
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
      { value: 'en', label: 'English', country: 'US' },
      { value: 'pt-BR', label: 'Português (Brasil)', country: 'BR' },
      { value: 'es', label: 'Español', country: 'ES' }
    ],
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
    const region = option.value
      .split('-')
      .slice(1)
      .find((part) => /^[A-Za-z]{2}$/.test(part))
    return region ? region.toUpperCase() : ''
  }

  const selectedOption = computed(() => props.options.find((o) => o.value === model.value))

  const selectedCountry = computed(() =>
    selectedOption.value ? countryOf(selectedOption.value) : ''
  )

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
          text: o.label,
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
    :disabled="disabled"
    :placeholder="placeholder || t('languageSelect.label')"
    :display-value="() => selectedOption?.label ?? model"
    :data-testid="testId"
    @update:model-value="onPick"
  >
    <SelectTrigger
      :id="triggerId"
      :aria-label="triggerLabel"
      :data-testid="`${testId}__trigger`"
      class="pointer-coarse:min-h-11"
      @keydown="onTriggerKeydown"
    >
      <template #leading>
        <i
          v-if="selectedCountry && hasFlag(selectedCountry)"
          :style="flagStyle(selectedCountry, flagSprite)"
          class="block w-4 shrink-0 aspect-[22/15] bg-no-repeat"
          aria-hidden="true"
          :data-country="selectedCountry"
          :data-testid="`${testId}__selected-flag`"
        />
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
            :style="flagStyle(countryOf(option), flagSprite)"
            class="block w-4 aspect-[22/15] bg-no-repeat"
            aria-hidden="true"
            :data-country="countryOf(option)"
            :data-testid="`${testId}__flag`"
          />
        </template>
        <span
          :lang="option.value"
          dir="auto"
          >{{ option.label }}</span
        >
        <template #tag>
          <span
            dir="ltr"
            :data-testid="`${testId}__tag`"
            class="shrink-0 text-label-code-sm text-(--text-muted)"
          >
            {{ option.value }}
          </span>
        </template>
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

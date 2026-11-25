<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import Kbd from '../../../content/kbd/kbd.vue'
  import Popover from '../../../overlay/popover/popover.vue'
  import PopoverContent from '../../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTrigger from '../../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'
  import type { PromptInputMenuOption } from '../prompt-input.vue'

  defineOptions({
    name: 'PromptInputModelPicker',
    inheritAttrs: false
  })

  export interface PromptInputModelPickerProps {
    /** The models to choose from, each with an optional provider, icon, shortcut or description. */
    models?: PromptInputMenuOption[]
    /** Providers shown as a filter rail at the inline start of the panel. */
    providers?: PromptInputMenuOption[]
    /** The modes of the chosen model, such as thinking level or reasoning effort. Empty hides the mode column. */
    modes?: PromptInputMenuOption[]
    /** Label of the mode column, such as `Thinking Level` or `Effort`. Empty uses the locale catalog (`Mode`). */
    modeLabel?: string
  }

  const props = withDefaults(defineProps<PromptInputModelPickerProps>(), {
    models: () => [],
    providers: () => [],
    modes: () => [],
    modeLabel: ''
  })

  /** The chosen model's value. */
  const model = defineModel<string>({ default: '' })
  /** The chosen mode's value. */
  const mode = defineModel<string>('mode', { default: '' })

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const { disabled } = usePromptInputContext()

  const open = ref(false)
  const query = ref('')
  const activeProvider = ref('')

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'prompt-input-model-picker'
  )
  const providerMap = computed<Map<string, PromptInputMenuOption>>(
    () => new Map(props.providers.map((item) => [item.value, item]))
  )
  const selectedModel = computed<PromptInputMenuOption | undefined>(() =>
    props.models.find((option) => option.value === model.value)
  )
  const modelLabel = computed<string>(() => selectedModel.value?.label ?? t('promptInput.model'))
  const modelIcon = computed<string>(() => {
    const item = selectedModel.value
    if (!item) return ''
    return item.icon || (item.provider ? (providerMap.value.get(item.provider)?.icon ?? '') : '')
  })
  const modeName = computed<string>(
    () => props.modes.find((option) => option.value === mode.value)?.label ?? ''
  )
  const filteredModels = computed<PromptInputMenuOption[]>(() => {
    const needle = query.value.trim().toLowerCase()
    return props.models.filter((item) => {
      if (activeProvider.value && item.provider !== activeProvider.value) return false
      if (!needle) return true
      const providerLabel = item.provider ? (providerMap.value.get(item.provider)?.label ?? '') : ''
      return (
        item.label.toLowerCase().includes(needle) ||
        (item.description?.toLowerCase().includes(needle) ?? false) ||
        providerLabel.toLowerCase().includes(needle)
      )
    })
  })

  function iconOf(option: PromptInputMenuOption): string {
    return (
      option.icon || (option.provider ? (providerMap.value.get(option.provider)?.icon ?? '') : '')
    )
  }

  watch(open, (isOpen) => {
    if (!isOpen) query.value = ''
  })

  const ITEM_CLASS =
    'flex w-full items-center gap-(--spacing-xs) rounded-(--shape-control) px-(--spacing-sm) py-(--spacing-xs) text-start text-label-md text-(--text-default) ' +
    'transition-colors motion-reduce:transition-none hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'data-[selected]:bg-(--bg-selected)'

  const RAIL_BUTTON_CLASS =
    'relative flex size-9 items-center justify-center rounded-(--shape-control) text-(--text-muted) transition-colors motion-reduce:transition-none ' +
    'hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'data-[active]:bg-(--bg-selected) data-[active]:text-(--text-default)'
</script>

<template>
  <Popover
    v-model:open="open"
    side="top"
    align="end"
    :size="modes.length || providers.length ? 'large' : 'medium'"
    :disabled="disabled || models.length === 0"
  >
    <PopoverTrigger>
      <Button
        v-bind="$attrs"
        variant="ghost"
        size="small"
        icon="az az-chevron-down"
        icon-position="trailing"
        aria-haspopup="menu"
        :disabled="disabled || models.length === 0"
        :data-testid="testId"
        class="max-w-full min-w-0"
      >
        <i
          v-if="modelIcon"
          :class="[modelIcon, 'shrink-0 text-(--text-default)']"
          aria-hidden="true"
        />
        <span class="truncate">{{ modelLabel }}</span>
        <span
          v-if="modeName"
          class="truncate text-(--text-muted)"
          >{{ modeName }}</span
        >
      </Button>
    </PopoverTrigger>
    <PopoverContent :data-testid="`${testId}__panel`">
      <div class="flex min-h-72 max-sm:flex-col">
        <div
          v-if="providers.length"
          role="tablist"
          aria-orientation="vertical"
          :aria-label="t('promptInput.allProviders')"
          class="flex shrink-0 flex-col items-center gap-(--spacing-2xs) border-e border-(--border-subtle) p-(--spacing-xs) max-sm:flex-row max-sm:overflow-x-auto max-sm:border-e-0 max-sm:border-b"
        >
          <button
            type="button"
            role="tab"
            :aria-selected="activeProvider === ''"
            :aria-label="t('promptInput.allProviders')"
            :title="t('promptInput.allProviders')"
            :data-active="activeProvider === '' || null"
            :class="RAIL_BUTTON_CLASS"
            @click="activeProvider = ''"
          >
            <i
              class="az az-star-fill text-body-md leading-none"
              aria-hidden="true"
            />
            <span
              v-if="activeProvider === ''"
              aria-hidden="true"
              class="absolute end-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-(--accent-primary) max-sm:inset-x-1.5 max-sm:top-auto max-sm:h-0.5 max-sm:w-auto"
            />
          </button>
          <button
            v-for="provider in providers"
            :key="provider.value"
            type="button"
            role="tab"
            :aria-selected="activeProvider === provider.value"
            :aria-label="provider.label"
            :title="provider.label"
            :data-active="activeProvider === provider.value || null"
            :class="RAIL_BUTTON_CLASS"
            @click="activeProvider = provider.value"
          >
            <i
              :class="[provider.icon || 'az az-sparkles', 'text-body-md leading-none']"
              aria-hidden="true"
            />
            <span
              v-if="activeProvider === provider.value"
              aria-hidden="true"
              class="absolute end-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-(--accent-primary) max-sm:inset-x-1.5 max-sm:top-auto max-sm:h-0.5 max-sm:w-auto"
            />
          </button>
        </div>
        <div class="flex min-w-0 flex-1 flex-col">
          <div
            class="flex items-center gap-(--spacing-xs) border-b border-(--border-subtle) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <i
              class="az az-search shrink-0 text-(--text-muted)"
              aria-hidden="true"
            />
            <input
              v-model="query"
              type="search"
              :placeholder="t('promptInput.searchModels')"
              :aria-label="t('promptInput.searchModels')"
              autocomplete="off"
              class="min-w-0 flex-1 bg-transparent text-body-sm text-(--text-default) outline-none placeholder:text-(--text-muted) pointer-coarse:text-body-md"
            />
          </div>
          <div
            role="menu"
            :aria-label="t('promptInput.model')"
            class="flex max-h-72 flex-1 flex-col gap-0.5 overflow-y-auto p-(--spacing-xs)"
          >
            <button
              v-for="option in filteredModels"
              :key="option.value"
              type="button"
              role="menuitemradio"
              :aria-checked="option.value === model"
              :data-selected="option.value === model || null"
              :class="ITEM_CLASS"
              @click="model = option.value"
            >
              <i
                v-if="iconOf(option)"
                :class="[iconOf(option), 'shrink-0 text-body-md text-(--text-muted)']"
                aria-hidden="true"
              />
              <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
              <i
                v-if="option.value === model"
                class="az az-check shrink-0 text-body-sm text-(--text-default)"
                aria-hidden="true"
              />
              <Kbd
                v-if="option.shortcut"
                size="small"
                class="shrink-0"
              >
                {{ option.shortcut }}
              </Kbd>
              <span
                v-else-if="option.description"
                class="max-w-36 shrink-0 truncate text-body-xs text-(--text-muted)"
              >
                {{ option.description }}
              </span>
            </button>
            <p
              v-if="!filteredModels.length"
              class="m-0 px-(--spacing-sm) py-(--spacing-md) text-center text-body-xs text-(--text-muted)"
            >
              {{ t('promptInput.noMatch') }}
            </p>
          </div>
        </div>
        <div
          v-if="modes.length"
          role="menu"
          :aria-label="modeLabel || t('promptInput.mode')"
          class="flex w-44 shrink-0 flex-col border-s border-(--border-subtle) max-sm:w-full max-sm:border-s-0 max-sm:border-t"
        >
          <div
            class="flex items-center justify-between gap-(--spacing-xs) border-b border-(--border-subtle) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <span class="truncate text-label-sm text-(--text-muted)">{{
              modeLabel || t('promptInput.mode')
            }}</span>
            <span class="max-w-20 truncate text-body-xs text-(--text-muted)">{{ modelLabel }}</span>
          </div>
          <div class="flex flex-col gap-0.5 p-(--spacing-xs)">
            <button
              v-for="option in modes"
              :key="option.value"
              type="button"
              role="menuitemradio"
              :aria-checked="option.value === mode"
              :data-selected="option.value === mode || null"
              :class="ITEM_CLASS"
              @click="mode = option.value"
            >
              <span class="min-w-0 flex-1 truncate">{{ option.label }}</span>
              <i
                v-if="option.value === mode"
                class="az az-check shrink-0 text-body-sm text-(--text-default)"
                aria-hidden="true"
              />
            </button>
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
  import { computed, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Input from '../../../input/input/input.vue'
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

  const ITEM_CLASS = 'w-full [&>[data-slot=content]]:flex-1 data-[selected]:bg-(--bg-selected)'

  const RAIL_CLASS = 'data-[active]:bg-(--bg-selected) data-[active]:text-(--text-default)'

  const BAR_CLASS =
    'pointer-events-none absolute end-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-(--primary) max-sm:inset-x-1.5 max-sm:top-auto max-sm:h-0.5 max-sm:w-auto'
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
        aria-haspopup="dialog"
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
          role="group"
          :aria-label="t('promptInput.allProviders')"
          class="flex shrink-0 flex-col items-center gap-(--spacing-2xs) border-e border-(--border-default) p-(--spacing-xs) max-sm:flex-row max-sm:overflow-x-auto max-sm:border-e-0 max-sm:border-b"
        >
          <span class="relative inline-flex">
            <IconButton
              icon="az az-star-fill"
              :aria-label="t('promptInput.allProviders')"
              :aria-pressed="activeProvider === ''"
              :data-active="activeProvider === '' || null"
              variant="ghost"
              size="medium"
              :class="RAIL_CLASS"
              @click="activeProvider = ''"
            />
            <span
              v-if="activeProvider === ''"
              aria-hidden="true"
              :class="BAR_CLASS"
            />
          </span>
          <span
            v-for="provider in providers"
            :key="provider.value"
            class="relative inline-flex"
          >
            <IconButton
              :icon="provider.icon || 'az az-sparkles'"
              :aria-label="provider.label"
              :aria-pressed="activeProvider === provider.value"
              :data-active="activeProvider === provider.value || null"
              variant="ghost"
              size="medium"
              :class="RAIL_CLASS"
              @click="activeProvider = String(provider.value)"
            />
            <span
              v-if="activeProvider === provider.value"
              aria-hidden="true"
              :class="BAR_CLASS"
            />
          </span>
        </div>
        <div class="flex min-w-0 flex-1 flex-col">
          <div class="border-b border-(--border-default) p-(--spacing-xs)">
            <Input
              v-model="query"
              role="searchbox"
              size="small"
              :placeholder="t('promptInput.searchModels')"
              :aria-label="t('promptInput.searchModels')"
              autocomplete="off"
            >
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
          <ul
            :aria-label="t('promptInput.model')"
            class="m-0 flex max-h-72 flex-1 list-none flex-col gap-0.5 overflow-y-auto p-(--spacing-xs)"
          >
            <li
              v-for="option in filteredModels"
              :key="option.value"
            >
              <Button
                variant="ghost"
                size="medium"
                :aria-pressed="option.value === model"
                :data-selected="option.value === model || null"
                :class="ITEM_CLASS"
                @click="model = String(option.value)"
              >
                <i
                  v-if="iconOf(option)"
                  :class="[iconOf(option), 'shrink-0 text-body-md text-(--text-muted)']"
                  aria-hidden="true"
                />
                <span class="min-w-0 flex-1 truncate text-start">{{ option.label }}</span>
                <i
                  v-if="option.value === model"
                  class="az az-check shrink-0 text-body-sm text-(--text-default)"
                  aria-hidden="true"
                />
                <span
                  v-if="option.shortcut"
                  class="shrink-0 text-body-code-sm text-(--text-muted)"
                  >{{ option.shortcut }}</span
                >
                <span
                  v-else-if="option.description"
                  class="max-w-36 shrink-0 truncate text-body-xs text-(--text-muted)"
                >
                  {{ option.description }}
                </span>
              </Button>
            </li>
            <li
              v-if="!filteredModels.length"
              class="px-(--spacing-sm) py-(--spacing-md) text-center text-body-xs text-(--text-muted)"
            >
              {{ t('promptInput.noMatch') }}
            </li>
          </ul>
        </div>
        <div
          v-if="modes.length"
          class="flex w-44 shrink-0 flex-col border-s border-(--border-default) max-sm:w-full max-sm:border-s-0 max-sm:border-t"
        >
          <div
            class="flex min-h-12 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <span class="truncate text-label-sm text-(--text-muted)">{{
              modeLabel || t('promptInput.mode')
            }}</span>
            <span class="max-w-20 truncate text-body-xs text-(--text-muted)">{{ modelLabel }}</span>
          </div>
          <ul
            :aria-label="modeLabel || t('promptInput.mode')"
            class="m-0 flex list-none flex-col gap-0.5 p-(--spacing-xs)"
          >
            <li
              v-for="option in modes"
              :key="option.value"
            >
              <Button
                variant="ghost"
                size="medium"
                :aria-pressed="option.value === mode"
                :data-selected="option.value === mode || null"
                :class="ITEM_CLASS"
                @click="mode = String(option.value)"
              >
                <span class="min-w-0 flex-1 truncate text-start">{{ option.label }}</span>
                <i
                  v-if="option.value === mode"
                  class="az az-check shrink-0 text-body-sm text-(--text-default)"
                  aria-hidden="true"
                />
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>

<script setup lang="ts">
  import { computed, defineAsyncComponent, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Input from '../../../input/input/input.vue'
  import Popover from '../../../overlay/popover/popover.vue'
  import PopoverContent from '../../../overlay/popover/popover-content/popover-content.vue'
  import PopoverTrigger from '../../../overlay/popover/popover-trigger/popover-trigger.vue'
  import { LazyTooltip } from '../../../overlay/tooltip/lib/lazy-tooltip'
  import { usePromptInputContext } from '../composables/use-prompt-input-context'
  import { toggleKey } from '../lib/favorite-keys'
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
  /** Values of the starred models; the star at the top of the provider rail shows only these. */
  const favoriteKeys = defineModel<string[]>('favoriteKeys', { default: () => [] })

  defineSlots<{
    /** A bar under the panel's columns, such as a speed toggle or an access-mode picker. */
    footer(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ promptInput: en.promptInput })
  const { disabled } = usePromptInputContext()

  const ModelDialog = defineAsyncComponent(() => import('../parts/prompt-input-model-dialog.vue'))

  const open = ref(false)
  const dialogOpen = ref(false)
  const dialogMounted = ref(false)
  const query = ref('')
  const activeProvider = ref('')
  const FAVORITES = '\u0000favorites'

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
  const triggerName = computed<string>(() =>
    [modelLabel.value, modeName.value].filter(Boolean).join(', ')
  )
  const modeName = computed<string>(
    () => props.modes.find((option) => option.value === mode.value)?.label ?? ''
  )
  const filteredModels = computed<PromptInputMenuOption[]>(() => {
    const needle = query.value.trim().toLowerCase()
    return props.models.filter((item) => {
      if (!inRailFilter(item)) return false
      if (!needle) return true
      const providerLabel = item.provider ? (providerMap.value.get(item.provider)?.label ?? '') : ''
      return (
        item.label.toLowerCase().includes(needle) ||
        (item.description?.toLowerCase().includes(needle) ?? false) ||
        providerLabel.toLowerCase().includes(needle)
      )
    })
  })

  function inRailFilter(item: PromptInputMenuOption): boolean {
    if (activeProvider.value === FAVORITES) return favoriteKeys.value.includes(item.value)
    return !activeProvider.value || item.provider === activeProvider.value
  }

  function iconOf(option: PromptInputMenuOption): string {
    return (
      option.icon || (option.provider ? (providerMap.value.get(option.provider)?.icon ?? '') : '')
    )
  }

  function isFavorite(option: PromptInputMenuOption): boolean {
    return favoriteKeys.value.includes(option.value)
  }

  function toggleFavorite(option: PromptInputMenuOption): void {
    favoriteKeys.value = toggleKey(favoriteKeys.value, String(option.value))
  }

  function openDialog(): void {
    if (dialogMounted.value) dialogOpen.value = true
    else dialogMounted.value = true
  }

  function filterBy(value: string): void {
    activeProvider.value = activeProvider.value === value ? '' : value
  }

  watch(open, (isOpen) => {
    if (!isOpen) query.value = ''
  })

  const ITEM_CLASS = 'w-full [&>[data-slot=content]]:flex-1 data-[selected]:bg-(--bg-selected)'

  const ROW_CLASS =
    'group/row flex items-center rounded-(--shape-control) border-y border-transparent bg-clip-padding pe-(--spacing-xs) ' +
    'forced-colors:border-y-0 hover:bg-(--bg-hover) data-[selected]:bg-(--bg-selected)'

  const ROW_BUTTON_CLASS =
    'min-w-0 flex-1 before:hidden after:hidden [&>[data-slot=content]]:flex-1'

  const STAR_CLASS =
    'opacity-0 group-hover/row:opacity-100 group-focus-within/row:opacity-100 focus-visible:opacity-100 pointer-coarse:opacity-100 data-[active]:opacity-100 data-[active]:text-(--text-default)'

  const RAIL_CLASS = 'data-[active]:bg-(--bg-selected) data-[active]:text-(--text-default)'

  const BAR_CLASS =
    'pointer-events-none absolute end-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-(--primary) max-sm:inset-x-1.5 max-sm:top-auto max-sm:h-0.5 max-sm:w-auto'
</script>

<template>
  <IconButton
    v-bind="$attrs"
    :icon="modelIcon || 'az az-sparkles'"
    :aria-label="`${t('promptInput.model')}: ${triggerName}`"
    aria-haspopup="dialog"
    :aria-expanded="dialogOpen"
    variant="ghost"
    size="medium"
    :disabled="disabled || models.length === 0"
    :data-testid="`${testId}__compact`"
    class="md:hidden"
    @click="openDialog"
  />
  <ModelDialog
    v-if="dialogMounted"
    v-model:open="dialogOpen"
    v-model="model"
    v-model:mode="mode"
    v-model:favorite-keys="favoriteKeys"
    :models="models"
    :providers="providers"
    :modes="modes"
    :mode-label="modeLabel || t('promptInput.mode')"
    :test-id="testId"
  >
    <template
      v-if="$slots['footer']"
      #footer
    >
      <slot name="footer" />
    </template>
  </ModelDialog>
  <Popover
    v-model:open="open"
    class="max-md:hidden"
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
          :aria-label="t('promptInput.providers')"
          class="flex shrink-0 flex-col items-center gap-(--spacing-2xs) border-e border-(--border-default) p-(--spacing-xs) max-sm:flex-row max-sm:overflow-x-auto max-sm:border-e-0 max-sm:border-b"
        >
          <span class="relative inline-flex">
            <IconButton
              icon="az az-star-fill"
              :aria-label="t('promptInput.favorites')"
              :aria-pressed="activeProvider === FAVORITES"
              :data-active="activeProvider === FAVORITES || null"
              variant="ghost"
              size="medium"
              :class="RAIL_CLASS"
              @click="filterBy(FAVORITES)"
            />
            <span
              v-if="activeProvider === FAVORITES"
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
              @click="filterBy(String(provider.value))"
            />
            <span
              v-if="activeProvider === provider.value"
              aria-hidden="true"
              :class="BAR_CLASS"
            />
          </span>
        </div>
        <div class="flex min-w-0 flex-1 flex-col">
          <div
            class="flex h-12 shrink-0 items-center border-b border-(--border-default) px-(--spacing-xs)"
          >
            <Input
              v-model="query"
              class="w-full"
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
              :data-selected="option.value === model || null"
              :class="ROW_CLASS"
            >
              <Button
                variant="ghost"
                size="medium"
                :aria-pressed="option.value === model"
                :class="ROW_BUTTON_CLASS"
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
              </Button>
              <LazyTooltip
                :content="
                  isFavorite(option)
                    ? t('promptInput.removeFavorite')
                    : t('promptInput.addFavorite')
                "
              >
                <IconButton
                  :icon="isFavorite(option) ? 'az az-star-fill' : 'az az-star'"
                  :aria-label="`${isFavorite(option) ? t('promptInput.removeFavorite') : t('promptInput.addFavorite')}: ${option.label}`"
                  :aria-pressed="isFavorite(option)"
                  :data-active="isFavorite(option) || null"
                  :data-testid="`${testId}__favorite`"
                  variant="ghost"
                  size="small"
                  :class="STAR_CLASS"
                  @click="toggleFavorite(option)"
                />
              </LazyTooltip>
              <span
                v-if="option.shortcut"
                class="ms-(--spacing-2xs) shrink-0 text-body-code-sm text-(--text-muted) pointer-coarse:hidden"
                >{{ option.shortcut }}</span
              >
              <span
                v-else-if="option.description"
                class="ms-(--spacing-2xs) max-w-36 shrink-0 truncate text-body-xs text-(--text-muted)"
              >
                {{ option.description }}
              </span>
            </li>
            <li
              v-if="!filteredModels.length"
              class="px-(--spacing-sm) py-(--spacing-md) text-center text-body-xs text-(--text-muted)"
            >
              {{
                activeProvider === FAVORITES && !favoriteKeys.length
                  ? t('promptInput.noFavorites')
                  : t('promptInput.noMatch')
              }}
            </li>
          </ul>
        </div>
        <div
          v-if="modes.length"
          class="flex w-44 shrink-0 flex-col border-s border-(--border-default) max-sm:w-full max-sm:border-s-0 max-sm:border-t"
        >
          <div
            class="flex h-12 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) py-(--spacing-xs)"
          >
            <span class="shrink-0 text-label-sm whitespace-nowrap text-(--text-muted)">{{
              modeLabel || t('promptInput.mode')
            }}</span>
            <span class="min-w-0 truncate text-body-xs text-(--text-muted)">{{ modelLabel }}</span>
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
      <div
        v-if="$slots['footer']"
        :data-testid="`${testId}__footer`"
        class="flex flex-wrap items-center gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-xs) [&>:last-child:not(:first-child)]:ms-auto"
      >
        <slot name="footer" />
      </div>
    </PopoverContent>
  </Popover>
</template>

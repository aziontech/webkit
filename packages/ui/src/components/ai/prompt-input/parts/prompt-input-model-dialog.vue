<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import Input from '../../../input/input/input.vue'
  import Dialog from '../../../overlay/dialog/dialog.vue'
  import DialogContent from '../../../overlay/dialog/dialog-content.vue'
  import DialogTitle from '../../../overlay/dialog/dialog-title.vue'
  import PanelBody from '../../../overlay/panel/panel-body.vue'
  import PanelFooter from '../../../overlay/panel/panel-footer.vue'
  import PanelHeader from '../../../overlay/panel/panel-header.vue'
  import { toggleKey } from '../lib/favorite-keys'
  import type { PromptInputMenuOption } from '../types'

  defineOptions({ name: 'PromptInputModelDialog', inheritAttrs: false })

  interface Props {
    /** The models to choose from. */
    models: PromptInputMenuOption[]
    /** Providers that title the sections of the list. */
    providers: PromptInputMenuOption[]
    /** The modes of the chosen model. */
    modes: PromptInputMenuOption[]
    /** Label of the mode group. */
    modeLabel: string
    /** Test id of the owning model picker. */
    testId: string
  }

  const props = defineProps<Props>()

  const open = defineModel<boolean>('open', { required: true })
  const model = defineModel<string>({ required: true })
  const mode = defineModel<string>('mode', { required: true })
  const favoriteKeys = defineModel<string[]>('favoriteKeys', { required: true })

  defineSlots<{
    footer(): unknown
  }>()

  interface Section {
    key: string
    label: string
    icon: string
    items: PromptInputMenuOption[]
  }

  const { t } = useTranslate({ promptInput: en.promptInput })
  const query = ref('')

  const providerMap = computed<Map<string, PromptInputMenuOption>>(
    () => new Map(props.providers.map((item) => [item.value, item]))
  )
  const matches = computed<PromptInputMenuOption[]>(() => {
    const needle = query.value.trim().toLowerCase()
    if (!needle) return props.models
    return props.models.filter((item) =>
      [item.label, item.description ?? '', providerOf(item)?.label ?? ''].some((text) =>
        text.toLowerCase().includes(needle)
      )
    )
  })
  const sections = computed<Section[]>(() => {
    const favorites = matches.value.filter((item) => favoriteKeys.value.includes(item.value))
    const groups: Section[] = [
      {
        key: 'favorites',
        label: t('promptInput.favorites'),
        icon: 'az az-star-fill',
        items: favorites
      },
      ...props.providers.map((provider) => ({
        key: `provider:${provider.value}`,
        label: provider.label,
        icon: provider.icon || 'az az-sparkles',
        items: matches.value.filter((item) => item.provider === provider.value)
      })),
      {
        key: 'other',
        label: t('promptInput.model'),
        icon: '',
        items: matches.value.filter(
          (item) => !item.provider || !providerMap.value.has(item.provider)
        )
      }
    ]
    return groups.filter((group) => group.items.length > 0)
  })
  const modeOptions = computed(() =>
    props.modes.map((option) => ({ value: String(option.value), label: option.label }))
  )

  function providerOf(item: PromptInputMenuOption): PromptInputMenuOption | undefined {
    return item.provider ? providerMap.value.get(item.provider) : undefined
  }

  function isFavorite(option: PromptInputMenuOption): boolean {
    return favoriteKeys.value.includes(option.value)
  }

  function toggleFavorite(option: PromptInputMenuOption): void {
    favoriteKeys.value = toggleKey(favoriteKeys.value, String(option.value))
  }

  function starName(option: PromptInputMenuOption): string {
    const action = isFavorite(option)
      ? t('promptInput.removeFavorite')
      : t('promptInput.addFavorite')
    return `${action}: ${option.label}`
  }

  watch(open, (isOpen) => {
    if (!isOpen) query.value = ''
  })

  onMounted(() => {
    open.value = true
  })

  const ROW_CLASS =
    'flex min-h-11 items-center rounded-(--shape-control) border-y border-transparent bg-clip-padding pe-(--spacing-2xs) ' +
    'forced-colors:border-y-0 data-[selected]:bg-(--bg-selected)'

  const ROW_BUTTON_CLASS =
    'min-h-11 min-w-0 flex-1 before:hidden after:hidden [&>[data-slot=content]]:flex-1'
</script>

<template>
  <Dialog
    v-model:open="open"
    size="small"
  >
    <DialogContent :data-testid="`${testId}__dialog`">
      <PanelHeader>
        <DialogTitle>{{ t('promptInput.model') }}</DialogTitle>
      </PanelHeader>
      <PanelBody class="flex flex-col gap-(--spacing-md)">
        <section
          v-for="section in sections"
          :key="section.key"
          :aria-label="section.label"
          class="flex flex-col gap-(--spacing-2xs)"
        >
          <h3 class="flex items-center gap-(--spacing-xs) text-label-sm text-(--text-muted)">
            <i
              v-if="section.icon"
              :class="[section.icon, 'shrink-0']"
              aria-hidden="true"
            />
            {{ section.label }}
          </h3>
          <ul
            class="m-0 flex list-none flex-col rounded-(--shape-card) bg-(--bg-surface-raised) p-(--spacing-2xs)"
          >
            <li
              v-for="option in section.items"
              :key="option.value"
              :data-selected="option.value === model || null"
              :class="ROW_CLASS"
            >
              <Button
                variant="ghost"
                size="medium"
                :aria-pressed="option.value === model"
                :data-autofocus="option.value === model || null"
                :class="ROW_BUTTON_CLASS"
                @click="model = String(option.value)"
              >
                <span class="min-w-0 flex-1 truncate text-start text-body-md">{{
                  option.label
                }}</span>
                <span
                  v-if="option.description"
                  class="max-w-32 shrink-0 truncate text-body-xs text-(--text-muted)"
                  >{{ option.description }}</span
                >
                <i
                  v-if="option.value === model"
                  class="az az-check shrink-0 text-body-sm text-(--text-default)"
                  aria-hidden="true"
                />
              </Button>
              <IconButton
                :icon="isFavorite(option) ? 'az az-star-fill' : 'az az-star'"
                :aria-label="starName(option)"
                :aria-pressed="isFavorite(option)"
                :data-testid="`${testId}__favorite`"
                variant="ghost"
                size="medium"
                @click="toggleFavorite(option)"
              />
            </li>
          </ul>
        </section>
        <p
          v-if="!sections.length"
          class="py-(--spacing-md) text-center text-body-sm text-(--text-muted)"
        >
          {{ t('promptInput.noMatch') }}
        </p>
        <section
          v-if="modes.length"
          :aria-label="modeLabel"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <h3 class="text-label-sm text-(--text-muted)">{{ modeLabel }}</h3>
          <ToggleGroup
            v-model="mode"
            :options="modeOptions"
            :aria-label="modeLabel"
            size="medium"
            fluid
          />
        </section>
        <div
          v-if="$slots['footer']"
          :data-testid="`${testId}__footer`"
          class="flex flex-wrap items-center gap-(--spacing-xs)"
        >
          <slot name="footer" />
        </div>
      </PanelBody>
      <PanelFooter>
        <Input
          v-model="query"
          role="searchbox"
          size="medium"
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
      </PanelFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
  import { computed, useAttrs, useId } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Checkbox from '../../inputs/checkbox/checkbox.vue'
  import RadioButton from '../../inputs/radio-button/radio-button.vue'

  /** How many cards can be selected. */
  export type CardsSelectionMode = 'none' | 'single' | 'multi'

  type CardItem = Record<string, unknown>

  defineOptions({
    name: 'Cards',
    inheritAttrs: false
  })

  interface Props {
    /** The items, one card each. */
    items?: CardItem[]
    /** Field that identifies an item; selection keys read it. */
    trackBy?: string
    /** No selection, one card, or several cards with a select-all above them. */
    selectionMode?: CardsSelectionMode
    /** Shows placeholder cards and sets aria-busy while true. */
    loading?: boolean
    /** Accessible name of the list. Empty uses the locale catalog. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    trackBy: 'id',
    selectionMode: 'none',
    loading: false,
    ariaLabel: ''
  })

  defineSlots<{
    /** Card title; names the card and its selection control. */
    header(props: { item: CardItem; index: number; selected: boolean }): unknown
    /** Card body: the item's fields. */
    default(props: { item: CardItem; index: number; selected: boolean }): unknown
    /** Shown when there are no items. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ cards: en.cards })
  const uid = useId()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-cards'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const keyOf = (item: CardItem): string => String(item[props.trackBy] ?? '')

  const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })
  const selected = computed<string[]>(() => selectedKeys.value)

  const setSelected = (next: string[]): void => {
    selectedKeys.value = next
  }

  const isSelected = (item: CardItem): boolean => selected.value.includes(keyOf(item))

  const toggle = (item: CardItem, value: boolean): void => {
    const key = keyOf(item)
    if (props.selectionMode === 'single') {
      setSelected(value ? [key] : [])
      return
    }
    const rest = selected.value.filter((k) => k !== key)
    setSelected(value ? [...rest, key] : rest)
  }

  const pageKeys = computed<string[]>(() => props.items.map(keyOf))
  const allSelected = computed<boolean>(
    () => pageKeys.value.length > 0 && pageKeys.value.every((k) => selected.value.includes(k))
  )
  const someSelected = computed<boolean>(
    () => !allSelected.value && pageKeys.value.some((k) => selected.value.includes(k))
  )
  const toggleAll = (value: boolean): void => {
    const others = selected.value.filter((k) => !pageKeys.value.includes(k))
    setSelected(value ? [...others, ...pageKeys.value] : others)
  }

  const headerId = (index: number): string => `${uid}-card-${index}`
  const SKELETONS = 6
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-selection="selectionMode"
    :aria-busy="loading || undefined"
    class="@container/cards flex w-full min-w-0 flex-col gap-(--spacing-sm)"
  >
    <div
      v-if="selectionMode === 'multi' && !loading && items.length > 0"
      :data-testid="`${testId}__select-all`"
      class="flex min-h-10 items-center gap-(--spacing-xs)"
    >
      <Checkbox
        binary
        :input-id="`${uid}-select-all`"
        :model-value="allSelected"
        :indeterminate="someSelected"
        @update:model-value="(value: unknown) => toggleAll(!!value)"
      />
      <label
        :for="`${uid}-select-all`"
        class="cursor-pointer text-label-sm text-(--text-default)"
        >{{ t('cards.selectAll') }}</label
      >
    </div>

    <ul
      v-if="loading"
      :aria-label="ariaLabel || t('cards.label')"
      :data-testid="`${testId}__list`"
      class="grid grid-cols-1 gap-(--spacing-sm) @xl/cards:grid-cols-2 @4xl/cards:grid-cols-3 @7xl/cards:grid-cols-4"
    >
      <li
        v-for="n in SKELETONS"
        :key="n"
        :data-testid="`${testId}__skeleton`"
        class="flex flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
      >
        <Skeleton
          height="1rem"
          width="60%"
        />
        <Skeleton height="0.875rem" />
        <Skeleton
          height="0.875rem"
          width="80%"
        />
      </li>
    </ul>

    <ul
      v-else-if="items.length > 0"
      :aria-label="ariaLabel || t('cards.label')"
      :data-testid="`${testId}__list`"
      class="grid grid-cols-1 gap-(--spacing-sm) @xl/cards:grid-cols-2 @4xl/cards:grid-cols-3 @7xl/cards:grid-cols-4"
    >
      <li
        v-for="(item, index) in items"
        :key="keyOf(item)"
        :data-testid="`${testId}__card`"
        :data-selected="isSelected(item) || null"
        :data-state="isSelected(item) ? 'selected' : 'unselected'"
        class="flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) transition-colors duration-150 ease-out motion-reduce:transition-none data-[selected]:border-(--border-selected) data-[selected]:bg-(--bg-selected)"
      >
        <div class="flex min-w-0 items-start gap-(--spacing-sm)">
          <div
            :id="headerId(index)"
            class="min-w-0 flex-1 text-label-md text-(--text-default)"
          >
            <slot
              name="header"
              :item="item"
              :index="index"
              :selected="isSelected(item)"
            />
          </div>
          <Checkbox
            v-if="selectionMode === 'multi'"
            binary
            :model-value="isSelected(item)"
            :aria-labelledby="headerId(index)"
            :data-testid="`${testId}__select`"
            @update:model-value="(value: unknown) => toggle(item, !!value)"
          />
          <RadioButton
            v-else-if="selectionMode === 'single'"
            :model-value="selected[0] ?? ''"
            :value="keyOf(item)"
            :name="`${uid}-selection`"
            :aria-labelledby="headerId(index)"
            :data-testid="`${testId}__select`"
            @update:model-value="toggle(item, true)"
          />
        </div>
        <div class="flex min-w-0 flex-col gap-(--spacing-xs) text-body-sm text-(--text-default)">
          <slot
            :item="item"
            :index="index"
            :selected="isSelected(item)"
          />
        </div>
      </li>
    </ul>

    <div
      v-else
      :data-testid="`${testId}__empty`"
    >
      <slot name="empty">
        <EmptyState
          size="small"
          icon="pi pi-th-large"
          :title="t('cards.emptyTitle')"
          :description="t('cards.emptyDescription')"
        />
      </slot>
    </div>
  </div>
</template>

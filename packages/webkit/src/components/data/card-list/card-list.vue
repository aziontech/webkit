<script setup lang="ts" generic="TItem extends object = Record<string, unknown>">
  import { computed, useAttrs, useId } from 'vue'

  import { useLazyChunks } from '../../../composables/use-lazy-chunks'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import Checkbox from '../../input/checkbox/checkbox.vue'
  import RadioGroup from '../../input/radio-group/radio-group.vue'
  import RadioGroupItem from '../../input/radio-group/radio-group-item/radio-group-item.vue'
  import type { CardListItemSlotProps, CardListSelectionMode } from './types'

  defineOptions({
    name: 'CardList',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** The items, one card each. */
      items?: TItem[]
      /** Field that identifies an item; selection keys read it. */
      itemKey?: string
      /** No selection, one card, or several cards with a select-all above them. */
      selectionMode?: CardListSelectionMode
      /** Shows placeholder cards and sets aria-busy while true. */
      loading?: boolean
      /** Accessible name of the list. Empty uses the locale catalog. */
      ariaLabel?: string
    }>(),
    {
      items: () => [],
      itemKey: 'id',
      selectionMode: 'none',
      loading: false,
      ariaLabel: ''
    }
  )

  defineSlots<{
    /** Card title; names the card and its selection control. */
    header(props: CardListItemSlotProps<TItem>): unknown
    /** Card body: the item's fields. */
    default(props: CardListItemSlotProps<TItem>): unknown
    /** Shown when there are no items. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ cardList: en.cardList })
  const uid = useId()

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'card-list')
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )

  const keyOf = (item: TItem): string =>
    String((item as Record<string, unknown>)[props.itemKey] ?? '')

  const selectedKeys = defineModel<string[]>('selectedKeys', { default: () => [] })
  const selected = computed<string[]>(() => selectedKeys.value)

  const setSelected = (next: string[]): void => {
    selectedKeys.value = next
  }

  const selectedSet = computed<Set<string>>(() => new Set(selected.value))

  const toggle = (item: TItem, value: boolean): void => {
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
    () => pageKeys.value.length > 0 && pageKeys.value.every((k) => selectedSet.value.has(k))
  )
  const someSelected = computed<boolean>(
    () => !allSelected.value && pageKeys.value.some((k) => selectedSet.value.has(k))
  )
  const toggleAll = (value: boolean): void => {
    const onPage = new Set(pageKeys.value)
    const others = selected.value.filter((k) => !onPage.has(k))
    setSelected(value ? [...others, ...pageKeys.value] : others)
  }

  const { split, observe } = useLazyChunks({ rowHeight: 48, chunkSize: 60, threshold: 120 })
  const chunks = computed(() =>
    split(props.items.map((item, index) => ({ item, index, key: keyOf(item) })))
  )

  const headerId = (index: number): string => `${uid}-card-${index}`
  const SKELETONS = 6
</script>

<script lang="ts">
  export type { CardListItemSlotProps, CardListSelectionMode } from './types'
</script>

<template>
  <div
    v-bind="rootAttrs"
    :data-testid="testId"
    :data-selection="selectionMode"
    :aria-busy="loading || undefined"
    class="@container/card-list flex w-full min-w-0 flex-col gap-(--spacing-sm)"
  >
    <div
      v-if="selectionMode === 'multiple' && !loading && items.length > 0"
      :data-testid="`${testId}__select-all`"
      class="flex min-h-10 items-center gap-(--spacing-xs)"
    >
      <Checkbox
        :id="`${uid}-select-all`"
        :model-value="allSelected"
        :indeterminate="someSelected"
        @update:model-value="(value: unknown) => toggleAll(!!value)"
      />
      <label
        :for="`${uid}-select-all`"
        class="cursor-pointer text-label-sm text-(--text-default)"
        >{{ t('cardList.selectAll') }}</label
      >
    </div>

    <ul
      v-if="loading"
      :aria-label="ariaLabel || t('cardList.label')"
      :data-testid="`${testId}__list`"
      class="grid grid-cols-1 gap-(--spacing-sm) @xl/card-list:grid-cols-2 @4xl/card-list:grid-cols-3 @6xl/card-list:grid-cols-4"
    >
      <li
        v-for="n in SKELETONS"
        :key="n"
        :data-testid="`${testId}__loading`"
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
      :aria-label="ariaLabel || t('cardList.label')"
      :data-testid="`${testId}__list`"
      class="grid grid-cols-1 gap-(--spacing-sm) @xl/card-list:grid-cols-2 @4xl/card-list:grid-cols-3 @6xl/card-list:grid-cols-4"
    >
      <template
        v-for="chunk in chunks"
        :key="chunk.index"
      >
        <li
          v-if="!chunk.mounted"
          :ref="(el) => observe(el, chunk.index)"
          :data-chunk="chunk.index"
          aria-hidden="true"
          class="col-span-full"
          :style="{ height: `${chunk.estimatedHeight}px` }"
        />
        <template v-else>
          <li
            v-for="{ item, index, key, on } in chunk.items.map((entry) => ({
              ...entry,
              on: selectedSet.has(entry.key)
            }))"
            :key="key"
            :data-testid="`${testId}__card`"
            :data-selected="on || null"
            :data-state="on ? 'selected' : 'unselected'"
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
                  :selected="on"
                />
              </div>
              <Checkbox
                v-if="selectionMode === 'multiple'"
                :model-value="on"
                :aria-labelledby="headerId(index)"
                :data-testid="`${testId}__select`"
                @update:model-value="(value: unknown) => toggle(item, !!value)"
              />
              <RadioGroup
                v-else-if="selectionMode === 'single'"
                :model-value="selected[0] ?? ''"
                :name="`${uid}-selection`"
                :data-testid="`${testId}__select`"
                @update:model-value="toggle(item, true)"
              >
                <RadioGroupItem
                  :value="key"
                  :aria-labelledby="headerId(index)"
                />
              </RadioGroup>
            </div>
            <div
              class="flex min-w-0 flex-col gap-(--spacing-xs) text-body-sm text-(--text-default)"
            >
              <slot
                :item="item"
                :index="index"
                :selected="on"
              />
            </div>
          </li>
        </template>
      </template>
    </ul>

    <div
      v-else
      :data-testid="`${testId}__empty`"
    >
      <slot name="empty">
        <EmptyState
          size="small"
          icon="ai ai-layout-grid"
          :title="t('cardList.emptyTitle')"
          :description="t('cardList.emptyDescription')"
        />
      </slot>
    </div>
  </div>
</template>

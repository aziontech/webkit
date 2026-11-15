<script setup lang="ts">
  import { computed, inject, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../../composables/use-locale/use-translate'
  import * as en from '../../../../i18n/messages/en'
  import EmptyState from '../../../feedback/empty-state/empty-state.vue'
  import Spinner from '../../../utils/spinner/spinner.vue'
  import { useTransferListSide } from '../composables/use-transfer-list-side'
  import { transferListContextKey, type TransferListSide } from '../injection-key'
  import { getItemTransitionStyle, transferListItemTransitionClasses } from '../presets/transitions'

  defineOptions({
    name: 'TransferListSource',
    inheritAttrs: false
  })

  interface Props {
    /** Heading text for the list; also its accessible name. */
    title?: string
    /** Shows a spinner in place of options and locks this list's controls while data loads. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    loading: false
  })

  defineSlots<{
    item(props: { item: unknown; index: number; list: TransferListSide }): unknown
    title(): unknown
  }>()

  const side: TransferListSide = 'source'

  const ctx = inject(transferListContextKey)
  if (!ctx) {
    throw new Error('TransferListSource must be used inside <TransferList>.')
  }

  const attrs = useAttrs()
  const { t } = useTranslate({ transferList: en.transferList })
  const listRef = ref<HTMLElement | null>(null)
  const { tabindexFor, onFocus, onKeydown } = useTransferListSide(side, ctx, listRef)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'transfer-list-source'
  )

  const visibleItems = computed(() => (props.loading ? [] : ctx.items(side)))

  const itemTransitionStyle = getItemTransitionStyle()
  const itemTransitionActive = transferListItemTransitionClasses.join(' ')

  watch(
    () => props.loading,
    (value) => ctx.setLoading(side, value),
    { immediate: true }
  )

  const setListRef = (el: unknown): void => {
    const node = (el as { $el?: unknown } | null)?.$el ?? el
    listRef.value = node instanceof HTMLElement ? node : null
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-loading="loading || null"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <h3
      :data-testid="`${testId}__header`"
      class="text-label-lg text-(--text-muted)"
    >
      <slot name="title">{{ title }}</slot>
    </h3>
    <div class="relative flex min-w-0 flex-col">
      <TransitionGroup
        :ref="setListRef"
        tag="ul"
        role="listbox"
        aria-multiselectable="true"
        :aria-label="title || undefined"
        :aria-disabled="ctx.disabled.value || undefined"
        :aria-busy="loading || undefined"
        :data-testid="`${testId}__list`"
        :data-disabled="ctx.disabled.value || null"
        :data-loading="loading || null"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        :enter-active-class="itemTransitionActive"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
        :leave-active-class="itemTransitionActive"
        class="m-0 flex min-h-[14rem] list-none flex-col gap-(--spacing-xxs) overflow-auto rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-xs) data-[disabled]:bg-(--bg-disabled)"
      >
        <li
          v-if="loading"
          key="__transfer-list-loading"
          role="presentation"
          :data-testid="`${testId}__loading`"
          :style="itemTransitionStyle"
          class="flex flex-1 items-center justify-center py-(--spacing-md)"
        >
          <Spinner class="size-6 text-(--text-muted)" />
        </li>

        <li
          v-for="(item, index) in visibleItems"
          :key="ctx.itemKey(item, index)"
          role="option"
          :aria-selected="ctx.isSelected(side, index)"
          :tabindex="tabindexFor(index)"
          :data-selected="ctx.isSelected(side, index) || null"
          :data-testid="`${testId}__option`"
          :style="itemTransitionStyle"
          class="cursor-pointer select-none rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-md text-(--text-default) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[selected]:bg-(--bg-selected) aria-disabled:cursor-not-allowed"
          @click="ctx.toggleSelection(side, index)"
          @dblclick="ctx.itemDoubleClick($event, side, index)"
          @keydown="onKeydown(index, $event)"
          @focus="onFocus(index)"
        >
          <slot
            name="item"
            :item="item"
            :index="index"
            :list="side"
          />
        </li>
      </TransitionGroup>
      <div
        v-if="!loading && visibleItems.length === 0"
        :data-testid="`${testId}__empty`"
        class="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <EmptyState
          size="small"
          :title="t('transferList.empty')"
        />
      </div>
    </div>
  </section>
</template>

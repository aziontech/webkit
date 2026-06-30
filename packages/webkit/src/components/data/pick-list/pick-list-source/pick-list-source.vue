<script setup lang="ts">
  import { computed, inject, useAttrs, watch } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import { pickListContextKey, type PickListSide } from '../injection-key'

  defineOptions({
    name: 'PickListSource',
    inheritAttrs: false
  })

  interface Props {
    /** Heading text for the list; also its accessible name. */
    header?: string
    /** Shows a spinner in place of options and locks this list's controls while data loads. */
    loading?: boolean
    /** Shows up/down controls that reorder this list's selected items. */
    reorderable?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    header: '',
    loading: false,
    reorderable: false
  })

  defineSlots<{
    item(props: { item: unknown; index: number; list: PickListSide }): unknown
    header(): unknown
  }>()

  const side: PickListSide = 'source'

  const ctx = inject(pickListContextKey)
  if (!ctx) {
    throw new Error('PickListSource must be used inside <PickList>.')
  }

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'pick-list-source'
  )

  watch(
    () => props.loading,
    (value) => ctx.setLoading(side, value),
    { immediate: true }
  )

  const onOptionKeydown = (index: number, event: globalThis.KeyboardEvent): void => {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
      event.preventDefault()
      ctx.toggleSelection(side, index)
    }
  }
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-reorderable="reorderable || null"
    :data-loading="loading || null"
    class="flex min-w-0 flex-col gap-[var(--spacing-xs)]"
  >
    <div class="flex items-center justify-between gap-[var(--spacing-xs)]">
      <h3
        :data-testid="`${testId}__header`"
        class="text-label-lg text-[var(--text-muted)]"
      >
        <slot name="header">{{ header }}</slot>
      </h3>
      <div
        v-if="reorderable"
        class="flex items-center gap-[var(--spacing-xxs)]"
        :data-testid="`${testId}__reorder`"
      >
        <button
          type="button"
          :disabled="ctx.disabled.value || loading || !ctx.hasSelection(side)"
          aria-label="Move selected up"
          :data-testid="`${testId}__reorder-up`"
          class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
          @click="ctx.reorder(side, -1)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4"
          >
            <path d="M12 20V7" />
            <path d="M6 13l6-6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          :disabled="ctx.disabled.value || loading || !ctx.hasSelection(side)"
          aria-label="Move selected down"
          :data-testid="`${testId}__reorder-down`"
          class="inline-flex size-10 shrink-0 items-center justify-center rounded-[var(--shape-elements)] text-[var(--text-default)] transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] disabled:cursor-not-allowed disabled:text-[var(--text-disabled)]"
          @click="ctx.reorder(side, 1)"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            class="size-4"
          >
            <path d="M12 4v13" />
            <path d="M6 11l6 6 6-6" />
          </svg>
        </button>
      </div>
    </div>
    <ul
      role="listbox"
      aria-multiselectable="true"
      :aria-label="header || undefined"
      :aria-disabled="ctx.disabled.value || undefined"
      :aria-busy="loading || undefined"
      :data-testid="`${testId}__list`"
      :data-disabled="ctx.disabled.value || null"
      :data-loading="loading || null"
      class="m-0 flex min-h-[14rem] list-none flex-col gap-[var(--spacing-xxs)] overflow-auto rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface)] p-[var(--spacing-xs)] data-[disabled]:bg-[var(--bg-disabled)]"
    >
      <li
        v-if="loading"
        role="presentation"
        :data-testid="`${testId}__loading`"
        class="flex flex-1 items-center justify-center py-[var(--spacing-md)]"
      >
        <Spinner class="size-6 text-[var(--text-muted)]" />
      </li>
      <li
        v-for="(item, index) in ctx.items(side)"
        v-else
        :key="ctx.itemKey(item, index)"
        role="option"
        :aria-selected="ctx.isSelected(side, index)"
        :tabindex="ctx.disabled.value ? -1 : 0"
        :data-selected="ctx.isSelected(side, index) || null"
        :data-testid="`${testId}__option`"
        class="cursor-pointer select-none rounded-[var(--shape-elements)] px-[var(--spacing-sm)] py-[var(--spacing-xs)] text-body-md text-[var(--text-default)] hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] data-[selected]:bg-[var(--bg-selected)] aria-disabled:cursor-not-allowed"
        @click="ctx.toggleSelection(side, index)"
        @keydown="onOptionKeydown(index, $event)"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :list="side"
        />
      </li>
    </ul>
  </section>
</template>

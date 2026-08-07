<script setup lang="ts">
  import { computed, inject, useAttrs, watch } from 'vue'

  import Spinner from '../../../utils/spinner/spinner.vue'
  import { pickListContextKey, type PickListSide } from '../injection-key'
  import { getItemTransitionStyle, pickListItemTransitionClasses } from '../presets/transitions'

  defineOptions({
    name: 'PickListTarget',
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
    item(props: { item: unknown; index: number; list: PickListSide }): unknown
    title(): unknown
  }>()

  const side: PickListSide = 'target'

  const ctx = inject(pickListContextKey)
  if (!ctx) {
    throw new Error('PickListTarget must be used inside <PickList>.')
  }

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'pick-list-target'
  )

  const itemTransitionStyle = getItemTransitionStyle()
  const itemTransitionActive = pickListItemTransitionClasses.join(' ')

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
    :data-loading="loading || null"
    class="flex min-w-0 flex-col gap-(--spacing-xs)"
  >
    <h3
      :data-testid="`${testId}__header`"
      class="text-label-lg text-(--text-muted)"
    >
      <slot name="title">{{ title }}</slot>
    </h3>
    <TransitionGroup
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
        key="__pick-list-loading"
        role="presentation"
        :data-testid="`${testId}__loading`"
        :style="itemTransitionStyle"
        class="flex flex-1 items-center justify-center py-(--spacing-md)"
      >
        <Spinner class="size-6 text-(--text-muted)" />
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
        :style="itemTransitionStyle"
        class="cursor-pointer select-none rounded-(--shape-elements) px-(--spacing-sm) py-(--spacing-xs) text-body-md text-(--text-default) hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) data-[selected]:bg-(--bg-selected) aria-disabled:cursor-not-allowed"
        @click="ctx.toggleSelection(side, index)"
        @dblclick="ctx.itemDoubleClick($event, side, index)"
        @keydown="onOptionKeydown(index, $event)"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
          :list="side"
        />
      </li>
    </TransitionGroup>
  </section>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref, useAttrs, useId } from 'vue'

  import { useAnnouncer } from '../../../../composables/use-announcer'
  import { eventDirection, logicalArrowKey } from '../../../../composables/use-direction'
  import { useTranslate } from '../../../../composables/use-translate'
  import * as en from '../../../../locales/en'
  import { useChartCardContext } from '../composables/use-chart-card-context'
  import type { ChartCardMoveDirection } from '../injection-key'

  defineOptions({ name: 'ChartCardDragHandle', inheritAttrs: false })

  export interface ChartCardDragHandleProps {
    /** Accessible name of the handle. Empty reads Move plus the card title, or `Move card` without one. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ChartCardDragHandleProps>(), {
    ariaLabel: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ chartCard: en.chartCard })
  const ctx = useChartCardContext()
  const { announce } = useAnnouncer()
  const verbId = useId()
  const hintId = useId()
  const handleEl = ref<HTMLButtonElement | null>(null)

  const DIRECTIONS: Record<string, ChartCardMoveDirection> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  }

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'chart-card-drag-handle'
  )

  const named = computed<boolean>(() => !props.ariaLabel && ctx.hasTitle.value)

  async function announcePosition(): Promise<void> {
    await nextTick()
    const card = handleEl.value?.closest<HTMLElement>(`[data-testid="${ctx.testId}"]`)
    const siblings = card?.parentElement ? Array.from(card.parentElement.children) : []
    if (!card || siblings.length < 2) return
    const position = siblings.indexOf(card) + 1
    announce(t('chartCard.moved', { position, total: siblings.length }))
  }

  function onKeydown(event: globalThis.KeyboardEvent) {
    const direction = DIRECTIONS[logicalArrowKey(event.key, eventDirection(event))]
    if (!direction) return
    event.preventDefault()
    ctx.move(event, direction)
    void announcePosition()
  }

  const ROOT_CLASS =
    "relative -ms-(--spacing-2xs) inline-flex size-6 shrink-0 before:absolute before:-inset-2 pointer-coarse:before:-inset-2.5 before:content-[''] " +
    'cursor-grab items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance ' +
    'motion-reduce:transition-none hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) ' +
    'active:cursor-grabbing'
</script>

<template>
  <button
    v-if="ctx.draggable.value"
    ref="handleEl"
    v-bind="$attrs"
    type="button"
    :aria-label="named ? undefined : ariaLabel || t('chartCard.move')"
    :aria-labelledby="named ? `${verbId} ${ctx.titleId}` : undefined"
    :aria-describedby="hintId"
    :data-testid="testId"
    :class="ROOT_CLASS"
    @pointerdown="ctx.armDrag()"
    @pointerup="ctx.disarmDrag()"
    @pointercancel="ctx.disarmDrag()"
    @keydown="onKeydown"
  >
    <i
      class="az az-move"
      aria-hidden="true"
    />
    <span
      :id="verbId"
      hidden
      >{{ t('chartCard.moveVerb') }}</span
    >
    <span
      :id="hintId"
      hidden
      >{{ t('chartCard.moveHint') }}</span
    >
  </button>
</template>

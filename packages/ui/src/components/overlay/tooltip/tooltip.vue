<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { TOOLTIP_TRIGGER_CLASS } from './lib/trigger-class'
  import TooltipContent, { type TooltipContentState } from './parts/tooltip-content.vue'

  /** Side of the trigger the tooltip opens on; `start` and `end` follow the text direction. */
  export type TooltipSide = 'top' | 'bottom' | 'start' | 'end'
  /** Alignment of the tooltip along the trigger edge. */
  export type TooltipAlign = 'start' | 'center' | 'end'

  defineOptions({
    name: 'Tooltip',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  export interface TooltipProps {
    /** Plain text shown inside the tooltip. */
    content: string
    /** Side of the trigger the tooltip opens on, flipped when it does not fit; `'auto'` picks the side with the most room at open time. */
    side?: TooltipSide | 'auto'
    /** Alignment along the trigger edge. */
    align?: TooltipAlign
    /** Pixel gap between the trigger and the tooltip. */
    sideOffset?: number
    /** Hover-open delay in milliseconds. */
    delay?: number
    /** Disables tooltip activation. */
    disabled?: boolean
    /** Initial open state when uncontrolled. */
    defaultOpen?: boolean
  }

  const props = withDefaults(defineProps<TooltipProps>(), {
    side: 'top',
    align: 'center',
    sideOffset: 8,
    delay: 200,
    disabled: false,
    defaultOpen: false
  })

  /** Controlled open state. Use with v-model:open; while unbound the tooltip starts at defaultOpen. */
  const openModel = defineModel<boolean>('open', { default: undefined as never })

  const attrs = useAttrs()
  const triggerEl = ref<HTMLElement | null>(null)
  const state = ref<TooltipContentState>({
    open: openModel.value ?? props.defaultOpen,
    side: props.side === 'auto' ? 'top' : props.side,
    align: props.align
  })

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'tooltip')

  function getTrigger(): HTMLElement | null {
    return triggerEl.value
  }

  function onState(next: TooltipContentState) {
    state.value = next
  }
</script>

<template>
  <span
    ref="triggerEl"
    v-bind="attrs"
    :class="TOOLTIP_TRIGGER_CLASS"
    :data-testid="testId"
    :data-state="state.open ? 'open' : 'closed'"
    :data-disabled="disabled || null"
    :data-side="state.side"
    :data-align="state.align"
  >
    <slot />
  </span>

  <TooltipContent
    v-model:open="openModel"
    :trigger="getTrigger"
    :test-id="testId"
    :content="content"
    :side="side"
    :align="align"
    :side-offset="sideOffset"
    :delay="delay"
    :disabled="disabled"
    :default-open="defaultOpen"
    @state="onState"
  />
</template>

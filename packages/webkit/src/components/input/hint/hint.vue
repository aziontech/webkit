<script setup lang="ts">
  import { useEventListener } from '@vueuse/core'
  import { computed, ref, useAttrs } from 'vue'

  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  /** Side of the glyph the tooltip opens on; `start` and `end` follow the text direction. */
  export type HintSide = 'top' | 'bottom' | 'start' | 'end'

  defineOptions({
    name: 'Hint',
    inheritAttrs: false
  })

  export interface HintProps {
    /** Guidance text revealed on hover or focus, or by a tap on touch; also the trigger's accessible name. */
    content: string
    /** Side of the glyph the tooltip opens on, flipped when it does not fit; `'auto'` picks the side with the most room. */
    side?: HintSide | 'auto'
  }
  withDefaults(defineProps<HintProps>(), {
    side: 'top'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'hint')

  const triggerEl = ref<globalThis.HTMLButtonElement | null>(null)
  const open = ref(false)
  const pinned = ref(false)
  let tapping = false
  let pinnedAtPress = false

  const onPointerdown = (event: globalThis.PointerEvent) => {
    tapping = event.pointerType === 'touch'
    pinnedAtPress = pinned.value
  }

  const onClick = () => {
    if (!tapping) return
    tapping = false
    pinned.value = !pinnedAtPress
    if (!pinned.value) open.value = false
  }

  const unpin = () => {
    pinned.value = false
    open.value = false
  }

  useEventListener(
    () => (pinned.value ? globalThis.document : undefined),
    'pointerdown',
    (event: globalThis.PointerEvent) => {
      const target = event.target instanceof globalThis.Node ? event.target : null
      if (!triggerEl.value?.contains(target)) unpin()
    }
  )
  useEventListener(
    () => (pinned.value ? globalThis.document : undefined),
    'keydown',
    (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') unpin()
    }
  )

  const TRIGGER_CLASS =
    'relative inline-flex size-5 items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-150 ease-out ' +
    'hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <Tooltip
    v-bind="$attrs"
    :data-testid="testId"
    :content="content"
    :side="side"
    :open="pinned || open"
    @update:open="open = $event"
  >
    <button
      ref="triggerEl"
      type="button"
      :data-testid="`${testId}__trigger`"
      :aria-label="content"
      :class="TRIGGER_CLASS"
      @pointerdown="onPointerdown"
      @click.prevent="onClick"
      @focusout="unpin"
    >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute inset-[min(0rem,calc(50%-12px))] pointer-coarse:inset-[min(0rem,calc(50%-22px))]"
      />
      <i
        class="az az-circle-info text-body-xs"
        aria-hidden="true"
      />
    </button>
  </Tooltip>
</template>

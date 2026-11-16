<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  /** Side of the glyph the tooltip opens on; `start` and `end` follow the text direction. */
  export type HintSide = 'top' | 'bottom' | 'start' | 'end'

  defineOptions({
    name: 'Hint',
    inheritAttrs: false
  })

  export interface HintProps {
    /** Guidance text revealed on hover or focus; also the trigger's accessible name. */
    content: string
    /** Side of the glyph the tooltip opens on, flipped when it does not fit; `'auto'` picks the side with the most room. */
    side?: HintSide | 'auto'
  }
  withDefaults(defineProps<HintProps>(), {
    side: 'top'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'hint')
</script>

<template>
  <Tooltip
    v-bind="$attrs"
    :data-testid="testId"
    :content="content"
    :side="side"
  >
    <button
      type="button"
      :data-testid="`${testId}__trigger`"
      :aria-label="content"
      class="relative inline-flex size-5 items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      @click.prevent
    >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute inset-[min(0rem,calc(50%-12px))] pointer-coarse:inset-[min(0rem,calc(50%-22px))]"
      />
      <i
        class="ai ai-circle-info text-body-xs"
        aria-hidden="true"
      />
    </button>
  </Tooltip>
</template>

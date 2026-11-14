<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Tooltip from '../../overlay/tooltip/tooltip.vue'

  export type HintPlacement = 'top' | 'right' | 'bottom' | 'left' | 'auto'

  defineOptions({
    name: 'Hint',
    inheritAttrs: false
  })

  interface Props {
    /** Guidance text revealed on hover or focus; also the trigger's accessible name. */
    text: string
    /** Anchor side of the tooltip relative to the glyph. */
    placement?: HintPlacement
  }
  export type HintProps = Props

  withDefaults(defineProps<Props>(), {
    placement: 'top'
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'input-hint')
</script>

<template>
  <Tooltip
    v-bind="$attrs"
    :data-testid="testId"
    :text="text"
    :placement="placement"
  >
    <button
      type="button"
      :data-testid="`${testId}__trigger`"
      :aria-label="text"
      class="relative inline-flex size-5 items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      @click.prevent
    >
      <span
        aria-hidden="true"
        data-slot="touch-target"
        class="absolute inset-[min(0rem,calc(50%-12px))] pointer-coarse:inset-[min(0rem,calc(50%-22px))]"
      />
      <i
        class="pi pi-info-circle text-body-xs"
        aria-hidden="true"
      />
    </button>
  </Tooltip>
</template>

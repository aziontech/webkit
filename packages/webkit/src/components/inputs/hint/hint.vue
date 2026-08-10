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
    <!-- The glyph carries no action of its own: `.prevent` keeps a Hint rendered
         inside a label from toggling the control that label points at. -->
    <button
      type="button"
      :data-testid="`${testId}__trigger`"
      :aria-label="text"
      class="inline-flex size-5 items-center justify-center rounded-(--shape-button) text-(--text-muted) transition-colors duration-150 ease-out hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      @click.prevent
    >
      <i
        class="pi pi-info-circle text-body-xs"
        aria-hidden="true"
      />
    </button>
  </Tooltip>
</template>

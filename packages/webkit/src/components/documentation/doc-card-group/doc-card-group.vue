<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'

  /**
   * The grid a DocCard set sits in. Each cell paints a 1px ring just outside its
   * box, so neighbours' rings share the grid's 1px gap and read as one hairline
   * (never doubling), and an incomplete last row leaves no rule-coloured holes.
   */
  defineOptions({ name: 'DocCardGroup', inheritAttrs: false })

  /** Column count at the large breakpoint. */
  export type DocCardGroupCols = 1 | 2 | 3 | 4
  /** Column count on a phone. */
  export type DocCardGroupMobileCols = 1 | 2

  interface Props {
    /** Column count at the large breakpoint. */
    cols?: DocCardGroupCols
    /** Column count on a phone. Two only pays when the cells are a mark plus a word. */
    mobileCols?: DocCardGroupMobileCols
  }

  withDefaults(defineProps<Props>(), { cols: 2, mobileCols: 1 })

  defineSlots<{
    /** The `DocCard` children. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  // A consumer-supplied data-testid wins; otherwise the derived fallback.
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-card-group')
</script>

<template>
  <FrameBox
    v-bind="$attrs"
    :data-testid="testId"
    data-doc-block
    :data-cols="cols"
    class="w-full"
  >
    <div
      class="grid w-full gap-px [&>*]:ring-1 [&>*]:ring-(--border-default) data-[mobile-cols=1]:grid-cols-1 data-[mobile-cols=2]:grid-cols-2 data-[cols=2]:sm:grid-cols-2 data-[cols=3]:sm:grid-cols-2 data-[cols=3]:lg:grid-cols-3 data-[cols=4]:sm:grid-cols-2 data-[cols=4]:lg:grid-cols-4"
      :data-cols="cols"
      :data-mobile-cols="mobileCols"
    >
      <slot />
    </div>
  </FrameBox>
</template>

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
  export type DocCardGroupColumns = 1 | 2 | 3 | 4
  /** @deprecated since 6.0 — use `DocCardGroupColumns` instead. Removed in 7.0. */
  export type DocCardGroupCols = DocCardGroupColumns
  /** Column count on a phone. */
  export type DocCardGroupMobileColumns = 1 | 2

  interface Props {
    /** Column count at the large breakpoint. Unset falls back to the deprecated `cols`. */
    columns?: DocCardGroupColumns
    /**
     * @deprecated since 6.0 — use `columns` instead. Removed in 7.0. The `cols` attribute of a Markdown `CardGroup` still maps here.
     */
    cols?: DocCardGroupColumns
    /** Column count on a phone. Two only pays when the cells are a mark plus a word. */
    mobileColumns?: DocCardGroupMobileColumns
  }

  const props = withDefaults(defineProps<Props>(), {
    columns: undefined,
    cols: 2,
    mobileColumns: 1
  })

  defineSlots<{
    /** The `DocCard` children. */
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string) ?? 'documentation-doc-card-group')

  const count = computed<DocCardGroupColumns>(() => props.columns ?? props.cols)
</script>

<template>
  <FrameBox
    v-bind="$attrs"
    :data-testid="testId"
    data-doc-block
    :data-columns="count"
    class="w-full"
  >
    <div
      class="grid w-full gap-px [&>*]:ring-1 [&>*]:ring-(--border-default) data-[mobile-columns=1]:grid-cols-1 data-[mobile-columns=2]:grid-cols-2 data-[columns=2]:sm:grid-cols-2 data-[columns=3]:sm:grid-cols-2 data-[columns=3]:lg:grid-cols-3 data-[columns=4]:sm:grid-cols-2 data-[columns=4]:lg:grid-cols-4"
      :data-columns="count"
      :data-mobile-columns="mobileColumns"
    >
      <slot />
    </div>
  </FrameBox>
</template>

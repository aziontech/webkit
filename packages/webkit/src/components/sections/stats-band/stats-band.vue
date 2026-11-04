<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import BigNumbers from '../../marketing/big-numbers/big-numbers.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'StatsBand',
    inheritAttrs: false
  })

  /** One headline figure and the caption naming what it measures. */
  export type StatsBandItem = {
    /** The figure itself, set at big-number scale. */
    value: string
    /** Caption naming what the figure measures. */
    label: string
    /** Qualifier set before the figure. */
    prefix?: string
    /** Unit set after the figure. */
    suffix?: string
  }

  interface Props {
    /** The figures rendered as cells, in order; each item is `{ value, label, prefix?, suffix? }` where `value` is the figure, `label` its caption, and `prefix` / `suffix` the qualifier and unit set beside it. */
    items?: StatsBandItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-stats-band'
  )

  const hasItems = computed(() => props.items.length > 0)
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <BigNumbers :items="items" />
      </FrameBox>
    </SectionModule>
  </div>
</template>

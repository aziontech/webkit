<script setup lang="ts">
  import { h, useAttrs } from 'vue'

  import type { TransferListItemSlotProps } from '../injection-key'
  import TransferListPanel from '../parts/transfer-list-panel.vue'

  defineOptions({
    name: 'TransferListSource',
    inheritAttrs: false
  })

  export interface TransferListSourceProps {
    /** Heading text for the list; also its accessible name. */
    title?: string
    /** Shows a spinner in place of options and locks this list's controls while data loads. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TransferListSourceProps>(), {
    title: '',
    loading: false
  })

  const slots = defineSlots<{
    item(props: TransferListItemSlotProps): unknown
    title(): unknown
  }>()

  const attrs = useAttrs()

  const Panel = () => h(TransferListPanel, { ...attrs, ...props, side: 'source' }, slots)
</script>

<template>
  <Panel />
</template>

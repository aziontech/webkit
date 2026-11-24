<script setup lang="ts">
  import { h, useAttrs } from 'vue'

  import type { TransferListItemSlotProps } from '../injection-key'
  import TransferListPanel from '../parts/transfer-list-panel.vue'

  defineOptions({
    name: 'TransferListTarget',
    inheritAttrs: false
  })

  export interface TransferListTargetProps {
    /** Heading text for the list; also its accessible name. */
    title?: string
    /** Shows a spinner in place of options and locks this list's controls while data loads. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TransferListTargetProps>(), {
    title: '',
    loading: false
  })

  const slots = defineSlots<{
    item(props: TransferListItemSlotProps): unknown
    title(): unknown
  }>()

  const attrs = useAttrs()

  const Panel = () => h(TransferListPanel, { ...attrs, ...props, side: 'target' }, slots)
</script>

<template>
  <Panel />
</template>

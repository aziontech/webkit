<script setup lang="ts">
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import type { BigNumberItem } from '@aziontech/webkit/big-numbers'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'

  defineOptions({ name: 'StatsBand' })

  interface Props {
    /** In-page anchor for the band. */
    anchor?: string
    /** The figures, each a value with its caption and optional qualifier and unit. */
    items: BigNumberItem[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
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
</template>

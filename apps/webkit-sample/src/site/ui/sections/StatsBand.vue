<script setup lang="ts">
  import type { BigNumberItem } from '@aziontech/webkit/big-numbers'
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'StatsBand' })

  interface Props {
    /** In-page anchor for the band. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** Section headline over the figures; omit for a bare band. */
    title?: string
    /** Actions under the section title. */
    actions?: SiteAction[]
    /** The figures, each a value with its caption and optional qualifier and unit. */
    items: BigNumberItem[]
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    actions: () => []
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template
      v-if="title"
      #header
    >
      <SectionTitle
        :eyebrow="eyebrow"
        :title="title"
      >
        <template
          v-if="actions.length"
          #actions
        >
          <SectionAction
            v-for="action in actions"
            :key="action.label"
            :action="action"
          />
        </template>
      </SectionTitle>
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <BigNumbers :items="items" />
    </FrameBox>
  </SectionModule>
</template>

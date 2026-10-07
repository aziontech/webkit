<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import QuoteTabs, { type QuoteTabsItem } from '@aziontech/webkit/quote-tabs'
  import SectionModule from '@aziontech/webkit/section-module'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'ClientQuotes' })

  interface Props {
    /** The client cards in wall order, the page's own quotation first. */
    quotes: QuoteTabsItem[]
    /** Accessible name for the wall of client cards. */
    ariaLabel?: string
    /** Actions under the featured quotation, the same for every client. */
    actions?: SiteAction[]
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Client stories',
    actions: () => [
      {
        label: 'See success stories',
        href: '/site/success-cases',
        kind: 'secondary',
        trailing: true
      }
    ],
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
      marks="all"
    >
      <QuoteTabs
        :aria-label="ariaLabel"
        :items="quotes"
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
      </QuoteTabs>
    </FrameBox>
  </SectionModule>
</template>

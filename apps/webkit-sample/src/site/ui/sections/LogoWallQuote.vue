<script setup lang="ts">
  import type { Client } from '@aziontech/webkit/assets/client-registry'
  import FrameBox from '@aziontech/webkit/frame-box'
  import LogoWall, { type LogoItem } from '@aziontech/webkit/logo-wall'
  import Quote from '@aziontech/webkit/quote'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'LogoWallQuote' })

  type LogoWallQuoteClient = Pick<Client, 'name' | 'logo' | 'logoLight' | 'artwork'>

  export interface LogoWallQuoteItem extends LogoItem {
    /** The client behind the mark, placed per theme; without one the wall draws src as-is. */
    client?: LogoWallQuoteClient
  }

  export interface LogoWallQuoteQuote {
    /** The quotation. */
    text: string
    /** Who said it. */
    name?: string
    /** Their role and company. */
    jobTitle?: string
    /** The speaker's company, signing the quote with its mark. */
    client?: LogoWallQuoteClient
  }

  interface Props {
    /** Overline above the band title. */
    eyebrow?: string
    /** Band title over the wall. */
    title?: string
    /** The client marks, in wall order, each linked to its success story. */
    items: LogoWallQuoteItem[]
    /** Accessible name for the wall of marks. */
    ariaLabel?: string
    /** One client speaking beside the wall. */
    quote?: LogoWallQuoteQuote | null
    /** Actions under the quote's attribution. */
    actions?: SiteAction[]
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    ariaLabel: '',
    quote: null,
    actions: () => [],
    anchor: ''
  })

  const clientOf = (item: LogoItem) => (item as LogoWallQuoteItem).client
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
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <LogoWall
        kind="rectangle"
        :aria-label="ariaLabel"
        :items="items"
      >
        <template #mark="{ item }">
          <ClientMark
            v-if="clientOf(item)"
            :client="clientOf(item)!"
            mark="h-5 w-auto max-w-full object-contain sm:max-w-24"
          />
          <img
            v-else
            :src="item.src"
            :alt="item.alt"
            decoding="async"
            class="h-5 w-auto max-w-full object-contain sm:max-w-24"
          />
        </template>
        <template
          v-if="quote"
          #aside
        >
          <Quote
            kind="signed"
            :text="quote.text"
            :name="quote.name ?? ''"
            :job-title="quote.jobTitle ?? ''"
          >
            <template
              v-if="quote.client"
              #mark
            >
              <ClientMark
                :client="quote.client"
                mark="h-8 w-auto max-w-40 object-contain"
              />
            </template>
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
          </Quote>
        </template>
      </LogoWall>
    </FrameBox>
  </SectionModule>
</template>

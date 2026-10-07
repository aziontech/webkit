<script setup lang="ts">
  import Faq from '@aziontech/webkit/faq'
  import SectionModule from '@aziontech/webkit/section-module'

  import type { SiteFaqItem } from './types'

  defineOptions({ name: 'FaqSection' })

  interface Props {
    /** Heading on the panel's left. */
    title?: string
    /** Questions, single-open; an answer can continue into a link. */
    items: SiteFaqItem[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Frequently Asked Questions'
  })
</script>

<template>
  <SectionModule
    id="faq"
    :divided="false"
    :padded="false"
  >
    <Faq
      framed
      :title="title"
      :items="items"
    >
      <template #answer="{ item }">
        {{ item.answer
        }}<a
          v-if="(item as SiteFaqItem).link"
          :href="(item as SiteFaqItem).link?.href"
          target="_blank"
          rel="noopener"
          class="text-link"
          >{{ (item as SiteFaqItem).link?.label }}</a
        >{{ (item as SiteFaqItem).answerAfter }}
      </template>
    </Faq>
  </SectionModule>
</template>

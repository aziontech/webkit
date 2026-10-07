<script setup lang="ts">
  import Faq from '@aziontech/webkit/faq'
  import type { FaqItem } from '@aziontech/webkit/faq'
  import SectionModule from '@aziontech/webkit/section-module'

  import { useSiteLink } from '../../composables/use-site-link'
  import type { SiteFaqItem } from './types'

  defineOptions({ name: 'FaqSection' })

  interface Props {
    /** Heading on the panel's left. */
    title?: string
    /** Questions, single-open; an answer can continue into a link, or be a rich body of paragraphs and lists. */
    items: SiteFaqItem[]
  }

  withDefaults(defineProps<Props>(), {
    title: 'Frequently Asked Questions'
  })

  const { follow } = useSiteLink()

  const site = (item: FaqItem) => item as SiteFaqItem
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
        <span
          v-if="site(item).body?.length"
          class="flex flex-col gap-(--spacing-sm)"
        >
          <template
            v-for="(block, blockIndex) in site(item).body"
            :key="blockIndex"
          >
            <span
              v-if="block.type === 'p'"
              class="block"
            >
              <template
                v-for="(segment, segmentIndex) in block.segments"
                :key="segmentIndex"
              >
                <a
                  v-if="segment.href"
                  :href="segment.href"
                  :target="segment.external ? '_blank' : undefined"
                  :rel="segment.external ? 'noopener noreferrer' : undefined"
                  class="text-link"
                  @click="follow($event, segment.href)"
                  >{{ segment.text }}</a
                >
                <template v-else>{{ segment.text }}</template>
              </template>
            </span>
            <span
              v-else
              role="list"
              class="block space-y-(--spacing-xxs) pl-(--spacing-lg)"
            >
              <span
                v-for="(entry, entryIndex) in block.items"
                :key="entryIndex"
                role="listitem"
                class="list-item list-disc"
              >
                <template
                  v-for="(segment, segmentIndex) in entry"
                  :key="segmentIndex"
                >
                  <a
                    v-if="segment.href"
                    :href="segment.href"
                    :target="segment.external ? '_blank' : undefined"
                    :rel="segment.external ? 'noopener noreferrer' : undefined"
                    class="text-link"
                    @click="follow($event, segment.href)"
                    >{{ segment.text }}</a
                  >
                  <template v-else>{{ segment.text }}</template>
                </template>
              </span>
            </span>
          </template>
        </span>
        <template v-else
          >{{ item.answer
          }}<a
            v-if="site(item).link"
            :href="site(item).link?.href"
            target="_blank"
            rel="noopener"
            class="text-link"
            >{{ site(item).link?.label }}</a
          >{{ site(item).answerAfter }}</template
        >
      </template>
    </Faq>
  </SectionModule>
</template>

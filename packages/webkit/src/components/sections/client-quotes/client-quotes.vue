<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import QuoteTabs from '../../marketing/quote-tabs/quote-tabs.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ClientQuotes',
    inheritAttrs: false
  })

  export type { SectionTitleAction }

  /** One client quotation, featured while its client card is selected. */
  export type ClientQuotesItem = {
    /** The quotation itself. */
    text: string
    /** Who said it, the attribution's lead. */
    name?: string
    /** Their role and company, as one line under the name. */
    jobTitle?: string
    /** Registry name of the client's one-ink mark. */
    mark?: string
    /** URL of the client's colour logo; wins over mark. */
    logo?: string
    /** The client's name in prose, naming its card. */
    clientName?: string
    /** URL of the person's likeness, drawn beside the attribution. */
    photo?: string
  }

  export interface ClientQuotesProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Accessible name of the quote carousel. */
    ariaLabel?: string
    /** The quotes, in order. */
    items?: ClientQuotesItem[]
    /** Button under the quotes; omitted when absent. */
    primaryAction?: SectionTitleAction
    /** Advances to the next quote on a timer, as QuoteTabs does, with its visible pause control; pauses under the pointer or keyboard focus and never runs under reduced motion. */
    autoplay?: boolean
    /** Milliseconds each quote is held before the band advances. */
    autoplayInterval?: number
  }

  const props = withDefaults(defineProps<ClientQuotesProps>(), {
    anchor: '',
    ariaLabel: '',
    items: () => [],
    primaryAction: undefined,
    autoplay: true,
    autoplayInterval: 5000
  })

  /** Index of the selected quote, passed through to QuoteTabs; left unbound the band starts on the first quote. */
  const model = defineModel<number>({ default: 0 })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-client-quotes'
  )

  const quotes = computed(() => props.items.filter((item) => Boolean(item.text)))

  const hasItems = computed(() => quotes.value.length > 0)
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
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
        marks="all"
      >
        <QuoteTabs
          :aria-label="ariaLabel || undefined"
          v-model="model"
          :items="quotes"
          :autoplay="autoplay"
          :autoplay-interval="autoplayInterval"
        >
          <template #actions>
            <Button
              v-if="primaryAction"
              :label="primaryAction.label"
              :href="primaryAction.href"
              variant="secondary"
              size="large"
              :icon="primaryAction.trailing ? 'ai ai-chevron-right' : ''"
              icon-position="trailing"
              :animated="Boolean(primaryAction.trailing)"
            />
          </template>
        </QuoteTabs>
      </FrameBox>
    </SectionModule>
  </div>
</template>

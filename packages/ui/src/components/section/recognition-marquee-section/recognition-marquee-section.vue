<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import MarqueeLoop from '../../marketing/marquee/marquee-loop.vue'
  import Quote from '../../marketing/quote/quote.vue'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'RecognitionMarqueeSection',
    inheritAttrs: false
  })

  /** One recognition: the signed quote and the firm mark that backs it. */
  export type RecognitionMarqueeSectionItem = {
    /** The recognition sentence, rendered as the quotation. */
    text: string
    /** The report or award the recognition is signed by. */
    reportName: string
    /** Publication date of the report, shown as the attribution's second line. */
    date?: string
    /** Firm name, used as the alternative text of its mark. */
    firmName: string
    /** Firm mark shown on the dark theme, or on both themes when no light mark is given. */
    logo: string
    /** Firm mark shown on the light theme. */
    logoLight?: string
  }

  export interface RecognitionMarqueeSectionProps {
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Accessible name of the scrolling region. */
    ariaLabel?: string
    /** Seconds one loop of the strip takes; `0` paces it at twelve seconds per item. */
    duration?: number
    /** The recognitions, in order; each is `{ text, reportName, date?, firmName, logo, logoLight? }` where `logo` is the firm's mark on the dark theme and `logoLight` the one on the light theme. */
    items?: RecognitionMarqueeSectionItem[]
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<RecognitionMarqueeSectionProps>(), {
    eyebrow: '',
    title: '',
    ariaLabel: '',
    duration: 0,
    items: () => [],
    anchor: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'recognition-marquee-section'
  )

  const loopDuration = computed(() =>
    props.duration > 0 ? props.duration : props.items.length * 12
  )
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="title"
    :filled="items.length > 0"
    :eyebrow="eyebrow"
    :title="title"
  >
    <MarqueeLoop
      v-slot="{ duplicate }"
      :duration="loopDuration"
      :aria-label="ariaLabel"
    >
      <ul
        :data-duplicate="duplicate || null"
        :aria-hidden="duplicate ? 'true' : undefined"
        class="m-0 flex w-max shrink-0 list-none p-0 motion-reduce:data-[duplicate]:hidden"
      >
        <li
          v-for="(item, index) in items"
          :key="index"
          class="flex w-[85vw] max-w-(--container-md) shrink-0 sm:w-(--container-md)"
        >
          <RegistrationFrame
            borders="right"
            marks="all"
            class="w-full bg-(--bg-surface)"
          >
            <Quote
              variant="signed"
              :text="item.text"
              :name="item.reportName"
              :job-title="item.date"
              class="p-(--spacing-xl)"
            >
              <template #mark>
                <template v-if="item.logoLight">
                  <img
                    :src="item.logo"
                    :alt="item.firmName"
                    decoding="async"
                    class="h-8 w-auto max-w-40 object-contain hidden [[data-theme=dark]_&]:block"
                  />
                  <img
                    :src="item.logoLight"
                    :alt="item.firmName"
                    decoding="async"
                    class="h-8 w-auto max-w-40 object-contain block [[data-theme=dark]_&]:hidden"
                  />
                </template>
                <img
                  v-else
                  :src="item.logo"
                  :alt="item.firmName"
                  decoding="async"
                  class="h-8 w-auto max-w-40 object-contain"
                />
              </template>
            </Quote>
          </RegistrationFrame>
        </li>
      </ul>
    </MarqueeLoop>
  </SectionBand>
</template>

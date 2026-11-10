<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import Quote from '../../marketing/quote/quote.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'RecognitionMarquee',
    inheritAttrs: false
  })

  /** One recognition: the signed quote and the firm mark that backs it. */
  export type RecognitionMarqueeItem = {
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

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Accessible name of the scrolling region. */
    ariaLabel?: string
    /** Seconds one loop of the strip takes; `0` paces it at twelve seconds per item. */
    duration?: number
    /** The recognitions, in order; each is `{ text, reportName, date?, firmName, logo, logoLight? }` where `logo` is the firm's mark on the dark theme and `logoLight` the one on the light theme. */
    items?: RecognitionMarqueeItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    ariaLabel: '',
    duration: 0,
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-recognition-marquee'
  )

  const loopDuration = computed(() =>
    props.duration > 0 ? props.duration : props.items.length * 12
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="items.length > 0"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title.length > 0"
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
        <div
          role="region"
          :aria-label="ariaLabel || undefined"
          tabindex="0"
          class="group/loop overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset motion-reduce:overflow-x-auto"
        >
          <div
            :style="{ animationDuration: `${loopDuration}s` }"
            class="flex w-max animate-brand-marquee group-focus-within/loop:[animation-play-state:paused] group-hover/loop:[animation-play-state:paused] motion-reduce:animate-none"
          >
            <ul
              v-for="copy in 2"
              :key="copy"
              :data-duplicate="copy === 2 || null"
              :aria-hidden="copy === 2 ? 'true' : undefined"
              class="m-0 flex w-max shrink-0 list-none p-0 motion-reduce:data-[duplicate]:hidden"
            >
              <li
                v-for="(item, index) in items"
                :key="index"
                class="flex w-[85vw] max-w-(--container-md) shrink-0 sm:w-(--container-md)"
              >
                <FrameBox
                  borders="right"
                  marks="all"
                  class="w-full bg-(--bg-surface)"
                >
                  <Quote
                    kind="signed"
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
                </FrameBox>
              </li>
            </ul>
          </div>
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import NetworkMap from '../../content/network-map/network-map.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import Quote from '../../marketing/quote/quote.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'
  import Topic from '../../marketing/topic/topic.vue'

  defineOptions({
    name: 'NetworkSection',
    inheritAttrs: false
  })

  /** Which floor closes the band. */
  export type NetworkSectionKind = 'outcomes' | 'benefits'

  /** How a client mark is rendered: `monochrome` flattens it and inverts it in the dark theme, `as-is` keeps its colours. */
  export type NetworkSectionLogoTreatment = 'monochrome' | 'as-is'

  /** One client result, rendered as a quote cell on the `outcomes` floor. */
  export type NetworkSectionOutcome = {
    /** URL of the client mark. */
    logo: string
    /** Client name, read as the mark's alt text. */
    logoAlt: string
    /** Treatment applied to the mark; defaults to `as-is`. */
    logoTreatment?: NetworkSectionLogoTreatment
    /** The result, quoted. */
    text: string
    /** Phrases of `text` set in the accent. */
    highlights?: string[]
  }

  /** One benefit, rendered as a topic cell on the `benefits` floor. */
  export type NetworkSectionBenefit = {
    /** Icon class for the glyph that leads the benefit's heading. */
    icon: string
    /** The benefit, rendered as its h3. */
    title: string
    /** One sentence explaining the benefit. */
    description: string
  }

  interface Props {
    /** Which floor closes the band: `outcomes` renders the client quotes, `benefits` the icon-led topics. */
    kind?: NetworkSectionKind
    /** Overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the small section title as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Overline-set line above the claims. */
    lead?: string
    /** Short figures rendered as chips under the lead, in order. */
    claims?: string[]
    /** Client results for the `outcomes` floor, in order; each is `{ logo, logoAlt, logoTreatment?, text, highlights? }` where `logo` is the mark URL, `logoTreatment` is `'monochrome'` or `'as-is'`, and `highlights` are the phrases of `text` set in the accent. */
    outcomes?: NetworkSectionOutcome[]
    /** Topics for the `benefits` floor, in order; each is `{ icon, title, description }`. */
    benefits?: NetworkSectionBenefit[]
  }

  withDefaults(defineProps<Props>(), {
    kind: 'outcomes',
    eyebrow: '',
    title: '',
    lead: '',
    claims: () => [],
    outcomes: () => [],
    benefits: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-network-section'
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="title.length > 0"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="all"
        class="relative overflow-hidden"
      >
        <NetworkMap
          region="world"
          position="top-right"
          animated
          fade="left"
          :opacity="0.3"
          density="medium"
          :scale="1.3"
          :offset-x="0.5"
          :offset-y="-0.22"
          class="max-md:hidden md:max-lg:[--network-map-fade-start:70%] md:max-lg:[--network-map-fade-end:100%]"
        />

        <div class="relative flex h-full flex-col">
          <div
            class="relative flex min-h-[38rem] flex-col justify-between gap-(--spacing-xl) p-(--spacing-xxl) md:min-h-[clamp(36rem,60vh,40rem)] lg:min-h-[clamp(340px,52vh,620px)]"
          >
            <SectionTitle
              :framed="false"
              kind="left"
              size="small"
              :eyebrow="eyebrow"
              :title="title"
              class="relative [&_h2]:max-w-(--container-lg)"
            />

            <div
              class="relative -mx-(--spacing-xxl) min-h-48 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_75%,transparent)] md:hidden"
            >
              <NetworkMap
                region="world"
                position="center"
                animated
                :opacity="0.3"
                density="medium"
                :scale="1.8"
                :offset-x="0.24"
                :offset-y="0.03"
              />
            </div>

            <div class="relative flex flex-col gap-(--spacing-md)">
              <p
                v-if="lead"
                class="m-0 text-overline-md text-(--text-muted)"
              >
                {{ lead }}
              </p>

              <ul
                v-if="claims.length"
                class="m-0 flex max-w-(--container-sm) list-none flex-wrap gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="claim in claims"
                  :key="claim"
                  class="inline-flex h-6 items-center rounded-(--shape-elements) border border-(--primary) bg-[color-mix(in_srgb,var(--primary)_10%,var(--bg-canvas))] px-(--spacing-xs) text-label-sm text-(--text-default)"
                >
                  {{ claim }}
                </li>
              </ul>
            </div>
          </div>

          <CardGrid
            key="card-grid-1"
            v-if="kind === 'outcomes' && outcomes.length"
            flush
            kind="frame"
            :columns="4"
            class="border-t border-(--border-default)"
          >
            <CardGridCell
              v-for="outcome in outcomes"
              :key="outcome.logoAlt"
              kind="canvas"
            >
              <Quote
                :text="outcome.text"
                :highlights="outcome.highlights ?? []"
                class="h-full"
              >
                <template #mark>
                  <img
                    :src="outcome.logo"
                    :alt="outcome.logoAlt"
                    decoding="async"
                    :data-treatment="outcome.logoTreatment ?? 'as-is'"
                    class="h-full w-auto max-w-32 object-contain data-[treatment=monochrome]:brightness-0 [[data-theme=dark]_&[data-treatment=monochrome]]:invert"
                  />
                </template>
              </Quote>
            </CardGridCell>
          </CardGrid>

          <CardGrid
            key="card-grid-2"
            v-else-if="kind === 'benefits' && benefits.length"
            flush
            kind="frame"
            :columns="3"
            class="border-t border-(--border-default)"
          >
            <CardGridCell
              v-for="benefit in benefits"
              :key="benefit.title"
              kind="canvas"
            >
              <Topic
                :heading-level="3"
                :icon="benefit.icon"
                :title="benefit.title"
                :description="benefit.description"
              />
            </CardGridCell>
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>

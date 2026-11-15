<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import NetworkMap from '../../content/network-map/network-map.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import BigNumbers from '../../marketing/big-numbers/big-numbers.vue'
  import type { CardGridColumns } from '../../marketing/card-grid/card-grid.vue'
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
  export type NetworkSectionVariant = 'outcomes' | 'benefits' | 'stats'

  /** How a client mark is rendered: `monochrome` flattens it and inverts it in the dark theme, `as-is` keeps its colours. */
  export type NetworkSectionLogoTreatment = 'monochrome' | 'as-is'

  /** One client result, rendered as a quote cell on the `outcomes` floor. */
  export type NetworkSectionOutcome = {
    /** URL of the client mark; the cell renders no mark when it is absent. */
    logo?: string
    /** Client name, read as the mark's alt text. */
    logoAlt?: string
    /** Treatment applied to the mark; defaults to `as-is`. */
    logoTreatment?: NetworkSectionLogoTreatment
    /** The result, quoted. */
    text: string
    /** Phrases of `text` set in the accent. */
    highlights?: string[]
  }

  /** One benefit, rendered as a topic on the `benefits` floor. */
  export type NetworkSectionBenefit = {
    /** The benefit in a few words, the topic's h3. */
    title: string
    /** One or two sentences that explain the benefit. */
    description: string
    /** Icon class of a glyph that leads the topic. */
    icon?: string
  }

  /** One claim chip that can sit out the narrow band. */
  export type NetworkSectionClaim = {
    /** The claim, a few words. */
    label: string
    /** Shows the chip below the medium breakpoint; `false` keeps it to wider screens. Defaults to `true`. */
    mobile?: boolean
  }

  /** One headline figure on the `stats` floor. */
  export type NetworkSectionStat = {
    /** The figure itself. */
    value: string
    /** Caption naming what the figure measures. */
    label: string
    /** Qualifier set before the figure. */
    prefix?: string
    /** Unit set after the figure. */
    suffix?: string
  }

  interface Props {
    /** Which floor closes the band: `outcomes` renders the client quotes, `benefits` the benefit topics on up to three columns, `stats` the headline figures. */
    variant?: NetworkSectionVariant
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the small section title as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Overline-set line above the claims. */
    claimsEyebrow?: string
    /** Short figures rendered as chips under the claims eyebrow, in order; each is a string or `{ label, mobile? }`, where `mobile: false` hides the chip below the medium breakpoint. */
    claims?: (string | NetworkSectionClaim)[]
    /** Client results for the `outcomes` floor, in order, one column each up to four; each is `{ logo?, logoAlt?, logoTreatment?, text, highlights? }` where `logo` is the mark URL (the cell renders no mark without it), `logoAlt` names the client, `logoTreatment` is `'monochrome'` or `'as-is'`, and `highlights` are the phrases of `text` set in the accent. */
    outcomes?: NetworkSectionOutcome[]
    /** Topics for the `benefits` floor, in order, on up to three columns balanced so every row is full; each is `{ title, description, icon? }`, rendered as a topic whose title is an `h3`. */
    benefits?: NetworkSectionBenefit[]
    /** Figures for the `stats` floor, in order, rendered by `big-numbers`; each is `{ value, label, prefix?, suffix? }`. */
    stats?: NetworkSectionStat[]
  }

  const props = withDefaults(defineProps<Props>(), {
    variant: 'outcomes',
    anchor: '',
    eyebrow: '',
    title: '',
    claimsEyebrow: '',
    claims: () => [],
    outcomes: () => [],
    benefits: () => [],
    stats: () => []
  })

  const attrs = useAttrs()

  const floorColumns = (count: number): CardGridColumns => (count <= 2 ? 2 : count === 3 ? 3 : 4)

  const outcomeColumns = computed<CardGridColumns>(() => floorColumns(props.outcomes.length))

  const chips = computed(() =>
    props.claims.map((claim) =>
      typeof claim === 'string'
        ? { label: claim, mobile: true }
        : { label: claim.label, mobile: claim.mobile ?? true }
    )
  )

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-network-section'
  )
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-variant="variant"
    :aria-label="title || undefined"
    class="scroll-mt-(--spacing-2xl)"
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
            class="relative flex min-h-[38rem] flex-col justify-between gap-(--spacing-xl) p-(--spacing-2xl) md:min-h-[clamp(36rem,60vh,40rem)] lg:min-h-[clamp(340px,52vh,620px)]"
          >
            <SectionTitle
              :framed="false"
              variant="start"
              size="small"
              :eyebrow="eyebrow"
              :title="title"
              class="relative [&_h2]:max-w-(--container-lg)"
            />

            <div
              class="relative -mx-(--spacing-2xl) min-h-48 flex-1 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_75%,transparent)] md:hidden"
            >
              <NetworkMap
                region="world"
                position="center"
                animated
                :opacity="0.3"
                density="medium"
                :scale="3.3"
                :offset-x="0.31"
                :offset-y="0.14"
              />
            </div>

            <div class="relative flex flex-col gap-(--spacing-md)">
              <p
                v-if="claimsEyebrow"
                class="m-0 text-overline-md text-(--text-muted)"
              >
                {{ claimsEyebrow }}
              </p>

              <ul
                v-if="chips.length"
                class="m-0 flex max-w-(--container-sm) list-none flex-wrap gap-(--spacing-xs) p-0"
              >
                <li
                  v-for="claim in chips"
                  :key="claim.label"
                  :data-mobile="claim.mobile ? null : 'hidden'"
                  class="inline-flex h-6 items-center rounded-(--shape-control) border border-(--primary) bg-[color-mix(in_srgb,var(--primary)_10%,var(--bg-canvas))] px-(--spacing-xs) text-label-sm text-(--text-default) max-md:data-[mobile=hidden]:hidden sm:h-7 sm:px-(--spacing-sm) sm:text-label-md"
                >
                  {{ claim.label }}
                </li>
              </ul>
            </div>
          </div>

          <CardGrid
            key="card-grid-1"
            v-if="variant === 'outcomes' && outcomes.length"
            flush
            variant="frame"
            :columns="outcomeColumns"
            class="border-t border-(--border-default)"
          >
            <CardGridCell
              v-for="outcome in outcomes"
              :key="outcome.logoAlt || outcome.text"
              variant="canvas"
            >
              <Quote
                :text="outcome.text"
                :highlights="outcome.highlights ?? []"
                class="h-full"
              >
                <template
                  v-if="outcome.logo"
                  #mark
                >
                  <img
                    :src="outcome.logo"
                    :alt="outcome.logoAlt ?? ''"
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
            v-else-if="variant === 'benefits' && benefits.length"
            flush
            variant="frame"
            :columns="3"
            class="border-t border-(--border-default)"
          >
            <CardGridCell
              v-for="benefit in benefits"
              :key="benefit.title"
              variant="canvas"
            >
              <Topic
                :heading-level="3"
                :icon="benefit.icon ?? ''"
                :title="benefit.title"
                :description="benefit.description"
              />
            </CardGridCell>
          </CardGrid>

          <BigNumbers
            v-else-if="variant === 'stats' && stats.length"
            key="big-numbers"
            :items="stats"
            class="border-t border-(--border-default)"
          />
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>

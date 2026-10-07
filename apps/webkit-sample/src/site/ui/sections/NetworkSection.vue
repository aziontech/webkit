<script setup lang="ts">
  import { CLIENTS } from '@aziontech/webkit/assets/client-registry'
  import type { BigNumberItem } from '@aziontech/webkit/big-numbers'
  import BigNumbers from '@aziontech/webkit/big-numbers'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import NetworkMap from '@aziontech/webkit/network-map'
  import Quote from '@aziontech/webkit/quote'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import Topic from '@aziontech/webkit/topic'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  import type { SiteTopic } from './types'

  defineOptions({ name: 'NetworkSection' })

  /** quotes: client outcomes signed by their logos; benefits: three network benefits; stats: four figures. */
  export type NetworkSectionKind = 'quotes' | 'benefits' | 'stats'

  export interface NetworkOutcome {
    /** Client registry name whose logo signs the outcome. */
    client: string
    /** The outcome, one sentence. */
    text: string
    /** Phrases of the sentence set in the accent. */
    highlights?: string[]
    /** Draws the logo in one ink that follows the theme. */
    monochrome?: boolean
  }

  interface Props {
    /** What stands on the band's floor. */
    kind?: NetworkSectionKind
    /** In-page anchor for the band. */
    anchor?: string
    /** Overline above the title. */
    eyebrow?: string
    /** The network claim. */
    title: string
    /** Muted line above the claim chips. */
    lead?: string
    /** Infrastructure claims, one chip each. */
    claims?: string[]
    /** Client outcomes on the quotes floor, four to a row. */
    outcomes?: NetworkOutcome[]
    /** Benefits on the benefits floor, three to a row. */
    benefits?: SiteTopic[]
    /** Figures on the stats floor, each a value with its caption. */
    stats?: BigNumberItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'quotes',
    anchor: '',
    eyebrow: '',
    lead: '',
    claims: () => [],
    outcomes: () => [],
    benefits: () => [],
    stats: () => []
  })

  const floor = computed(() =>
    props.outcomes.map((outcome) => ({
      ...outcome,
      mark: CLIENTS.find((client) => client.name === outcome.client) ?? null
    }))
  )
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
      class="relative overflow-hidden"
    >
      <div
        class="max-md:hidden md:max-lg:[--network-map-fade-start:70%] md:max-lg:[--network-map-fade-end:100%]"
      >
        <NetworkMap
          region="world"
          position="top-right"
          animated
          fade="left"
          :opacity="0.3"
          density="medium"
          :scale="1.3"
          :offset-x="0.4"
          :offset-y="-0.2"
        />
      </div>

      <div class="relative flex h-full flex-col">
        <div
          class="relative flex min-h-[38rem] flex-col justify-between gap-(--spacing-xl) p-(--spacing-xxl) md:min-h-[clamp(36rem,60vh,40rem)] lg:min-h-[clamp(340px,52vh,620px)]"
        >
          <div class="relative [&_h2]:max-w-[16em]">
            <SectionTitle
              :framed="false"
              kind="left"
              size="small"
              :eyebrow="eyebrow"
              :title="title"
            />
          </div>

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
              class="m-0 text-overline-sm text-(--text-muted)"
            >
              {{ lead }}
            </p>

            <ul
              v-if="claims.length"
              class="m-0 flex list-none flex-wrap gap-(--spacing-xs) p-0"
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
          v-if="kind === 'quotes' && floor.length"
          key="quotes"
          flush
          kind="frame"
          :columns="4"
          class="border-t border-(--border-default)"
        >
          <CardGridCell
            v-for="outcome in floor"
            :key="outcome.client"
            kind="canvas"
          >
            <Quote
              :text="outcome.text"
              :highlights="outcome.highlights ?? []"
            >
              <template
                v-if="outcome.mark"
                #mark
              >
                <ClientMark
                  :client="outcome.mark"
                  :monochrome="outcome.monochrome ?? false"
                  mark="h-full w-auto max-w-32 object-contain"
                />
              </template>
            </Quote>
          </CardGridCell>
        </CardGrid>

        <CardGrid
          v-else-if="kind === 'benefits' && benefits.length"
          key="benefits"
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
              :icon="benefit.icon ?? ''"
              :title="benefit.title"
              :description="benefit.description"
            />
          </CardGridCell>
        </CardGrid>

        <BigNumbers
          v-else-if="kind === 'stats' && stats.length"
          :items="stats"
          class="border-t border-(--border-default)"
        />
      </div>
    </FrameBox>
  </SectionModule>
</template>

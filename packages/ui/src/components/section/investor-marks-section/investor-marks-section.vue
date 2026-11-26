<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import BentoGrid from '../../layout/bento-grid/bento-grid.vue'
  import BentoGridCell from '../../layout/bento-grid/bento-grid-cell/bento-grid-cell.vue'
  import { linkedCell } from '../lib/linked-cell'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'InvestorMarksSection',
    inheritAttrs: false
  })

  /** One investor, rendered as a linked mark cell. */
  export type InvestorMarksSectionItem = {
    /** The investor's name; it is the mark's alt text and the end of the link's accessible name. */
    name: string
    /** Mark shown on the dark theme. */
    logo: string
    /** Mark shown on the light theme; when omitted the one `logo` serves both themes. */
    logoLight?: string
    /** Destination the cell links to; opens in a new tab. */
    href: string
  }

  export interface InvestorMarksSectionProps {
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Line revealed under a mark on hover, and the start of each link's accessible name. */
    linkLabel?: string
    /** The investors, in order; each is `{ name, logo, logoLight?, href }` where `logo` is the mark on the dark theme and `logoLight` the one on the light theme. */
    items?: InvestorMarksSectionItem[]
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<InvestorMarksSectionProps>(), {
    eyebrow: '',
    title: '',
    linkLabel: '',
    items: () => [],
    anchor: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'investor-marks-section'
  )

  const hasItems = computed(() => props.items.length > 0)

  const INVESTOR_MARK_CLASS =
    'flex items-center justify-center transition-[translate] duration-moderate-01 ease-productive-entrance ' +
    'group-hover/investor:-translate-y-(--spacing-sm) group-focus-visible/investor:-translate-y-(--spacing-sm) motion-reduce:transition-none'

  const INVESTOR_HINT_CLASS =
    'pointer-events-none absolute inset-x-0 top-1/2 mt-(--spacing-md) flex translate-y-1 items-center justify-center gap-(--spacing-2xs) whitespace-nowrap text-overline-md uppercase ' +
    'text-(--text-default) opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance ' +
    'group-hover/investor:translate-y-0 group-hover/investor:opacity-100 group-focus-visible/investor:translate-y-0 group-focus-visible/investor:opacity-100 ' +
    'motion-reduce:transition-none'
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :anchor="anchor"
    :label="title"
    :eyebrow="eyebrow"
    :title="title"
    align="center"
    marks="bottom"
    :filled="hasItems"
  >
    <BentoGrid
      flush
      :columns="2"
    >
      <BentoGridCell
        v-for="item in items"
        :key="item.href + item.name"
        :padded="false"
      >
        <a
          v-bind="linkedCell({ href: item.href, target: '_blank' })"
          :aria-label="`${linkLabel}, ${item.name} (opens in a new tab)`"
          class="group/investor flex h-48 w-full items-center justify-center p-(--spacing-xl)"
        >
          <span :class="INVESTOR_MARK_CLASS">
            <template v-if="item.logoLight">
              <img
                :src="item.logo"
                :alt="item.name"
                decoding="async"
                class="h-8 w-auto max-w-48 object-contain hidden [[data-theme=dark]_&]:block"
              />
              <img
                :src="item.logoLight"
                :alt="item.name"
                decoding="async"
                class="h-8 w-auto max-w-48 object-contain block [[data-theme=dark]_&]:hidden"
              />
            </template>
            <img
              v-else
              :src="item.logo"
              :alt="item.name"
              decoding="async"
              class="h-8 w-auto max-w-48 object-contain"
            />
          </span>
          <span
            aria-hidden="true"
            :class="INVESTOR_HINT_CLASS"
          >
            {{ linkLabel }}
            <i class="az az-arrow-up-right leading-none" />
          </span>
        </a>
      </BentoGridCell>
    </BentoGrid>
  </SectionBand>
</template>

<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import BentoGrid from '../../marketing/bento-grid/bento-grid.vue'
  import BentoGridCell from '../../marketing/bento-grid/bento-grid-cell/bento-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'InvestorMarks',
    inheritAttrs: false
  })

  /** One investor, rendered as a linked mark cell. */
  export type InvestorMarksItem = {
    /** The investor's name; it is the mark's alt text and the end of the link's accessible name. */
    name: string
    /** Mark shown on the dark theme. */
    logo: string
    /** Mark shown on the light theme; when omitted the one `logo` serves both themes. */
    logoLight?: string
    /** Destination the cell links to; opens in a new tab. */
    href: string
  }

  interface Props {
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the centered section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Line revealed under a mark on hover, and the start of each link's accessible name. */
    linkLabel?: string
    /** The investors, in order; each is `{ name, logo, logoLight?, href }` where `logo` is the mark on the dark theme and `logoLight` the one on the light theme. */
    items?: InvestorMarksItem[]
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    linkLabel: '',
    items: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-investor-marks'
  )

  const hasItems = computed(() => props.items.length > 0)

  const hasHeading = computed(() => props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="hasItems"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasHeading"
        #header
      >
        <SectionTitle
          kind="centered"
          :eyebrow="eyebrow"
          :title="title"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="bottom"
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
              :href="item.href"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="`${linkLabel}, ${item.name} (opens in a new tab)`"
              class="group/investor relative isolate flex h-48 w-full items-center justify-center p-(--spacing-xl) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:before:opacity-100 motion-reduce:before:transition-none"
            >
              <span
                class="flex items-center justify-center transition-[translate] duration-moderate-01 ease-productive-entrance group-hover/investor:-translate-y-(--spacing-sm) group-focus-visible/investor:-translate-y-(--spacing-sm) motion-reduce:transition-none"
              >
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
                class="pointer-events-none absolute inset-x-0 top-1/2 mt-(--spacing-md) flex translate-y-1 items-center justify-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md uppercase text-(--text-default) opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/investor:translate-y-0 group-hover/investor:opacity-100 group-focus-visible/investor:translate-y-0 group-focus-visible/investor:opacity-100 motion-reduce:transition-none"
              >
                {{ linkLabel }}
                <i class="pi pi-arrow-up-right leading-none" />
              </span>
            </a>
          </BentoGridCell>
        </BentoGrid>
      </FrameBox>
    </SectionModule>
  </section>
</template>

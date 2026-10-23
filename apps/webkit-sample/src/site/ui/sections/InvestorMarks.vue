<script setup lang="ts">
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGrid from '@aziontech/webkit/bento-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'

  defineOptions({ name: 'InvestorMarks' })

  export interface InvestorMarksItem {
    /** The investor's name, the mark's alternative text. */
    name: string
    /** URL of the mark drawn on the dark theme. */
    logo: string
    /** URL of the mark drawn on the light theme. */
    logoLight?: string
    /** The investor's website, opened in a new tab. */
    href: string
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** The section's headline. */
    title: string
    /** The investors, one cell each, in reading order. */
    items: InvestorMarksItem[]
    /** Words revealed under a mark on hover and focus, and the lead of its link's accessible name. */
    linkLabel?: string
  }

  withDefaults(defineProps<Props>(), { anchor: '', linkLabel: 'Visit website' })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="centered"
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
        :aria-label="title"
      >
        <BentoGridCell
          v-for="item in items"
          :key="item.name"
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
              <ClientMark
                :client="item"
                mark="h-8 w-auto max-w-48 object-contain"
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
</template>

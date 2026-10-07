<script setup lang="ts">
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import MediaSplit from '@aziontech/webkit/media-split'
  import SectionModule from '@aziontech/webkit/section-module'

  import { useSiteLink } from '../../composables/use-site-link'
  import { CERTIFICATIONS } from '../../data/certifications.js'
  import type { SiteLink } from './types'

  defineOptions({ name: 'ComplianceBadges' })

  export interface ComplianceBadgesCertification {
    /** Name on the checked chip. */
    label: string
    /** URL of the certifying body's colour badge. */
    badge: string
    /** Alternative text for the badge. */
    alt: string
  }

  interface Props {
    /** Overline above the title. */
    eyebrow?: string
    /** The compliance claim. */
    title?: string
    /** One sentence under the title. */
    description?: string
    /** The certifications, each a badge over a checked chip. */
    certifications?: ComplianceBadgesCertification[]
    /** The cell closing the grid, linking to the compliance page. */
    more?: SiteLink | null
    /** Accessible name for the list of certifications. */
    ariaLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: 'Scale with Confidence',
    title: 'Security and Compliance for High-Stakes Digital Experiences',
    description:
      "We're committed to making sure our customers and global partners can meet a wide range of compliance requirements.",
    certifications: () => CERTIFICATIONS,
    more: () => ({ label: 'See more', href: '/site/compliance' }),
    ariaLabel: 'Compliance certifications',
    anchor: ''
  })

  const { follow } = useSiteLink()
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <MediaSplit
      framed
      align="center"
      texture="none"
      size="large"
      :eyebrow="eyebrow"
      :title="title"
      :description="description"
    >
      <template #media>
        <CardGrid
          flush
          kind="frame"
          :columns="3"
          :mobile-columns="2"
          role="list"
          :aria-label="ariaLabel"
          class="w-full self-stretch"
        >
          <CardGridCell
            v-for="certification in certifications"
            :key="certification.label"
            kind="surface"
            :padded="false"
            role="listitem"
          >
            <div
              class="flex h-full flex-col items-center justify-center gap-(--spacing-lg) px-(--spacing-sm) py-(--spacing-xl)"
            >
              <img
                :src="certification.badge"
                :alt="certification.alt"
                loading="lazy"
                decoding="async"
                class="h-16 w-24 object-contain"
              />
              <span
                class="inline-flex h-7 items-center gap-(--spacing-xs) whitespace-nowrap rounded-full border border-(--border-muted) bg-(--bg-surface-raised) pr-(--spacing-sm) pl-(--spacing-xxs) text-overline-sm text-(--text-default)"
              >
                <span
                  aria-hidden="true"
                  class="flex size-5 shrink-0 items-center justify-center rounded-full bg-(--success-contrast) text-tag-sm text-(--success)"
                >
                  <i class="pi pi-check text-[length:inherit] leading-none" />
                </span>
                {{ certification.label }}
              </span>
            </div>
          </CardGridCell>

          <CardGridCell
            v-if="more"
            kind="surface"
            :padded="false"
            role="listitem"
          >
            <a
              :href="more.href"
              class="group/more flex h-full items-center justify-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xl) text-overline-md uppercase text-(--text-muted) transition-colors duration-moderate-02 ease-expressive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:bg-(--bg-hover) focus-visible:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:outline-none motion-reduce:transition-none"
              @click="follow($event, more.href)"
            >
              {{ more.label }}
              <i
                aria-hidden="true"
                class="pi pi-chevron-right shrink-0 text-[length:inherit] leading-none transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/more:translate-x-0.5 motion-reduce:transition-none"
              />
            </a>
          </CardGridCell>
        </CardGrid>
      </template>
    </MediaSplit>
  </SectionModule>
</template>

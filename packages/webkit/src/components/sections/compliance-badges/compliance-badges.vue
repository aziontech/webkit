<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import MediaSplit from '../../marketing/media-split/media-split.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ComplianceBadges',
    inheritAttrs: false
  })

  /** The closing "see more" cell. */
  export type ComplianceBadgesAction = {
    /** Visible label of the link. */
    label: string
    /** Destination the link points to. */
    href: string
  }

  /** One certification badge in the grid. */
  export type ComplianceBadgesCertification = {
    /** Text of the check-marked pill under the badge. */
    label: string
    /** URL of the badge picture. */
    badge: string
    /** Alternative text naming the certification. */
    alt: string
  }

  interface Props {
    /** Overline above the headline. */
    eyebrow?: string
    /** Headline of the band, rendered by the media split as its `h2`; the band renders nothing when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** Accessible name of the badge list. */
    ariaLabel?: string
    /** The badges, in order; each is `{ label, badge, alt }`. */
    certifications?: ComplianceBadgesCertification[]
    /** The closing "see more" cell; `{ label, href }`. Omitted when absent. */
    primaryAction?: ComplianceBadgesAction
  }

  withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    description: '',
    ariaLabel: '',
    certifications: () => [],
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-compliance-badges'
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="title.length > 0"
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
            :aria-label="ariaLabel || undefined"
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
              v-if="primaryAction"
              kind="surface"
              :padded="false"
              role="listitem"
            >
              <a
                :href="primaryAction.href"
                class="group/more flex h-full items-center justify-center gap-(--spacing-xs) px-(--spacing-sm) py-(--spacing-xl) text-overline-md uppercase text-(--text-muted) transition-colors duration-moderate-02 ease-expressive-entrance hover:bg-(--bg-hover) hover:text-(--text-default) focus-visible:bg-(--bg-hover) focus-visible:text-(--text-default) focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset focus-visible:outline-none motion-reduce:transition-none"
              >
                {{ primaryAction.label }}
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
  </div>
</template>

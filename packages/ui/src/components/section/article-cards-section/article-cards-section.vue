<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import type { ThirdPartyLogoMark } from '../../content/third-party-logo/third-party-logo.vue'
  import CardGrid from '../../layout/card-grid/card-grid.vue'
  import CardGridCell from '../../layout/card-grid/card-grid-cell/card-grid-cell.vue'
  import { linkedCell } from '../lib/linked-cell'
  import SectionBand from '../parts/section-band.vue'

  defineOptions({
    name: 'ArticleCardsSection',
    inheritAttrs: false
  })

  export type { ThirdPartyLogoMark }

  /** Placement of the band heading. */
  export type ArticleCardsSectionAlign = 'start' | 'center'

  /** One linked article card. */
  export type ArticleCardsSectionItem = {
    /** Stable identity of the card within the band. */
    id: string
    /** Destination the card links to. */
    href: string
    /** Headline of the article. */
    title: string
    /** One or two sentences under the headline. */
    description: string
    /** Eyebrow pinned to the foot, usually the date and read time. */
    meta: string
    /** URL of the cover drawn in the media cell. */
    image?: string
    /** Client mark drawn in the media cell when there is no cover. */
    mark?: ThirdPartyLogoMark
    /** Where the destination opens; `_blank` opens it in a new tab. */
    target?: '_blank' | '_self'
  }

  export interface ArticleCardsSectionProps {
    /** Placement of the heading: `start` sets it at the start, `center` centres it over the cards. */
    align?: ArticleCardsSectionAlign
    /** Id set on the band so an in-page hash link can target it. */
    anchor?: string
    /** Eyebrow above the heading. */
    eyebrow?: string
    /** Headline of the band; the band renders no header when empty. */
    title?: string
    /** The cards, in order; each is `{ id, href, title, description, meta, image?, mark?, target? }`; a card whose `target` is `_blank` opens in a new tab. */
    items?: ArticleCardsSectionItem[]
    /** Accessible name of the card grid. */
    ariaLabel?: string
  }

  withDefaults(defineProps<ArticleCardsSectionProps>(), {
    align: 'start',
    anchor: '',
    eyebrow: '',
    title: '',
    items: () => [],
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ common: en.common })

  const failedCovers = ref<ReadonlySet<string>>(new Set())

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'article-cards-section'
  )

  const MARK_IMAGE_CLASS =
    'h-8 w-auto max-w-40 object-contain transition-[scale] duration-moderate-02 ease-productive-entrance ' +
    'group-hover/post:scale-105 motion-reduce:transition-none brightness-0 ' +
    '[[data-theme=dark]_&]:invert'
</script>

<template>
  <SectionBand
    v-bind="$attrs"
    :data-testid="testId"
    :data-align="align"
    :anchor="anchor"
    :label="title"
    :eyebrow="eyebrow"
    :title="title"
    :align="align"
    :filled="items.length > 0"
  >
    <CardGrid
      flush
      variant="frame"
      :columns="3"
      :mobile-columns="1"
      :role="ariaLabel ? 'group' : undefined"
      :aria-label="ariaLabel || undefined"
    >
      <CardGridCell
        v-for="item in items"
        :key="item.id"
        variant="canvas"
        :padded="false"
      >
        <a
          v-bind="linkedCell(item)"
          class="group/post flex h-full flex-col"
        >
          <span
            class="flex aspect-video items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface)"
          >
            <img
              v-if="item.image && !failedCovers.has(item.id)"
              :src="item.image"
              @error="failedCovers = new Set(failedCovers).add(item.id)"
              alt=""
              loading="lazy"
              decoding="async"
              class="size-full object-cover transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none"
            />
            <img
              v-else-if="item.mark"
              :src="item.mark.logo"
              :alt="item.mark.name"
              decoding="async"
              :class="MARK_IMAGE_CLASS"
            />
          </span>
          <span class="flex flex-1 flex-col gap-(--spacing-sm) p-(--spacing-xl)">
            <h3 class="m-0 line-clamp-2 text-balance text-heading-sm text-(--text-default)">
              {{ item.title }}
              <span
                v-if="item.target === '_blank'"
                class="sr-only"
                >{{ t('common.newTab') }}</span
              >
            </h3>
            <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
              {{ item.description }}
            </p>
            <p class="m-0 mt-auto pt-(--spacing-sm) text-overline-sm text-(--text-muted)">
              {{ item.meta }}
            </p>
          </span>
        </a>
      </CardGridCell>
    </CardGrid>
  </SectionBand>
</template>

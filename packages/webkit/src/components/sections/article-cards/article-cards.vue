<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import type { LogoMark } from '../../content/logo/logo.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import CardGrid from '../../marketing/card-grid/card-grid.vue'
  import CardGridCell from '../../marketing/card-grid/card-grid-cell/card-grid-cell.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'ArticleCards',
    inheritAttrs: false
  })

  export type { LogoMark }

  /** Placement of the band heading. */
  export type ArticleCardsKind = 'start' | 'center'

  /** One linked article card. */
  export type ArticleCardsItem = {
    /** Stable identity of the card within the band. */
    id: string
    /** Destination the card links to. */
    href: string
    /** Headline of the article. */
    title: string
    /** One or two sentences under the headline. */
    description: string
    /** Overline pinned to the foot, usually the date and read time. */
    meta: string
    /** URL of the cover drawn in the media cell. */
    image?: string
    /** Client mark drawn in the media cell when there is no cover. */
    mark?: LogoMark
    /** Where the destination opens; `_blank` opens it in a new tab. */
    target?: '_blank' | '_self'
  }

  export interface ArticleCardsProps {
    /** Placement of the heading: `start` sets it at the start, `center` centres it over the cards. */
    kind?: ArticleCardsKind
    /** Id set on the band so an in-page hash link can target it. */
    anchor?: string
    /** Overline above the heading. */
    eyebrow?: string
    /** Headline of the band; the band renders no header when empty. */
    title?: string
    /** The cards, in order; each is `{ id, href, title, description, meta, image?, mark?, target? }`; a card whose `target` is `_blank` opens in a new tab. */
    items?: ArticleCardsItem[]
    /** Accessible name of the card grid. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<ArticleCardsProps>(), {
    kind: 'start',
    anchor: '',
    eyebrow: '',
    title: '',
    items: () => [],
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const { t } = useTranslate({ common: en.common })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-article-cards'
  )

  const hasTitle = computed(() => props.title.length > 0)
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-kind="kind"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="items.length > 0"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="hasTitle"
        #header
      >
        <SectionTitle
          :kind="kind"
          :eyebrow="eyebrow"
          :title="title"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <CardGrid
          flush
          kind="frame"
          :columns="3"
          :mobile-columns="1"
          :role="ariaLabel ? 'group' : undefined"
          :aria-label="ariaLabel || undefined"
        >
          <CardGridCell
            v-for="item in items"
            :key="item.id"
            kind="canvas"
            :padded="false"
          >
            <a
              :href="item.href"
              :target="item.target"
              :rel="item.target === '_blank' ? 'noopener' : undefined"
              class="group/post flex h-full flex-col transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            >
              <span
                class="flex aspect-video items-center justify-center overflow-hidden border-b border-(--border-default) bg-(--bg-surface)"
              >
                <img
                  v-if="item.image"
                  :src="item.image"
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
                  class="h-8 w-auto max-w-40 object-contain transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none brightness-0 [[data-theme=dark]_&]:invert"
                />
              </span>
              <span class="flex flex-1 flex-col gap-(--spacing-sm) p-(--spacing-xl)">
                <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
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
      </FrameBox>
    </SectionModule>
  </section>
</template>

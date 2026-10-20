<script setup lang="ts">
  import { MONOCHROME_FILTER } from '@aziontech/webkit/assets/client-registry'
  import CardGridCell from '@aziontech/webkit/card-grid-cell'
  import CardGrid from '@aziontech/webkit/card-grid-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'ArticleCards' })

  export interface ArticleCardMark {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo. */
    logo?: string
    /** URL of the logo drawn on the light theme. */
    logoLight?: string
  }

  export interface ArticleCard {
    /** Stable key of the card. */
    key: string
    /** Destination of the card. */
    href: string
    /** Opens the destination in a new tab. */
    external?: boolean
    /** The article's headline. */
    title: string
    /** The article's deck. */
    description: string
    /** Overline under the deck: date and read time. */
    meta: string
    /** Cover image URL; a card without one draws its client mark instead. */
    image?: string
    /** Client mark drawn in the media slot when there is no image. */
    mark?: ArticleCardMark | null
  }

  interface Props {
    /** Id of the band, for in-page links. */
    anchor?: string
    /** Headline over the cards. */
    title: string
    /** The cards, three to a row. */
    items: ArticleCard[]
    /** Accessible name of the grid. */
    ariaLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    anchor: '',
    ariaLabel: ''
  })

  const { follow } = useSiteLink()
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        kind="left"
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
        :aria-label="ariaLabel || title"
      >
        <CardGridCell
          v-for="item in items"
          :key="item.key"
          kind="canvas"
          :padded="false"
        >
          <a
            :href="item.href"
            :target="item.external ? '_blank' : undefined"
            :rel="item.external ? 'noopener' : undefined"
            class="group/post flex h-full flex-col transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-surface-raised) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="follow($event, item.href)"
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
                :src="item.mark.logo || item.mark.logoLight"
                :alt="item.mark.name"
                decoding="async"
                :class="MONOCHROME_FILTER"
                class="h-8 w-auto max-w-40 object-contain transition-[scale] duration-moderate-02 ease-productive-entrance group-hover/post:scale-105 motion-reduce:transition-none"
              />
            </span>
            <span class="flex flex-1 flex-col gap-(--spacing-sm) p-(--spacing-xl)">
              <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
                {{ item.title }}
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
</template>

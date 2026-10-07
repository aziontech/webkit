<script setup lang="ts">
  import CarouselItem from '@aziontech/webkit/carousel-item'
  import CarouselNext from '@aziontech/webkit/carousel-next'
  import CarouselPrevious from '@aziontech/webkit/carousel-previous'
  import Carousel from '@aziontech/webkit/carousel-root'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  import SectionAction from './SectionAction.vue'
  import type { SiteAction } from './types'

  defineOptions({ name: 'CardCarousel' })

  export type CardCarouselKind = 'steps' | 'areas'

  export interface CardCarouselCard {
    /** Step number shown in the card's tile. */
    step?: string
    /** Card heading. */
    title: string
    /** Copy under the heading. */
    description: string
    /** Link closing the card. */
    action?: SiteAction | null
  }

  interface Props {
    /** Card anatomy: wide numbered steps under a centered title, or narrower linked areas under a start-edge title. */
    kind?: CardCarouselKind
    /** Band title over the carousel. */
    title: string
    /** Supporting sentence under the title. */
    description?: string
    /** The cards, in reading order. */
    cards: CardCarouselCard[]
    /** Accessible name for the carousel; falls back to the title. */
    ariaLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    kind: 'steps',
    description: '',
    ariaLabel: '',
    anchor: ''
  })
</script>

<template>
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        :kind="kind === 'steps' ? 'centered' : 'left'"
        :title="title"
        :description="description"
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
    >
      <div class="@container p-(--spacing-xl)">
        <Carousel :aria-label="ariaLabel || title">
          <template #controls>
            <CarouselPrevious />
            <CarouselNext />
          </template>

          <CarouselItem
            v-for="card in cards"
            :key="card.title"
          >
            <div
              v-if="kind === 'steps'"
              class="flex w-[calc(85cqw-var(--spacing-xl)*2-2px)] flex-col gap-(--spacing-lg) md:w-[calc(var(--container-xl)-var(--spacing-xl)*2-2px)]"
            >
              <span
                v-if="card.step"
                class="inline-flex size-8 items-center justify-center rounded-(--shape-flat) border border-(--border-default) bg-(--bg-surface) text-overline-md text-(--text-muted)"
              >
                {{ card.step }}
              </span>
              <div class="flex flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-balance text-heading-md text-(--text-default)">
                  {{ card.title }}
                </h3>
                <p class="m-0 text-pretty text-body-md text-(--text-muted)">
                  {{ card.description }}
                </p>
              </div>
            </div>

            <div
              v-else
              class="flex w-[calc(85cqw-var(--spacing-xl)*2-2px)] flex-col gap-(--spacing-xl) md:w-[calc(var(--container-sm)-var(--spacing-xl)*2-2px)]"
            >
              <div class="flex flex-1 flex-col gap-(--spacing-sm)">
                <h3 class="m-0 text-heading-sm text-(--text-default)">
                  {{ card.title }}
                </h3>
                <p class="m-0 text-pretty text-body-sm text-(--text-muted)">
                  {{ card.description }}
                </p>
              </div>
              <div v-if="card.action">
                <SectionAction
                  :action="card.action"
                  :aria-label="`${card.action.label}: ${card.title}`"
                />
              </div>
            </div>
          </CarouselItem>
        </Carousel>
      </div>
    </FrameBox>
  </SectionModule>
</template>

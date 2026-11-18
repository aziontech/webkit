<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Carousel from '../../content/carousel/carousel.vue'
  import CarouselItem from '../../content/carousel/carousel-item/carousel-item.vue'
  import CarouselNext from '../../content/carousel/carousel-next/carousel-next.vue'
  import CarouselPrevious from '../../content/carousel/carousel-previous/carousel-previous.vue'
  import Eyebrow from '../../content/eyebrow/eyebrow.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'CardCarouselSection',
    inheritAttrs: false
  })

  /** One card of the row. */
  export type CardCarouselSectionItem = {
    /** Eyebrow above the card heading, usually its category. */
    eyebrow?: string
    /** Heading of the card, rendered as its h3. */
    title: string
    /** One or two sentences under the heading. */
    description: string
    /** Destination the card links to; the heading is the link and the whole card is its hit area. */
    href?: string
    /** Mono label closed by an arrow at the foot of a linked card; ignored without href. */
    linkLabel?: string
  }

  export interface CardCarouselSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Eyebrow above the band title. */
    eyebrow?: string
    /** Headline of the band, rendered as its `h2` at the start of the row the step controls end; the band renders no title when empty. */
    title?: string
    /** Supporting sentence under the headline. */
    description?: string
    /** The cards, in order; each is `{ eyebrow?, title, description, href?, linkLabel? }`, and a card with `href` links to it. */
    items?: CardCarouselSectionItem[]
    /** Accessible name of the card row; defaults to the title. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<CardCarouselSectionProps>(), {
    anchor: '',
    eyebrow: '',
    title: '',
    description: '',
    items: () => [],
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'card-carousel-section'
  )

  const rowName = computed(() => props.ariaLabel || props.title)
</script>

<template>
  <div
    v-if="items.length"
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    class="scroll-mt-(--spacing-2xl) p-(--spacing-lg)"
  >
    <Carousel
      variant="cards"
      :aria-label="rowName"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          align="start"
          size="small"
          :framed="false"
          :eyebrow="eyebrow"
          :title="title"
          :description="description"
        />
      </template>
      <template #controls>
        <CarouselPrevious />
        <CarouselNext />
      </template>
      <CarouselItem
        v-for="item in items"
        :key="item.title"
        size="medium"
        class="group/card relative"
      >
        <div class="flex h-full flex-col gap-(--spacing-sm)">
          <Eyebrow v-if="item.eyebrow">{{ item.eyebrow }}</Eyebrow>
          <h3 class="m-0 text-heading-sm text-balance text-(--text-default)">
            <a
              v-if="item.href"
              :href="item.href"
              class="text-inherit no-underline after:absolute after:inset-0 after:rounded-(--shape-card) focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
              >{{ item.title }}</a
            >
            <template v-else>{{ item.title }}</template>
          </h3>
          <p class="m-0 text-body-sm text-pretty text-(--text-muted) sm:text-body-md">
            {{ item.description }}
          </p>
          <span
            v-if="item.href && item.linkLabel"
            aria-hidden="true"
            class="mt-auto flex items-center gap-(--spacing-xs) pt-(--spacing-lg) text-overline-sm text-(--text-muted) uppercase transition-colors duration-fast-02 ease-productive-entrance group-hover/card:text-(--text-default) motion-reduce:transition-none"
          >
            {{ item.linkLabel }}
            <i
              class="az az-arrow-right text-[length:inherit] leading-none text-(--text-brand) transition-[translate] duration-moderate-02 ease-expressive-entrance group-hover/card:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/card:-translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </div>
      </CarouselItem>
    </Carousel>
  </div>
</template>

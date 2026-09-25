<script setup lang="ts">
  import { type Component, computed, defineAsyncComponent, useAttrs } from 'vue'

  import { brandMarkLabel, resolveBrandMark } from '../../../svg/brands/registry'
  import Avatar from '../../avatar/avatar.vue'
  import Carousel from '../carousel/carousel.vue'
  import CarouselItem from '../carousel/carousel-item/carousel-item.vue'
  import Quote from '../quote/quote.vue'

  defineOptions({
    name: 'QuoteCarousel',
    inheritAttrs: false
  })

  /** One testimonial in the band. */
  export type QuoteCarouselItem = {
    /** The quotation itself, set as the card's blockquote. */
    text: string
    /** Who said it — the attribution's lead, and the source of the initials the card draws without a photo. Left out when the source is an institution rather than a person, and the mark leads the card alone. */
    name?: string
    /** The rest of the attribution, as one line — a person's role and company, or the report a recognition comes from. */
    jobTitle?: string
    /** URL of the person's likeness; without one the card draws their initials. */
    photo?: string
    /** Registry name of the company mark; an unregistered name is written as its own wordmark. */
    mark?: string
  }

  interface Props {
    /** The testimonials rendered as cards, in order; each item is `{ text, name, jobTitle?, photo?, mark? }` — the quotation, who said it, their role, their likeness and the registry name of their company's mark. */
    items?: QuoteCarouselItem[]
    /** Accessible name for the scrollable row of testimonials, announced before its contents. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    items: () => [],
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-quote-carousel'
  )

  const loaded = new Map<string, Component>()

  function initials(name: string): string {
    const words = name.trim().split(/\s+/)
    const first = words.at(0)?.at(0) ?? ''
    const last = words.length > 1 ? (words.at(-1)?.at(0) ?? '') : ''
    return `${first}${last}`
  }

  const cards = computed(() =>
    props.items.map((item, index) => {
      const loader = item.mark ? resolveBrandMark(item.mark) : null
      if (item.mark && loader && !loaded.has(item.mark)) {
        loaded.set(item.mark, defineAsyncComponent(loader))
      }
      return {
        ...item,
        key: `${index}-${item.name ?? item.mark ?? ''}`,
        initials: initials(item.name ?? ''),
        likeness: Boolean(item.name || item.photo),
        label: item.mark ? brandMarkLabel(item.mark) : '',
        art: item.mark && loader ? loaded.get(item.mark) : null
      }
    })
  )
</script>

<template>
  <Carousel
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="ariaLabel"
    class="[--carousel-gap:0] data-[scrollable]:mask-[linear-gradient(to_right,transparent,black_var(--spacing-lg),black_calc(100%-var(--spacing-lg)),transparent)]"
  >
    <CarouselItem
      v-for="card in cards"
      :key="card.key"
      class="-mr-px w-[85vw] max-w-120 border border-(--border-default) bg-(--bg-surface) p-(--spacing-xl) sm:w-120"
    >
      <Quote
        :text="card.text"
        :name="card.name"
        :job-title="card.jobTitle"
      >
        <template #mark>
          <div class="flex items-center justify-between gap-(--spacing-md)">
            <span
              v-if="card.likeness"
              aria-hidden="true"
            >
              <Avatar
                :src="card.photo"
                :label="card.initials"
                kind="circle"
                size="large"
              />
            </span>
            <component
              :is="card.art"
              v-if="card.art"
              :data-mark="card.mark"
              class="h-8 w-auto max-w-48 text-(--text-default)"
            />
            <span
              v-else-if="card.label"
              class="text-heading-xxs text-(--text-default)"
              >{{ card.label }}</span
            >
          </div>
        </template>
      </Quote>
    </CarouselItem>
  </Carousel>
</template>

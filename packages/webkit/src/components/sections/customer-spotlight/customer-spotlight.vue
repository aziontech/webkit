<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import { clientBrand } from '../../../assets/logos/clients/brands'
  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({ name: 'CustomerSpotlight', inheritAttrs: false })

  /** The client brand colours painting a card face: content, not theme tokens. */
  export type CustomerSpotlightBrand = {
    /** Base colour of the face. */
    base: string
    /** Colour of the two blurred glows drawn over the base. */
    glow: string
  }

  /** One client card. */
  export type CustomerSpotlightCard = {
    /** Name of the client; part of the link name. */
    name: string
    /** URL of the client's reversed (white) logo, drawn on the face. */
    logo: string
    /** Width of the mark as a share of the card, such as `35%`. */
    logoWidth?: string
    /** The client's success story. */
    href: string
    /** The story line revealed while the card is open. */
    description: string
    /** The face the card paints; defaults to the client registry's colours for `name`. */
    brand?: CustomerSpotlightBrand
  }

  interface Props {
    /** The cards, in reading order; a card opens while hovered or focused. */
    cards?: CustomerSpotlightCard[]
    /** Accessible name of the list; empty uses the built-in "Customer stories". */
    ariaLabel?: string
    /** Label revealed under the description while the card is open; empty uses the built-in "Read story". */
    storyLabel?: string
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    cards: () => [],
    ariaLabel: '',
    storyLabel: '',
    anchor: ''
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ customerSpotlight: en.customerSpotlight })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-customer-spotlight'
  )

  const listName = computed(() => props.ariaLabel || t('customerSpotlight.list'))
  const story = computed(() => props.storyLabel || t('customerSpotlight.story'))

  const active = ref(-1)
  const panels = ref<HTMLElement[]>([])
  const panelHeights = ref<number[]>([])

  const glowOf = (color: string, at: string, radius: string) =>
    `radial-gradient(circle ${radius} at ${at}, ${color} 0%, ${color} 22%, color-mix(in srgb, ${color} 50%, transparent) 51%, color-mix(in srgb, ${color} 16%, transparent) 75%, transparent 100%)`

  const NO_BRAND: CustomerSpotlightBrand = {
    base: 'var(--color-base-black)',
    glow: 'var(--color-base-black)'
  }

  const faceOf = (card: CustomerSpotlightCard) => {
    const brand = card.brand ?? clientBrand(card.name) ?? NO_BRAND
    return {
      background: [
        glowOf(brand.glow, '0 0', '82cqw'),
        glowOf(brand.glow, '100% 113cqw', '88cqw'),
        brand.base
      ].join(', ')
    }
  }

  const flushOf = (index: number) => {
    if (index === 0) return 'left'
    if (index === props.cards.length - 1) return 'right'
    return false
  }

  const onLeave = (event: FocusEvent | MouseEvent) => {
    const next = (event as FocusEvent).relatedTarget as Node | null
    if (event.type === 'focusout' && next && (event.currentTarget as HTMLElement).contains(next))
      return
    active.value = -1
  }

  let observer: ResizeObserver | undefined
  onMounted(() => {
    observer = new ResizeObserver(() => {
      panelHeights.value = panels.value.map((panel) => panel.offsetHeight)
    })
    panels.value.forEach((panel) => observer?.observe(panel))
  })
  onScopeDispose(() => observer?.disconnect())
</script>

<template>
  <section
    v-if="cards.length"
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :aria-label="listName"
  >
    <SectionModule
      :divided="false"
      :padded="false"
    >
      <FrameBox
        borders="none"
        marks="none"
      >
        <ul
          :aria-label="listName"
          class="m-0 flex list-none flex-col gap-px border-y border-(--border-default) bg-(--border-default) p-0 lg:flex-row lg:gap-0 lg:border-y-0 lg:bg-transparent"
          @mouseleave="onLeave"
          @focusout="onLeave"
        >
          <li
            v-for="(card, index) in cards"
            :key="card.name"
            :data-state="active === index ? 'open' : 'closed'"
            class="group/spot aspect-[948/960] min-w-0 lg:flex-1 lg:not-first:-ms-px"
            @mouseenter="active = index"
            @focusin="active = index"
          >
            <FrameBox
              :flush="flushOf(index)"
              borders="all"
              marks="all"
              class="h-full max-lg:border-0!"
            >
              <a
                :href="card.href"
                :aria-label="`${story}, ${card.name}: ${card.description}`"
                class="@container relative block h-full overflow-hidden focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset"
              >
                <div
                  aria-hidden="true"
                  class="absolute inset-0"
                  :style="faceOf(card)"
                />

                <div
                  :style="{ '--panel-h': `${panelHeights[index] ?? 0}px` }"
                  class="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center transition-[translate] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none max-lg:-translate-y-[calc(50%+var(--panel-h)/2)] lg:group-data-[state=open]/spot:-translate-y-[calc(50%+var(--panel-h)/2)]"
                >
                  <img
                    :src="card.logo"
                    alt=""
                    decoding="async"
                    :style="{ width: card.logoWidth ?? '35%' }"
                    class="h-auto"
                  />
                </div>

                <div
                  ref="panels"
                  class="absolute inset-x-0 bottom-0 bg-(--bg-canvas) px-[5.625cqw] py-[6cqw] transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none lg:group-data-[state=closed]/spot:translate-y-full lg:group-data-[state=closed]/spot:opacity-0"
                >
                  <p class="m-0 text-body-lg text-balance text-(--text-default)">
                    {{ card.description }}
                  </p>
                  <span
                    aria-hidden="true"
                    class="mt-(--spacing-md) flex translate-y-1 items-center gap-(--spacing-xxs) text-overline-md whitespace-nowrap text-(--text-default) uppercase opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-focus-within/spot:translate-y-0 group-focus-within/spot:opacity-100 group-hover/spot:translate-y-0 group-hover/spot:opacity-100 motion-reduce:transition-none max-lg:translate-y-0 max-lg:opacity-100"
                  >
                    {{ story }}
                    <i class="pi pi-arrow-up-right leading-none rtl:-scale-x-100" />
                  </span>
                </div>
              </a>
            </FrameBox>
          </li>
        </ul>
      </FrameBox>
    </SectionModule>
  </section>
</template>

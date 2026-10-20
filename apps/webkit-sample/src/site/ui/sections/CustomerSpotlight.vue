<script setup lang="ts">
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import { onMounted, onScopeDispose, ref } from 'vue'

  import { useSiteLink } from '../../composables/use-site-link'

  defineOptions({ name: 'CustomerSpotlight' })

  export interface CustomerSpotlightBrand {
    /** The face's base colour. */
    base: string
    /** The colour of the two blurred glows drawn over the base. */
    glow: string
  }

  export interface CustomerSpotlightCard {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's reversed (white) logo. */
    logo: string
    /** Width of the mark as a share of the card, e.g. `35%`. */
    logoWidth?: string
    /** The client's success story. */
    href: string
    /** The story line revealed while the card is open. */
    description: string
    /** The face the card paints. */
    brand: CustomerSpotlightBrand
  }

  interface Props {
    /** The cards, left to right; a card opens while hovered or focused. */
    cards: CustomerSpotlightCard[]
    /** Accessible name for the list. */
    ariaLabel?: string
    /** Label revealed under the description while the card is hovered. */
    storyLabel?: string
    /** Id of the band, for in-page links. */
    anchor?: string
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: 'Customer stories',
    storyLabel: 'Read story',
    anchor: ''
  })

  const { follow } = useSiteLink()

  const active = ref(-1)
  const panels = ref<HTMLElement[]>([])
  const panelHeights = ref<number[]>([])

  // Gaussian falloff of a blurred disc: full at the core, half at its rim, gone at two sigmas out.
  const glowOf = (color: string, at: string, radius: string) =>
    `radial-gradient(circle ${radius} at ${at}, ${color} 0%, ${color} 22%, color-mix(in srgb, ${color} 50%, transparent) 51%, color-mix(in srgb, ${color} 16%, transparent) 75%, transparent 100%)`

  const faceOf = (brand: CustomerSpotlightBrand) => ({
    background: [
      glowOf(brand.glow, '0 0', '82cqw'),
      glowOf(brand.glow, '100% 113cqw', '88cqw'),
      brand.base
    ].join(', ')
  })

  const onLeave = (event: FocusEvent | MouseEvent) => {
    const next = (event as FocusEvent).relatedTarget as Node | null
    if (event.type === 'focusout' && next && (event.currentTarget as HTMLElement).contains(next))
      return
    active.value = -1
  }

  // The logo centres in the face left above the description, so it tracks each panel's height.
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
  <SectionModule
    :id="anchor || undefined"
    :divided="false"
    :padded="false"
  >
    <FrameBox
      borders="none"
      marks="none"
    >
      <div
        role="list"
        :aria-label="ariaLabel"
        class="flex flex-col gap-px border-y border-(--border-default) bg-(--border-default) lg:flex-row lg:gap-0 lg:border-y-0 lg:bg-transparent"
        @mouseleave="onLeave"
        @focusout="onLeave"
      >
        <FrameBox
          v-for="(card, index) in cards"
          :key="card.name"
          role="listitem"
          :flush="index === 0 ? 'left' : index === cards.length - 1 ? 'right' : false"
          borders="all"
          marks="all"
          :data-state="active === index ? 'open' : 'closed'"
          class="group/spot aspect-[948/960] min-w-0 max-lg:border-0! lg:not-first:-ml-px lg:flex-1"
          @mouseenter="active = index"
          @focusin="active = index"
        >
          <a
            :href="card.href"
            :aria-label="`${storyLabel}, ${card.name}: ${card.description}`"
            class="@container relative block h-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
            @click="follow($event, card.href)"
          >
            <div
              aria-hidden="true"
              class="absolute inset-0"
              :style="faceOf(card.brand)"
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
              <p class="m-0 text-balance text-body-lg text-(--text-default)">
                {{ card.description }}
              </p>
              <span
                aria-hidden="true"
                class="mt-(--spacing-md) flex translate-y-1 items-center gap-(--spacing-xxs) whitespace-nowrap text-overline-md uppercase text-(--text-default) opacity-0 transition-[opacity,translate] duration-moderate-01 ease-productive-entrance group-hover/spot:translate-y-0 group-hover/spot:opacity-100 group-focus-within/spot:translate-y-0 group-focus-within/spot:opacity-100 motion-reduce:transition-none max-lg:translate-y-0 max-lg:opacity-100"
              >
                {{ storyLabel }}
                <i class="pi pi-arrow-up-right leading-none" />
              </span>
            </div>
          </a>
        </FrameBox>
      </div>
    </FrameBox>
  </SectionModule>
</template>

<script setup lang="ts">
  import { computed, onMounted, onScopeDispose, ref, useAttrs } from 'vue'

  import { clientBrand } from '../../../assets/logos/clients/brands'
  import { useElementListener } from '../../../composables/use-element-listener'
  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { safeHref } from '../../../utils/safe-href'
  import type { ThirdPartyLogoTreatment } from '../../content/third-party-logo/third-party-logo.vue'
  import Module from '../../layout/module/module.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import LogoWall from '../../marketing/logo-wall/logo-wall.vue'

  defineOptions({
    name: 'ClientStoryColumnsSection',
    inheritAttrs: false
  })

  export type { ThirdPartyLogoTreatment }

  /** When a column shows its story: `always` under the face, `hover` only while the card is hovered or focused. */
  export type ClientStoryColumnsSectionReveal = 'always' | 'hover'

  /** Ink of the link text on a brand face. */
  export type ClientStoryColumnsSectionInk = 'dark' | 'light'

  /** The client's brand colours painting one face. */
  export type ClientStoryColumnsSectionBrand = {
    /** CSS colour painting the face. */
    base: string
    /** CSS colour of the glow laid over the face. */
    glow: string
    /** `dark` when the face is light enough that the link text must be dark; otherwise light. */
    ink?: ClientStoryColumnsSectionInk
  }

  /** One featured success story, rendered as a column. */
  export type ClientStoryColumnsSectionCell = {
    /** Client name, used as the mark's alternative text. */
    name: string
    /** URL of the client's mark. */
    logo: string
    /** Destination of the client's success case. */
    href: string
    /** One-line story shown under the face. */
    story: string
    /** Brand colours painting the face; defaults to the client registry's colours for `name`. */
    brand?: ClientStoryColumnsSectionBrand
    /** How the mark is inked on the face; defaults to `color`. */
    logoTreatment?: ThirdPartyLogoTreatment
    /** Width of the mark as a share of the card, such as `35%`; read by `reveal="hover"`. */
    logoWidth?: string
  }

  export interface ClientStoryColumnsSectionProps {
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Accessible name of the list of stories. */
    ariaLabel?: string
    /** Label the mark face reveals on hover and the link's accessible name. */
    linkLabel?: string
    /**
     * The stories, in order; each is `{ name, logo, href, story, brand?, logoTreatment? }` where `brand`
     * is `{ base, glow, ink? }`, defaulting to the client registry's colours for `name`, and
     * `logoTreatment` is `color`, `monochrome` or `knockout`.
     */
    cells?: ClientStoryColumnsSectionCell[]
    /** When the story shows: `always` under each face, or `hover`, where each card opens to reveal it while hovered or focused and stays open below the large breakpoint. */
    reveal?: ClientStoryColumnsSectionReveal
  }

  const props = withDefaults(defineProps<ClientStoryColumnsSectionProps>(), {
    anchor: '',
    ariaLabel: '',
    linkLabel: '',
    cells: () => [],
    reveal: 'always'
  })

  const attrs = useAttrs()
  const { t } = useTranslate({ clientStoryColumnsSection: en.clientStoryColumnsSection })

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'client-story-columns-section'
  )

  const NO_BRAND: ClientStoryColumnsSectionBrand = {
    base: 'var(--bg-canvas)',
    glow: 'var(--bg-canvas)'
  }

  const faceStyle = (cell: ClientStoryColumnsSectionCell): Record<string, string> => {
    const brand = cell.brand ?? clientBrand(cell.name) ?? NO_BRAND
    return {
      '--client-story-columns-section-wall-face':
        `radial-gradient(354px 354px at -15% -15%, ${brand.glow}, transparent 70%), ` +
        `radial-gradient(354px 354px at 45% 115%, ${brand.glow}, transparent 70%), ` +
        `${brand.base}`
    }
  }

  const faceTheme = (cell: ClientStoryColumnsSectionCell): 'light' | 'dark' =>
    (cell.brand ?? clientBrand(cell.name) ?? NO_BRAND).ink === 'dark' ? 'light' : 'dark'

  const listName = computed(() => props.ariaLabel || t('clientStoryColumnsSection.list'))
  const story = computed(() => props.linkLabel || t('clientStoryColumnsSection.story'))

  const active = ref(-1)
  const listEl = ref<HTMLUListElement | null>(null)
  const panelEls = ref<HTMLElement[]>([])
  const panelHeights = ref<number[]>([])

  const glowOf = (color: string, at: string, radius: string) =>
    `radial-gradient(circle ${radius} at ${at}, ${color} 0%, ${color} 22%, color-mix(in srgb, ${color} 50%, transparent) 51%, color-mix(in srgb, ${color} 16%, transparent) 75%, transparent 100%)`

  const revealFaceStyle = (cell: ClientStoryColumnsSectionCell) => {
    const brand = cell.brand ?? clientBrand(cell.name) ?? NO_BRAND
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
    if (index === props.cells.length - 1) return 'right'
    return false
  }

  const onLeave = (event: FocusEvent | MouseEvent) => {
    const next = (event as FocusEvent).relatedTarget as Node | null
    if (event.type === 'focusout' && next && (event.currentTarget as HTMLElement).contains(next))
      return
    active.value = -1
  }

  useElementListener(listEl, 'mouseleave', onLeave)
  useElementListener(listEl, 'focusout', onLeave)

  let observer: ResizeObserver | undefined
  onMounted(() => {
    if (!panelEls.value.length) return
    observer = new ResizeObserver(() => {
      panelHeights.value = panelEls.value.map((panel) => panel.offsetHeight)
    })
    panelEls.value.forEach((panel) => observer?.observe(panel))
  })
  onScopeDispose(() => observer?.disconnect())

  const LOGO_HOLDER_CLASS =
    'absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-center transition-[translate] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none max-lg:-translate-y-[calc(50%+var(--client-story-columns-section-panel-height)/2)] ' +
    'lg:group-data-[state=open]/spot:-translate-y-[calc(50%+var(--client-story-columns-section-panel-height)/2)]'

  const PANEL_CLASS =
    'absolute inset-x-0 bottom-0 bg-(--bg-canvas) px-[5.625cqw] py-[6cqw] transition-[translate,opacity] duration-moderate-02 ease-productive-entrance ' +
    'motion-reduce:transition-none lg:group-data-[state=closed]/spot:translate-y-full lg:group-data-[state=closed]/spot:opacity-0'

  const PANEL_LINK_LABEL_CLASS =
    'mt-(--spacing-md) flex translate-y-1 items-center gap-(--spacing-2xs) text-overline-md whitespace-nowrap text-(--text-default) uppercase opacity-0 transition-[opacity,translate] ' +
    'duration-moderate-01 ease-productive-entrance group-focus-within/spot:translate-y-0 group-focus-within/spot:opacity-100 group-hover/spot:translate-y-0 group-hover/spot:opacity-100 ' +
    'motion-reduce:transition-none max-lg:translate-y-0 max-lg:opacity-100'

  const REST_CUE_CLASS =
    'pointer-events-none absolute inset-x-0 bottom-0 hidden items-center gap-(--spacing-2xs) px-[5.625cqw] py-[6cqw] text-overline-md whitespace-nowrap text-(--text-default) uppercase ' +
    'transition-opacity duration-moderate-01 ease-productive-entrance motion-reduce:transition-none lg:flex lg:group-data-[state=open]/spot:opacity-0'

  const LOGO_WALL_CLASS =
    '[&_[role=list]]:grid-cols-1! [&_a]:[background:var(--client-story-columns-section-wall-face)] group-hover/card:[&_a]:before:opacity-100 ' +
    'group-hover/card:[&_a>span:first-child]:-translate-y-(--spacing-sm) group-hover/card:[&_a>span:last-child]:translate-y-0 group-hover/card:[&_a>span:last-child]:opacity-100'

  const MARK_IMAGE_CLASS =
    'h-7 w-auto max-w-full object-contain sm:max-w-40 ' +
    'data-[treatment=monochrome]:brightness-0 ' +
    '[[data-theme=dark]_&[data-treatment=monochrome]]:invert ' +
    'data-[treatment=knockout]:brightness-0'

  const STORY_LINK_CLASS =
    'relative isolate flex-1 bg-(--bg-canvas) p-(--spacing-lg) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 ' +
    'before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance group-hover/card:before:opacity-100 motion-reduce:before:transition-none'
</script>

<template>
  <section
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
  >
    <Module
      key="hover"
      v-if="cells.length > 0 && reveal === 'hover'"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        borders="none"
        marks="none"
      >
        <ul
          ref="listEl"
          :aria-label="listName"
          class="m-0 flex list-none flex-col gap-px border-y border-(--border-default) bg-(--border-default) p-0 lg:flex-row lg:gap-0 lg:border-y-0 lg:bg-transparent"
        >
          <li
            v-for="(cell, index) in cells"
            :key="cell.name"
            :data-state="active === index ? 'open' : 'closed'"
            class="group/spot aspect-[948/960] min-w-0 lg:flex-1 lg:not-first:-ms-px"
          >
            <RegistrationFrame
              :flush="flushOf(index)"
              borders="all"
              marks="all"
              class="h-full max-lg:border-0!"
            >
              <a
                :href="safeHref(cell.href) ?? undefined"
                :aria-label="`${story}, ${cell.name}: ${cell.story}`"
                @mouseenter="active = index"
                @focus="active = index"
                class="@container relative block h-full overflow-hidden focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:outline-none focus-visible:ring-inset"
              >
                <div
                  aria-hidden="true"
                  class="absolute inset-0"
                  :data-theme="faceTheme(cell)"
                  :style="revealFaceStyle(cell)"
                />

                <div
                  :style="{
                    '--client-story-columns-section-panel-height': `${panelHeights[index] ?? 0}px`
                  }"
                  :class="LOGO_HOLDER_CLASS"
                >
                  <img
                    :src="cell.logo"
                    alt=""
                    decoding="async"
                    :style="{ width: cell.logoWidth ?? '35%' }"
                    class="h-auto"
                  />
                </div>

                <div
                  ref="panelEls"
                  :class="PANEL_CLASS"
                >
                  <p class="m-0 text-body-lg text-balance text-(--text-default)">
                    {{ cell.story }}
                  </p>
                  <span
                    aria-hidden="true"
                    :class="PANEL_LINK_LABEL_CLASS"
                  >
                    {{ story }}
                    <i class="az az-arrow-up-right leading-none rtl:-scale-x-100" />
                  </span>
                </div>

                <span
                  aria-hidden="true"
                  data-slot="rest-cue"
                  :data-theme="faceTheme(cell)"
                  :class="REST_CUE_CLASS"
                >
                  {{ story }}
                  <i class="az az-arrow-up-right leading-none rtl:-scale-x-100" />
                </span>
              </a>
            </RegistrationFrame>
          </li>
        </ul>
      </RegistrationFrame>
    </Module>
    <Module
      key="always"
      v-else-if="cells.length > 0"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="none"
      >
        <div
          role="list"
          :aria-label="ariaLabel || undefined"
          class="grid gap-px bg-(--border-default) lg:grid-cols-3"
        >
          <RegistrationFrame
            v-for="cell in cells"
            :key="cell.name"
            role="listitem"
            borders="none"
            marks="all"
          >
            <div class="group/card flex h-full flex-col gap-px bg-(--border-default)">
              <LogoWall
                variant="rectangle"
                :aria-label="cell.name"
                :link-label="linkLabel"
                :items="[{ src: cell.logo, alt: `${cell.name}: ${cell.story}`, href: cell.href }]"
                :style="faceStyle(cell)"
                :data-theme="faceTheme(cell)"
                :class="LOGO_WALL_CLASS"
              >
                <template #mark>
                  <img
                    :src="cell.logo"
                    :alt="cell.name"
                    decoding="async"
                    :data-treatment="cell.logoTreatment ?? 'color'"
                    :class="MARK_IMAGE_CLASS"
                  />
                </template>
              </LogoWall>
              <a
                :href="safeHref(cell.href) ?? undefined"
                tabindex="-1"
                aria-hidden="true"
                :class="STORY_LINK_CLASS"
              >
                <p class="m-0 text-balance text-heading-sm text-(--text-default)">
                  {{ cell.story }}
                </p>
              </a>
            </div>
          </RegistrationFrame>
        </div>
      </RegistrationFrame>
    </Module>
  </section>
</template>

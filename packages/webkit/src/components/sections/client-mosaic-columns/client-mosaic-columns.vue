<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import LogoWall from '../../marketing/logo-wall/logo-wall.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'

  defineOptions({
    name: 'ClientMosaicColumns',
    inheritAttrs: false
  })

  /** How a client mark is inked on its brand face: `monochrome` flattens it, `knockout` drops it to black, `as-is` keeps its colours. */
  export type ClientMosaicColumnsLogoTreatment = 'monochrome' | 'knockout' | 'as-is'

  /** The client's brand colours painting one face. */
  export type ClientMosaicColumnsBrand = {
    /** CSS colour painting the face. */
    base: string
    /** CSS colour of the glow laid over the face. */
    glow: string
    /** `dark` when the face is light enough that the link text must be dark; otherwise light. */
    ink?: 'dark' | 'light'
  }

  /** One featured success story, rendered as a column. */
  export type ClientMosaicColumnsCell = {
    /** Client name, used as the mark's alternative text. */
    name: string
    /** URL of the client's mark. */
    logo: string
    /** Destination of the client's success case. */
    href: string
    /** One-line story shown under the face. */
    story: string
    /** Brand colours painting the face. */
    brand: ClientMosaicColumnsBrand
    /** How the mark is inked on the face; defaults to `as-is`. */
    logoTreatment?: ClientMosaicColumnsLogoTreatment
  }

  interface Props {
    /** Accessible name of the list of stories. */
    ariaLabel?: string
    /** Label the mark face reveals on hover and the link's accessible name. */
    linkLabel?: string
    /** The stories, in order; each is `{ name, logo, href, story, brand, logoTreatment? }` where `brand` is `{ base, glow, ink? }` and `logoTreatment` is `monochrome`, `knockout` or `as-is`. */
    cells?: ClientMosaicColumnsCell[]
  }

  withDefaults(defineProps<Props>(), {
    ariaLabel: '',
    linkLabel: '',
    cells: () => []
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-client-mosaic-columns'
  )

  const faceStyle = (cell: ClientMosaicColumnsCell): Record<string, string> => ({
    '--wall-face': `radial-gradient(354px 354px at -15% -15%, ${cell.brand.glow}, transparent 70%), radial-gradient(354px 354px at 45% 115%, ${cell.brand.glow}, transparent 70%), ${cell.brand.base}`,
    '--wall-ink': cell.brand.ink === 'dark' ? 'var(--color-base-black)' : 'var(--color-base-white)'
  })
</script>

<template>
  <section
    v-bind="$attrs"
    :data-testid="testId"
  >
    <SectionModule
      v-if="cells.length > 0"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="none"
      >
        <div
          role="list"
          :aria-label="ariaLabel || undefined"
          class="grid gap-px bg-(--border-default) lg:grid-cols-3"
        >
          <FrameBox
            v-for="cell in cells"
            :key="cell.name"
            role="listitem"
            borders="none"
            marks="all"
          >
            <div class="group/card flex h-full flex-col gap-px bg-(--border-default)">
              <LogoWall
                kind="rectangle"
                :aria-label="cell.name"
                :link-label="linkLabel"
                :items="[{ src: cell.logo, alt: cell.name, href: cell.href }]"
                :style="faceStyle(cell)"
                class="[&_[role=list]]:grid-cols-1! [&_a]:[background:var(--wall-face)] [&_a]:[--text-default:var(--wall-ink)] group-hover/card:[&_a]:before:opacity-100 group-hover/card:[&_a>span:first-child]:-translate-y-(--spacing-sm) group-hover/card:[&_a>span:last-child]:translate-y-0 group-hover/card:[&_a>span:last-child]:opacity-100"
              >
                <template #mark>
                  <img
                    :src="cell.logo"
                    :alt="cell.name"
                    decoding="async"
                    :data-treatment="cell.logoTreatment ?? 'as-is'"
                    class="h-7 w-auto max-w-full object-contain sm:max-w-40 data-[treatment=monochrome]:brightness-0 [[data-theme=dark]_&[data-treatment=monochrome]]:invert data-[treatment=knockout]:brightness-0"
                  />
                </template>
              </LogoWall>
              <a
                :href="cell.href"
                tabindex="-1"
                aria-hidden="true"
                class="relative isolate flex-1 bg-(--bg-canvas) p-(--spacing-lg) before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-(--bg-hover) before:opacity-0 before:transition-opacity before:duration-moderate-01 before:ease-productive-entrance group-hover/card:before:opacity-100 motion-reduce:before:transition-none"
              >
                <p class="m-0 text-balance text-heading-sm text-(--text-default)">
                  {{ cell.story }}
                </p>
              </a>
            </div>
          </FrameBox>
        </div>
      </FrameBox>
    </SectionModule>
  </section>
</template>

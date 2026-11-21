<script setup lang="ts">
  import { computed, normalizeClass, useAttrs } from 'vue'

  defineOptions({
    name: 'ThirdPartyLogo',
    inheritAttrs: false
  })

  /** The ink a single file is drawn in: `light` art is inverted on the light theme, `dark` art on the dark theme, `color` is kept as is. */
  export type ThirdPartyLogoArtwork = 'color' | 'light' | 'dark'

  /** How the mark is inked: its own colours, one theme silhouette, the surrounding text colour, or black pinned for a coloured fill. */
  export type ThirdPartyLogoVariant = 'color' | 'monochrome' | 'current' | 'knockout'

  /** How a section inks a client mark: its own colours, one theme silhouette, or black pinned for a coloured fill (the `color`, `monochrome` and `knockout` looks of the mark). */
  export type ThirdPartyLogoTreatment = 'color' | 'monochrome' | 'knockout'

  /** A client's mark as sections list it: the client's name (the alternative text) and the URL of its logo. */
  export type ThirdPartyLogoMark = {
    /** The client's name, the mark's alternative text. */
    name: string
    /** URL of the client's logo, drawn in one ink that follows the theme. */
    logo: string
  }

  /** Height of the mark: `small` 16 px, `medium` 24 px, `large` 32 px. */
  export type ThirdPartyLogoSize = 'small' | 'medium' | 'large'

  export interface ThirdPartyLogoProps {
    /** The company or product the mark belongs to; the accessible name, and the typographic wordmark drawn when no file is set. */
    name: string
    /** URL of the mark; on its own it serves both themes, and with `srcLight` it is the dark-theme file. Empty draws the wordmark. */
    src?: string
    /** URL of the light-theme file; with `src` both files render and the theme reveals one. */
    srcLight?: string
    /**
     * The ink a single file is drawn in: `light` art (for dark surfaces) is inverted on the light
     * theme, `dark` art is inverted on the dark theme, `color` is kept as is. Ignored when
     * `srcLight` is set or `variant` is not `color`.
     */
    artwork?: ThirdPartyLogoArtwork
    /**
     * Ink: `color` keeps the vendor's colours, `monochrome` paints one silhouette black on light
     * and white on dark, `current` paints it in the surrounding text colour, `knockout` pins it
     * black for a mark on a coloured fill.
     */
    variant?: ThirdPartyLogoVariant
    /** Accessible name when it should differ from `name`. */
    ariaLabel?: string
    /** Height of the mark: `small` 16 px, `medium` 24 px, `large` 32 px; the width follows the file's aspect ratio. */
    size?: ThirdPartyLogoSize
    /** Hides the mark from assistive technology when the text beside it already names the company. */
    decorative?: boolean
  }

  const props = withDefaults(defineProps<ThirdPartyLogoProps>(), {
    src: '',
    srcLight: '',
    artwork: 'color',
    variant: 'color',
    ariaLabel: '',
    size: 'medium',
    decorative: false
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'third-party-logo')

  const file = computed(() => props.src || props.srcLight)

  const route = computed(() => {
    if (!file.value) return 'wordmark'
    if (props.variant === 'color' && props.src && props.srcLight) return 'pair'
    return 'single'
  })

  const sized = computed(() => /(^|[\s:])(h|size)-/.test(normalizeClass(attrs.class)))

  const cssUrl = (value: string) =>
    `url("${value.replace(/[\\"]/g, '\\$&').replace(/\n/g, '\\a ')}")`

  const maskStyle = computed(() => ({ '--third-party-logo-mask': cssUrl(file.value) }))

  const IMAGE_CLASS =
    'block h-full w-auto max-w-full object-contain ' +
    'data-[ink=color]:data-[artwork=light]:invert ' +
    '[[data-theme=dark]_&]:data-[ink=color]:data-[artwork=light]:invert-0 [[data-theme=dark]_&]:data-[ink=color]:data-[artwork=dark]:invert ' +
    'data-[ink=monochrome]:brightness-0 ' +
    '[[data-theme=dark]_&]:data-[ink=monochrome]:invert ' +
    'data-[ink=knockout]:brightness-0 data-[ink=current]:opacity-0'
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-variant="variant"
    :data-route="route"
    :data-artwork="artwork"
    :data-size="size"
    :data-sized="sized || undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : ariaLabel || name"
    :aria-hidden="decorative ? 'true' : undefined"
    class="relative inline-flex max-w-full shrink-0 items-center not-data-[sized]:data-[size=small]:h-4 not-data-[sized]:data-[size=medium]:h-6 not-data-[sized]:data-[size=large]:h-8"
  >
    <template v-if="route === 'pair'">
      <img
        :src="src"
        alt=""
        aria-hidden="true"
        decoding="async"
        data-theme-file="dark"
        class="hidden h-full w-auto max-w-full object-contain [[data-theme=dark]_&]:block"
      />
      <img
        :src="srcLight"
        alt=""
        aria-hidden="true"
        decoding="async"
        data-theme-file="light"
        class="block h-full w-auto max-w-full object-contain [[data-theme=dark]_&]:hidden"
      />
    </template>
    <template v-else-if="route === 'single'">
      <img
        :src="file"
        alt=""
        aria-hidden="true"
        decoding="async"
        :data-ink="variant"
        :data-artwork="artwork"
        :class="IMAGE_CLASS"
      />
      <span
        v-if="variant === 'current'"
        aria-hidden="true"
        data-ink-layer=""
        :style="maskStyle"
        class="absolute inset-0 bg-current mask-(--third-party-logo-mask) mask-contain mask-center mask-no-repeat forced-colors:bg-[CanvasText]"
      />
    </template>
    <span
      v-else
      dir="auto"
      :data-ink="variant"
      class="whitespace-nowrap text-heading-2xs text-(--text-default) data-[ink=current]:text-current data-[ink=knockout]:text-(--primary-foreground)"
      >{{ name }}</span
    >
  </span>
</template>

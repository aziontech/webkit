<script setup lang="ts">
  import { computed, normalizeClass, useAttrs } from 'vue'

  defineOptions({
    name: 'Logo',
    inheritAttrs: false
  })

  /** The ink a single file is drawn in: `light` art is inverted on the light theme, `dark` art on the dark theme, `color` is kept as is. */
  export type LogoArtwork = 'color' | 'light' | 'dark'

  /** How the mark is inked: its own colours, one theme silhouette, the surrounding text colour, or black pinned for a coloured fill. */
  export type LogoKind = 'color' | 'monochrome' | 'current' | 'knockout'

  interface Props {
    /** The company or product the mark belongs to; the accessible name, and the typographic wordmark drawn when no file is set. */
    name: string
    /** URL of the mark; on its own it serves both themes, and with `srcLight` it is the dark-theme file. Empty draws the wordmark. */
    src?: string
    /** URL of the light-theme file; with `src` both files render and the theme reveals one. */
    srcLight?: string
    /** The ink a single file is drawn in: `light` art (for dark surfaces) is inverted on the light theme, `dark` art is inverted on the dark theme, `color` is kept as is. Ignored when `srcLight` is set or `kind` is not `color`. */
    artwork?: LogoArtwork
    /** Ink: `color` keeps the vendor's colours, `monochrome` paints one silhouette black on light and white on dark, `current` paints it in the surrounding text colour, `knockout` pins it black for a mark on a coloured fill. */
    kind?: LogoKind
    /** Accessible name when it should differ from `name`. */
    ariaLabel?: string
    /** Hides the mark from assistive technology when the text beside it already names the company. */
    decorative?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    src: '',
    srcLight: '',
    artwork: 'color',
    kind: 'color',
    ariaLabel: '',
    decorative: false
  })

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'content-logo')

  const file = computed(() => props.src || props.srcLight)

  const route = computed(() => {
    if (!file.value) return 'wordmark'
    if (props.kind === 'color' && props.src && props.srcLight) return 'pair'
    return 'single'
  })

  const sized = computed(() => /(^|[\s:])(h|size)-/.test(normalizeClass(attrs.class)))

  const maskStyle = computed(() => ({ '--logo-mask': `url('${file.value}')` }))
</script>

<template>
  <span
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    :data-route="route"
    :data-artwork="artwork"
    :data-sized="sized || undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : ariaLabel || name"
    :aria-hidden="decorative ? 'true' : undefined"
    class="relative inline-flex max-w-full shrink-0 items-center not-data-[sized]:h-6"
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
        :data-ink="kind"
        :data-artwork="artwork"
        class="block h-full w-auto max-w-full object-contain data-[ink=color]:data-[artwork=light]:invert [[data-theme=dark]_&]:data-[ink=color]:data-[artwork=light]:invert-0 [[data-theme=dark]_&]:data-[ink=color]:data-[artwork=dark]:invert data-[ink=monochrome]:brightness-0 [[data-theme=dark]_&]:data-[ink=monochrome]:invert data-[ink=knockout]:brightness-0 data-[ink=current]:opacity-0"
      />
      <span
        v-if="kind === 'current'"
        aria-hidden="true"
        data-ink-layer=""
        :style="maskStyle"
        class="absolute inset-0 bg-current mask-(--logo-mask) mask-contain mask-center mask-no-repeat forced-colors:bg-[CanvasText]"
      />
    </template>
    <span
      v-else
      dir="auto"
      :data-ink="kind"
      class="whitespace-nowrap text-heading-xxs text-(--text-default) data-[ink=current]:text-current data-[ink=knockout]:text-(--color-base-black)"
      >{{ name }}</span
    >
  </span>
</template>

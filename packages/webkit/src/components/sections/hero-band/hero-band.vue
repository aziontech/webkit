<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import Hero from '../../marketing/hero/hero.vue'
  import HeroTitle, {
    type HeroTitleEyebrowPrefix
  } from '../../marketing/hero/hero-title/hero-title.vue'

  defineOptions({
    name: 'HeroBand',
    inheritAttrs: false
  })

  /** Layout of the opening band. */
  export type HeroBandKind =
    | 'centered'
    | 'title-band'
    | 'centered-band'
    | 'compact-band'
    | 'pixel-floor'
    | 'copy-beside-art'
    | 'copy-on-top-art'

  /** Length of the headline: `short` sets it on the narrow headline measure, `long` lets it take the whole column. */
  export type HeroBandTitleLength = 'short' | 'long'

  /** Vertical rhythm of the band. */
  export type HeroBandSize = 'medium' | 'large'

  /** A call to action under the headline. */
  export type HeroBandAction = {
    /** Visible label of the action. */
    label: string
    /** Destination the action links to. */
    href: string
    /** Closes the label on a trailing chevron that reads as "go". */
    trailing?: boolean
    /** Link target of the action. */
    target?: '_blank' | '_self'
  }

  /** An image set beside the copy instead of an illustration. */
  export type HeroBandImage = {
    /** Address of the image. */
    src: string
    /** Text alternative of the image. */
    alt: string
    /** Intrinsic width of the image, in pixels. */
    width: number
    /** Intrinsic height of the image, in pixels. */
    height: number
  }

  type ArtBounds = {
    canvas: number
    start: number
    end: number
    share?: number
    top?: number
    bottom?: number
    rows?: number
    centered?: boolean
  }

  interface Props {
    /** Layout of the band: `centered` fills a screen over a dot field, `title-band` is a padded band, `centered-band` is a large site-wide band with the copy centered, `compact-band` is a short site-wide band with the copy at the start, `pixel-floor` sets the copy over an animated pixel floor, `copy-beside-art` sets an illustration or an image beside the copy, `copy-on-top-art` fills a screen with the copy centered over a scene in the `top` or `bottom` slot. */
    kind?: HeroBandKind
    /** Vertical rhythm of the band; `large` is the opening a product page leads with. */
    size?: HeroBandSize
    /** Short overline above the headline. */
    eyebrow?: string
    /** Opening words of the headline, painted in the brand accent; reads as one sentence with `title`. */
    highlight?: string
    /** Page headline, rendered as the page `h1`; the band renders nothing when empty. */
    title?: string
    /** Sentence under the headline. */
    description?: string
    /** First button under the headline; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    primaryAction?: HeroBandAction
    /** Second, outlined button beside the first; `{ label, href, trailing?, target? }`. Shown only with a label and a link. */
    secondaryAction?: HeroBandAction
    /** Overline above the client ticker; empty uses the locale catalog (`Proven on mission-critical workloads`). */
    tickerLabel?: string
    /** Registry names of the client marks on the band floor, in order; the ticker renders only when it has marks. */
    tickerMarks?: string[]
    /** @deprecated since 6.0 — use `tickerLabel`. Removed in 7.0. */
    carouselLabel?: string
    /** @deprecated since 6.0 — use `tickerMarks`. Removed in 7.0. */
    carouselMarks?: string[]
    /** Registry name of the illustration set beside the copy in the `copy-beside-art` layout. */
    illustration?: string
    /** Accessible description of the illustration. */
    illustrationAriaLabel?: string
    /** Image set beside the copy in the `copy-beside-art` layout when no `illustration` is given; `{ src, alt, width, height }`. A portrait image (taller than wide) is drawn at half width, centered, below `md`. */
    image?: HeroBandImage
    /** Mark set before the eyebrow (`//`, `<>`, `</>`, or empty for none); drawn only with an eyebrow. */
    eyebrowPrefix?: HeroTitleEyebrowPrefix
    /** In-page id set on the band so a `#hash` link can scroll to it. */
    anchor?: string
    /** Height of the site header above the band, taken out of a band that fills a screen; defaults to the SiteNav bar's token, any CSS length, empty for a page with no header above it. */
    headerOffset?: string
    /** Length of the headline: `short` sets it on the site's narrow headline measure in the centered layouts, so a four-to-seven-word headline breaks over two balanced lines while the sentence under it keeps the full column; `long` lets the headline take the whole column. */
    titleLength?: HeroBandTitleLength
    /** Drops the dot texture of the `centered` layout. */
    plain?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'title-band',
    size: 'medium',
    eyebrow: '',
    highlight: '',
    title: '',
    description: '',
    primaryAction: undefined,
    secondaryAction: undefined,
    tickerLabel: '',
    tickerMarks: () => [],
    carouselLabel: '',
    carouselMarks: () => [],
    illustration: '',
    illustrationAriaLabel: '',
    image: undefined,
    eyebrowPrefix: '//',
    anchor: '',
    headerOffset: 'var(--layout-header-height)',
    titleLength: 'short',
    plain: false
  })

  const slots = defineSlots<{
    /** A scene in the window above the copy (a `ShellMockup`, a `ProductWidget`, a diagram). */
    top?(): unknown
    /** A scene in the window under the copy, entering after it. */
    bottom?(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ heroBand: en.heroBand })

  const COMPARISON: ArtBounds = {
    canvas: 592,
    start: 161,
    end: 370,
    share: 0.6,
    top: 48,
    bottom: 252,
    rows: 300,
    centered: true
  }

  const ART_BOUNDS: Record<string, ArtBounds> = {
    'azion-to-akamai': COMPARISON,
    'azion-to-aws': COMPARISON,
    'azion-to-cloudflare': COMPARISON,
    'azion-to-fastly': COMPARISON,
    'azion-to-vercel': { ...COMPARISON, start: 209, end: 418 },
    'retail-application-modernization': { canvas: 592, start: 51, end: 542 },
    'protect-financial-applications': { canvas: 592, start: 58, end: 506 },
    'implement-api-gateway-security': { canvas: 592, start: 0, end: 592 },
    'combine-data-and-vector-search': {
      canvas: 592,
      start: 111,
      end: 481,
      top: 57,
      bottom: 243,
      rows: 300
    },
    'improve-application-performance-and-reliability': {
      canvas: 592,
      start: 131,
      end: 461,
      top: 18,
      bottom: 282,
      rows: 300
    },
    'fastest-path-to-live-website': { canvas: 592, start: 84, end: 510 },
    'ddos-protection': { canvas: 186, start: -93, end: 279 },
    'quick-start-with-templates': {
      canvas: 592,
      start: 127,
      end: 465,
      top: 67,
      bottom: 233,
      rows: 300
    },
    'low-latency': { canvas: 592, start: 39, end: 553 }
  }

  const DEFAULT_BOUNDS: ArtBounds = { canvas: 592, start: 131, end: 461 }

  const percent = (value: number) => `${(value * 100).toFixed(2)}%`

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-hero-band'
  )

  const BANDS: HeroBandKind[] = ['title-band', 'centered-band', 'compact-band']

  const isScreen = computed(() => !BANDS.includes(props.kind))

  const isCentered = computed(
    () =>
      props.kind !== 'pixel-floor' &&
      props.kind !== 'copy-beside-art' &&
      props.kind !== 'compact-band'
  )

  const heroWidth = computed(() => {
    if (props.kind === 'pixel-floor') return 'full'
    if (
      props.kind === 'centered' ||
      props.kind === 'copy-on-top-art' ||
      props.kind === 'centered-band' ||
      props.kind === 'compact-band'
    )
      return 'site'
    return '5xl'
  })

  const heroSize = computed(() => {
    if (props.kind === 'centered-band') return 'large'
    if (props.kind === 'compact-band') return 'medium'
    return props.size
  })

  const titleWidth = computed(() => {
    const long = props.titleLength === 'long'
    if (props.kind === 'centered') return long ? '3xl' : 'xl'
    if (props.kind === 'copy-beside-art' || props.kind === 'copy-on-top-art') return 'xl'
    if (props.kind === 'centered-band' || props.kind === 'compact-band') return long ? '3xl' : '2xl'
    return '4xl'
  })

  const narrowTitle = computed(
    () => isCentered.value && props.kind !== 'copy-on-top-art' && props.titleLength === 'short'
  )

  const dots = computed(() => props.kind === 'centered' && !props.plain)

  const hasArt = computed(
    () => props.kind === 'copy-beside-art' && Boolean(props.illustration || props.image?.src)
  )

  const artStyle = computed(() => {
    if (!props.illustration) {
      return {
        '--hero-art-width': '100%',
        '--hero-art-bleed': '0%',
        '--hero-art-trim-top': '0%',
        '--hero-art-trim-bottom': '0%'
      }
    }
    const {
      canvas,
      start,
      end,
      share = 0.9,
      top = 0,
      bottom = 0,
      rows = 0,
      centered = false
    } = ART_BOUNDS[props.illustration] ?? DEFAULT_BOUNDS
    const width = (share * canvas) / (end - start)
    const bleed = centered
      ? width * (1 - (start + end) / 2 / canvas) - 0.5
      : (width * (canvas - end)) / canvas
    return {
      '--hero-art-width': percent(width),
      '--hero-art-bleed': percent(bleed),
      '--hero-art-trim-top': percent((width * top) / canvas),
      '--hero-art-trim-bottom': percent(rows ? (width * (rows - bottom)) / canvas : 0)
    }
  })

  const portrait = computed(() => Boolean(props.image && props.image.height > props.image.width))

  const headline = computed(() => [props.highlight, props.title].filter(Boolean).join(' '))

  const primary = computed(() =>
    props.primaryAction?.label && props.primaryAction.href ? props.primaryAction : null
  )

  const secondary = computed(() =>
    props.secondaryAction?.label && props.secondaryAction.href ? props.secondaryAction : null
  )

  const marks = computed(() => (props.tickerMarks.length ? props.tickerMarks : props.carouselMarks))
</script>

<template>
  <div
    v-bind="$attrs"
    :id="anchor || undefined"
    :data-testid="testId"
    :data-kind="kind"
    :data-title-measure="narrowTitle ? 'narrow' : null"
    class="scroll-mt-(--spacing-xxl) data-[title-measure=narrow]:[&_h1]:max-w-(--container-lg) data-[kind=pixel-floor]:[--banner-floor-bg:var(--bg-surface)] data-[kind=pixel-floor]:[--texture-pool-a:95%_64%] data-[kind=pixel-floor]:[--texture-pool-b:-2%_38%]"
  >
    <Hero
      v-if="title"
      :kind="isScreen ? 'screen' : 'band'"
      :size="heroSize"
      :max-width="heroWidth"
      :texture="dots ? 'dots' : 'none'"
      :texture-fade="dots ? 'top' : 'none'"
      :floor-texture="kind === 'pixel-floor' ? 'pixelate' : 'none'"
      :floor-texture-size="kind === 'pixel-floor' ? 'small' : 'medium'"
      :bordered="kind !== 'pixel-floor'"
      :padded="kind !== 'copy-on-top-art'"
      :media-align="kind === 'copy-beside-art' ? 'end' : 'center'"
      :offset="isScreen ? headerOffset : ''"
      :ticker="marks.length > 0"
      :ticker-marks="marks"
      :ticker-label="tickerLabel || carouselLabel || t('heroBand.carouselLabel')"
      :aria-label="headline"
    >
      <HeroTitle
        :centered="isCentered"
        :mobile-centered="kind === 'copy-beside-art'"
        :max-width="titleWidth"
        :eyebrow="eyebrow"
        :eyebrow-prefix="eyebrow ? eyebrowPrefix : ''"
        :highlight="highlight"
        :title="title"
        :description="description"
        size="large"
      >
        <template
          v-if="primary || secondary"
          #actions
        >
          <Button
            v-if="primary"
            :label="primary.label"
            :href="primary.href"
            :target="primary.target"
            kind="secondary"
            size="large"
            :icon="primary.trailing ? 'pi pi-chevron-right' : ''"
            :icon-position="primary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(primary.trailing)"
          />
          <Button
            key="button-2"
            v-if="secondary"
            :label="secondary.label"
            :href="secondary.href"
            :target="secondary.target"
            kind="outlined"
            size="large"
            :icon="secondary.trailing ? 'pi pi-chevron-right' : ''"
            :icon-position="secondary.trailing ? 'trailing' : 'leading'"
            :animated="Boolean(secondary.trailing)"
          />
        </template>
      </HeroTitle>

      <template
        v-if="slots.top"
        #top
      >
        <slot name="top" />
      </template>

      <template
        v-if="slots.bottom"
        #bottom
      >
        <div class="@container">
          <div
            class="flex animate-content-enter justify-center pb-(--spacing-xxl) [--content-enter-delay:120ms] motion-reduce:animate-none @max-2xl:[mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
          >
            <slot name="bottom" />
          </div>
        </div>
      </template>

      <template
        v-if="hasArt"
        #media
      >
        <div
          :style="artStyle"
          class="w-full md:-mt-(--hero-art-trim-top) md:-mb-(--hero-art-trim-bottom) md:w-(--hero-art-width) md:max-w-none md:shrink-0 md:-me-(--hero-art-bleed)"
        >
          <Illustration
            v-if="illustration"
            :name="illustration"
            :aria-label="illustrationAriaLabel"
          />
          <img
            v-else-if="image"
            :src="image.src"
            :alt="image.alt"
            :width="image.width"
            :height="image.height"
            :data-orientation="portrait ? 'portrait' : null"
            decoding="async"
            class="block h-auto w-full max-md:data-[orientation=portrait]:mx-auto max-md:data-[orientation=portrait]:w-1/2"
          />
        </div>
      </template>
    </Hero>
  </div>
</template>

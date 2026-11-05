<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Illustration from '../../content/illustration/illustration.vue'
  import Hero from '../../marketing/hero/hero.vue'
  import HeroTitle from '../../marketing/hero/hero-title/hero-title.vue'

  defineOptions({
    name: 'HeroBand',
    inheritAttrs: false
  })

  /** Layout of the opening band. */
  export type HeroBandKind = 'centered' | 'title-band' | 'pixel-floor' | 'copy-beside-art'

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

  interface Props {
    /** Layout of the band: `centered` fills a screen over a dot field, `title-band` is a padded band, `pixel-floor` sets the copy over an animated pixel floor, `copy-beside-art` sets an illustration beside the copy. */
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
    /** Overline above the client strip. */
    carouselLabel?: string
    /** Registry names of the client marks on the band floor, in order; the strip renders only when it has marks. */
    carouselMarks?: string[]
    /** Registry name of the illustration set beside the copy in the `copy-beside-art` layout. */
    illustration?: string
    /** Accessible description of the illustration. */
    illustrationAriaLabel?: string
    /** Height of the site header above the band, taken out of a band that fills a screen; any CSS length. */
    headerOffset?: string
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
    carouselLabel: '',
    carouselMarks: () => [],
    illustration: '',
    illustrationAriaLabel: '',
    headerOffset: ''
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-hero-band'
  )

  const isScreen = computed(() => props.kind !== 'title-band')

  const isCentered = computed(() => props.kind === 'centered' || props.kind === 'title-band')

  const heroWidth = computed(() => {
    if (props.kind === 'centered') return 'site'
    if (props.kind === 'pixel-floor') return 'full'
    return '5xl'
  })

  const titleWidth = computed(() =>
    props.kind === 'centered' || props.kind === 'copy-beside-art' ? 'xl' : '4xl'
  )

  const hasArt = computed(() => props.kind === 'copy-beside-art' && props.illustration.length > 0)

  const headline = computed(() => [props.highlight, props.title].filter(Boolean).join(' '))

  const primary = computed(() =>
    props.primaryAction?.label && props.primaryAction.href ? props.primaryAction : null
  )

  const secondary = computed(() =>
    props.secondaryAction?.label && props.secondaryAction.href ? props.secondaryAction : null
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-kind="kind"
    class="data-[kind=pixel-floor]:[--banner-floor-bg:var(--bg-surface)] data-[kind=pixel-floor]:[--texture-pool-a:95%_64%] data-[kind=pixel-floor]:[--texture-pool-b:-2%_38%]"
  >
    <Hero
      v-if="title"
      :kind="isScreen ? 'screen' : 'band'"
      :size="size"
      :max-width="heroWidth"
      :texture="kind === 'centered' ? 'dots' : 'none'"
      :texture-fade="kind === 'centered' ? 'top' : 'none'"
      :floor-texture="kind === 'pixel-floor' ? 'pixelate' : 'none'"
      :floor-texture-size="kind === 'pixel-floor' ? 'small' : 'medium'"
      :bordered="kind !== 'pixel-floor'"
      :media-align="kind === 'copy-beside-art' ? 'end' : 'center'"
      :offset="isScreen ? headerOffset : ''"
      :carousel="carouselMarks.length > 0"
      :carousel-marks="carouselMarks"
      :carousel-label="carouselLabel"
      :aria-label="headline"
    >
      <HeroTitle
        :centered="isCentered"
        :mobile-centered="kind === 'copy-beside-art'"
        :max-width="titleWidth"
        :eyebrow="eyebrow"
        eyebrow-prefix="//"
        :highlight="highlight"
        :title="title"
        :description="description"
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
        v-if="hasArt"
        #media
      >
        <Illustration
          :name="illustration"
          :aria-label="illustrationAriaLabel"
          class="md:w-[161.45%] md:max-w-none md:shrink-0 md:-me-[35.73%]"
        />
      </template>
    </Hero>
  </div>
</template>

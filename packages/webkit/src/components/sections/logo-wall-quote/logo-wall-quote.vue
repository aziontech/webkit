<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Logo, { type LogoArtwork, type LogoKind } from '../../content/logo/logo.vue'
  import FrameBox from '../../layout/frame-box/frame-box.vue'
  import LogoWall from '../../marketing/logo-wall/logo-wall.vue'
  import Quote from '../../marketing/quote/quote.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'LogoWallQuote',
    inheritAttrs: false
  })

  /** How a mark follows the theme: `as-is` keeps its colours, `monochrome` draws it in the text ink, `invert-light` flips it on the light theme. */
  export type LogoWallQuoteLogoTreatment = 'as-is' | 'monochrome' | 'invert-light'

  /** One client mark in the wall, optionally linked to that client's story. */
  export type LogoWallQuoteLogo = {
    /** Company name, used as the mark's alternative text. */
    name: string
    /** URL of the mark on the light and dark themes unless `logoLight` is set. */
    logo: string
    /** URL of the mark shown on the light theme when it needs a different drawing. */
    logoLight?: string
    /** How the mark follows the theme; defaults to `as-is`. */
    logoTreatment?: LogoWallQuoteLogoTreatment
    /** The ink a single file is drawn in, as the client registry records it: `light` art is inverted on the light theme, `dark` art on the dark theme. */
    artwork?: LogoArtwork
    /** Destination the mark links to, such as that client's success case. */
    href?: string
  }

  /** Layout of the band: `wall` sets the client marks with the quote in their aside, `quote` sets the quote alone as a full-width band. */
  export type LogoWallQuoteKind = 'wall' | 'quote'

  /** Register of the quote in the `quote` layout: the featured `highlight` or the band-sized `signed` sentence. */
  export type LogoWallQuoteQuoteKind = 'highlight' | 'signed'

  /** The signed quote set in the wall's aside. */
  export type LogoWallQuoteQuote = {
    /** The quotation text. */
    text: string
    /** Name of the person who said it. */
    name: string
    /** Role of that person and where they work. */
    jobTitle: string
    /** URL of the company mark shown above the quotation; the dark-theme file when `logoLight` is set. */
    logo: string
    /** Alternative text naming the company of the mark. */
    logoAlt: string
    /** URL of the company mark on the light theme, when it needs a different drawing. */
    logoLight?: string
    /** The ink a single mark file is drawn in, as the client registry records it. */
    artwork?: LogoArtwork
  }

  /** The call to action set under the quote. */
  export type LogoWallQuoteAction = {
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
    /** Layout of the band; `quote` renders the quote alone and needs no logos. */
    kind?: LogoWallQuoteKind
    /** Register of the quote in the `quote` layout. */
    quoteKind?: LogoWallQuoteQuoteKind
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Overline above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Accessible name of the logo wall. */
    ariaLabel?: string
    /** The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, href? }`. */
    logos?: LogoWallQuoteLogo[]
    /** The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt }`. Omitted when absent. */
    quote?: LogoWallQuoteQuote
    /** Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: LogoWallQuoteAction
    /** Outlined button beside the primary one under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. */
    secondaryAction?: LogoWallQuoteAction
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'wall',
    quoteKind: 'signed',
    anchor: '',
    eyebrow: '',
    title: '',
    ariaLabel: '',
    logos: () => [],
    quote: undefined,
    primaryAction: undefined,
    secondaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-logo-wall-quote'
  )

  const hasLogos = computed(() => props.logos.length > 0)

  const isQuoteBand = computed(() => props.kind === 'quote' && Boolean(props.quote?.text))

  const renders = computed(() => props.kind !== 'quote' || isQuoteBand.value)

  const hasActions = computed(() => Boolean(props.primaryAction || props.secondaryAction))

  const markKind = (logo: LogoWallQuoteLogo): LogoKind =>
    logo.logoTreatment === 'monochrome' ? 'monochrome' : 'color'

  const markArtwork = (logo: LogoWallQuoteLogo): LogoArtwork =>
    logo.artwork ?? (logo.logoTreatment === 'invert-light' ? 'light' : 'color')

  const wallItems = computed(() =>
    props.logos.map((logo) => ({
      src: logo.logo,
      alt: logo.name,
      href: logo.href
    }))
  )
</script>

<template>
  <section
    v-if="renders"
    v-bind="$attrs"
    :id="anchor || undefined"
    class="scroll-mt-(--spacing-xxl)"
    :data-testid="testId"
    :data-kind="kind"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="isQuoteBand && quote"
      key="quote"
      :divided="false"
      :padded="false"
    >
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <div
          :data-kind="quoteKind"
          class="p-(--spacing-xl) lg:data-[kind=signed]:max-w-(--container-5xl)"
        >
          <Quote
            :kind="quoteKind"
            :text="quote.text"
            :name="quote.name"
            :job-title="quote.jobTitle"
          >
            <template
              v-if="quote.logo"
              #mark
            >
              <Logo
                :name="quote.logoAlt"
                :src="quote.logo"
                :src-light="quote.logoLight"
                :artwork="quote.artwork"
                class="h-8 max-w-(--size-40) group-data-[kind=highlight]:md:h-24 group-data-[kind=highlight]:md:max-w-none"
              />
            </template>
            <template
              v-if="hasActions"
              #actions
            >
              <Button
                v-if="primaryAction"
                :label="primaryAction.label"
                :href="primaryAction.href"
                kind="secondary"
                size="large"
                :target="primaryAction.target"
                :icon="primaryAction.trailing ? 'ai ai-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(primaryAction.trailing)"
              />
              <Button
                key="button-2"
                v-if="secondaryAction"
                :label="secondaryAction.label"
                :href="secondaryAction.href"
                kind="outlined"
                size="large"
                :target="secondaryAction.target"
                :icon="secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(secondaryAction.trailing)"
              />
            </template>
          </Quote>
        </div>
      </FrameBox>
    </SectionModule>

    <SectionModule
      v-else-if="hasLogos"
      key="wall"
      :divided="false"
      :padded="false"
    >
      <template
        v-if="title"
        #header
      >
        <SectionTitle
          :eyebrow="eyebrow"
          :title="title"
        />
      </template>

      <FrameBox
        flush
        borders="y"
        marks="all"
      >
        <LogoWall
          kind="rectangle"
          :aria-label="ariaLabel || undefined"
          :items="wallItems"
        >
          <template #mark="{ index }">
            <Logo
              v-if="logos[index]"
              :name="logos[index].name"
              :src="logos[index].logo"
              :src-light="logos[index].logoLight"
              :artwork="markArtwork(logos[index])"
              :kind="markKind(logos[index])"
              :data-treatment="logos[index].logoTreatment ?? 'as-is'"
              class="h-5 sm:max-w-24"
            />
          </template>
          <template
            v-if="quote"
            #aside
          >
            <Quote
              kind="signed"
              :text="quote.text"
              :name="quote.name"
              :job-title="quote.jobTitle"
            >
              <template #mark>
                <Logo
                  :name="quote.logoAlt"
                  :src="quote.logo"
                  :src-light="quote.logoLight"
                  :artwork="quote.artwork"
                  class="h-8 max-w-40"
                />
              </template>
              <template
                v-if="hasActions"
                #actions
              >
                <Button
                  v-if="primaryAction"
                  :label="primaryAction.label"
                  :href="primaryAction.href"
                  kind="secondary"
                  size="large"
                  :target="primaryAction.target"
                  :icon="primaryAction.trailing ? 'ai ai-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(primaryAction.trailing)"
                />
                <Button
                  key="button-2"
                  v-if="secondaryAction"
                  :label="secondaryAction.label"
                  :href="secondaryAction.href"
                  kind="outlined"
                  size="large"
                  :target="secondaryAction.target"
                  :icon="secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(secondaryAction.trailing)"
                />
              </template>
            </Quote>
          </template>
        </LogoWall>
      </FrameBox>
    </SectionModule>
  </section>
</template>

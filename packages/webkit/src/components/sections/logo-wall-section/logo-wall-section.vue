<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
  import Logo, {
    type LogoArtwork,
    type LogoTreatment,
    type LogoVariant
  } from '../../content/logo/logo.vue'
  import RegistrationFrame from '../../layout/registration-frame/registration-frame.vue'
  import LogoWall from '../../marketing/logo-wall/logo-wall.vue'
  import Quote from '../../marketing/quote/quote.vue'
  import SectionModule from '../../marketing/section-module/section-module.vue'
  import type { SectionTitleAction } from '../../marketing/section-title/section-title.vue'
  import SectionTitle from '../../marketing/section-title/section-title.vue'

  defineOptions({
    name: 'LogoWallSection',
    inheritAttrs: false
  })

  export type { LogoTreatment }

  export type { SectionTitleAction }

  /** One client mark in the wall, optionally linked to that client's story. */
  export type LogoWallSectionLogo = {
    /** Company name, used as the mark's alternative text. */
    name: string
    /** URL of the mark on the light and dark themes unless `logoLight` is set. */
    logo: string
    /** URL of the mark shown on the light theme when it needs a different drawing. */
    logoLight?: string
    /** How the mark is inked: `color`, `monochrome` or `knockout`; defaults to `color`. A reversed file sets `artwork: 'light'` instead. */
    logoTreatment?: LogoTreatment
    /** The ink a single file is drawn in, as the client registry records it: `light` art is inverted on the light theme, `dark` art on the dark theme. */
    artwork?: LogoArtwork
    /** Destination the mark links to, such as that client's success case. */
    href?: string
  }

  /** Layout of the band: `wall` sets the client marks with the quote in their aside, `quote` sets the quote alone as a full-width band. */
  export type LogoWallSectionVariant = 'wall' | 'quote'

  /** Register of the quote in the `quote` layout: the featured `highlight` or the band-sized `signed` sentence. */
  export type LogoWallSectionQuoteVariant = 'highlight' | 'signed'

  /** The signed quote set in the wall's aside. */
  export type LogoWallSectionQuote = {
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

  export interface LogoWallSectionProps {
    /** Layout of the band; `quote` renders the quote alone and needs no logos. */
    variant?: LogoWallSectionVariant
    /** Register of the quote in the `quote` layout. */
    quoteVariant?: LogoWallSectionQuoteVariant
    /** In-page id set on the band so a hash link can target it. */
    anchor?: string
    /** Eyebrow above the section title. */
    eyebrow?: string
    /** Headline of the band, rendered by the section title as its `h2`; the band renders no header when empty. */
    title?: string
    /** Accessible name of the logo wall. */
    ariaLabel?: string
    /** The client marks, in order; each is `{ name, logo, logoLight?, logoTreatment?, href? }`. */
    logos?: LogoWallSectionLogo[]
    /** The signed quote in the wall's aside; `{ text, name, jobTitle, logo, logoAlt }`. Omitted when absent. */
    quote?: LogoWallSectionQuote
    /** Button under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. */
    primaryAction?: SectionTitleAction
    /** Outlined button beside the primary one under the quote; `{ label, href, trailing?, target? }`. Omitted when absent. */
    secondaryAction?: SectionTitleAction
  }

  const props = withDefaults(defineProps<LogoWallSectionProps>(), {
    variant: 'wall',
    quoteVariant: 'signed',
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
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-logo-wall-section'
  )

  const hasLogos = computed(() => props.logos.length > 0)

  const isQuoteBand = computed(() => props.variant === 'quote' && Boolean(props.quote?.text))

  const renders = computed(() => props.variant !== 'quote' || isQuoteBand.value)

  const hasActions = computed(() => Boolean(props.primaryAction || props.secondaryAction))

  const markKind = (logo: LogoWallSectionLogo): LogoVariant => logo.logoTreatment ?? 'color'

  const markArtwork = (logo: LogoWallSectionLogo): LogoArtwork => logo.artwork ?? 'color'

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
    class="scroll-mt-(--spacing-2xl)"
    :data-testid="testId"
    :data-variant="variant"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="isQuoteBand && quote"
      key="quote"
      :divided="false"
      :padded="false"
    >
      <RegistrationFrame
        flush
        borders="y"
        marks="bottom"
      >
        <div
          :data-variant="quoteVariant"
          class="p-(--spacing-xl) lg:data-[variant=signed]:max-w-(--container-5xl)"
        >
          <Quote
            :variant="quoteVariant"
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
                class="h-8 max-w-(--size-40) group-data-[variant=highlight]:md:h-24 group-data-[variant=highlight]:md:max-w-none"
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
                variant="secondary"
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
                variant="outline"
                size="large"
                :target="secondaryAction.target"
                :icon="secondaryAction.trailing ? 'ai ai-chevron-right' : ''"
                icon-position="trailing"
                :animated="Boolean(secondaryAction.trailing)"
              />
            </template>
          </Quote>
        </div>
      </RegistrationFrame>
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

      <RegistrationFrame
        flush
        borders="y"
        marks="all"
      >
        <LogoWall
          variant="rectangle"
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
              :variant="markKind(logos[index])"
              :data-treatment="logos[index].logoTreatment ?? 'color'"
              class="h-5 sm:max-w-24"
            />
          </template>
          <template
            v-if="quote"
            #aside
          >
            <Quote
              variant="signed"
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
                  variant="secondary"
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
                  variant="outline"
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
      </RegistrationFrame>
    </SectionModule>
  </section>
</template>

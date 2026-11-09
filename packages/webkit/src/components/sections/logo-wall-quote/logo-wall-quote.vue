<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Button from '../../actions/button/button.vue'
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
    /** Destination the mark links to, such as that client's success case. */
    href?: string
  }

  /** The signed quote set in the wall's aside. */
  export type LogoWallQuoteQuote = {
    /** The quotation text. */
    text: string
    /** Name of the person who said it. */
    name: string
    /** Role of that person and where they work. */
    jobTitle: string
    /** URL of the company mark shown above the quotation. */
    logo: string
    /** Alternative text naming the company of the mark. */
    logoAlt: string
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
  }

  const props = withDefaults(defineProps<Props>(), {
    eyebrow: '',
    title: '',
    ariaLabel: '',
    logos: () => [],
    quote: undefined,
    primaryAction: undefined
  })

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'sections-logo-wall-quote'
  )

  const hasLogos = computed(() => props.logos.length > 0)

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
    v-bind="$attrs"
    :data-testid="testId"
    :aria-label="title || undefined"
  >
    <SectionModule
      v-if="hasLogos"
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
            <template v-if="logos[index]?.logoLight">
              <img
                :src="logos[index]?.logo"
                :alt="logos[index]?.name"
                decoding="async"
                class="h-5 w-auto max-w-full object-contain sm:max-w-24 hidden [[data-theme=dark]_&]:block"
              />
              <img
                :src="logos[index]?.logoLight"
                :alt="logos[index]?.name"
                decoding="async"
                class="h-5 w-auto max-w-full object-contain sm:max-w-24 block [[data-theme=dark]_&]:hidden"
              />
            </template>
            <img
              v-else
              :src="logos[index]?.logo"
              :alt="logos[index]?.name"
              :data-treatment="logos[index]?.logoTreatment ?? 'as-is'"
              decoding="async"
              class="h-5 w-auto max-w-full object-contain sm:max-w-24 data-[treatment=monochrome]:brightness-0 [[data-theme=dark]_&[data-treatment=monochrome]]:invert data-[treatment=invert-light]:invert [[data-theme=dark]_&[data-treatment=invert-light]]:invert-0"
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
                <img
                  :src="quote.logo"
                  :alt="quote.logoAlt"
                  decoding="async"
                  class="h-8 w-auto max-w-40 object-contain"
                />
              </template>
              <template #actions>
                <Button
                  v-if="primaryAction"
                  :label="primaryAction.label"
                  :href="primaryAction.href"
                  kind="secondary"
                  size="large"
                  :target="primaryAction.target"
                  :icon="primaryAction.trailing ? 'pi pi-chevron-right' : ''"
                  icon-position="trailing"
                  :animated="Boolean(primaryAction.trailing)"
                />
              </template>
            </Quote>
          </template>
        </LogoWall>
      </FrameBox>
    </SectionModule>
  </section>
</template>

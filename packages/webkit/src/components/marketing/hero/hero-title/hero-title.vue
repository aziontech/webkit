<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Eyebrow from '../../../content/eyebrow/eyebrow.vue'

  defineOptions({
    name: 'HeroTitle',
    inheritAttrs: false
  })

  /** Mark set before the eyebrow label. */
  export type HeroTitleEyebrowPrefix = '' | '//' | '<>' | '</>'

  /** Headline scale. */
  export type HeroTitleSize = 'medium' | 'large'

  /** Where the copy block aligns. */
  export type HeroTitleAlign = 'start' | 'center'

  /** Width the copy block is capped at. */
  export type HeroTitleWidth = 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

  export interface HeroTitleProps {
    /** Headline of the page, rendered as the page's `h1`. */
    title: string
    /** Opening phrase of the headline, painted in the brand accent; reads as one sentence with `title`. */
    titleHighlight?: string
    /** Supporting sentence under the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Mark set before the eyebrow label; empty renders the label alone. */
    eyebrowPrefix?: HeroTitleEyebrowPrefix
    /** Where the whole block — copy, headline and actions — aligns, at every width. */
    align?: HeroTitleAlign
    /** Where the whole block aligns below the medium breakpoint only, where a band with media stacks the copy above it; unset, it follows align. */
    mobileAlign?: HeroTitleAlign
    /** Headline scale; medium steps one rung below large. */
    size?: HeroTitleSize
    /** Width the copy block — headline, paragraph and actions — is capped at. */
    maxWidth?: HeroTitleWidth
    /** Keep the block pinned beneath the fixed chrome while the column beside it scrolls, from the large breakpoint up. */
    sticky?: boolean
  }

  withDefaults(defineProps<HeroTitleProps>(), {
    titleHighlight: '',
    description: '',
    eyebrow: '',
    eyebrowPrefix: '',
    align: 'start',
    mobileAlign: undefined,
    size: 'medium',
    maxWidth: '4xl',
    sticky: false
  })

  const slots = defineSlots<{
    /** Replaces the description with richer content; falls back to the description prop. */
    default?(): unknown
    /** The band's calls to action, under the copy. */
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'hero-title')
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-align="align"
    :data-mobile-align="mobileAlign"
    :data-width="maxWidth"
    :data-sticky="sticky || null"
    class="group flex w-full max-w-(--container-4xl) flex-col items-start gap-(--spacing-md) data-[width=lg]:max-w-(--container-lg) data-[width=xl]:max-w-(--container-xl) data-[width=2xl]:max-w-(--container-2xl) data-[width=3xl]:max-w-(--container-3xl) lg:data-[sticky]:sticky lg:data-[sticky]:self-start lg:data-[sticky]:top-[calc(var(--hero-banner-offset,0rem)+var(--spacing-xl))] data-[align=center]:mx-auto data-[align=center]:items-center data-[align=center]:text-center max-md:data-[mobile-align=center]:mx-auto max-md:data-[mobile-align=center]:items-center max-md:data-[mobile-align=center]:text-center max-md:data-[mobile-align=start]:mx-0 max-md:data-[mobile-align=start]:items-start max-md:data-[mobile-align=start]:text-start"
  >
    <Eyebrow
      v-if="eyebrow"
      :prefix="eyebrowPrefix"
      :single-line="false"
      cursor
      >{{ eyebrow }}</Eyebrow
    >
    <h1
      :data-size="size"
      class="m-0 text-balance text-(--text-default) data-[size=large]:text-heading-2xl data-[size=medium]:text-heading-xl"
    >
      <span
        v-if="titleHighlight"
        class="text-(--text-primary) [text-shadow:0_0_2rem_color-mix(in_srgb,var(--primary)_30%,transparent)]"
        >{{ titleHighlight }}</span
      >
      {{ title }}
    </h1>
    <p
      v-if="description || slots.default"
      class="mx-0 mb-0 text-pretty text-body-lg text-(--text-muted)"
    >
      <slot>{{ description }}</slot>
    </p>
    <div
      v-if="slots.actions"
      class="@container mt-(--spacing-xs) w-full"
    >
      <div
        class="flex flex-col items-stretch gap-(--spacing-sm) [&>*]:w-full @2xs:flex-row @2xs:flex-wrap @2xs:items-center @2xs:group-data-[align=center]:justify-center max-md:@2xs:group-data-[mobile-align=center]:justify-center max-md:@2xs:group-data-[mobile-align=start]:justify-start @2xs:[&>*]:w-auto"
      >
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

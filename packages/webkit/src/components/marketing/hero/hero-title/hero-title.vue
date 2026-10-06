<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Overline from '../../../overline/overline.vue'

  defineOptions({
    name: 'HeroTitle',
    inheritAttrs: false
  })

  /** Mark set before the eyebrow label. */
  export type HeroTitleEyebrowPrefix = '' | '//' | '<>' | '</>'

  /** Headline scale. */
  export type HeroTitleSize = 'medium' | 'large'

  /** Width the copy block is capped at. */
  export type HeroTitleWidth = 'lg' | 'xl' | '2xl' | '3xl' | '4xl'

  interface Props {
    /** Headline of the page, rendered as the page's `h1`. */
    title: string
    /** Opening phrase of the headline, painted in the brand accent; reads as one sentence with `title`. */
    highlight?: string
    /** Supporting sentence under the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Mark set before the eyebrow label; empty renders the label alone. */
    eyebrowPrefix?: HeroTitleEyebrowPrefix
    /** Center the whole block — copy, headline and actions — instead of aligning it to the start. */
    centered?: boolean
    /** Headline scale; medium steps one rung below large. */
    size?: HeroTitleSize
    /** Width the copy block — headline, paragraph and actions — is capped at. */
    maxWidth?: HeroTitleWidth
    /** Keep the block pinned beneath the fixed chrome while the column beside it scrolls, from the large breakpoint up. */
    sticky?: boolean
  }

  withDefaults(defineProps<Props>(), {
    highlight: '',
    description: '',
    eyebrow: '',
    eyebrowPrefix: '',
    centered: false,
    size: 'large',
    maxWidth: '4xl',
    sticky: false
  })

  const slots = defineSlots<{
    default?(): unknown
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'marketing-hero-title'
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-centered="centered || null"
    :data-width="maxWidth"
    :data-sticky="sticky || null"
    class="group flex w-full max-w-(--container-4xl) flex-col items-start gap-(--spacing-md) data-[width=lg]:max-w-(--container-lg) data-[width=xl]:max-w-(--container-xl) data-[width=2xl]:max-w-(--container-2xl) data-[width=3xl]:max-w-(--container-3xl) lg:data-[sticky]:sticky lg:data-[sticky]:self-start lg:data-[sticky]:top-[calc(var(--banner-offset,0rem)+var(--spacing-xl))] data-[centered]:mx-auto data-[centered]:items-center data-[centered]:text-center"
  >
    <Overline
      v-if="eyebrow"
      :prefix="eyebrowPrefix"
      show-cursor
      >{{ eyebrow }}</Overline
    >
    <h1
      :data-size="size"
      class="m-0 text-balance text-(--text-default) data-[size=large]:text-heading-2xl data-[size=medium]:text-heading-xl"
    >
      <span
        v-if="highlight"
        class="text-(--primary) [text-shadow:0_0_2rem_color-mix(in_srgb,var(--primary)_30%,transparent)]"
        >{{ highlight }}</span
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
        class="flex flex-col items-stretch gap-(--spacing-sm) [&>*]:w-full @xs:flex-row @xs:flex-wrap @xs:items-center @xs:group-data-[centered]:justify-center @xs:[&>*]:w-auto"
      >
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

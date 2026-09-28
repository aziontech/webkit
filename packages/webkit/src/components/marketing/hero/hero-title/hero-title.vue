<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Overline from '../../../overline/overline.vue'

  defineOptions({
    name: 'HeroTitle',
    inheritAttrs: false
  })

  /** Mark set before the eyebrow label. */
  export type HeroTitleEyebrowPrefix = '' | '//' | '<>' | '</>'

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
  }

  withDefaults(defineProps<Props>(), {
    highlight: '',
    description: '',
    eyebrow: '',
    eyebrowPrefix: '',
    centered: false
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
    class="group flex flex-col items-start gap-(--spacing-md) data-[centered]:items-center data-[centered]:text-center"
  >
    <Overline
      v-if="eyebrow"
      :prefix="eyebrowPrefix"
      show-cursor
      >{{ eyebrow }}</Overline
    >
    <h1 class="m-0 max-w-(--container-4xl) text-balance text-heading-2xl text-(--text-default)">
      <span
        v-if="highlight"
        class="text-(--primary) [text-shadow:0_0_2rem_color-mix(in_srgb,var(--primary)_30%,transparent)]"
        >{{ highlight }}</span
      >
      {{ title }}
    </h1>
    <p
      v-if="description || slots.default"
      class="m-0 max-w-(--container-2xl) text-pretty text-body-lg text-(--text-muted)"
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

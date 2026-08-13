<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  import Overline from '../../overline/overline.vue'

  defineOptions({
    name: 'HeroTitle',
    inheritAttrs: false
  })

  interface Props {
    /** Headline of the page, rendered as the page's `h1`. */
    title: string
    /** Opening phrase of the headline, painted in the brand accent; reads as one sentence with `title`. */
    highlight?: string
    /** Supporting sentence under the headline; overridden by the default slot. */
    description?: string
    /** Short uppercase overline rendered above the headline. */
    eyebrow?: string
    /** Center the whole block — copy, headline and actions — instead of aligning it to the start. */
    centered?: boolean
  }

  withDefaults(defineProps<Props>(), {
    highlight: '',
    description: '',
    eyebrow: '',
    centered: false
  })

  const slots = defineSlots<{
    default?(): unknown
    actions?(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-hero-title'
  )
</script>

<template>
  <header
    v-bind="$attrs"
    :data-testid="testId"
    :data-centered="centered || null"
    class="group flex flex-col items-start gap-(--spacing-md) data-[centered]:items-center data-[centered]:text-center"
  >
    <Overline v-if="eyebrow">{{ eyebrow }}</Overline>
    <h1 class="m-0 max-w-(--container-4xl) text-balance text-heading-2xl text-(--text-default)">
      <!-- The accent phrase: a discrete vertical gradient across the primary (one palette
           family, so it reads as one colour catching the light rather than as two),
           clipped to the glyphs, plus a soft glow. The glow is `drop-shadow` and not a
           text shadow because the text itself is transparent here — the paint is the
           clipped background, and only a filter sees that. -->
      <span
        v-if="highlight"
        class="bg-[linear-gradient(180deg,var(--color-orange-400)_0%,var(--primary)_58%,var(--color-orange-600)_100%)] bg-clip-text text-transparent [filter:drop-shadow(0_0_2rem_color-mix(in_srgb,var(--primary)_30%,transparent))]"
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
    <!-- The actions row owns its own layout so a caller only drops controls in. Below
         `sm` the CTAs stack and go fluid — a hero button is the page's primary target —
         and `[&>*]:w-full` is what carries that to the slotted children, since the
         wrapper's own width says nothing about theirs. From `sm` up they return to a
         content-width row. -->
    <div
      v-if="slots.actions"
      class="mt-(--spacing-xs) flex w-full flex-col items-stretch gap-(--spacing-sm) [&>*]:w-full sm:w-auto sm:flex-row sm:items-center sm:[&>*]:w-auto sm:group-data-[centered]:justify-center"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup>
  /**
   * HeroTitle — the copy block of a hero band.
   *
   * The hero counterpart to SectionTitle: eyebrow → headline → description →
   * actions, in that order, at hero scale. It goes in a BannerContainer's default
   * slot, above whatever the banner backdrop is:
   *
   *   <BannerContainer hero banner="contour">
   *     <HeroTitle eyebrow="…" title="…" description="…">
   *       <template #actions>…</template>
   *     </HeroTitle>
   *   </BannerContainer>
   *
   * Left-aligned by default; `centered` centers the whole block — copy, headline and
   * actions — for a hero whose backdrop is symmetric (the globe) or that leads with
   * one statement. Left reads faster and pairs with a backdrop weighted to one side,
   * so it stays the default.
   *
   * The eyebrow is webkit's Overline — the same component SectionTitle uses — so
   * the hero and every section below it wear one overline treatment.
   *
   * The headline is the page's `h1`; a section's is an `h2` (SectionTitle), which
   * keeps one document outline per page.
   *
   *   • highlight — an opening phrase set in the brand primary, ahead of `title`.
   *     It reads as one sentence with the rest of the headline (one `h1`, one
   *     accessible name), it is only painted differently.
   *
   * Slots: default = description body (an alternative to the prop), #actions =
   * leading CTAs under the copy.
   */
  import Overline from '@aziontech/webkit/overline'

  defineProps({
    title: {
      type: String,
      required: true
    },
    // Opening phrase of the headline, painted in the primary accent.
    highlight: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    // Optional uppercase overline above the headline.
    eyebrow: {
      type: String,
      default: ''
    },
    // Center the whole block instead of aligning it left.
    centered: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <header
    :class="[
      'flex flex-col gap-[var(--spacing-md)]',
      centered ? 'items-center text-center' : 'items-start'
    ]"
  >
    <Overline v-if="eyebrow">{{ eyebrow }}</Overline>
    <h1
      class="m-0 max-w-[var(--container-4xl)] text-balance text-heading-2xl text-[var(--text-default)]"
    >
      <!-- The accent phrase: a discrete vertical gradient across the primary
           (orange-400 → primary → orange-600, one palette family, so it reads as one
           colour that catches the light rather than as two), clipped to the glyphs,
           plus a soft glow. The glow is `drop-shadow` and not `text-shadow` because
           the text itself is transparent here — the paint is the clipped background,
           and only a filter sees that. -->
      <span
        v-if="highlight"
        class="bg-[linear-gradient(180deg,var(--color-orange-400)_0%,var(--primary)_58%,var(--color-orange-600)_100%)] bg-clip-text text-transparent [filter:drop-shadow(0_0_2rem_color-mix(in_srgb,var(--primary)_30%,transparent))]"
        >{{ highlight }}</span
      >
      {{ title }}
    </h1>
    <p
      v-if="description || $slots.default"
      class="m-0 max-w-[var(--container-2xl)] text-pretty text-body-lg leading-relaxed text-[var(--text-muted)]"
    >
      <slot>{{ description }}</slot>
    </p>
    <!-- The actions row owns its own layout so a caller only drops Buttons in. Below
         `sm` the CTAs stack and go fluid — a hero button is the page's primary target
         and a thumb should not have to aim at a shrink-wrapped label — and `[&>*]:w-full`
         is what carries that to the slotted children, since the wrapper's own width
         says nothing about theirs. From `sm` up they return to a content-width row. -->
    <div
      v-if="$slots.actions"
      :class="[
        'mt-[var(--spacing-xs)] flex w-full flex-col items-stretch gap-[var(--spacing-sm)] [&>*]:w-full',
        'sm:w-auto sm:flex-row sm:items-center sm:[&>*]:w-auto',
        centered && 'sm:justify-center'
      ]"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

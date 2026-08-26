<script setup>
  import Overline from '@aziontech/webkit/overline'

  /**
   * PageHeader - page/section heading used across the Hub views.
   *
   * Renders an optional eyebrow (overline), a title, a description (prop or
   * default slot), and an optional trailing `actions` slot for CTAs.
   *
   *   • level — the heading tag: 'h1' for a page top, 'h2' for an in-page band.
   *   • size  — the scale: 'section' (band), 'page' (page top, default), 'hero'.
   *
   * The defaults (level 'h1', size 'page') preserve the original page-top look,
   * so existing usages need no change.
   */
  defineProps({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    // Optional uppercase overline above the title (e.g. "Webkit Hub").
    eyebrow: {
      type: String,
      default: ''
    },
    // Semantic heading tag — page tops are h1, in-page bands are h2.
    level: {
      type: String,
      default: 'h1',
      validator: (v) => ['h1', 'h2'].includes(v)
    },
    // Visual scale of the heading.
    size: {
      type: String,
      default: 'page',
      validator: (v) => ['section', 'page', 'hero'].includes(v)
    },
    // Bottom spacing — overridable (pass '' when the header is vertically centered).
    marginBottom: {
      type: String,
      default: 'mb-12'
    },
    // Measure of the headline itself, as a `max-w-*` class. `hero` caps at the
    // page measure by default; pass a narrower one to choose where a short title
    // breaks (the balance algorithm then splits it into even lines).
    titleMaxWidth: {
      type: String,
      default: ''
    },
    // Measure of the description, as a `max-w-*` class. Each scale carries its
    // own default; pass a narrower one when that default breaks the lead late
    // and leaves a stub second line (a wide cap rags badly on a short lead).
    descriptionMaxWidth: {
      type: String,
      default: ''
    }
  })
</script>

<template>
  <header :class="marginBottom">
    <Overline
      v-if="eyebrow"
      class="mb-3"
    >
      {{ eyebrow }}
    </Overline>
    <component
      :is="level"
      :class="[
        'text-default m-0 text-balance',
        {
          'text-heading-lg': size === 'section',
          'text-heading-xl': size === 'page',
          'text-heading-2xl': size === 'hero'
        },
        titleMaxWidth || (size === 'hero' ? 'max-w-(--container-4xl)' : '')
      ]"
    >
      {{ title }}
    </component>
    <p
      v-if="description || $slots.default"
      :class="[
        'text-muted m-0 text-pretty leading-relaxed',
        size === 'hero' ? 'mt-(--spacing-lg) text-body-lg' : 'mt-4 text-body-md',
        descriptionMaxWidth || (size === 'hero' ? 'max-w-(--container-2xl)' : 'max-w-[620px]')
      ]"
    >
      <slot>
        {{ description }}
      </slot>
    </p>
    <div
      v-if="$slots.actions"
      :class="size === 'hero' ? 'mt-(--spacing-xl)' : 'mt-6'"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

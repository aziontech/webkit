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
          'text-heading-2xl max-w-(--container-4xl)': size === 'hero'
        }
      ]"
    >
      {{ title }}
    </component>
    <p
      v-if="description || $slots.default"
      :class="[
        'text-muted m-0 mt-4 text-pretty leading-relaxed',
        size === 'hero' ? 'max-w-(--container-2xl) text-body-lg' : 'max-w-[620px] text-body-md'
      ]"
    >
      <slot>
        {{ description }}
      </slot>
    </p>
    <div
      v-if="$slots.actions"
      class="mt-6"
    >
      <slot name="actions" />
    </div>
  </header>
</template>

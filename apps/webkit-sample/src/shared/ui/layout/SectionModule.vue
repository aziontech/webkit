<script setup>
  /**
   * SectionModule — a self-contained "lego" content module.
   *
   * The framed-module pattern shared across the Hub and Docs: a <section> whose
   * header row is divided from its body by a hairline (border-b), and which is
   * divided from the module above it by a hairline (border-t). Stacked inside a
   * SectionContainer, the modules read as bricks in one continuous bordered
   * frame — the column's border-x owns the outer edges so nothing doubles.
   *
   *   • title / description — header-row copy (rendered via PageHeader as an h2
   *     "section" heading). Omit both (and pass no #header) for a body-only
   *     module.
   *   • divided — draw the top rule that separates this module from the one
   *     above. Set false only on the first module in a container (its top edge is
   *     the banner's border-b).
   *   • padded — pad the body (default true). Pass false when the body is an
   *     edge-to-edge grid (a CardGrid) that owns its own cell padding, so the
   *     grid's dividers meet the frame with no gutter.
   *
   * Slots: default = body; #header replaces the title/description header row with
   * custom markup; #actions = trailing CTAs inside the default header row.
   */
  import PageHeader from './PageHeader.vue'

  defineProps({
    title: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      default: ''
    },
    divided: {
      type: Boolean,
      default: true
    },
    padded: {
      type: Boolean,
      default: true
    }
  })
</script>

<template>
  <section :class="['w-full', divided && 'border-t border-(--border-default)']">
    <!-- Header row: a single border-b divides it from the body; its sides are the
         column's border-x. A #header slot overrides the default title row. -->
    <slot name="header">
      <PageHeader
        v-if="title"
        level="h2"
        size="section"
        margin-bottom=""
        class="border-b border-(--border-default) p-(--spacing-xl)"
        :title="title"
        :description="description"
      >
        <template
          v-if="$slots.actions"
          #actions
        >
          <slot name="actions" />
        </template>
      </PageHeader>
    </slot>

    <div :class="padded && 'p-(--spacing-xl)'">
      <slot />
    </div>
  </section>
</template>

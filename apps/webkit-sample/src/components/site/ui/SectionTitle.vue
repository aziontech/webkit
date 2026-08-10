<script setup>
  /**
   * SectionTitle — the framed, centered header row of a section module.
   *
   * The industrial section opener: a registration frame (FrameBox corner squares)
   * around a centered headline, closed by the hairline that divides it from the
   * module body. The frame is `flush`, so the rule it shares with whatever sits
   * above it (the hero band, a section gap) is drawn once. It is passed to
   * SectionModule's `#header` slot, which replaces that module's default
   * left-aligned PageHeader row:
   *
   *   <SectionModule :padded="false">
   *     <template #header>
   *       <SectionTitle title="…" description="…" />
   *     </template>
   *     <CardGrid variant="divider">…</CardGrid>
   *   </SectionModule>
   *
   * There is no gap around the frame: the FrameBox spans the column edge to edge
   * and its own bottom border is what divides the title from the body, so the row
   * adds no outer padding and no second rule. All the air is padding-y *inside*
   * the frame (`height`), which is the page's only vertical spacing mechanism —
   * that and the SectionGap frames between sections.
   *
   *   • eyebrow  — optional overline above the headline.
   *   • height   — 'default' | 'tall' — how much air the frame holds. 'tall' is
   *                for a section that opens a major part of the page.
   *   • hatch    — pass through FrameBox's vertical hatch texture.
   *
   * Slots: #actions = centered CTAs under the description.
   */
  import Overline from '@aziontech/webkit/overline'

  import FrameBox from './FrameBox.vue'

  const HEIGHT = {
    default: 'min-h-[clamp(200px,24vh,320px)]',
    tall: 'min-h-[clamp(280px,32vh,420px)]'
  }

  defineProps({
    title: {
      type: String,
      required: true
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
    // One of the HEIGHT keys ('default', 'tall').
    height: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'tall'].includes(v)
    },
    // Draw FrameBox's vertical hatch behind the copy.
    hatch: {
      type: Boolean,
      default: false
    }
  })
</script>

<template>
  <FrameBox
    flush
    :hatch="hatch"
    class="border-x-0"
  >
    <div
      :class="[
        HEIGHT[height],
        'flex flex-col items-center justify-center gap-[var(--spacing-md)] px-[var(--spacing-xl)] py-[var(--spacing-xl)] text-center'
      ]"
    >
      <!-- The overline anatomy the Figma sections share: a `//` prefix, the label in the
           accent, and the blinking cursor. All three are props of webkit's Overline, so
           this is the DS component configured — not a copy of its look. -->
      <Overline
        v-if="eyebrow"
        prefix="//"
        show-cursor
        >{{ eyebrow }}</Overline
      >
      <h2
        class="m-0 max-w-[var(--container-4xl)] text-balance text-heading-lg text-[var(--text-default)]"
      >
        {{ title }}
      </h2>
      <p
        v-if="description || $slots.default"
        class="m-0 max-w-[var(--container-2xl)] text-pretty text-body-lg text-[var(--text-muted)]"
      >
        <slot>{{ description }}</slot>
      </p>
      <!-- Same actions row as HeroTitle: stacked and fluid below `sm`, a centered
           content-width row above it. `[&>*]:w-full` is what reaches the slotted
           Buttons — the wrapper going full width does not widen them on its own. -->
      <div
        v-if="$slots.actions"
        class="flex w-full flex-col items-stretch gap-[var(--spacing-sm)] [&>*]:w-full sm:w-auto sm:flex-row sm:items-center sm:justify-center sm:[&>*]:w-auto"
      >
        <slot name="actions" />
      </div>
    </div>
  </FrameBox>
</template>

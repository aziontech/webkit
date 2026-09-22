<script setup>
  // THE OVERVIEW BLOCK — one card, stacked bands, three heights.
  //
  // Every resource page opens on the same object: a card that says what the record IS.
  // Applications and Workloads had each grown their own copy of it, and the two had
  // drifted on the only thing a reader notices across pages — the height of the strips.
  // This component owns that geometry so a third resource inherits it instead of
  // re-deciding it.
  //
  //   subject   56px   the address the record answers on + its actions (medium, 32px)
  //   facts     auto   captioned values; the consumer brings the grid
  //   state     48px   a recessed strip about the record's current state
  //
  // The three are stacked inside one `CardBox :padded="false"`: each band's own top
  // border is the rule between it and the one above, so the card stays ONE object at
  // three grains rather than three cards.
  //
  // A band that holds a control with its own insets (an Accordion) passes
  // `:padded="false"` and keeps the recess, the rule and the floor without the inset.
  defineProps({
    /** Which band this is — `subject` (56px), `facts` (auto) or `state` (48px). */
    kind: { type: String, default: 'facts' },
    /** Off when the band's own child owns its insets (an Accordion, a table). */
    padded: { type: Boolean, default: true }
  })
</script>

<template>
  <div
    :data-band="kind"
    :data-padded="padded || null"
    class="@container/band data-[padded]:px-(--spacing-md) data-[band=subject]:flex data-[band=subject]:min-h-(--size-14) data-[band=subject]:flex-wrap data-[band=subject]:items-center data-[band=subject]:gap-x-(--spacing-md) data-[band=subject]:gap-y-(--spacing-xs) data-[band=subject]:data-[padded]:py-(--spacing-xs) data-[band=facts]:border-t data-[band=facts]:border-(--border-muted) data-[band=facts]:data-[padded]:py-(--spacing-md) data-[band=state]:flex data-[band=state]:min-h-(--size-12) data-[band=state]:flex-wrap data-[band=state]:items-center data-[band=state]:gap-x-(--spacing-md) data-[band=state]:gap-y-(--spacing-xs) data-[band=state]:border-t data-[band=state]:border-(--border-muted) data-[band=state]:bg-(--bg-canvas) data-[band=state]:data-[padded]:py-(--spacing-xs)"
  >
    <slot />
  </div>
</template>

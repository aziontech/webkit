<script setup>
  /**
   * SectionGap — the empty registration frame that divides two sections.
   *
   * The page has no margins between sections: this frame IS the gap. It holds the
   * vertical air, and its own two rules are what divide the sections it sits
   * between — which is why it is a frame and not a spacer div.
   *
   * `flush` means the rule it shares with the section above is drawn once: the
   * frame's top border lands on that section's bottom border instead of beside it.
   *
   * The height is a clamp, not a fixed step, so the air scales with the viewport
   * (8rem on a short screen → 14rem on a tall one) instead of freezing at one
   * value. It lives here rather than at the call site so every gap on a page stays
   * one decision — changing the page's rhythm is an edit to this file.
   */
  import FrameBox from './FrameBox.vue'
</script>

<template>
  <FrameBox
    flush
    class="h-[clamp(8rem,20vh,14rem)] border-x-0"
  />
</template>

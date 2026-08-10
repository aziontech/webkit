<script setup>
  /**
   * FrameBox — the Azion "registration frame" container.
   *
   * A thin bordered box with a small registration square set inside each corner
   * and an optional vertical hatch-line texture behind the content, matching the
   * framed sections on azion.com. Wrap any content in the default slot.
   *
   *   • marks    — show the four corner registration squares.
   *   • hatch    — show the faint vertical hatch-line texture, faded at the edges.
   *   • flush    — share the rule above: pull the frame up by exactly the border
   *                width so its own top rule lands ON the bottom rule of whatever it
   *                stacks under. Every frame still draws all four of its sides, but a
   *                junction between two of them reads as one hairline instead of two.
   *                This is what keeps the page's frame at 1px everywhere without any
   *                frame having to know which neighbour owns the shared edge.
   *   • bordered — draw the frame's own four rules (default). The same border
   *                discipline as `flush`, taken one step further: a frame used as a
   *                cell of a `gap-px` divider grid has every one of its edges already
   *                drawn by the grid's own seams, so it draws none of its own and
   *                contributes only the corner marks. `flush` shares one rule with a
   *                neighbour; this hands over all four.
   */
  defineProps({
    marks: {
      type: Boolean,
      default: true
    },
    hatch: {
      type: Boolean,
      default: false
    },
    flush: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean,
      default: true
    }
  })

  // Corner placement: each square is anchored to its corner and inset from both
  // rules by its own margin, so the mark sits INSIDE the frame instead of
  // straddling the border line.
  const corners = ['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0']
</script>

<template>
  <div
    :class="['relative', bordered && 'border border-[var(--border-default)]', flush && '-mt-px']"
  >
    <!-- Vertical hatch-line texture, faded toward the edges. -->
    <div
      v-if="hatch"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(to_right,var(--border-muted)_0,var(--border-muted)_1px,transparent_1px,transparent_var(--spacing-lg))] mask-[radial-gradient(ellipse_at_center,black,transparent_85%)]"
    />

    <!-- Corner registration squares. `m-1` is the inset from both rules, which is
         what puts the mark inside the frame; at 6px filled it reads as a tick in
         the corner rather than a second, competing border. -->
    <template v-if="marks">
      <span
        v-for="corner in corners"
        :key="corner"
        aria-hidden="true"
        :class="[
          'pointer-events-none absolute z-20 m-1 block size-[6px] bg-[var(--border-default)]',
          corner
        ]"
      />
    </template>

    <!-- Content sits above the hatch texture. `h-full` is what lets a frame used as a
         grid cell hand its stretched height down to the content: against an auto-height
         frame it resolves to auto (no effect), but when the grid stretches the frame to
         the tallest cell in the row, the content fills it — so a cell can push its
         footer onto the row's bottom edge and align with its neighbours. -->
    <div class="relative z-10 h-full">
      <slot />
    </div>
  </div>
</template>

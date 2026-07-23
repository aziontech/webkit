<script setup>
  // One cell of the interactive "Component Grid" banner. It frames a single,
  // display-only @aziontech/webkit component sitting on the 3D-tilted plane, and
  // is the hover/focus target: on hover (or keyboard focus) the cell lifts toward
  // the viewer and un-tilts to face them, revealing a dashed accent ring
  // (flat corners) and a small floating label naming the component.
  //
  // The cell — not its inner component — owns the pointer/focus interaction, so
  // hover hit-testing stays reliable under the parent plane's 3D transform and
  // every component is reachable by keyboard (tabindex="0").
  defineProps({
    /** Component name shown in the floating highlight label. */
    name: { type: String, required: true }
  })
</script>

<template>
  <div
    class="cell group relative"
    tabindex="0"
    :aria-label="`${name} component`"
  >
    <!-- Dashed accent ring with flat corners + a soft accent glow ring. -->
    <span
      aria-hidden="true"
      class="ring pointer-events-none absolute -inset-[var(--spacing-sm)] rounded-[var(--shape-flat)] border border-dashed border-[var(--primary)] opacity-0 ring-1 ring-[var(--primary)]"
    />
    <!-- Floating label tag (plain label, not the Tag component), top-left. -->
    <span
      aria-hidden="true"
      class="label pointer-events-none absolute -top-[var(--spacing-md)] left-[calc(-1*var(--spacing-sm))] rounded-[var(--shape-flat)] bg-[var(--primary)] px-[var(--spacing-xxs)] py-px text-label-sm leading-none text-[var(--primary-contrast)] opacity-0"
    >
      {{ name }}
    </span>
    <!-- The showcased component, display-only (no inner interaction). -->
    <div class="pointer-events-none select-none">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  /* 3D mechanics only — every color / spacing / shape value above is a theme
     token. Perspective/rotate geometry has no token, so it lives here. */
  .cell {
    transform-style: preserve-3d;
    transition: transform 240ms var(--ease-out, ease-out);
    outline: none;
  }

  .ring,
  .label {
    transition:
      opacity 150ms var(--ease-out, ease-out),
      transform 150ms var(--ease-out, ease-out);
  }

  /* Lift toward the viewer WITHOUT relocating the cell: a centroid-stable scale
     keeps the pointer over the cell (a translate/rotate would move it out from
     under the cursor and make :hover flicker). translateZ pops it above
     neighbours on the shared 3D plane; the ring + label carry the highlight. */
  .cell:hover,
  .cell:focus-visible {
    transform: translateZ(40px) scale(1.06);
    z-index: 5;
  }

  .cell:hover .ring,
  .cell:focus-visible .ring,
  .cell:hover .label,
  .cell:focus-visible .label {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .cell,
    .ring,
    .label {
      transition: none;
    }
    .cell:hover,
    .cell:focus-visible {
      transform: none;
    }
  }
</style>

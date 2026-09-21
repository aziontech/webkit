<script setup>
  // THE ENABLED / DISABLED MARK — a filled disc with the glyph knocked out of it.
  //
  // ── WHY IT IS DRAWN HERE AND NOT AN ICON-FONT CLASS ──
  //
  // `pi-check-circle` is an OUTLINE glyph: a ring with a check inside it, both in the
  // text colour. The mark this replaces reads as a solid disc carrying a mark, which is a
  // different weight on the page — at 16px an outline reads as decoration and a filled
  // disc reads as a state. The icon font has no filled variant, so the shape is drawn.
  //
  // ── HOW THE KNOCKOUT WORKS, AND WHY IT MATTERS ──
  //
  // ONE path holds both the disc and the mark, with `fill-rule="evenodd"`. The mark is
  // therefore a HOLE, not a second shape painted in the background colour — so whatever
  // is behind the icon shows through it.
  //
  // That is the whole reason it is built this way. This mark sits on the workload card's
  // recessed footer (`--bg-canvas`), but the same component on a card would sit on
  // `--bg-surface`, and in a popover on `--bg-surface-raised`. A knocked-out glyph painted
  // in a fixed colour would show a seam on two of those three; a hole cannot.
  //
  // ── COLOUR ──
  //
  // `--success-contrast` when enabled: a safeguard that is on is a good state, and green
  // is what this system says that with.
  //
  // CONTRAST, not `--success`. That token is a SURFACE (#A4F4C0 light / #0A2916 dark) —
  // a disc filled with it measures 1.24:1 and 1.34:1 against the page and is invisible in
  // both themes. The ink is the contrast half: #12542B on light, #52E086 on dark, which
  // measure 8.64:1 and 12.37:1.
  //
  // Sized from `--size-4`, so the mark scales with the token ladder rather than a literal.
  const props = defineProps({
    /** Whether the thing this marks is on. Drives both the glyph and the colour. */
    enabled: { type: Boolean, default: false },
    /**
     * Accessible name. Empty by default: this mark almost always sits beside the word it
     * illustrates ("Enabled"), and naming it there too would have a screen reader say the
     * state twice. Pass one only when the mark stands alone.
     */
    label: { type: String, default: '' }
  })

  // A disc with the glyph punched out of it. Both subpaths are wound the same way, so
  // `evenodd` makes the inner one a hole.
  const DISC = 'M8 0a8 8 0 100 16A8 8 0 008 0z'
  const CHECK =
    'M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z'
  const DASH = 'M4.25 8a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H5A.75.75 0 014.25 8z'
</script>

<template>
  <svg
    class="h-(--size-4) w-(--size-4) shrink-0"
    :class="props.enabled ? 'text-(--success-contrast)' : 'text-(--text-muted)'"
    viewBox="0 0 16 16"
    fill="currentColor"
    fill-rule="evenodd"
    :role="props.label ? 'img' : undefined"
    :aria-label="props.label || undefined"
    :aria-hidden="props.label ? undefined : 'true'"
  >
    <path :d="`${DISC} ${props.enabled ? CHECK : DASH}`" />
  </svg>
</template>

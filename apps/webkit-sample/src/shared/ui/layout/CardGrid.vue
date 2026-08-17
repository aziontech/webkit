<script setup>
  /**
   * CardGrid — the responsive card-grid pattern used across the Hub and Docs.
   *
   * One column on mobile, fanning out to `columns` at the large breakpoint. Two
   * visual variants:
   *
   * `mobileColumns` opts a band out of the one-column mobile default: a grid of
   * short, glyph-led cells (a framework mark plus one word) reads better two-up on
   * a phone than as a tall single file. Cells with a description keep one column.
   *
   *   • 'gap'     — spaced cards separated by gutters (default). Each child is a
   *                 self-contained card (border + radius + bg of its own).
   *   • 'divider' — a hairline box grid: 1px gaps reveal the wrapper's border
   *                 colour as internal rules. Children must fill their own
   *                 background (bg-(--bg-canvas)) so only the gaps show.
   *
   * The divider variant carries no perimeter border, so it nests cleanly inside
   * a SectionContainer whose border-x owns the outer edges.
   */
  const COLS = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4'
  }

  const MOBILE_COLS = {
    1: 'grid-cols-1',
    2: 'grid-cols-2'
  }

  defineProps({
    // One of the COLS keys (2, 3, 4).
    columns: {
      type: Number,
      default: 3
    },
    // Columns below `sm` — 1 (default) or 2.
    mobileColumns: {
      type: Number,
      default: 1,
      validator: (v) => [1, 2].includes(v)
    },
    variant: {
      type: String,
      default: 'gap',
      validator: (v) => ['gap', 'divider'].includes(v)
    },
    // Divider hairline colour — 'default' (stronger) or 'muted'.
    dividerColor: {
      type: String,
      default: 'default',
      validator: (v) => ['default', 'muted'].includes(v)
    }
  })
</script>

<template>
  <div
    :class="[
      'grid',
      MOBILE_COLS[mobileColumns],
      COLS[columns],
      variant === 'divider'
        ? [
            'gap-px',
            dividerColor === 'muted' ? 'bg-(--border-muted)' : 'bg-(--border-default)'
          ]
        : 'gap-(--spacing-md)'
    ]"
  >
    <slot />
  </div>
</template>

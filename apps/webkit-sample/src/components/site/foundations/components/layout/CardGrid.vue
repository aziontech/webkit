<script setup>
  /**
   * CardGrid — the responsive card-grid pattern used across the Hub and Docs.
   *
   * One column on mobile, fanning out to `columns` at the large breakpoint. Two
   * visual variants:
   *
   *   • 'gap'     — spaced cards separated by gutters (default). Each child is a
   *                 self-contained card (border + radius + bg of its own).
   *   • 'divider' — a hairline box grid: 1px gaps reveal the wrapper's border
   *                 colour as internal rules. Children must fill their own
   *                 background (bg-[var(--bg-canvas)]) so only the gaps show.
   *
   * The divider variant carries no perimeter border, so it nests cleanly inside
   * a SectionContainer whose border-x owns the outer edges.
   */
  const COLS = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4'
  }

  defineProps({
    // One of the COLS keys (2, 3, 4).
    columns: {
      type: Number,
      default: 3
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
      'grid grid-cols-1',
      COLS[columns],
      variant === 'divider'
        ? ['gap-px', dividerColor === 'muted' ? 'bg-[var(--border-muted)]' : 'bg-[var(--border-default)]']
        : 'gap-[var(--spacing-md)]'
    ]"
  >
    <slot />
  </div>
</template>

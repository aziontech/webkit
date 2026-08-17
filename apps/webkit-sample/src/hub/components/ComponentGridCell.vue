<script setup>
  // One node of the "Component Grid" banner. It frames a single, fully-interactive
  // @aziontech/webkit component in a bordered, square cell — users can click, type,
  // toggle and tab straight into the real component. On hover (or when a child gets
  // focus) the node reveals a dashed accent ring and a small floating label naming
  // the component; there is no scale/lift, so the pointer never leaves the cell.
  //
  // The inner component owns its own interaction and keyboard access, so the cell
  // itself is presentational (no tabindex) and lights up via :focus-within. The
  // corner label is a real link to the component's Storybook docs (new tab), so a
  // click on the name opens the docs without hijacking the live demo underneath.
  import { computed } from 'vue'

  import { componentDocsUrl } from '../lib/component-docs.js'

  const props = defineProps({
    /** Component name shown in the floating highlight label. */
    name: { type: String, required: true },
    /**
     * Dense variant for catalog grids (colors, tokens, type samples): a shorter
     * cell with tighter padding, so a reference grid packs many cells per row.
     * The default (false) keeps the taller showcase size used by the component grid.
     */
    compact: { type: Boolean, default: false }
  })

  // The Storybook docs page for this component.
  const docsUrl = computed(() => componentDocsUrl(props.name))
</script>

<template>
  <div
    class="cell group relative flex items-center justify-center rounded-[var(--shape-flat)] border border-[var(--border-default)]"
    :class="
      compact ? 'min-h-[7.5rem] p-[var(--spacing-sm)]' : 'min-h-[200px] p-[var(--spacing-md)]'
    "
  >
    <!-- Dashed accent ring sitting on the node's border + a soft accent glow ring. -->
    <span
      aria-hidden="true"
      class="ring pointer-events-none absolute -inset-px rounded-[var(--shape-flat)] border border-dashed border-[var(--primary)] opacity-0 ring-1 ring-[var(--primary)]"
    />
    <!-- Floating label pinned inside the box at the top-left corner — a real link
         to the component's Storybook docs (new tab). Revealed on hover / focus via
         the .label opacity transition; focusing it lights the cell (:focus-within). -->
    <a
      :href="docsUrl"
      target="_blank"
      rel="noopener noreferrer"
      :aria-label="`Open ${name} docs on Storybook`"
      class="label absolute left-0 top-0 inline-flex items-center gap-[var(--spacing-xxs)] rounded-[var(--shape-flat)] bg-[var(--accent)] px-[var(--spacing-xxs)] py-px text-label-code-sm leading-none text-[var(--accent-contrast)] opacity-0 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
    >
      {{ name }}
      <i
        class="pi pi-external-link text-[0.6em]"
        aria-hidden="true"
      />
    </a>
    <!-- The showcased component — fully interactive. -->
    <slot />
  </div>
</template>

<style scoped>
  /* Highlight mechanics only — every color / spacing / shape value above is a theme
     token. */
  .cell {
    transition: border-color 150ms var(--ease-out, ease-out);
    outline: none;
  }

  .ring,
  .label {
    transition: opacity 150ms var(--ease-out, ease-out);
  }

  /* Lift the node above its neighbours so the ring, label and any component overlay
     (dropdowns, popovers) render on top. No scale — the pointer stays over the cell. */
  .cell:hover,
  .cell:focus-within {
    z-index: 5;
  }

  .cell:hover .ring,
  .cell:focus-within .ring,
  .cell:hover .label,
  .cell:focus-within .label {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .cell,
    .ring,
    .label {
      transition: none;
    }
  }
</style>

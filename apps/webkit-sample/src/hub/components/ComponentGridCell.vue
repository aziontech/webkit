<script setup>
  // One node of the "Component Grid" catalog. It frames a single, fully-interactive
  // @aziontech/webkit component in a bordered cell — users can click, type, toggle
  // and tab straight into the real component.
  //
  // The cell is two stacked regions: a preview stage that centres the live
  // component, and a caption bar that names it. The caption is ALWAYS visible —
  // a catalog you have to hover to read is not a catalog — and doubles as the
  // link to that component's Storybook docs page (new tab), so clicking the name
  // opens the docs without hijacking the live demo above it. Components that ship
  // without a docs page render the caption as plain text rather than sending the
  // reader to the docs landing page.
  //
  // On hover (or when a child gets focus) the node reveals a dashed accent ring;
  // there is no scale/lift, so the pointer never leaves the cell. The inner
  // component owns its own interaction and keyboard access, so the cell itself is
  // presentational (no tabindex) and lights up via :focus-within.
  import { computed } from 'vue'

  import { componentDocsUrl, hasComponentDocs } from '../lib/component-docs.js'

  const props = defineProps({
    /** Component name shown in the caption bar, and the docs page it links to. */
    name: { type: String, required: true },
    /**
     * How many columns the cell occupies. `single` is one column; `wide` is two
     * (a component that needs breathing room, like a Paginator); `full` spans the
     * whole row (shells and data surfaces — Table, Sidebar, GlobalHeader). Declared
     * here rather than as raw col-span classes at the call site, so the grid's
     * column count can change in one place.
     */
    span: { type: String, default: 'single' },
    /**
     * Dense variant for catalog grids (colors, tokens, type samples): a shorter
     * cell with tighter padding, so a reference grid packs many cells per row.
     * The default (false) keeps the taller showcase size used by the component grid.
     */
    compact: { type: Boolean, default: false },
    /**
     * Let the preview stage scroll horizontally instead of clipping. For wide
     * surfaces (Table, Flow, LogView) that would otherwise overflow the cell.
     */
    scrollable: { type: Boolean, default: false }
  })

  // Column span → the grid classes. Mirrors ComponentGrid's own column counts
  // (2 / md:4); changing them means changing both.
  const SPANS = {
    single: '',
    wide: 'col-span-2 md:col-span-2',
    full: 'col-span-2 md:col-span-4'
  }
  const spanClass = computed(() => SPANS[props.span] ?? SPANS.single)

  // The Storybook docs page for this component, and whether one exists at all.
  const docsUrl = computed(() => componentDocsUrl(props.name))
  const documented = computed(() => hasComponentDocs(props.name))
</script>

<template>
  <div
    class="cell group relative flex flex-col rounded-(--shape-flat) border border-(--border-default) bg-(--bg-canvas)"
    :class="spanClass"
  >
    <!-- Dashed accent ring sitting on the node's border + a soft accent glow ring. -->
    <span
      aria-hidden="true"
      class="ring pointer-events-none absolute -inset-px rounded-(--shape-flat) border border-dashed border-(--primary) opacity-0 ring-1 ring-(--primary)"
    />

    <!-- Preview stage: centres the showcased component, which stays fully
         interactive. `scrollable` trades clipping for a horizontal scroller on
         surfaces wider than the cell. -->
    <div
      class="flex flex-1 items-center justify-center"
      :class="[
        compact ? 'min-h-20 p-(--spacing-sm)' : 'min-h-[200px] p-(--spacing-md)',
        scrollable ? 'w-full overflow-x-auto' : ''
      ]"
    >
      <slot />
    </div>

    <!-- Caption bar: always readable, so the grid scans as a catalog. The name is
         the docs link when the component has a page; otherwise it is plain text
         and the cell says so, rather than linking to the docs landing page. -->
    <div
      class="flex items-center justify-between gap-(--spacing-xxs) border-t border-(--border-default) px-(--spacing-xs) py-(--spacing-xxs)"
    >
      <a
        v-if="documented"
        :href="docsUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`Open ${name} docs on Storybook`"
        class="name inline-flex min-w-0 items-center gap-(--spacing-xxs) truncate rounded-(--shape-flat) text-label-code-sm text-(--text-muted) transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
      >
        <span class="truncate">{{ name }}</span>
        <i
          class="pi pi-external-link shrink-0 text-[0.7em] opacity-0 transition-opacity duration-fast-02 group-hover:opacity-100 motion-reduce:transition-none"
          aria-hidden="true"
        />
      </a>
      <span
        v-else
        class="min-w-0 truncate text-label-code-sm text-(--text-muted)"
        >{{ name }}</span
      >
      <span
        v-if="!documented"
        class="shrink-0 text-label-code-sm text-(--text-disabled)"
        title="No Storybook page yet"
        >—</span
      >
    </div>
  </div>
</template>

<style scoped>
  /* Highlight mechanics only — every color / spacing / shape value above is a theme
     token. */
  .cell {
    transition: border-color 150ms var(--ease-out, ease-out);
    outline: none;
  }

  .ring {
    transition: opacity 150ms var(--ease-out, ease-out);
  }

  /* Lift the node above its neighbours so the ring and any component overlay
     (dropdowns, popovers) render on top. No scale — the pointer stays over the cell. */
  .cell:hover,
  .cell:focus-within {
    z-index: 5;
  }

  .cell:hover .ring,
  .cell:focus-within .ring {
    opacity: 1;
  }

  @media (prefers-reduced-motion: reduce) {
    .cell,
    .ring {
      transition: none;
    }
  }
</style>

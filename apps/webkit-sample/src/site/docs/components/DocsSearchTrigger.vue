<script setup>
  // The docs' search affordance wherever the tree itself is: the top of the navigation
  // rail from `lg` up, and the top of the navigation sheet below it.
  //
  // It is a BUTTON, not a field: the palette owns the typing, and it already does what
  // an in-rail filter did (find a page by name), so the docs carry no second input.
  // h-10 / text-label-md, the large InputText's dimensions, because it reads as a
  // search bar. The ⌘K keycap is the control's signature — a Kbd, so the glyph is the
  // OS's own (⌘ on macOS, Ctrl elsewhere).
  //
  // Viewports with no rail have no bar either: there the top bar carries a plain
  // search IconButton, since a phone has neither a ⌘K to hint at nor room for a label.
  import Kbd from '@aziontech/webkit/kbd'

  defineEmits(['click'])
</script>

<template>
  <button
    type="button"
    aria-keyshortcuts="Meta+K"
    class="flex h-10 w-full cursor-pointer items-center gap-(--spacing-xs) rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) text-left text-label-md text-(--text-muted) transition-colors duration-150 ease-out hover:border-(--border-strong) hover:text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
    @click="$emit('click', $event)"
  >
    <i
      class="pi pi-search shrink-0"
      aria-hidden="true"
    />
    <span class="min-w-0 flex-1 truncate">Search docs</span>
    <Kbd
      meta
      size="small"
      class="shrink-0"
      >K</Kbd
    >
  </button>
</template>

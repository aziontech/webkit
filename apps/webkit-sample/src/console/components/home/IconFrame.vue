<script setup>
  // IconFrame — the 32px bordered square that carries a first-use row's glyph.
  //
  // One definition, because several surfaces have to agree on it: Home's per-resource
  // empty card (../Home.vue), a module's own first use (./ProductFirstUse.vue) and the
  // logo cluster on its promo cards (./FirstUsePromo.vue) all render the same frame —
  // 32px, hairline, raised fill, an 18px mark inside — and a frame re-specified in each
  // drifts on the first change to any of them. It is the whole reason the product block
  // was moved onto this shape: a reader who met the empty state on Overview should not
  // meet a second design one screen in.
  //
  // Deliberately NOT the DS's Avatar or the EmptyState's own featured tile: the first
  // carries a person, and the second draws two offset ghost layers behind itself that
  // only read at the centre of a block. This is the row-sized frame.
  //
  // ── ICON *OR* SLOT ──
  //
  // Most marks are a font glyph, so `icon` is the short path. A mark that is a real SVG
  // component instead — an editor's logo, drawn by ../site/ui/AgentMark.vue — goes in the
  // default slot. Same frame either way, which is the point: the alternative was a
  // second 32px square defined next to the cluster that used it.
  defineProps({
    /** PrimeIcons or Azion icon class (`pi pi-github`, `ai ai-edge-functions`). */
    icon: { type: String, default: '' }
  })
</script>

<template>
  <!-- `overflow-hidden` because the Azion marks are drawn on their own box and an
       `ai-cor` glyph can otherwise paint past the hairline at this size. -->
  <span
    class="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface-raised)"
  >
    <slot>
      <i
        :class="icon"
        class="text-[18px] leading-none text-(--text-default)"
        aria-hidden="true"
      />
    </slot>
  </span>
</template>

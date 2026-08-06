<script setup>
  // Banner backdrop: the dense neutral ASCII mesh field — drifting nodes joined by
  // proximity edges, with packets pulsing along them.
  //
  // The parameters below come from `azion-ascii-banner.html` (scene `mesh`, cell
  // 7, speed 0.55, no glow, 50 nodes, 7 arcs, and that file's character ramp),
  // driven through the repo's own AsciiBanner engine rather than a second copy of
  // it. AsciiBanner draws on a transparent canvas (the standalone file painted
  // its own `bg`), so the band's own `--bg-canvas` shows through and the banner
  // works in either theme.
  //
  // `accent` is a canvas fill, not CSS — it cannot take a `var(--…)` token, so it
  // is a literal here as AsciiBanner's own default is. It departs from the
  // standalone file's `#4f4f4f`: nodes and packets are the field's highlights,
  // but that grey is *darker* than the base glyph colour the engine draws the
  // mesh edges in, so on a dark canvas the highlights read as holes. This one
  // sits just above the base grey, so they read as lit.
  //
  // Registered in ./index.js under the key `mesh`.
  import AsciiBanner from '../../AsciiBanner.vue'
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <AsciiBanner
      scene="mesh"
      accent="#9aa7b8"
      ramp=" .·:+*o#@"
      :cell="7"
      :speed="0.55"
      :glow="0"
      :nodes="50"
      :arcs="7"
      class="absolute inset-0 opacity-90 mask-[radial-gradient(ellipse_at_center,black,transparent_88%)]"
    />
    <!-- Scrims: a left-to-right wash puts the left-aligned copy on solid canvas,
         then a bottom fade hands the band off to the module below it. Both keep
         the transition SHORT — an opaque plateau that covers the copy column
         (PageHeader's hero description is `max-w-2xl`), then a tight ramp to
         nothing. A long ramp (or Tailwind's two-stop `via-`, which sits at 50%)
         veils the whole band evenly and reads as a slab over the field rather
         than a fade, so the mesh never gets a stretch of clean canvas. -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,var(--bg-canvas)_0%,var(--bg-canvas)_44%,color-mix(in_srgb,var(--bg-canvas)_26%,transparent)_62%,transparent_72%)]"
    />
    <div
      class="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,transparent_66%,color-mix(in_srgb,var(--bg-canvas)_30%,transparent)_84%,var(--bg-canvas)_100%)]"
    />
  </div>
</template>

<script setup>
  // FunctionsHeroCanvas — the art half of the Functions hero (Figma node 1684:7264).
  //
  // The runtime's Web APIs, as a field of Content Pills filling the hero's second column.
  // That field is the whole art half: the design's globe canvas — a pixelated sphere with a
  // line of the sample's code across it and the Azion mark at its centre — is not rendered.
  // The mark is already in the nav, the code is already in the CodeBlock section below, and
  // the sphere said "global" where the pills say what you can actually call. One claim per
  // half of the band reads better than three stacked in one.
  //
  // POLISH IS A GRADIENT, NOT A FRAME
  //
  // The field has no edges of its own: a wash of the brand behind it and a linear fade over
  // it, so it resolves into the canvas on all four sides instead of ending at a box. The
  // wash is what keeps the pills from floating on flat black; the fade is what makes the
  // field read as an excerpt of a much larger surface — which is the claim, since this is a
  // sample of the runtime and not the whole of it.
  import RuntimeApiCloud from './RuntimeApiCloud.vue'
</script>

<template>
  <!-- From `lg` the box is whatever the caller gives it — the full height of the hero band,
       half the viewport wide — and the field centres in it. Below `lg` it stacks under the copy
       at the column's width, where the same list is more than twice as tall (~2 pills a row
       against ~5), so it takes a cap of its own: uncapped, it would push the headline off its
       own screen. -->
  <div
    class="relative flex h-[min(52vh,26rem)] min-w-0 items-center justify-center overflow-hidden lg:h-full"
  >
    <!-- ONE masked layer holds both the wash and the field, which is the whole trick: a wash
         painted outside the mask is a rectangle with four hard edges — the exact frame this
         half is not supposed to have — while inside it, it dissolves on the same curve as the
         pills it lights.

         The fade is two linear gradients composited with `mask-composite: intersect` (two mask
         images on one element otherwise replace each other rather than stacking). Vertical is
         the one that matters: the field runs off the top and bottom of the band, which is what
         says the list continues past it. -->
    <div
      class="relative w-full [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,transparent_0%,black_22%,black_78%,transparent_100%),linear-gradient(to_right,transparent_0%,black_14%,black_90%,transparent_100%)]"
    >
      <!-- The wash: the brand, at the alpha of a lit ground rather than a surface. Two stops
           on one diagonal — nothing radial, so it reads as light falling across the field
           instead of as a glow behind a shape.

           The fade above runs long on both axes — roughly a fifth of the height at each end,
           an eighth of the width — because the field now OVERFILLS the band: there is no edge
           of the list to see, so the gradient is the only thing that decides where it ends.
           Long ramps are what make that read as light falling off rather than as a crop, and
           they are what let the outermost rows sit at full density without colliding with the
           nav above or the trust strip below. -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,color-mix(in_srgb,var(--primary)_9%,transparent)_0%,color-mix(in_srgb,var(--primary)_3%,transparent)_48%,transparent_80%)]"
      />

      <div class="relative z-10">
        <RuntimeApiCloud />
      </div>
    </div>
  </div>
</template>

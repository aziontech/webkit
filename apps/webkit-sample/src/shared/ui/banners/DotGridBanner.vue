<script setup>
  // Banner backdrop: the dot grid — a 2px square every 48px, in both directions,
  // flat across the whole band.
  //
  // Measured off azion.com's own hero, not approximated from a screenshot: the
  // source band (site-translate/financial-services/band-00.png, 1440x631) puts a
  // solid #404040 square on #0A0A0A at every intersection of a 48px lattice,
  // straddling the lattice line (the square spans pixels 47-48, 95-96, 143-144,
  // …). Every run in that band is exactly 2px long and every texture pixel is
  // exactly #404040 — no anti-aliasing, no fade, no vignette. This component
  // reproduces that render pixel for pixel.
  //
  // WHY A CONIC GRADIENT, AND NOT A RADIAL ONE
  //
  // The obvious spelling of a dot field is `radial-gradient(C 1px, transparent
  // 1px)` on a 48px tile, and it is wrong twice: the circle's edge is
  // anti-aliased, so a 2px dot loses roughly a quarter of its ink to partial
  // coverage and reads lighter and softer than the source's square.
  //
  // A conic gradient's angular stops are hard edges, and centring one at (2px,
  // 2px) of the tile puts the 270deg-360deg wedge — the quadrant up and left of
  // that centre — over exactly the rectangle x<2, y<2. Both of its edges are
  // axis-aligned, so they land on pixel boundaries and the square comes out
  // crisp. One declaration, no mask, no asset. (PixelateBanner has to invert the
  // problem — shape as a mask, colour underneath — because its colour is a
  // moving glow; here the colour is one flat ink, so the gradient can just BE
  // the dot.)
  //
  // WHY THE INK IS A MIX OF --text-default
  //
  // What the eye reads in this texture is the STEP from the ground, not the
  // colour: the source's step is 54/255 (#404040 over #0A0A0A). Mixing the page's
  // own ink at 22% and letting the canvas show through reproduces that step in
  // both themes from one value —
  //
  //   dark   0.22 x 250 (#FAFAFA) over #000000 -> #373737, step 55
  //   light  0.22 x  20 (#141414) over #FAFAFA -> #C7C7C7, step 51
  //
  // — so the field is equally quiet on either ground instead of being tuned for
  // the dark one and shouting on the light one. A fixed token cannot do this:
  // --border-default is too faint on black (#2B2B2B, step 43) and --text-disabled
  // too loud on white (#999999, step 97).
  //
  // NO MASK, ON PURPOSE. The registry's recipe for a pasted backdrop calls for a
  // radial fade so the texture never competes with the copy; this one is flat
  // because the source is flat, and because at ~0.17% coverage it has nothing to
  // compete with. Overriding --dot-grid-ink is the way to quiet it further on a
  // band that needs it.
  //
  // Registered in ./index.js under the key `dot-grid`.
</script>

<template>
  <div
    aria-hidden="true"
    class="field pointer-events-none absolute inset-0 z-0 overflow-hidden"
  />
</template>

<style scoped>
  .field {
    /* The lattice is offset by half a dot so each square STRADDLES the
       intersection rather than hanging off it — the source's own phase, and the
       reason its top-left corner shows a quarter dot. */
    background-image: conic-gradient(
      at var(--dot-grid-size, 2px) var(--dot-grid-size, 2px),
      transparent 0 75%,
      var(--dot-grid-ink, color-mix(in srgb, var(--text-default) 22%, transparent)) 75% 100%
    );
    background-position: calc(var(--dot-grid-size, 2px) / -2) calc(var(--dot-grid-size, 2px) / -2);
    background-size: var(--dot-grid-pitch, 48px) var(--dot-grid-pitch, 48px);
  }
</style>

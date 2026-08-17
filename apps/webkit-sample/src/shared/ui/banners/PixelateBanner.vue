<script setup>
  // Banner backdrop: the pixelate field — a uniform grid of 5px squares on a
  // 15px pitch, lit from underneath by two soft pools of the brand accent, with
  // a slow wave travelling through it.
  //
  // Ported from Figma (Azion.com 12931:97258 "Pixelate"), which is a black frame
  // holding two heavily blurred #F3652B discs, pixel-quantised to a grid. The
  // measured facts off that frame: 15px pitch, 5px square, peak dot ~0.7 alpha
  // of the accent.
  //
  // WHY THE GRID IS A MASK, NOT ARTWORK
  //
  // MapBanner inlines ~5100 <path> squares because a coastline is an irregular
  // shape: every square is a distinct fact, and the two source colours have to
  // become two token-driven layers. This grid is uniform — its ~4200 squares are
  // one fact repeated — and its colour is not a property of the squares at all,
  // it is the glow underneath showing through them. So the roles split:
  //
  //   ./Pixelate.svg  — ONE 15px cell, tiled as a CSS mask. The shape.
  //   .field          — the gradients the mask reveals. The colour.
  //
  // That inversion is what makes the whole thing animatable. Baked into the
  // artwork, a moving wave would mean re-tinting 4200 paths every frame; as a
  // mask, the squares never change and the light behind them moves instead —
  // two composited transforms, whatever the field's size.
  //
  // WHY TWO WAVES
  //
  // One travelling band is a sweep, not a wave: it reads as a scanline crossing
  // the panel on a loop you can time. Two bands of different wavelength, tilted
  // opposite ways and travelling in opposite directions, cross each other; the
  // crossings are where the alphas compound and the field brightens. 13s and
  // 19s are both prime, so the pair only returns to the same relative phase
  // every 247s — long enough that the grid reads as something with weather in
  // it rather than something on a timer.
  //
  // Registered in ./index.js under the key `pixelate`.
  import tile from './Pixelate.svg'

  // Quoted deliberately — see the note on the element that consumes it.
  const maskImage = `url("${tile}")`
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <!-- The mask tile is bound rather than written into the stylesheet because
         the asset URL is Vite's to decide; `--pixelate-tile` is the one value
         that cannot be authored as a static token.

         The url() is QUOTED. Under the inline-asset limit Vite hands back a
         `data:image/svg+xml,…` URI rather than a path, and that URI carries the
         SVG's own punctuation — an unescaped `)` closes an unquoted url() early,
         the declaration ends up with unbalanced brackets, and the custom
         property is dropped without a word: no mask, and the field renders as a
         plain gradient wash. -->
    <div
      class="field"
      :style="{ '--pixelate-tile': maskImage }"
    >
      <div class="wave wave-a" />
      <div class="wave wave-b" />
    </div>
  </div>
</template>

<style scoped>
  .field {
    position: absolute;
    inset: 0;
    overflow: hidden;

    /* The grid. `alpha` is stated explicitly: the tile is black, so a viewer
       that resolved `match-source` to luminance would hide every square. */
    mask-image: var(--pixelate-tile);
    mask-size: var(--pixelate-pitch, 15px) var(--pixelate-pitch, 15px);
    mask-repeat: repeat;
    mask-mode: alpha;
    -webkit-mask-image: var(--pixelate-tile);
    -webkit-mask-size: var(--pixelate-pitch, 15px) var(--pixelate-pitch, 15px);
    -webkit-mask-repeat: repeat;

    /* The two pools. The Figma frame is a landscape band and puts one against
       each short edge, which leaves a dark trough down the middle; measured off
       that render, a dot peaks at rgb(170,68,34) — 0.70 alpha of the accent on
       black — and bottoms out around 0.28 of that in the trough. Both numbers
       are what the stops below are set to reproduce.

       The pools are stacked against ONE edge here rather than facing each other
       across the frame, because the banner's first use is portrait: on a tall
       panel the two short edges are the top and the bottom, which is exactly
       where a heading and a chip row go. Sharing an edge turns the trough into
       a full-height column instead — the bed the copy sits in, the same trade
       MapBanner makes when it parks the map beside the copy rather than behind
       it. --pixelate-pool-x slides the pair to the other side — a left-lit
       panel is `--pixelate-pool-x: 14%`. Both pools read it, so they move
       together and the trough stays one column; splitting them back across a
       landscape band means overriding the two gradients outright, which no
       caller needs yet.

       Both pools are the accent, so the field is one hue in both themes; only
       the ground under it flips.

       The background-COLOUR is the floor — it is what keeps a dot present in
       the corners the pools never reach. Without it the grid stops at the edge
       of the glow and reads as a blob rather than a field. */
    background-color: color-mix(in srgb, var(--primary) 11%, transparent);
    background-image:
      radial-gradient(
        circle at var(--pixelate-pool-x, 86%) 94%,
        color-mix(in srgb, var(--primary) 74%, transparent) 0%,
        color-mix(in srgb, var(--primary) 44%, transparent) 24%,
        color-mix(in srgb, var(--primary) 18%, transparent) 52%,
        transparent 88%
      ),
      radial-gradient(
        circle at var(--pixelate-pool-x, 98%) 8%,
        color-mix(in srgb, var(--primary) 50%, transparent) 0%,
        color-mix(in srgb, var(--primary) 20%, transparent) 28%,
        transparent 62%
      );
  }

  /* Each wave is an infinite set of parallel slanted bands.
     `repeating-linear-gradient` repeats along the gradient AXIS, so the bands
     are continuous across the whole element — a rectangular tile
     (background-size + repeat) would instead butt tile against tile and draw a
     vertical seam every period wherever the bands are slanted.

     Normal blending, not `screen`: the waves have to brighten the field on a
     light ground as well as a dark one, and `screen` toward white is a no-op.
     Stacked translucent accent over translucent accent compounds alpha, which
     is the brightening we want, in either theme. */
  .wave {
    position: absolute;
    inset-block: 0;
    will-change: transform;
  }

  /* A loop is seamless only if the shift equals the pattern's period measured
     along X. The bands repeat every --band along the gradient axis, and the
     axis is tilted, so that period stretches by 1 / sin(angle). Both angles are
     10° off horizontal, so both share the same factor: sin(100°) = sin(80°) =
     0.98481. Each element overhangs by exactly one shift on the side it
     travels toward, so the field is never uncovered mid-cycle. */
  .wave-a {
    --band: 380px;
    --shift: 385.86px; /* 380 / 0.98481 */
    left: 0;
    right: calc(-1 * var(--shift));
    background-image: repeating-linear-gradient(
      100deg,
      transparent 0,
      color-mix(in srgb, var(--primary) 18%, transparent) calc(var(--band) * 0.28),
      color-mix(in srgb, var(--primary) 50%, transparent) calc(var(--band) * 0.5),
      color-mix(in srgb, var(--primary) 18%, transparent) calc(var(--band) * 0.72),
      transparent var(--band)
    );
    animation: pixelate-wave-a 13s linear infinite;
  }

  .wave-b {
    --band: 260px;
    --shift: 264.01px; /* 260 / 0.98481 */
    left: calc(-1 * var(--shift));
    right: 0;
    background-image: repeating-linear-gradient(
      80deg,
      transparent 0,
      color-mix(in srgb, var(--primary) 14%, transparent) calc(var(--band) * 0.3),
      color-mix(in srgb, var(--primary) 38%, transparent) calc(var(--band) * 0.5),
      color-mix(in srgb, var(--primary) 14%, transparent) calc(var(--band) * 0.7),
      transparent var(--band)
    );
    animation: pixelate-wave-b 19s linear infinite;
  }

  @keyframes pixelate-wave-a {
    to {
      transform: translate3d(calc(-1 * var(--shift)), 0, 0);
    }
  }

  @keyframes pixelate-wave-b {
    to {
      transform: translate3d(var(--shift), 0, 0);
    }
  }

  /* Reduced motion keeps the crests — they are part of the picture, not just
     the animation — and only stops them travelling. */
  @media (prefers-reduced-motion: reduce) {
    .wave {
      animation: none;
    }
  }
</style>

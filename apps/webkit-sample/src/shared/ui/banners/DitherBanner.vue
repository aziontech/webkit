<script setup>
  // Banner backdrop: the dither ramp — a lattice of small squares whose DENSITY
  // fades along one axis, sparse at the start and near-solid at the end.
  //
  // Ported from the brand deck's cover frame ("Slide Deck Cover"), where the ramp
  // fills a tall panel beside the title. The measured facts off that render: a
  // 24px square lattice, a 6px square, one flat ink for every dot, and a density
  // that climbs from a handful of dots at the top to a nearly complete lattice at
  // the bottom. The pitch is `--spacing-lg` and the square is the deck frame's
  // own registration mark, which is why the texture sits on the same measure as
  // the layout it backs — the reference's panel is 23 columns wide because it is
  // 560px of a 24px grid, not because 23 was chosen. The dots are PRESENT or ABSENT — none of them is
  // dimmed — which is what makes the gradient read as a texture rather than as
  // a fade, and it is the one fact the implementation has to preserve.
  //
  // WHY THIS IS A DITHER, AND NOT A MASKED GRADIENT
  //
  // The obvious spelling is PixelateBanner's: tile the lattice as a mask and put
  // a gradient underneath. That produces the wrong picture — every dot is
  // present and the ramp shows as dots getting darker toward the top, which at
  // low intensity reads as a dirty smudge instead of a thinning field. A density
  // ramp needs dots to LEAVE, and a single gradient cannot remove a dot; it can
  // only dim one.
  //
  // Removing dots per position is exactly what an ordered dither does, so this
  // component is one: the 4x4 Bayer matrix below splits the lattice into 16
  // interleaved sub-lattices and assigns each a rank, and a sub-lattice is drawn
  // only past the point where the target density exceeds its rank. Dispersed
  // ranks are what keep the sparse end looking scattered — a row-by-row or
  // block-by-block order would show as stripes or as a checkerboard the moment
  // the density passed 50%.
  //
  // WHY ONE ELEMENT PER RANK
  //
  // A rank's threshold is a per-sub-lattice cut, and CSS has no way to pair the
  // Nth background layer with the Nth mask layer — `mask-composite` combines
  // mask layers globally, not pairwise. So each rank is its own element: one
  // background layer (its sub-lattice) and one mask (its threshold). 16 static
  // layers, painted once, no asset, no script — and resolution-independent, so
  // the same texture serves a 400px card and a 1920px slide.
  //
  // 16 planes is also what fixes the matrix at 4x4. A larger matrix does not buy
  // finer dispersion for the same element count: Bayer's construction is
  // recursive (`M(2n) = 4 * M(n) + quadrant`), so grouping an 8x8's 64 ranks into
  // 16 buckets of four returns exactly the 4x4's sub-lattices — verified by
  // rendering both and diffing. Real 8x8 dispersion needs 64 thresholds, and 64
  // masked layers at slide size is not a texture, it is a compositing bill. The
  // trade is visible only at the sparse end, where the dots do sit on a legible
  // 4-pitch grid.
  //
  // The squares themselves are drawn the way DotGridBanner draws its dot: a
  // conic gradient's angular stops are hard edges, so a quadrant centred at
  // (size, size) lands on pixel boundaries and the square comes out crisp where
  // a radial gradient would lose a quarter of its ink to anti-aliasing.
  //
  // THE KNOBS (custom properties, since the registry renders every banner with
  // no props — set them with a class on the container):
  //
  //   --dither-pitch      lattice pitch                        24px
  //   --dither-size       square side                          6px
  //   --dither-ink        dot colour                           85% of --text-default
  //   --dither-from       density at the start of the ramp      0.06
  //   --dither-to         density at the end                    0.92
  //   --dither-direction  the ramp's axis, as a gradient side   to bottom
  //
  // `--dither-from` / `--dither-to` are real densities, not just stops: a rank
  // whose threshold falls outside the pair is drawn everywhere or nowhere, which
  // is how the ends stay honestly sparse and honestly incomplete. The ink is the
  // deck's, so it is loud on purpose; a hero that puts copy over the dense end
  // should quiet it (`class="[--dither-ink:color-mix(in_srgb,var(--text-default)_22%,transparent)]"`)
  // or turn the ramp around so the copy sits at the sparse end.
  //
  // Registered in ./index.js under the key `dither`.

  // The 4x4 Bayer matrix (dispersed-dot ordered dither). The value at (row, col)
  // is the rank of the sub-lattice whose dots sit at that offset in every 4x4
  // block of the lattice — so rank 0 is the first sub-lattice to appear and rank
  // 15 the last.
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5]
  ]

  const PLANES = BAYER.flatMap((row, y) => row.map((rank, x) => ({ rank, x, y })))
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <!-- One plane per rank. Only three numbers differ between them — the
         sub-lattice's offset in the 4x4 block and the rank itself — so the
         geometry and the threshold are computed once, in CSS, from these. -->
    <span
      v-for="plane in PLANES"
      :key="plane.rank"
      class="plane"
      :style="{ '--col': plane.x, '--row': plane.y, '--rank': plane.rank }"
    />
  </div>
</template>

<style scoped>
  .plane {
    position: absolute;
    inset: 0;

    /* THE SUB-LATTICE. The tile is 4 pitches square and carries one dot, so the
       16 planes together rebuild the full lattice.

       The dot sits ON its lattice point rather than straddling it (DotGridBanner's
       phase): the half-square shift that straddle needs lands an odd-sided square
       on half pixels, and the square then loses its edges to anti-aliasing —
       measured, a 5px dot came out as 6px of soft ink. Whole offsets keep every
       dot crisp at any pitch and size, which is what a knob has to survive. */
    background-image: conic-gradient(
      at var(--dither-size, 6px) var(--dither-size, 6px),
      transparent 0 75%,
      var(--dither-ink, color-mix(in srgb, var(--text-default) 85%, transparent)) 75% 100%
    );
    background-size: calc(4 * var(--dither-pitch, 24px)) calc(4 * var(--dither-pitch, 24px));
    background-position: calc(var(--col) * var(--dither-pitch, 24px))
      calc(var(--row) * var(--dither-pitch, 24px));

    /* THE THRESHOLD. `--at` is where along the ramp this plane's rank is reached:
       the density it represents, (rank + 0.5)/16, expressed as a position between
       `--dither-from` and `--dither-to`. Outside 0-100% the stop simply falls off
       the element, which is what draws a plane everywhere or nowhere.

       `--soft` fades the plane in over one density step instead of switching it
       on at a line. The steps then overlap exactly, so the 16 of them compose a
       continuous ramp — a hard cut would put a faint horizontal seam at each of
       the sixteen thresholds.

       mask-mode is stated: the ramp is black-to-transparent, and a viewer that
       resolved `match-source` to luminance would hide every plane. */
    --dither-span: calc(var(--dither-to, 0.92) - var(--dither-from, 0.06));
    --at: calc(((var(--rank) + 0.5) / 16 - var(--dither-from, 0.06)) / var(--dither-span) * 100%);
    --soft: calc(100% / 32 / var(--dither-span));

    mask-image: linear-gradient(
      var(--dither-direction, to bottom),
      transparent calc(var(--at) - var(--soft)),
      black calc(var(--at) + var(--soft))
    );
    mask-mode: alpha;
    -webkit-mask-image: linear-gradient(
      var(--dither-direction, to bottom),
      transparent calc(var(--at) - var(--soft)),
      black calc(var(--at) + var(--soft))
    );
  }
</style>

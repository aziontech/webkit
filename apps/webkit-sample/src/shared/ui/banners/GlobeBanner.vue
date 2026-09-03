<script setup>
  // THE GLOBE, AS A HERO BACKDROP — the deck's disc hung off the page's right rule.
  //
  // The sphere itself is GlobeDisc; this file is only the answer to two questions a banner has
  // to answer and a disc cannot: HOW BIG, and AGAINST WHAT.
  //
  // ── AGAINST WHAT: THE PAGE'S RIGHT RULE, WITH HALF THE DISC PAST IT ──
  //
  // The band is full-bleed, but the frame under it is not — every section, and the hero's own
  // box, cap at `--layout-measure-site` and open at `--layout-boundary-inline`. So the disc is
  // placed inside a box that mirrors that column exactly, and then pushed out by half its own
  // width: its CENTRE lands on the column's right rule. Half the sphere is in the page, half
  // is in the gutter and past the window, and the band's `overflow-hidden` takes the rest.
  //
  // It used to be TANGENT to that rule — the whole circle inside the column, touching it. Both
  // are registered to the same vertical; the difference is what the hero is. A complete circle
  // floating in a band is an illustration placed in it. A sphere the page cuts in half is the
  // band's own edge doing the cutting, so the artwork belongs to the page instead of sitting
  // on it — which is the whole of "polished" here. It is also what lets the disc be half again
  // as large: what governs its size is now the BAND, not the gap between the copy and the rule.
  //
  // GlobeDisc's rule is that a caller may not let a LINE cut the disc (a rule across a circle
  // hides nothing, so the arc just ends and the sphere stops reading). This is not that cut:
  // nothing is drawn over the disc, the visible half keeps a full 180deg of limb, and the one
  // edge that ends it is the window's — the same edge every full-bleed band on this site is
  // already cut by. The three sides that end INSIDE the page are ended by the fade below, not
  // by an edge.
  //
  // Vertically it is CENTRED IN THE BAND, not in the copy. The hero is one viewport tall and
  // its copy sits in the middle of it, so a disc centred on the band's own axis shares that
  // axis without being measured off the headline — which means the headline can grow or shrink
  // by a line and nothing has to be re-derived.
  //
  // ── HOW BIG: A QUARTER MORE THAN THE BAND, AND TWO BOUNDS THAT BIND ELSEWHERE ──
  //
  // Now that the window is allowed to end it, the disc is sized off the BAND — `100dvh` less
  // `--banner-offset`, the token the container already reads for exactly this — and then
  // OVERSIZED by a quarter. The multiplier is what buys the half its presence: the visible
  // half is one radius wide whatever the diameter, so a disc that merely fitted the band shows
  // a 422px sliver at 1440x900, and 1.25 makes it 527. It is affordable because the top and
  // bottom no longer have to fit: the fade below reaches zero before either rule.
  //
  // THE OVERSIZE AND THE FADE'S PLATEAU ARE ONE NUMBER, not two. At 1.25 the overhang past
  // each rule is `(1.25B - B) / 2 = 0.125B`, which is 10% OF THE DISC — a constant, whatever
  // the band's height is — so a mask that is fully transparent through its first 11% is
  // transparent everywhere the band clips, on every window, by construction. Change the 1.25
  // and the 11% has to move with it, or the sphere starts getting a hard edge at the rules.
  //
  // The other two bounds are still a `min()` rather than a `clamp()` — the bound that binds is
  // the one that would otherwise have done the cutting:
  //
  //   150vw    the window's width, which only binds on a phone: at 390x844 the band is 788
  //            tall and 1.25 of it is 985, a 492px half on a 390px screen. 150vw takes the
  //            disc to 585, so the half is three quarters of the width and the copy keeps a
  //            side. It is the one bound that makes the disc SMALLER than the band, which is
  //            fine — the plateau then trims the sphere's own top and bottom instead of the
  //            overhang, and reads as a vignette.
  //   1192px   `--container-5xl`, the ceiling. Binds past a ~1010px-tall band (1920x1080 sits
  //            just past it), and it is there because at some size the artwork stops reading
  //            as a sphere and starts reading as a world map that happens to be round: the
  //            map's squares are drawn at a fixed fraction of the disc, so a bigger disc is a
  //            bigger dot grid, not more detail.
  //
  // No floor. A floor is what puts a 472px half-disc on a 390px screen, and the honest answer
  // on a phone is a smaller globe. `shrink-0` because the disc is a flex item in the mirrored
  // column: without it the phone's 585 is shrunk to the container's 390 and the half quietly
  // becomes a whole disc again — which is what happened on the first render.
  //
  // ── THE FADE: THREE SIDES, ONE MASK, AND NOTHING DIMMED ──
  //
  // A half-disc has one edge that belongs to the page (the window's) and three that do not —
  // a limb ending in mid-band on the left, and top and bottom limbs kissing the band's rules.
  // Those three are masked out rather than drawn: two `linear-gradient`s composited with
  // `mask-composite: intersect`, the same pair FunctionsHeroCanvas uses, one fading in from
  // the west and one holding the middle four fifths of the height. So the sphere emerges from
  // the right edge and dissolves into the canvas everywhere else, and there is no arc-end for
  // the eye to catch.
  //
  // A MASK, NOT AN OPACITY. The disc is already the quietest layer on the page (its landmass
  // is ~39/255 on canvas) and it is drawn over the site's dot lattice; a second global
  // softening multiplies down to a map you cannot read with orange flecks on nothing — the
  // exact wrapper MapBanner had and removed. A mask spends nothing where it is opaque, so the
  // solid crescent keeps the artwork's own weight and only the three loose edges are given up.
  //
  // ── BELOW `lg` THE COPY CROSSES THE DISC, AND NOTHING IS DIMMED FOR IT ──
  //
  // At 390 the visible half is ~292px against a headline ~200px wide, so they still share the
  // band — but the western fade now runs under exactly the column the copy sits in, which is
  // the softening that used to be asked of an opacity wrapper and is here for free. The
  // headline is white at the top of the type ladder over a masked ~39/255 landmass; it holds
  // the foreground on its own.
  //
  // ── IT KEEPS THE SITE'S HERO TEXTURE UNDER IT ──
  //
  // Every Site hero carries `dot-grid` — azion.com's own hero lattice, and the thing that
  // makes the site's pages read as one site (CONTAINERS.md § the hero rule). A banner is
  // named, not composed, on the container, and `#background` would replace the prop rather
  // than stack with it — so this banner draws the lattice itself and puts the disc on top of
  // it. The reader gets the site's texture AND this page's subject, and the page still names
  // exactly one backdrop.
  import DotGridBanner from './DotGridBanner.vue'
  import GlobeDisc from './GlobeDisc.vue'
</script>

<template>
  <div
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <DotGridBanner />

    <!-- The column the frames on this page draw, mirrored: the same cap and no inset, so the
         disc is placed against the section rules' own vertical rather than 24px inside it.
         `justify-end` puts its right edge on that rule and `translate-x-1/2` pushes it out by
         a radius, which lands its CENTRE there. Measured at 1440: the column runs 27 to 1413,
         the disc is 844 across, and the half that shows runs 991 to the window's 1440. -->
    <div
      class="absolute inset-0 mx-auto flex w-full max-w-(--layout-measure-site) items-center justify-end"
    >
      <div
        class="relative aspect-square shrink-0 w-[min(calc((100dvh-var(--banner-offset,0px))*1.25),150vw,var(--container-5xl))] translate-x-1/2 [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent_0%,black_20%),linear-gradient(to_bottom,transparent_11%,black_26%,black_74%,transparent_89%)]"
      >
        <GlobeDisc />
      </div>
    </div>
  </div>
</template>

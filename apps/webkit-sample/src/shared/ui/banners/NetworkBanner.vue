<script setup>
  // THE NETWORK — the map as the hero's ground, edge to edge, with live requests on it.
  //
  // Two things already existed and neither is re-implemented here: MapBanner draws the
  // artwork, and MapMesh draws traffic across a field of nodes. This is the composition of the
  // two on one band, which is exactly how the deck's backdrop slide is built — and it is a
  // separate component rather than a flag on MapBanner for the reason that slide records: the
  // artwork and the traffic are different claims, and most of the surfaces that draw this map
  // want it with no network on it at all.
  //
  // ── FULL BLEED, WITH NO WRAPPER TO MAKE IT SO ──
  //
  // `bleed` puts MapBanner's hero inset at 0, so the artwork is the whole band. There is no
  // column box in this file, and that is the difference from GlobeBanner beside it: that one
  // mirrors the page's measure so its disc can be registered to the section rules, because a
  // circle placed on a rule is a stated relationship. A ground has no such relationship to
  // state — it IS the ground — so a wrapper here would only be a narrower band with canvas
  // either side of it, which is the one thing a full-bleed backdrop must not be.
  //
  // ── WHAT MapBanner's OWN FADE ALREADY DOES ──
  //
  // Its hero carries two washes, and they are children of its wrapper rather than of the
  // artwork's box, so they work unchanged over a bleeding map: a left-to-right wash (canvas at
  // 0%, gone by 50%) for the copy to stand on, and a bottom ramp into the canvas that ends the
  // band. Its map layer also carries an edge mask — a radial vignette plus a left ramp. None of
  // that is re-stated here. Two things it cannot do are, below.
  //
  // ── ONE: THE TOP EDGE, WHICH NOTHING WAS ENDING ──
  //
  // The washes end the band on the left and at the bottom and the vignette takes the corners;
  // the TOP CENTRE is empty canvas on an inset map and, on a bleeding one, the densest part of
  // the artwork arriving flush against the sticky nav's hairline. So one ramp is added, on the
  // artwork+traffic wrapper rather than on either child, because it has to take the map, the
  // rays AND the washes together — masking only the artwork would leave a wash over nothing.
  //
  // ── TWO: THE ACCENTS OVER THE COPY, WHICH ITS WASH CANNOT REACH ──
  //
  // MapBanner paints its accent PoP field OVER its own washes, on purpose: the landmass is
  // texture and belongs under them, the nodes are the subject and belong over them. On an inset
  // hero that is right — the field is in the art half, away from the copy. On a bleeding one the
  // field runs the full width, so saturated squares land in the columns the headline stands in
  // and the banner's own wash has no way to touch them. Rendered that way, the headline sits in
  // a field of orange flecks (first pass; it is the loudest thing on the band).
  //
  // So this file paints ONE more scrim, LAST — over the artwork and over the traffic — aimed at
  // the copy column: canvas at the left edge, 72% of it by 22%, 28% by 40%, gone by 56%.
  // Everything west of the halfway line is banked down uniformly, accents included, which is
  // what leaves the field lit where the map is the subject and dark where the copy is.
  //
  // DEMOTING THE FIELD (`:nodes="false"`, which renders the 78 cells in the landmass's own ink)
  // is the other way to get there, and it was built and rejected: it costs the thing the band
  // is FOR. The PoPs stop being lit, the only orange left is a packet in flight, and a network
  // with no lights on it is a texture. The scrim keeps both — a lit field, and a copy column
  // you can read across.
  //
  // ── THE MESH BORROWS THE MAP LAYER'S EDGE MASK ──
  //
  // The mesh is a SIBLING of the map layer, not a child, so it does not inherit that layer's
  // vignette and left ramp — a ray would run at full strength into a corner where the coastline
  // under it had already dissolved. It is therefore given the same mask, spelled the same way,
  // deliberately: the two are registered to each other by nothing but a shared crop and a
  // shared edge, and if one ever changes how it ends the other has to change with it. Same
  // discipline MapBanner states for its own route layer ("the route shares the landmass's mask,
  // and must keep sharing it").
  //
  // ── THE BOX IS MEASURED, BECAUSE THE PROJECTION CANNOT BE GUESSED ──
  //
  // MapMesh takes its box in PIXELS: it projects each node through the crop and then draws in a
  // viewBox of that size. Handing it the crop's own dimensions instead would work only while
  // the band happened to share the crop's 1.70 ratio — at 1920x1024 the band is 1.87, the map
  // fits by height and anchors `xMax`, and a mesh fitted `xMid` into the same box would sit
  // ~89px west of the coastline it is supposed to be drawn on. So the band is measured and the
  // real box goes in, which makes `projectOnMap` and the map's own `preserveAspectRatio` arrive
  // at the same pixel by construction.
  //
  // ── WHICH NODES TAKE PART IS THIS BANNER'S DECISION ──
  //
  // MapMesh can see its box and its crop; neither tells it that a third of the PoP field is
  // south of this crop (the hero window is the transatlantic corridor, and the artwork's
  // Brazilian nodes sit below it) or that the first fifth of the band is under an opaque scrim.
  // Both would spend participants on rays that arrive from off-screen or from behind the copy.
  // The pool is therefore filtered to what is actually visible — inside the box, and east of the
  // scrim's own second stop — exactly as the backdrop slide filters its own.
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import { HERO_FRAMING, MAP_NODES, projectOnMap } from './map-framing.js'
  import MapBanner from './MapBanner.vue'
  import MapMesh from './MapMesh.vue'

  /**
   * Where the copy scrim below still holds most of the canvas. A node west of this is painted
   * over; a ray leaving it is a line out of a fog bank. Read off that gradient's own second
   * stop, so the filter and the paint move together.
   */
  const SCRIM_OPAQUE = 0.22

  /** The mask the map layer ends with, borrowed verbatim — see the note above. */
  const EDGE_MASK =
    'mask-ellipse mask-radial-at-center mask-radial-from-62% mask-radial-to-104% mask-l-from-86% mask-l-to-[rgb(0_0_0_/_0.3)]'

  const host = ref(null)
  const box = ref({ width: 0, height: 0 })

  let observer = null

  onMounted(() => {
    observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      box.value = { width, height }
    })
    observer.observe(host.value)
  })

  onBeforeUnmount(() => observer?.disconnect())

  const pool = computed(() => {
    const { width, height } = box.value
    if (!width || !height) return []
    return MAP_NODES.filter((node) => {
      const point = projectOnMap({ framing: HERO_FRAMING, box: box.value, point: node })
      return (
        point.x >= width * SCRIM_OPAQUE && point.x <= width && point.y >= 0 && point.y <= height
      )
    })
  })
</script>

<template>
  <div
    ref="host"
    aria-hidden="true"
    class="pointer-events-none absolute inset-0 z-0 overflow-hidden"
  >
    <!-- The artwork and the traffic, under one top ramp. -->
    <div class="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_13%)]">
      <MapBanner bleed />

      <!-- The requests. Rendered only once the band has been measured: with no box there is no
           projection, and a mesh drawn into a 0x0 viewBox is a stack of rays on one pixel. -->
      <MapMesh
        v-if="pool.length"
        :box="box"
        :framing="HERO_FRAMING"
        :pool="pool"
        :class="EDGE_MASK"
      />
    </div>

    <!-- The copy's scrim, painted last so it reaches the accent field too. -->
    <div
      class="absolute inset-0 bg-[linear-gradient(to_right,var(--bg-canvas)_0%,color-mix(in_srgb,var(--bg-canvas)_72%,transparent)_22%,color-mix(in_srgb,var(--bg-canvas)_28%,transparent)_40%,transparent_56%)]"
    />
  </div>
</template>

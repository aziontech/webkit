<script setup>
  // THE BACKDROP SLIDE — one column of copy over a map that fills the whole frame.
  //
  // Every other content slide in this deck composes INSIDE the content box: the frame is a
  // window with an empty ground behind it. This one inverts that. The artwork is the ground,
  // it runs edge to edge, and the frame's rules CUT it — so the slide reads as a view onto the
  // network rather than as a picture placed on a slide. It is the shape for a claim that is
  // about the world the product sits in, not about the product's own parts.
  //
  // ── THE FOUR LAYERS, AND WHY THAT ORDER ──
  //
  //   1. THE MAP, full bleed, on its own `slide` framing.
  //   2. THE WASH, a left-to-right ramp from canvas to nothing.
  //   3. THE ROUTE, two markers and a dashed line, projected onto the artwork.
  //   4. THE COPY, on the wash, in the left half's six grid columns.
  //
  // The wash is what makes this composition legible rather than busy, and it is a LINEAR ramp
  // for the same reason MapBanner's own panel framing is: a radial vignette over a landscape
  // box draws a curve the reader can see, and a curve announces an edge exactly where the
  // artwork should simply be dissolving into canvas. A left-to-right ramp announces nothing —
  // it reads as the map arriving, which is the one thing happening here.
  //
  // THE FRAMING IS THE ARTWORK'S DECISION, NOT THIS SLIDE'S. What a full-bleed map needs — the
  // western hemisphere, no inset, no seam mask, no scrim of its own — is a
  // third framing on MapBanner (`kind="slide"`), stated next to the other two rather than
  // assembled here out of a positioned box and a `mask-image: none` override. A crop belongs to
  // the component that owns the artwork; a slide only says which one it wants, where its own
  // copy sits, and what it draws on top. The crop and its derivation are in map-framing.js —
  // the module exists because the route below is projected through the SAME numbers.
  //
  // WHAT THE WASH COSTS. MapBanner draws the accent nodes OVER its own scrims (the landmass is
  // texture, the route is the subject); this wash is a layer above the whole banner, so it
  // takes the nodes with it. On this crop it costs nothing that matters, and not by luck — the
  // crop's west edge is deliberately parked inside the wash, so what the wash covers is the
  // PACIFIC. Measured off the render, as a percentage of the frame's 1618 (the wash is opaque
  // to 44%, gone by 70%):
  //
  //   61%-77%   North America (22 nodes)  west edge in the ramp's tail, clear past 70%
  //   63%-86%   Latin America (31)        clear but for its first few degrees
  //   92%-104%  Europe (25)               clear, and cut by the right rule — the far coast
  //
  // Vertically the field runs 12%-82%: the whole of it is inside the frame. Nothing the ROUTE
  // touches — the eastern seaboard, Brazil, the Atlantic between them — is veiled at all.
  import { MAP_NODES, projectOnMap, SLIDE_FRAMING } from '@shared/ui/banners/map-framing.js'
  import MapBanner from '@shared/ui/banners/MapBanner.vue'
  import MapMesh from '@shared/ui/banners/MapMesh.vue'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { CLIENTS } from '@shared/ui/brand/clients/index.js'
  import { TOOLS } from '@shared/ui/brand/tools.js'
  import { computed } from 'vue'

  import { FRAME, FRAME_PADDING, span } from '../lib/deck-canvas.js'
  import MapRoute from './MapRoute.vue'
  import SlideHeading from './SlideHeading.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // THE COPY COLUMN, in canvas pixels — six of the content box's twelve columns (702), plus
  // the frame's own padding on both sides (96). So the text measure starts on column 1 and
  // ends on column 6, exactly where a bullet list on any other slide in the deck ends, and the
  // right padding is a 96px gutter before the map is allowed to be seen at all.
  const COPY_WIDTH = 2 * FRAME_PADDING + span(6) // 894

  const copyStyle = computed(() => ({ width: `${COPY_WIDTH}px` }))

  // The marks are named in the deck data and resolved here, from the two registries the
  // marketing site already reads: `CLIENTS` (companies that run on us) and `TOOLS` (the
  // frameworks, clouds and vendors a workload already uses). A name with no entry falls
  // through to ClientMark's typographic wordmark, which is the registry's own answer for a
  // company this repo holds no asset for — the row stays COMPLETE instead of quietly dropping
  // a name, and the missing file is visible on the slide rather than in a diff.
  const REGISTRY = [...CLIENTS, ...TOOLS]

  const marks = computed(() =>
    (props.slide.marks?.names ?? []).map(
      (name) => REGISTRY.find((entry) => entry.name === name) ?? { name }
    )
  )

  // ── THE ROUTE ─────────────────────────────────────────────────────────────────────────
  //
  // The request is not built here. It is `MapRoute`, the same component the vision slide draws
  // on its globe, given this slide's box and the same two places — because the two slides are
  // one argument in two halves (this one claims centralized security adds latency, that one
  // answers it) and a distance drawn twice is a distance that can disagree with itself.
  //
  // The box those pixels are in is the frame's PADDING box: the frame's own 1px rule sits
  // outside it, so it is 2px smaller than FRAME on each axis (1618x886, confirmed against the
  // render). MapRoute is sized to that box, so its svg's user units ARE those pixels.
  const BOX = { width: FRAME.width - 2, height: FRAME.height - 2 }

  // ── THE MESH ──────────────────────────────────────────────────────────────────────────
  //
  // `mesh` is the other drawing this layout can take, and the two are EXCLUSIVE in practice:
  // a route is ONE request between two named ends, a mesh is n:n between peers with no ends at
  // all, and a slide makes one of those two claims. The architecture slide takes the mesh; the
  // problem slide takes the route. It carried both for a while — the mesh as the network that
  // already exists, the route as what a centralized control does on top of it — and the cost
  // was the route: one labelled trip inside seventeen unlabelled ones is a trip you have to
  // hunt for, on the slide whose headline is that trip. The contrast now lands across the two
  // slides instead of inside one.
  //
  // WHICH NODES MAY TAKE PART IS THE SLIDE'S DECISION, not the mesh's, for the same reason it
  // is the vision slide's: MapMesh can see its box and its crop, and neither tells it that the
  // western 44% of this one is under an opaque wash. Handing it the whole field would spend
  // participants — and the rays they carry — on the Pacific, where the wash deletes them, and
  // the mesh would come back looking thin for no reason a reader could see. So the pool is the
  // nodes east of the wash's opaque edge, and what crosses into the ramp is a tail dissolving
  // into canvas, which is what the map itself does there.
  const WASH_OPAQUE = 0.44 * BOX.width // 712 — the first stop of the gradient above

  const meshPool = computed(() =>
    MAP_NODES.filter(
      (node) => projectOnMap({ framing: SLIDE_FRAMING, box: BOX, point: node }).x >= WASH_OPAQUE
    )
  )
</script>

<template>
  <div class="relative flex h-full items-center overflow-hidden">
    <!-- ── THE GROUND ───────────────────────────────────────────────────────────────────
         The site's own map — same dotted landmass, same pulsing PoP field the marketing
         hero carries — on the `slide` framing: the transatlantic crop with its inset at 0.

         Measured in this frame (1618x886 inside the rules): the crop is height-constrained,
         so the artwork fits the frame's height with ~55px of horizontal slack a side, cells
         land at 9.9px, and the accent field spans 5%-90% of the box. That last number is the
         one that matters — the whole visible width is network, rather than the node-less
         Africa and Asia a squarer crop parks on the right when it is fitted to a band. -->
    <MapBanner kind="slide" />

    <!-- ── THE MESH ─────────────────────────────────────────────────────────────────────
         Traffic between arbitrary pairs of the artwork's own PoPs, drawn BELOW the wash — the
         route above is an annotation on the map and belongs over it, but a mesh is the network
         itself running, so it dissolves into the copy column with the landmass it sits on. -->
    <MapMesh
      v-if="slide.mesh"
      :box="BOX"
      :framing="SLIDE_FRAMING"
      :pool="meshPool"
      class="z-0"
    />

    <!-- ── THE WASH ─────────────────────────────────────────────────────────────────────
         Opaque canvas through the copy column, then a 26% ramp to nothing. Four stops, the
         same front-loaded shape the marketing hero's scrim uses, shifted right to clear the
         copy: full to 44% (712px), 70% at 54%, 24% at 62%, gone by 70% (1133px). The accent
         field ends at ~75%, so Europe is clear of the ramp entirely. -->
    <div
      aria-hidden="true"
      class="absolute inset-0 z-0 bg-[linear-gradient(to_right,var(--bg-canvas)_0%,var(--bg-canvas)_44%,color-mix(in_srgb,var(--bg-canvas)_70%,transparent)_54%,color-mix(in_srgb,var(--bg-canvas)_24%,transparent)_62%,transparent_70%)]"
    />

    <!-- ── THE ROUTE ────────────────────────────────────────────────────────────────────
         The annotation, above the wash and below the copy: one wire between the user and the
         data centre, carrying a request each way. Same component, same gazetteer, same crop
         the map beneath is framed with. -->
    <MapRoute
      v-if="slide.route"
      :from="slide.route.from"
      :to="slide.route.to"
      :box="BOX"
      class="z-0"
    />

    <!-- ── THE COPY ─────────────────────────────────────────────────────────────────────
         The deck's usual header, the deck's usual hairline-divided claims, and one block
         holding the marks and the line that draws the conclusion. Centred in the frame as
         one group, the way the bullet slide centres its own. -->
    <div
      class="relative flex flex-col gap-(--spacing-xl) p-(--spacing-xxl)"
      :style="copyStyle"
    >
      <SlideHeading
        :eyebrow="slide.eyebrow"
        :headline="slide.headline"
        :description="slide.description"
      />

      <!-- Bullets are rules, not dots — the divider between two claims belongs to the LOWER
           one, so the first draws nothing. Same brick as the bullet slide. -->
      <ul
        v-if="slide.bullets"
        class="m-0 list-none p-0 max-w-(--container-md)"
      >
        <li
          v-for="bullet in slide.bullets"
          :key="bullet"
          class="border-t border-(--border-muted) py-(--spacing-md) text-pretty text-body-lg text-(--text-default) first:border-t-0 first:pt-0"
        >
          {{ bullet }}
        </li>
      </ul>

      <!-- ── THE FIGURES ──────────────────────────────────────────────────────────────
           Three across the copy column's six columns (218px each), in the same brick the
           metrics slide uses — the figure in the display face over its caption — so a number
           reads the same wherever the deck puts one. The rule above is the marks section's:
           a band under the claim, divided from it by the one line it owns. -->
      <section
        v-if="slide.metrics"
        class="grid grid-cols-3 gap-(--spacing-lg) border-t border-(--border-muted) pt-(--spacing-lg)"
      >
        <div
          v-for="metric in slide.metrics"
          :key="metric.label"
          class="flex flex-col gap-(--spacing-sm)"
        >
          <span class="text-big-number-lg text-(--primary)">{{ metric.value }}</span>
          <span class="text-pretty text-heading-sm text-(--text-default)">{{ metric.label }}</span>
        </div>
      </section>

      <section
        v-if="marks.length"
        class="flex flex-col gap-(--spacing-lg) border-t border-(--border-muted) pt-(--spacing-lg)"
      >
        <span
          v-if="slide.marks.label"
          class="text-overline-sm text-(--text-muted)"
          >{{ slide.marks.label }}</span
        >

        <!-- One ink for every mark. A row whose job is "this is the stack being described"
             reads as a list; per-brand colour there reads as noise, and the eye goes to the
             loudest mark instead of the set. `monochrome` flattens all of them to the same
             white silhouette, which is also what keeps a two-asset mark and a `currentColor`
             one from placing differently on the deck's pinned dark theme. -->
        <div class="flex flex-wrap items-center gap-x-(--spacing-xl) gap-y-(--spacing-md)">
          <ClientMark
            v-for="entry in marks"
            :key="entry.name"
            :client="entry"
            mark="h-8 w-auto max-w-36 object-contain"
            monochrome
          />
        </div>

        <p
          v-if="slide.note"
          class="m-0 text-pretty text-body-md text-(--text-muted)"
        >
          {{ slide.note }}
        </p>
      </section>
    </div>
  </div>
</template>

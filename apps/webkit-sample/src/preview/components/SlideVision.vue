<script setup>
  // THE VISION SLIDE — a claim, three pillars, and the network they run on as the ground.
  //
  // The shape is the deck's bleed shape, the one SlideCells uses: a padded header at the top,
  // and at the bottom a BAND that runs to the frame's own rules. `justify-between` distributes
  // them, and the map fills everything behind both.
  //
  // The slide BLEEDS (SlideRenderer's `BLEED` set), so the layout owns its own padding: the
  // COPY is inset by `--spacing-xxl` and the band is not inset at all. That split is the whole
  // point of a bleed layout — prose keeps the frame's margin, a plane does not — and it is what
  // lets the artwork be positioned against the frame's rules rather than against a box that
  // would have to be measured off twice.
  //
  // ── THE PILLARS ARE A BAND OF THE FRAME, IN THREE CELLS ──
  //
  // Each pillar is a design-system FrameBox, the three are butted edge to edge with no gutter,
  // and the run of them is flush to the frame's left, right and bottom rules. So the row is not
  // three cards sitting near each other, and it is not a 1428px frame floating inside the
  // frame either: it is a 1620px band OF the frame, with two internal rules.
  //
  // That is the page language's one-frame principle carried to its end — a shared edge belongs
  // to exactly one cell, and an edge shared with the FRAME belongs to the frame. So every cell
  // passes `flush="left bottom"` (its left rule is either the frame's or its neighbour's; its
  // bottom rule is the frame's) and the last cell adds `right`. Two hairlines are drawn in the
  // whole row, and they are the two dividers.
  //
  // NO CORNER TICKS ON THE CELLS. When the row floated inside the content column it was its own
  // frame and marked its own four corners; now the frame's four ticks ARE the band's bottom two,
  // and a tick at the row's top corners would put a third mark partway down a rule that already
  // has one at each end. The deck's other full-bleed band (SlideCells' cell grid) marks nothing
  // for the same reason.
  //
  // The rule colour is `--border-default`, the hairline the frame and every divider in this
  // deck is drawn in. The reference render outlined the cards in the brand orange, which
  // spends the deck's one colour on a container: three orange boxes read as three states
  // (selected? active? warning?) rather than as three peers, and they then compete with the
  // one thing on the slide that IS orange on purpose — the index.
  //
  // Inside, the cell takes the METRICS slide's anatomy exactly — figure, then label, then the
  // supporting line — because a pillar and a metric are the same shape: a number that leads,
  // and copy that explains what it counts. So the index is `text-big-number-lg` in the display
  // face and the brand orange (the deck's largest numeral, the same one the metrics figures
  // and the section dividers take), the title is `text-heading-sm` in the default ink, and the
  // points are muted body copy under it.
  //
  // AN INDEX SHARING THE TITLE'S BASELINE IS A LIST MARKER — it makes the title a numbered
  // item. On its own line, at the top of the ladder, it is the cell's headline and the title
  // is its caption, which is the reading a pillar wants. The three blocks are separated by
  // `--spacing-sm`, not the `--spacing-lg` a first pass used: at 56px the numeral already
  // carries its own air in the line box, and a 24px gap under it detaches it from the title
  // it labels.
  import FrameBox from '@aziontech/webkit/frame-box'
  import { SLIDE_FRAMING } from '@shared/ui/banners/map-framing.js'
  import MapBanner from '@shared/ui/banners/MapBanner.vue'
  import MapMesh from '@shared/ui/banners/MapMesh.vue'

  import { DESCRIPTION_MAX, FRAME } from '../lib/deck-canvas.js'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // ── THE GROUND ────────────────────────────────────────────────────────────────────────
  //
  // The artwork is the slide's FILL, not an object on it: the site's own map runs edge to edge
  // and the frame's rules end it, exactly as on the backdrop slide. This slide used to hang the
  // same artwork in a disc instead — a complete circle, turning, standing behind the band — and
  // the two are different claims. A disc is an OBJECT in the composition and has to be placed,
  // sized and kept clear of the copy; a ground is the world the slide is describing, and the
  // pillars then read as three statements made ON it rather than three boxes beside a picture.
  //
  // ── WHY THIS PUTS THE WEIGHT TOP-RIGHT, WITHOUT PLACING ANYTHING ──
  //
  // `SLIDE_FRAMING` crops the artwork's western hemisphere (790x880 units) and anchors it
  // `xMax` — the crop's east edge on the frame's right rule. In this 1618x886 box the fit is
  // height-constrained (880 units into 886px, scale 1.007, a 5.0px cell — the density the
  // marketing band renders this artwork at on a 1920 screen), so the artwork draws 795px wide
  // against the right rule and its own western edge lands at 822, 51% of the frame. Nothing
  // bleeds west of that, because crop x 0 IS the artwork's western edge.
  //
  // So the map occupies the frame's right half by construction, and the band takes its bottom
  // 280px. What is left visible is the upper-right quadrant — which is the emphasis, arrived at
  // by the crop's own anchor rather than by nudging a box. The two things that could have made
  // it explicit both cost more than they buy: a smaller box above the band drops the cell to
  // 3.4px, and a taller one anchored to the top pushes it to 6.6px, outside the 3.03-5.33px
  // band all of MapBanner's framings render in — at which point the artwork stops reading as a
  // network and starts reading as tiles.
  //
  // Measured in this frame: the PoP field spans x 988-1690 (61%-104% — the far coast of Europe
  // is cut by the right rule, as it is on the backdrop slide) and y 105-726.
  const BOX = { width: FRAME.width - 2, height: FRAME.height - 2 }

  /** The deck's index idiom — zero-padded, so `01` and `12` are the same width. */
  const cellIndex = (index) => String(index + 1).padStart(2, '0')

  // Which rules a cell does NOT draw, because something else already did. `left` is always
  // someone else's — the frame's for the first cell, the neighbour's for the rest — and `bottom`
  // is always the frame's. Only the last cell's `right` needs naming, and only because it is the
  // one cell whose right edge is the frame's rather than a divider.
  const cellFlush = (index) =>
    index === props.slide.pillars.length - 1 ? ['left', 'right', 'bottom'] : ['left', 'bottom']
</script>

<template>
  <div class="relative flex h-full flex-col justify-between overflow-hidden">
    <!-- ── THE MAP ──────────────────────────────────────────────────────────────────────
         MapBanner positions itself `absolute inset-0`, so it fills the frame's padding box and
         needs no box from this slide. `kind="slide"` is the full-bleed framing: no inset, no
         scrim and no seam mask, because the artwork is the ground and the frame's rules are
         what end it. -->
    <MapBanner kind="slide" />

    <!-- ── THE MESH ─────────────────────────────────────────────────────────────────────
         Traffic between arbitrary pairs of the artwork's own PoPs — the drawing this slide has
         always carried, now on the flat map instead of inside the disc. It takes the SAME
         framing and the same box as the artwork beneath it, which is the only thing that keeps
         a ray registered to its coastline.

         IT GETS THE WHOLE FIELD, unlike the backdrop slide, which hands its mesh only the nodes
         east of its wash. The difference is what does the hiding. A WASH dissolves: a ray that
         runs into one fades out in mid-air, which reads as a drawing that failed rather than as
         one that is behind something, so those nodes are worth withholding. The BAND is opaque:
         a ray running under it is cut clean at a rule, which is the same depth cue the band
         already gives the map itself. So the 8 of 78 nodes the band covers stay in the pool and
         their rays go under it.

         Nothing here meets the wash either way. Every node sits at x >= 988 and the wash is gone
         by 987, and a chord between two points east of a line cannot cross it. -->
    <MapMesh
      :box="BOX"
      :framing="SLIDE_FRAMING"
    />

    <!-- ── THE FADE ─────────────────────────────────────────────────────────────────────
         The left side dissolved into canvas, so the map arrives from the right instead of
         starting at a hard edge, and the copy column sits on pure canvas.

         Four stops, the same front-loaded ramp the backdrop slide and the marketing hero use,
         but aimed at THIS map's own anatomy rather than at a copy column: opaque to 50% (809),
         which is the last pixel before the artwork's western edge at 822; then 70% at 54%, 24%
         at 58%, and gone by 61% (987) — the westernmost PoP, to the pixel. So what the ramp
         dissolves is exactly the stretch of coastline that carries no network (Alaska and the
         Pacific seaboard), and the field itself is untouched. -->
    <div
      aria-hidden="true"
      class="absolute inset-0 bg-[linear-gradient(to_right,var(--bg-canvas)_0%,var(--bg-canvas)_50%,color-mix(in_srgb,var(--bg-canvas)_70%,transparent)_54%,color-mix(in_srgb,var(--bg-canvas)_24%,transparent)_58%,transparent_61%)]"
    />

    <!-- The copy sits ABOVE the ground in the stack. It also carries the frame's margin, which
         the band below it does not: in a bleed layout the inset belongs to the prose, not to
         the plane. -->
    <header class="relative flex flex-col gap-(--spacing-lg) px-(--spacing-xxl) pt-(--spacing-xxl)">
      <h2 class="m-0 text-balance text-heading-xl text-(--text-default)">{{ slide.headline }}</h2>
      <p
        v-if="slide.description"
        class="m-0 text-pretty text-heading-sm text-(--text-muted)"
        :style="{ maxWidth: `${DESCRIPTION_MAX}px` }"
      >
        {{ slide.description }}
      </p>
    </header>

    <section class="relative flex flex-col gap-(--spacing-lg)">
      <!-- The label over the band, at the overline step the whole system labels blocks with
           (14px on this canvas). It is copy, so it keeps the frame's margin and lines up with
           the headline above rather than with the band's first cell.

           Not the design system's Overline component: that one is a section EYEBROW — it sets
           its text in the brand orange and expects a `//` prefix — and here the orange belongs
           to the indices below. -->
      <span class="px-(--spacing-xxl) text-overline-md text-(--text-default)">
        {{ slide.label }}
      </span>

      <!-- Three equal thirds of the FRAME (1618 / 3 = 539) and NO gutter: the cells share their
           edges with each other and with the frame, which is what lets `flush` make every rule
           in the band a single hairline.

           EACH CELL FILLS ITSELF, and that fill is what makes the band a PLANE rather than three
           outlines: the map passes behind it, and an opaque surface is the only thing in this
           page language allowed to hide part of a drawing — it forbids the shadow every other
           system reaches for (see `.claude/docs/CONTAINERS.md`, "No shadow anywhere in this
           language"), so covering IS the depth cue.

           The step is chosen from both ends of the dark palette, not by preference —
           `--bg-surface` (#0A0A0A) is a 10/255 lift on this black canvas, too faint to read as a
           surface at all, and `--bg-surface-overlay` (#4D4D4D) outranks the `--border-default`
           hairline (#2B2B2B) the band is drawn in, which turns a framed cell into a filled chip.
           `--bg-surface-raised` (#141414) is the one step where the panel reads and the rule
           still leads.

           The site's own hairline grid cells take `--bg-surface` — correctly, because there the
           fill only has to BE a surface. Here it also has to hide something, which is the
           second job that picks the louder step. -->
      <div class="grid grid-cols-3">
        <FrameBox
          v-for="(pillar, index) in slide.pillars"
          :key="pillar.title"
          :flush="cellFlush(index)"
          marks="none"
          class="bg-(--bg-surface-raised)"
        >
          <!-- THE TWO PADDINGS ARE DIFFERENT TOKENS, and only one of them is free. The
               HORIZONTAL one sets the copy measure (a 539px cell less 96 is a 443px column for
               four bullets) and stays at `--spacing-xl`, the step the metrics slide's cells take
               — and, like those, it is deliberately NOT the `--spacing-xxl` the prose above
               keeps: a cell in a bleeding band is measured off its own edges, not off the
               frame's margin. The VERTICAL one is air, and this cell already has some: the 56px
               index draws in a 70px line box, so a `--spacing-xl` top pad puts 118px above a
               25px title. Stepping it to `--spacing-lg` takes ~48px off the band's height, which
               is ~48px more of the map left visible above it. -->
          <article class="flex flex-col gap-(--spacing-sm) px-(--spacing-xl) py-(--spacing-lg)">
            <span class="text-big-number-lg text-(--primary)">{{ cellIndex(index) }}</span>

            <h3 class="m-0 text-balance text-heading-sm text-(--text-default)">
              {{ pillar.title }}
            </h3>

            <ul class="m-0 flex list-none flex-col gap-(--spacing-xs) p-0">
              <li
                v-for="point in pillar.points"
                :key="point"
                class="text-pretty text-body-md text-(--text-muted)"
              >
                {{ point }}
              </li>
            </ul>
          </article>
        </FrameBox>
      </div>
    </section>
  </div>
</template>

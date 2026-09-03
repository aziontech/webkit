<script setup>
  // THE STACK AS IT ACTUALLY IS — a vendor per job, and a hop between every pair.
  //
  // The companion drawing to the map ones, and an argument of the same kind. The map slides
  // draw WHERE a request goes; this one draws WHAT IT GOES THROUGH: marks the room already
  // recognizes, each labelled with the one job it does, wired to each other by more links than
  // anybody would draw on purpose. The tangle IS the claim — nothing in it is broken, and that
  // is the point. Every one of those tools is a reasonable choice; the cost is the graph.
  //
  // ── THE LINKS ARE MapMesh, NOT A SECOND MESH ──
  //
  // A hop between two tools and a hop between two PoPs are the same event, so they are the
  // same drawing: seeded degree-bounded edges, signed bows, and the one packet definition in
  // `map-packet.css`. MapMesh projects its pool through a `framing` because its points are in
  // ARTWORK units; the points here are already in box pixels, so it is handed the IDENTITY
  // framing — a crop that IS the box, at the origin, which `projectOnMap` resolves to scale 1
  // with no offset. That one computed value is the whole adapter, and it is why this file
  // holds no generator, no seed and no keyframes of its own.
  //
  // The links run between node CENTRES and the tiles are opaque, so every link emerges from
  // behind the mark it starts at. Same principle the vision slide's globe leans on: what is in
  // front hides what is behind, and in a language with no shadows that is how depth is stated.
  //
  // ── A NODE IS A SQUARE, DECK-WIDE ──
  //
  // These were discs. They are `--shape-card` tiles now, and the change is not local to this
  // drawing: the deck codes SHAPE, so a square is a thing in the world (a vendor here, one of
  // the seven worlds on the `platform` wheel, a node of the network on the `before-after` fan)
  // and the one round object in the whole deck is the plate those spokes converge on. Nine
  // orange discs read as nine buttons; nine tiles read as nine boxes somebody has to run, which
  // is what this slide is complaining about.
  //
  // ── THE SCATTER IS DERIVED, NOT PLACED ──
  //
  // Nine hand-nudged coordinate pairs would be nine numbers nobody could check and the Figma
  // build would have to copy. These sit on a GOLDEN-ANGLE spiral — the sunflower arrangement,
  // `theta = i * 137.5deg` and `r = sqrt((i + 0.5) / n)` — mapped onto the box's inscribed
  // ellipse. Two properties earn it:
  //
  //   IT LOOKS UNARRANGED. A ring or a grid of nine tools reads as a system, which is the
  //   opposite of this slide's claim. The golden angle is the standard irregular-but-even
  //   placement: no two nodes land on top of each other, and no row, column or ring emerges
  //   for the eye to lock onto.
  //   IT IS A FUNCTION OF `n`. Add or drop a tool in the deck data and the drawing re-places
  //   itself, still evenly, with nothing to re-tune. The `sqrt` is what keeps the density even
  //   instead of crowding the rim.
  import MapMesh from '@shared/ui/banners/MapMesh.vue'
  import ClientMark from '@shared/ui/brand/ClientMark.vue'
  import { computed } from 'vue'

  const props = defineProps({
    /** The box the drawing fills, in canvas pixels. The mesh's user units are these pixels. */
    box: { type: Object, required: true },
    /** Registry entries with the job each one does — `{ name, logo?, artwork?, label }`. */
    nodes: { type: Array, required: true }
  })

  // THE LINKS CARRY THIS DRAWING, so they are raised well past the weight the map slides use.
  // MapMesh's 0.12 default is tuned for links drawn ON the dotted landmass, which supplies the
  // context; here there is nothing under them, and at 0.12 on bare canvas the graph — the whole
  // claim — reads as a whisper behind nine tiles. 0.3 is the weight MapMesh itself comes up to
  // when its traffic is switched off and the links have to state the network alone, so it is
  // the value already reasoned about rather than a new one.
  const LINK_OPACITY = 0.3

  /** The tile, and the mark inside it — the mark at half the tile, so the fill reads as a badge. */
  const TILE = 56
  const MARK = 'h-7 w-auto max-w-7 object-contain'

  // THE NODE'S FOOTPRINT, which is what the scatter is inset by — and it is not the tile. The
  // label hangs BELOW the tile and is wider than it, so the three insets are three different
  // numbers and each is measured off something: half-width is the widest label at the body-lg
  // step (`Provisioning`, measured 114.5px on the rendered slide, so 60 covers half of it),
  // the top is half the tile, and the bottom is that half plus the label's line box (24.7px
  // measured) and its gap.
  const FOOTPRINT = { x: 60, top: TILE / 2, bottom: TILE / 2 + 40 }

  /** 137.5deg — the angle that divides the circle so no two turns ever line up. */
  const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

  const points = computed(() => {
    const count = props.nodes.length
    // The inscribed ellipse, inset by the footprint. Its centre sits above the box's own,
    // because the bottom inset is the larger one — every label hangs the same way.
    const radius = {
      x: (props.box.width - 2 * FOOTPRINT.x) / 2,
      y: (props.box.height - FOOTPRINT.top - FOOTPRINT.bottom) / 2
    }
    const centre = { x: props.box.width / 2, y: FOOTPRINT.top + radius.y }

    return props.nodes.map((node, index) => {
      const spiral = Math.sqrt((index + 0.5) / count)
      const angle = index * GOLDEN_ANGLE
      return {
        x: centre.x + Math.cos(angle) * spiral * radius.x,
        y: centre.y + Math.sin(angle) * spiral * radius.y
      }
    })
  })

  /**
   * The identity framing — see the note above. MapMesh takes its pool in whatever units its
   * `framing` crops, so a crop that is the box makes those units the box's own pixels.
   */
  const framing = computed(() => ({
    crop: [0, 0, props.box.width, props.box.height],
    fit: 'xMinYMin meet'
  }))

  /** The pool in the shape MapMesh reads it: `[x, y]` pairs. */
  const pool = computed(() => points.value.map((point) => [point.x, point.y]))

  // A node is positioned by its TILE, not by its cell: the wrapper's top-left is the tile's
  // top-left, so the spiral point stays the tile's centre however long the label under it runs.
  // The label is then taken out of flow (`absolute top-full`) and centred on the tile, which is
  // what keeps a two-word label from pushing its own mark off the spiral.
  const nodeStyle = (point) => ({
    left: `${(point.x - TILE / 2).toFixed(1)}px`,
    top: `${(point.y - TILE / 2).toFixed(1)}px`,
    width: `${TILE}px`,
    height: `${TILE}px`,
    padding: `${(TILE * 0.22).toFixed(1)}px`
  })
</script>

<template>
  <div
    aria-hidden="true"
    class="absolute inset-0"
  >
    <!-- The hops. Under the marks in the stack, so a link disappears behind the tile it
         arrives at instead of crossing it. -->
    <MapMesh
      :box="box"
      :framing="framing"
      :pool="pool"
      :participants="nodes.length"
      :link-opacity="LINK_OPACITY"
      class="z-0"
    />

    <!-- The marks. An orange tile with the tool's own silhouette KNOCKED OUT of it: the mark
         is `ClientMark knockout`, the same one-ink treatment the site's logo strips take, with
         its ink pinned to black instead of following the theme. The theme-following ink is what
         this drawing had first, and on this canvas it resolves to white — white on #F3652B
         measures 3.0:1, so nine marks sat on their own fill as ghosts. Black on the same orange
         measures 6.71:1, which is the pair (and the measurement) the deck's marker band already
         settled on for text on `--primary`; a mark on a filled surface is the same problem, so
         it takes the same answer rather than a new one.

         The tile carries that ink as its own `text-(--bg-canvas)`, so the typographic wordmark
         a name with no registry asset falls through to is knocked out too — a missing file still
         shows up on the slide rather than in a diff, and it shows up legibly. -->
    <div
      v-for="(node, index) in nodes"
      :key="node.name"
      class="absolute z-10 flex items-center justify-center rounded-(--shape-card) bg-(--primary) text-(--bg-canvas)"
      :style="nodeStyle(points[index])"
    >
      <ClientMark
        :client="node"
        :mark="MARK"
        knockout
      />

      <span
        class="absolute left-1/2 top-full mt-(--spacing-xs) -translate-x-1/2 whitespace-nowrap text-body-lg text-(--text-default)"
        >{{ node.label }}</span
      >
    </div>
  </div>
</template>

<script setup>
  // THE PATH THROUGH THE PLATFORM — one author, one mark, and the network under it.
  //
  // The counter-drawing to `ToolConstellation`, and it is drawn as its opposite in every
  // decision. That one scatters nine vendors on a golden-angle spiral and wires them to each
  // other, because the tangle IS its claim; this one is four RANKS on one centre line with the
  // fan widening as it descends, because its claim is that the path is short and there is only
  // one of it. Anything irregular here — a scatter, a bow, a second hop back up — would argue
  // the other drawing's case.
  //
  // ── FLAT, AND SQUARE — INCLUDING THE MARK ──
  //
  // Every node is the deck's own tile: a `--shape-card` square, one hairline, one flat fill,
  // one outline glyph. No disc, no gradient, no depth — the reference render draws its
  // endpoints as shaded spheres, and a sphere is a lighting model this deck does not own
  // (nothing else in it has a light source, so one sphere makes every other object look
  // unfinished). The tile is already the shape `PlatformOrbit` gives the seven worlds around
  // the platform, so a node here and a seat there are the same object seen twice.
  //
  // THE MARK IS THAT SAME TILE, one step larger. It was a bare glyph on the drawing's vertex,
  // which made it the one object on the slide with no plate under it and read as a logo
  // dropped onto a diagram rather than as the thing the fan comes out of. So it takes the
  // node's square and stays apex by two means instead: it is `APEX` wide against the node's
  // `TILE` — enough to rank above them, not enough to leave the family — and it is the one
  // object in the deck that is LIT.
  //
  // ONE GLOW, AND ONLY HERE. A halo in `--primary-mask` (the brand orange at 20%), tight then
  // wide, so the tile sits in its own light without gaining an edge or a direction — it is a
  // highlight, not a light source, which is what keeps the rest of the drawing flat. Nothing
  // else in this deck glows, and that is what the glow means.
  //
  // ── THE RANKS ARE SOLVED, NOT PLACED ──
  //
  // Four rows, each with its own footprint (the author's includes the caption under it; the
  // mark's is the glyph's own height), stacked with ONE gap computed from whatever the box has
  // left over. Horizontally there is ONE pitch for the whole drawing, derived from the widest
  // rank, so a rank is wide because of how many nodes it holds and not because a fraction was
  // picked for it — which is what makes the cone a consequence of the data. Add a node to
  // either rank in data/deck.js and the pitch narrows, both rows re-centre, and every link
  // re-draws.
  //
  // ── TWO WEIGHTS OF RULE, AND THEY MEAN TWO THINGS ──
  //
  // The deploy path — author to mark, mark to each node of the network — is `--primary`,
  // because that path is the claim the slide is making. The fabric below it (every node of the
  // network to every consumer) is the deck's `--border-default` hairline, because it is the
  // world the platform is already wired into rather than something this slide is asserting.
  // Same split `PlatformOrbit` makes between its orange spokes and its hairline ring.
  //
  // Every rule is drawn between CENTRES and every tile is opaque, so a link is trimmed at both
  // ends by what sits on top of it and the drawing never computes where a line should stop.
  // The two rules that touch the mark are the exception, because a glyph is not opaque: they
  // stop at its top edge and start again at its bottom.
  import Brand from '@aziontech/webkit/brand'
  import { computed } from 'vue'

  const props = defineProps({
    /** The box the drawing fills, in canvas pixels — the drawing's own user units. */
    box: { type: Object, required: true },
    /** The top rank: who writes the application. `{ label, icon }`. */
    author: { type: Object, required: true },
    // THE NETWORK IS A COUNT AND ONE GLYPH, not a list, and the asymmetry with `consumers`
    // below is the argument: every node of this rank is the same node — that is what a platform
    // IS — while the rank under it is five different things that happen to be pointed at it.
    /** The platform's own rank: how many nodes to draw, and the glyph they all carry. */
    network: { type: Object, default: () => ({ count: 0, icon: '' }) },
    /** The bottom rank, everything the application is delivered to — one icon class each. */
    consumers: { type: Array, default: () => [] }
  })

  /** The node: a square tile with the glyph centred in it. `PlatformOrbit`'s seat, one step down. */
  const TILE = 72

  /** The apex tile. One step over the node, so the rank reads above them without leaving them. */
  const APEX = 96

  // The mark inside it, at the width the reduced lockup is drawn at (21x18, so the height
  // follows). 56 of the tile's 96 is the same share of its plate the node glyphs take of
  // theirs, which is what keeps the apex reading as a bigger tile rather than as a tighter one.
  const MARK = { width: 56, height: (56 * 18) / 21 }

  // The author's caption footprint — the `overline-md` line box on this canvas (14px at 1.375,
  // rounded up) and the `--spacing-md` the template sets under the tile. It is reserved rather
  // than measured, so the rank below does not move when the label is rewritten.
  const CAPTION = { height: 20, gap: 16 }

  /** How much canvas the widest rank keeps either side of it. `--spacing-xl` @ xl. */
  const MARGIN = 48

  const layout = computed(() => {
    const { width, height } = props.box

    // The four rows, top to bottom, each with the vertical space its own contents need. The
    // author's row carries its caption; the mark's row is the glyph; the two node rows are the
    // tile alone, because nothing is labelled below the apex (see the slide's own note).
    const rows = [TILE + CAPTION.gap + CAPTION.height, APEX, TILE, TILE]
    const gap = (height - rows.reduce((total, row) => total + row, 0)) / (rows.length - 1)

    // Each row's own top edge, and from it the centre the row's contents are placed on.
    const tops = rows.reduce((offsets, row, index) => [...offsets, offsets[index] + row + gap], [0])

    // ONE PITCH for the whole cone, from the widest rank: that rank spans `(n - 1) * pitch`
    // between its outer centres, plus a tile, plus the margin either side.
    const widest = Math.max(props.network.count, props.consumers.length, 1)
    const pitch = widest > 1 ? (width - TILE - 2 * MARGIN) / (widest - 1) : 0
    const centre = width / 2

    /** A rank's tile centres, spread on that pitch and centred in the box. */
    const rank = (count, y) =>
      Array.from({ length: count }, (_, index) => ({
        x: centre + (index - (count - 1) / 2) * pitch,
        y
      }))

    return {
      centre,
      // The author's tile centre, and the point the deploy line leaves from — BELOW the
      // caption, not out of the tile. A rule drawn from the tile's centre is trimmed by the
      // tile but not by the label under it, so it crosses its own caption on the way down.
      author: { x: centre, y: tops[0] + TILE / 2, exit: tops[0] + rows[0] },
      // The apex: the tile's own edges, on the centre line. The deploy line stops at its top
      // and every spoke of the fan starts at its bottom, so the tile trims its own rules the
      // way the opaque nodes below it do.
      mark: { x: centre, y: tops[1] + APEX / 2, top: tops[1], bottom: tops[1] + APEX },
      network: rank(props.network.count, tops[2] + TILE / 2),
      consumers: rank(props.consumers.length, tops[3] + TILE / 2)
    }
  })

  /** Every link of the fabric — each node of the network to each consumer, once. */
  const fabric = computed(() =>
    layout.value.network.flatMap((node) =>
      layout.value.consumers.map((consumer) => ({ node, consumer }))
    )
  )

  const px = (value) => `${value.toFixed(1)}px`

  const tileStyle = (point) => ({
    left: px(point.x - TILE / 2),
    top: px(point.y - TILE / 2),
    width: px(TILE),
    height: px(TILE)
  })

  /** The apex tile's box — the node's `tileStyle`, at the apex's own size. */
  const apexStyle = computed(() => ({
    left: px(layout.value.centre - APEX / 2),
    top: px(layout.value.mark.top),
    width: px(APEX),
    height: px(APEX)
  }))

  const markStyle = { width: px(MARK.width) }
</script>

<template>
  <div class="absolute inset-0">
    <!-- THE RULES. One svg for all of them, under every tile, because the trimming is the
         drawing: a link vanishes behind the node it arrives at instead of crossing it. -->
    <svg
      aria-hidden="true"
      class="absolute inset-0"
      :width="box.width"
      :height="box.height"
      :viewBox="`0 0 ${box.width} ${box.height}`"
      fill="none"
    >
      <!-- The fabric, first, so a hairline never paints over the path. -->
      <line
        v-for="(link, index) in fabric"
        :key="index"
        class="stroke-(--border-default)"
        :x1="link.node.x"
        :y1="link.node.y"
        :x2="link.consumer.x"
        :y2="link.consumer.y"
        stroke-width="1"
      />

      <!-- The deploy: one line down to the mark, and one spoke from under it to each node of
           the network. -->
      <line
        class="stroke-(--primary)"
        :x1="layout.author.x"
        :y1="layout.author.exit"
        :x2="layout.centre"
        :y2="layout.mark.top"
        stroke-width="1"
      />
      <line
        v-for="(node, index) in layout.network"
        :key="index"
        class="stroke-(--primary)"
        :x1="layout.centre"
        :y1="layout.mark.bottom"
        :x2="node.x"
        :y2="node.y"
        stroke-width="1"
      />
    </svg>

    <!-- THE AUTHOR. The one labelled node on the slide: everything below the apex is network,
         and network does not need naming — the reference render labels none of it either. -->
    <div
      class="absolute flex items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      :style="tileStyle(layout.author)"
    >
      <i
        aria-hidden="true"
        :class="author.icon"
        class="text-heading-lg leading-none text-(--text-default)"
      />

      <span
        class="absolute left-1/2 top-full mt-(--spacing-md) -translate-x-1/2 whitespace-nowrap text-overline-md text-(--text-default)"
        >{{ author.label }}</span
      >
    </div>

    <!-- THE APEX. The node's tile at `APEX`, on the platform's own `raised` step (the rank
         below it carries the same fill — they are the same thing, seen once and then three
         times), plus the drawing's one glow: two halos of `--primary-mask`, at the `lg` and
         `xxl` steps, so the near one gives the tile its edge light and the far one puts it in
         a field. Both are box-shadows of a token colour, which is an expression value and
         therefore stays in brackets — the paren shorthand emits nothing for these.

         `Brand` caps its lockup at 32px (`size="large"`), a header's height, so the svg is
         released from the component's own height rules and driven off this width instead —
         the same one override `PlatformOrbit` hangs on its plate. -->
    <div
      class="absolute flex items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised) shadow-[0_0_var(--spacing-lg)_var(--primary-mask),0_0_var(--spacing-xxl)_var(--primary-mask)]"
      :style="apexStyle"
    >
      <Brand
        kind="reduced"
        class="[&>svg]:h-auto! [&>svg]:w-full!"
        :style="markStyle"
      />
    </div>

    <!-- THE NETWORK, and what it delivers to. Two ranks of the same tile, separated by their
         fill on the deck's own three-step ladder: the platform's own nodes are `raised`, the
         consumers sit on `surface`. Shape carries what they have in common (both are things in
         the world, both square), the step carries which side of the edge they are on. -->
    <div
      v-for="(node, index) in layout.network"
      :key="`network-${index}`"
      aria-hidden="true"
      class="absolute flex items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
      :style="tileStyle(node)"
    >
      <i
        :class="network.icon"
        class="text-heading-lg leading-none text-(--text-default)"
      />
    </div>

    <div
      v-for="(icon, index) in consumers"
      :key="`consumer-${index}`"
      aria-hidden="true"
      class="absolute flex items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface)"
      :style="tileStyle(layout.consumers[index])"
    >
      <i
        :class="icon"
        class="text-heading-lg leading-none text-(--text-muted)"
      />
    </div>
  </div>
</template>

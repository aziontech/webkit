<script setup>
  // THE LANES SLIDE — the same journey twice, and the difference between them is the claim.
  //
  // Two rows of boxes on one track: the path as it is today, and the path the slide is arguing
  // for. Everything in this layout exists to make ONE comparison unmissable — the lower row has
  // a box in the middle that the upper row does not.
  //
  // ── THE FIRST AND LAST NODE OF EVERY LANE SIT ON THE SAME PIXEL ──
  //
  // That is the drawing. A comparison of two paths is worth nothing if the ends move: the room
  // spends the slide re-finding where each lane starts instead of seeing what came between. So
  // a lane does not lay its own nodes out, the TRACK does — the first node is pinned to the
  // track's left edge, the last to its right, and anything between them is distributed evenly
  // across what is left. A two-node lane and a three-node lane therefore share both ends by
  // construction, at any counts, and the middle box is the only thing left to notice.
  //
  // The track is eight of the content box's twelve columns, with two for the lane's name and
  // two for the note beside it. A node is a two-column run, so every object on this slide —
  // name, node, note — is measured in the same columns lib/deck-canvas.js defines, and the
  // node pitch (363px at three nodes, 242 at four) lands on whole pixels in the browser and
  // in the Figma build alike.
  //
  // ── THE LAST LANE IS THE CLAIM ──
  //
  // Nothing in deck.js says which lane is live: the last one is, and every lane above it is
  // the ground it argues against, so this layout mutes them. ORDER is the only decision the
  // content makes — which keeps the deck's split intact (data/deck.js decides no colour) and
  // matches how the deck already argues elsewhere, with the answer after the problem rather
  // than beside it. A slide whose claim wants to be first is a slide with its lanes the wrong
  // way round.
  //
  // ── ONE REQUEST PER LANE, AND THE MIDDLE BOX IS A STOP ──
  //
  // Each wire carries the deck's own packet: map-packet.css, the shared definition of a request
  // crossing a wire, first spent on the map beneath the vision slides. A lane's hops are
  // delayed one crossing apart, so the claim lane's request reaches the middle box, waits, and
  // is released to the far end — while the muted lane's request, having nothing to clear, has
  // already arrived. The argument is about WHEN a decision happens, so it is drawn in time as
  // well as in ink.
  //
  // TWO HOPS IS THE CEILING, and it is a real one rather than an oversight: the shared packet
  // crosses in the first 45% of its cycle and parks for the rest, so a lane can hand over twice
  // before the cycle comes round. Three nodes per lane is the contract; a fourth needs a clock
  // of its own, or a packet with a shorter duty cycle.
  //
  // Reduced motion parks every packet and leaves the wires, the arrival marks and the boxes —
  // the same claim, held still.
  import '@shared/ui/banners/map-packet.css'

  import { span } from '../lib/deck-canvas.js'
  import SlideHeading from './SlideHeading.vue'

  const props = defineProps({
    slide: { type: Object, required: true }
  })

  // The track's width — eight columns, so the three regions (2 + 8 + 2) and the grid's own
  // gutters fill the content box exactly. Only the width is needed here; the template's
  // col-spans place the regions, and the nodes are placed against this by hand.
  const TRACK_WIDTH = span(8) // 944

  // THE NODE BOX. `width` is a two-column run — the same measure as the name and the note, so
  // the slide has one module size. `height` is --spacing-xxl at the canvas step (96px, pinned
  // by CANVAS_TOKENS), kept as a NUMBER rather than as a token in a class: the svg that draws
  // the wires needs it in its own user units, and a token in the class plus a literal in the
  // viewBox is two values that can drift.
  const NODE = { width: span(2), height: 96 }

  /** Where the wires run — the node box's own centre line. */
  const MID = NODE.height / 2

  // THE ARRIVAL MARK is the frame's registration square (deck-canvas's MARK, 6px) at the size
  // this drawing needs. The frame's tick is scaffolding sitting behind content; this one IS
  // content — it is the assertion that the edge lands on something — so it takes the
  // --spacing-sm step and holds --spacing-xs of air off the box it points at.
  const MARK = { size: 12, clearance: 8 }

  const VIEW_BOX = `0 0 ${TRACK_WIDTH} ${NODE.height}`

  /** x of node `index` of `count`, relative to the track. The first and last are its ends. */
  const nodeX = (index, count) =>
    count > 1 ? Math.round(index * ((TRACK_WIDTH - NODE.width) / (count - 1))) : 0

  // One hop per gap: the wire, written as a horizontal path so `pathLength` is honoured (it is
  // reliable on a path and not on every shape), and the x the arrival mark sits at.
  const hops = (count) =>
    Array.from({ length: Math.max(count - 1, 0) }, (_, index) => {
      const mark = nodeX(index + 1, count) - MARK.clearance - MARK.size
      return { index, mark, d: `M ${nodeX(index, count) + NODE.width} ${MID} H ${mark}` }
    })

  const isClaim = (index) => index === props.slide.lanes.length - 1

  const trackStyle = { height: `${NODE.height}px` }

  const nodeStyle = (index, count) => ({
    left: `${nodeX(index, count)}px`,
    width: `${NODE.width}px`,
    height: `${NODE.height}px`
  })

  // The handover. The crossing is the first 45% of the cycle (map-packet.css), and the cycle is
  // two --transition-duration-slow-04 steps (the scoped style below), so one crossing is
  // 0.9 of a step and the next hop starts exactly where the last one landed.
  const packetStyle = ({ index }) => ({
    animationDelay: `calc(${index} * 0.9 * var(--transition-duration-slow-04))`
  })
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- The headline takes the OPENER step, not the content one: on a principle slide the
         sentence IS the argument and the diagram under it is the proof, so it carries the
         weight a section opener does. `step` / `steps` are passed through because this is one
         of a run — data/deck.js stamps both from the section rows, so the counter is a fact
         about the deck's structure and nothing here counts anything. -->
    <SlideHeading
      :eyebrow="slide.eyebrow"
      :step="slide.step"
      :steps="slide.steps"
      :headline="slide.headline"
      size="2xl"
    />

    <!-- The lanes take what the header leaves and centre in it: a pair of 96px rows anchored to
         the top would hang off the header, and anchored to the bottom would sit on the frame's
         lower rule. -->
    <div class="flex flex-1 flex-col justify-center">
      <!-- ONE RULE PER EDGE, as everywhere in this language: the divider between two lanes
           belongs to the LOWER lane, so the first draws nothing. `data-lane` is what carries
           muted-versus-claim into every part of the row — the name, the boxes, the wires, the
           marks and the note all read it off the group, so the distinction is declared once
           here rather than branched five times below. -->
      <div
        v-for="(lane, index) in slide.lanes"
        :key="lane.label"
        :data-lane="isClaim(index) ? 'claim' : 'ground'"
        class="group grid grid-cols-12 items-center gap-x-(--spacing-lg) border-t border-(--border-default) py-(--spacing-xl) first:border-t-0"
      >
        <span
          class="col-span-2 text-overline-md text-(--text-disabled) group-data-[lane=claim]:text-(--primary)"
          >{{ lane.label }}</span
        >

        <div
          class="relative col-span-8"
          :style="trackStyle"
        >
          <!-- The wires sit behind the boxes and the svg's user units ARE canvas pixels, so
               every coordinate above goes in unchanged: no second unit system to keep in step. -->
          <svg
            aria-hidden="true"
            class="absolute inset-0 size-full"
            :viewBox="VIEW_BOX"
            fill="none"
          >
            <g
              v-for="hop in hops(lane.nodes.length)"
              :key="hop.index"
            >
              <!-- The wire: always there, never moving. Under reduced motion it is the whole
                   drawing, and that still frame is the slide's claim on its own.
                   Each lane dims its wire by the means its own ink allows — the ground lane
                   takes the frame's hairline token, the claim lane takes the brand orange at
                   40% (there is no dimmer orange in the palette). Both land ~3 steps under the
                   packet that rides them, which is what makes traffic legible on a 1px line:
                   at one step apart the request is invisible against its own wire. -->
              <path
                :d="hop.d"
                stroke-width="1"
                class="stroke-(--border-default) group-data-[lane=claim]:stroke-(--primary) group-data-[lane=claim]:opacity-40"
              />

              <!-- The request, on the wire's own `d`. Same weight as the wire and one step
                   brighter: at a 1px hairline there is no thinner stroke to give it, so it
                   reads as traffic by its ink and its travel rather than by its width.
                   `pathLength` normalizes the hop to 100 so the shared keyframes cross a 129px
                   gap and a 726px span alike — it is CAMELCASE and must stay that way, or the
                   dash units silently fall back to user units. -->
              <path
                :d="hop.d"
                class="map-packet stroke-(--text-muted) group-data-[lane=claim]:stroke-(--primary) motion-reduce:animate-none"
                pathLength="100"
                stroke-width="1"
                stroke-dasharray="0 200"
                stroke-dashoffset="-100"
                stroke-linecap="butt"
                :style="packetStyle(hop)"
              />

              <!-- Where the hop lands. -->
              <rect
                :x="hop.mark"
                :y="MID - MARK.size / 2"
                :width="MARK.size"
                :height="MARK.size"
                class="fill-(--text-muted) group-data-[lane=claim]:fill-(--primary)"
              />
            </g>
          </svg>

          <!-- The boxes. Opaque, because a wire must never be seen running under one. -->
          <div
            v-for="(node, position) in lane.nodes"
            :key="node"
            class="absolute top-0 flex items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) text-heading-lg text-(--text-muted) group-data-[lane=claim]:border-(--primary) group-data-[lane=claim]:bg-(--primary-mask) group-data-[lane=claim]:text-(--text-default)"
            :style="nodeStyle(position, lane.nodes.length)"
          >
            {{ node }}
          </div>
        </div>

        <p
          class="col-span-2 m-0 text-pretty text-body-lg text-(--text-muted) group-data-[lane=claim]:text-(--text-default)"
        >
          {{ lane.note }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* THE CYCLE, shared by every hop on the slide. Two --transition-duration-slow-04 steps is the
     route's own clock (MapRoute runs a round trip on it), and map-packet.css spends the first
     45% of it crossing — so one hop takes 1890ms and a lane hands over at 1890 and 3780, with
     the wire empty for the last 420ms before it comes round. Both lanes are on the one cycle,
     which is what makes the comparison legible: the requests leave together, and only one of
     them is still travelling when the other has arrived. */
  .map-packet {
    animation-duration: calc(2 * var(--transition-duration-slow-04));
  }
</style>

<script setup>
  // AgentIllustration — the scene for "onboard your agent": the AI editors the reader
  // already codes in, all wired to the same session that knows how to ship here.
  //
  // WHY NOT THE `ai-inference` ASSET. It draws a prompt entering a chat window, which is a
  // picture of "an AI answers you" — the wrong promise. This card is not offering a chat; it
  // hands over a prompt that teaches the reader's OWN editor to deploy here. So the scene
  // names the editors, and the session is what they arrive at.
  //
  // ── THE PATHS ARE S-CURVES, AND THERE IS NO RAIL ──
  //
  // Four paths, one per editor, each leaving its logo DOWNWARD and arriving on the session's
  // top edge DOWNWARD, bending twice in between. That is the same S the frameworks scene
  // routes with (`scene-curve.js`), rotated a quarter turn.
  //
  // The rail is gone with it, and that is the point: a bus made every editor's connection
  // identical and anonymous, and its two outer turns were single hard 90° corners. Four
  // separate S-curves landing at four points along the session's top edge say what the card
  // says — whichever editor you use, it ends up here — and they say it without a shared line
  // nobody can attribute.
  //
  // It also settles the dashes. A dashed path made of abutting segments never phase-aligns, so
  // the old dashed-drops-into-a-solid-rail composition stepped at every junction. Now every
  // line is solid and the marching dash is gone; motion is not what this drawing needs.
  //
  // GEOMETRY. Every line in this scene is now an elbow, and an elbow is a BORDER drawn inside
  // its box edge — so an arm's centre line sits `HALF` in from that edge. `scene-curve.js`
  // owns that conversion: it takes the centre lines a path must leave from and land on, and
  // returns boxes. Nothing here places a box by hand.
  //
  // WEIGHT. The stroke is raised to `--border-2` (2px) per LINE, by redeclaring the DS's own
  // `--illustration-rim-width-hairline` on the connector or elbow itself. 0.8px is a rim on a
  // 32px part; on a 240px drawing whose subject IS the wiring it reads as a half-lit thread.
  // The NODES keep the foundation weight — the variable is declared on the lines, not on the
  // scene, so a joint stays a hairline joint.
  //
  // ── WHERE THE NODES GO ──
  //
  // One node per editor, CENTRED ON THE POINT where its path leaves the logo, so the 8px
  // square straddles the box's bottom edge by 4px the way the DS's own `bot-manager` places
  // its junctions. Sitting it fully below the box left a visible gap: a box's rect is 32px
  // but its drawn rounded square stops ~2px inside it.
  //
  // It uses the part's DEFAULT variant — a foundation hairline in `--border-default` — with
  // the system's `--shape-elements` corner, so a joint reads as a component of the drawing
  // and lets the wiring carry the weight.
  //
  // ── HIERARCHY ──
  //
  // The editors REST and so does the wiring, both `:active="false"`. The session is the only
  // lit surface, so the eye ends on what the reader walks away with.
  //
  // `mono` on the marks: AgentMark's own escape hatch, documented there for exactly this case
  // — in a drawing, Claude's brand colour reads as a highlight nobody meant and collides with
  // Azion's orange.
  import Illustration from '@aziontech/webkit/illustration'
  import IllustrationBox from '@aziontech/webkit/illustration-box'
  import IllustrationElbow from '@aziontech/webkit/illustration-elbow'
  import IllustrationNode from '@aziontech/webkit/illustration-node'
  import IllustrationWindow from '@aziontech/webkit/illustration-window'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'

  import { centreX, SCENE_HEIGHT, SCENE_WIDTH, sceneCanvasStyle } from './scene-canvas'
  import { verticalS } from './scene-curve'

  // Four of the five marks the pill carries (lib/agent-onboarding.js). Four fit the canvas at
  // a legible size; the fifth would shrink all of them.
  const AGENTS = ['claude', 'cursor', 'windsurf', 'codex']

  const BOX_SIZE = 32
  const WINDOW_SIZE = 64
  const NODE = 8

  // The vertical budget, out loud, because a canvas does not forgive a guess: 12 top + 32 row
  // + 38 drop + 22 exit + 64 session + 12 bottom = 180.
  const BOX_TOP = 12
  const BOX_PITCH = 56 // 32 + a 24px gap
  const WINDOW_TOP = 104

  // The row is centred: four boxes at a 56px pitch span 200 of the 240 columns.
  const ROW_WIDTH = BOX_PITCH * (AGENTS.length - 1) + BOX_SIZE
  const ROW_X = Math.round((SCENE_WIDTH - ROW_WIDTH) / 2)

  const boxLeft = (index) => ROW_X + index * BOX_PITCH
  // ── stroke geometry ──
  const dropStrokeX = (index) => boxLeft(index) + BOX_SIZE / 2 // a drop, on its box's middle
  const DROP_FROM = BOX_TOP + BOX_SIZE // the box's edge, where a path starts

  // The session sits centred at the bottom; each path lands on its top edge at its own point,
  // evenly spaced about the middle so the fan is symmetric.
  const WINDOW_LEFT = centreX(WINDOW_SIZE)
  const ARRIVAL_PITCH = 14
  const arrivalX = (index) =>
    WINDOW_LEFT + WINDOW_SIZE / 2 + (index - (AGENTS.length - 1) / 2) * ARRIVAL_PITCH

  // One S per editor: out of the logo, onto the session.
  const CURVES = AGENTS.map((_, index) =>
    verticalS({
      x0: dropStrokeX(index),
      y0: DROP_FROM,
      x1: arrivalX(index),
      y1: WINDOW_TOP
    })
  ).flat()

  const nodeOffset = NODE / 2

  // Bottom margin, asserted rather than assumed.
  const BOTTOM_AIR = SCENE_HEIGHT - (WINDOW_TOP + WINDOW_SIZE)

  const LINE_CLASS = 'absolute [--illustration-rim-width-hairline:var(--border-2)]'
</script>

<template>
  <!-- The scene is `active`, so its SURFACES carry the brand rim; the wiring opts out. -->
  <Illustration active>
    <span
      class="relative block overflow-hidden"
      :style="sceneCanvasStyle"
      :data-bottom-air="BOTTOM_AIR"
    >
      <IllustrationBox
        v-for="(agent, index) in AGENTS"
        :key="agent"
        size="small"
        :active="false"
        :style="{ left: `${boxLeft(index)}px`, top: `${BOX_TOP}px` }"
        class="absolute"
      >
        <AgentMark
          :name="agent"
          mono
          class="size-4"
        />
      </IllustrationBox>

      <!-- One S per editor: two arcs of opposite curvature, tangent where they meet, so the
           seam does not show. -->
      <IllustrationElbow
        v-for="(curve, index) in CURVES"
        :key="`curve-${index}`"
        :corner="curve.corner"
        :active="false"
        :class="LINE_CLASS"
        :style="curve.style"
      />

      <!-- One origin per editor, centred on the point where its path leaves the logo. `z-1` so
           a marker always paints over the wiring. -->
      <IllustrationNode
        v-for="(agent, index) in AGENTS"
        :key="`node-${agent}`"
        :active="false"
        class="absolute z-1 rounded-(--shape-elements)"
        :style="{
          left: `${dropStrokeX(index) - nodeOffset}px`,
          top: `${DROP_FROM - nodeOffset}px`
        }"
      />

      <IllustrationWindow
        kind="chat"
        active
        class="absolute"
        :style="{ left: `${WINDOW_LEFT}px`, top: `${WINDOW_TOP}px` }"
      />
    </span>
  </Illustration>
</template>

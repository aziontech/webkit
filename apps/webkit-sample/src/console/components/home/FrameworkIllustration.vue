<script setup>
  // FrameworkIllustration — the scene for "ship something new": whatever the reader
  // already builds with, wired into one live site.
  //
  // WHY NOT THE `build` ASSET. `build` draws the Azion mark, a website and a Build pill —
  // true, but it says "a thing gets built", which the title already said. What the reader
  // needs to know on a first access is that THEIR stack is welcome, and the only way to
  // say that without a paragraph is to show the marks.
  //
  // ── ROOM TO BREATHE ──
  //
  // On the DS's 170×128 canvas this fan-in used 156 of 170 columns: parts pushed against a
  // frame. A scene composed here is only bound to the card's stage, so it sits on the app's
  // larger 240×180 canvas (`scene-canvas.js`) and spends every extra pixel on the gaps —
  // 16px margins, a 26px gap between rows, a 112px run into the site. Part sizes are
  // untouched, which is what keeps the three scenes reading as one system.
  //
  // ── THE PATHS ARE S-CURVES ──
  //
  // Three PATHS, not six segments: the middle row runs straight through to the site, and the
  // outer two change lane through an S — leaving their mark horizontally and arriving on the
  // middle row horizontally, bending twice in between. A single quarter-arc turn was tried
  // first and reads as a schematic; the S is the shape a platform diagram uses, and it is
  // what makes the drawing look drawn rather than assembled. The composition lives in
  // `scene-curve.js` (two opposite elbows, radius = the box), so both scenes route the same
  // way.
  //
  // GEOMETRY. A connector centres its stroke inside a 4px box (`top = strokeY - STROKE / 2`);
  // an elbow is a border drawn inside its box edge, so its arm sits `HALF` in. Both rules are
  // named — mixing them up is what leaves a 1px step at a junction — and the curve helper
  // takes centre lines, never boxes.
  //
  // WEIGHT. The stroke is raised to `--border-2` (2px) per LINE, by redeclaring the DS's own
  // `--illustration-rim-width-hairline` on the connector or elbow itself. 0.8px is a rim on a
  // 32px part; on a 240px drawing whose subject IS the wiring it reads as a half-lit thread.
  // The NODES keep the foundation weight — the variable is declared on the lines, not on the
  // scene, so a joint stays a hairline joint.
  //
  // ── HIERARCHY ──
  //
  // Two quiet levels and one lit: the frameworks REST and so does the WIRING — both
  // `:active="false"`, in `--border-default`. The site is the only lit surface, so the eye
  // lands on the outcome instead of being pulled along an orange bus. Everything inherits
  // `active` from the root, so every resting part says so explicitly.
  //
  // MONO marks, never brand palettes: three framework colours next to Azion's orange turn the
  // scene into a sticker sheet, and the marks here are parts of a drawing.
  import Illustration from '@aziontech/webkit/illustration'
  import IllustrationBox from '@aziontech/webkit/illustration-box'
  import IllustrationConnector from '@aziontech/webkit/illustration-connector'
  import IllustrationElbow from '@aziontech/webkit/illustration-elbow'
  import IllustrationNode from '@aziontech/webkit/illustration-node'
  import IllustrationWindow from '@aziontech/webkit/illustration-window'

  import { centreY, SCENE_WIDTH, sceneCanvasStyle } from './scene-canvas'
  import { horizontalS } from './scene-curve'

  const BOX_SIZE = 32
  const WINDOW_SIZE = 64
  const STROKE = 4 // a connector's box across its axis; the painted line runs down its middle
  const NODE = 8

  // A column, not a grid: a fan-in needs every path to reach the junction without crossing
  // another box.
  const FRAMEWORKS = [
    { icon: 'ai ai-next', y: 16 },
    { icon: 'ai ai-react', y: 74 },
    { icon: 'ai ai-vue', y: 132 }
  ]

  const BOX_X = 16
  const WINDOW_X = SCENE_WIDTH - BOX_X - WINDOW_SIZE // 160
  const WINDOW_TOP = centreY(WINDOW_SIZE)

  // ── stroke geometry ──
  const strokeY = (y) => y + BOX_SIZE / 2 // a row's line, on its box's middle
  const PATH_FROM = BOX_X + BOX_SIZE // 48 — the box's edge, where a path starts
  const JUNCTION_X = 104 // where the outer two arrive on the middle row
  const MIDDLE_Y = strokeY(FRAMEWORKS[1].y)
  const MIDDLE_LENGTH = WINDOW_X - PATH_FROM

  // The outer two rows, each as an S onto the middle row. `flat()` because a path is two
  // arcs and the template only cares about the list of them.
  const CURVES = [FRAMEWORKS[0], FRAMEWORKS[2]]
    .map((framework) =>
      horizontalS({
        x0: PATH_FROM,
        y0: strokeY(framework.y),
        x1: JUNCTION_X,
        y1: MIDDLE_Y
      })
    )
    .flat()

  const nodeOffset = NODE / 2
  const crossOffset = STROKE / 2

  // Every line carries the heavier stroke.
  const LINE_CLASS = 'absolute [--illustration-rim-width-hairline:var(--border-2)]'
</script>

<template>
  <!-- The scene is `active`, so its SURFACES carry the brand rim; the wiring opts out. -->
  <Illustration active>
    <span
      class="relative block overflow-hidden"
      :style="sceneCanvasStyle"
    >
      <IllustrationBox
        v-for="framework in FRAMEWORKS"
        :key="framework.icon"
        size="small"
        :icon="framework.icon"
        :active="false"
        :style="{ left: `${BOX_X}px`, top: `${framework.y}px` }"
        class="absolute"
      />

      <!-- The middle row: straight through, and the line the other two arrive on. -->
      <IllustrationConnector
        :active="false"
        :class="LINE_CLASS"
        :style="{
          left: `${PATH_FROM}px`,
          top: `${MIDDLE_Y - crossOffset}px`,
          '--illustration-connector-length': `${MIDDLE_LENGTH}px`
        }"
      />

      <!-- The outer rows, each changing lane through an S: two arcs of opposite curvature,
           tangent where they meet, so the seam does not show. -->
      <IllustrationElbow
        v-for="(curve, index) in CURVES"
        :key="`curve-${index}`"
        :corner="curve.corner"
        :active="false"
        :class="LINE_CLASS"
        :style="curve.style"
      />

      <!-- One origin per framework, centred on the point where its path leaves the mark, in
           the part's DEFAULT variant (a foundation hairline in `--border-default`) with the
           system's `--shape-elements` corner. `z-1` so a marker always paints over the
           wiring: DOM order alone would bury it the moment a line is declared later. -->
      <IllustrationNode
        v-for="framework in FRAMEWORKS"
        :key="`node-${framework.icon}`"
        :active="false"
        class="absolute z-1 rounded-(--shape-elements)"
        :style="{
          left: `${PATH_FROM - nodeOffset}px`,
          top: `${strokeY(framework.y) - nodeOffset}px`
        }"
      />

      <IllustrationWindow
        kind="website"
        active
        class="absolute"
        :style="{ left: `${WINDOW_X}px`, top: `${WINDOW_TOP}px` }"
      />
    </span>
  </Illustration>
</template>

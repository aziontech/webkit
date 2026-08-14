<script setup>
  // DomainIllustration — a scene for "add a domain", composed from the webkit
  // Illustration parts rather than named from the registry.
  //
  // WHY IT IS COMPOSED HERE. The registry has no domain asset, and the closest one
  // (`path`) draws release branches: its pills say Main / Stage / Preview /
  // Production, so on a domain card it answered a question nobody asked, and its two
  // outer pills fall outside the 170×128 canvas and get clipped mid-word. The
  // Illustration compound exists for exactly this — the parts are the alphabet, an
  // asset is a word, and a word this product needs but the registry does not have
  // gets composed at the call site (the same thing `site/IllustrationScene.vue` does
  // for the marketing pages). If this scene proves useful to a second screen, it
  // graduates into `packages/webkit/.../illustration/assets/` with a registry entry.
  //
  // WHAT IT SAYS, left to right, which is also the order the reader's domain travels:
  //
  //   the NAME they type  →  the ZONE that answers for it  →  the SITE it reaches,
  //
  // with an HTTPS pill over the last seam, because "automatic HTTPS" is the half of
  // the card's promise that has nothing to do with DNS and would otherwise be a claim
  // with no picture.
  //
  // The lookup connector is `dashed` and `animated`: a name resolving is a lookup
  // travelling, and the marching dashes are the only motion in the scene. The parts inherit the
  // scene's own coordinate system — placements are the composition, not styling, the
  // same way an SVG places a path.
  import Illustration from '@aziontech/webkit/illustration'
  import IllustrationBox from '@aziontech/webkit/illustration-box'
  import IllustrationConnector from '@aziontech/webkit/illustration-connector'
  import IllustrationNode from '@aziontech/webkit/illustration-node'
  import IllustrationPill from '@aziontech/webkit/illustration-pill'
  import IllustrationWindow from '@aziontech/webkit/illustration-window'

  import { centreY, SCENE_WIDTH, sceneCanvasStyle } from './scene-canvas'

  const BOX_SIZE = 64
  const WINDOW_SIZE = 64
  const PILL_HEIGHT = 21
  const STROKE = 4

  // ── ROOM TO BREATHE ──
  //
  // Composed here rather than named from the registry, so it is not bound to the DS's
  // 170×128 canvas — it sits on the app's 240×180 one (`scene-canvas.js`) and spends the
  // extra room on the gaps. Horizontally: 20 + 64 zone + 72 line + 64 site + 20 = 240, both
  // margins equal. Vertically the zone/site row is centred (58..122), the name sits 17px
  // above it and the badge 16px below, which leaves 20px of air top and bottom.  //
  // WEIGHT. The stroke is raised to `--border-2` (2px) per CONNECTOR, by redeclaring the DS's
  // own `--illustration-rim-width-hairline` on the connector itself. 0.8px is a rim on a 32px
  // part; on a 240px drawing whose subject IS the wiring it reads as a half-lit thread. The
  // NODES keep the foundation weight — the variable is declared on the lines, not on the
  // scene, so a joint stays a hairline joint. Bracket form because the paren shorthand cannot
  // DECLARE a custom property.
  const ROW_TOP = centreY(BOX_SIZE)
  const BOX_X = 20
  const WINDOW_X = SCENE_WIDTH - BOX_X - WINDOW_SIZE // 156
  const LINE_FROM = BOX_X + BOX_SIZE
  const LINE_LENGTH = WINDOW_X - LINE_FROM
  const ROW_MIDDLE = ROW_TOP + BOX_SIZE / 2

  // The name, over the zone: the drop runs from the pill's bottom to the zone's top edge,
  // on the zone's own centre line.
  const NAME_TOP = 20
  const DROP_LEFT = BOX_X + BOX_SIZE / 2 - STROKE / 2
  const DROP_FROM = NAME_TOP + PILL_HEIGHT
  const DROP_LENGTH = ROW_TOP - DROP_FROM

  // The origin marker, centred on the point where the lookup leaves the name — the same
  // rule the other two scenes use (`FrameworkIllustration`, `AgentIllustration`), so a node
  // in its default variant means "a path begins here" in all three. Centred on the
  // point rather than flush under the pill: a pill's rect is taller than its drawn
  // capsule, so "flush" would read as floating.
  const NODE = 8
  const NODE_LEFT = DROP_LEFT + STROKE / 2 - NODE / 2
  const NODE_TOP = DROP_FROM - NODE / 2

  // The badge, centred under the seam between the zone and the site.
  const BADGE_WIDTH = 65
  const BADGE_LEFT = Math.round(LINE_FROM + LINE_LENGTH / 2 - BADGE_WIDTH / 2)
  const BADGE_TOP = ROW_TOP + BOX_SIZE + 16
</script>

<template>
  <!-- `active` on the scene, so the SURFACES (the name, the zone, the site, the badge)
       carry the brand rim and read as the thing being set up. The WIRING opts out
       (`:active="false"` on both connectors and the node): a hairline in
       `--border-default` is enough to say a path exists, and an orange line between two
       orange boxes leaves nothing for the eye to land on. -->
  <Illustration active>
    <span
      class="relative block overflow-hidden"
      :style="sceneCanvasStyle"
    >
      <!-- The name the reader types. -->
      <IllustrationPill
        size="small"
        label="yourdomain.com"
        class="absolute"
        :style="{ left: `${BOX_X}px`, top: `${NAME_TOP}px` }"
      />

      <!-- The lookup travelling down into the zone: dashed and marching, the only motion
           in the scene. Vertical rather than an elbow — the name sits directly over the
           zone, so a bend would draw a corner that is not there. -->
      <IllustrationConnector
        :active="false"
        kind="dashed"
        orientation="vertical"
        animated
        class="absolute [--illustration-rim-width-hairline:var(--border-2)]"
        :style="{
          left: `${DROP_LEFT}px`,
          top: `${DROP_FROM}px`,
          '--illustration-connector-length': `${DROP_LENGTH}px`
        }"
      />

      <!-- Where the lookup leaves the name. `z-1` so the marker paints over the line. -->
      <IllustrationNode
        class="absolute z-1 rounded-[var(--shape-elements)]"
        :active="false"
        :style="{ left: `${NODE_LEFT}px`, top: `${NODE_TOP}px` }"
      />

      <!-- The zone that answers for the name. -->
      <IllustrationBox
        size="medium"
        icon="ai ai-edge-dns"
        class="absolute"
        :style="{ left: `${BOX_X}px`, top: `${ROW_TOP}px` }"
      />

      <!-- Edge to edge, so both ends land on a solid surface and neither shows a notch. -->
      <IllustrationConnector
        :active="false"
        class="absolute [--illustration-rim-width-hairline:var(--border-2)]"
        :style="{
          left: `${LINE_FROM}px`,
          top: `${ROW_MIDDLE - STROKE / 2}px`,
          '--illustration-connector-length': `${LINE_LENGTH}px`
        }"
      />

      <!-- What the name reaches. -->
      <IllustrationWindow
        kind="website"
        size="small"
        class="absolute"
        :style="{ left: `${WINDOW_X}px`, top: `${ROW_TOP}px` }"
      />

      <!-- The other half of the promise, centred under the seam between the zone and the
           site, so it reads as something the connection carries rather than as a feature
           of either end. -->
      <IllustrationPill
        size="small"
        icon="pi pi-lock"
        label="HTTPS"
        class="absolute"
        :style="{ left: `${BADGE_LEFT}px`, top: `${BADGE_TOP}px` }"
      />
    </span>
  </Illustration>
</template>

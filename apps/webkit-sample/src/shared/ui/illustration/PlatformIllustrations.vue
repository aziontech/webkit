<script setup>
  // "From origin to destination" — six platform scenes retelling Build, Store, Protect, Observe and
  // the release path, each composed from the webkit Illustration parts.
  //
  // This file used to carry its own illustration engine: ~200 lines of inline SVG, hand-rolled
  // chips and nodes, and raw `--color-<hue>-500` palette tokens picked per scene. All of that
  // now comes from `@aziontech/webkit/illustration`, so the scenes speak the same visual language
  // as every other illustration in the system and follow light and dark for free. The per-scene
  // hues are gone on purpose: the language has exactly three line roles — resting, active
  // (brand), and accent — and a scene says what it means by which parts it lights, not by
  // inventing a colour.
  //
  // Coordinates are percentages so the parts stay pinned to their connector paths regardless of
  // the panel's aspect ratio.
  import FrameBox from '@aziontech/webkit/frame-box'

  import { CardGrid, SectionContainer, SectionModule } from '../layout/index.js'
  import DeployExample from './DeployExample.vue'
  import IllustrationScene from './IllustrationScene.vue'

  defineProps({
    // When false, render only the bordered grid — no section max-width / padding
    // or heading — so a host page can supply its own frame (e.g. the Hub's
    // PageContainer + PageHeader). Framed (default) renders the standalone
    // home-page section with its own overline + heading.
    framed: { type: Boolean, default: true },
    // Keep only the closing pair — the drawn Deploy scene beside the deploy actually
    // running — and drop the catalogue of six scenes with its heading. The home page
    // wants the proof; the Hub, which documents the visual language itself, wants all
    // six, so the scenes stay in this file rather than being deleted from it.
    deployOnly: { type: Boolean, default: false }
  })

  // The trunk every scene routes along. Scene geometry itself lives in
  // IllustrationScene; this is only here because the scene data below quotes it.
  const TRUNK_Y = 55

  const scenes = [
    {
      key: 'version',
      title: 'Version',
      icon: 'ai ai-deploy-pillar',
      nodes: [18, 26, 42, 60, 78],
      branches: [
        { left: 30, top: 33, width: 20, direction: 'up' },
        { left: 44, top: 20, width: 24, direction: 'up' },
        { left: 22, top: 55, width: 22, direction: 'down', to: 80 }
      ],
      pills: [
        { label: 'main', left: 8, top: TRUNK_Y, active: true },
        { label: 'feat/edge', left: 52, top: 33 },
        { label: 'v2.4.0', left: 70, top: 20 },
        { label: 'hotfix', left: 33, top: 80 }
      ],
      lead: 'Faster to ship.',
      body: 'From code to a live API in minutes. Test safely, promote when you choose, and roll back if you need to.'
    },
    {
      key: 'deploy',
      title: 'Deploy',
      icon: 'ai ai-build-pillar',
      nodes: [16, 40, 64],
      branches: [{ left: 42, top: 33, width: 22, direction: 'up' }],
      pills: [
        { label: 'build', left: 14, top: TRUNK_Y },
        { label: 'deploy', left: 42, top: TRUNK_Y },
        { label: 'live', left: 84, top: TRUNK_Y, active: true },
        { label: 'preview', left: 70, top: 33 }
      ],
      lead: 'Publish once.',
      body: 'A single deploy propagates the build across the whole global edge, with no cold starts and no waiting.'
    },
    {
      key: 'network',
      title: 'Network',
      icon: 'ai ai-edge-nodes',
      nodes: [12, 22],
      branches: [
        { left: 42, top: 26, width: 22, direction: 'up' },
        { left: 40, top: 40, width: 20, direction: 'up' },
        { left: 40, top: 55, width: 20, direction: 'down', to: 69 },
        { left: 42, top: 55, width: 22, direction: 'down', to: 83 }
      ],
      pills: [
        { label: 'anycast', left: 30, top: TRUNK_Y, active: true },
        { label: 'gru', left: 80, top: 26 },
        { label: 'iad', left: 76, top: 40 },
        { label: 'fra', left: 76, top: 69 },
        { label: 'gig', left: 80, top: 83 }
      ],
      lead: 'Always at the nearest point.',
      body: 'Anycast routing delivers every request to the lowest-latency PoP, across the whole distributed network.'
    },
    {
      key: 'ai',
      title: 'AI',
      icon: 'ai ai-ask-azion',
      nodes: [12, 20],
      branches: [
        { left: 40, top: 33, width: 22, direction: 'up' },
        { left: 46, top: 20, width: 24, direction: 'up' },
        { left: 40, top: 55, width: 22, direction: 'down', to: 80 }
      ],
      pills: [
        { label: 'model', left: 28, top: TRUNK_Y, active: true },
        { label: 'embed', left: 66, top: 33 },
        { label: 'rag', left: 74, top: 20 },
        { label: 'agent', left: 66, top: 80 }
      ],
      lead: 'AI on the same platform.',
      body: 'Inference, embeddings, and agents running at the edge, close to the user and to your data.'
    },
    {
      key: 'secure',
      title: 'Secure',
      icon: 'ai ai-waf-rules',
      nodes: [14, 26, 55],
      // Threats leave the trunk and stop at a label; the trunk itself carries straight on.
      branches: [
        { left: 55, top: 33, width: 12, direction: 'up', kind: 'dashed' },
        { left: 57, top: 20, width: 14, direction: 'up', kind: 'dashed' },
        { left: 55, top: 55, width: 12, direction: 'down', to: 80, kind: 'dashed' }
      ],
      pills: [
        { label: 'app 200', left: 82, top: TRUNK_Y, active: true },
        { label: 'SQLi', left: 70, top: 33 },
        { label: 'DDoS', left: 78, top: 20 },
        { label: 'bot', left: 70, top: 80 }
      ],
      lead: 'Protected by default.',
      body: 'WAF, DDoS mitigation, and bot protection applied ahead of your origin, so only clean traffic gets through.'
    },
    {
      key: 'observe',
      title: 'Observe',
      icon: 'ai ai-real-time-metrics',
      // The one scene whose trunk is a series rather than a line.
      chart: { data: [40, 46, 38, 54, 44, 60, 48, 62], highlight: -1 },
      nodes: [],
      branches: [
        { left: 28, top: 26, width: 22, direction: 'up' },
        { left: 42, top: 33, width: 24, direction: 'up' },
        { left: 24, top: 55, width: 22, direction: 'down', to: 80 }
      ],
      pills: [
        { label: 'p99 · 24ms', left: 84, top: 46, active: true },
        { label: 'events', left: 52, top: 26 },
        { label: 'logs', left: 68, top: 33 },
        { label: 'errors', left: 33, top: 80 }
      ],
      lead: 'Visible from day one.',
      body: 'Metrics, events, and logs in real time. Every request is recorded and every decision is traceable.'
    }
  ]

  // The Deploy scene leaves the main grid to close the bento beside the live deploy
  // log — drawn deploy next to running deploy, 50/50. That leaves five scenes above,
  // so `observe` (a chart, which reads better wide anyway) spans two columns and both
  // rows stay full.
  const deployScene = scenes.find((scene) => scene.key === 'deploy')
  const gridScenes = scenes.filter((scene) => scene.key !== 'deploy')
</script>

<template>
  <component :is="framed ? SectionContainer : 'div'">
    <SectionModule
      :divided="framed && !deployOnly"
      :padded="false"
      :title="framed && !deployOnly ? 'From origin to destination, in one visual language' : ''"
      :description="
        framed && !deployOnly
          ? 'Six scenes of the platform, all drawn from the same pieces: rule, trunk, branch, node, and label.'
          : ''
      "
    >
      <!-- The band is a registration frame like every other brick in the column, so the
           scenes sit inside one marked box instead of floating between their neighbours.
           `borders="y"` hands the vertical rules back to the column, `flush` leaves the
           rule above to whatever draws it — the SectionGap when this is a brick of a page,
           the module's own header row when it stands alone — and `marks="bottom"` ticks
           the one junction nothing else draws. -->
      <FrameBox
        flush
        borders="y"
        marks="bottom"
      >
        <!-- Two divider grids stacked in one hairline column: `gap-px` over the border
             colour makes the seam between them read as the same 1px rule the grids draw
             internally. Grid one is the scenes (3 columns, `observe` spanning two so the
             rows stay full); grid two is the closing 50/50 pair. -->
        <div class="flex flex-col gap-px bg-[var(--border-muted)]">
          <CardGrid
            v-if="!deployOnly"
            variant="divider"
            divider-color="muted"
            :columns="3"
          >
            <IllustrationScene
              v-for="scene in gridScenes"
              :key="scene.key"
              :scene="scene"
              :class="{ 'lg:col-span-2': scene.key === 'observe' }"
            />
          </CardGrid>

          <!-- The bento's closing row: the Deploy scene as drawn, beside the same deploy
             actually running. Two 1:1 cells, 50/50. -->
          <CardGrid
            variant="divider"
            divider-color="muted"
            :columns="2"
          >
            <!-- No caption on the drawn scene: the live cell next to it already says what
               a deploy does, and two captions under one pair read as the same sentence
               twice. The drawing carries the label pills; the words stay on the right. -->
            <IllustrationScene
              :scene="deployScene"
              :captioned="false"
            />
            <DeployExample />
          </CardGrid>
        </div>
      </FrameBox>
    </SectionModule>
  </component>
</template>

<script setup>
  // "From origin to destination" — six platform scenes retelling Build, Store, Protect, Observe
  // and the release path, each an official scene from the webkit illustration library.
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
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionContainer from '@aziontech/webkit/section-container'
  import SectionModule from '@aziontech/webkit/section-module'

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


  const scenes = [
    {
      key: 'version',
      illustration: 'infrastructure-as-code',
      title: 'Version',
      icon: 'ai ai-deploy-pillar',
      lead: 'Faster to ship.',
      body: 'From code to a live API in minutes. Test safely, promote when you choose, and roll back if you need to.'
    },
    {
      key: 'deploy',
      illustration: 'quick-start-with-templates',
      title: 'Deploy',
      icon: 'ai ai-build-pillar',
      lead: 'Publish once.',
      body: 'A single deploy propagates the build across the whole global edge, with no cold starts and no waiting.'
    },
    {
      key: 'network',
      illustration: 'distributed-apis',
      title: 'Network',
      icon: 'ai ai-edge-nodes',
      lead: 'Always at the nearest point.',
      body: 'Anycast routing delivers every request to the lowest-latency PoP, across the whole distributed network.'
    },
    {
      key: 'ai',
      illustration: 'ai-applications',
      title: 'AI',
      icon: 'ai ai-ask-azion',
      lead: 'AI on the same platform.',
      body: 'Inference, embeddings, and agents running at the edge, close to the user and to your data.'
    },
    {
      key: 'secure',
      illustration: 'programmable-security',
      title: 'Secure',
      icon: 'ai ai-waf-rules',
      lead: 'Protected by default.',
      body: 'WAF, DDoS mitigation, and bot protection applied ahead of your origin, so only clean traffic gets through.'
    },
    {
      key: 'observe',
      illustration: 'live-debugging',
      title: 'Observe',
      icon: 'ai ai-real-time-metrics',
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
        <div class="flex flex-col gap-px bg-(--border-muted)">
          <CardGrid
            v-if="!deployOnly"
            kind="divider"
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
            kind="divider"
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

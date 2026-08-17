<script setup>
  // One cell of the illustrations bento: a scene drawn entirely from the webkit
  // Illustration parts — ruled guides, a trunk (or a chart), branches, nodes, labels.
  //
  // It lives in its own component because the bento renders it from two places: the
  // main grid loops the scenes, and the closing 50/50 row places the Deploy scene
  // beside the live deploy log. One definition, so the two can never drift.
  //
  // Coordinates are percentages so the parts stay pinned to their connector paths
  // regardless of the cell's aspect ratio.
  import Illustration from '@aziontech/webkit/illustration'
  import IllustrationBranch from '@aziontech/webkit/illustration-branch'
  import IllustrationChart from '@aziontech/webkit/illustration-chart'
  import IllustrationConnector from '@aziontech/webkit/illustration-connector'
  import IllustrationNode from '@aziontech/webkit/illustration-node'
  import IllustrationPill from '@aziontech/webkit/illustration-pill'

  defineProps({
    // { key, title, icon, nodes, branches, pills, chart?, lead, body }
    scene: {
      type: Object,
      required: true
    },
    // Render the lead + body caption under the visual. Off for a scene whose caption
    // would repeat what the cell beside it already says.
    captioned: {
      type: Boolean,
      default: true
    }
  })

  // The ruled guide lines every panel shares, as a percentage of the panel height.
  const GUIDES = [12, 26, 40, 55, 69, 83]

  // The trunk every scene routes along.
  const TRUNK_Y = 55

  // A branch spans from its own top down/up to the trunk, so its height closes that gap.
  const branchBox = (branch) => ({
    left: `${branch.left}%`,
    top: `${Math.min(branch.top, branch.to ?? TRUNK_Y)}%`,
    width: `${branch.width}%`,
    height: `${Math.abs((branch.to ?? TRUNK_Y) - branch.top)}%`
  })
</script>

<template>
  <!-- `bg-(--bg-canvas)` is required of every divider-grid child: the grid's 1px
       gaps ARE its rules, and a cell that does not fill its own background lets the
       wrapper's border colour flood it. -->
  <article
    class="flex flex-col gap-(--spacing-lg) bg-(--bg-canvas) p-(--spacing-lg)"
  >
    <header
      class="flex items-center gap-(--spacing-xs) text-label-code-md text-(--text-muted)"
    >
      <i
        :class="scene.icon"
        class="leading-none text-(--primary)"
        aria-hidden="true"
      />
      {{ scene.title }}
    </header>

    <!-- ── Visual — every mark below is an Illustration part ──────────── -->
    <!-- `my-auto` only when there is no caption: the header stays on the top edge and
         the drawing centres in whatever height the cell beside it forces (the live
         deploy log is far taller than a 12rem visual). With a caption the three blocks
         stack from the top as usual. -->
    <Illustration
      :aria-label="`${scene.title}: ${scene.lead}`"
      class="relative h-48 w-full"
      :class="captioned ? '' : 'my-auto'"
    >
      <IllustrationConnector
        v-for="guide in GUIDES"
        :key="`rule-${guide}`"
        class="absolute left-0 w-full"
        :style="{ top: `${guide}%`, '--illustration-connector-length': '100%' }"
      />

      <IllustrationChart
        v-if="scene.chart"
        :data="scene.chart.data"
        :highlight="scene.chart.highlight"
        class="absolute inset-x-0 top-[28%] h-[46%]"
      />
      <IllustrationConnector
        v-else
        active
        class="absolute left-0 w-full"
        :style="{ top: `${TRUNK_Y}%`, '--illustration-connector-length': '100%' }"
      />

      <IllustrationBranch
        v-for="(branch, i) in scene.branches"
        :key="`branch-${i}`"
        :direction="branch.direction"
        :kind="branch.kind || 'solid'"
        class="absolute"
        :style="branchBox(branch)"
      />

      <IllustrationNode
        v-for="(x, i) in scene.nodes"
        :key="`node-${i}`"
        active
        class="absolute -translate-x-1/2 -translate-y-1/2"
        :style="{ left: `${x}%`, top: `${TRUNK_Y}%` }"
      />

      <IllustrationPill
        v-for="pill in scene.pills"
        :key="pill.label"
        size="small"
        :label="pill.label"
        :active="pill.active"
        class="absolute -translate-x-1/2 -translate-y-1/2"
        :style="{ left: `${pill.left}%`, top: `${pill.top}%` }"
      />
    </Illustration>

    <!-- ── Caption ────────────────────────────────────────────────── -->
    <p
      v-if="captioned"
      class="text-pretty text-body-sm text-(--text-muted)"
    >
      <span class="font-medium text-(--text-default)">{{ scene.lead }}</span>
      {{ ' ' }}{{ scene.body }}
    </p>
  </article>
</template>

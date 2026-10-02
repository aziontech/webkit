<script setup>
  import azionHighlight from '@aziontech/webkit/assets/azion-highlight.svg'
  import branches from '@aziontech/webkit/assets/branches.svg'
  import personalTokens from '@aziontech/webkit/assets/personal-tokens.svg'
  import usageChart from '@aziontech/webkit/assets/usage-chart.svg'
  import CardGrid from '@aziontech/webkit/card-grid'
  import FrameBox from '@aziontech/webkit/frame-box'
  import MediaTile from '@aziontech/webkit/media-tile'
  import SectionGap from '@aziontech/webkit/section-gap'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'

  import SolutionsStack from './SolutionsStack.vue'

  const REASONS = [
    {
      key: 'publish',
      src: branches,
      title: 'Faster to publish.',
      description:
        'Go from commit to a live URL in minutes. Test on a preview, promote when you are ready, and roll back without a rebuild.'
    },
    {
      key: 'secure',
      src: personalTokens,
      title: 'Secure by default.',
      description:
        'Every endpoint carries its own keys, rate limits and instant revocation, managed from a single console.'
    },
    {
      key: 'operate',
      src: azionHighlight,
      title: 'Simpler to operate.',
      description:
        'Deploys, gateways and observability sit on one platform, so there is no second console to reconcile when something breaks.'
    },
    {
      key: 'accelerate',
      src: usageChart,
      title: 'Faster applications.',
      description:
        'Caching and image processing run at the edge, so every response is served from the location closest to the request.'
    }
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        eyebrow="Why Azion"
        title="From commit to observability, on one platform"
        description="Build, ship and run an application on the same platform that serves it — one place to deploy from, one place to watch it from."
      />
    </template>

    <FrameBox
      flush
      borders="y"
      marks="all"
    >
      <CardGrid
        flush
        kind="frame"
        :columns="4"
      >
        <CardGrid.Cell
          v-for="reason in REASONS"
          :key="reason.key"
          kind="canvas"
          :padded="false"
        >
          <MediaTile
            kind="plain"
            :src="reason.src"
            :title="reason.title"
            :description="reason.description"
          />
        </CardGrid.Cell>
      </CardGrid>
    </FrameBox>

    <SectionGap hatch />

    <SolutionsStack sticky />
  </SectionModule>
</template>

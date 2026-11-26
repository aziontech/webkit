<script setup>
  import BentoGridCell from '@aziontech/ui/bento-grid-cell'
  import BentoGridRoot from '@aziontech/ui/bento-grid-root'

  const TILE_CLASS =
    'flex h-full flex-col justify-between gap-(--spacing-lg) bg-(--bg-contrast) p-(--spacing-xl) text-(--bg-canvas)'
</script>

<template>
  <BentoGridRoot
    columns="4"
    aria-label="The platform, in one block"
  >
    <BentoGridCell
      span="2"
      rows="2"
    >
      <div class="flex h-full flex-col justify-between gap-(--spacing-xl)">
        <h3 class="m-0 text-heading-md text-(--text-default)">Everything runs at the edge</h3>
        <p class="m-0 text-body-md text-(--text-muted)">
          Every request is served from the location closest to the user, so there is no origin round
          trip to plan around and no region to choose.
        </p>
      </div>
    </BentoGridCell>
    <BentoGridCell variant="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Deploy in seconds</h3>
    </BentoGridCell>
    <BentoGridCell variant="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">No capacity planning</h3>
    </BentoGridCell>
    <BentoGridCell variant="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Observe every request</h3>
    </BentoGridCell>
    <BentoGridCell
      rows="2"
      variant="none"
      :padded="false"
      href="#pricing"
    >
      <div :class="TILE_CLASS">
        <span class="text-heading-xs">Pay for what you use</span>
        <span class="text-body-sm"
          >Usage-based pricing with no minimum commitment. See the plans.</span
        >
      </div>
    </BentoGridCell>
    <BentoGridCell variant="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">One console</h3>
    </BentoGridCell>
    <BentoGridCell variant="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Logs in real time</h3>
    </BentoGridCell>
    <BentoGridCell variant="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Rollback in one click</h3>
    </BentoGridCell>
  </BentoGridRoot>
</template>

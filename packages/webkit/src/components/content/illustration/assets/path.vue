<script setup lang="ts">
  // Path: a deployment trunk with tributaries. `main` runs straight through in the brand color;
  // `stage` and `preview` branch up off it; `production` branches down in the accent, because it
  // is the one destination that is somewhere else entirely.
  //
  // Composed from parts only, on the shared illustration canvas. Part coordinates are the
  // composition, not styling — they place parts inside the frame the way an SVG places a path.
  import IllustrationBranch from '../illustration-branch/illustration-branch.vue'
  import IllustrationConnector from '../illustration-connector/illustration-connector.vue'
  import IllustrationPill from '../illustration-pill/illustration-pill.vue'

  defineOptions({
    name: 'IllustrationPath',
    inheritAttrs: false
  })

  // Faint rules the scene is ruled against, evenly spaced across the canvas.
  const GUIDES = [9, 36, 63, 90, 117]
</script>

<template>
  <span
    v-bind="$attrs"
    class="relative block h-[var(--illustration-canvas-height)] w-[var(--illustration-canvas-width)] overflow-hidden"
  >
    <IllustrationConnector
      v-for="guide in GUIDES"
      :key="guide"
      class="absolute left-[-2px] w-[169px]"
      :style="{ top: `${guide - 2}px`, '--illustration-connector-length': '169px' }"
    />

    <IllustrationConnector
      active
      class="absolute left-[11px] top-[62px]"
      :style="{ '--illustration-connector-length': '159px' }"
    />

    <IllustrationBranch
      direction="up"
      class="absolute left-[55px] top-[37px] h-[27px] w-[21px]"
    />
    <IllustrationBranch
      direction="up"
      class="absolute left-[107px] top-[20px] h-[44px] w-[31px]"
    />
    <IllustrationBranch
      direction="down"
      accent
      class="absolute left-[51px] top-[64px] h-[53px] w-[49px]"
    />

    <IllustrationPill
      size="small"
      label="Main"
      class="absolute left-0 top-[53px]"
    />
    <IllustrationPill
      size="small"
      label="Stage"
      class="absolute left-[68px] top-[25px]"
    />
    <IllustrationPill
      size="small"
      label="Preview"
      class="absolute left-[116px] top-0"
    />
    <IllustrationPill
      size="small"
      label="Production"
      class="absolute left-[100px] top-[106px]"
    />
  </span>
</template>

<script setup>
  import BentoGridRoot from '@aziontech/webkit/bento-grid-root'
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
</script>

<template>
  <BentoGridRoot
    columns="4"
    mobile-columns="2"
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
          trip to plan around and no region to choose. The cell claims two columns and two rows,
          which is what makes it the block's subject.
        </p>
      </div>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Deploy in seconds</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">No capacity planning</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Observe every request</h3>
    </BentoGridCell>
    <BentoGridCell
      rows="2"
      kind="none"
      :padded="false"
    >
      <a
        href="#pricing"
        class="flex h-full flex-col justify-between gap-(--spacing-lg) bg-(--bg-contrast) p-(--spacing-xl) text-(--bg-canvas) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color)"
      >
        <span class="text-heading-xs">Pay for what you use</span>
        <span class="text-body-sm"
          >An unpadded cell with no fill of its own: the link inside it paints the whole tile and
          carries its own padding, so the target is the cell.</span
        >
      </a>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">One console</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Logs in real time</h3>
    </BentoGridCell>
    <BentoGridCell kind="canvas">
      <h3 class="m-0 text-heading-xs text-(--text-default)">Rollback in one click</h3>
    </BentoGridCell>
  </BentoGridRoot>
</template>

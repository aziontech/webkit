<script setup>
  import BentoGridCell from '@aziontech/webkit/bento-grid-cell'
  import BentoGrid from '@aziontech/webkit/bento-grid-root'
</script>

<template>
  <BentoGrid aria-label="Platform capabilities">
    <BentoGridCell span="full">
      <h3 class="m-0 text-heading-sm text-(--text-default)">Everything runs at the edge</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Every request is served from the location closest to the user, so there is no origin round
        trip to plan around and no region to choose.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Deploy in seconds</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Push to a repository and the application is live, with no pipeline to assemble first.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Scale without capacity planning</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Traffic is absorbed where it arrives, so there is nothing to provision ahead of a launch.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Observe every request</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Events and metrics land in the same console that runs the application.
      </p>
    </BentoGridCell>
    <BentoGridCell>
      <h3 class="m-0 text-heading-sm text-(--text-default)">Pay for what you use</h3>
      <p class="m-0 mt-(--spacing-sm) text-body-sm text-(--text-muted)">
        Billing follows requests and compute time, so an idle application costs nothing.
      </p>
    </BentoGridCell>
  </BentoGrid>
</template>

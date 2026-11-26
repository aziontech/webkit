<script setup>
  import CardGridCell from '@aziontech/ui/card-grid-cell'
  import CardGridRoot from '@aziontech/ui/card-grid-root'
</script>

<template>
  <CardGridRoot :columns="3">
    <CardGridCell>
      <h3 class="m-0 text-heading-xs text-(--text-default)">Deploy from Git</h3>
      <p class="mt-(--spacing-xs) mb-0 text-body-md text-(--text-muted)">
        Every branch gets its own preview URL.
      </p>
    </CardGridCell>
    <CardGridCell>
      <h3 class="m-0 text-heading-xs text-(--text-default)">Cache at the edge</h3>
      <p class="mt-(--spacing-xs) mb-0 text-body-md text-(--text-muted)">
        Static assets are served from the location closest to each user.
      </p>
    </CardGridCell>
    <CardGridCell>
      <h3 class="m-0 text-heading-xs text-(--text-default)">Stop bad bots</h3>
      <p class="mt-(--spacing-xs) mb-0 text-body-md text-(--text-muted)">
        Automated traffic is blocked before it reaches your code.
      </p>
    </CardGridCell>
  </CardGridRoot>
</template>

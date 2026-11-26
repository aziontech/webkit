<script setup>
  import Card from '@aziontech/webkit/card'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Card class="w-full max-w-[512px]">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-label-md text-(--text-default)">Staging</h2>
        <IconButton
          icon="az az-chevron-right"
          aria-label="Open staging"
          variant="outline"
          size="small"
        />
      </div>
    </template>
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        Deploys every push to the main branch. Last deployed yesterday.
      </p>
    </template>
  </Card>
</template>

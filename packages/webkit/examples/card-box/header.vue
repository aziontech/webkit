<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <CardBox class="w-full max-w-[512px]">
    <template #header>
      <div class="flex items-center justify-between w-full">
        <h2 class="text-label-md text-(--text-default)">Card Title</h2>
        <IconButton
          icon="pi pi-chevron-right"
          aria-label="Expand"
          kind="outlined"
          size="small"
        />
      </div>
    </template>
    <template #content>
      <p class="text-body-sm text-(--text-muted)">
        An action rendered in the header slot stays visible, aligned to the end of the header.
      </p>
    </template>
  </CardBox>
</template>

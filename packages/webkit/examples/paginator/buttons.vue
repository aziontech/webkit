<script setup>
  import Paginator from '@aziontech/webkit/paginator'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Paginator aria-label="Pagination kinds">
      <Paginator.Button
        kind="previous"
        aria-label="Previous page"
      />
      <Paginator.Button kind="number">1</Paginator.Button>
      <Paginator.Button
        kind="number"
        selected
        >2</Paginator.Button
      >
      <Paginator.Button kind="more" />
      <Paginator.Button
        kind="next"
        aria-label="Next page"
      />
    </Paginator>
    <Paginator aria-label="Pagination disabled states">
      <Paginator.Button
        kind="previous"
        aria-label="Previous page"
        disabled
      />
      <Paginator.Button
        kind="number"
        disabled
        >1</Paginator.Button
      >
      <Paginator.Button
        kind="next"
        aria-label="Next page"
        disabled
      />
    </Paginator>
  </div>
</template>

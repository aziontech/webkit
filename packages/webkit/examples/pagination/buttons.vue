<script setup>
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Pagination aria-label="Pagination kinds">
      <Pagination.Button
        kind="previous"
        aria-label="Previous page"
      />
      <Pagination.Button kind="number">1</Pagination.Button>
      <Pagination.Button
        kind="number"
        selected
        >2</Pagination.Button
      >
      <Pagination.Button kind="more" />
      <Pagination.Button
        kind="next"
        aria-label="Next page"
      />
    </Pagination>
    <Pagination aria-label="Pagination disabled states">
      <Pagination.Button
        kind="previous"
        aria-label="Previous page"
        disabled
      />
      <Pagination.Button
        kind="number"
        disabled
        >1</Pagination.Button
      >
      <Pagination.Button
        kind="next"
        aria-label="Next page"
        disabled
      />
    </Pagination>
  </div>
</template>

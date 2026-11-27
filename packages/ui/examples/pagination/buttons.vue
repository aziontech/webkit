<script setup>
  import Pagination from '@aziontech/ui/pagination'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <Pagination aria-label="Pagination kinds">
      <Pagination.Button
        type="previous"
        aria-label="Previous page"
      />
      <Pagination.Button type="number">1</Pagination.Button>
      <Pagination.Button
        type="number"
        active
        >2</Pagination.Button
      >
      <Pagination.Button type="more" />
      <Pagination.Button
        type="next"
        aria-label="Next page"
      />
    </Pagination>
    <Pagination aria-label="Pagination disabled states">
      <Pagination.Button
        type="previous"
        aria-label="Previous page"
        disabled
      />
      <Pagination.Button
        type="number"
        disabled
        >1</Pagination.Button
      >
      <Pagination.Button
        type="next"
        aria-label="Next page"
        disabled
      />
    </Pagination>
  </div>
</template>

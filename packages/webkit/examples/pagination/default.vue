<script setup>
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <Pagination>
    <template #info>
      <Pagination.Info>Showing 1 to 10 of 20 entries</Pagination.Info>
    </template>

    <Pagination.Button
      type="previous"
      aria-label="Previous page"
      disabled
    />
    <Pagination.Button
      type="number"
      active
      >1</Pagination.Button
    >
    <Pagination.Button type="number">2</Pagination.Button>
    <Pagination.Button type="number">3</Pagination.Button>
    <Pagination.Button type="more" />
    <Pagination.Button
      type="next"
      aria-label="Next page"
    />

    <template #controls>
      <Pagination.PageSize
        :model-value="10"
        :options="[10, 25, 50, 100]"
      />
    </template>
  </Pagination>
</template>

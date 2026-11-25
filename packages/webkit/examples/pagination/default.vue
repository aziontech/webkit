<script setup>
  import Pagination from '@aziontech/webkit/pagination'
</script>

<template>
  <Pagination>
    <template #info>
      <Pagination.Description>Showing 1 to 10 of 87 entries</Pagination.Description>
    </template>

    <Pagination.Button
      type="previous"
      aria-label="Previous page"
      disabled
    />
    <Pagination.Button
      type="number"
      active
      aria-label="Page 1"
      >1</Pagination.Button
    >
    <Pagination.Button
      type="number"
      aria-label="Page 2"
      >2</Pagination.Button
    >
    <Pagination.Button
      type="number"
      aria-label="Page 3"
      >3</Pagination.Button
    >
    <Pagination.Button type="more" />
    <Pagination.Button
      type="number"
      aria-label="Page 9"
      >9</Pagination.Button
    >
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

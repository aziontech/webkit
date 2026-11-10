<script setup>
  import Paginator from '@aziontech/webkit/paginator'
</script>

<template>
  <Paginator>
    <template #info>
      <Paginator.Info>Showing 1 to 10 of 20 entries</Paginator.Info>
    </template>

    <Paginator.Button
      kind="previous"
      aria-label="Previous page"
      disabled
    />
    <Paginator.Button
      kind="number"
      selected
      >1</Paginator.Button
    >
    <Paginator.Button kind="number">2</Paginator.Button>
    <Paginator.Button kind="number">3</Paginator.Button>
    <Paginator.Button kind="more" />
    <Paginator.Button
      kind="next"
      aria-label="Next page"
    />

    <template #controls>
      <Paginator.PageSize
        :model-value="10"
        :options="[10, 25, 50, 100]"
      />
    </template>
  </Paginator>
</template>

<script setup>
  import Cards from '@aziontech/webkit/cards'
  import Pagination from '@aziontech/webkit/pagination-root'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const edges = Array.from({ length: 14 }, (_, i) => ({
    id: `edge-${i + 1}`,
    name: `Edge node ${i + 1}`,
    region: ['sa-east', 'us-east', 'eu-west'][i % 3]
  }))

  const { cardsProps, paginationProps, selectedCount } = useCollection({
    items: edges,
    pagination: { pageSize: 6 },
    selection: { mode: 'multi' }
  })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <p
      class="text-body-sm text-(--text-muted)"
      role="status"
    >
      {{ selectedCount }} selected
    </p>
    <Cards v-bind="cardsProps">
      <template #header="{ item }">{{ item.name }}</template>
      <template #default="{ item }">
        <span class="text-(--text-muted)">{{ item.region }}</span>
      </template>
    </Cards>
    <Pagination v-bind="paginationProps" />
  </div>
</template>

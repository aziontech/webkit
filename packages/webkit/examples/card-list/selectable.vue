<script setup>
  import CardList from '@aziontech/webkit/card-list'
  import Pagination from '@aziontech/webkit/pagination-root'
  import { useCollection } from '@aziontech/webkit/use-collection'

  const edges = Array.from({ length: 14 }, (_, i) => ({
    id: `edge-${i + 1}`,
    name: `Edge node ${i + 1}`,
    region: ['sa-east', 'us-east', 'eu-west'][i % 3]
  }))

  const { cardListProps, paginationProps, selectedCount } = useCollection({
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
    <CardList v-bind="cardListProps">
      <template #header="{ item }">{{ item.name }}</template>
      <template #default="{ item }">
        <span class="text-(--text-muted)">{{ item.region }}</span>
      </template>
    </CardList>
    <Pagination v-bind="paginationProps" />
  </div>
</template>

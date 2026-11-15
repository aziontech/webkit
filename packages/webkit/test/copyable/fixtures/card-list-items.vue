<script setup lang="ts">
  import CardList, {
    type CardListItemSlotProps,
    type CardListSelectionMode
  } from '@aziontech/webkit/card-list'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  interface Domain {
    id: string
    name: string
    hits: number
  }

  const domains = ref<Domain[]>([{ id: 'd1', name: 'storefront', hits: 3 }])
  const mode: CardListSelectionMode = 'multiple'
  const selected = ref<string[]>([])
  const collection = useCollection<Domain>({ items: domains.value })
  const titleOf = (scope: CardListItemSlotProps<Domain>): string =>
    `${scope.index + 1}. ${scope.item.name}`
</script>

<template>
  <CardList
    v-model:selected-keys="selected"
    :items="domains"
    :selection-mode="mode"
  >
    <template #header="scope">{{ titleOf(scope) }}</template>
    <template #default="{ item, selected: isSelected }">
      <span :data-selected="isSelected">{{ item.hits.toFixed(0) }}</span>
      <span>
        <!-- @vue-expect-error a field the item does not have -->
        {{ item.missing }}
      </span>
    </template>
  </CardList>

  <CardList v-bind="collection.cardListProps.value">
    <template #header="{ item }">{{ item.name.toUpperCase() }}</template>
  </CardList>

  <CardList :items="[{ id: 'a', size: 2 }]">
    <template #default="{ item }">
      <!-- @vue-expect-error size is a number -->
      {{ item.size.toUpperCase() }}
    </template>
  </CardList>
</template>

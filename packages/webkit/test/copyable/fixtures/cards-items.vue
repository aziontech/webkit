<script setup lang="ts">
  import Cards, { type CardsItemSlotProps, type CardsSelectionMode } from '@aziontech/webkit/cards'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { ref } from 'vue'

  interface Domain {
    id: string
    name: string
    hits: number
  }

  const domains = ref<Domain[]>([{ id: 'd1', name: 'storefront', hits: 3 }])
  const mode: CardsSelectionMode = 'multi'
  const selected = ref<string[]>([])
  const collection = useCollection<Domain>({ items: domains.value })
  const titleOf = (scope: CardsItemSlotProps<Domain>): string =>
    `${scope.index + 1}. ${scope.item.name}`
</script>

<template>
  <Cards
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
  </Cards>

  <Cards v-bind="collection.cardsProps.value">
    <template #header="{ item }">{{ item.name.toUpperCase() }}</template>
  </Cards>

  <Cards :items="[{ id: 'a', size: 2 }]">
    <template #default="{ item }">
      <!-- @vue-expect-error size is a number -->
      {{ item.size.toUpperCase() }}
    </template>
  </Cards>
</template>

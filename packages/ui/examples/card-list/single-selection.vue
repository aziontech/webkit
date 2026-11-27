<script setup>
  import CardList from '@aziontech/ui/card-list'
  import { ref } from 'vue'

  const plans = [
    { id: 'starter', name: 'Starter', price: '$0 a month', requests: '1M requests' },
    { id: 'pro', name: 'Pro', price: '$49 a month', requests: '50M requests' },
    { id: 'business', name: 'Business', price: '$249 a month', requests: '500M requests' }
  ]
  const selected = ref(['pro'])
</script>

<template>
  <CardList
    v-model:selected-keys="selected"
    :items="plans"
    selection-mode="single"
  >
    <template #header="{ item }">{{ item.name }}</template>
    <template #default="{ item }">
      <p class="text-body-sm text-(--text-default)">{{ item.price }}</p>
      <p class="text-body-sm text-(--text-muted)">{{ item.requests }}</p>
    </template>
  </CardList>
</template>

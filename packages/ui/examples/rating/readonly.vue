<script setup>
  import Rating from '@aziontech/webkit/rating'

  const products = [
    { name: 'Acme Storage', average: 4.5, reviews: 128 },
    { name: 'Acme Functions', average: 3, reviews: 42 },
    { name: 'Acme Queues', average: 0, reviews: 0 }
  ]
</script>

<template>
  <ul class="flex flex-col gap-(--spacing-sm)">
    <li
      v-for="product in products"
      :key="product.name"
      class="flex flex-wrap items-center gap-(--spacing-xs)"
    >
      <span class="min-w-40 text-body-sm text-(--text-default)">{{ product.name }}</span>
      <Rating
        :model-value="product.average"
        readonly
        size="small"
      />
      <span class="text-body-sm text-(--text-muted)">{{
        product.reviews ? `${product.average} · ${product.reviews} reviews` : 'No reviews yet'
      }}</span>
    </li>
  </ul>
</template>

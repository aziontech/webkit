<script setup>
  // Routed product page for every product without a hand-built page: the slug in the URL
  // picks its entry in PRODUCT_PAGES, rendered through the shared SolutionPage bands.
  import { computed } from 'vue'

  import SiteLayout from '../components/SiteLayout.vue'
  import SolutionPage from '../components/SolutionPage.vue'
  import { PRODUCT_PAGES } from '../data/products.js'

  const props = defineProps({
    /** Slug of the product under /site/products/. */
    product: { type: String, required: true }
  })

  const page = computed(() => PRODUCT_PAGES[props.product])
</script>

<template>
  <SiteLayout>
    <SolutionPage
      :key="product"
      v-bind="page"
    />
  </SiteLayout>
</template>

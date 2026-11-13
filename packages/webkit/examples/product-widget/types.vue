<script setup>
  import ProductWidget from '@aziontech/webkit/product-widget'
</script>

<template>
  <div class="grid w-full grid-cols-1 gap-(--spacing-lg) md:grid-cols-2">
    <div class="h-80 w-full">
      <ProductWidget
        name="workload-topology"
        kind="window"
      />
    </div>
    <div class="h-80 w-full">
      <ProductWidget
        name="workload-topology"
        kind="bare"
      />
    </div>
    <div class="h-80 w-full min-w-0 overflow-clip p-(--spacing-xl)">
      <ProductWidget
        name="edge-dns-record"
        kind="window"
      />
    </div>
    <div class="h-80 w-full min-w-0 overflow-clip p-(--spacing-xl)">
      <ProductWidget
        name="edge-dns-record"
        kind="bare"
      />
    </div>
  </div>
</template>

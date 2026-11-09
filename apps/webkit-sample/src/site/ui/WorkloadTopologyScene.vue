<script setup>
  import ProductWidget from '@aziontech/webkit/product-widget'
</script>

<template>
  <div class="@container hidden lg:block">
    <div
      class="mt-(--spacing-xl) flex animate-content-enter justify-center motion-reduce:animate-none [--content-enter-delay:120ms]"
    >
      <ProductWidget name="workload-topology-flow" />
    </div>
  </div>
</template>

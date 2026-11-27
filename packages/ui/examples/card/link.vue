<script setup>
  import Card from '@aziontech/ui/card'
</script>

<template>
  <Card
    href="/create/templates/nuxt-ecommerce"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <div class="flex flex-col gap-(--spacing-2xs)">
        <h3 class="text-label-md text-(--text-default)">Nuxt E-commerce</h3>
        <p class="text-body-sm text-(--text-muted)">
          A storefront with a cart and checkout, deployed from a template.
        </p>
      </div>
    </template>
  </Card>
</template>

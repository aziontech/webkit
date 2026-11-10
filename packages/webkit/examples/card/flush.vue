<script setup>
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Card Title"
    :padded="false"
    class="w-full max-w-[512px]"
  >
    <template #content>
      <p class="text-body-sm text-(--text-muted) p-(--spacing-md)">
        With padded=false the content sits flush to the card edges; the content owns its own padding
        (or renders an ItemList with full-width dividers).
      </p>
    </template>
  </Card>
</template>

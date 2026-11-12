<script setup>
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Card Title"
    class="w-full max-w-[512px]"
  >
    <template #content>
      <p class="text-body-sm text-(--text-muted)">
        Card body content. Place forms, tables, or any markup in the content slot.
      </p>
    </template>
  </Card>
</template>

<script setup>
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Domains"
    :padded="false"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <p class="text-body-sm text-(--text-muted) p-(--spacing-md)">
        acme-store.example.com and www.acme-store.example.com point to this workload.
      </p>
    </template>
  </Card>
</template>

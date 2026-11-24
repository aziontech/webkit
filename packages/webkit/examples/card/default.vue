<script setup>
  import Card from '@aziontech/webkit/card'
</script>

<template>
  <Card
    title="Production"
    class="w-full max-w-[512px]"
  >
    <template #default>
      <p class="text-body-sm text-(--text-muted)">
        Serves acme-store from 120 locations. The last deployment finished 2 minutes ago.
      </p>
    </template>
  </Card>
</template>

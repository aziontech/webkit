<script setup>
  import Breadcrumb from '@aziontech/ui/breadcrumb-root'

  const items = [
    { label: 'Page Name', href: '#' },
    { label: 'production-edge-application-with-a-very-long-configuration-name', active: true }
  ]
</script>

<template>
  <Breadcrumb :items="items" />
</template>

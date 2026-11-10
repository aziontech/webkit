<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  const items = [
    { label: 'Page Name', href: '#' },
    { label: 'production-edge-application-with-a-very-long-configuration-name', current: true }
  ]
</script>

<template>
  <Breadcrumb :items="items" />
</template>

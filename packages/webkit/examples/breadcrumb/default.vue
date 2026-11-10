<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  const items = [
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', current: true }
  ]
</script>

<template>
  <Breadcrumb
    :items="items"
    class="max-w-[42.5rem]"
  />
</template>

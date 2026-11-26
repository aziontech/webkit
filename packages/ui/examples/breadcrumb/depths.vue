<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'

  const single = [{ label: 'Page Name', active: true }]
  const two = [
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', active: true }
  ]
  const full = [
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', active: true }
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-[42.5rem]">
    <Breadcrumb :items="single" />
    <Breadcrumb :items="two" />
    <Breadcrumb :items="full" />
  </div>
</template>

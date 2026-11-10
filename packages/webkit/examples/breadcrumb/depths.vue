<script setup>
  import Breadcrumb from '@aziontech/webkit/breadcrumb'

  const single = [{ label: 'Page Name', current: true }]
  const two = [
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', current: true }
  ]
  const full = [
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Page Name', href: '#' },
    { label: 'Current Page', current: true }
  ]
</script>

<template>
  <div class="flex flex-col gap-4 max-w-[42.5rem]">
    <Breadcrumb :items="single" />
    <Breadcrumb :items="two" />
    <Breadcrumb :items="full" />
  </div>
</template>

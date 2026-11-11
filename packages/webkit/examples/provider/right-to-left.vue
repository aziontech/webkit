<script setup>
  import Pagination from '@aziontech/webkit/pagination'
  import WebkitProvider from '@aziontech/webkit/provider'
</script>

<template>
  <WebkitProvider locale="ar">
    <Pagination :total="48" />
  </WebkitProvider>
</template>

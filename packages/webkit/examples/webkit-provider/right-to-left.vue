<script setup>
  import Pagination from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
</script>

<template>
  <WebkitProvider locale="ar">
    <Pagination :total="48" />
  </WebkitProvider>
</template>

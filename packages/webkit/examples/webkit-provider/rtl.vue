<script setup>
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
</script>

<template>
  <WebkitProvider locale="ar">
    <PaginationRoot :total="48" />
  </WebkitProvider>
</template>

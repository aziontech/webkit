<script setup>
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
</script>

<template>
  <ConfigProvider locale="ar">
    <PaginationRoot :total="48" />
  </ConfigProvider>
</template>

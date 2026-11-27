<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import PaginationRoot from '@aziontech/ui/pagination-root'
</script>

<template>
  <ConfigProvider locale="ar">
    <PaginationRoot :total="48" />
  </ConfigProvider>
</template>

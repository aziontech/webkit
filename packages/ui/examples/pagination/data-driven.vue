<script setup>
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import { ref } from 'vue'

  const page = ref(1)
  const pageSize = ref(10)
</script>

<template>
  <PaginationRoot
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="200"
    :page-size-options="[10, 25, 50, 100]"
    :sibling-count="1"
  />
</template>

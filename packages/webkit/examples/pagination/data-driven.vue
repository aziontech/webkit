<script setup>
  import Pagination from '@aziontech/webkit/pagination'
  import { ref } from 'vue'

  const page = ref(1)
  const pageSize = ref(10)
</script>

<template>
  <Pagination
    v-model:page="page"
    v-model:page-size="pageSize"
    :total="200"
    :page-size-options="[10, 25, 50, 100]"
    :sibling-count="1"
  />
</template>

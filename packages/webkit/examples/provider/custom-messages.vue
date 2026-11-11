<script setup>
  import Pagination from '@aziontech/webkit/pagination'
  import WebkitProvider from '@aziontech/webkit/provider'

  const messages = {
    pagination: { info: '{start}–{end} de {total} domínios' }
  }
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :messages="messages"
  >
    <Pagination :total="48" />
  </WebkitProvider>
</template>

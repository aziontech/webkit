<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import Pagination from '@aziontech/webkit/pagination'
  import WebkitProvider from '@aziontech/webkit/provider'
  import { ref } from 'vue'

  const page = ref(1)
  const open = ref(false)
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    class="flex flex-col gap-(--spacing-md)"
  >
    <Pagination
      v-model:page="page"
      :total="120"
    />
    <ConfirmDialog
      v-model:open="open"
      title="Remover domínio"
      description="shop.example.com deixa de responder por este recurso."
      @confirm="open = false"
    >
      <template #trigger>
        <Button
          label="Remover domínio"
          kind="outlined"
          size="medium"
        />
      </template>
    </ConfirmDialog>
  </WebkitProvider>
</template>

<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import { ref } from 'vue'

  const page = ref(1)
  const open = ref(false)
</script>

<template>
  <WebkitProvider
    locale="pt-BR"
    :catalogs="{ 'pt-BR': ptBR }"
  >
    <div class="flex flex-col gap-(--spacing-md)">
      <PaginationRoot
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
    </div>
  </WebkitProvider>
</template>

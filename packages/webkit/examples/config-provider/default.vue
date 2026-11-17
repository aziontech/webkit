<script setup>
  import Button from '@aziontech/webkit/button'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import PaginationRoot from '@aziontech/webkit/pagination-root'
  import { ref } from 'vue'

  const page = ref(1)
  const open = ref(false)
</script>

<template>
  <ConfigProvider
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
        size="small"
        @confirm="open = false"
      >
        <template #trigger>
          <Button
            label="Remover domínio"
            variant="outline"
            size="medium"
          />
        </template>
      </ConfirmDialog>
    </div>
  </ConfigProvider>
</template>

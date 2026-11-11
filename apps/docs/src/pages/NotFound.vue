<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import { useHead } from '@unhead/vue'

  import { messages } from '../lib/i18n'

  const t = messages
  useHead({ title: 'Not found — WebKit' })
</script>

<template>
  <div class="flex w-full justify-center px-(--spacing-md) py-(--spacing-xxl)">
    <h1 class="sr-only">{{ t.notFound }}</h1>
    <EmptyState
      :title="t.notFound"
      :description="t.notFoundLead"
      icon="pi pi-compass"
    >
      <template #actions>
        <Button
          :label="t.backHome"
          kind="primary"
          href="/"
        />
      </template>
    </EmptyState>
  </div>
</template>

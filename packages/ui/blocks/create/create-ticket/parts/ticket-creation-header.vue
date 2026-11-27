<script setup lang="ts">
  import AppHeader from '@aziontech/ui/app-header'
  import AppHeaderAccount from '@aziontech/ui/app-header-account'
  import Brand from '@aziontech/ui/brand'
  import Breadcrumb from '@aziontech/ui/breadcrumb-root'
  import IconButton from '@aziontech/ui/icon-button'

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()

  const breadcrumb = [{ label: 'Tickets', href: '/tickets' }, { label: 'Create Ticket' }]
</script>

<template>
  <AppHeader aria-label="Console">
    <AppHeader.Start>
      <IconButton
        icon="az az-chevron-left"
        aria-label="Back to Tickets"
        variant="outline"
        size="small"
        @click="(event: MouseEvent) => emit('back', event)"
      />
      <AppHeader.Brand
        href="/home"
        aria-label="Azion home"
      >
        <Brand
          variant="default"
          size="small"
        />
      </AppHeader.Brand>
      <Breadcrumb :items="breadcrumb" />
    </AppHeader.Start>
    <AppHeader.Center />
    <AppHeader.End>
      <AppHeaderAccount
        name="jane.doe@example.com"
        aria-label="Account settings"
      />
    </AppHeader.End>
  </AppHeader>
</template>

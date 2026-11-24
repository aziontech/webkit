<script setup lang="ts">
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import ViewTicketInbox, {
    type TicketInboxBulkPayload,
    type TicketInboxTicket
  } from '../blocks/view-ticket-inbox.vue'
  import { agents, applyBulk, SUPPORT_NOW, ticketsOf, views } from '../lib/support'

  const router = useRouter()
  const viewKey = ref('my-open')
  const loading = ref(false)
  const viewTickets = computed(() => ticketsOf(viewKey.value))
  let refreshTimer: ReturnType<typeof setTimeout> | undefined

  const refresh = () => {
    if (loading.value) return
    loading.value = true
    clearTimeout(refreshTimer)
    refreshTimer = setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const onOpen = (_event: Event, ticket: TicketInboxTicket) =>
    router.push(`/support/tickets/${ticket.id}`)

  const onBulk = (_event: Event, payload: TicketInboxBulkPayload) =>
    toast.success(applyBulk(payload), { closable: true })
</script>

<template>
  <ViewTicketInbox
    v-model:view-key="viewKey"
    :tickets="viewTickets"
    :views="views"
    :agents="agents"
    :now="SUPPORT_NOW"
    :loading="loading"
    @create="router.push('/support/tickets/new')"
    @open="onOpen"
    @bulk-action="onBulk"
    @refresh="refresh"
    @retry="refresh"
  />
</template>

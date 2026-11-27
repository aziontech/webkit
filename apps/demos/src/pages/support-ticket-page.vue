<script setup lang="ts">
  import ConsoleLayout from '@aziontech/ui/console-layout'
  import { toast } from '@aziontech/ui/toast'
  import { copyText } from '@aziontech/ui/utils/clipboard'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DetailTicket, {
    type DetailTicketAction,
    type DetailTicketDraft,
    type DetailTicketPropertyChange,
    type DetailTicketSendPayload
  } from '../blocks/detail-ticket.vue'
  import SupportNotFound from '../components/support-not-found.vue'
  import {
    customerOf,
    deleteTickets,
    detailTicketOf,
    findTicket,
    markRead,
    requesterOf,
    responsesFor,
    sendMessage,
    setProperty,
    setStatus,
    SUPPORT_NOW
  } from '../lib/support'

  const route = useRoute()
  const router = useRouter()
  const record = computed(() => findTicket(route.params.id))
  const ticket = computed(() => (record.value ? detailTicketOf(record.value) : undefined))
  const requester = computed(() => (record.value ? requesterOf(record.value) : undefined))
  const responses = computed(() => (record.value ? responsesFor(record.value) : []))
  const blankDraft = (): DetailTicketDraft => ({ mode: 'reply', cc: [], body: '', files: [] })
  const draft = ref<DetailTicketDraft>(blankDraft())
  const sending = ref(false)

  watch(
    () => String(route.params.id),
    (id) => {
      markRead(id)
      draft.value = blankDraft()
    },
    { immediate: true }
  )

  const breadcrumb = computed(() => [
    { label: 'Tickets', href: '/support' },
    { label: record.value ? `#${record.value.id}` : 'Not found' }
  ])

  const onSend = (_event: Event, payload: DetailTicketSendPayload) => {
    if (!record.value || sending.value) return
    const id = record.value.id
    sending.value = true
    setTimeout(() => {
      sendMessage(id, payload)
      sending.value = false
      draft.value = blankDraft()
      toast.success(payload.mode === 'note' ? 'Note added.' : 'Reply sent.', { closable: true })
    }, 500)
  }

  const onPropertyChange = (change: DetailTicketPropertyChange) => {
    if (record.value) setProperty(record.value.id, change.field, change.value)
  }

  const onOpenCustomer = () => {
    const customer = record.value && customerOf(record.value)
    if (customer) router.push(`/support/customers/${customer.id}`)
  }

  const onAction = async (_event: Event, action: DetailTicketAction) => {
    if (!record.value) return
    const { id } = record.value
    if (action === 'copy-link') {
      if (await copyText(`${globalThis.location.origin}/support/tickets/${id}`))
        toast.success('Link copied.', { closable: true })
    }
    if (action === 'print') globalThis.print()
    if (action === 'spam' || action === 'delete') {
      deleteTickets([id])
      toast.success(
        action === 'spam' ? `Ticket #${id} was marked as spam.` : `Ticket #${id} was deleted.`,
        { closable: true }
      )
      router.push('/support')
    }
  }

  const onMerge = () =>
    toast.info('Select the tickets to merge in the inbox, then choose Merge.', { closable: true })
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="breadcrumb" />
  <DetailTicket
    v-if="record && ticket && requester"
    v-model:draft="draft"
    :ticket="ticket"
    :messages="record.messages"
    :requester="requester"
    :activity="record.activity"
    :responses="responses"
    :now="SUPPORT_NOW"
    :sending="sending"
    @send="onSend"
    @property-change="onPropertyChange"
    @open-customer="onOpenCustomer"
    @merge="onMerge"
    @ticket-action="onAction"
    @reopen="setStatus(record.id, 'Open')"
  />
  <SupportNotFound
    label="Ticket"
    v-else
    :id="String(route.params.id)"
  />
</template>

<script setup lang="ts">
  import ConsoleLayout from '@aziontech/ui/console-layout'
  import { toast } from '@aziontech/ui/toast'
  import { computed, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DetailCustomer, {
    type DetailCustomerTab,
    type DetailCustomerTicket
  } from '../blocks/detail-customer.vue'
  import SupportNotFound from '../components/support-not-found.vue'
  import {
    addCustomerNote,
    customerActivityOf,
    customerTicketsOf,
    findCustomer,
    satisfactionOf,
    SUPPORT_NOW
  } from '../lib/support'

  const route = useRoute()
  const router = useRouter()
  const record = computed(() => findCustomer(route.params.id))
  const customer = computed(() => {
    if (!record.value) return undefined
    const { notes: _notes, ...rest } = record.value
    return rest
  })
  const tab = ref<DetailCustomerTab>('tickets')
  const draft = ref('')
  const saving = ref(false)

  watch(
    () => String(route.params.id),
    () => {
      tab.value = 'tickets'
      draft.value = ''
    }
  )

  const breadcrumb = computed(() => [
    { label: 'Tickets', href: '/support' },
    { label: record.value?.name ?? 'Not found' }
  ])

  const onOpenTicket = (event: MouseEvent, ticket: DetailCustomerTicket) => {
    event.preventDefault()
    router.push(`/support/tickets/${ticket.id}`)
  }

  const onAddNote = (_event: MouseEvent, text: string) => {
    if (!record.value || !text.trim()) return
    const { id } = record.value
    saving.value = true
    setTimeout(() => {
      addCustomerNote(id, text.trim())
      saving.value = false
      draft.value = ''
      toast.success('Note added.', { closable: true })
    }, 400)
  }

  const notAvailable = () =>
    toast.info('Editing customers is not part of this demo.', { closable: true })
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="breadcrumb" />
  <DetailCustomer
    v-if="record && customer"
    v-model:tab="tab"
    v-model:draft="draft"
    :customer="customer"
    :satisfaction="satisfactionOf(record)"
    :tickets="customerTicketsOf(record)"
    :activity="customerActivityOf(record)"
    :notes="record.notes"
    :now="SUPPORT_NOW"
    :saving="saving"
    @open-ticket="onOpenTicket"
    @new-ticket="router.push({ path: '/support/tickets/new', query: { requester: record.id } })"
    @edit="notAvailable"
    @customer-action="notAvailable"
    @add-note="onAddNote"
  />
  <SupportNotFound
    v-else
    label="Customer"
    :id="String(route.params.id)"
  />
</template>

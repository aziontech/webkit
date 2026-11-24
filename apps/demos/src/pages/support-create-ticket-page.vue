<script setup lang="ts">
  import { computed, nextTick, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CreateTicket, {
    type CreateTicketCreated,
    type CreateTicketPayload,
    type CreateTicketValues
  } from '../blocks/create-ticket.vue'
  import {
    contactsOf,
    createTicket,
    createTicketAgents,
    createTicketGroups,
    findCustomer
  } from '../lib/support'

  const route = useRoute()
  const router = useRouter()
  const submitting = ref(false)
  const created = ref<CreateTicketCreated>()
  const contacts = computed(contactsOf)

  const defaultValues = computed<Partial<CreateTicketValues>>(() => {
    const customer = findCustomer(route.query.requester)
    return customer
      ? { requester: { id: customer.id, name: customer.name, email: customer.email } }
      : {}
  })

  const back = () =>
    route.query.requester
      ? router.push(`/support/customers/${String(route.query.requester)}`)
      : router.push('/support')

  const onCreate = (_event: Event, payload: CreateTicketPayload) => {
    submitting.value = true
    created.value = undefined
    setTimeout(async () => {
      const ticket = createTicket(payload)
      submitting.value = false
      created.value = { id: ticket.id, subject: ticket.subject }
      if (payload.addAnother) return
      await nextTick()
      router.push(`/support/tickets/${ticket.id}`)
    }, 600)
  }
</script>

<template>
  <CreateTicket
    :contacts="contacts"
    :groups="createTicketGroups"
    :agents="createTicketAgents"
    :default-values="defaultValues"
    :submitting="submitting"
    :created="created"
    @create="onCreate"
    @cancel="back"
    @open="(_event: MouseEvent, id: string) => router.push(`/support/tickets/${id}`)"
  />
</template>

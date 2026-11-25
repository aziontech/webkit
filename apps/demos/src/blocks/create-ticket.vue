<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { AvatarPresence } from '@aziontech/webkit/avatar'
  import PageHeader from '@aziontech/webkit/page-header'
  import type { PriorityTagPriority } from '@aziontech/webkit/priority-tag'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { toast } from '@aziontech/webkit/toast'
  import { useEscapeToCancel } from '@aziontech/webkit/use-escape-to-cancel'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { useUnsavedChanges } from '@aziontech/webkit/use-unsaved-changes'
  import { focusFirstInvalid } from '@aziontech/webkit/utils/focus-invalid'
  import { computed, nextTick, onMounted, reactive, ref, watch } from 'vue'

  import {
    sampleAgents,
    sampleContacts,
    sampleGroups,
    sampleTagOptions
  } from './create-ticket.sample'
  import {
    contactOf,
    emptyDraft,
    ticketErrors,
    type TicketFormDraft,
    type TicketFormField
  } from './create-ticket.ticket-form'
  import TicketAssignmentBand from './create-ticket-ticket-assignment-band.vue'
  import TicketCreationHeader from './create-ticket-ticket-creation-header.vue'
  import TicketDiscardDialog from './create-ticket-ticket-discard-dialog.vue'
  import TicketLoadingBands from './create-ticket-ticket-loading-bands.vue'
  import TicketRequestBand from './create-ticket-ticket-request-band.vue'
  import TicketRequesterBand from './create-ticket-ticket-requester-band.vue'
  import TicketSaveActions from './create-ticket-ticket-save-actions.vue'

  /** How the request reached the team. */
  export type CreateTicketChannel = 'Email' | 'Chat' | 'Web form' | 'Phone'

  /** How urgent a ticket is, the PriorityTag levels without No priority. */
  export type CreateTicketPriority = Exclude<PriorityTagPriority, 'none'>

  /** What kind of request the ticket is. */
  export type CreateTicketType = 'Question' | 'Incident' | 'Problem' | 'Task'

  /** A customer the requester search offers. */
  export interface CreateTicketContact {
    /** Stable id; empty for a contact added on this page. */
    id: string
    /** Full name. */
    name: string
    /** Email address, unique per contact. */
    email: string
  }

  /** A team tickets can be routed to. */
  export interface CreateTicketGroup {
    /** Stable id. */
    id: string
    /** Name shown in the picker. */
    name: string
  }

  /** An agent tickets can be assigned to. */
  export interface CreateTicketAgent {
    /** Stable id. */
    id: string
    /** Full name. */
    name: string
    /** Whether the agent is reachable now; empty when unknown. */
    presence: AvatarPresence | ''
    /** The groups the agent works in. */
    groupIds: string[]
  }

  /** The ticket a create sends. */
  export interface CreateTicketValues {
    /** The customer who asked; an empty id is a new contact to save with the ticket. */
    requester: CreateTicketContact
    /** The request's subject line. */
    subject: string
    /** The request in Markdown. */
    description: string
    /** How the request arrived; empty when not set. */
    channel: CreateTicketChannel | ''
    /** What kind of request it is; empty when not set. */
    type: CreateTicketType | ''
    /** How urgent it is; empty when not set. */
    priority: CreateTicketPriority | ''
    /** The owning group id; empty when not set. */
    groupId: string
    /** The assigned agent id; empty when unassigned. */
    assigneeId: string
    /** Labels for routing and reports. */
    tags: string[]
    /** Email addresses copied on every reply. */
    cc: string[]
    /** Files attached to the first message. */
    attachments: File[]
  }

  /** What Create ticket and Create and add another send. */
  export interface CreateTicketPayload {
    /** The ticket to create. */
    ticket: CreateTicketValues
    /** The agent wants a blank form for the next ticket instead of opening this one. */
    addAnother: boolean
  }

  /** The ticket a request created, named in the success toast. */
  export interface CreateTicketCreated {
    /** Ticket number. */
    id: string
    /** Its subject line. */
    subject: string
  }

  export interface CreateTicketProps {
    /** The contacts the requester search offers. Left out, the sample contacts render. */
    contacts?: CreateTicketContact[]
    /** The groups a ticket can be routed to. Left out, the sample groups render. */
    groups?: CreateTicketGroup[]
    /** The agents a ticket can be assigned to and mentioned. Left out, the sample agents render. */
    agents?: CreateTicketAgent[]
    /** The tags offered while tagging. Left out, the sample tags render. */
    tagOptions?: string[]
    /** Values the form opens with, such as a kept draft; every field falls back to empty. */
    defaultValues?: Partial<CreateTicketValues>
    /** Opens with the validation messages shown, as after a press on Create ticket. */
    defaultSubmitted?: boolean
    /** The contacts, groups and agents are still arriving: skeleton rows hold the bands and creating waits. */
    loading?: boolean
    /** The create request is in flight: the pressed button spins and the form locks. */
    submitting?: boolean
    /** Why the create request failed, shown in a danger alert with Retry; every value is kept. */
    error?: string
    /** The ticket the request created: the success toast names it and the form clears for the next one. */
    created?: CreateTicketCreated
  }

  const props = withDefaults(defineProps<CreateTicketProps>(), {
    contacts: undefined,
    groups: undefined,
    agents: undefined,
    tagOptions: undefined,
    defaultValues: () => ({}),
    defaultSubmitted: false,
    loading: false,
    submitting: false,
    error: '',
    created: undefined
  })

  const emit = defineEmits<{
    create: [event: Event, payload: CreateTicketPayload]
    cancel: [event: MouseEvent | KeyboardEvent]
    open: [event: MouseEvent, id: string]
  }>()

  const RESULT_TOAST = 'create-ticket-result'

  const contacts = computed(() => props.contacts ?? (props.loading ? [] : sampleContacts))
  const groups = computed(() => props.groups ?? (props.loading ? [] : sampleGroups))
  const agents = computed(() => props.agents ?? (props.loading ? [] : sampleAgents))

  const start = props.defaultValues
  const draft = reactive<TicketFormDraft>({
    ...emptyDraft(),
    ...start,
    requesterEmail: start.requester?.id ? start.requester.email : '',
    contactName: start.requester?.id ? '' : (start.requester?.name ?? ''),
    contactEmail: start.requester?.id ? '' : (start.requester?.email ?? ''),
    tags: [...(start.tags ?? [])],
    cc: [...(start.cc ?? [])]
  })
  const newContact = ref(Boolean(start.requester && !start.requester.id))
  const attachments = ref<File[]>([...(start.attachments ?? [])])
  const submitted = ref(props.defaultSubmitted)
  const addAnother = ref(false)
  const attempt = ref(0)

  const tagOptions = computed(() => props.tagOptions ?? sampleTagOptions)

  const errors = computed(() => ticketErrors(draft, newContact.value))
  const message = (field: TicketFormField) => (submitted.value ? errors.value[field] : '')
  const locked = computed(() => props.submitting || props.loading)

  const mentions = computed(() =>
    agents.value.map((agent) => ({ value: agent.id.replace(/^agent-/, ''), label: agent.name }))
  )

  const values = (): CreateTicketValues => {
    const { requesterEmail, contactName, contactEmail, ...rest } = draft
    const picked = contacts.value.find((contact) => contact.email === requesterEmail)
    return {
      ...rest,
      subject: draft.subject.trim(),
      requester: newContact.value
        ? contactOf(contactName, contactEmail)
        : (picked ?? contactOf('', requesterEmail)),
      attachments: [...attachments.value]
    }
  }

  const guard = useUnsavedChanges(
    () => ({ ...draft, newContact: newContact.value, attachments: attachments.value }),
    { enabled: () => !props.submitting }
  )

  const onCancel = async (event: MouseEvent | KeyboardEvent) => {
    if (await guard.confirmLeave()) emit('cancel', event)
  }

  useEscapeToCancel(onCancel, { enabled: () => !props.submitting })
  const formEl = ref<HTMLFormElement | null>(null)
  const requesterEl = ref<InstanceType<typeof TicketRequesterBand> | null>(null)

  useShortcuts({
    keys: 'meta+enter',
    label: 'Create ticket',
    group: 'Page',
    element: formEl,
    when: () => !locked.value,
    handler: () => formEl.value?.requestSubmit()
  })

  const focusInvalid = async () => {
    const moved = await focusFirstInvalid(formEl.value)
    requesterEl.value?.closeList()
    return moved
  }

  const submit = (event: Event, another: boolean) => {
    if (locked.value) return
    submitted.value = true
    if (Object.values(errors.value).some(Boolean)) {
      focusInvalid()
      return
    }
    addAnother.value = another
    toast.dismiss(RESULT_TOAST)
    emit('create', event, { ticket: values(), addAnother: another })
  }

  const reportCreated = async (ticket: CreateTicketCreated) => {
    Object.assign(draft, emptyDraft())
    newContact.value = false
    attachments.value = []
    submitted.value = false
    guard.commit()
    toast.success(`Ticket #${ticket.id} was created.`, {
      id: RESULT_TOAST,
      description: ticket.subject,
      action: {
        label: 'Open ticket',
        onClick: (event: MouseEvent) => emit('open', event, ticket.id)
      }
    })
    await nextTick()
    requesterEl.value?.focus()
  }

  onMounted(async () => {
    if (props.created) return reportCreated(props.created)
    await nextTick()
    if (!submitted.value || !(await focusInvalid())) requesterEl.value?.focus()
  })

  watch(
    () => props.created,
    (next) => {
      if (next) reportCreated(next)
    }
  )

  watch(
    () => props.submitting,
    (now, before) => {
      if (before && !now) attempt.value += 1
    }
  )

  watch([() => props.error, attempt], async ([next]) => {
    if (!next || props.loading) return
    await nextTick()
    formEl.value?.querySelector('[role="alert"]')?.scrollIntoView({ block: 'nearest' })
  })
</script>

<template>
  <div class="flex h-(--demo-viewport-height) flex-col bg-(--bg-canvas)">
    <TicketCreationHeader @back="onCancel" />

    <main class="animate-page-enter motion-reduce:animate-none flex min-h-0 flex-1 flex-col">
      <form
        ref="formEl"
        class="flex min-h-0 flex-1 flex-col"
        aria-labelledby="create-ticket-title"
        novalidate
        :aria-busy="locked"
        @submit.prevent="(event: Event) => submit(event, false)"
      >
        <div class="flex min-h-0 flex-1 flex-col overflow-auto">
          <div
            class="layout-column-form layout-boundary-inline flex flex-1 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
          >
            <PageHeader
              title="Create ticket"
              description="Log a request on behalf of a customer. They get an email with the ticket number."
              size="small"
              title-id="create-ticket-title"
            />

            <Alert
              v-if="error && !loading"
              :key="attempt"
              class="mt-(--layout-section-gap)"
              severity="danger"
              title="The ticket wasn't created."
              :label="error"
              action-label="Retry"
              @action="(event: MouseEvent) => submit(event, addAnother)"
            />
            <TicketLoadingBands
              v-if="loading"
              class="mt-(--layout-section-gap)"
            />

            <fieldset
              v-else
              :disabled="submitting"
              class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
            >
              <legend class="sr-only">Create ticket</legend>

              <TicketRequesterBand
                ref="requesterEl"
                v-model:requester-email="draft.requesterEmail"
                v-model:contact-name="draft.contactName"
                v-model:contact-email="draft.contactEmail"
                v-model:new-contact="newContact"
                v-model:cc="draft.cc"
                :contacts="contacts"
                :disabled="submitting"
                :errors="{
                  requester: message('requester'),
                  contactName: message('contactName'),
                  contactEmail: message('contactEmail'),
                  cc: message('cc')
                }"
              />
              <TicketRequestBand
                v-model:subject="draft.subject"
                v-model:description="draft.description"
                v-model:attachments="attachments"
                v-model:channel="draft.channel"
                v-model:type="draft.type"
                v-model:priority="draft.priority"
                :mentions="mentions"
                :disabled="submitting"
                :errors="{ subject: message('subject'), description: message('description') }"
              />
              <TicketAssignmentBand
                v-model:group-id="draft.groupId"
                v-model:assignee-id="draft.assigneeId"
                v-model:tags="draft.tags"
                :groups="groups"
                :agents="agents"
                :tag-options="tagOptions"
                :disabled="submitting"
              />
            </fieldset>
          </div>
          <SaveBar variant="centered">
            <template #actions>
              <TicketSaveActions
                :loading="loading"
                :submitting="submitting"
                :add-another="addAnother"
                @cancel="onCancel"
                @add-another="(event: MouseEvent) => submit(event, true)"
              />
            </template>
          </SaveBar>
        </div>
      </form>
    </main>
    <TicketDiscardDialog :guard="guard" />
  </div>
</template>

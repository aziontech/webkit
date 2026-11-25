# CreateTicket (`create/create-ticket`)

> The page a support agent creates a ticket on, on behalf of a customer: the creation header with Back, the brand, Tickets › Create ticket and the account, then a centred form column with a small `PageHeader` and three `SettingsGroup` bands of `SettingsRow`s in flush `Card`s. Requester: a `Combobox` that searches contacts by name or email, each row an `Avatar` with the name and email, with Add new contact swapping it for Contact name and Contact email inputs, and CC as `MultiSelect` chips of email addresses. Request: Subject (`Input`), Description (`MarkdownEditor` with @mentions of agents and an attachments footer: Attach files and a `FileTokenGroup`), Channel, Type and Priority (`Select`, each priority a `PriorityTag`). Assignment: Group and Assignee (`Combobox`, the agents with `Avatar` presence and only those in the chosen group) and Tags (`MultiSelect` chips). Every field starts empty; Requester, Subject and Description carry the required mark. A raised `SaveBar` holds Cancel, Create and add another and Create ticket (⌘ Enter). Fields turn invalid only after a create press, with a `FieldError` under each and focus on the first; there is no summary. A failed request opens a danger `Alert` with Retry under the page title, scrolled into view, and keeps every value; a created ticket raises a success `toast` with Open ticket and clears the form for the next one. Escape cancels, and a changed form asks before it is discarded (`ConfirmDialog`). The block fetches nothing: it emits `create` with the typed ticket and whether to add another, and the page passes back `submitting`, `error` or `created`.

- Surface: app
- Source: `blocks/create/create-ticket/create-ticket.vue` in `@aziontech/webkit`
- MCP: `get_block("create/create-ticket")`
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- Components: [Alert](../../components/alert.md), [AppHeader](../../components/app-header.md), `AppHeaderAccount`, [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [Card](../../components/card.md), [Combobox](../../components/combobox.md), [ConfirmDialog](../../components/confirm-dialog.md), `FieldError`, [FileTokenGroup](../../components/file-token-group.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [Item](../../components/item.md), [Kbd](../../components/kbd.md), [MarkdownEditor](../../components/markdown-editor.md), [MultiSelect](../../components/multi-select.md), [PageHeader](../../components/page-header.md), [PriorityTag](../../components/priority-tag.md), [SaveBar](../../components/save-bar.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [SettingsRow](../../components/settings-row.md), [Skeleton](../../components/skeleton.md), [Toast](../../components/toast.md), `use-escape-to-cancel`, `use-file-picker`, `use-locale`, `use-shortcuts`, `use-unsaved-changes`, `utils/focus-invalid`
- Skills: `webkit-create-surface`, `webkit-form`, `webkit-errors`, `webkit-layout`

## Asked as

create ticket; new ticket; new support ticket; log a ticket for a customer; agent creates ticket; helpdesk new ticket form; support request form; ticket form with requester and assignee; create and add another; add new contact inline; criar ticket; novo ticket; novo chamado; abrir chamado em nome de alguém; formulário de chamado; criar chamado de suporte; registrar solicitação de suporte

The page a support agent opens a ticket on, on behalf of a customer who called, chatted or wrote in. The agent's job is to say who asked, what they need and who owns it, then create the ticket and either go to it or log the next one. It follows the Zendesk and Freshdesk new-ticket forms on the house create page (`create/create-page`): its own creation header with no sidebar, a centred form column, three bands of rows, and a raised commit card at the bottom with Cancel, Create and add another, and Create ticket.

A ticket creates on a page, not in a drawer: it is a first-level resource the inbox routes to (`/tickets/new`, the Create ticket button of `view/view-ticket-inbox`), one ticket is one deliberate act rather than a small tuple created in bulk, and the description needs the full measure (`skills/webkit-create-surface`).

## When to use

- An agent logs a request for a customer: a phone call, a chat that needs a follow-up, an email forwarded from another inbox.
- Any first-level work item with a requester, a written description, an owner and a priority (an abuse report, an onboarding case).

## When not to use

- A record created inside another resource without leaving it (a note on a ticket, a macro in a group): use `create/create-drawer`.
- A short create with a handful of fields and no sections: use `state/state-form-validation`.
- Replying to an existing ticket: use the `message-thread` component with a `markdown-editor` on the ticket's own page.
- The queue the agent comes from: use `view/view-ticket-inbox`.
- A customer filing their own request on a public help center: no block covers it yet; it is a short form without assignment, not this agent page.

## Building blocks

### A. Creation header — `AppHeader`, `AppHeaderAccount`, `Brand`, `Breadcrumb`, `IconButton` (required)

`parts/ticket-creation-header.vue`: the outline Back `IconButton` (`Back to Tickets`, the same path as Cancel), the `Brand`, a `Breadcrumb` `Tickets › Create ticket` and the account. No sidebar: creating is the whole task.

### B. Heading — `PageHeader` (required)

`size="small"`, `Create ticket` and one sentence on what happens next, with `title-id` so the `form` is named by it.

### C. Loading rows — `Card`, `Skeleton` (loading only)

`parts/ticket-loading-bands.vue`: while the contacts, groups and agents arrive, three flush cards of label and control bands stand in for the bands inside a `role="status"` region named `Loading contacts and agents`, and both create buttons are disabled.

### D. Requester band — `SettingsGroup`, `Card`, `Item`, `SettingsRow`, `Combobox`, `Avatar`, `Button`, `Input`, `FieldError`, `MultiSelect` (required)

`parts/ticket-requester-band.vue` over `parts/ticket-requester-field.vue`. Requester is a required `Combobox` (`allow-custom` off, `clearable`) whose options are the contacts, each row a `parts/ticket-person-option.vue` (a small `Avatar`, the name and the email); the option value is the email, so typing either finds the contact. Under it a ghost `Button` Add new contact swaps the row for two required rows, Contact name and Contact email, and moves focus to Contact name; Search contacts under the email swaps back and focuses the search. CC is a `MultiSelect` with `variant="chips"`, `searchable` and `allow-custom`, offering the contacts' addresses and taking any typed one; an entry that is not an email address turns the field invalid on submit.

### E. Request band — `SettingsGroup`, `Card`, `Item`, `SettingsRow`, `Input`, `FieldError`, `MarkdownEditor`, `IconButton`, `FileTokenGroup`, `Select`, `PriorityTag` (required)

`parts/ticket-request-band.vue`. Subject is a required `Input`. Description (`parts/ticket-description-field.vue`) is a required `MarkdownEditor` in a `stacked` row, six lines tall, with the agents in its `@` menu; its `footer` holds Attach files (a ghost `IconButton` that opens the system picker through `useFilePicker`) and, once files are picked, a horizontal `FileTokenGroup` with Remove per file. Channel (`Email`, `Chat`, `Web form`, `Phone`, each with its glyph; the values of `view/view-ticket-inbox`), Type (`Question`, `Incident`, `Problem`, `Task`) and Priority are `Select`s that start empty. Each priority option is a `PriorityTag`, and the trigger prints the tag's own label from the locale catalog (`displayValue`), so no priority word is typed twice.

### F. Assignment band — `SettingsGroup`, `Card`, `Item`, `SettingsRow`, `Combobox`, `Avatar`, `MultiSelect` (required)

`parts/ticket-assignment-band.vue`. Group and Assignee are `Combobox`es with `allow-custom` off, so a typed name never becomes an owner. Group rows carry a square `Avatar`; Assignee rows carry the agent's `Avatar` with `presence` (spoken in its name, `Jane Doe, online`) and their groups, and list only the agents of the chosen group; changing the group clears an assignee outside it. Tags is a `MultiSelect` of chips that takes new tags.

### G. Failure — `Alert` (conditional)

A danger `Alert` under the page title, above the bands, scrolled into view when it appears, `The ticket wasn't created.` with the page's message and Retry, re-mounted on every failed attempt so it is announced again. Every value stays as entered.

### H. Commit — `SaveBar`, `Button`, `Kbd` (required)

`variant="centered"`, the buttons in `parts/ticket-save-actions.vue`: Cancel (outline), Create and add another (secondary) and Create ticket (primary, `type="submit"`, with the `Kbd` for ⌘ Enter and `aria-keyshortcuts`). The pressed button shows `loading` and the other two are disabled while the request runs. Below `sm` the bar keeps one row, Cancel and Create ticket side by side at equal width, so it stays as low as the other create pages; Create and add another and the `Kbd` hide there.

### Leaving — `ConfirmDialog`

`parts/ticket-discard-dialog.vue` with `useUnsavedChanges`: Cancel, Back and Escape (`useEscapeToCancel`) leave at once from a clean form and ask Keep editing or Discard changes from a changed one. It starts closed.

### Result — through `toast`

When the page passes `created`, the block raises `toast.success` `Ticket #4840 was created.` with the subject and an Open ticket action (it emits `open`), clears the form, marks it clean and puts focus back on Requester. The app mounts the one toast region; the block never renders a `Toaster`.

## Data

The block keeps the form as a local draft, validates it on submit and emits `create`; it sends no request and fakes none. `CreateTicketValues`, `CreateTicketPayload`, `CreateTicketContact`, `CreateTicketGroup`, `CreateTicketAgent`, `CreateTicketCreated`, `CreateTicketChannel`, `CreateTicketType`, `CreateTicketPriority` and `CreateTicketProps` are exported from `create-ticket.vue`. `sample.ts` holds the contacts, groups, agents and tags the pickers offer when their props are left out (none of them while `loading`), plus the filled ticket and the created ticket the variants pass. `lib/ticket-form.ts` holds the option lists, the empty draft and the validation messages.

| Prop               | Type                          | What it does                                                                                 |
| ------------------ | ----------------------------- | -------------------------------------------------------------------------------------------- |
| `contacts`         | `CreateTicketContact[]`       | The contacts the requester search offers.                                                    |
| `groups`           | `CreateTicketGroup[]`         | The groups a ticket can be routed to.                                                        |
| `agents`           | `CreateTicketAgent[]`         | The agents with presence and groups; Assignee and the description's `@` menu offer them.     |
| `tagOptions`       | `string[]`                    | The tags offered while tagging.                                                              |
| `defaultValues`    | `Partial<CreateTicketValues>` | Values the form opens with, such as a kept draft. Left out, every field is empty.            |
| `defaultSubmitted` | `boolean`                     | Opens with the validation messages shown, as after a create press.                           |
| `loading`          | `boolean`                     | The pickers' data is arriving: skeleton bands, create buttons disabled.                      |
| `submitting`       | `boolean`                     | The create request is in flight: the pressed button spins and the form locks.                |
| `error`            | `string`                      | Why the request failed, shown in the danger `Alert` with Retry.                              |
| `created`          | `CreateTicketCreated`         | The ticket the request created: the success toast names it and the form clears for the next. |

| Event    | Payload                           | When                                                                                            |
| -------- | --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `create` | `(event, { ticket, addAnother })` | Create ticket (`addAnother` false) or Create and add another (true) on a valid form, and Retry. |
| `cancel` | `(event)`                         | Cancel, Back or Escape, once a changed form is confirmed.                                       |
| `open`   | `(event, id)`                     | Open ticket in the success toast.                                                               |

`ticket.requester` with an empty `id` is a new contact to save with the ticket. To go live, render the block from the page that owns the request:

```vue
<script setup lang="ts">
  import CreateTicket, { type CreateTicketCreated, type CreateTicketPayload } from './create-ticket.vue'

  const { contacts, groups, agents, tags, pending: loading } = useTicketDirectory()
  const { mutate, pending, error } = useCreateTicket()
  const created = ref<CreateTicketCreated>()

  const create = async (_event: Event, { ticket, addAnother }: CreateTicketPayload) => {
    const saved = await mutate(ticket)
    if (addAnother) created.value = { id: saved.id, subject: saved.subject }
    else router.push(`/tickets/${saved.id}`)
  }
</script>

<template>
  <CreateTicket
    :contacts="contacts"
    :groups="groups"
    :agents="agents"
    :tag-options="tags"
    :loading="loading"
    :submitting="pending"
    :error="error ? 'The ticket service didn\'t answer. Your entries are kept: try again.' : ''"
    :created="created"
    @create="create"
    @cancel="router.push('/tickets')"
    @open="(_event, id) => router.push(`/tickets/${id}`)"
  />
</template>
```

Then delete `sample.ts` and its import. A large contact list moves to server search: pass `:filter="false"` to the requester `Combobox`, fetch on its `search` event and pass the results as `contacts`.

## Do

- Keep only Requester, Subject and Description required; the rest is triage the team can do later.
- Validate on create only, and move focus to the first field in error.
- Keep every value after a failed request, and show the failure where the commit happens.
- Offer Create and add another for agents logging several calls in a row, and put focus back on Requester.

## Don't

- Don't preselect a channel, type, priority, group or assignee: a blank form starts empty.
- Don't show an error summary or an `Alert` for field errors; each field says what it needs.
- Don't accept a typed name as a group or an assignee.
- Don't send the agent away to create a missing contact: Add new contact stays on the page.

## Copy

- **Title:** `Create ticket`; description `Log a request on behalf of a customer. They get an email with the ticket number.`
- **Bands:** `Requester`, `Request`, `Assignment`, each with a one-sentence Hint. **Rows:** a noun title and one sentence of guidance (`The customer who asked. Search by name or email address.`).
- **Requester:** placeholder `Search contacts`, no match `No contact matches. Add a new contact instead.`, actions `Add new contact` and `Search contacts`.
- **Placeholders:** `Select a channel`, `Select a type`, `Select a priority`, `Search groups`, `Search agents`; Assignee no match `No agent in this group matches.`
- **Errors:** `Select the customer who asked, or add a new contact.`, `Enter the contact’s name.`, `Enter the contact’s email address.`, `Enter an email address such as name@example.com.`, `<entry> is not an email address. Fix it or remove it.`, `Enter a subject.`, `Describe what the customer needs.`
- **Attachments:** `Attach files`; the list is named `Attachments`.
- **Failure:** title `The ticket wasn't created.`, the page's message, `Retry`.
- **Success:** `Ticket #4840 was created.`, the subject, `Open ticket`.
- **Commit:** `Cancel`, `Create and add another`, `Create ticket`. The discard dialog uses the built-in `useUnsavedChanges` labels.
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- Landmarks: the creation header, then `main` holding a `form` named by the `Create ticket` h1; the bands are h2s (Requester, Request, Assignment).
- Focus: on load the Requester search, with its list closed until the agent types or presses Arrow Down (the first invalid field instead when the form opens with messages); Tab runs header, then the fields in band order, then Cancel, Create and add another, Create ticket. A create press with gaps moves focus to the first invalid field; after Create and add another, focus returns to Requester. Add new contact focuses Contact name; Search contacts focuses the search.
- Each control takes its row title as `aria-label`, its error through `aria-describedby`, and `aria-invalid` once a create press finds a problem; the required rows carry the required mark and `aria-required`.
- Keyboard: ⌘ Enter (Ctrl Enter) creates from anywhere in the form, Escape cancels; the editor's own shortcuts are Ctrl/⌘ B, I and K.
- Announcements: the failure `Alert` is re-mounted after each attempt; the success toast is announced by the app's toast region; presence is spoken in the avatar's name, never the dot alone.
- Names and addresses keep their own direction (`dir="auto"`) on a right-to-left page; the rows stack below the row's container width, so the form reflows at 320 px.

## States

- Default: every field empty, the sample contacts, groups, agents and tags in the pickers, focus on Requester.
- ValidationErrors: `defaultSubmitted` with only a Subject and a CC entry that is not an address; Requester, Description and CC show their messages.
- ContactError: `defaultSubmitted` on a new contact whose email has no domain ending; Contact email, Subject and Description show their messages.
- Submitting: `submitting` on the filled sample ticket; Create ticket spins and the form locks.
- SubmitError: `error` on the filled sample ticket; the danger Alert with Retry, every value kept.
- Success: `created` after Create and add another; the success toast with Open ticket and an empty form.
- Loading: `loading`; skeleton bands and disabled create buttons.

## Related

- `create/create-page` — the house create page this one follows.
- `view/view-ticket-inbox` — the queue whose Create ticket opens this page.
- `state/state-form-validation` — every submit outcome of a create form.
- `create/create-drawer` — a create inside a resource, kept beside its list.

## Variants

- `Default` — primary (the code below)
- `ValidationErrors` — Create ticket pressed with gaps: Requester and Description are empty and a CC entry is not an email address, so each turns invalid with its message under it and focus moves to Requester; the typed Subject stays.
- `ContactError` — Add new contact chosen and Create ticket pressed: Contact email holds an address with no domain ending and turns invalid, Subject and Description are empty and invalid too, and Search contacts goes back to the contact search.
- `Submitting` — A filled ticket in flight: Create ticket spins, every field, Cancel and Create and add another are disabled until the answer comes back.
- `SubmitError` — The request failed: a danger Alert under the page title says the ticket wasn't created, with Retry, and every value stays as entered.
- `Success` — After Create and add another: a success toast names Ticket #4840 with Open ticket, and the form is empty again with focus on Requester.
- `Loading` — The contacts, groups and agents are still arriving: skeleton rows hold the three bands and both create buttons are disabled.

Each variant is the same screen in another state: `get_block("create/create-ticket", { variant })`, or the file under `blocks/create/create-ticket/variants/`.

## Code (`Default`)

```vue
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
    contactOf,
    emptyDraft,
    ticketErrors,
    type TicketFormDraft,
    type TicketFormField
  } from './lib/ticket-form'
  import TicketAssignmentBand from './parts/ticket-assignment-band.vue'
  import TicketCreationHeader from './parts/ticket-creation-header.vue'
  import TicketDiscardDialog from './parts/ticket-discard-dialog.vue'
  import TicketLoadingBands from './parts/ticket-loading-bands.vue'
  import TicketRequestBand from './parts/ticket-request-band.vue'
  import TicketRequesterBand from './parts/ticket-requester-band.vue'
  import TicketSaveActions from './parts/ticket-save-actions.vue'
  import { sampleAgents, sampleContacts, sampleGroups, sampleTagOptions } from './sample'

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
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
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
```

## `sample.ts`

```ts
import type {
  CreateTicketAgent,
  CreateTicketContact,
  CreateTicketGroup,
  CreateTicketValues
} from './create-ticket.vue'

export const sampleContacts: CreateTicketContact[] = [
  { id: 'contact-alex-morgan', name: 'Alex Morgan', email: 'alex.morgan@example.com' },
  { id: 'contact-chris-taylor', name: 'Chris Taylor', email: 'chris.taylor@example.com' },
  { id: 'contact-morgan-lee', name: 'Morgan Lee', email: 'morgan.lee@example.com' },
  { id: 'contact-taylor-kim', name: 'Taylor Kim', email: 'taylor.kim@example.com' },
  { id: 'contact-jordan-rivera', name: 'Jordan Rivera', email: 'jordan.rivera@example.org' },
  { id: 'contact-casey-brooks', name: 'Casey Brooks', email: 'casey.brooks@example.net' }
]

export const sampleGroups: CreateTicketGroup[] = [
  { id: 'technical', name: 'Technical' },
  { id: 'billing', name: 'Billing' },
  { id: 'accounts', name: 'Accounts' }
]

export const sampleAgents: CreateTicketAgent[] = [
  {
    id: 'agent-jane-doe',
    name: 'Jane Doe',
    presence: 'online',
    groupIds: ['technical', 'accounts']
  },
  { id: 'agent-john-smith', name: 'John Smith', presence: 'away', groupIds: ['technical'] },
  { id: 'agent-priya-patel', name: 'Priya Patel', presence: 'busy', groupIds: ['billing'] },
  { id: 'agent-sam-lee', name: 'Sam Lee', presence: 'offline', groupIds: ['billing', 'accounts'] }
]

export const sampleTagOptions: string[] = [
  'certificates',
  'domains',
  'cache',
  'invoice',
  'access',
  'functions',
  'firewall'
]

export const sampleValues: Partial<CreateTicketValues> = {
  requester: sampleContacts[0],
  subject: 'Custom domain returns a certificate error',
  description:
    'Alex called about **shop.example.com**: browsers show a certificate warning since this morning. The certificate was renewed yesterday.',
  channel: 'Phone',
  type: 'Incident',
  priority: 'high',
  groupId: 'technical',
  assigneeId: 'agent-jane-doe',
  tags: ['certificates', 'domains'],
  cc: ['morgan.lee@example.com']
}

export const sampleCreated = { id: '4840', subject: 'Custom domain returns a certificate error' }
```

## `lib/ticket-form.ts`

```ts
import type {
  CreateTicketChannel,
  CreateTicketContact,
  CreateTicketPriority,
  CreateTicketType
} from '../create-ticket.vue'

export type TicketFormField =
  'requester' | 'contactName' | 'contactEmail' | 'cc' | 'subject' | 'description'

export interface TicketFormDraft {
  requesterEmail: string
  contactName: string
  contactEmail: string
  subject: string
  description: string
  channel: CreateTicketChannel | ''
  type: CreateTicketType | ''
  priority: CreateTicketPriority | ''
  groupId: string
  assigneeId: string
  tags: string[]
  cc: string[]
}

export const channelOptions: { value: CreateTicketChannel; icon: string }[] = [
  { value: 'Email', icon: 'az az-mail' },
  { value: 'Chat', icon: 'az az-comment' },
  { value: 'Web form', icon: 'az az-globe' },
  { value: 'Phone', icon: 'az az-phone' }
]

export const typeOptions: CreateTicketType[] = ['Question', 'Incident', 'Problem', 'Task']

export const priorityOptions: CreateTicketPriority[] = ['urgent', 'high', 'medium', 'low']

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const isEmail = (value: string) => EMAIL.test(value.trim())

export const contactOf = (name: string, email: string): CreateTicketContact => ({
  id: '',
  name: name.trim(),
  email: email.trim()
})

export const emptyDraft = (): TicketFormDraft => ({
  requesterEmail: '',
  contactName: '',
  contactEmail: '',
  subject: '',
  description: '',
  channel: '',
  type: '',
  priority: '',
  groupId: '',
  assigneeId: '',
  tags: [],
  cc: []
})

export function ticketErrors(
  draft: TicketFormDraft,
  newContact: boolean
): Record<TicketFormField, string> {
  const badCc = draft.cc.find((address) => !isEmail(address))
  return {
    requester:
      !newContact && !draft.requesterEmail
        ? 'Select the customer who asked, or add a new contact.'
        : '',
    contactName: newContact && !draft.contactName.trim() ? 'Enter the contact’s name.' : '',
    contactEmail: !newContact
      ? ''
      : !draft.contactEmail.trim()
        ? 'Enter the contact’s email address.'
        : isEmail(draft.contactEmail)
          ? ''
          : 'Enter an email address such as name@example.com.',
    cc: badCc ? `${badCc} is not an email address. Fix it or remove it.` : '',
    subject: draft.subject.trim() ? '' : 'Enter a subject.',
    description: draft.description.trim() ? '' : 'Describe what the customer needs.'
  }
}
```

## `parts/ticket-creation-header.vue`

```ts
<script setup lang="ts">
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import IconButton from '@aziontech/webkit/icon-button'

  const emit = defineEmits<{
    back: [event: MouseEvent]
  }>()

  const breadcrumb = [{ label: 'Tickets', href: '/tickets' }, { label: 'Create ticket' }]
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
```

## `parts/ticket-requester-band.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed, ref } from 'vue'

  import type { CreateTicketContact } from '../create-ticket.vue'
  import TicketRequesterField from './ticket-requester-field.vue'

  export interface TicketRequesterBandProps {
    /** The contacts the requester search offers. */
    contacts: CreateTicketContact[]
    /** Locks every control while the request runs. */
    disabled?: boolean
    /** The messages a submit found, empty for a valid field. */
    errors: { requester: string; contactName: string; contactEmail: string; cc: string }
  }

  const props = withDefaults(defineProps<TicketRequesterBandProps>(), {
    disabled: false
  })

  const requesterEmail = defineModel<string>('requesterEmail', { default: '' })
  const contactName = defineModel<string>('contactName', { default: '' })
  const contactEmail = defineModel<string>('contactEmail', { default: '' })
  const newContact = defineModel<boolean>('newContact', { default: false })
  const cc = defineModel<string[]>('cc', { default: () => [] })

  const typed = ref<string[]>([])
  const ccChoices = computed(() => [
    ...new Set([...props.contacts.map((contact) => contact.email), ...cc.value, ...typed.value])
  ])

  const addAddress = (_event: MouseEvent | KeyboardEvent, address: string) => {
    typed.value = [...typed.value, address]
    cc.value = [...cc.value, address]
  }

  const requesterEl = ref<InstanceType<typeof TicketRequesterField> | null>(null)

  defineExpose({
    /** Moves focus to the first requester control. */
    focus: () => requesterEl.value?.focus(),
    /** Closes the contact list that focusing the search opened. */
    closeList: () => requesterEl.value?.closeList()
  })
</script>

<template>
  <SettingsGroup
    label="Requester"
    hint="Who asked, and who else gets the replies."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <TicketRequesterField
            ref="requesterEl"
            v-model:requester-email="requesterEmail"
            v-model:contact-name="contactName"
            v-model:contact-email="contactEmail"
            v-model:new-contact="newContact"
            :contacts="contacts"
            :disabled="disabled"
            :requester-error="errors.requester"
            :name-error="errors.contactName"
            :email-error="errors.contactEmail"
          />
          <SettingsRow
            stackable
            title="CC"
            description="Email addresses copied on every reply. Type an address and press Enter."
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <MultiSelect
                v-model="cc"
                variant="chips"
                size="large"
                searchable
                allow-custom
                placeholder="Add email addresses"
                aria-label="CC"
                :disabled="disabled"
                :invalid="Boolean(errors.cc)"
                :aria-describedby="errors.cc ? 'create-ticket-cc-message' : undefined"
                @create="addAddress"
              >
                <MultiSelect.Trigger />
                <MultiSelect.Content>
                  <MultiSelect.Item
                    v-for="address in ccChoices"
                    :key="address"
                    :value="address"
                    >{{ address }}</MultiSelect.Item
                  >
                </MultiSelect.Content>
              </MultiSelect>
              <FieldError
                v-if="errors.cc"
                id="create-ticket-cc-message"
                >{{ errors.cc }}</FieldError
              >
            </div>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/ticket-requester-field.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Combobox from '@aziontech/webkit/combobox'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed, nextTick, ref } from 'vue'

  import type { CreateTicketContact } from '../create-ticket.vue'
  import TicketPersonOption from './ticket-person-option.vue'

  export interface TicketRequesterFieldProps {
    /** The contacts the search offers. */
    contacts: CreateTicketContact[]
    /** The contacts are still arriving. */
    loading?: boolean
    /** Locks every control while the request runs. */
    disabled?: boolean
    /** Why the picked requester is missing; empty when valid. */
    requesterError?: string
    /** Why the new contact's name is missing; empty when valid. */
    nameError?: string
    /** Why the new contact's email is missing or wrong; empty when valid. */
    emailError?: string
  }

  const props = withDefaults(defineProps<TicketRequesterFieldProps>(), {
    loading: false,
    disabled: false,
    requesterError: '',
    nameError: '',
    emailError: ''
  })

  const requesterEmail = defineModel<string>('requesterEmail', { default: '' })
  const contactName = defineModel<string>('contactName', { default: '' })
  const contactEmail = defineModel<string>('contactEmail', { default: '' })
  const newContact = defineModel<boolean>('newContact', { default: false })

  const nameEl = ref<InstanceType<typeof Input> | null>(null)

  const listOpen = ref(false)

  const focusSearch = async () => {
    document.getElementById('create-ticket-requester')?.focus({ preventScroll: true })
    await nextTick()
    listOpen.value = false
  }

  const addContact = async () => {
    newContact.value = true
    await nextTick()
    nameEl.value?.focus()
  }

  const searchContacts = async () => {
    newContact.value = false
    await nextTick()
    focusSearch()
  }

  const options = computed(() =>
    props.contacts.map((contact) => ({
      value: contact.email,
      label: contact.name,
      description: contact.email
    }))
  )

  defineExpose({
    /** Moves focus to the first requester control. */
    focus: () => (newContact.value ? nameEl.value?.focus() : focusSearch()),
    /** Closes the contact list that focusing the search opened. */
    closeList: () => {
      listOpen.value = false
    }
  })
</script>

<template>
  <SettingsRow
    v-if="!newContact"
    required
    stackable
    title="Requester"
    description="The customer who asked. Search by name or email address."
  >
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <Combobox
        id="create-ticket-requester"
        v-model="requesterEmail"
        v-model:open="listOpen"
        :options="options"
        :allow-custom="false"
        :loading="loading"
        :disabled="disabled"
        :invalid="Boolean(requesterError)"
        :aria-describedby="requesterError ? 'create-ticket-requester-message' : undefined"
        size="large"
        placeholder="Search contacts"
        aria-label="Requester"
        empty-title="No contact matches. Add a new contact instead."
        required
        clearable
      >
        <template #option="{ option }">
          <TicketPersonOption
            :name="option.label ?? option.value"
            :detail="option.value"
          />
        </template>
      </Combobox>
      <FieldError
        v-if="requesterError"
        id="create-ticket-requester-message"
        >{{ requesterError }}</FieldError
      >
      <Button
        type="button"
        label="Add new contact"
        icon="az az-user-plus"
        variant="ghost"
        size="small"
        class="self-start"
        :disabled="disabled"
        @click="addContact"
      />
    </div>
  </SettingsRow>
  <template v-else>
    <SettingsRow
      required
      stackable
      title="Contact name"
      description="A new contact, saved with the ticket. They get its emails."
    >
      <div class="flex w-full flex-col gap-(--spacing-xs)">
        <Input
          ref="nameEl"
          v-model="contactName"
          size="large"
          class="w-full"
          aria-label="Contact name"
          autocomplete="off"
          required
          :disabled="disabled"
          :invalid="Boolean(nameError)"
          :aria-describedby="nameError ? 'create-ticket-contact-name-message' : undefined"
        />
        <FieldError
          v-if="nameError"
          id="create-ticket-contact-name-message"
          >{{ nameError }}</FieldError
        >
      </div>
    </SettingsRow>
    <SettingsRow
      required
      stackable
      title="Contact email"
      description="Where the customer gets replies to this ticket."
    >
      <div class="flex w-full flex-col gap-(--spacing-xs)">
        <Input
          v-model="contactEmail"
          type="email"
          size="large"
          class="w-full"
          aria-label="Contact email"
          autocomplete="off"
          required
          :disabled="disabled"
          :invalid="Boolean(emailError)"
          :aria-describedby="emailError ? 'create-ticket-contact-email-message' : undefined"
        />
        <FieldError
          v-if="emailError"
          id="create-ticket-contact-email-message"
          >{{ emailError }}</FieldError
        >
        <Button
          type="button"
          label="Search contacts"
          icon="az az-search"
          variant="ghost"
          size="small"
          class="self-start"
          :disabled="disabled"
          @click="searchContacts"
        />
      </div>
    </SettingsRow>
  </template>
</template>
```

## `parts/ticket-person-option.vue`

```ts
<script setup lang="ts">
  import Avatar, { type AvatarPresence } from '@aziontech/webkit/avatar'

  export interface TicketPersonOptionProps {
    /** The person's or the team's name. */
    name: string
    /** A muted second line, such as an email address or the agent's groups. */
    detail?: string
    /** Whether the person is reachable now; empty when unknown or for a team. */
    presence?: AvatarPresence | ''
    /** Draws a square mark, for a team rather than a person. */
    team?: boolean
  }

  withDefaults(defineProps<TicketPersonOptionProps>(), {
    detail: '',
    presence: '',
    team: false
  })
</script>

<template>
  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
    <Avatar
      :label="name"
      :alt="name"
      :presence="presence"
      :variant="team ? 'square' : 'circle'"
      size="small"
    />
    <span class="flex min-w-0 flex-col">
      <span
        class="truncate text-label-sm text-(--text-default)"
        dir="auto"
        >{{ name }}</span
      >
      <span
        v-if="detail"
        class="truncate text-body-sm text-(--text-muted)"
        dir="auto"
        >{{ detail }}</span
      >
    </span>
  </span>
</template>
```

## `parts/ticket-request-band.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import FieldError from '@aziontech/webkit/field-error'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import type { MarkdownEditorMention } from '@aziontech/webkit/markdown-editor'
  import PriorityTag from '@aziontech/webkit/priority-tag'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { useLocale } from '@aziontech/webkit/use-locale'

  import type {
    CreateTicketChannel,
    CreateTicketPriority,
    CreateTicketType
  } from '../create-ticket.vue'
  import { channelOptions, priorityOptions, typeOptions } from '../lib/ticket-form'
  import TicketDescriptionField from './ticket-description-field.vue'

  export interface TicketRequestBandProps {
    /** The agents the description's @ menu offers. */
    mentions: MarkdownEditorMention[]
    /** Locks every control while the request runs. */
    disabled?: boolean
    /** The messages a submit found, empty for a valid field. */
    errors: { subject: string; description: string }
  }

  withDefaults(defineProps<TicketRequestBandProps>(), {
    disabled: false
  })

  const subject = defineModel<string>('subject', { default: '' })
  const description = defineModel<string>('description', { default: '' })
  const attachments = defineModel<File[]>('attachments', { default: () => [] })
  const channel = defineModel<CreateTicketChannel | ''>('channel', { default: '' })
  const type = defineModel<CreateTicketType | ''>('type', { default: '' })
  const priority = defineModel<CreateTicketPriority | ''>('priority', { default: '' })

  const { t } = useLocale()
</script>

<template>
  <SettingsGroup
    label="Request"
    hint="What the customer needs, in the words the team will read first."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            required
            stackable
            title="Subject"
            description="One line that says what is wrong or what is needed."
          >
            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Input
                v-model="subject"
                size="large"
                class="w-full"
                aria-label="Subject"
                autocomplete="off"
                required
                :disabled="disabled"
                :invalid="Boolean(errors.subject)"
                :aria-describedby="errors.subject ? 'create-ticket-subject-message' : undefined"
              />
              <FieldError
                v-if="errors.subject"
                id="create-ticket-subject-message"
                >{{ errors.subject }}</FieldError
              >
            </div>
          </SettingsRow>
          <TicketDescriptionField
            v-model="description"
            v-model:attachments="attachments"
            :mentions="mentions"
            :disabled="disabled"
            :error="errors.description"
          />
          <SettingsRow
            stackable
            title="Channel"
            description="How the request reached the team."
          >
            <Select
              v-model="channel"
              size="large"
              placeholder="Select a channel"
              aria-label="Channel"
              :disabled="disabled"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in channelOptions"
                  :key="option.value"
                  :value="option.value"
                  :icon="option.icon"
                  >{{ option.value }}</Select.Item
                >
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Type"
            description="Incidents and problems open the incident workflow."
          >
            <Select
              v-model="type"
              size="large"
              placeholder="Select a type"
              aria-label="Type"
              :disabled="disabled"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in typeOptions"
                  :key="option"
                  :value="option"
                  >{{ option }}</Select.Item
                >
              </Select.Content>
            </Select>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Priority"
            description="Sets the response target. Urgent pages the on-call agent."
          >
            <Select
              v-model="priority"
              size="large"
              placeholder="Select a priority"
              aria-label="Priority"
              :display-value="(value) => (value ? t(`priorityTag.${value}`) : '')"
              :disabled="disabled"
            >
              <Select.Trigger />
              <Select.Content>
                <Select.Item
                  v-for="option in priorityOptions"
                  :key="option"
                  :value="option"
                  ><PriorityTag :priority="option"
                /></Select.Item>
              </Select.Content>
            </Select>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/ticket-description-field.vue`

```ts
<script setup lang="ts">
  import FieldError from '@aziontech/webkit/field-error'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import MarkdownEditor, { type MarkdownEditorMention } from '@aziontech/webkit/markdown-editor'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed } from 'vue'

  export interface TicketDescriptionFieldProps {
    /** The agents the @ menu offers. */
    mentions: MarkdownEditorMention[]
    /** Locks the editor and the attachments while the request runs. */
    disabled?: boolean
    /** Why the description is missing; empty when valid. */
    error?: string
  }

  withDefaults(defineProps<TicketDescriptionFieldProps>(), {
    disabled: false,
    error: ''
  })

  const description = defineModel<string>({ default: '' })
  const attachments = defineModel<File[]>('attachments', { default: () => [] })

  const picker = useFilePicker({ multiple: true })

  const items = computed(() => attachments.value.map((file) => ({ file })))

  const attach = async () => {
    const files = await picker.open()
    if (files.length) attachments.value = [...attachments.value, ...files]
  }

  const remove = (index: number) => {
    attachments.value = attachments.value.filter((_, position) => position !== index)
  }
</script>

<template>
  <SettingsRow
    required
    variant="stacked"
    title="Description"
    description="What the customer asked, in their words where you can. Type @ to mention a teammate."
  >
    <div class="flex w-full flex-col gap-(--spacing-xs)">
      <MarkdownEditor
        id="create-ticket-description"
        v-model="description"
        aria-label="Description"
        :mentions="mentions"
        :min-rows="6"
        :disabled="disabled"
        :invalid="Boolean(error)"
        :aria-describedby="error ? 'create-ticket-description-message' : undefined"
        required
      >
        <template #footer>
          <div class="flex min-w-0 flex-1 flex-wrap items-center gap-(--spacing-xs)">
            <IconButton
              icon="az az-paperclip"
              aria-label="Attach files"
              variant="ghost"
              size="medium"
              :disabled="disabled"
              @click="attach"
            />
            <FileTokenGroup
              v-if="items.length"
              :items="items"
              orientation="horizontal"
              :readonly="disabled"
              aria-label="Attachments"
              class="min-w-0 flex-1"
              @remove="(_event, { index }) => remove(index)"
            />
          </div>
        </template>
      </MarkdownEditor>
      <FieldError
        v-if="error"
        id="create-ticket-description-message"
        >{{ error }}</FieldError
      >
    </div>
  </SettingsRow>
</template>
```

## `parts/ticket-assignment-band.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Combobox from '@aziontech/webkit/combobox'
  import Item from '@aziontech/webkit/item'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import { computed, ref, watch } from 'vue'

  import type { CreateTicketAgent, CreateTicketGroup } from '../create-ticket.vue'
  import TicketPersonOption from './ticket-person-option.vue'

  export interface TicketAssignmentBandProps {
    /** The groups a ticket can be routed to. */
    groups: CreateTicketGroup[]
    /** The agents a ticket can be assigned to. */
    agents: CreateTicketAgent[]
    /** The tags offered while tagging. */
    tagOptions: string[]
    /** Locks every control while the request runs. */
    disabled?: boolean
  }

  const props = withDefaults(defineProps<TicketAssignmentBandProps>(), {
    disabled: false
  })

  const groupId = defineModel<string>('groupId', { default: '' })
  const assigneeId = defineModel<string>('assigneeId', { default: '' })
  const tags = defineModel<string[]>('tags', { default: () => [] })

  const typed = ref<string[]>([])
  const tagChoices = computed(() => [
    ...new Set([...props.tagOptions, ...tags.value, ...typed.value])
  ])

  const addTag = (_event: MouseEvent | KeyboardEvent, tag: string) => {
    typed.value = [...typed.value, tag]
    tags.value = [...tags.value, tag]
  }

  const groupOptions = computed(() =>
    props.groups.map((group) => ({ value: group.id, label: group.name }))
  )
  const groupName = (id: string) => props.groups.find((group) => group.id === id)?.name ?? ''
  const assigneeOptions = computed(() =>
    props.agents
      .filter((agent) => !groupId.value || agent.groupIds.includes(groupId.value))
      .map((agent) => ({
        value: agent.id,
        label: agent.name,
        description: agent.groupIds.map(groupName).filter(Boolean).join(', ')
      }))
  )
  const presenceOf = (id: string) => props.agents.find((agent) => agent.id === id)?.presence ?? ''

  watch(groupId, () => {
    if (!assigneeOptions.value.some((option) => option.value === assigneeId.value))
      assigneeId.value = ''
  })
</script>

<template>
  <SettingsGroup
    label="Assignment"
    hint="Who owns the ticket. Leave it unassigned to route it to the group's queue."
  >
    <Card :padded="false">
      <template #default>
        <Item.List>
          <SettingsRow
            stackable
            title="Group"
            description="The team whose queue the ticket joins."
          >
            <Combobox
              v-model="groupId"
              :options="groupOptions"
              :allow-custom="false"
              size="large"
              placeholder="Search groups"
              aria-label="Group"
              clearable
              :disabled="disabled"
            >
              <template #option="{ option }">
                <TicketPersonOption
                  :name="option.label ?? option.value"
                  team
                />
              </template>
            </Combobox>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Assignee"
            description="The agent who answers next. Only agents in the group are listed."
          >
            <Combobox
              v-model="assigneeId"
              :options="assigneeOptions"
              :allow-custom="false"
              size="large"
              placeholder="Search agents"
              aria-label="Assignee"
              empty-title="No agent in this group matches."
              clearable
              :disabled="disabled"
            >
              <template #option="{ option }">
                <TicketPersonOption
                  :name="option.label ?? option.value"
                  :detail="option.description"
                  :presence="presenceOf(option.value)"
                />
              </template>
            </Combobox>
          </SettingsRow>
          <SettingsRow
            stackable
            title="Tags"
            description="Labels for routing rules and reports. Type a new tag and press Enter."
          >
            <MultiSelect
              v-model="tags"
              variant="chips"
              size="large"
              searchable
              allow-custom
              placeholder="Add tags"
              aria-label="Tags"
              :disabled="disabled"
              @create="addTag"
            >
              <MultiSelect.Trigger />
              <MultiSelect.Content>
                <MultiSelect.Item
                  v-for="tag in tagChoices"
                  :key="tag"
                  :value="tag"
                  >{{ tag }}</MultiSelect.Item
                >
              </MultiSelect.Content>
            </MultiSelect>
          </SettingsRow>
        </Item.List>
      </template>
    </Card>
  </SettingsGroup>
</template>
```

## `parts/ticket-loading-bands.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <div
    class="flex flex-col gap-(--layout-section-gap)"
    role="status"
    aria-label="Loading contacts and agents"
  >
    <Card
      v-for="band in 3"
      :key="band"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <div
          v-for="row in 2"
          :key="row"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <Skeleton
            width="var(--size-24)"
            height="var(--size-3)"
          />
          <Skeleton height="var(--size-10)" />
        </div>
      </div>
    </Card>
  </div>
</template>
```

## `parts/ticket-save-actions.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Kbd from '@aziontech/webkit/kbd'
  import { toAriaKeyshortcuts } from '@aziontech/webkit/use-shortcuts'

  export interface TicketSaveActionsProps {
    /** The pickers' data is still arriving; neither create button works yet. */
    loading?: boolean
    /** The create request is in flight. */
    submitting?: boolean
    /** The request in flight came from Create and add another. */
    addAnother?: boolean
  }

  withDefaults(defineProps<TicketSaveActionsProps>(), {
    loading: false,
    submitting: false,
    addAnother: false
  })

  const emit = defineEmits<{
    cancel: [event: MouseEvent]
    'add-another': [event: MouseEvent]
  }>()
</script>

<template>
  <div
    class="flex items-center gap-(--spacing-sm) max-sm:w-full max-sm:gap-(--spacing-xs) max-sm:*:flex-1"
  >
    <Button
      type="button"
      label="Cancel"
      variant="outline"
      size="medium"
      :disabled="submitting"
      @click="(event: MouseEvent) => emit('cancel', event)"
    />
    <span class="contents max-sm:hidden">
      <Button
        type="button"
        label="Create and add another"
        variant="secondary"
        size="medium"
        :disabled="loading || (submitting && !addAnother)"
        :loading="submitting && addAnother"
        @click="(event: MouseEvent) => emit('add-another', event)"
      />
    </span>
    <Button
      variant="primary"
      size="medium"
      type="submit"
      :disabled="loading || (submitting && addAnother)"
      :loading="submitting && !addAnother"
      :aria-keyshortcuts="toAriaKeyshortcuts('meta+enter')"
    >
      Create ticket
      <span
        class="contents max-sm:hidden"
        aria-hidden="true"
      >
        <Kbd
          meta
          key-name="enter"
          size="small"
        />
      </span>
    </Button>
  </div>
</template>
```

## `parts/ticket-discard-dialog.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import type { UseUnsavedChangesReturn } from '@aziontech/webkit/use-unsaved-changes'
  import { computed } from 'vue'

  export interface TicketDiscardDialogProps {
    /** The unsaved-changes guard of the form this dialog asks about. */
    guard: Pick<
      UseUnsavedChangesReturn<unknown>,
      'dialogProps' | 'labels' | 'keepEditing' | 'discardAndLeave'
    >
  }

  const props = defineProps<TicketDiscardDialogProps>()

  const dialogProps = computed(() => props.guard.dialogProps.value)
  const labels = computed(() => props.guard.labels.value)
</script>

<template>
  <ConfirmDialog
    v-bind="dialogProps"
    data-testid="unsaved-changes-dialog"
  >
    <template #actions>
      <Button
        :label="labels.keepEditing"
        variant="ghost"
        size="medium"
        data-autofocus
        @click="guard.keepEditing"
      />
      <Button
        :label="labels.discard"
        variant="danger"
        size="medium"
        @click="guard.discardAndLeave"
      />
    </template>
  </ConfirmDialog>
</template>
```

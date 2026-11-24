# DetailTicket (`detail/detail-ticket`)

> The support agent's view of one ticket, as in Zendesk Agent Workspace, a Freshdesk ticket or a Help Scout conversation. A `PageHeader` carries the subject as the h1, the ticket number, the status `Tag`, a `PriorityTag` and the next SLA as a `Countdown` (paused while Pending or On hold), and its actions: the teammates who have the ticket open (an `Avatar` with presence each and Sam Lee is viewing), Merge and a More menu (Copy link, Print, Mark as spam, Delete ticket). The main column is a `MessageThread` of the conversation (customer emails with attachments and quoted text, agent replies, internal notes, system events, the middle of a long thread collapsed behind Show N earlier messages) over the composer: a `ToggleGroup` of Reply and Internal note, the To line and a Cc `MultiSelect` for a reply, a warning-edged card that says Only your team can see internal notes for a note, a `MarkdownEditor` with @mentions of teammates, and in its footer Attach files, Insert response (saved replies), the attached files and a `SplitButton` Send with Send and set Pending and Send and set Solved (Add note for a note); files dropped on the composer attach through a `FileDropzone`. The side column, under the thread on narrow screens, holds the ticket's properties (`Field` and `Select` for status, priority, type, group and the assignee with their `Avatar`, and a `MultiSelect` of tags), the requester card (avatar, name, email, organization, other tickets and View customer profile) and the ticket's activity as a small `Timeline`. A failed load is a danger `Alert` with Retry; a failed send keeps the draft and shows an `Alert` with Retry in the composer; a solved ticket replaces the composer with Reopen. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/detail/detail-ticket/detail-ticket.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-ticket")`
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfigProvider](../../components/config-provider.md), [Countdown](../../components/countdown.md), `DropdownMenuGroup`, `DropdownMenuItem`, `DropdownMenuRoot`, `DropdownMenuTrigger`, [Field](../../components/field.md), [FileDropzone](../../components/file-dropzone.md), [FileTokenGroup](../../components/file-token-group.md), [IconButton](../../components/icon-button.md), [MarkdownEditor](../../components/markdown-editor.md), [MessageThread](../../components/message-thread.md), `MessageThreadItem`, [MultiSelect](../../components/multi-select.md), [PageHeader](../../components/page-header.md), [PriorityTag](../../components/priority-tag.md), [Select](../../components/select.md), [Skeleton](../../components/skeleton.md), [SplitButton](../../components/split-button.md), [Subheader](../../components/subheader.md), [Tag](../../components/tag.md), [Timeline](../../components/timeline.md), [ToggleGroup](../../components/toggle-group.md), [Tooltip](../../components/tooltip.md), `use-file-picker`
- Skills: `webkit-layout`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`, `webkit-errors`

## Asked as

ticket detail; ticket view; support ticket; help desk ticket; agent workspace; support conversation; reply to customer; internal note; canned responses; saved replies; ticket properties; sla countdown; collision detection; requester card; detalhe do chamado; detalhe do ticket; conversa de suporte; responder ao solicitante; nota interna; respostas prontas; propriedades do chamado; espaço de trabalho do agente

The support agent's view of one ticket. An agent reads the conversation with the customer, answers it or leaves a note for the team, sets the ticket's status, priority, group, assignee and tags, and checks who asked and what happened so far. It follows the Zendesk Agent Workspace, the Freshdesk ticket page and the Help Scout conversation, on the house detail page. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header with the breadcrumb and the `main`.

## When to use

- The page an agent opens from a ticket queue to work one ticket: reply, note, triage and close.
- Any case page where a person and a team trade messages under a deadline (an abuse report, a refund request, a partner escalation).

## When not to use

- The queue of tickets: use `view/view-ticket-inbox`, which opens this page.
- A chat with an AI assistant: use `ai/ai-chat`.
- A resource's overview with tabs and a summary card: use `detail/detail-resource`.
- A log of who did what across the account: use `account/account-activity-history`.

## Building blocks

### A. Page heading — `ConfigProvider`, `PageHeader`, `Tag`, `PriorityTag`, `Countdown`, `Skeleton` (required)

`PageHeader` at the small size: the subject is the page's only h1. Its `meta` slot holds the ticket number (`#4812`), the status as a small `Tag` (New warning, since it waits for triage; Open info; Pending and On hold neutral; Solved success, the colours of the inbox), a small `PriorityTag` and the next SLA target as a small `Countdown` labelled `Next reply`, paused while the ticket is Pending or On hold and gone once it is Solved. While the ticket loads the title reads `Ticket` and a `Skeleton` line stands in for the meta. `ConfigProvider` only fixes the clock (`now`) for the sample, a test or a server render; with a live ticket and no `now` the countdown reads the real clock.

### B. Header actions — `Avatar`, `Button`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuGroup`, `DropdownMenuItem`, `IconButton` (required)

`parts/ticket-header-actions.vue` in the header's `actions` slot. First the collision indicator: one small `Avatar` with presence for each teammate who has the ticket open (up to three) and the words `Sam Lee is viewing` (`Sam Lee and 1 other are viewing`), a polite status; on a phone the words are read but not drawn. Then Merge, an outline `Button`, and More, an outline `IconButton` that opens a menu in two groups: Copy link and Print, then Mark as spam and Delete ticket. Every menu action emits `ticket-action`; the app asks before it deletes or marks as spam.

### C. Conversation — `Subheader`, `MessageThread`, `MessageThreadItem`, `FileTokenGroup` (required)

`parts/ticket-conversation.vue` under a `Subheader` titled Conversation: one `MessageThread` named `Ticket 4812 conversation`, oldest first. Each item (`parts/ticket-message.vue`) is a `MessageThreadItem`: customer and agent replies with their channel and recipients, internal notes on their warning band, and system events as one muted line (assigned, status changed). A reply's files are a read-only horizontal `FileTokenGroup` in its `attachments` slot, and the earlier email it quotes goes in its `quoted` slot behind the toggle. A thread of more than eight items keeps the first two and the last three in view and collapses the rest into one `MessageThread.Group` (`Show 5 earlier messages`).

### D. Composer — `ToggleGroup`, `Field`, `MultiSelect`, `Alert`, `MarkdownEditor`, `FileDropzone`, `Button` (required)

`parts/ticket-composer.vue` under the thread, in one bordered card with a hidden h2 that names the mode. A small `ToggleGroup` named Message type switches between Reply and Internal note. A reply shows `To: Alex Morgan <alex.morgan@example.com>` (the requester, fixed) and a Cc `Field` with a chips `MultiSelect` of teammates' addresses that also takes a typed address (`Add "…"`). An internal note hides the recipients, turns the card's edge to `--warning-border` and says `Only your team can see internal notes.` beside a lock glyph, in words, tied to the editor with `aria-describedby`. The `MarkdownEditor` holds the draft (toolbar, Write and Preview, @mentions of teammates). Files dragged onto the card attach through an overlay `FileDropzone`. A failed send shows a small danger `Alert` with Retry above the editor and keeps the draft. A solved ticket shows `This ticket is solved. Reopen it to reply to the customer or add a note.` with an outline Reopen `Button` in place of the editor.

### E. Composer footer — `FileTokenGroup`, `Tooltip`, `IconButton`, `DropdownMenuRoot`, `DropdownMenuTrigger`, `DropdownMenuItem`, `Button`, `SplitButton` (required)

`parts/composer-footer.vue` in the editor's `footer` slot. The attached files first, as a removable horizontal `FileTokenGroup` on their own line. Then Attach files (a ghost `IconButton` with its `Tooltip`, opening the system picker through `useFilePicker`), Insert response (a ghost `Button` opening a menu of saved replies; picking one appends its text to the draft) and, at the inline end, `SplitButton` Send with Send and set Pending and Send and set Solved, or Add note (a secondary `Button` with a lock glyph) for a note. Send and Add note are disabled while the draft holds no text and no file.

### F. Properties — `Card`, `Field`, `Select`, `Avatar`, `MultiSelect`, `Skeleton` (required)

`parts/ticket-properties.vue`, the first card of the side column, titled Properties: one `Field` with a `Select` each for Status, Priority, Type and Group, then Assignee (the assignee's small `Avatar` with presence beside a `Select` of the agents, each with their presence in muted text, and Unassigned first) and Tags (a chips `MultiSelect` that also takes a new tag). Every change emits `property-change` with the field and its new value right away, as help desks do; there is no Save button. While the ticket loads the card shows six `Skeleton` rows.

### G. Requester — `Card`, `Avatar`, `Button`, `Skeleton` (required)

`parts/ticket-requester.vue`, titled Requester: the customer's `Avatar`, name and email, their organization and how many other tickets they opened (`4 other tickets`), then View customer profile, a link `Button` that emits `open-customer`.

### H. Activity — `Card`, `Timeline` (required)

`parts/ticket-activity.vue`, titled Activity: a small `Timeline` of what happened to the ticket, newest first, grouped by the day label the app formats (`Today`, `Yesterday`), with relative times; an SLA warning or an urgent priority carries its severity on the marker.

### I. Load failure — `Alert` (conditional)

A danger `Alert` with Retry takes the place of the page body; the header stays with the title `Ticket`.

## Data

The block takes its records through props and emits every action; it fetches, sends and saves nothing. `DetailTicketTicket`, `DetailTicketMessage`, `DetailTicketRequester`, `DetailTicketActivity`, `DetailTicketAgent`, `DetailTicketResponse`, `DetailTicketDraft`, `DetailTicketSendPayload`, `DetailTicketPropertyChange` and `DetailTicketProps` are exported from `detail-ticket.vue`. `sample.ts` holds the sample ticket, conversation, requester, activity, agents, viewer, saved replies, groups, tags and clock the block renders when those props are left out (none of it while `loading` or `error` is set). `lib/ticket-fields.ts` holds the statuses, types, status colours and priorities.

| Prop         | Type                     | What it does                                                                   |
| ------------ | ------------------------ | ------------------------------------------------------------------------------ |
| `ticket`     | `DetailTicketTicket`     | The ticket: subject, status, priority, type, group, assignee, tags, next SLA.  |
| `messages`   | `DetailTicketMessage[]`  | The conversation, oldest first: replies, notes and events.                     |
| `requester`  | `DetailTicketRequester`  | The customer who asked.                                                        |
| `activity`   | `DetailTicketActivity[]` | The ticket's history, newest first, each with its day label.                   |
| `agents`     | `DetailTicketAgent[]`    | The agents to assign, mention and copy, with presence.                         |
| `viewers`    | `DetailTicketAgent[]`    | The other agents who have the ticket open now; `[]` hides the indicator.       |
| `responses`  | `DetailTicketResponse[]` | The saved replies Insert response offers.                                      |
| `groups`     | `string[]`               | The groups the ticket can move to.                                             |
| `tagOptions` | `string[]`               | The tags the Tags field offers.                                                |
| `draft`      | `DetailTicketDraft`      | The composer's mode, Cc, text and files, two-way with `v-model:draft`.         |
| `now`        | `Date`                   | A fixed clock for a test or a server render. Leave it out in the app.          |
| `loading`    | `boolean`                | The ticket is loading.                                                         |
| `error`      | `string`                 | Why the ticket did not load, shown in the danger `Alert` with Retry.           |
| `sending`    | `boolean`                | The draft is being sent; the composer is busy.                                 |
| `sendError`  | `string`                 | Why the last send failed, shown in the composer with Retry; the draft is kept. |

| Event             | Payload                                      | When                                                                                            |
| ----------------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `send`            | `(event, { mode, cc, body, files, status })` | Send, a Send and set item (`status` Pending or Solved), Add note, or Retry after a failed send. |
| `property-change` | `({ field, value })`                         | A property changed; `value` is a list for tags and empty for Unassigned.                        |
| `open-customer`   | `(event, requester)`                         | View customer profile.                                                                          |
| `merge`           | `(event, ticket)`                            | Merge.                                                                                          |
| `ticket-action`   | `(event, action)`                            | A More menu action: `copy-link`, `print`, `spam` or `delete`.                                   |
| `reopen`          | `(event, ticket)`                            | Reopen on a solved ticket.                                                                      |
| `retry`           | `(event)`                                    | Retry in the load error alert.                                                                  |
| `update:draft`    | `(draft)`                                    | The agent changed the draft.                                                                    |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import DetailTicket from './detail-ticket.vue'

  const { ticket, messages, requester, activity, agents, viewers, pending, error, refresh } =
    useTicket()
  const { draft, sending, sendError, send } = useTicketReply()
  const loadError = 'The ticket could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <DetailTicket
    v-model:draft="draft"
    :ticket="ticket"
    :messages="messages ?? []"
    :requester="requester"
    :activity="activity ?? []"
    :agents="agents"
    :viewers="viewers ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    :sending="sending"
    :send-error="sendError"
    @send="(event, payload) => send(payload)"
    @retry="refresh"
  />
</template>
```

After a send succeeds, clear the draft, append the message and confirm in a toast; after a failure, keep the draft and set `sendError`. Then delete `sample.ts` and its import.

## Do

- Keep the draft when a send fails, and say that it is kept.
- Say in words that a note is internal, not only with the warning colour.
- Pause the SLA countdown while the ticket waits on the customer, and hide it once the ticket is solved.
- Save a property change as soon as it is made and confirm a failure in a toast from the app.
- Ask before Delete ticket and Mark as spam: open a danger confirm dialog from the `ticket-action` handler.

## Don't

- Don't send a reply and a note from one button: the mode decides who reads it.
- Don't let the composer accept text on a solved ticket: reopen it first.
- Don't hide the earlier messages of a short thread; collapse only past eight items.
- Don't show presence by colour alone: the assignee's avatar says it in its name, and each assignee option says it in words.

## Copy

- **Title:** the ticket's subject; `Ticket` while it loads. **Number:** `#4812`.
- **Statuses:** `New`, `Open`, `Pending`, `On hold`, `Solved`. **SLA:** `Next reply`.
- **Viewers:** `Sam Lee is viewing`, `Sam Lee and 1 other are viewing`. **Actions:** `Merge`, `More ticket actions`, `Copy link`, `Print`, `Mark as spam`, `Delete ticket`.
- **Composer:** `Reply`, `Internal note`, `To:`, `Cc`, `Add people to copy`, `Only your team can see internal notes.`, `Write a reply`, `Write a note for your team, @ to mention`, `Attach files`, `Drop files to attach them`, `Insert response`, `Send`, `Send and set Pending`, `Send and set Solved`, `Add note`, `Write the note first.`
- **Send failure:** `The reply was not sent. Your draft is kept; try again.` with `Retry`. **Solved:** `This ticket is solved. Reopen it to reply to the customer or add a note.` with `Reopen`.
- **Side column:** `Properties`, `Status`, `Priority`, `Type`, `Group`, `Assignee`, `Unassigned`, `Tags`, `Add tags`; `Requester`, `4 other tickets`, `View customer profile`; `Activity`.
- **Load failure:** `The ticket could not be loaded. Nothing was changed; try again.` with `Retry`.
- The components own `Show 5 earlier messages`, `Internal note` on a note, `Paused`, `Due in` and `Overdue by`; do not retype them. Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` or landmark of its own: `ConsoleLayout` owns them. Headings: the subject is the only h1; Conversation, the composer (Reply or Internal note, hidden), Properties, Requester and Activity are h2. The side column is an `aside` named Ticket details.
- Focus order: Merge and More in the header, the thread (Show earlier messages, the quoted-text toggles), the composer (Message type, Cc, the editor and its toolbar, Attach files, Insert response, Send and its menu), then Properties, View customer profile and the activity.
- Announcements: the viewing line is a polite status; Send and Add note announce their busy state; a failed send is the `Alert`; a successful send comes from the app's toast. Switching to Internal note renames the composer and describes the editor with the lock line.
- Presence is part of each avatar's accessible name (`Sam Lee, online`). Priority and status are text, never colour alone.
- Names keep their own direction (`bdi`) and the ticket number and addresses read left to right (`dir="ltr"`) inside a right-to-left page.
- At 320 px the side column stacks under the composer, the header actions wrap, the file tokens take their own line and Send stays at the inline end; nothing scrolls sideways.

## States

- Default: ticket #4812, Open and urgent with the Next reply countdown running, Sam Lee viewing, a ten-item thread with five earlier items collapsed, the composer on Reply, the sample clock fixed.
- Loading: the ticket is loading (`loading`); skeletons in the header, the thread, the properties, the requester and the activity, and a disabled composer.
- Error: the ticket did not load (`error` is set); a danger Alert with the message and Retry.
- Sending: a reply is on its way (`sending` with a draft); Send spins and the editor is read-only.
- SendError: the reply was not sent (`sendError` with a draft); the Alert with Retry above the kept draft.
- Solved: the ticket is solved (`ticket.status` is Solved); no countdown, and Reopen in place of the composer.
- InternalNote: the composer on Internal note (`draft.mode` is note) with a draft that mentions a teammate; the lock line and Add note.

## Related

- `view/view-ticket-inbox` — the queue that opens this page.
- `detail/detail-resource` — the house detail page for a resource.
- `account/account-activity-history` — the account-wide log of who did what.

## Variants

- `Default` — primary (the code below)
- `Loading` — The ticket is loading: the header shows Ticket with a placeholder line, the thread, the properties, the requester and the activity show their skeletons and the composer is disabled.
- `Error` — The ticket could not load: the header stays and a danger Alert with Retry takes the page body's place.
- `Sending` — A reply is on its way: Send spins, the editor is read-only and the composer is marked busy, with the draft still in view.
- `SendError` — The reply was not sent: the composer keeps the draft and shows a danger Alert with Retry above the editor.
- `Solved` — A solved ticket: the status Tag reads Solved, the SLA countdown is gone and the composer gives way to This ticket is solved with Reopen.
- `InternalNote` — The composer on Internal note: the warning edge, the lock line Only your team can see internal notes, no recipients, a draft that mentions a teammate and Add note in place of Send.

Each variant is the same screen in another state: `get_block("detail/detail-ticket", { variant })`, or the file under `blocks/detail/detail-ticket/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { AvatarPresence } from '@aziontech/webkit/avatar'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import Countdown from '@aziontech/webkit/countdown'
  import type {
    MessageThreadChannel,
    MessageThreadFrom,
    MessageThreadItemType
  } from '@aziontech/webkit/message-thread'
  import PageHeader from '@aziontech/webkit/page-header'
  import PriorityTag, { type PriorityTagPriority } from '@aziontech/webkit/priority-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import type { TimelineItemSeverity } from '@aziontech/webkit/timeline'
  import { computed } from 'vue'

  import { slaPaused, statusSeverity } from './lib/ticket-fields'
  import TicketActivity from './parts/ticket-activity.vue'
  import TicketComposer from './parts/ticket-composer.vue'
  import TicketConversation from './parts/ticket-conversation.vue'
  import TicketHeaderActions from './parts/ticket-header-actions.vue'
  import TicketProperties from './parts/ticket-properties.vue'
  import TicketRequester from './parts/ticket-requester.vue'
  import {
    sampleActivity,
    sampleAgents,
    sampleGroups,
    sampleMessages,
    sampleNow,
    sampleRequester,
    sampleResponses,
    sampleTagOptions,
    sampleTicket,
    sampleViewers
  } from './sample'

  /** Where a ticket stands in its lifecycle. */
  export type DetailTicketStatus = 'New' | 'Open' | 'Pending' | 'On hold' | 'Solved'

  /** What kind of request the ticket is. */
  export type DetailTicketType = 'Question' | 'Incident' | 'Problem' | 'Task'

  /** Whether the composer writes to the customer or to the team. */
  export type DetailTicketReplyMode = 'reply' | 'note'

  /** A ticket property the side column edits. */
  export type DetailTicketField = 'status' | 'priority' | 'type' | 'group' | 'assignee' | 'tags'

  /** An action of the More menu. */
  export type DetailTicketAction = 'copy-link' | 'print' | 'spam' | 'delete'

  /** The ticket itself. */
  export interface DetailTicketTicket {
    /** Ticket number, the stable key. */
    id: string
    /** The request's subject line. */
    subject: string
    /** Where the ticket stands. */
    status: DetailTicketStatus
    /** How urgent it is. */
    priority: PriorityTagPriority
    /** What kind of request it is. */
    type: DetailTicketType
    /** The team that owns it. */
    group: string
    /** Name of the assigned agent; empty when unassigned. */
    assignee: string
    /** Labels set by agents or rules. */
    tags: string[]
    /** Name of the SLA target that runs next, such as Next reply. */
    slaLabel: string
    /** When the next SLA target is due; null when no target runs. */
    slaDueAt: Date | null
  }

  /** A file attached to a message. */
  export interface DetailTicketAttachment {
    /** File name with its extension. */
    name: string
    /** Size in bytes. */
    size: number
  }

  /** One item of the conversation. */
  export interface DetailTicketMessage {
    /** Stable key. */
    id: string
    /** A public reply, an internal note or a system event. */
    type: MessageThreadItemType
    /** Who wrote it; empty for an event. */
    author: string
    /** Whether the author is the customer or an agent. */
    from: MessageThreadFrom
    /** How a reply came in or went out; empty for a note or an event. */
    channel: MessageThreadChannel | ''
    /** When it was sent. */
    sentAt: Date
    /** Addresses the reply went to. */
    to: string[]
    /** Addresses copied on the reply. */
    cc: string[]
    /** The message text, or the event sentence. */
    body: string
    /** The earlier email the reply quotes; empty when none. */
    quoted: string
    /** Files attached to the message. */
    attachments: DetailTicketAttachment[]
  }

  /** The customer who asked. */
  export interface DetailTicketRequester {
    /** Full name. */
    name: string
    /** Email address. */
    email: string
    /** Organization the customer belongs to. */
    organization: string
    /** How many other tickets the customer opened. */
    otherTickets: number
  }

  /** One entry of the ticket's activity. */
  export interface DetailTicketActivity {
    /** Stable key. */
    id: string
    /** The day header it is listed under, formatted by the app. */
    day: string
    /** What happened. */
    title: string
    /** Who did it. */
    actor: string
    /** When it happened. */
    time: Date
    /** What it means for the reader. */
    severity: TimelineItemSeverity
    /** Icon class drawn as the marker; empty draws the dot. */
    icon: string
  }

  /** A teammate: an assignee, a mention, a viewer. */
  export interface DetailTicketAgent {
    /** Full name. */
    name: string
    /** Handle inserted after the at sign. */
    handle: string
    /** Email address. */
    email: string
    /** Whether the agent is reachable now; empty when unknown. */
    presence: AvatarPresence | ''
  }

  /** A saved reply the composer can insert. */
  export interface DetailTicketResponse {
    /** Stable key. */
    key: string
    /** Name shown in the menu. */
    label: string
    /** Markdown inserted into the draft. */
    body: string
  }

  /** What the composer holds. */
  export interface DetailTicketDraft {
    /** Reply to the customer or internal note. */
    mode: DetailTicketReplyMode
    /** Addresses copied on a reply. */
    cc: string[]
    /** Markdown text. */
    body: string
    /** Files attached to the draft. */
    files: File[]
  }

  /** What Send carries. */
  export interface DetailTicketSendPayload extends DetailTicketDraft {
    /** Status to set with the reply; empty keeps the current one. */
    status: '' | 'Pending' | 'Solved'
  }

  /** A property edited in the side column. */
  export interface DetailTicketPropertyChange {
    /** Which property. */
    field: DetailTicketField
    /** Its new value; a list for tags, empty for Unassigned. */
    value: string | string[]
  }

  export interface DetailTicketProps {
    /** The ticket. Left out, the sample renders. */
    ticket?: DetailTicketTicket
    /** The conversation, oldest first. Left out, the sample renders. */
    messages?: DetailTicketMessage[]
    /** The customer who asked. Left out, the sample renders. */
    requester?: DetailTicketRequester
    /** The ticket's activity, newest first. Left out, the sample renders. */
    activity?: DetailTicketActivity[]
    /** Agents to assign, mention and copy. Left out, the sample agents render. */
    agents?: DetailTicketAgent[]
    /** Other agents who have the ticket open now. */
    viewers?: DetailTicketAgent[]
    /** Saved replies Insert response offers. */
    responses?: DetailTicketResponse[]
    /** Groups the ticket can move to. */
    groups?: string[]
    /** Tags offered in the Tags field. */
    tagOptions?: string[]
    /** A fixed moment the SLA countdown and relative times read (a test, a server render). */
    now?: Date
    /** The ticket is loading. */
    loading?: boolean
    /** Why the ticket could not load; a danger alert with Retry replaces the page body. */
    error?: string
    /** The draft is being sent; the composer is busy. */
    sending?: boolean
    /** Why the last send failed; the composer keeps the draft and offers Retry. */
    sendError?: string
  }

  const props = withDefaults(defineProps<DetailTicketProps>(), {
    ticket: undefined,
    messages: undefined,
    requester: undefined,
    activity: undefined,
    agents: undefined,
    viewers: undefined,
    responses: undefined,
    groups: undefined,
    tagOptions: undefined,
    now: undefined,
    loading: false,
    error: '',
    sending: false,
    sendError: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, payload: DetailTicketSendPayload]
    'property-change': [change: DetailTicketPropertyChange]
    'open-customer': [event: MouseEvent, requester: DetailTicketRequester]
    merge: [event: MouseEvent, ticket: DetailTicketTicket]
    'ticket-action': [event: MouseEvent | KeyboardEvent, action: DetailTicketAction]
    reopen: [event: MouseEvent, ticket: DetailTicketTicket]
    retry: [event: MouseEvent]
  }>()

  const draft = defineModel<DetailTicketDraft>('draft', {
    default: () => ({ mode: 'reply', cc: [], body: '', files: [] })
  })

  const blank = computed(() => props.loading || props.error !== '')
  const list = <T,>(value: T[] | undefined, sample: T[]): T[] =>
    value ?? (blank.value ? [] : sample)
  const one = <T,>(value: T | undefined, sample: T): T | undefined =>
    value ?? (blank.value ? undefined : sample)

  const current = computed(() => one(props.ticket, sampleTicket))
  const customer = computed(() => one(props.requester, sampleRequester))
  const thread = computed(() => list(props.messages, sampleMessages))
  const history = computed(() => list(props.activity, sampleActivity))
  const team = computed(() => list(props.agents, sampleAgents))
  const watching = computed(() => list(props.viewers, sampleViewers))
  const saved = computed(() => list(props.responses, sampleResponses))
  const groupList = computed(() => list(props.groups, sampleGroups))
  const tagList = computed(() => list(props.tagOptions, sampleTagOptions))
  const clock = computed(
    () => props.now ?? (props.ticket || props.loading || props.error ? undefined : sampleNow)
  )

  const withTicket =
    <E,>(handler: (event: E, ticket: DetailTicketTicket) => void) =>
    (event: E) => {
      if (current.value) handler(event, current.value)
    }
  const onMerge = withTicket<MouseEvent>((event, ticket) => emit('merge', event, ticket))
  const onReopen = withTicket<MouseEvent>((event, ticket) => emit('reopen', event, ticket))
</script>

<template>
  <ConfigProvider :now="clock">
    <div class="layout-boundary">
      <div class="layout-column flex min-h-full min-w-0 flex-col">
        <PageHeader
          :title="current?.subject ?? 'Ticket'"
          size="small"
        >
          <template #meta>
            <div
              v-if="current"
              class="flex flex-wrap items-center gap-(--spacing-xs)"
            >
              <span
                class="text-body-sm text-(--text-muted)"
                dir="ltr"
                >#{{ current.id }}</span
              >
              <Tag
                :label="current.status"
                :severity="statusSeverity[current.status]"
                size="small"
              />
              <PriorityTag
                :priority="current.priority"
                size="small"
              />
              <Countdown
                v-if="current.status !== 'Solved'"
                :label="current.slaLabel"
                :deadline="current.slaDueAt ?? undefined"
                :paused="slaPaused(current)"
                size="small"
              />
            </div>
            <Skeleton
              v-else-if="loading"
              width="16rem"
              height="1.25rem"
            />
          </template>
          <template
            v-if="current"
            #actions
          >
            <TicketHeaderActions
              :viewers="watching"
              @merge="onMerge"
              @action="(event, action) => emit('ticket-action', event, action)"
            />
          </template>
        </PageHeader>

        <section class="layout-section-start @container/ticket flex min-w-0 flex-col">
          <Alert
            v-if="error"
            severity="danger"
            :label="error"
            action-label="Retry"
            @action="(event: MouseEvent) => emit('retry', event)"
          />
          <div
            v-else
            class="grid min-w-0 grid-cols-1 items-start gap-(--layout-section-gap) @4xl/ticket:grid-cols-[minmax(0,1fr)_var(--container-xs)]"
          >
            <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
              <TicketConversation
                :messages="thread"
                :ticket-id="current?.id ?? ''"
                :loading="loading"
              />
              <TicketComposer
                v-model:draft="draft"
                :requester="customer"
                :agents="team"
                :responses="saved"
                :solved="current?.status === 'Solved'"
                :disabled="loading"
                :sending="sending"
                :send-error="sendError"
                @send="(event, payload) => emit('send', event, payload)"
                @reopen="onReopen"
              />
            </div>
            <aside
              class="flex min-w-0 flex-col gap-(--layout-group-gap)"
              aria-label="Ticket details"
            >
              <TicketProperties
                :ticket="current"
                :agents="team"
                :groups="groupList"
                :tag-options="tagList"
                :loading="loading"
                @change="(change) => emit('property-change', change)"
              />
              <TicketRequester
                :requester="customer"
                :loading="loading"
                @open="(event, requester) => emit('open-customer', event, requester)"
              />
              <TicketActivity
                :activity="history"
                :loading="loading"
              />
            </aside>
          </div>
        </section>
      </div>
    </div>
  </ConfigProvider>
</template>
```

## `sample.ts`

```ts
import type {
  DetailTicketActivity,
  DetailTicketAgent,
  DetailTicketMessage,
  DetailTicketRequester,
  DetailTicketResponse,
  DetailTicketTicket
} from './detail-ticket.vue'

const MINUTE = 60_000
const HOUR = 60 * MINUTE

export const sampleNow = new Date(Date.UTC(2026, 10, 10, 12))
const ago = (ms: number) => new Date(sampleNow.getTime() - ms)
const ahead = (ms: number) => new Date(sampleNow.getTime() + ms)

export const sampleAgents: DetailTicketAgent[] = [
  { name: 'Jane Doe', handle: 'jane.doe', email: 'jane.doe@example.com', presence: 'online' },
  { name: 'John Smith', handle: 'john.smith', email: 'john.smith@example.com', presence: 'away' },
  {
    name: 'Priya Patel',
    handle: 'priya.patel',
    email: 'priya.patel@example.com',
    presence: 'busy'
  },
  { name: 'Sam Lee', handle: 'sam.lee', email: 'sam.lee@example.com', presence: 'online' }
]

export const sampleViewers: DetailTicketAgent[] = sampleAgents.filter(
  (agent) => agent.name === 'Sam Lee'
)

export const sampleTicket: DetailTicketTicket = {
  id: '4812',
  subject: 'Custom domain returns a certificate error',
  status: 'Open',
  priority: 'urgent',
  type: 'Incident',
  group: 'Technical',
  assignee: 'Jane Doe',
  tags: ['certificates', 'domains'],
  slaLabel: 'Next reply',
  slaDueAt: ahead(25 * MINUTE)
}

export const sampleRequester: DetailTicketRequester = {
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  organization: 'Acme Inc.',
  otherTickets: 4
}

const customer = { author: 'Alex Morgan', from: 'customer' as const }
const jane = { author: 'Jane Doe', from: 'agent' as const }
const reply = { type: 'reply' as const, quoted: '', attachments: [] }
const toSupport = { to: ['support@example.com'], cc: [] }
const toAlex = { to: ['alex.morgan@example.com'], cc: [] }
const event = (id: string, body: string, sentAt: Date): DetailTicketMessage => ({
  id,
  type: 'event',
  author: '',
  from: 'agent',
  channel: '',
  sentAt,
  to: [],
  cc: [],
  body,
  quoted: '',
  attachments: []
})

export const sampleMessages: DetailTicketMessage[] = [
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm1',
    channel: 'email',
    sentAt: ago(26 * HOUR),
    cc: ['sam.lee@example.com'],
    body: 'Since this morning shop.example.com shows a certificate error in every browser. The certificate looks expired, but it should renew on its own.\n\nThe screenshot from Chrome is attached.',
    attachments: [{ name: 'certificate-error.png', size: 248_000 }]
  },
  event('m2', 'Jane Doe assigned the ticket to herself', ago(25 * HOUR)),
  {
    ...reply,
    ...jane,
    ...toAlex,
    id: 'm3',
    channel: 'email',
    sentAt: ago(24 * HOUR),
    body: 'Thanks, Alex. I can see the certificate for shop.example.com expired yesterday. Can you confirm the domain still points to Acme through the CNAME record?',
    quoted:
      'On Nov 9, Alex Morgan wrote: Since this morning shop.example.com shows a certificate error in every browser.'
  },
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm4',
    channel: 'email',
    sentAt: ago(22 * HOUR),
    body: 'Yes, the CNAME still points to acme-store.example.net. Nothing changed on our side.'
  },
  {
    ...reply,
    ...jane,
    id: 'm5',
    type: 'note',
    channel: '',
    to: [],
    cc: [],
    sentAt: ago(21 * HOUR),
    body: 'The renewal failed because the DNS check timed out. @sam.lee can you look at the validation logs for this zone?'
  },
  event('m6', 'Jane Doe changed the status to Pending', ago(21 * HOUR)),
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm7',
    channel: 'email',
    sentAt: ago(3 * HOUR),
    body: 'Any update? Customers are still seeing the warning at checkout.'
  },
  event('m8', 'The status changed to Open when Alex Morgan replied', ago(3 * HOUR)),
  {
    ...reply,
    author: 'Sam Lee',
    from: 'agent',
    id: 'm9',
    type: 'note',
    channel: '',
    to: [],
    cc: [],
    sentAt: ago(2 * HOUR),
    body: 'Validation retried and passed. The new certificate is issued and should reach every edge location within the hour.'
  },
  {
    ...reply,
    ...customer,
    ...toSupport,
    id: 'm10',
    channel: 'email',
    sentAt: ago(40 * MINUTE),
    body: 'It works in Chrome now, but Safari still shows the old certificate. Is that expected?'
  }
]

export const sampleActivity: DetailTicketActivity[] = [
  {
    id: 'a1',
    day: 'Today',
    title: 'Next reply due in 25 minutes',
    actor: 'SLA policy',
    time: ago(40 * MINUTE),
    severity: 'warning',
    icon: 'az az-clock'
  },
  {
    id: 'a2',
    day: 'Today',
    title: 'Status changed to Open',
    actor: 'Alex Morgan',
    time: ago(3 * HOUR),
    severity: 'info',
    icon: ''
  },
  {
    id: 'a3',
    day: 'Yesterday',
    title: 'Status changed to Pending',
    actor: 'Jane Doe',
    time: ago(21 * HOUR),
    severity: 'neutral',
    icon: ''
  },
  {
    id: 'a4',
    day: 'Yesterday',
    title: 'Priority set to Urgent',
    actor: 'Jane Doe',
    time: ago(25 * HOUR),
    severity: 'danger',
    icon: ''
  },
  {
    id: 'a5',
    day: 'Yesterday',
    title: 'Assigned to Jane Doe',
    actor: 'Jane Doe',
    time: ago(25 * HOUR),
    severity: 'neutral',
    icon: 'az az-user'
  },
  {
    id: 'a6',
    day: 'Yesterday',
    title: 'Ticket created by email',
    actor: 'Alex Morgan',
    time: ago(26 * HOUR),
    severity: 'neutral',
    icon: 'az az-mail'
  }
]

export const sampleResponses: DetailTicketResponse[] = [
  {
    key: 'certificate-renewed',
    label: 'Certificate renewed',
    body: 'The certificate for your domain was renewed. Browsers may keep the old one for a few minutes; a hard refresh picks up the new one.'
  },
  {
    key: 'need-details',
    label: 'Ask for details',
    body: 'Could you send the full URL, the time it happened and a screenshot of the error?'
  },
  {
    key: 'closing',
    label: 'Closing the ticket',
    body: 'I will mark this ticket as solved. Reply to this email if anything comes up and it reopens.'
  }
]

export const sampleGroups = ['Accounts', 'Billing', 'Technical']

export const sampleTagOptions = ['certificates', 'cache', 'dns', 'domains', 'firewall', 'invoice']
```

## `lib/ticket-fields.ts`

```ts
import type { TagSeverity } from '@aziontech/webkit/tag'

import type {
  DetailTicketActivity,
  DetailTicketStatus,
  DetailTicketTicket,
  DetailTicketType
} from '../detail-ticket.vue'

export const TICKET_STATUSES: DetailTicketStatus[] = ['New', 'Open', 'Pending', 'On hold', 'Solved']

export const TICKET_TYPES: DetailTicketType[] = ['Question', 'Incident', 'Problem', 'Task']

export const statusSeverity: Record<DetailTicketStatus, TagSeverity> = {
  New: 'warning',
  Open: 'info',
  Pending: 'neutral',
  'On hold': 'neutral',
  Solved: 'success'
}

export const priorityOptions = [
  { value: 'urgent', label: 'Urgent' },
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
  { value: 'none', label: 'No priority' }
] as const

export const slaPaused = (ticket: DetailTicketTicket) =>
  ticket.status === 'Pending' || ticket.status === 'On hold'

export const activityDays = (items: DetailTicketActivity[]) => {
  const days = new Map<string, DetailTicketActivity[]>()
  for (const item of items) days.set(item.day, [...(days.get(item.day) ?? []), item])
  return [...days].map(([label, entries]) => ({ label, items: entries }))
}
```

## `parts/ticket-header-actions.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import { computed } from 'vue'

  import type { DetailTicketAction, DetailTicketAgent } from '../detail-ticket.vue'

  export interface TicketHeaderActionsProps {
    /** Other agents who have the ticket open now. */
    viewers: DetailTicketAgent[]
  }

  const props = defineProps<TicketHeaderActionsProps>()

  const emit = defineEmits<{
    merge: [event: MouseEvent]
    action: [event: MouseEvent | KeyboardEvent, action: DetailTicketAction]
  }>()

  const shown = computed(() => props.viewers.slice(0, 3))

  const viewing = computed(() => {
    const [first, ...rest] = props.viewers
    if (!first) return ''
    if (!rest.length) return `${first.name} is viewing`
    return `${first.name} and ${rest.length} ${rest.length === 1 ? 'other' : 'others'} are viewing`
  })

  const onSelect = (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) =>
    emit('action', event, String(value) as DetailTicketAction)
</script>

<template>
  <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
    <div
      v-if="viewers.length"
      class="flex min-w-0 items-center gap-(--spacing-xs)"
    >
      <div
        class="flex shrink-0 items-center gap-(--spacing-2xs)"
        aria-hidden="true"
      >
        <Avatar
          v-for="viewer in shown"
          :key="viewer.email"
          :label="viewer.name"
          :alt="viewer.name"
          :presence="viewer.presence"
          size="small"
        />
      </div>
      <span
        class="truncate text-body-sm text-(--text-muted) max-sm:sr-only"
        role="status"
        >{{ viewing }}</span
      >
    </div>
    <Button
      label="Merge"
      icon="az az-git-merge"
      variant="outline"
      size="medium"
      @click="(event: MouseEvent) => emit('merge', event)"
    />
    <DropdownMenuRoot
      side="bottom"
      align="end"
      @select="onSelect"
    >
      <DropdownMenuTrigger>
        <IconButton
          icon="az az-ellipsis"
          variant="outline"
          size="medium"
          aria-label="More ticket actions"
        />
      </DropdownMenuTrigger>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="copy-link"
          label="Copy link"
        >
          <template #leading
            ><i
              class="az az-link"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          value="print"
          label="Print"
        >
          <template #leading
            ><i
              class="az az-print"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuGroup>
        <DropdownMenuItem
          value="spam"
          label="Mark as spam"
        >
          <template #leading
            ><i
              class="az az-ban"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
        <DropdownMenuItem
          value="delete"
          label="Delete ticket"
          severity="danger"
        >
          <template #leading
            ><i
              class="az az-trash text-(--danger-mark)"
              aria-hidden="true"
          /></template>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuRoot>
  </div>
</template>
```

## `parts/ticket-conversation.vue`

```ts
<script setup lang="ts">
  import MessageThread from '@aziontech/webkit/message-thread'
  import Subheader from '@aziontech/webkit/subheader'
  import { computed } from 'vue'

  import type { DetailTicketMessage } from '../detail-ticket.vue'
  import TicketMessage from './ticket-message.vue'

  export interface TicketConversationProps {
    /** The conversation, oldest first. */
    messages: DetailTicketMessage[]
    /** Ticket number, read in the list's name. */
    ticketId: string
    /** The conversation is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketConversationProps>(), { loading: false })

  const COLLAPSE_AFTER = 8
  const KEEP_FIRST = 2
  const KEEP_LAST = 3

  const collapsed = computed(() => props.messages.length > COLLAPSE_AFTER)
  const head = computed(() =>
    collapsed.value ? props.messages.slice(0, KEEP_FIRST) : props.messages
  )
  const earlier = computed(() =>
    collapsed.value ? props.messages.slice(KEEP_FIRST, -KEEP_LAST) : []
  )
  const latest = computed(() => (collapsed.value ? props.messages.slice(-KEEP_LAST) : []))
  const label = computed(() =>
    props.ticketId ? `Ticket ${props.ticketId} conversation` : 'Conversation'
  )
</script>

<template>
  <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Subheader title="Conversation" />
    <MessageThread
      :aria-label="label"
      timestamp-format="relative"
      :loading="loading"
    >
      <TicketMessage
        v-for="message in head"
        :key="message.id"
        :message="message"
      />
      <MessageThread.Group
        v-if="earlier.length"
        :count="earlier.length"
      >
        <TicketMessage
          v-for="message in earlier"
          :key="message.id"
          :message="message"
        />
      </MessageThread.Group>
      <TicketMessage
        v-for="message in latest"
        :key="message.id"
        :message="message"
      />
    </MessageThread>
  </section>
</template>
```

## `parts/ticket-message.vue`

```ts
<script setup lang="ts">
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import MessageThreadItem from '@aziontech/webkit/message-thread-item'
  import { computed } from 'vue'

  import type { DetailTicketMessage } from '../detail-ticket.vue'

  export interface TicketMessageProps {
    /** The conversation item. */
    message: DetailTicketMessage
  }

  const props = defineProps<TicketMessageProps>()

  const files = computed(() => props.message.attachments.map((file) => ({ file })))
</script>

<template>
  <MessageThreadItem
    :type="message.type"
    :author="message.author"
    :from="message.from"
    :channel="message.channel || undefined"
    :timestamp="message.sentAt"
    :to="message.to"
    :cc="message.cc"
  >
    {{ message.body }}
    <template
      v-if="files.length"
      #attachments
    >
      <FileTokenGroup
        :items="files"
        orientation="horizontal"
        readonly
      />
    </template>
    <template
      v-if="message.quoted"
      #quoted
      >{{ message.quoted }}</template
    >
  </MessageThreadItem>
</template>
```

## `parts/ticket-composer.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import FileDropzone from '@aziontech/webkit/file-dropzone'
  import MarkdownEditor from '@aziontech/webkit/markdown-editor'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, ref, useId } from 'vue'

  import type {
    DetailTicketAgent,
    DetailTicketDraft,
    DetailTicketReplyMode,
    DetailTicketRequester,
    DetailTicketResponse,
    DetailTicketSendPayload
  } from '../detail-ticket.vue'
  import ComposerFooter from './composer-footer.vue'

  export interface TicketComposerProps {
    /** The customer a reply goes to. */
    requester?: DetailTicketRequester
    /** Teammates to mention and copy. */
    agents: DetailTicketAgent[]
    /** Saved replies Insert response offers. */
    responses: DetailTicketResponse[]
    /** The ticket is solved: the composer offers Reopen instead. */
    solved?: boolean
    /** The composer cannot be used yet (the ticket is loading). */
    disabled?: boolean
    /** The draft is being sent. */
    sending?: boolean
    /** Why the last send failed. */
    sendError?: string
  }

  const props = withDefaults(defineProps<TicketComposerProps>(), {
    requester: undefined,
    solved: false,
    disabled: false,
    sending: false,
    sendError: ''
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, payload: DetailTicketSendPayload]
    reopen: [event: MouseEvent]
  }>()

  const draft = defineModel<DetailTicketDraft>('draft', { required: true })

  const noteId = useId()
  const titleId = useId()
  const picker = useFilePicker({ multiple: true })
  const lastStatus = ref<DetailTicketSendPayload['status']>('')
  const extraAddresses = ref<string[]>([])

  const patch = (change: Partial<DetailTicketDraft>) => {
    draft.value = { ...draft.value, ...change }
  }

  const modes = [
    { label: 'Reply', value: 'reply' },
    { label: 'Internal note', value: 'note' }
  ]

  const mode = computed<DetailTicketReplyMode>({
    get: () => draft.value.mode,
    set: (value) => patch({ mode: value ?? 'reply' })
  })
  const cc = computed<string[]>({
    get: () => draft.value.cc,
    set: (value) => patch({ cc: value })
  })
  const body = computed<string>({
    get: () => draft.value.body,
    set: (value) => patch({ body: value })
  })

  const isNote = computed(() => draft.value.mode === 'note')
  const empty = computed(() => !draft.value.body.trim() && !draft.value.files.length)
  const busy = computed(() => props.disabled || props.sending)
  const mentions = computed(() =>
    props.agents.map((agent) => ({
      value: agent.handle,
      label: agent.name,
      description: agent.email
    }))
  )
  const addresses = computed(() => [
    ...new Set([...props.agents.map((agent) => agent.email), ...extraAddresses.value, ...cc.value])
  ])

  const addAddress = (_event: MouseEvent | KeyboardEvent, value: string) => {
    extraAddresses.value = [...extraAddresses.value, value]
    cc.value = [...cc.value, value]
  }

  const addFiles = (files: File[]) => {
    if (files.length) patch({ files: [...draft.value.files, ...files] })
  }

  const attach = async () => addFiles(await picker.open())

  const removeFile = (_event: MouseEvent, index: number) =>
    patch({ files: draft.value.files.filter((_, position) => position !== index) })

  const insert = (_event: MouseEvent | KeyboardEvent, response: DetailTicketResponse) =>
    patch({
      body: draft.value.body.trim() ? `${draft.value.body}\n\n${response.body}` : response.body
    })

  const send = (event: MouseEvent | KeyboardEvent, status: DetailTicketSendPayload['status']) => {
    lastStatus.value = status
    emit('send', event, { ...draft.value, status: isNote.value ? '' : status })
  }
</script>

<template>
  <section
    class="flex min-w-0 flex-col gap-(--spacing-sm)"
    :aria-labelledby="titleId"
  >
    <h2
      :id="titleId"
      class="sr-only"
    >
      {{ isNote ? 'Internal note' : 'Reply' }}
    </h2>

    <div
      v-if="solved"
      class="flex flex-wrap items-center justify-between gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md)"
    >
      <p class="text-body-md text-(--text-muted)">
        This ticket is solved. Reopen it to reply to the customer or add a note.
      </p>
      <Button
        label="Reopen"
        icon="az az-lock-open"
        variant="outline"
        size="medium"
        @click="(event: MouseEvent) => emit('reopen', event)"
      />
    </div>

    <div
      v-else
      class="relative flex min-w-0 flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-md) data-[mode=note]:border-(--warning-border)"
      :data-mode="draft.mode"
      :aria-busy="sending || undefined"
    >
      <div class="flex flex-wrap items-center gap-(--spacing-sm)">
        <ToggleGroup
          v-model="mode"
          :options="modes"
          size="small"
          aria-label="Message type"
          :disabled="busy"
        />
        <p
          v-if="isNote"
          :id="noteId"
          class="flex items-center gap-(--spacing-2xs) text-body-sm text-(--text-muted)"
        >
          <i
            class="az az-lock text-(--warning-mark)"
            aria-hidden="true"
          />
          Only your team can see internal notes.
        </p>
      </div>

      <div
        v-if="!isNote && requester"
        class="flex min-w-0 flex-col gap-(--spacing-xs)"
      >
        <p class="min-w-0 truncate text-body-sm text-(--text-default)">
          <span class="text-(--text-muted)">To: </span>
          <bdi>{{ requester.name }}</bdi>
          <span
            class="text-(--text-muted)"
            dir="ltr"
          >
            &lt;{{ requester.email }}&gt;</span
          >
        </p>
        <Field orientation="responsive">
          <Field.Label>Cc</Field.Label>
          <MultiSelect
            v-model="cc"
            variant="chips"
            :chip-limit="3"
            searchable
            allow-custom
            placeholder="Add people to copy"
            :disabled="busy"
            @create="addAddress"
          >
            <MultiSelect.Trigger />
            <MultiSelect.Content>
              <MultiSelect.Item
                v-for="address in addresses"
                :key="address"
                :value="address"
                >{{ address }}</MultiSelect.Item
              >
            </MultiSelect.Content>
          </MultiSelect>
        </Field>
      </div>

      <Alert
        v-if="sendError"
        severity="danger"
        size="small"
        :label="sendError"
        action-label="Retry"
        @action="(event: MouseEvent) => send(event, lastStatus)"
      />

      <MarkdownEditor
        v-model="body"
        :aria-label="isNote ? 'Internal note' : 'Reply to the customer'"
        :aria-describedby="isNote ? noteId : undefined"
        :placeholder="isNote ? 'Write a note for your team, @ to mention' : 'Write a reply'"
        :mentions="mentions"
        :readonly="sending"
        :disabled="disabled"
        :min-rows="5"
      >
        <template #footer>
          <ComposerFooter
            :mode="draft.mode"
            :files="draft.files"
            :responses="responses"
            :empty="empty"
            :sending="sending"
            :disabled="disabled"
            @attach="attach"
            @insert="insert"
            @remove-file="removeFile"
            @send="send"
          />
        </template>
      </MarkdownEditor>

      <FileDropzone
        variant="overlay"
        title="Drop files to attach them"
        :disabled="busy"
        @drop="(_event, files) => addFiles(files)"
      />
    </div>
  </section>
</template>
```

## `parts/composer-footer.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import type { DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import FileTokenGroup from '@aziontech/webkit/file-token-group'
  import IconButton from '@aziontech/webkit/icon-button'
  import SplitButton, { type SplitButtonItem } from '@aziontech/webkit/split-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import type {
    DetailTicketReplyMode,
    DetailTicketResponse,
    DetailTicketSendPayload
  } from '../detail-ticket.vue'

  export interface ComposerFooterProps {
    /** Reply to the customer or internal note. */
    mode: DetailTicketReplyMode
    /** Files attached to the draft. */
    files: File[]
    /** Saved replies Insert response offers. */
    responses: DetailTicketResponse[]
    /** The draft holds nothing to send. */
    empty: boolean
    /** The draft is being sent. */
    sending: boolean
    /** The composer cannot be used yet. */
    disabled: boolean
  }

  const props = defineProps<ComposerFooterProps>()

  const emit = defineEmits<{
    attach: [event: MouseEvent]
    insert: [event: MouseEvent | KeyboardEvent, response: DetailTicketResponse]
    'remove-file': [event: MouseEvent, index: number]
    send: [event: MouseEvent | KeyboardEvent, status: DetailTicketSendPayload['status']]
  }>()

  const sendItems: SplitButtonItem[] = [
    { label: 'Send and set Pending', value: 'Pending', icon: 'az az-clock' },
    { label: 'Send and set Solved', value: 'Solved', icon: 'az az-circle-check' }
  ]

  const tokens = computed(() => props.files.map((file) => ({ file })))
  const busy = computed(() => props.disabled || props.sending)

  const onInsert = (event: MouseEvent | KeyboardEvent, value: DropdownMenuItemValue) => {
    const response = props.responses.find((entry) => entry.key === value)
    if (response) emit('insert', event, response)
  }

  const onSendItem = (event: MouseEvent | KeyboardEvent, item: SplitButtonItem) =>
    emit('send', event, item.value === 'Solved' ? 'Solved' : 'Pending')
</script>

<template>
  <div class="flex w-full min-w-0 flex-col gap-(--spacing-xs)">
    <FileTokenGroup
      v-if="tokens.length"
      :items="tokens"
      orientation="horizontal"
      :readonly="busy"
      aria-label="Attached files"
      @remove="(event, payload) => emit('remove-file', event, payload.index)"
    />
    <div class="flex w-full min-w-0 flex-wrap items-center gap-(--spacing-xs)">
      <Tooltip content="Attach files">
        <IconButton
          icon="az az-paperclip"
          variant="ghost"
          size="medium"
          aria-label="Attach files"
          :disabled="busy"
          @click="(event: MouseEvent) => emit('attach', event)"
        />
      </Tooltip>
      <DropdownMenuRoot
        side="top"
        align="start"
        :disabled="busy || !responses.length"
        @select="onInsert"
      >
        <DropdownMenuTrigger>
          <Button
            label="Insert response"
            icon="az az-chevron-down"
            icon-position="trailing"
            variant="ghost"
            size="medium"
            :disabled="busy || !responses.length"
          />
        </DropdownMenuTrigger>
        <DropdownMenuItem
          v-for="response in responses"
          :key="response.key"
          :value="response.key"
          :label="response.label"
        />
      </DropdownMenuRoot>
      <div class="ms-auto flex shrink-0 items-center">
        <SplitButton
          v-if="mode === 'reply'"
          label="Send"
          icon="az az-send"
          :items="sendItems"
          size="medium"
          :loading="sending"
          :disabled="disabled || empty"
          @click="(event: MouseEvent) => emit('send', event, '')"
          @item-click="onSendItem"
        />
        <Button
          v-else
          label="Add note"
          icon="az az-lock"
          variant="secondary"
          size="medium"
          :loading="sending"
          loading-label="Adding the note"
          :disabled="disabled || empty"
          disabled-reason="Write the note first."
          @click="(event: MouseEvent) => emit('send', event, '')"
        />
      </div>
    </div>
  </div>
</template>
```

## `parts/ticket-properties.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import MultiSelect from '@aziontech/webkit/multi-select'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, ref, watch } from 'vue'

  import type {
    DetailTicketAgent,
    DetailTicketField,
    DetailTicketPropertyChange,
    DetailTicketTicket
  } from '../detail-ticket.vue'
  import { priorityOptions, TICKET_STATUSES, TICKET_TYPES } from '../lib/ticket-fields'

  export interface TicketPropertiesProps {
    /** The ticket; absent while it loads. */
    ticket?: DetailTicketTicket
    /** Agents the ticket can be assigned to. */
    agents: DetailTicketAgent[]
    /** Groups the ticket can move to. */
    groups: string[]
    /** Tags offered in the Tags field. */
    tagOptions: string[]
    /** The ticket is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketPropertiesProps>(), {
    ticket: undefined,
    loading: false
  })

  const emit = defineEmits<{
    change: [change: DetailTicketPropertyChange]
  }>()

  const UNASSIGNED = 'unassigned'
  const PRESENCE: Record<string, string> = {
    online: 'Online',
    away: 'Away',
    busy: 'Busy',
    offline: 'Offline'
  }

  const extraTags = ref<string[]>([])

  const EMPTY = { status: '', priority: '', type: '', group: '', assignee: UNASSIGNED, tags: [] }

  function seed(): Record<DetailTicketField, string | string[]> {
    const ticket = props.ticket
    if (!ticket) return { ...EMPTY }
    const { status, priority, type, group, assignee, tags } = ticket
    return { status, priority, type, group, assignee: assignee || UNASSIGNED, tags }
  }

  const values = ref<Record<DetailTicketField, string | string[]>>(seed())

  watch(
    () => props.ticket,
    () => (values.value = seed())
  )

  const assignee = computed(() =>
    props.agents.find((agent) => agent.name === values.value.assignee)
  )
  const tags = computed(() => [
    ...new Set([...props.tagOptions, ...extraTags.value, ...(values.value.tags as string[])])
  ])
  const statusOptions = TICKET_STATUSES.map((value) => ({ value, label: value }))
  const typeOptions = TICKET_TYPES.map((value) => ({ value, label: value }))
  const groupOptions = computed(() => props.groups.map((value) => ({ value, label: value })))
  const singleFields = computed(() => [
    { field: 'status' as const, label: 'Status', options: statusOptions },
    { field: 'priority' as const, label: 'Priority', options: [...priorityOptions] },
    { field: 'type' as const, label: 'Type', options: typeOptions },
    { field: 'group' as const, label: 'Group', options: groupOptions.value }
  ])

  const set = (field: DetailTicketField, value: string | string[]) => {
    values.value = { ...values.value, [field]: value }
    const out = field === 'assignee' && value === UNASSIGNED ? '' : value
    emit('change', { field, value: out })
  }

  const addTag = (_event: MouseEvent | KeyboardEvent, tag: string) => {
    extraTags.value = [...extraTags.value, tag]
    set('tags', [...(values.value.tags as string[]), tag])
  }
</script>

<template>
  <Card title="Properties">
    <div
      v-if="!ticket && loading"
      class="flex flex-col gap-(--spacing-md)"
      aria-hidden="true"
    >
      <Skeleton
        v-for="row in 6"
        :key="row"
        height="2rem"
      />
    </div>
    <div
      v-else-if="ticket"
      class="flex flex-col gap-(--spacing-md)"
    >
      <Field
        v-for="item in singleFields"
        :key="item.field"
      >
        <Field.Label>{{ item.label }}</Field.Label>
        <Select
          :model-value="values[item.field] as string"
          size="medium"
          @update:model-value="(value: string) => set(item.field, value)"
        >
          <Select.Trigger class="w-full" />
          <Select.Content>
            <Select.Item
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
              >{{ option.label }}</Select.Item
            >
          </Select.Content>
        </Select>
      </Field>
      <Field>
        <Field.Label>Assignee</Field.Label>
        <div class="flex min-w-0 items-center gap-(--spacing-xs)">
          <Avatar
            v-if="assignee"
            :label="assignee.name"
            :alt="assignee.name"
            :presence="assignee.presence"
            size="small"
            class="shrink-0"
          />
          <Select
            :model-value="values.assignee as string"
            size="medium"
            class="min-w-0 grow"
            @update:model-value="(value: string) => set('assignee', value)"
          >
            <Select.Trigger class="w-full" />
            <Select.Content>
              <Select.Item :value="UNASSIGNED">Unassigned</Select.Item>
              <Select.Item
                v-for="agent in agents"
                :key="agent.email"
                :value="agent.name"
              >
                {{ agent.name }}
                <template
                  v-if="agent.presence"
                  #tag
                >
                  <span class="text-body-xs text-(--text-muted)">{{
                    PRESENCE[agent.presence]
                  }}</span>
                </template>
              </Select.Item>
            </Select.Content>
          </Select>
        </div>
      </Field>
      <Field>
        <Field.Label>Tags</Field.Label>
        <MultiSelect
          :model-value="values.tags as string[]"
          variant="chips"
          searchable
          allow-custom
          placeholder="Add tags"
          @update:model-value="(value: string[]) => set('tags', value)"
          @create="addTag"
        >
          <MultiSelect.Trigger />
          <MultiSelect.Content>
            <MultiSelect.Item
              v-for="tag in tags"
              :key="tag"
              :value="tag"
              >{{ tag }}</MultiSelect.Item
            >
          </MultiSelect.Content>
        </MultiSelect>
      </Field>
    </div>
  </Card>
</template>
```

## `parts/ticket-requester.vue`

```ts
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed } from 'vue'

  import type { DetailTicketRequester } from '../detail-ticket.vue'

  export interface TicketRequesterProps {
    /** The customer who asked; absent while the ticket loads. */
    requester?: DetailTicketRequester
    /** The ticket is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketRequesterProps>(), {
    requester: undefined,
    loading: false
  })

  const emit = defineEmits<{
    open: [event: MouseEvent, requester: DetailTicketRequester]
  }>()

  const others = computed(() => {
    const count = props.requester?.otherTickets ?? 0
    if (!count) return 'No other tickets'
    return `${count} other ${count === 1 ? 'ticket' : 'tickets'}`
  })
</script>

<template>
  <Card title="Requester">
    <div
      v-if="!requester && loading"
      class="flex items-center gap-(--spacing-sm)"
      aria-hidden="true"
    >
      <Skeleton
        variant="circle"
        width="2rem"
        height="2rem"
      />
      <div class="flex grow flex-col gap-(--spacing-2xs)">
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </div>
    </div>
    <div
      v-else-if="requester"
      class="flex min-w-0 flex-col gap-(--spacing-sm)"
    >
      <div class="flex min-w-0 items-center gap-(--spacing-sm)">
        <Avatar
          :label="requester.name"
          size="medium"
          aria-hidden="true"
          class="shrink-0"
        />
        <div class="flex min-w-0 flex-col">
          <bdi class="truncate text-label-md text-(--text-default)">{{ requester.name }}</bdi>
          <span
            class="truncate text-body-sm text-(--text-muted)"
            dir="ltr"
            >{{ requester.email }}</span
          >
        </div>
      </div>
      <p class="flex flex-wrap gap-x-(--spacing-sm) text-body-sm text-(--text-muted)">
        <bdi>{{ requester.organization }}</bdi>
        <span>{{ others }}</span>
      </p>
      <Button
        label="View customer profile"
        variant="link"
        size="small"
        class="self-start"
        @click="(event: MouseEvent) => emit('open', event, requester!)"
      />
    </div>
  </Card>
</template>
```

## `parts/ticket-activity.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Timeline from '@aziontech/webkit/timeline'
  import { computed } from 'vue'

  import type { DetailTicketActivity } from '../detail-ticket.vue'
  import { activityDays } from '../lib/ticket-fields'

  export interface TicketActivityProps {
    /** The ticket's activity, newest first. */
    activity: DetailTicketActivity[]
    /** The ticket is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketActivityProps>(), { loading: false })

  const days = computed(() => activityDays(props.activity))
</script>

<template>
  <Card title="Activity">
    <Timeline
      size="small"
      time-format="relative"
      aria-label="Ticket activity"
      :loading="loading"
    >
      <Timeline.Group
        v-for="day in days"
        :key="day.label"
        :label="day.label"
      >
        <Timeline.Item
          v-for="entry in day.items"
          :key="entry.id"
          :title="entry.title"
          :actor="entry.actor"
          :time="entry.time"
          :severity="entry.severity"
          :icon="entry.icon"
        />
      </Timeline.Group>
    </Timeline>
  </Card>
</template>
```

# Ticket detail

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
- The components own `Show 5 earlier messages`, `Internal note` on a note, `Paused`, `Due in` and `Overdue by`; do not retype them. Follow `skills/azion-ui-microcopy`: sentence case, no "please", no exclamation marks.

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

# Create ticket

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

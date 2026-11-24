# DetailCustomer

The page a support agent opens to learn who is asking: how to reach the customer, how happy they have been, every ticket they opened, what happened on their account, and the notes other agents left. It reads from the person to the history. It is a page body for `ConsoleLayout`: the layout owns the rail, the header with the breadcrumb (Customers › Jane Doe) and the `main`.

## When to use

- An agent opens a requester from a ticket, a search result or the customers list and needs their profile.
- The agent must see the customer's open tickets and their next-reply deadline before answering.
- The person contacts support: a customer, a contact or a requester of an organization you serve.

## When not to use

- A member of your own team, their roles and invitations: use `account/account-users`.
- The list of every customer, searched and filtered: use `view/view-table`.
- The overview of a resource you run, with its own tabs: use `detail/detail-resource`.
- Editing the customer's fields and tags: Edit emits `edit`, and the edit page is a settings form (`settings/settings-form`) with `TagEditor` for the tags.

## Building blocks

### A. Page heading — `PageHeader`, `Avatar`, `Button`, `DropdownMenu`, `IconButton`, `Tooltip`

A medium `PageHeader` titled with the customer's name, the page's only h1, and their organization as the description. The icon slot holds a square medium `Avatar` with the initials (or the photo), decorative because the title names the person. The actions, in this order: Edit (outline), More actions (an outline `IconButton` with the ellipsis glyph inside `DropdownMenu.Trigger`, its `Tooltip` inside the trigger) opening one group with Merge customer, Export data and Delete customer, and New ticket (primary) on the outer edge.

### B. Sample clock — `ConfigProvider`

The page body renders inside a `ConfigProvider` with a fixed `now` only while the sample renders, or when the app passes `now`, so countdowns and relative times read the same in every preview. With real data and no `now` there is no provider, so the app's own `ConfigProvider` (its locale and catalogs) reaches every component.

### C. States — `Skeleton`, `Alert`

While loading the title reads Customer, `Skeleton`s stand in for the avatar and the organization, and the actions are disabled. A failed load keeps the Customer title, drops the actions and puts a danger `Alert` titled "Couldn't load this customer" with Retry in place of the details and tabs.

### D. Details — `Card`, `KeyValueList`, `CopyButton`, `Link`, `Tag`

A `Card` titled Details holding a one-column `KeyValueList`: Email and Phone each with a small `CopyButton`, Local time (the time where the customer is, then the zone), Language, Organization (a small `Link` to the organization page, plain text without one), Tags and Customer since. A value the customer does not have (no phone, no tags) shows the list's own Not set marker. Tags are a row of small neutral `Tag`s: `TagEditor` has no read-only mode yet, so this row is a display only and not the pattern for editing tags.

### E. Satisfaction — `Card`, `Rating`

A second `Card` titled Satisfaction: a small read-only `Rating` of the average, rounded to the half star, and beside it the score and the count in words ("4.5 out of 5 from 12 surveys"). With no survey answered it says No ratings yet and draws no stars. On a wide container the two cards form the start column (348 px at most) beside the tabs; in a narrow one they stack above the tabs.

### F. Sections — `Tabs`

`Tabs` bound to `v-model:tab` with Tickets, Activity and Notes, plain words with no count in the label.

### G. Tickets — `DataTable`, `Link`, `TableCellStatus`, `PriorityTag`, `Countdown`, `TableCellTime`, `EmptyState`, `Button`

A bordered `DataTable` of the customer's tickets, open ones first, with an sr-only caption naming the customer. Subject is the ticket number, muted, then a small `Link` to the ticket that emits `open-ticket`. Status is a `TableCellStatus` (Open info, Pending warning, Solved success, Closed neutral), Priority a small `PriorityTag`, Next reply a small `Countdown` to the due time (paused while the ticket is Pending, because the clock waits on the customer) and a muted dash with "No SLA running" for the screen reader once a ticket is Solved or Closed, Updated a `TableCellTime`. While loading the table draws its own skeleton rows. With no ticket the `empty` slot holds a small `EmptyState` with New ticket.

### H. Activity — `Timeline`

A `Timeline` with one `Timeline.Group` per day, labelled with the long date, newest first. Each event is a `Timeline.Item` with its glyph and meaning: ticket opened, replied, merged (info), rated (warning, the star), solved (success), customer created (info). The actor and the time sit on the meta line. While loading the timeline draws its own placeholder items; with no event a small `EmptyState` says so.

### I. Notes — `MessageThread`, `Field`, `Textarea`, `Button`

The internal notes, oldest first, as a `MessageThread` of `type="note"` items written by agents, each with the Internal note band. Under it a `Field` labelled Add a note with an auto-resizing `Textarea`, the description "Only agents can read notes." and a secondary Add note `Button`. Add note stays enabled: with an empty field it shows the `Field.Error`; otherwise it emits `add-note` and shows its loading state while `saving`.

## Data

The block takes the customer and their history through props, owns the open tab and the note draft as models, and emits its actions; it fetches nothing. `DetailCustomerCustomer`, `DetailCustomerSatisfaction`, `DetailCustomerTicket`, `DetailCustomerEvent`, `DetailCustomerNote` and `DetailCustomerProps` are exported from `detail-customer.vue`, and `sample.ts` holds the sample customer the block renders when they are left out.

| Prop / model    | Type                                 | What it does                                                                                     |
| --------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------ |
| `customer`      | `DetailCustomerCustomer`             | Name, email, phone, time zone, language, organization and its link, tags, customer since, photo. |
| `satisfaction`  | `DetailCustomerSatisfaction`         | The average score and how many surveys were answered.                                            |
| `tickets`       | `DetailCustomerTicket[]`             | The customer's tickets, open ones first; `[]` shows the empty state.                             |
| `activity`      | `DetailCustomerEvent[]`              | Account events, newest first; grouped by day on screen.                                          |
| `notes`         | `DetailCustomerNote[]`               | Internal notes, oldest first.                                                                    |
| `now`           | `string \| number \| Date`           | A fixed reference time; leave it out in an app so the countdowns read the real clock.            |
| `loading`       | `boolean`                            | Skeletons in place of the data; the sample never shows.                                          |
| `error`         | `string`                             | Why the load failed, shown in the Alert with Retry.                                              |
| `saving`        | `boolean`                            | A note is being saved; Add note shows its loading state.                                         |
| `v-model:tab`   | `'tickets' \| 'activity' \| 'notes'` | The open tab, Tickets by default; bind it to the route to deep-link a tab.                       |
| `v-model:draft` | `string`                             | The note being written; clear it after the note is saved.                                        |

| Event             | Payload           | When                                                                                             |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| `open-ticket`     | `(event, ticket)` | A ticket subject is activated; prevent the default and route to the ticket in a single-page app. |
| `new-ticket`      | `(event)`         | New ticket, in the heading or the empty state; open the create flow for this customer.           |
| `edit`            | `(event)`         | Edit; open the customer's edit page.                                                             |
| `customer-action` | `(event, value)`  | A More actions item: `merge`, `export` or `delete`. Confirm `delete` with an `AlertDialog`.      |
| `add-note`        | `(event, text)`   | Add note with a non-empty field; save it, append it to `notes` and clear the draft.              |
| `retry`           | `(event)`         | Retry in the error state; load the customer again.                                               |

To go live, render the block from a page that owns the requests and the route:

```vue
<script setup lang="ts">
  import { ref } from 'vue'

  import DetailCustomer, { type DetailCustomerTicket } from './detail-customer.vue'

  const route = useRoute()
  const router = useRouter()
  const { customer, satisfaction, tickets, activity, notes, loading, error, reload } = useCustomer(
    route.params.customerId
  )
  const draft = ref('')
  const saving = ref(false)
  const openTicket = (event: MouseEvent, ticket: DetailCustomerTicket) => {
    event.preventDefault()
    router.push(`/tickets/${ticket.id}`)
  }
  const addNote = async (_event: MouseEvent, text: string) => {
    saving.value = true
    await saveNote(route.params.customerId, text)
    saving.value = false
    draft.value = ''
  }
</script>

<template>
  <DetailCustomer
    v-model:draft="draft"
    :customer="customer"
    :satisfaction="satisfaction"
    :tickets="tickets"
    :activity="activity"
    :notes="notes"
    :loading="loading"
    :error="error"
    :saving="saving"
    @open-ticket="openTicket"
    @add-note="addNote"
    @retry="reload"
  />
</template>
```

Then delete `sample.ts`, its import, and `parts/customer-clock.vue` if the app never passes `now`.

## Do

- Lead with who the customer is and how to reach them: copy buttons on the email and the phone.
- Keep open tickets first in the table, with their next-reply countdown.
- Write the satisfaction in words next to the stars ("4.5 out of 5 from 12 surveys").
- Keep internal notes visibly internal: the `MessageThread` note band says Internal note.
- Show the customer's local time, so the agent knows whether a call is welcome now.

## Don't

- Don't color a ticket status or a priority without its word; `TableCellStatus` and `PriorityTag` carry both.
- Don't put a ticket's conversation on this page; the subject opens the ticket.
- Don't prefill the note field or disable Add note while it is empty; show the error instead.
- Don't show the sample while loading or failed, and don't wrap real data in a fixed clock.
- Don't add a count to a tab label; the table and the timeline already say how many.

## Copy

- **Heading:** the customer's full name, with the organization ("Acme Inc.") as the description; "Customer" while loading or failed.
- **Actions:** "Edit", "New ticket"; the menu "More actions" with "Merge customer", "Export data", "Delete customer".
- **Details:** "Details" over "Email", "Phone", "Local time" ("9:45 AM" then "America/New_York"), "Language" ("English (United States)"), "Organization", "Tags", "Customer since" ("March 12, 2024"); copy buttons "Copy email", "Copy phone number".
- **Satisfaction:** "Satisfaction", then "4.5 out of 5 from 12 surveys" ("1 survey" for one), or "No ratings yet".
- **Tabs:** "Tickets", "Activity", "Notes".
- **Tickets:** caption "Tickets from Jane Doe"; columns "Subject", "Status", "Priority", "Next reply", "Updated"; statuses "Open", "Pending", "Solved", "Closed"; "No SLA running" for the screen reader; empty "No tickets yet" with "Alex Morgan has not contacted support yet." and "New ticket".
- **Activity:** day labels as the long date ("November 24, 2026"); titles that name the ticket ("Opened ticket #4812", "Replied on ticket #4790", "Ticket #4793 merged into #4790", "Rated ticket #4755 5 out of 5", "Ticket #4755 solved", "Customer created"); empty "No activity yet".
- **Notes:** "Add a note", "Only agents can read notes.", "Add note"; error "Write the note first."
- **Error:** title "Couldn't load this customer", message "Check your connection and retry.", action "Retry".
- Follow `skills/webkit-microcopy`: sentence case, no em dash in copy, no "please", no exclamation marks.

## Accessibility

- Heading order: the h1 is the customer's name (`PageHeader`); the Details and Satisfaction card titles are h2; each tab panel is named by its tab. The body renders no landmark of its own; `ConsoleLayout` owns `main`.
- Focus order: Edit, More actions, New ticket; the copy buttons and the organization link; the tablist (one stop, arrow keys between tabs); the active panel: the ticket links, or the note field then Add note.
- The tickets table has a caption naming the customer; each status and priority is a word; a ticket with no deadline running says "No SLA running" to the screen reader instead of the dash.
- The read-only `Rating` is one image ("Rated 4.5 out of 5") followed by the count in text; the decorative avatar and glyphs are `aria-hidden`.
- Loading sets `aria-busy` on the details list, the table, the timeline and the thread; the error `Alert` announces itself and Retry is a button in it.
- Names, emails, phone numbers, tags, subjects and note bodies are isolated (`bdi`, `dir="auto"`), so they read correctly in right-to-left; the email and the phone stay left-to-right.

## States

- Tickets: the primary, Jane Doe of Acme Inc. with four tickets (open with its countdown, pending and paused, solved, closed), 4.5 out of 5 from 12 surveys.
- Activity: `tab="activity"`, the timeline of the last days grouped by day.
- Notes: `tab="notes"`, two internal notes and the Add a note field.
- NoTickets: a customer created today, no phone and no tags, No ratings yet, the No tickets yet empty state with New ticket and one activity event.
- Loading: `loading`, the Customer title, skeletons in the heading and the details, skeleton rows in the table, the actions disabled.
- Error: `error`, the Customer title and a danger Alert with Retry in place of the details and tabs.

## Related

- `account/account-users` — your own team, not the people who contact support.
- `view/view-table` — the list a customer is opened from.
- `detail/detail-resource` — the same page shape for a resource.
- `settings/settings-form` — the edit page Edit leads to.
- `shell/shell-console` — the `ConsoleLayout` this page body renders in; see `skills/webkit-layout`.

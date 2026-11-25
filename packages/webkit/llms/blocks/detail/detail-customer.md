# DetailCustomer (`detail/detail-customer`)

> The profile of one customer a support agent opens from a ticket or a search, as a page body for ConsoleLayout. A `PageHeader` names the customer with a square `Avatar`, their organization as the description, and the actions Edit, More actions (an `IconButton` with a `Tooltip` opening a `DropdownMenu`: Merge customer, Export data, Delete customer) and New ticket. Below it a details column (a `Card` with a `KeyValueList`: email and phone with a `CopyButton`, local time, language, the organization `Link`, the tags as `Tag`s and customer since, then a Satisfaction `Card` with a read-only `Rating` and the survey count) sits beside `Tabs`, and stacks above them in a narrow container. Tickets is a `DataTable` of the customer's tickets (subject `Link`, `TableCellStatus`, `PriorityTag`, the next-reply `Countdown`, `TableCellTime`) with an `EmptyState` for a customer with none; Activity is a `Timeline` grouped by day; Notes is a `MessageThread` of internal notes over a `Field` with a `Textarea` and Add note. Loading draws `Skeleton`s, the table's skeleton rows and the timeline and thread placeholders; a failed load shows a danger `Alert` with Retry. The sample renders under a `ConfigProvider` with a fixed clock.

- Surface: app
- Source: `blocks/detail/detail-customer/detail-customer.vue` in `@aziontech/webkit`
- MCP: `get_block("detail/detail-customer")`
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [ConfigProvider](../../components/config-provider.md), [CopyButton](../../components/copy-button.md), [Countdown](../../components/countdown.md), [DataTable](../../components/data-table.md), [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [KeyValueList](../../components/key-value-list.md), [Link](../../components/link.md), [MessageThread](../../components/message-thread.md), [PageHeader](../../components/page-header.md), [PriorityTag](../../components/priority-tag.md), [Rating](../../components/rating.md), [Skeleton](../../components/skeleton.md), `TableCellStatus`, `TableCellTime`, [Tabs](../../components/tabs.md), [Tag](../../components/tag.md), [Textarea](../../components/textarea.md), [Timeline](../../components/timeline.md), [Tooltip](../../components/tooltip.md), `use-locale`
- Skills: `webkit-layout`, `webkit-ui-states`, `webkit-tables`, `webkit-form`, `webkit-lists`, `webkit-microcopy`

## Asked as

customer profile; customer details; contact profile; requester profile; customer tickets; customer activity; customer notes; support customer; end user profile; perfil do cliente; detalhes do cliente; perfil do contato; perfil do solicitante; tickets do cliente; atividade do cliente; notas do cliente

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

A medium `PageHeader` titled with the customer's name, the page's only h1, and their organization as the description. The icon slot holds a square medium `Avatar` with the initials (or the photo), decorative because the title names the person. The actions, in this order: Edit (outline), More actions (an outline `IconButton` with the ellipsis glyph inside `DropdownMenu.Trigger`, its `Tooltip` inside the trigger) opening one group with Merge customer, Export data and Delete customer, and New ticket (primary) on the outer edge. The three sit in one wrapping row, so on a phone they stay side by side instead of stretching to three full-width rows.

### B. Sample clock — `ConfigProvider`

The page body renders inside a `ConfigProvider` that inherits the app's own (its locale and catalogs). While the sample renders, or when the app passes `now`, it fixes the clock to `now` and reads dates in UTC, so countdowns, relative times and the day headings read the same in every preview and on the server. With real data and no `now` the clock and the time zone are the app's.

### C. States — `Skeleton`, `Alert`

While loading the title reads Customer, `Skeleton`s stand in for the avatar and the organization, and the actions are disabled. A failed load keeps the Customer title, drops the actions and puts a danger `Alert` titled "Couldn't load this customer" with Retry in place of the details and tabs.

### D. Details — `Card`, `KeyValueList`, `CopyButton`, `Link`, `Tag`

A `Card` titled Details holding a one-column `KeyValueList`: Email and Phone each with a small `CopyButton`, Local time (the time where the customer is, then the zone), Language, Organization (an inline `Link` to the organization page, plain text without one), Tags and Customer since. A value the customer does not have (no phone, no tags) shows the list's own Not set marker. Tags are a row of small neutral `Tag`s: `TagEditor` has no read-only mode yet, so this row is a display only and not the pattern for editing tags.

### E. Satisfaction — `Card`, `Rating`

A second `Card` titled Satisfaction: a small read-only `Rating` of the average, rounded to the half star, and beside it the score and the count in words ("4.5 out of 5 from 12 surveys"). With no survey answered it says No ratings yet and draws no stars. On a wide container the two cards form the start column (348 px at most) beside the tabs; in a narrow one they stack above the tabs.

### F. Sections — `Tabs`

`Tabs` bound to `v-model:tab` with Tickets, Activity and Notes, plain words with no count in the label.

### G. Tickets — `DataTable`, `Link`, `TableCellStatus`, `PriorityTag`, `Countdown`, `TableCellTime`, `EmptyState`, `Button`

A bordered `DataTable` of the customer's tickets, open ones first, with an sr-only caption naming the customer. Subject is the ticket number, muted, then a small `Link` to the ticket that emits `open-ticket`. Status is a `TableCellStatus` (Open info, Pending warning, Solved success, Closed neutral), Priority a small `PriorityTag`, Next reply a small `Countdown` to the due time (paused while the ticket is Pending, because the clock waits on the customer) and a muted dash with "No SLA running" for the screen reader once a ticket is Solved or Closed, Updated a `TableCellTime`. It sets `stackable`: a customer's tickets are a short list read one at a time, so on a phone each ticket becomes a card with its status, priority and next reply under the subject instead of hiding them behind a sideways scroll. While loading the table draws its own skeleton rows. With no ticket the `empty` slot holds a small `EmptyState` with New ticket.

### H. Activity — `Timeline`

A `Timeline` with one `Timeline.Group` per day, labelled with the long date, newest first. Each event is a `Timeline.Item` with its glyph and meaning: ticket opened, replied, merged (info), rated (warning, the star), solved (success), customer created (info). The actor and the relative time ("2 hours ago") sit on the meta line. While loading the timeline draws its own placeholder items; with no event a small `EmptyState` says so.

### I. Notes — `MessageThread`, `Field`, `Textarea`, `Button`

The internal notes, oldest first, as a `MessageThread` of `type="note"` items written by agents, each with the Internal note band and a relative time, like the Activity timeline beside it. Under it a `Field` labelled Add a note with an auto-resizing `Textarea`, the description "Only agents can read notes." and a secondary Add note `Button`. Add note stays enabled: with an empty field it shows the `Field.Error`; otherwise it emits `add-note` and shows its loading state while `saving`.

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
- **Activity:** day labels as the long date ("November 24, 2026"); titles that name the ticket ("Opened ticket #4812", "Replied on ticket #4790", "Ticket #4793 merged into #4790", "Rated ticket #4755 with 5 out of 5", "Ticket #4755 solved", "Customer created"); empty "No activity yet".
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

## Variants

- `Tickets` — primary (the code below)
- `Activity` — The Activity tab: a `Timeline` with one group per day, newest first, each event with its marker, actor and time (ticket opened, replied, merged, rated, solved).
- `Notes` — The Notes tab: the internal notes agents left on the customer as a `MessageThread` of notes, oldest first, then the Add a note field and the Add note button.
- `NoTickets` — A customer created today: no phone and no tags, No ratings yet, the Tickets tab showing the No tickets yet empty state with New ticket, and one activity event.
- `Loading` — While the customer loads: the Customer title with skeletons for the avatar and organization, the actions disabled, skeleton values in the details, and skeleton rows in the tickets table.
- `Error` — The customer failed to load: the Customer title with no actions and a danger `Alert` with Retry in place of the details and tabs.

Each variant is the same screen in another state: `get_block("detail/detail-customer", { variant })`, or the file under `blocks/detail/detail-customer/variants/`.

## Code (`Tickets`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import { type PriorityTagPriority } from '@aziontech/webkit/priority-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tabs from '@aziontech/webkit/tabs'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'

  import CustomerActivityTab from './parts/customer-activity-tab.vue'
  import CustomerClock from './parts/customer-clock.vue'
  import CustomerDetailsPanel from './parts/customer-details-panel.vue'
  import CustomerNotesTab from './parts/customer-notes-tab.vue'
  import CustomerTicketsTab from './parts/customer-tickets-tab.vue'
  import {
    sampleActivity,
    sampleCustomer,
    sampleNotes,
    sampleNow,
    sampleSatisfaction,
    sampleTickets
  } from './sample'

  /** A tab of the customer page. */
  export type DetailCustomerTab = 'tickets' | 'activity' | 'notes'

  /** Where a ticket stands. */
  export type DetailCustomerTicketStatus = 'open' | 'pending' | 'solved' | 'closed'

  /** What happened in an activity event; picks its marker. */
  export type DetailCustomerEventType =
    'joined' | 'created' | 'replied' | 'rated' | 'merged' | 'solved'

  /** The person who contacts support. */
  export interface DetailCustomerCustomer {
    /** The customer ID, used in links. */
    id: string
    /** Full name, the page title. */
    name: string
    /** Email address, copyable. */
    email: string
    /** Phone number in international format, copyable; empty shows Not set. */
    phone: string
    /** IANA time zone the local time is shown in, such as America/New_York. */
    timeZone: string
    /** The language the customer reads, written out. */
    language: string
    /** The organization the customer belongs to, also the page description. */
    organization: string
    /** Link to the organization page; empty shows the name as text. */
    organizationHref: string
    /** Tags on the customer, shown read-only. */
    tags: string[]
    /** When the customer first contacted support. */
    customerSince: string | Date
    /** Photo URL; empty shows the initials. */
    avatarSrc: string
  }

  /** The satisfaction surveys the customer answered. */
  export interface DetailCustomerSatisfaction {
    /** The average score, from 0 to 5. */
    average: number
    /** How many surveys were answered; 0 shows No ratings yet. */
    surveys: number
  }

  /** One ticket the customer opened. */
  export interface DetailCustomerTicket {
    /** The ticket number, without the hash. */
    id: string
    /** The subject line. */
    subject: string
    /** Where the ticket stands. */
    status: DetailCustomerTicketStatus
    /** The ticket priority. */
    priority: PriorityTagPriority
    /** When the next reply is due, an ISO string; empty when no SLA runs. */
    dueAt: string
    /** When the ticket last changed, an ISO string. */
    updatedAt: string
  }

  /** One event on the customer's account. */
  export interface DetailCustomerEvent {
    /** A stable ID. */
    id: string
    /** What happened; picks the marker. */
    type: DetailCustomerEventType
    /** What happened, in plain words. */
    title: string
    /** One line of detail; empty shows none. */
    description: string
    /** Who did it. */
    actor: string
    /** When it happened, an ISO string. */
    at: string
  }

  /** One internal note on the customer. */
  export interface DetailCustomerNote {
    /** A stable ID. */
    id: string
    /** The agent who wrote it. */
    author: string
    /** When it was written, an ISO string. */
    at: string
    /** The note text. */
    body: string
  }

  export interface DetailCustomerProps {
    /** The customer the page shows. Left out, the sample renders. */
    customer?: DetailCustomerCustomer
    /** Their satisfaction surveys. Left out, the sample renders. */
    satisfaction?: DetailCustomerSatisfaction
    /** Their tickets, open ones first; [] shows the empty state. Left out, the sample renders. */
    tickets?: DetailCustomerTicket[]
    /** Their account activity, newest first. Left out, the sample renders. */
    activity?: DetailCustomerEvent[]
    /** Internal notes, oldest first. Left out, the sample renders. */
    notes?: DetailCustomerNote[]
    /** A fixed reference time for the countdowns and relative times; left out, the real clock reads (the sample brings its own). */
    now?: string | number | Date
    /** The customer is loading; skeletons stand in for the data. */
    loading?: boolean
    /** Why the customer failed to load, shown with Retry; empty shows the page. */
    error?: string
    /** A note is being saved; Add note shows its loading state. */
    saving?: boolean
  }

  const props = withDefaults(defineProps<DetailCustomerProps>(), {
    customer: undefined,
    satisfaction: undefined,
    tickets: undefined,
    activity: undefined,
    notes: undefined,
    now: undefined,
    loading: false,
    error: '',
    saving: false
  })

  const emit = defineEmits<{
    'open-ticket': [event: MouseEvent, ticket: DetailCustomerTicket]
    'new-ticket': [event: MouseEvent]
    edit: [event: MouseEvent]
    'customer-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
    'add-note': [event: MouseEvent, text: string]
    retry: [event: MouseEvent]
  }>()

  const tab = defineModel<DetailCustomerTab>('tab', { default: 'tickets' })
  const draft = defineModel<string>('draft', { default: '' })

  const blocked = computed(() => props.loading || props.error !== '')
  const customer = computed(() => props.customer ?? (blocked.value ? undefined : sampleCustomer))
  const satisfaction = computed(
    () => props.satisfaction ?? (blocked.value ? undefined : sampleSatisfaction)
  )
  const tickets = computed(() => props.tickets ?? (blocked.value ? [] : sampleTickets))
  const activity = computed(() => props.activity ?? (blocked.value ? [] : sampleActivity))
  const notes = computed(() => props.notes ?? (blocked.value ? [] : sampleNotes))
  const clock = computed(
    () => props.now ?? (props.customer === undefined && !blocked.value ? sampleNow : undefined)
  )
  const name = computed(() => customer.value?.name ?? '')
</script>

<template>
  <CustomerClock :now="clock">
    <div class="@container/customer layout-column layout-boundary flex min-w-0 flex-col">
      <PageHeader :title="customer?.name ?? 'Customer'">
        <template #icon>
          <Skeleton
            v-if="loading"
            width="2rem"
            height="2rem"
          />
          <Avatar
            v-else-if="customer"
            :label="customer.name"
            :src="customer.avatarSrc"
            variant="square"
          />
        </template>
        <template
          v-if="customer && !loading"
          #description
        >
          <bdi>{{ customer.organization }}</bdi>
        </template>
        <template
          v-if="!error"
          #actions
        >
          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
            <Button
              label="Edit"
              icon="az az-pencil"
              variant="outline"
              size="medium"
              :disabled="loading"
              @click="(event: MouseEvent) => emit('edit', event)"
            />
            <DropdownMenu
              side="bottom"
              align="end"
              :disabled="loading"
              @select="(event, value) => emit('customer-action', event, value)"
            >
              <DropdownMenu.Trigger>
                <Tooltip content="More actions">
                  <IconButton
                    icon="az az-ellipsis"
                    variant="outline"
                    size="medium"
                    aria-label="More actions"
                    :disabled="loading"
                  />
                </Tooltip>
              </DropdownMenu.Trigger>
              <DropdownMenu.Group>
                <DropdownMenu.Item
                  value="merge"
                  label="Merge customer"
                >
                  <template #leading>
                    <i
                      class="az az-git-merge"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  value="export"
                  label="Export data"
                >
                  <template #leading>
                    <i
                      class="az az-download"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  value="delete"
                  label="Delete customer"
                  severity="danger"
                >
                  <template #leading>
                    <i
                      class="az az-trash"
                      aria-hidden="true"
                    />
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu>
            <Button
              label="New ticket"
              icon="az az-plus"
              variant="primary"
              size="medium"
              :disabled="loading"
              @click="(event: MouseEvent) => emit('new-ticket', event)"
            />
          </div>
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col">
        <Alert
          v-if="error"
          severity="danger"
          title="Couldn't load this customer"
          :label="error"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <div
          v-else
          class="grid min-w-0 grid-cols-1 items-start gap-(--layout-section-gap) @3xl/customer:grid-cols-[minmax(0,var(--container-xs))_minmax(0,1fr)]"
        >
          <CustomerDetailsPanel
            :customer="customer"
            :satisfaction="satisfaction"
            :now="clock"
            :loading="loading"
          />
          <Tabs
            v-model="tab"
            class="min-w-0"
          >
            <Tabs.List>
              <Tabs.Trigger
                value="tickets"
                label="Tickets"
              />
              <Tabs.Trigger
                value="activity"
                label="Activity"
              />
              <Tabs.Trigger
                value="notes"
                label="Notes"
              />
            </Tabs.List>
            <Tabs.Content value="tickets">
              <CustomerTicketsTab
                :tickets="tickets"
                :name="name"
                :loading="loading"
                @open-ticket="(event, ticket) => emit('open-ticket', event, ticket)"
                @new-ticket="(event) => emit('new-ticket', event)"
              />
            </Tabs.Content>
            <Tabs.Content value="activity">
              <CustomerActivityTab
                :activity="activity"
                :name="name"
                :loading="loading"
                :now="clock"
              />
            </Tabs.Content>
            <Tabs.Content value="notes">
              <CustomerNotesTab
                v-model:draft="draft"
                :notes="notes"
                :name="name"
                :loading="loading"
                :saving="saving"
                @add-note="(event, text) => emit('add-note', event, text)"
              />
            </Tabs.Content>
          </Tabs>
        </div>
      </section>
    </div>
  </CustomerClock>
</template>
```

## `sample.ts`

```ts
import type {
  DetailCustomerCustomer,
  DetailCustomerEvent,
  DetailCustomerNote,
  DetailCustomerSatisfaction,
  DetailCustomerTicket
} from './detail-customer.vue'

export const sampleNow = '2026-11-24T14:45:00Z'

export const sampleCustomer: DetailCustomerCustomer = {
  id: 'cus_1042',
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  phone: '+1 555-0142',
  timeZone: 'America/New_York',
  language: 'English (United States)',
  organization: 'Acme Inc.',
  organizationHref: '/organizations/acme',
  tags: ['enterprise', 'billing', 'priority-support'],
  customerSince: '2024-03-12T15:00:00Z',
  avatarSrc: ''
}

export const sampleSatisfaction: DetailCustomerSatisfaction = {
  average: 4.5,
  surveys: 12
}

export const sampleTickets: DetailCustomerTicket[] = [
  {
    id: '4812',
    subject: 'Custom domain returns a certificate error',
    status: 'open',
    priority: 'urgent',
    dueAt: '2026-11-24T15:30:00Z',
    updatedAt: '2026-11-24T13:52:00Z'
  },
  {
    id: '4790',
    subject: 'Invoice shows the wrong billing address',
    status: 'pending',
    priority: 'medium',
    dueAt: '2026-11-25T18:00:00Z',
    updatedAt: '2026-11-23T16:10:00Z'
  },
  {
    id: '4755',
    subject: 'Add a teammate to the Acme account',
    status: 'solved',
    priority: 'low',
    dueAt: '',
    updatedAt: '2026-11-20T11:05:00Z'
  },
  {
    id: '4701',
    subject: 'Cache purge does not reach every location',
    status: 'closed',
    priority: 'high',
    dueAt: '',
    updatedAt: '2026-11-12T09:40:00Z'
  }
]

export const sampleActivity: DetailCustomerEvent[] = [
  {
    id: 'evt_6',
    type: 'created',
    title: 'Opened ticket #4812',
    description: 'Custom domain returns a certificate error',
    actor: 'Jane Doe',
    at: '2026-11-24T13:40:00Z'
  },
  {
    id: 'evt_5',
    type: 'replied',
    title: 'Replied on ticket #4790',
    description: 'Sent the corrected billing address.',
    actor: 'Jane Doe',
    at: '2026-11-23T16:10:00Z'
  },
  {
    id: 'evt_4',
    type: 'merged',
    title: 'Ticket #4793 merged into #4790',
    description: 'Both tickets asked about the same invoice.',
    actor: 'Sam Lee',
    at: '2026-11-23T15:20:00Z'
  },
  {
    id: 'evt_3',
    type: 'rated',
    title: 'Rated ticket #4755 with 5 out of 5',
    description: 'Quick and clear, thank you.',
    actor: 'Jane Doe',
    at: '2026-11-20T12:30:00Z'
  },
  {
    id: 'evt_2',
    type: 'solved',
    title: 'Ticket #4755 solved',
    description: '',
    actor: 'Priya Patel',
    at: '2026-11-20T11:05:00Z'
  }
]

export const sampleNotes: DetailCustomerNote[] = [
  {
    id: 'note_1',
    author: 'Priya Patel',
    at: '2026-11-02T14:00:00Z',
    body: 'Prefers email over phone. Available 9 AM to 5 PM Eastern.'
  },
  {
    id: 'note_2',
    author: 'Sam Lee',
    at: '2026-11-23T15:25:00Z',
    body: 'Jane is the billing contact for Acme. Send invoice questions to her, not the account owner.'
  }
]

export const sampleNewCustomer: DetailCustomerCustomer = {
  id: 'cus_1187',
  name: 'Alex Morgan',
  email: 'alex.morgan@example.com',
  phone: '',
  timeZone: 'America/Los_Angeles',
  language: 'English (United States)',
  organization: 'Acme Inc.',
  organizationHref: '/organizations/acme',
  tags: [],
  customerSince: '2026-11-24T09:30:00Z',
  avatarSrc: ''
}

export const sampleNewCustomerActivity: DetailCustomerEvent[] = [
  {
    id: 'evt_1',
    type: 'joined',
    title: 'Customer created',
    description: 'Added from the Acme Inc. organization.',
    actor: 'Sam Lee',
    at: '2026-11-24T09:30:00Z'
  }
]
```

## `parts/customer-clock.vue`

```ts
<script setup lang="ts">
  import ConfigProvider from '@aziontech/webkit/config-provider'

  export interface CustomerClockProps {
    /** A fixed reference time for every countdown and relative time inside; the sample also reads its dates in UTC; left out, the page reads the real clock and zone or the app provider's. */
    now?: string | number | Date
  }

  withDefaults(defineProps<CustomerClockProps>(), { now: undefined })

  defineSlots<{
    /** The page body. */
    default(): unknown
  }>()
</script>

<template>
  <ConfigProvider
    :now="now"
    :time-zone="now === undefined ? undefined : 'UTC'"
    class="min-w-0 flex-1"
  >
    <slot />
  </ConfigProvider>
</template>
```

## `parts/customer-details-panel.vue`

```ts
<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CopyButton from '@aziontech/webkit/copy-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import Link from '@aziontech/webkit/link'
  import Rating from '@aziontech/webkit/rating'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

  import type { DetailCustomerCustomer, DetailCustomerSatisfaction } from '../detail-customer.vue'

  export interface CustomerDetailsPanelProps {
    /** The customer; undefined while loading. */
    customer?: DetailCustomerCustomer
    /** Their satisfaction surveys; undefined while loading. */
    satisfaction?: DetailCustomerSatisfaction
    /** A fixed reference time for the local time; left out, the real clock reads after mount. */
    now?: string | number | Date
    /** Skeletons stand in for the values. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<CustomerDetailsPanelProps>(), {
    customer: undefined,
    satisfaction: undefined,
    now: undefined,
    loading: false
  })

  const { formatDate, formatNumber, plural } = useLocale()

  const tick = ref<number | undefined>(undefined)
  let timer: ReturnType<typeof setInterval> | undefined
  const mounted = ref(false)
  onMounted(() => {
    mounted.value = true
    tick.value = Date.now()
    timer = setInterval(() => (tick.value = Date.now()), 60_000)
  })
  onBeforeUnmount(() => clearInterval(timer))

  const localTime = computed(() => {
    const at = props.now ?? tick.value
    if (at === undefined || !props.customer) return ''
    return formatDate(at, { timeStyle: 'short', timeZone: props.customer.timeZone })
  })
  const since = computed(() =>
    props.customer
      ? formatDate(props.customer.customerSince, {
          dateStyle: 'long',
          timeZone: props.now === undefined && mounted.value ? undefined : 'UTC'
        })
      : ''
  )
  const score = computed(() =>
    formatNumber(props.satisfaction?.average ?? 0, { maximumFractionDigits: 1 })
  )
  const surveys = computed(() =>
    plural(props.satisfaction?.surveys ?? 0, { one: '{count} survey', other: '{count} surveys' })
  )
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Card title="Details">
      <KeyValueList
        :loading="loading"
        aria-label="Customer details"
      >
        <KeyValueList.Item label="Email">
          <template v-if="customer">
            <bdi class="min-w-0 truncate">{{ customer.email }}</bdi>
            <CopyButton
              :value="customer.email"
              aria-label="Copy email"
              size="small"
            />
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Phone">
          <template v-if="customer?.phone">
            <bdi dir="ltr">{{ customer.phone }}</bdi>
            <CopyButton
              :value="customer.phone"
              aria-label="Copy phone number"
              size="small"
            />
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Local time">
          <template v-if="customer">
            <bdi v-if="localTime">{{ localTime }}</bdi>
            <span class="text-(--text-muted)"
              ><bdi dir="ltr">{{ customer.timeZone }}</bdi></span
            >
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Language">
          <template v-if="customer">{{ customer.language }}</template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Organization">
          <template v-if="customer">
            <Link
              v-if="customer.organizationHref"
              :href="customer.organizationHref"
              inline
            >
              <bdi>{{ customer.organization }}</bdi>
            </Link>
            <bdi v-else>{{ customer.organization }}</bdi>
          </template>
        </KeyValueList.Item>
        <KeyValueList.Item label="Tags">
          <ul
            v-if="customer?.tags.length"
            class="flex min-w-0 flex-wrap gap-(--spacing-2xs)"
            aria-label="Tags"
          >
            <li
              v-for="tag in customer.tags"
              :key="tag"
            >
              <Tag
                :label="tag"
                severity="neutral"
                size="small"
              />
            </li>
          </ul>
        </KeyValueList.Item>
        <KeyValueList.Item label="Customer since">
          <template v-if="customer">{{ since }}</template>
        </KeyValueList.Item>
      </KeyValueList>
    </Card>

    <Card title="Satisfaction">
      <Skeleton
        v-if="loading"
        width="12rem"
        height="1.25rem"
      />
      <div
        v-else-if="satisfaction && satisfaction.surveys > 0"
        class="flex flex-wrap items-center gap-(--spacing-xs)"
      >
        <Rating
          :model-value="satisfaction.average"
          readonly
          size="small"
        />
        <p class="text-body-sm text-(--text-muted)">{{ score }} out of 5 from {{ surveys }}</p>
      </div>
      <p
        v-else
        class="text-body-sm text-(--text-muted)"
      >
        No ratings yet
      </p>
    </Card>
  </div>
</template>
```

## `parts/customer-tickets-tab.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Countdown from '@aziontech/webkit/countdown'
  import DataTable, { type TableColumn } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Link from '@aziontech/webkit/link'
  import PriorityTag from '@aziontech/webkit/priority-tag'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import type { TagSeverity } from '@aziontech/webkit/tag'

  import type { DetailCustomerTicket, DetailCustomerTicketStatus } from '../detail-customer.vue'

  export interface CustomerTicketsTabProps {
    /** The customer's tickets, open ones first. */
    tickets: DetailCustomerTicket[]
    /** The customer's name, for the caption and the empty state. */
    name?: string
    /** Skeleton rows stand in for the tickets. */
    loading?: boolean
  }

  withDefaults(defineProps<CustomerTicketsTabProps>(), { name: '', loading: false })

  const emit = defineEmits<{
    'open-ticket': [event: MouseEvent, ticket: DetailCustomerTicket]
    'new-ticket': [event: MouseEvent]
  }>()

  const columns: TableColumn[] = [
    { id: 'subject', accessorKey: 'subject', header: 'Subject', principal: true },
    { id: 'status', accessorKey: 'status', header: 'Status', minWidth: 96 },
    { id: 'priority', accessorKey: 'priority', header: 'Priority', minWidth: 120 },
    { id: 'sla', accessorKey: 'dueAt', header: 'Next reply', minWidth: 144 },
    { id: 'updated', accessorKey: 'updatedAt', header: 'Updated', minWidth: 120 }
  ]

  const statuses: Record<DetailCustomerTicketStatus, { label: string; severity: TagSeverity }> = {
    open: { label: 'Open', severity: 'info' },
    pending: { label: 'Pending', severity: 'warning' },
    solved: { label: 'Solved', severity: 'success' },
    closed: { label: 'Closed', severity: 'neutral' }
  }

  const running = (ticket: DetailCustomerTicket) =>
    ticket.dueAt !== '' && (ticket.status === 'open' || ticket.status === 'pending')
</script>

<template>
  <DataTable
    :data="tickets"
    :columns="columns"
    row-key="id"
    bordered
    stackable
    :loading="loading"
  >
    <template #caption>
      <span class="sr-only">{{ name ? `Tickets from ${name}` : 'Tickets' }}</span>
    </template>
    <template #cell-subject="{ row }">
      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
        <span class="shrink-0 text-body-sm text-(--text-muted)">#{{ row.id }}</span>
        <Link
          class="min-w-0"
          :label="row.subject"
          :href="`/tickets/${row.id}`"
          size="small"
          @click="(event: MouseEvent) => emit('open-ticket', event, row)"
        />
      </span>
    </template>
    <template #cell-status="{ row }">
      <TableCellStatus
        :label="statuses[row.status as DetailCustomerTicketStatus].label"
        :severity="statuses[row.status as DetailCustomerTicketStatus].severity"
      />
    </template>
    <template #cell-priority="{ row }">
      <PriorityTag
        :priority="row.priority"
        size="small"
      />
    </template>
    <template #cell-sla="{ row }">
      <Countdown
        v-if="running(row)"
        :deadline="row.dueAt"
        :paused="row.status === 'pending'"
        size="small"
      />
      <template v-else>
        <span
          class="text-(--text-muted)"
          aria-hidden="true"
          >—</span
        >
        <span class="sr-only">No SLA running</span>
      </template>
    </template>
    <template #cell-updated="{ row }">
      <TableCellTime :value="row.updatedAt" />
    </template>
    <template #empty>
      <EmptyState
        size="small"
        icon="az az-ticket"
        title="No tickets yet"
        :description="`${name || 'This customer'} has not contacted support yet.`"
      >
        <template #actions>
          <Button
            label="New ticket"
            icon="az az-plus"
            variant="secondary"
            size="small"
            @click="(event: MouseEvent) => emit('new-ticket', event)"
          />
        </template>
      </EmptyState>
    </template>
  </DataTable>
</template>
```

## `parts/customer-activity-tab.vue`

```ts
<script setup lang="ts">
  import EmptyState from '@aziontech/webkit/empty-state'
  import Timeline, { type TimelineItemSeverity } from '@aziontech/webkit/timeline'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, onMounted, ref } from 'vue'

  import type { DetailCustomerEvent, DetailCustomerEventType } from '../detail-customer.vue'

  export interface CustomerActivityTabProps {
    /** The account activity, newest first. */
    activity: DetailCustomerEvent[]
    /** The customer's name, for the list's accessible name. */
    name?: string
    /** Placeholder items stand in for the activity. */
    loading?: boolean
    /** A fixed reference time; while set, the day headings read in UTC. */
    now?: string | number | Date
  }

  const props = withDefaults(defineProps<CustomerActivityTabProps>(), {
    name: '',
    loading: false,
    now: undefined
  })

  const markers: Record<DetailCustomerEventType, { icon: string; severity: TimelineItemSeverity }> =
    {
      joined: { icon: 'az az-user-plus', severity: 'info' },
      created: { icon: 'az az-ticket', severity: 'neutral' },
      replied: { icon: 'az az-reply', severity: 'neutral' },
      rated: { icon: 'az az-star', severity: 'warning' },
      merged: { icon: 'az az-git-merge', severity: 'info' },
      solved: { icon: 'az az-circle-check', severity: 'success' }
    }

  const { formatDate } = useLocale()
  const mounted = ref(false)
  onMounted(() => (mounted.value = true))
  const zone = computed(() => (props.now === undefined && mounted.value ? undefined : 'UTC'))

  const days = computed(() => {
    const groups: { label: string; events: DetailCustomerEvent[] }[] = []
    for (const event of props.activity) {
      const label = formatDate(event.at, { dateStyle: 'long', timeZone: zone.value })
      const last = groups.at(-1)
      if (last?.label === label) last.events.push(event)
      else groups.push({ label, events: [event] })
    }
    return groups
  })
</script>

<template>
  <EmptyState
    v-if="!loading && !activity.length"
    size="small"
    icon="az az-history"
    title="No activity yet"
    description="Tickets, replies and ratings show here as they happen."
  />
  <Timeline
    v-else
    :loading="loading"
    time-format="relative"
    :aria-label="name ? `Activity of ${name}` : 'Activity'"
  >
    <Timeline.Group
      v-for="day in days"
      :key="day.label"
      :label="day.label"
    >
      <Timeline.Item
        v-for="event in day.events"
        :key="event.id"
        :title="event.title"
        :description="event.description"
        :actor="event.actor"
        :time="event.at"
        :icon="markers[event.type].icon"
        :severity="markers[event.type].severity"
      />
    </Timeline.Group>
  </Timeline>
</template>
```

## `parts/customer-notes-tab.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Field from '@aziontech/webkit/field'
  import MessageThread from '@aziontech/webkit/message-thread'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, ref } from 'vue'

  import type { DetailCustomerNote } from '../detail-customer.vue'

  export interface CustomerNotesTabProps {
    /** Internal notes, oldest first. */
    notes: DetailCustomerNote[]
    /** The customer's name, for the list's accessible name. */
    name?: string
    /** Placeholder notes stand in for the list. */
    loading?: boolean
    /** A note is being saved. */
    saving?: boolean
  }

  const props = withDefaults(defineProps<CustomerNotesTabProps>(), {
    name: '',
    loading: false,
    saving: false
  })

  const emit = defineEmits<{
    'add-note': [event: MouseEvent, text: string]
  }>()

  const draft = defineModel<string>('draft', { default: '' })

  const tried = ref(false)
  const missing = computed(() => tried.value && draft.value.trim() === '')

  const onAdd = (event: MouseEvent) => {
    tried.value = true
    if (draft.value.trim() === '' || props.saving) return
    tried.value = false
    emit('add-note', event, draft.value.trim())
  }
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <MessageThread
      v-if="loading || notes.length"
      :loading="loading"
      timestamp-format="relative"
      :aria-label="name ? `Notes on ${name}` : 'Notes'"
    >
      <MessageThread.Item
        v-for="note in notes"
        :key="note.id"
        type="note"
        from="agent"
        :author="note.author"
        :timestamp="note.at"
      >
        <p
          class="whitespace-pre-line"
          dir="auto"
        >
          {{ note.body }}
        </p>
      </MessageThread.Item>
    </MessageThread>

    <div class="flex min-w-0 flex-col items-start gap-(--spacing-sm)">
      <Field
        class="w-full"
        :invalid="missing"
        :disabled="loading"
      >
        <Field.Label>Add a note</Field.Label>
        <Textarea
          v-model="draft"
          auto-resize
          :min-rows="3"
          dir="auto"
        />
        <Field.Description>Only agents can read notes.</Field.Description>
        <Field.Error v-if="missing">Write the note first.</Field.Error>
      </Field>
      <Button
        label="Add note"
        variant="secondary"
        size="medium"
        :loading="saving"
        loading-label="Saving the note"
        :disabled="loading"
        @click="onAdd"
      />
    </div>
  </div>
</template>
```

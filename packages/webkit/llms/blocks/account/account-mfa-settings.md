# AccountMfaSettings (`account/account-mfa-settings`)

> Multi-factor authentication across an account. A `PageHeader` with Documentation over a flush `Card` holding a Require MFA `SettingsRow` with a `Switch` (turning it on asks in a `ConfirmDialog` that names who has no second factor yet), a warning `Alert` counting the people who sign in with a password only while MFA is optional, the `view/view-table` controls row (`PropertyFilter` over name, email, MFA status and method, Refresh and Download CSV as `IconButton`s in a `Tooltip`, `CollectionPreferences`) and a paginated `DataTable` of people on one `useCollection`: Name (square `Avatar`, name and email), MFA as `TableCellStatus` (Enabled, Not set up), Method, Set up as `TableCellTime`, and `TableCellActions` with Reset MFA (behind a `ConfirmDialog`, for a lost device) or Send setup reminder; a filter with no match shows a small `EmptyState` with Clear filters. Built from `PageHeader`, `Button`, `Card`, `Item`, `SettingsRow`, `Switch`, `Alert`, `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences`, `DataTable`, `EmptyState`, `Avatar`, `DropdownMenu`, `ConfirmDialog`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/account-mfa-settings/account-mfa-settings.vue` in `@aziontech/webkit`
- MCP: `get_block("account/account-mfa-settings")`
- Components: [Alert](../../components/alert.md), [Avatar](../../components/avatar.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfirmDialog](../../components/confirm-dialog.md), [DataTable](../../components/data-table.md), [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [IconButton](../../components/icon-button.md), [Item](../../components/item.md), [PageHeader](../../components/page-header.md), [PropertyFilter](../../components/property-filter.md), [SettingsRow](../../components/settings-row.md), [Switch](../../components/switch.md), [Table](../../components/table.md), `TableCellActions`, `TableCellStatus`, `TableCellTime`, [Tooltip](../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

mfa management; multi-factor authentication; two-factor authentication; 2fa; require mfa; reset mfa; security settings; gerenciar mfa; autenticação multifator; exigir mfa; redefinir mfa

Multi-factor authentication for a whole account. An admin sees who signs in with a second factor and who uses a password only, requires MFA for everyone, reminds the people who have not set it up, and resets the factor of someone who lost their device. Setting up a factor and the sign-in challenge are `auth/auth-sign-in` (`MfaSetup`, `MfaCode`); this page manages them for other people. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- An account or organisation page where admins enforce or audit multi-factor authentication.
- Helping a person who lost the device that holds their factor.

## When not to use

- A person setting up their own factor: use `auth/auth-sign-in#MfaSetup`.
- The code prompt at sign-in: use `auth/auth-sign-in#MfaCode`.
- Inviting or removing people: use `account/account-users`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Multi-factor authentication` and one sentence on what the page holds. Action: Documentation.

### B. Require MFA — `Card`, `Item`, `SettingsRow`, `Switch`, `ConfirmDialog` (required)

One compact `SettingsRow` in an `Item.List` in a flush `Card`. Turning the `Switch` on opens a `ConfirmDialog` (`variant="primary"`) that names the people without a factor and says they cannot use the account until they set one up; turning it off applies at once. Either way the block updates `v-model:required` and the page saves it. While data loads or failed, the switch is disabled.

### C. Password-only warning — `Alert` (conditional)

While MFA is optional and someone has no factor, a warning `Alert` counts them (`2 of 5 people sign in with a password only.`) and points at the two remedies.

### D. Controls row — `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences` (required)

The `view/view-table` controls row, as on every account list: a `PropertyFilter` over Name, Email, MFA status and Method (`v-bind="propertyFilterProps"`), then Refresh and Download CSV as outlined `IconButton`s in a `Tooltip`, and `CollectionPreferences` for page size and columns. Download CSV is disabled when no row matches.

### E. People table — `DataTable`, `TableCellActions`, `TableCellStatus`, `TableCellTime`, `Avatar`, `EmptyState`, `useCollection` (required)

A `DataTable` with `v-bind="tableProps"` in a flush `Card`, paginated by `useCollection`: Name (square `Avatar`, name, email under it, and below `sm` the MFA `TableCellStatus` under the email, hidden from assistive tech, so a phone shows who has MFA without scrolling past the pinned actions), MFA as `TableCellStatus` (Enabled success, Not set up warning), Method, and Set up as `TableCellTime` or a dash. When no person matches the filters, the table's `#empty` slot renders a small `EmptyState` (`No matching people`) with Clear filters.

### F. Row actions — `DropdownMenu`, `ConfirmDialog` (required)

`TableCellActions` named after the person: Reset MFA for an enabled factor, behind a `ConfirmDialog` that says what the person loses and when to use it; Send setup reminder for a person without one. Reset marks the row Not set up and emits `reset`; the reminder emits `remind`.

### G. Load failure and outcomes — `Alert` (required)

When the list fails to load, a danger `Alert` with Retry takes the table's place. The page that runs the request ends require, optional, reset and reminder in a success toast; they are not deploys, so no toast carries Edit or Redeploy. The page calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its people through props and emits every action; it fetches nothing. `MfaSettingsMember` and `MfaSettingsProps` are exported from `account-mfa-settings.vue`, and `sample.ts` holds the sample people the block renders when `members` is left out (and never while `loading` or `error` is set).

| Prop       | Type                  | What it does                                                                                                                                |
| ---------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `members`  | `MfaSettingsMember[]` | The rows; the filter, the sort and the pages run on them in the browser.                                                                    |
| `loading`  | `boolean`             | A request is in flight. With no people it is the first load (the Switch disables, the table shows loading rows); with people Refresh spins. |
| `error`    | `string`              | Why the load failed, shown in the danger `Alert` with Retry that replaces the controls and the table; the Switch disables.                  |
| `required` | `boolean`             | `v-model:required`: whether the account requires MFA; on hides the password-only warning.                                                   |

| Event             | Payload           | When                                                                 |
| ----------------- | ----------------- | -------------------------------------------------------------------- |
| `update:required` | `boolean`         | The require dialog was confirmed (`true`), or the Switch turned off. |
| `refresh`         | `(event)`         | Refresh.                                                             |
| `retry`           | `(event)`         | Retry in the error alert.                                            |
| `remind`          | `(event, member)` | Send setup reminder in the row menu.                                 |
| `reset`           | `(event, member)` | The reset dialog was confirmed; the row already reads Not set up.    |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import AccountMfaSettings from './account-mfa-settings.vue'

  const { data, pending, error, refresh } = useMfaStatus()
  const loadError = 'The MFA status could not be loaded. Nothing was changed; try again.'
</script>

<template>
  <AccountMfaSettings
    :members="data?.members ?? []"
    :required="data?.required ?? false"
    :loading="pending"
    :error="error ? loadError : ''"
    @update:required="saveRequired"
    @refresh="refresh"
    @retry="refresh"
    @remind="(_event, member) => sendReminder(member.id)"
    @reset="(_event, member) => resetMfa(member.id)"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Name who is affected before requiring MFA.
- Keep people without a factor visible and marked, with a way to remind them.
- Say what a reset does (password only until they set it up again) before confirming it.

## Don't

- Don't show or copy anyone's secret or recovery codes here; only the owner of the factor sees them.
- Don't reset without a confirmation; it weakens one person's sign-in.
- Don't make the warning color the only signal; the Alert and the status say it in words.

## Copy

- **Title:** `Multi-factor authentication`. **Setting:** `Require MFA`.
- **Statuses:** `Enabled`, `Not set up`. **Actions:** `Reset MFA`, `Send setup reminder`.
- **No match:** `No matching people`, `No person matches these filters.`, `Clear filters`.
- **Toasts:** `MFA is now required.`, `MFA is optional again.`, `MFA reset for Jordan Reyes.`, `Reminder sent to priya.nair@example.com.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- The Switch is named Require MFA and the setting description explains the effect.
- The row menu is named `Actions for <person>`; status is text, not color.
- Both confirmations are dialogs that return focus to their trigger.
- `/` focuses the property filter from anywhere on the page, except while typing in a field.

## States

- Default: `members` holds five people, three with a factor, MFA optional, the warning shown.
- Required: MFA required for the account (`required` is `true`); the Switch is on and the warning is gone.
- Loading: the first load (`loading` with no `members`); the Switch is disabled and the table shows its loading rows.
- Error: the list did not load (`error` is set); a danger Alert with the message and Retry, the Switch disabled.

## Related

- `auth/auth-sign-in` — `MfaSetup` and `MfaCode`, the person's own side.
- `account/account-users` — the people in the account.
- `account/account-activity-history` — where MFA changes are audited.

## Variants

- `Default` — primary (the code below)
- `Required` — MFA required for the account: the Switch on, no password-only warning; people without MFA still listed as Not set up until their next sign-in.
- `Loading` — The first load: the Switch disabled and the table's loading rows.
- `Error` — The MFA status did not load: a danger Alert with Retry replaces the table and the Switch is disabled.

Each variant is the same screen in another state: `get_block("account/account-mfa-settings", { variant })`, or the file under `blocks/account/account-mfa-settings/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DataTable from '@aziontech/webkit/data-table'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingsRow from '@aziontech/webkit/settings-row'
  import Switch from '@aziontech/webkit/switch'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref, watch } from 'vue'

  import { sampleMembers } from './sample'

  /** One person of the account and their second factor. */
  export interface MfaSettingsMember {
    /** Stable key. */
    id: string
    /** Display name. */
    name: string
    /** Sign-in email, shown under the name. */
    email: string
    /** The second factor in use, such as Authenticator app; empty when none. */
    method: string
    /** Whether the person signs in with a second factor. */
    enabled: boolean
    /** When the second factor was set up, or null when it is not. */
    since: Date | null
  }

  export interface MfaSettingsProps {
    /** The people to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    members?: MfaSettingsMember[]
    /** A request is in flight: with no people it is the first load, with people a refresh. */
    loading?: boolean
    /** Why the MFA status could not load; a danger alert with Retry replaces the table. */
    error?: string
  }

  const props = withDefaults(defineProps<MfaSettingsProps>(), {
    members: undefined,
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    remind: [event: Event, member: MfaSettingsMember]
    reset: [event: MouseEvent, member: MfaSettingsMember]
  }>()

  const required = defineModel<boolean>('required', { default: false })

  type MemberRow = MfaSettingsMember & { status: string }

  const source = computed<MfaSettingsMember[]>(
    () => props.members ?? (props.loading || props.error ? [] : sampleMembers)
  )
  const items = ref<MfaSettingsMember[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const loadFailed = computed(() => props.error !== '')

  const withoutMfa = computed(() => items.value.filter((member) => !member.enabled))

  const requireDescription = computed(() => {
    const count = withoutMfa.value.length
    if (!count)
      return 'Everyone in the account already uses MFA. New people set it up at their first sign-in.'
    const names = withoutMfa.value.map((member) => member.name).join(', ')
    return (
      `${count} ${count === 1 ? 'person does' : 'people do'} not use MFA yet (${names}). ` +
      'They are asked to set it up at their next sign-in and cannot use the account until they do.'
    )
  })

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'MFA', minWidth: 120 },
    { accessorKey: 'method', header: 'Method', minWidth: 160 },
    { accessorKey: 'since', header: 'Set up', minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]
  const rows = computed(() =>
    items.value.map((member) => ({
      ...member,
      status: member.enabled ? 'Enabled' : 'Not set up'
    }))
  )
  const properties: FilteringProperty[] = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    {
      key: 'status',
      label: 'MFA',
      options: [{ value: 'Enabled' }, { value: 'Not set up' }]
    },
    { key: 'method', label: 'Method', options: [{ value: 'Authenticator app' }] }
  ]

  const { tableProps, propertyFilterProps, preferencesProps, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'email', 'status', 'method'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'account-mfa' }
    })

  const membersTableEl = ref<TableExposed<MemberRow> | null>(null)
  const exportCsv = () => membersTableEl.value?.exportCsv({ filename: 'mfa-status.csv' })

  const refreshing = computed(() => props.loading && items.value.length > 0)

  const requireOpen = ref(false)
  const onRequire = (value: boolean) => {
    if (value) {
      requireOpen.value = true
      return
    }
    required.value = false
  }
  const confirmRequire = () => {
    required.value = true
    requireOpen.value = false
  }

  const pending = ref<MfaSettingsMember | null>(null)
  const resetOpen = ref(false)
  const onAction = (event: Event, value: DropdownMenuItemValue, row: MemberRow) => {
    const member = items.value.find((item) => item.id === row.id)
    if (!member) return
    if (value === 'reset') {
      pending.value = member
      resetOpen.value = true
      return
    }
    if (value === 'remind') emit('remind', event, member)
  }
  const reset = (event: MouseEvent) => {
    const member = pending.value
    if (!member) return
    items.value = items.value.map((item) =>
      item.id === member.id ? { ...item, enabled: false, method: '', since: null } : item
    )
    resetOpen.value = false
    emit('reset', event, member)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Multi-factor authentication"
        description="Who signs in with a second factor, and whether the account requires one."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/mfa"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <Card :padded="false">
          <template #default>
            <Item.List>
              <SettingsRow
                title="Require MFA"
                variant="compact"
                description="Everyone in the account must use a second factor to sign in. People without one set it up at their next sign-in."
              >
                <Switch
                  :model-value="required"
                  aria-label="Require MFA"
                  :disabled="loading || loadFailed"
                  @update:model-value="onRequire"
                />
              </SettingsRow>
            </Item.List>
          </template>
        </Card>

        <Alert
          v-if="!required && !loading && !loadFailed && withoutMfa.length"
          severity="warning"
        >
          {{ withoutMfa.length }} of {{ items.length }} people sign in with a password only. Require
          MFA, or remind them to set it up.
        </Alert>

        <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <header
            v-if="!loadFailed"
            class="flex flex-wrap items-start gap-(--layout-group-gap)"
          >
            <div class="flex min-w-0 grow basis-(--container-2xs)">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter people"
                aria-label="Filter people"
              />
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-(--spacing-xs)">
              <Tooltip
                content="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="az az-refresh"
                  variant="outline"
                  size="medium"
                  :loading="refreshing"
                  aria-label="Refresh"
                  @click="emit('refresh', $event)"
                />
              </Tooltip>
              <Tooltip
                content="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="az az-download"
                  variant="outline"
                  size="medium"
                  :disabled="!matchingItems.length"
                  aria-label="Download CSV"
                  @click="exportCsv"
                />
              </Tooltip>
              <CollectionPreferences
                v-bind="preferencesProps"
                title="Table preferences"
              />
            </div>
          </header>

          <Alert
            v-if="loadFailed"
            severity="danger"
          >
            {{ error }}
            <template #actions>
              <Button
                label="Retry"
                variant="secondary"
                size="small"
                @click="emit('retry', $event)"
              />
            </template>
          </Alert>

          <Card
            v-else
            :padded="false"
          >
            <template #default>
              <DataTable
                ref="membersTableEl"
                v-bind="tableProps"
                :loading="loading"
                sortable
                :bordered="false"
                aria-label="People and their MFA status"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      :label="row.name"
                      size="small"
                      variant="square"
                    />
                    <div class="flex min-w-0 flex-col">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        row.name
                      }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)">{{ row.email }}</span>
                      <div
                        aria-hidden="true"
                        class="mt-(--spacing-2xs) w-fit sm:hidden"
                      >
                        <TableCellStatus
                          :label="row.status"
                          :severity="row.enabled ? 'success' : 'warning'"
                        />
                      </div>
                    </div>
                  </div>
                </template>
                <template #cell-status="{ row }">
                  <TableCellStatus
                    :label="row.status"
                    :severity="row.enabled ? 'success' : 'warning'"
                  />
                </template>
                <template #cell-method="{ value }">
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                </template>
                <template #cell-since="{ row }">
                  <TableCellTime
                    v-if="row.since"
                    :value="row.since"
                  />
                  <span
                    v-else
                    class="text-body-sm text-(--text-muted)"
                    >—</span
                  >
                </template>
                <template #header-actions>
                  <span class="sr-only">Actions</span>
                </template>
                <template #cell-actions="{ row }">
                  <TableCellActions
                    :name="row.name"
                    @select="(event, value) => onAction(event, value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Item
                        key="dropdown-menu.option-1"
                        v-if="row.enabled"
                        value="reset"
                        label="Reset MFA"
                      />
                      <DropdownMenu.Item
                        key="dropdown-menu.option-2"
                        v-else
                        value="remind"
                        label="Send setup reminder"
                      />
                    </DropdownMenu.Group>
                  </TableCellActions>
                </template>
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="az az-search"
                    title="No matching people"
                    description="No person matches these filters."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        variant="outline"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>
                </template>
              </DataTable>
            </template>
          </Card>
        </div>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="requireOpen"
      variant="primary"
      title="Require MFA"
      :description="requireDescription"
      confirm-label="Require MFA"
      size="small"
      @confirm="confirmRequire"
    />

    <ConfirmDialog
      v-model:open="resetOpen"
      title="Reset MFA"
      :description="`${pending?.name ?? ''} loses the second factor they set up and signs in with their password only until they set one up again. Use it when they lost their device.`"
      confirm-label="Reset MFA"
      size="small"
      @confirm="reset"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { MfaSettingsMember } from './account-mfa-settings.vue'

const DAY = 86_400_000
const REFERENCE = Date.UTC(2026, 10, 10, 12)

export const sampleMembers: MfaSettingsMember[] = [
  {
    id: 'm-1',
    name: 'Avery Stone',
    email: 'avery.stone@example.com',
    method: 'Authenticator app',
    enabled: true,
    since: new Date(REFERENCE - 210 * DAY)
  },
  {
    id: 'm-2',
    name: 'Jordan Reyes',
    email: 'jordan.reyes@example.com',
    method: 'Authenticator app',
    enabled: true,
    since: new Date(REFERENCE - 40 * DAY)
  },
  {
    id: 'm-3',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    method: '',
    enabled: false,
    since: null
  },
  {
    id: 'm-4',
    name: 'Lena Fischer',
    email: 'lena.fischer@example.com',
    method: 'Authenticator app',
    enabled: true,
    since: new Date(REFERENCE - 6 * DAY)
  },
  {
    id: 'm-5',
    name: 'Marco Bianchi',
    email: 'marco.bianchi@example.com',
    method: '',
    enabled: false,
    since: null
  }
]
```

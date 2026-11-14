# MfaManagement (`platform/account/mfa-management`)

> Multi-factor authentication across an account. A `PageHeader` with Documentation over a flush `Card` holding a Require MFA `SettingRow` with a `Switch` (turning it on asks in a `ConfirmDialog` that names who has no second factor yet), a warning `Alert` counting the people who sign in with a password only while MFA is optional, the `platform/view/table-view` controls row (`PropertyFilter` over name, email, MFA status and method, Refresh and Download CSV as `IconButton`s in a `Tooltip`, `CollectionPreferences`) and a paginated `Table` of people on one `useCollection`: Name (square `Avatar`, name and email), MFA as `Table.CellStatus` (Enabled, Not set up), Method, Set up as `Table.CellTime`, and `Table.CellActions` with Reset MFA (behind a `ConfirmDialog`, for a lost device) or Send setup reminder; a filter with no match shows a small `EmptyState` with Clear filters. Built from `PageHeader`, `Button`, `Card`, `Item`, `SettingRow`, `Switch`, `Alert`, `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences`, `Table`, `EmptyState`, `Avatar`, `DropdownMenu`, `ConfirmDialog`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/account/mfa-management/mfa-management.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/mfa-management")`
- Components: [Alert](../../../components/alert.md), [Avatar](../../../components/avatar.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [CollectionPreferences](../../../components/collection-preferences.md), [ConfirmDialog](../../../components/confirm-dialog.md), [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [IconButton](../../../components/icon-button.md), [Item](../../../components/item.md), [PageHeader](../../../components/page-header.md), [PropertyFilter](../../../components/property-filter.md), [SettingRow](../../../components/setting-row.md), [Switch](../../../components/switch.md), [Table](../../../components/table.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

mfa management; multi-factor authentication; two-factor authentication; 2fa; require mfa; reset mfa; security settings; gerenciar mfa; autenticação multifator; exigir mfa; redefinir mfa

Multi-factor authentication for a whole account. An admin sees who signs in with a second factor and who uses a password only, requires MFA for everyone, reminds the people who have not set it up, and resets the factor of someone who lost their device. Setting up a factor and the sign-in challenge are `platform/auth` (`MfaSetup`, `MfaCode`); this page manages them for other people. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- An account or organisation page where admins enforce or audit multi-factor authentication.
- Helping a person who lost the device that holds their factor.

## When not to use

- A person setting up their own factor: use `platform/auth#MfaSetup`.
- The code prompt at sign-in: use `platform/auth#MfaCode`.
- Inviting or removing people: use `platform/account/users`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Multi-factor authentication` and one sentence on what the page holds. Action: Documentation.

### B. Require MFA — `Card`, `Item`, `SettingRow`, `Switch`, `ConfirmDialog` (required)

One compact `SettingRow` in an `Item.List` in a flush `Card`. Turning the `Switch` on opens a `ConfirmDialog` (`kind="primary"`) that names the people without a factor and says they cannot use the account until they set one up; turning it off applies at once with a toast. While data loads or failed, the switch is disabled.

### C. Password-only warning — `Alert` (conditional)

While MFA is optional and someone has no factor, a warning `Alert` counts them (`2 of 5 people sign in with a password only.`) and points at the two remedies.

### D. Controls row — `PropertyFilter`, `IconButton`, `Tooltip`, `CollectionPreferences` (required)

The `platform/view/table-view` controls row, as on every account list: a `PropertyFilter` over Name, Email, MFA status and Method (`v-bind="propertyFilterProps"`), then Refresh and Download CSV as outlined `IconButton`s in a `Tooltip`, and `CollectionPreferences` for page size and columns. Download CSV is disabled when no row matches.

### E. People table — `Table`, `Avatar`, `EmptyState`, `useCollection` (required)

A `Table` with `v-bind="tableProps"` in a flush `Card`, paginated by `useCollection`: Name (square `Avatar`, name, email under it), MFA as `Table.CellStatus` (Enabled success, Not set up warning), Method, and Set up as `Table.CellTime` or a dash. When no person matches the filters, the table's `#empty` slot renders a small `EmptyState` (`No matching people`) with Clear filters.

### F. Row actions — `DropdownMenu`, `ConfirmDialog` (required)

`Table.CellActions` named after the person: Reset MFA for an enabled factor, behind a `ConfirmDialog` that says what the person loses and when to use it; Send setup reminder for a person without one.

### G. Load failure and outcomes — `Alert` (required)

When the list fails to load, a danger `Alert` with Retry takes the table's place. Require, optional, reset and reminder end in a success toast; they are not deploys, so no toast carries Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

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

## States

- Default: five people, three with a factor, MFA optional, the warning shown.
- Required: MFA required for the account.
- Loading: the first load.
- Failed: the list did not load; a danger Alert with Retry.

## Related

- `platform/auth` — `MfaSetup` and `MfaCode`, the person's own side.
- `platform/account/users` — the people in the account.
- `platform/account/activity-history` — where MFA changes are audited.

## Variants

- `Default` — primary (the code below)
- `Required` — MFA required for the account: the Switch on, no password-only warning; people without MFA still listed as Not set up until their next sign-in.
- `Loading` — The first load: the Switch disabled and the table's loading rows.
- `Failed` — The MFA status did not load: a danger Alert with Retry replaces the table and the Switch is disabled.

Each variant is the same screen in another state: `get_pattern("platform/account/mfa-management", { variant })`, or the file under `blocks/platform/account/mfa-management/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import SettingRow from '@aziontech/webkit/setting-row'
  import Switch from '@aziontech/webkit/switch'
  import Table, { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { computed, ref } from 'vue'

  const DAY = 86_400_000
  const REFERENCE = Date.UTC(2026, 10, 10, 12)

  interface Member {
    id: string
    name: string
    email: string
    method: string
    enabled: boolean
    since: Date | null
  }

  type MemberRow = Member & { status: string }

  const seedMembers: Member[] = [
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

  const REQUIRED_ON_START = false
  const members = ref(seedMembers)
  const required = ref(REQUIRED_ON_START)
  const loading = ref(false)
  const loadFailed = ref(false)

  const withoutMfa = computed(() => members.value.filter((member) => !member.enabled))

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'MFA', minWidth: 120 },
    { accessorKey: 'method', header: 'Method', minWidth: 160 },
    { accessorKey: 'since', header: 'Set up', minWidth: 160 },
    { id: 'actions', kind: 'action', hideable: false }
  ]
  const rows = computed(() =>
    members.value.map((member) => ({
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

  const membersTable = ref<TableExposed<MemberRow> | null>(null)
  const exportCsv = () => membersTable.value?.exportCsv({ filename: 'mfa-status.csv' })

  const refreshing = ref(false)
  const refresh = () => {
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      members.value = seedMembers
      loading.value = false
    }, 700)
  }

  const requireOpen = ref(false)
  const onRequire = (value: boolean) => {
    if (value) {
      requireOpen.value = true
      return
    }
    required.value = false
    toast.success('MFA is optional again.', {
      description: 'People who set it up keep using it.'
    })
  }
  const confirmRequire = () => {
    required.value = true
    requireOpen.value = false
    const count = withoutMfa.value.length
    toast.success('MFA is now required.', {
      description: count
        ? `${count} ${count === 1 ? 'person sets' : 'people set'} it up at their next sign-in.`
        : 'Everyone in the account already uses it.'
    })
  }

  const pending = ref<MemberRow | null>(null)
  const resetOpen = ref(false)
  const onAction = (value: DropdownMenuOptionValue, row: MemberRow) => {
    if (value === 'reset') {
      pending.value = row
      resetOpen.value = true
      return
    }
    if (value === 'remind') {
      toast.success(`Reminder sent to ${row.email}.`, {
        description: 'The email links to the MFA setup page.'
      })
    }
  }
  const reset = () => {
    const row = pending.value
    if (!row) return
    const member = members.value.find((item) => item.id === row.id)
    if (member) {
      member.enabled = false
      member.method = ''
      member.since = null
    }
    resetOpen.value = false
    toast.success(`MFA reset for ${row.name}.`, {
      description: required.value
        ? 'They set it up again at their next sign-in.'
        : 'They can sign in with their password until they set it up again.'
    })
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
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/mfa"
            target="_blank"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <Card :padded="false">
          <template #content>
            <Item.List>
              <SettingRow
                title="Require MFA"
                kind="compact"
                description="Everyone in the account must use a second factor to sign in. People without one set it up at their next sign-in."
              >
                <Switch
                  :model-value="required"
                  aria-label="Require MFA"
                  :disabled="loading || loadFailed"
                  @update:model-value="onRequire"
                />
              </SettingRow>
            </Item.List>
          </template>
        </Card>

        <Alert
          v-if="!required && !loading && !loadFailed && withoutMfa.length"
          severity="warning"
        >
          {{ withoutMfa.length }} of {{ members.length }} people sign in with a password only.
          Require MFA, or remind them to set it up.
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
                text="Refresh"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-refresh"
                  kind="outlined"
                  size="medium"
                  :loading="refreshing"
                  aria-label="Refresh"
                  @click="refresh"
                />
              </Tooltip>
              <Tooltip
                text="Download CSV"
                class="shrink-0"
              >
                <IconButton
                  icon="pi pi-download"
                  kind="outlined"
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
            The MFA status could not be loaded. Nothing was changed; try again.
            <template #action>
              <Button
                label="Retry"
                kind="secondary"
                size="small"
                @click="retryLoad"
              />
            </template>
          </Alert>

          <Card
            v-else
            :padded="false"
          >
            <template #content>
              <Table
                ref="membersTable"
                v-bind="tableProps"
                :loading="loading"
                enable-sorting
                :bordered="false"
                aria-label="People and their MFA status"
              >
                <template #cell-name="{ row }">
                  <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Avatar
                      :label="row.name"
                      size="small"
                      kind="square"
                    />
                    <div class="flex min-w-0 flex-col">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        row.name
                      }}</span>
                      <span class="truncate text-body-xs text-(--text-muted)">{{ row.email }}</span>
                    </div>
                  </div>
                </template>
                <template #cell-status="{ row }">
                  <Table.CellStatus
                    :label="row.status"
                    :severity="row.enabled ? 'success' : 'warning'"
                  />
                </template>
                <template #cell-method="{ value }">
                  <span class="truncate text-body-sm text-(--text-muted)">{{ value || '—' }}</span>
                </template>
                <template #cell-since="{ row }">
                  <Table.CellTime
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
                  <Table.CellActions
                    :name="row.name"
                    @select="(_event, value) => onAction(value, row)"
                  >
                    <DropdownMenu.Group>
                      <DropdownMenu.Option
                        key="dropdown-menu.option-1"
                        v-if="row.enabled"
                        value="reset"
                        label="Reset MFA"
                      />
                      <DropdownMenu.Option
                        key="dropdown-menu.option-2"
                        v-else
                        value="remind"
                        label="Send setup reminder"
                      />
                    </DropdownMenu.Group>
                  </Table.CellActions>
                </template>
                <template #empty>
                  <EmptyState
                    size="small"
                    icon="pi pi-search"
                    title="No matching people"
                    description="No person matches these filters."
                  >
                    <template #actions>
                      <Button
                        label="Clear filters"
                        kind="outlined"
                        size="small"
                        @click="clearFilters"
                      />
                    </template>
                  </EmptyState>
                </template>
              </Table>
            </template>
          </Card>
        </div>
      </section>
    </div>

    <ConfirmDialog
      v-model:open="requireOpen"
      kind="primary"
      title="Require MFA"
      :description="
        withoutMfa.length
          ? `${withoutMfa.length} ${withoutMfa.length === 1 ? 'person does' : 'people do'} not use MFA yet (${withoutMfa.map((member) => member.name).join(', ')}). They are asked to set it up at their next sign-in and cannot use the account until they do.`
          : 'Everyone in the account already uses MFA. New people set it up at their first sign-in.'
      "
      confirm-label="Require MFA"
      @confirm="confirmRequire"
    />

    <ConfirmDialog
      v-model:open="resetOpen"
      title="Reset MFA"
      :description="`${pending?.name ?? ''} loses the second factor they set up and signs in with their password only until they set one up again. Use it when they lost their device.`"
      confirm-label="Reset MFA"
      @confirm="reset"
    />
  </div>
</template>
```

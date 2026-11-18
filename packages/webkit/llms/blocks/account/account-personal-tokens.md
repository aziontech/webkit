# AccountPersonalTokens (`account/account-personal-tokens`)

> The Personal tokens page of the account settings: a `PageHeader` with Documentation and Create Personal Token, the view-table controls row (`PropertyFilter` over name, description and status, Refresh and Download CSV as `IconButton`s, `CollectionPreferences`) over a `DataTable` of tokens (name, description, `TableCellStatus` for Active, Expires in N days, Expired or Revoked, the expiry date, `TableCellTime` for last use and creation, `TableCellActions` with Revoke or Delete), all on one `useCollection`. Create opens a `Drawer` (name, description, expiry `Select` that states the date), and the new secret appears once in a `Dialog` with a warning `Alert`, a read-only `PasswordInput` and a `CopyButton`. Revoke and Delete go through `ConfirmDialog`, and their outcome is a toast. A page body for ConsoleLayout, rendered in its default slot.

- Surface: app
- Source: `blocks/account/account-personal-tokens/account-personal-tokens.vue` in `@aziontech/webkit`
- MCP: `get_block("account/account-personal-tokens")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [CollectionPreferences](../../components/collection-preferences.md), [ConfirmDialog](../../components/confirm-dialog.md), [CopyButton](../../components/copy-button.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [DropdownMenu](../../components/dropdown-menu.md), [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), `FieldDescription`, [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [PasswordInput](../../components/password-input.md), [PropertyFilter](../../components/property-filter.md), [Select](../../components/select.md), [SettingsGroup](../../components/settings-group.md), [Table](../../components/table.md), `TableCellActions`, `TableCellStatus`, `TableCellTime`, [Textarea](../../components/textarea.md), [Tooltip](../../components/tooltip.md), `use-collection`, `use-locale`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

personal tokens; personal access tokens; api tokens; api keys; access tokens; create token; revoke token; copy token once; token expiration; tokens pessoais; token de acesso; chaves de api; criar token; revogar token

The Personal tokens page of the account settings. A person creates a token for a script, a CI job or the CLI, copies its secret the one time it is shown, sees which tokens are still alive and when each expires or was last used, and revokes one that leaked or is no longer needed. The secret never comes back: the list shows only the name, status and dates, and a lost secret means a new token. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Credentials a person creates for themselves to call the API: personal tokens, API keys, deploy keys.
- Any secret the server returns once: the same reveal dialog (warning, masked value, copy) applies.

## When not to use

- Team or service credentials with roles and scopes managed by an admin: start from `account/account-team-permissions` and add a scope field to the create drawer.
- Secrets the product stores and shows again (environment variables): use `edit/edit-variables` with masked values.
- A single key shown on a resource's details page: use `CopyButton` beside the value in `detail/detail-resource`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Personal tokens` and one sentence that says what a token does and that it is shown once. Actions: the outlined Documentation button and the primary `Create Personal Token` at `size="large"`.

### B. Controls row — `PropertyFilter`, `Tooltip`, `IconButton`, `CollectionPreferences` (required)

The view-table controls row (`view/view-table`): a `PropertyFilter` bound with `v-bind="propertyFilterProps"` over name, description and status, then Refresh and Download CSV as outlined `IconButton`s with a `Tooltip` each (Download CSV writes every match through the table's `exportCsv`, disabled with no match), and `CollectionPreferences` bound with `v-bind="preferencesProps"` for page size and visible columns. Hidden when the account has no token.

### C. Token table — `Card`, `DataTable`, `TableCellActions`, `TableCellStatus`, `TableCellTime`, `useCollection` (required)

One `useCollection` over the rows, `DataTable` bound with `v-bind="tableProps"` inside a flush `Card`. Columns: Name, Description (muted; `No description` when empty), Status, Expires, Last used, Created, and the row menu. Status uses `TableCellStatus`: Active (success), `Expires in N days` within 7 days (warning), Expired (danger), Revoked (secondary). Last used and Created use `TableCellTime` (relative time, exact time on the tooltip, the creator's avatar on Created); a token never used reads `Never used`.

### D. Row actions — `DropdownMenu` (required)

`TableCellActions` named after the token. A live token offers only Revoke; an expired or revoked one offers only Delete, which removes it from the list. A token cannot be edited or extended.

### E. No match and empty — `EmptyState` (required)

The table's `#empty` slot holds `No matching tokens` with Clear filters; an account without tokens shows `No personal tokens yet` with Create Personal Token in a flush `Card` instead of the controls row and the table.

### F. Load failure — `Alert` (conditional)

When the list does not load, a danger `Alert` with Retry takes the table's place and the heading stays.

### G. Create drawer — `Drawer`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `PanelBody`, `SettingsGroup`, `PanelFooter` (required)

A large right `Drawer` with one `form`: General (Name, Description) and Expiration. Titled `Create Personal Token`. Footer: Cancel and `Create Personal Token`, so the label does not change on the way in. Create emits `create` with the values; the fields lock while `creating` is set.

### H. Fields — `Field`, `Input`, `Textarea`, `Select`, `FieldDescription` (required)

Name is required and unique; the error sits under the field (`This field is required.`, `A token with this name already exists. Use another name.`) and focus moves to it. Expires in is a `Select` of 7, 30, 60 and 90 days and 1 year (default 30), and the `FieldError` under it says the exact date it stops working.

### I. One-time reveal — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PasswordInput`, `CopyButton` (required)

When the page sets `v-model:secret` to what the create request returned, the drawer closes and a `Dialog` opens: the token's name, a warning `Alert` that this is the only time the secret is shown, the secret in a read-only `PasswordInput` (masked, with show) and a `CopyButton` beside it. The `CopyButton` announces `Token copied` (its `copied-label`), the only announcement; a muted line repeats `Copied to the clipboard.` for sighted users, hidden from assistive technology, and the footer button changes from `I copied the token` to `Done`. Closing sets `secret` back to `null`, which clears it from memory.

### J. Confirmations and outcomes — `ConfirmDialog` (required)

Revoke asks in a danger `ConfirmDialog` that says what stops working and that it cannot be undone, then marks the row revoked and emits `revoke`. Delete asks the same way, removes the row and emits `delete`. The page that runs the request ends both in a success toast; a create, revoke or delete is not a deploy, so the toast carries no Edit or Redeploy. The page calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its tokens through props and emits every action; it fetches nothing and never makes a secret. `PersonalTokensToken`, `PersonalTokensCreateValues`, `PersonalTokensSecret` and `PersonalTokensProps` are exported from `account-personal-tokens.vue`, and `sample.ts` holds the sample tokens and clock the block renders when `tokens` and `now` are left out (the tokens never while `loading` or `error` is set).

| Prop       | Type                           | What it does                                                                                                               |
| ---------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `tokens`   | `PersonalTokensToken[]`        | The rows; the filter, the sort and the pages run on them in the browser. Pass `[]` for an account with none.               |
| `loading`  | `boolean`                      | A request is in flight. With no tokens it is the first load (the table shows its loading rows); with tokens Refresh spins. |
| `error`    | `string`                       | Why the load failed, shown in the danger `Alert` with Retry that replaces the controls and the table.                      |
| `creating` | `boolean`                      | The create request is in flight; the drawer's fields lock and its submit spins.                                            |
| `now`      | `Date`                         | The moment Status and the expiry hint count from.                                                                          |
| `secret`   | `PersonalTokensSecret \| null` | `v-model:secret`: the token the create request returned; set, the reveal dialog opens; closing it sets `null`.             |

| Event     | Payload                                         | When                                                                     |
| --------- | ----------------------------------------------- | ------------------------------------------------------------------------ |
| `refresh` | `(event)`                                       | Refresh.                                                                 |
| `retry`   | `(event)`                                       | Retry in the error alert.                                                |
| `create`  | `(event, { name, description, expiresInDays })` | The drawer passed validation and was submitted.                          |
| `revoke`  | `(event, token)`                                | The revoke dialog was confirmed; the row already reads Revoked.          |
| `delete`  | `(event, token)`                                | The delete dialog was confirmed; the row is already gone from the table. |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import { ref } from 'vue'
  import AccountPersonalTokens, {
    type PersonalTokensCreateValues,
    type PersonalTokensSecret
  } from './account-personal-tokens.vue'

  const { data, pending, error, refresh } = usePersonalTokens()
  const loadError = 'The tokens could not be loaded. Nothing was changed; try again.'
  const creating = ref(false)
  const secret = ref<PersonalTokensSecret | null>(null)

  const create = async (_event: Event, values: PersonalTokensCreateValues) => {
    creating.value = true
    secret.value = await createPersonalToken(values)
    creating.value = false
    refresh()
  }
</script>

<template>
  <AccountPersonalTokens
    v-model:secret="secret"
    :tokens="data ?? []"
    :loading="pending"
    :error="error ? loadError : ''"
    :creating="creating"
    :now="new Date()"
    @refresh="refresh"
    @retry="refresh"
    @create="create"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Show the secret once, masked by default, with a copy button and a warning that says it will not be shown again.
- Say the exact expiry date while the person picks the duration.
- Warn in the Status column a week before a token expires.
- Revoke behind a confirmation that names the token and what breaks.

## Don't

- Don't show a secret, or part of one, in the list.
- Don't let a token be edited or extended; create a new one.
- Don't offer Delete on a live token; revoke it first.
- Don't toast the reveal; the secret belongs in the dialog, where it can be copied.

## Copy

- **Title:** `Personal tokens`. **Create:** `Create Personal Token` on the page, as the drawer title and on the footer submit.
- **Status:** `Active`, `Expires in 3 days`, `Expired`, `Revoked`. **Last used:** relative time, or `Never used`.
- **Reveal:** title `Copy your new token`; warning `Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost.`
- **Revoke:** title `Revoke token`; description `Scripts and tools that use “<name>” stop working right away. You cannot undo this.`; button `Revoke token`; toast `Token “<name>” revoked. Requests that use it are now refused.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`.
- The `PropertyFilter` (Filter tokens) and every icon-only button carry an `aria-label`; the row menu is named `Actions for <token>`.
- The drawer and the dialogs trap focus, are named by their titles and return focus to their trigger; the first invalid field takes focus after Create.
- The reveal labels the secret field `Token`; the copy result is announced once, by the `CopyButton`.

## States

- Default: `tokens` holds four tokens (active, expiring in 5 days, expired, revoked) with the property filter, Refresh, Download CSV, preferences, sorting, row menus, the create drawer, the reveal, revoke and delete wired.
- Empty: no token (`tokens` is `[]`); the heading and a flush empty state with Create Personal Token.
- Loading: the first load (`loading` with no `tokens`); controls row and the table's loading rows.
- Error: the list did not load (`error` is set); a danger Alert with the message and Retry replaces the table.
- Created: the one-time reveal dialog open after Create (`secret` holds the returned token).

## Related

- `view/view-table` — the list page this one follows.
- `create/create-drawer` — the drawer pattern behind Create.
- `account/account-team-permissions` — who can do what; tokens act with the creator's permissions.
- `account/account-activity-history` — where token creation and revocation are audited.

## Variants

- `Default` — primary (the code below)
- `Empty` — No token yet: the heading stays and a flush card with an EmptyState and Create Personal Token replaces the controls row and the table.
- `Loading` — The first load: the controls row and the table shell with its loading rows, before the empty state can be decided.
- `Error` — The list could not load: a danger Alert with Retry in place of the table; Retry loads the tokens.
- `Created` — Right after Create: the one-time reveal Dialog with the warning, the masked secret with show and copy, and a confirmation that the token was copied.

Each variant is the same screen in another state: `get_block("account/account-personal-tokens", { variant })`, or the file under `blocks/account/account-personal-tokens/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CollectionPreferences from '@aziontech/webkit/collection-preferences'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DataTable from '@aziontech/webkit/data-table'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import FieldDescription from '@aziontech/webkit/field-description'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import PropertyFilter from '@aziontech/webkit/property-filter'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { type TableColumn, type TableExposed } from '@aziontech/webkit/table'
  import TableCellActions from '@aziontech/webkit/table-cell-actions'
  import TableCellStatus from '@aziontech/webkit/table-cell-status'
  import TableCellTime from '@aziontech/webkit/table-cell-time'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { type FilteringProperty, useCollection } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, nextTick, reactive, ref, watch } from 'vue'

  import { sampleNow, sampleTokens } from './sample'

  /** One personal token of the signed-in person. */
  export interface PersonalTokensToken {
    /** Stable key. */
    id: string
    /** Display name. */
    name: string
    /** What the token is for; empty reads No description. */
    description: string
    /** When it was created. */
    createdAt: Date
    /** Who created it, shown under the creation time. */
    createdBy: string
    /** When it stops working. */
    expiresAt: Date
    /** The last request it signed, or null when it was never used. */
    lastUsedAt: Date | null
    /** Whether it was revoked. */
    revoked: boolean
  }

  /** What Create Personal Token sends: the name, the description and the lifetime in days. */
  export interface PersonalTokensCreateValues {
    /** Trimmed name, unique in the list. */
    name: string
    /** Trimmed description, may be empty. */
    description: string
    /** Days until the token expires. */
    expiresInDays: number
  }

  /** The token the create request returned, shown once in the reveal dialog. */
  export interface PersonalTokensSecret {
    /** The token's name. */
    name: string
    /** The secret value. */
    secret: string
  }

  export interface PersonalTokensProps {
    /** The tokens to list; filtered, sorted and paged in the browser. Left out, the sample renders. */
    tokens?: PersonalTokensToken[]
    /** A request is in flight: with no tokens it is the first load, with tokens a refresh. */
    loading?: boolean
    /** Why the tokens could not load; a danger alert with Retry replaces the table. */
    error?: string
    /** The create request is in flight; the drawer's fields lock and its submit spins. */
    creating?: boolean
    /** The moment statuses and the expiry hint count from. Left out, the sample clock. */
    now?: Date
  }

  const props = withDefaults(defineProps<PersonalTokensProps>(), {
    tokens: undefined,
    loading: false,
    error: '',
    creating: false,
    now: undefined
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    create: [event: Event, values: PersonalTokensCreateValues]
    revoke: [event: MouseEvent, token: PersonalTokensToken]
    delete: [event: MouseEvent, token: PersonalTokensToken]
  }>()

  const secretModel = defineModel<PersonalTokensSecret | null>('secret', { default: null })

  type TokenRow = PersonalTokensToken & { status: string; expires: string }
  interface TokenStatus {
    label: string
    severity: TagSeverity
  }

  const DAY = 86_400_000
  const referenceTime = computed(() => (props.now ?? sampleNow).getTime())
  const daysFrom = (days: number) => new Date(referenceTime.value + days * DAY)

  const { formatDate: formatLocaleDate } = useLocale()

  const formatDate = (date: Date) =>
    formatLocaleDate(date, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    })

  const source = computed<PersonalTokensToken[]>(
    () => props.tokens ?? (props.loading || props.error ? [] : sampleTokens)
  )
  const items = ref<PersonalTokensToken[]>([])
  watch(
    source,
    (next) => {
      items.value = [...next]
    },
    { immediate: true }
  )

  const statusOf = (token: PersonalTokensToken): TokenStatus => {
    if (token.revoked) return { label: 'Revoked', severity: 'neutral' }
    const left = Math.ceil((token.expiresAt.getTime() - referenceTime.value) / DAY)
    if (left <= 0) return { label: 'Expired', severity: 'danger' }
    if (left <= 7)
      return { label: `Expires in ${left} ${left === 1 ? 'day' : 'days'}`, severity: 'warning' }
    return { label: 'Active', severity: 'success' }
  }

  const rows = computed<TokenRow[]>(() =>
    items.value.map((token) => ({
      ...token,
      status: statusOf(token).label,
      expires: formatDate(token.expiresAt)
    }))
  )

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', sortable: true, principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 2, minWidth: 200 },
    { accessorKey: 'status', header: 'Status', sortable: true, minWidth: 160 },
    { accessorKey: 'expires', header: 'Expires', minWidth: 130 },
    { accessorKey: 'lastUsedAt', header: 'Last used', minWidth: 140 },
    { accessorKey: 'createdAt', header: 'Created', sortable: true, minWidth: 160 },
    { id: 'actions', type: 'action', hideable: false }
  ]

  const properties = computed<FilteringProperty[]>(() => [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    {
      key: 'status',
      label: 'Status',
      options: [...new Set(rows.value.map((row) => row.status))].sort().map((value) => ({ value }))
    }
  ])

  const { tableProps, propertyFilterProps, preferencesProps, status, matchingItems, clearFilters } =
    useCollection({
      items: rows,
      columns,
      filtering: { fields: ['name', 'description', 'status'] },
      propertyFiltering: { properties },
      pagination: { pageSize: 10, pageSizeOptions: [10, 25, 50] },
      preferences: { storageKey: 'personal-tokens' }
    })

  const tokensTableEl = ref<TableExposed<TokenRow> | null>(null)
  const exportCsv = () => tokensTableEl.value?.exportCsv({ filename: 'personal-tokens.csv' })

  const loadFailed = computed(() => props.error !== '')
  const refreshing = computed(() => props.loading && items.value.length > 0)

  const expiryOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' }
  ]
  const expiryLabel = (value: string) =>
    expiryOptions.find((option) => option.value === value)?.label ?? ''

  const createOpen = ref(false)
  const submitting = computed(() => props.creating)
  const form = reactive({ name: '', description: '', expiresIn: '30' })
  const errors = reactive({ name: '' })
  const expiryHint = computed(
    () =>
      `The token stops working on ${formatDate(daysFrom(Number(form.expiresIn)))}. Create a new one before then.`
  )

  const openCreate = () => {
    Object.assign(form, { name: '', description: '', expiresIn: '30' })
    errors.name = ''
    createOpen.value = true
  }

  const focusById = (id: string) => nextTick(() => document.getElementById(id)?.focus())

  const revealOpen = computed(() => secretModel.value !== null)
  const revealed = computed(() => secretModel.value ?? { name: '', secret: '' })
  watch(secretModel, (next) => {
    if (next) createOpen.value = false
  })

  const submit = (event: Event) => {
    if (submitting.value) return
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (items.value.some((token) => token.name.toLowerCase() === name.toLowerCase())) {
      errors.name = 'A token with this name already exists. Use another name.'
    } else errors.name = ''
    if (errors.name) {
      focusById('token-name')
      return
    }
    emit('create', event, {
      name,
      description: form.description.trim(),
      expiresInDays: Number(form.expiresIn)
    })
  }

  const copied = ref(false)
  const onCopied = () => {
    copied.value = true
  }
  const closeReveal = () => {
    secretModel.value = null
    copied.value = false
  }

  const pending = ref<PersonalTokensToken | null>(null)
  const revokeOpen = ref(false)
  const deleteOpen = ref(false)

  const onAction = (value: DropdownMenuItemValue, row: TokenRow) => {
    pending.value = items.value.find((token) => token.id === row.id) ?? null
    if (value === 'revoke') revokeOpen.value = true
    if (value === 'delete') deleteOpen.value = true
  }

  const revoke = (event: MouseEvent) => {
    const token = pending.value
    if (!token) return
    items.value = items.value.map((item) =>
      item.id === token.id ? { ...item, revoked: true } : item
    )
    revokeOpen.value = false
    emit('revoke', event, token)
  }

  const remove = (event: MouseEvent) => {
    const token = pending.value
    if (!token) return
    items.value = items.value.filter((item) => item.id !== token.id)
    deleteOpen.value = false
    emit('delete', event, token)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col">
      <PageHeader
        title="Personal tokens"
        description="Tokens let scripts and tools call the API as you. Each one is shown only once, right after you create it."
      >
        <template #actions>
          <Button
            label="Documentation"
            icon="az az-book"
            variant="outline"
            size="medium"
            href="https://example.com/docs/personal-tokens"
            target="_blank"
          />
          <Button
            label="Create Personal Token"
            icon="az az-plus"
            variant="primary"
            size="large"
            @click="openCreate"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed && (loading || status !== 'empty')"
          class="flex flex-wrap items-start gap-(--layout-group-gap)"
        >
          <div class="flex min-w-0 grow basis-(--container-2xs)">
            <PropertyFilter
              v-bind="propertyFilterProps"
              placeholder="Filter tokens"
              aria-label="Filter tokens"
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
          key="card-1"
          v-else-if="!loading && status === 'empty'"
          :padded="false"
        >
          <template #default>
            <EmptyState
              size="medium"
              icon="az az-key"
              title="No personal tokens yet"
              description="Create a token to call the API from a script, a CI job or the CLI."
            >
              <template #actions>
                <Button
                  label="Create Personal Token"
                  icon="az az-plus"
                  variant="secondary"
                  size="small"
                  @click="openCreate"
                />
              </template>
            </EmptyState>
          </template>
        </Card>

        <Card
          key="card-2"
          v-else
          :padded="false"
        >
          <template #default>
            <DataTable
              ref="tokensTableEl"
              v-bind="tableProps"
              :loading="loading"
              sortable
              :bordered="false"
              aria-label="Personal tokens"
            >
              <template #cell-name="{ value }">
                <span class="truncate text-label-sm text-(--text-default)">{{ value }}</span>
              </template>
              <template #cell-description="{ value }">
                <span
                  v-if="value"
                  class="truncate text-body-sm text-(--text-muted)"
                  >{{ value }}</span
                >
                <span
                  v-else
                  class="text-body-sm text-(--text-muted)"
                  >No description</span
                >
              </template>
              <template #cell-status="{ row }">
                <TableCellStatus
                  :label="row.status"
                  :severity="statusOf(row).severity"
                />
              </template>
              <template #cell-lastUsedAt="{ value }">
                <TableCellTime
                  v-if="value"
                  :value="value"
                />
                <span
                  v-else
                  class="text-body-sm text-(--text-muted)"
                  >Never used</span
                >
              </template>
              <template #cell-createdAt="{ row }">
                <TableCellTime
                  :value="row.createdAt"
                  :author="row.createdBy"
                />
              </template>
              <template #header-actions>
                <span class="sr-only">Actions</span>
              </template>
              <template #cell-actions="{ row }">
                <TableCellActions
                  :name="row.name"
                  @select="(_event, value) => onAction(value, row)"
                >
                  <DropdownMenu.Group
                    key="dropdown-menu.group-1"
                    v-if="!row.revoked && row.status !== 'Expired'"
                  >
                    <DropdownMenu.Item
                      value="revoke"
                      label="Revoke"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group
                    key="dropdown-menu.group-2"
                    v-else
                  >
                    <DropdownMenu.Item
                      value="delete"
                      label="Delete"
                    />
                  </DropdownMenu.Group>
                </TableCellActions>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="az az-search"
                  title="No matching tokens"
                  description="No token matches these filters."
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
      </section>
    </div>

    <Drawer
      v-model:open="createOpen"
      size="large"
      side="end"
    >
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Create Personal Token"
          novalidate
          @submit.prevent="submit"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
              <DrawerTitle>Create Personal Token</DrawerTitle>
              <p class="text-body-sm text-(--text-muted)">
                The token acts as you, with your permissions, until it expires or you revoke it.
              </p>
            </div>
          </PanelHeader>

          <PanelBody>
            <fieldset
              class="m-0 flex min-w-0 flex-col border-0 p-0"
              :disabled="submitting"
            >
              <legend class="sr-only">Create Personal Token</legend>
              <SettingsGroup
                label="General"
                hint="How you will recognise the token in this list."
              >
                <div class="flex w-full min-w-0 flex-col gap-(--spacing-lg)">
                  <Field
                    required
                    :invalid="!!errors.name"
                  >
                    <Field.Label for="token-name">Name</Field.Label>
                    <Input
                      id="token-name"
                      v-model="form.name"
                      placeholder="deploy-pipeline"
                      autocomplete="off"
                      @update:model-value="errors.name = ''"
                    />
                    <Field.Description>{{
                      errors.name || 'Name it after where it is used, such as the job or the tool.'
                    }}</Field.Description>
                  </Field>
                  <Field>
                    <Field.Label for="token-description">Description</Field.Label>
                    <Textarea
                      id="token-description"
                      v-model="form.description"
                      :rows="3"
                    />
                  </Field>
                </div>
              </SettingsGroup>
              <SettingsGroup
                label="Expiration"
                hint="Shorter is safer. A token cannot be extended."
              >
                <Field>
                  <Field.Label for="token-expiry">Expires in</Field.Label>
                  <Select
                    v-model="form.expiresIn"
                    size="large"
                    class="w-full"
                    :display-value="expiryLabel"
                  >
                    <Select.Trigger
                      id="token-expiry"
                      aria-describedby="token-expiry-hint"
                    />
                    <Select.Content>
                      <Select.Item
                        v-for="option in expiryOptions"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </Select.Item>
                    </Select.Content>
                  </Select>
                  <FieldDescription id="token-expiry-hint">{{ expiryHint }}</FieldDescription>
                </Field>
              </SettingsGroup>
            </fieldset>
          </PanelBody>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
              <Button
                label="Cancel"
                variant="outline"
                size="medium"
                type="button"
                :disabled="submitting"
                @click="createOpen = false"
              />
              <Button
                label="Create Personal Token"
                variant="primary"
                size="medium"
                type="submit"
                :loading="submitting"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </Drawer>

    <Dialog
      :open="revealOpen"
      size="medium"
      @update:open="(open) => !open && closeReveal()"
    >
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Copy your new token</DialogTitle>
        </PanelHeader>
        <PanelBody>
          <div class="flex flex-col gap-(--spacing-md)">
            <DialogDescription>
              “{{ revealed.name }}” is ready. This is the only time the token is shown.
            </DialogDescription>
            <Alert
              severity="warning"
              size="small"
              label="Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost."
            />
            <Field>
              <Field.Label for="token-secret">Token</Field.Label>
              <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                <div class="min-w-0 grow">
                  <PasswordInput
                    id="token-secret"
                    :model-value="revealed.secret"
                    readonly
                    autocomplete="off"
                    class="w-full"
                  />
                </div>
                <CopyButton
                  :value="revealed.secret"
                  variant="outline"
                  size="large"
                  aria-label="Copy token"
                  copied-label="Token copied"
                  @copy="onCopied"
                />
              </div>
              <p
                v-if="copied"
                class="text-body-xs text-(--text-muted)"
                aria-hidden="true"
              >
                Copied to the clipboard.
              </p>
            </Field>
          </div>
        </PanelBody>
        <PanelFooter>
          <div class="flex w-full justify-end">
            <Button
              :label="copied ? 'Done' : 'I copied the token'"
              variant="primary"
              size="medium"
              @click="closeReveal"
            />
          </div>
        </PanelFooter>
      </DialogContent>
    </Dialog>

    <ConfirmDialog
      v-model:open="revokeOpen"
      title="Revoke token"
      :description="`Scripts and tools that use “${pending?.name ?? ''}” stop working right away. You cannot undo this.`"
      confirm-label="Revoke token"
      size="small"
      @confirm="revoke"
    />

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete token"
      :description="`“${pending?.name ?? ''}” no longer works; deleting removes it from this list.`"
      confirm-label="Delete token"
      size="small"
      @confirm="remove"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { PersonalTokensToken } from './account-personal-tokens.vue'

const DAY = 86_400_000
const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysFrom = (days: number) => new Date(referenceTime + days * DAY)

export const sampleNow = new Date(referenceTime)

export const sampleTokens: PersonalTokensToken[] = [
  {
    id: 'tok-7c1e',
    name: 'Local CLI',
    description: 'Development laptop',
    createdAt: daysFrom(-40),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(50),
    lastUsedAt: daysFrom(-0.1),
    revoked: false
  },
  {
    id: 'tok-3a90',
    name: 'Deploy pipeline',
    description: 'CI job that publishes the storefront',
    createdAt: daysFrom(-85),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(5),
    lastUsedAt: daysFrom(-1),
    revoked: false
  },
  {
    id: 'tok-b412',
    name: 'Infrastructure as code',
    description: 'Provider for the staging stack',
    createdAt: daysFrom(-120),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(-30),
    lastUsedAt: daysFrom(-31),
    revoked: false
  },
  {
    id: 'tok-55d2',
    name: 'Nightly export',
    description: 'Retired reporting script',
    createdAt: daysFrom(-200),
    createdBy: 'grace.hall@example.com',
    expiresAt: daysFrom(160),
    lastUsedAt: null,
    revoked: true
  }
]
```

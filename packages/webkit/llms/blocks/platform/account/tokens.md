# Tokens (`platform/account/tokens`)

> The Personal tokens page of the account settings: a `PageHeader` with Documentation and Create Personal Token, a search `Input` and Refresh over a `Table` of tokens (name with its description, `Table.CellStatus` for Active, Expires in N days, Expired or Revoked, the expiry date, `Table.CellTime` for last use and creation, `Table.CellActions` with Revoke or Delete), all on one `useCollection`. Create opens a `Drawer` (name, description, expiry `Select` that states the date), and the new secret appears once in a `Dialog` with a warning `Alert`, a read-only `PasswordInput` and a `CopyButton`. Revoke and Delete go through `ConfirmDialog`, and their outcome is a toast. A page body for ConsoleLayout, rendered in its default slot.

- Surface: product
- Source: `blocks/platform/account/tokens/tokens.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/account/tokens")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [ConfirmDialog](../../../components/confirm-dialog.md), [CopyButton](../../../components/copy-button.md), [Dialog](../../../components/dialog.md), `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [Drawer](../../../components/drawer.md), `DrawerClose`, `DrawerContent`, `DrawerOverlay`, `DrawerPortal`, `DrawerTitle`, [DropdownMenu](../../../components/dropdown-menu.md), [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [HelperText](../../../components/helper-text.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [PasswordInput](../../../components/password-input.md), [Select](../../../components/select.md), [SettingsSection](../../../components/settings-section.md), [Table](../../../components/table.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md), `use-collection`
- Skills: `webkit-lists`, `webkit-tables`, `webkit-form`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

personal tokens; personal access tokens; api tokens; api keys; access tokens; create token; revoke token; copy token once; token expiration; tokens pessoais; token de acesso; chaves de api; criar token; revogar token

The Personal tokens page of the account settings. A person creates a token for a script, a CI job or the CLI, copies its secret the one time it is shown, sees which tokens are still alive and when each expires or was last used, and revokes one that leaked or is no longer needed. The secret never comes back: the list shows only the name, status and dates, and a lost secret means a new token. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Credentials a person creates for themselves to call the API: personal tokens, API keys, deploy keys.
- Any secret the server returns once: the same reveal dialog (warning, masked value, copy) applies.

## When not to use

- Team or service credentials with roles and scopes managed by an admin: start from `platform/account/team-permissions` and add a scope field to the create drawer.
- Secrets the product stores and shows again (environment variables): use `platform/edit/attribute-editor` with masked values.
- A single key shown on a resource's details page: use `CopyButton` beside the value in `platform/detail/details-page`.

## Building blocks

### A. Page heading — `PageHeader`, `Button` (required)

Title `Personal tokens` and one sentence that says what a token does and that it is shown once. Actions: the outlined Documentation button and the primary `Create Personal Token` at `size="large"`.

### B. Search and refresh — `Input`, `Tooltip`, `IconButton` (required)

A search `Input` bound with `v-bind="filterProps"` (name, description, status), then Refresh as an outlined `IconButton` in a `Tooltip`. Hidden when the account has no token.

### C. Token table — `Card`, `Table`, `useCollection` (required)

One `useCollection` over the rows, `Table` bound with `v-bind="tableProps"` inside a flush `Card`. Columns: Name (the description under it in muted text), Status, Expires, Last used, Created, and the row menu. Status uses `Table.CellStatus`: Active (success), `Expires in N days` within 7 days (warning), Expired (danger), Revoked (secondary). Last used and Created use `Table.CellTime` (relative time, exact time on the tooltip, the creator's avatar on Created); a token never used reads `Never used`.

### D. Row actions — `DropdownMenu` (required)

`Table.CellActions` named after the token. A live token offers only Revoke; an expired or revoked one offers only Delete, which removes it from the list. A token cannot be edited or extended.

### E. No match and empty — `EmptyState` (required)

The table's `#empty` slot holds `No matching tokens` with Clear search; an account without tokens shows `No personal tokens yet` with Create Personal Token in a flush `Card` instead of the search row and the table.

### F. Load failure — `Alert` (conditional)

When the list does not load, a danger `Alert` with Retry takes the table's place and the heading stays.

### G. Create drawer — `Drawer`, `DrawerPortal`, `DrawerOverlay`, `DrawerContent`, `PanelHeader`, `DrawerTitle`, `DrawerClose`, `PanelContent`, `SettingsSection`, `PanelFooter` (required)

A medium right `Drawer` with one `form`: General (Name, Description) and Expiration. Footer: Cancel and Create. The fields lock while it submits.

### H. Fields — `Field`, `Textarea`, `Select`, `HelperText` (required)

Name is required and unique; the error sits under the field (`This field is required.`, `A token with this name already exists. Use another name.`) and focus moves to it. Expires in is a `Select` of 7, 30, 60 and 90 days and 1 year (default 30), and the `HelperText` under it says the exact date it stops working.

### I. One-time reveal — `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PasswordInput`, `CopyButton` (required)

After Create the drawer closes and a `Dialog` opens: the token's name, a warning `Alert` that this is the only time the secret is shown, the secret in a read-only `PasswordInput` (masked, with show) and a `CopyButton` beside it. A polite status line confirms the copy and the footer button changes from `I copied the token` to `Done`. Closing clears the secret from memory.

### J. Confirmations and outcomes — `ConfirmDialog` (required)

Revoke asks in a danger `ConfirmDialog` that says what stops working and that it cannot be undone; the confirm button spins while the request runs. Delete asks the same way. Both end in a success toast; a create, revoke or delete is not a deploy, so the toast carries no Edit or Redeploy. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

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

- **Title:** `Personal tokens`. **Create:** `Create Personal Token` on the page, `Create personal token` as the drawer title, `Create` in the footer.
- **Status:** `Active`, `Expires in 3 days`, `Expired`, `Revoked`. **Last used:** relative time, or `Never used`.
- **Reveal:** title `Copy your new token`; warning `Copy the token and store it somewhere safe, such as a secret manager. After you close this dialog, it cannot be shown again; create a new one if it is lost.`
- **Revoke:** title `Revoke token`; description `Scripts and tools that use “<name>” stop working right away. You cannot undo this.`; button `Revoke token`; toast `Token “<name>” revoked. Requests that use it are now refused.`
- Follow `skills/webkit-microcopy`: sentence case, no "please", no exclamation marks.

## Accessibility

- No `main` of its own (the layout's is the only one); the `PageHeader` title is the only `h1`.
- The search `Input` and every icon-only button carry an `aria-label`; the row menu is named `Actions for <token>`.
- The drawer and the dialogs trap focus, are named by their titles and return focus to their trigger; the first invalid field takes focus after Create.
- The reveal labels the secret field `Token`; the copy result is announced in a polite status region.

## States

- Default: four tokens (active, expiring in 5 days, expired, revoked) with search, refresh, sorting, row menus, the create drawer, the reveal, revoke and delete wired.
- Empty: no token; the heading and a flush empty state with Create Personal Token.
- Loading: the first load; search row and the table's loading rows.
- Failed: the list did not load; a danger Alert with Retry replaces the table.
- Created: the one-time reveal dialog open after Create.

## Related

- `platform/view/table-view` — the list page this one follows.
- `platform/create/create-in-drawer` — the drawer pattern behind Create.
- `platform/account/team-permissions` — who can do what; tokens act with the creator's permissions.
- `platform/account/activity-history` — where token creation and revocation are audited.

## Variants

- `Default` — primary (the code below)
- `Empty` — No token yet: the heading stays and a flush card with an EmptyState and Create Personal Token replaces the search row and the table.
- `Loading` — The first load: the search row and the table shell with its loading rows, before the empty state can be decided.
- `Failed` — The list could not load: a danger Alert with Retry in place of the table; Retry loads the tokens.
- `Created` — Right after Create: the one-time reveal Dialog with the warning, the masked secret with show and copy, and a confirmation that the token was copied.

Each variant is the same screen in another state: `get_pattern("platform/account/tokens", { variant })`, or the file under `blocks/platform/account/tokens/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import PasswordInput from '@aziontech/webkit/password-input'
  import Select from '@aziontech/webkit/select'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Table, { type TableColumn } from '@aziontech/webkit/table'
  import type { TagSeverity } from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useCollection } from '@aziontech/webkit/use-collection'
  import { computed, nextTick, reactive, ref } from 'vue'

  interface Token {
    id: string
    name: string
    description: string
    createdAt: Date
    createdBy: string
    expiresAt: Date
    lastUsedAt: Date | null
    revoked: boolean
  }
  interface TokenStatus {
    label: string
    severity: TagSeverity
  }

  const DAY = 86_400_000
  const referenceTime = Date.UTC(2026, 10, 10, 12)
  const daysFrom = (days: number) => new Date(referenceTime + days * DAY)

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'UTC'
    })

  const seedTokens: Token[] = [
    {
      id: 'tok-7c1e',
      name: 'Local CLI',
      description: 'Development laptop',
      createdAt: daysFrom(-40),
      createdBy: 'ana.silva@example.com',
      expiresAt: daysFrom(50),
      lastUsedAt: daysFrom(-0.1),
      revoked: false
    },
    {
      id: 'tok-3a90',
      name: 'Deploy pipeline',
      description: 'CI job that publishes the storefront',
      createdAt: daysFrom(-85),
      createdBy: 'ana.silva@example.com',
      expiresAt: daysFrom(5),
      lastUsedAt: daysFrom(-1),
      revoked: false
    },
    {
      id: 'tok-b412',
      name: 'Infrastructure as code',
      description: 'Provider for the staging stack',
      createdAt: daysFrom(-120),
      createdBy: 'ana.silva@example.com',
      expiresAt: daysFrom(-30),
      lastUsedAt: daysFrom(-31),
      revoked: false
    },
    {
      id: 'tok-55d2',
      name: 'Nightly export',
      description: 'Retired reporting script',
      createdAt: daysFrom(-200),
      createdBy: 'ana.silva@example.com',
      expiresAt: daysFrom(160),
      lastUsedAt: null,
      revoked: true
    }
  ]

  const tokens = ref<Token[]>(seedTokens)

  const statusOf = (token: Token): TokenStatus => {
    if (token.revoked) return { label: 'Revoked', severity: 'secondary' }
    const left = Math.ceil((token.expiresAt.getTime() - referenceTime) / DAY)
    if (left <= 0) return { label: 'Expired', severity: 'danger' }
    if (left <= 7)
      return { label: `Expires in ${left} ${left === 1 ? 'day' : 'days'}`, severity: 'warning' }
    return { label: 'Active', severity: 'success' }
  }

  const rows = computed(() =>
    tokens.value.map((token) => ({
      ...token,
      status: statusOf(token).label,
      expires: formatDate(token.expiresAt)
    }))
  )

  const columns: TableColumn[] = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'status', header: 'Status', minWidth: 160 },
    { accessorKey: 'expires', header: 'Expires', minWidth: 130 },
    { accessorKey: 'lastUsedAt', header: 'Last used', minWidth: 140 },
    { accessorKey: 'createdAt', header: 'Created', enableSorting: true, minWidth: 160 },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  const { filterProps, tableProps, status, clearFilters } = useCollection({
    items: rows,
    columns,
    filtering: { fields: ['name', 'description', 'status'] },
    pagination: { pageSize: 10 }
  })

  const loading = ref(false)
  const loadFailed = ref(false)
  const retryLoad = () => {
    loadFailed.value = false
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const refreshing = ref(false)
  const refresh = () => {
    if (refreshing.value) return
    refreshing.value = true
    setTimeout(() => {
      refreshing.value = false
    }, 700)
  }

  const expiryOptions = [
    { value: '7', label: '7 days' },
    { value: '30', label: '30 days' },
    { value: '60', label: '60 days' },
    { value: '90', label: '90 days' },
    { value: '365', label: '1 year' }
  ]
  const expiryLabel = (value: unknown) =>
    expiryOptions.find((option) => option.value === value)?.label ?? ''

  const createOpen = ref(false)
  const submitting = ref(false)
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

  const revealOpen = ref(false)
  const revealed = reactive({ name: '', secret: '' })

  const makeSecret = () => {
    const bytes = new Uint8Array(24)
    globalThis.crypto?.getRandomValues?.(bytes)
    return `pat_${Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')}`
  }

  const submit = () => {
    if (submitting.value) return
    const name = form.name.trim()
    if (!name) errors.name = 'This field is required.'
    else if (tokens.value.some((token) => token.name.toLowerCase() === name.toLowerCase())) {
      errors.name = 'A token with this name already exists. Use another name.'
    } else errors.name = ''
    if (errors.name) {
      focusById('token-name')
      return
    }
    submitting.value = true
    setTimeout(() => {
      submitting.value = false
      tokens.value = [
        {
          id: `tok-${Math.random().toString(16).slice(2, 6)}`,
          name,
          description: form.description.trim(),
          createdAt: new Date(),
          createdBy: 'ana.silva@example.com',
          expiresAt: daysFrom(Number(form.expiresIn)),
          lastUsedAt: null,
          revoked: false
        },
        ...tokens.value
      ]
      Object.assign(revealed, { name, secret: makeSecret() })
      createOpen.value = false
      revealOpen.value = true
    }, 700)
  }

  const copied = ref(false)
  const onCopied = () => {
    copied.value = true
  }
  const closeReveal = () => {
    revealOpen.value = false
    copied.value = false
    revealed.secret = ''
  }

  const pending = ref<Token | null>(null)
  const revokeOpen = ref(false)
  const deleteOpen = ref(false)
  const working = ref(false)

  const onAction = (value: string | number, row: Token) => {
    pending.value = row
    if (value === 'revoke') revokeOpen.value = true
    if (value === 'delete') deleteOpen.value = true
  }

  const revoke = () => {
    const row = pending.value
    if (!row || working.value) return
    working.value = true
    setTimeout(() => {
      working.value = false
      tokens.value = tokens.value.map((token) =>
        token.id === row.id ? { ...token, revoked: true } : token
      )
      revokeOpen.value = false
      toast.success(`Token "${row.name}" revoked. Requests that use it are now refused.`)
    }, 600)
  }

  const remove = () => {
    const row = pending.value
    if (!row) return
    tokens.value = tokens.value.filter((token) => token.id !== row.id)
    deleteOpen.value = false
    toast.success(`Token "${row.name}" deleted.`)
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
            icon="pi pi-book"
            kind="outlined"
            size="medium"
            href="https://example.com/docs/personal-tokens"
            target="_blank"
          />
          <Button
            label="Create Personal Token"
            icon="pi pi-plus"
            kind="primary"
            size="large"
            @click="openCreate"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap)">
        <header
          v-if="!loadFailed && (loading || status !== 'empty')"
          class="flex items-center gap-(--layout-group-gap)"
        >
          <div class="min-w-0 grow">
            <Input
              v-bind="filterProps"
              placeholder="Search tokens"
              aria-label="Search tokens"
              class="w-full"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
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
        </header>

        <Alert
          v-if="loadFailed"
          severity="danger"
        >
          The tokens could not be loaded. Nothing was changed; try again.
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
          key="card-1"
          v-else-if="!loading && status === 'empty'"
          :padded="false"
        >
          <template #content>
            <EmptyState
              size="medium"
              icon="pi pi-key"
              title="No personal tokens yet"
              description="Create a token to call the API from a script, a CI job or the CLI."
            >
              <template #actions>
                <Button
                  label="Create Personal Token"
                  icon="pi pi-plus"
                  kind="secondary"
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
          <template #content>
            <Table
              v-bind="tableProps"
              :loading="loading || refreshing"
              enable-sorting
              :bordered="false"
              aria-label="Personal tokens"
            >
              <template #cell-name="{ row }">
                <div class="flex min-w-0 flex-col">
                  <span class="truncate text-label-sm text-(--text-default)">{{ row.name }}</span>
                  <span
                    v-if="row.description"
                    class="truncate text-body-xs text-(--text-muted)"
                    >{{ row.description }}</span
                  >
                </div>
              </template>
              <template #cell-status="{ row }">
                <Table.CellStatus
                  :label="row.status"
                  :severity="statusOf(row).severity"
                />
              </template>
              <template #cell-lastUsedAt="{ value }">
                <Table.CellTime
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
                <Table.CellTime
                  :value="row.createdAt"
                  :author="row.createdBy"
                />
              </template>
              <template #header-actions>
                <span class="sr-only">Actions</span>
              </template>
              <template #cell-actions="{ row }">
                <Table.CellActions
                  :name="row.name"
                  @select="(_event, value) => onAction(value, row)"
                >
                  <DropdownMenu.Group
                    key="dropdown-menu.group-1"
                    v-if="!row.revoked && row.status !== 'Expired'"
                  >
                    <DropdownMenu.Option
                      value="revoke"
                      label="Revoke"
                    />
                  </DropdownMenu.Group>
                  <DropdownMenu.Group
                    key="dropdown-menu.group-2"
                    v-else
                  >
                    <DropdownMenu.Option
                      value="delete"
                      label="Delete"
                    />
                  </DropdownMenu.Group>
                </Table.CellActions>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  icon="pi pi-search"
                  title="No matching tokens"
                  description="No token matches this search."
                >
                  <template #actions>
                    <Button
                      label="Clear search"
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
      </section>
    </div>

    <Drawer
      v-model:open="createOpen"
      size="medium"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            aria-label="Create personal token"
            novalidate
            @submit.prevent="submit"
          >
            <PanelHeader class="w-full">
              <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                <DrawerTitle>Create personal token</DrawerTitle>
                <p class="text-body-sm text-(--text-muted)">
                  The token acts as you, with your permissions, until it expires or you revoke it.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create personal token</legend>
                <SettingsSection
                  title="General"
                  hint="How you will recognise the token in this list."
                >
                  <div class="flex w-full min-w-0 flex-col gap-(--spacing-lg)">
                    <Field
                      :required="!!errors.name && !form.name.trim()"
                      :invalid="!!errors.name && !!form.name.trim()"
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
                        errors.name ||
                        'Name it after where it is used, such as the job or the tool.'
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
                </SettingsSection>
                <SettingsSection
                  title="Expiration"
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
                        <Select.Option
                          v-for="option in expiryOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </Select.Option>
                      </Select.Content>
                    </Select>
                    <HelperText
                      id="token-expiry-hint"
                      kind="helper"
                      >{{ expiryHint }}</HelperText
                    >
                  </Field>
                </SettingsSection>
              </fieldset>
            </PanelContent>

            <PanelFooter>
              <div class="flex w-full flex-wrap items-center justify-end gap-(--spacing-sm)">
                <Button
                  label="Cancel"
                  kind="outlined"
                  size="medium"
                  type="button"
                  :disabled="submitting"
                  @click="createOpen = false"
                />
                <Button
                  label="Create"
                  kind="primary"
                  size="medium"
                  type="submit"
                  :loading="submitting"
                />
              </div>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <Dialog
      :open="revealOpen"
      size="medium"
      @update:open="(open) => !open && closeReveal()"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Copy your new token</DialogTitle>
          </PanelHeader>
          <PanelContent>
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
                    kind="outlined"
                    size="large"
                    aria-label="Copy token"
                    copied-label="Token copied"
                    @copy="onCopied"
                  />
                </div>
                <p
                  class="text-body-xs text-(--text-muted)"
                  role="status"
                >
                  {{ copied ? 'Copied to the clipboard.' : '' }}
                </p>
              </Field>
            </div>
          </PanelContent>
          <PanelFooter>
            <div class="flex w-full justify-end">
              <Button
                :label="copied ? 'Done' : 'I copied the token'"
                kind="primary"
                size="medium"
                @click="closeReveal"
              />
            </div>
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <ConfirmDialog
      v-model:open="revokeOpen"
      title="Revoke token"
      :description="`Scripts and tools that use “${pending?.name ?? ''}” stop working right away. You cannot undo this.`"
      confirm-label="Revoke token"
      :loading="working"
      @confirm="revoke"
    />

    <ConfirmDialog
      v-model:open="deleteOpen"
      title="Delete token"
      :description="`“${pending?.name ?? ''}” no longer works; deleting removes it from this list.`"
      confirm-label="Delete token"
      @confirm="remove"
    />
  </div>
</template>
```

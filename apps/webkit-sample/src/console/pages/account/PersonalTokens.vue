<script setup>
  // The Personal Tokens module — the LIST that anchors the token flow, now with an
  // inline create DRAWER (List → Creation → Back to list, all on one page). Built
  // on @aziontech/webkit per /ui-craft.
  //
  // Create is a medium Drawer whose body is Cards + ItemGroups (the /form skill,
  // Approach A): two flush CardBoxes (General, Token), each an Item.List where the
  // Item.Title IS the label, guidance is Item.Description, and the control sits on
  // the right in Item.Actions with an aria-label. Validation runs on submit only;
  // with no <Label>, the feedback is a HelperText under the control (amber
  // `required` — required is NOT an error). One `submitting` flag locks the whole
  // drawer scope (fieldset :disabled + Save :loading) per /usability.
  //
  // The generated token is shown ONCE, in a Dialog after the drawer closes: a
  // warning Message, the token in a readonly reveal field (FieldPassword's built-in
  // visibility toggle), a Copy action, and Confirm. Closing it is terminal — the
  // plaintext can't be retrieved again; only the new row remains in the list.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
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
  import Dropdown from '@aziontech/webkit/dropdown'
  import FieldPassword from '@aziontech/webkit/field-password'
  import HelperText from '@aziontech/webkit/helper-text'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Label from '@aziontech/webkit/label'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { reactive, ref, watch } from 'vue'

  import ColumnsButton from '../../components/list/ColumnsButton.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import ExportButton from '../../components/list/ExportButton.vue'
  import FilterButton from '../../components/list/FilterButton.vue'
  import FilterChips from '../../components/list/FilterChips.vue'
  import RefreshButton from '../../components/list/RefreshButton.vue'
  import ControlsHeader from '../../components/page/ControlsHeader.vue'
  import HeadingAction from '../../components/page/HeadingAction.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'
  import { useListFilters } from '../../lib/behavior/list-state'
  import { FIT_COLUMN, TAG_COLUMN } from '../../lib/behavior/table-columns'
  import { useSampleMode } from '../../lib/state/sample-mode'

  // Where `Documentation` goes. The docs ROOT: personal tokens have no entry in
  // lib/data/product-empty-states.js (that registry covers the product modules), and an
  // unverified deep link is worse than the index. Replace when the topic URL is known.
  const HELP = 'https://www.azion.com/en/documentation/'

  // Switching organization, account or workspace reloads the page like every other
  // module list. The ROWS are not projected (src/lib/tenancy-scope.js): a personal
  // token authenticates the USER across every scope they can reach, so the same
  // list is the truthful answer in a new one — it is simply re-read.
  const { accountEmpty } = useSampleMode()

  // Seeded tokens — a personal token's plaintext is shown only once at creation,
  // so the list never stores it; it tracks identity, lifecycle, and status.
  const SEEDED_TOKENS = [
    {
      id: 'pt-1',
      name: 'CLI local',
      description: 'Local development machine',
      created: 'June 02, 2026',
      expires: 'September 02, 2026',
      lastUsed: '2 hours ago',
      status: 'Active'
    },
    {
      id: 'pt-2',
      name: 'CI / CD Pipeline',
      description: 'GitHub Actions deploy token',
      created: 'May 18, 2026',
      expires: 'August 18, 2026',
      lastUsed: 'Yesterday',
      status: 'Active'
    },
    {
      id: 'pt-3',
      name: 'Terraform provider',
      description: 'Infrastructure automation',
      created: 'March 09, 2026',
      expires: 'March 09, 2026',
      lastUsed: '1 month ago',
      status: 'Expired'
    },
    {
      id: 'pt-4',
      name: 'Legacy script',
      description: 'Retired nightly export',
      created: 'November 21, 2025',
      expires: 'February 21, 2026',
      lastUsed: '5 months ago',
      status: 'Revoked'
    }
  ]

  // The EMPTY version has none: somebody who signed up an hour ago has not issued a
  // token yet, and this list is not projected through the tenancy scope (see above),
  // so the version has to be read here. Re-read on a flip rather than seeded once,
  // because the preset can change while this page is on screen.
  const tokens = ref(accountEmpty.value ? [] : [...SEEDED_TOKENS])
  watch(accountEmpty, (isEmpty) => {
    tokens.value = isEmpty ? [] : [...SEEDED_TOKENS]
  })

  // ── The filter catalog ────────────────────────────────────────────────────
  // Status is the one enumerable column — Name and Description are free text,
  // and Created / Expires / Last Used are display strings with no instant behind them.
  const filterFields = [
    {
      id: 'status',
      label: 'Status',
      kind: 'options',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Expired', label: 'Expired' },
        { value: 'Revoked', label: 'Revoked' }
      ],
      match: (token, values) => values.includes(token.status)
    }
  ]

  const {
    filters,
    search,
    pagination,
    visibleRows: visibleTokens,
    loading,
    refresh
  } = useListFilters(filterFields, tokens, { pageSize: 10 })

  // The table the controls row drives. Download CSV calls the DS's own `exportCsv()`
  // through it (../../components/list/ExportButton.vue), so the file honours the
  // visible columns and the filtered rows instead of re-serialising them here.
  const tableRef = ref(null)

  const columns = [
    { accessorKey: 'name', header: 'Name', enableSorting: true, principal: true, hideable: false },
    { accessorKey: 'description', header: 'Description', grow: 2 },
    { accessorKey: 'created', header: 'Created', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'expires', header: 'Expires', enableSorting: true, minWidth: FIT_COLUMN },
    { accessorKey: 'lastUsed', header: 'Last used', minWidth: FIT_COLUMN },
    { accessorKey: 'status', header: 'Status', minWidth: TAG_COLUMN },
    { id: 'actions', kind: 'action', hideable: false }
  ]

  // Which columns are switched off, driven by the Columns button on the controls
  // row (../../components/list/ColumnsButton.vue). Only a HIDDEN column is ever
  // recorded, so this never has to be kept in step with the column model above.
  const columnVisibility = ref({})

  // Expired is DANGER, not warning: an expired token cannot authenticate anything, which
  // is the same terminal state as revoked. `warning` is for a state that still works and
  // wants attention — Pending — and painting a dead credential amber said the opposite.
  // Certificates already read it this way (../secure/Certificates.vue).
  const statusSeverity = (status) =>
    ({ Active: 'success', Expired: 'danger', Revoked: 'danger' })[status] ?? 'secondary'

  // Revoke is reversible enough to stay a menu click — the token stays in the list and
  // says "Revoked". Delete is not: it takes the record away, so it goes through the
  // confirmation dialog and only lands once the token's name has been typed back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const row = pendingDelete.value
    if (!row) return
    tokens.value = tokens.value.filter((token) => token.id !== row.id)
    toast.success(`Personal token "${row.name}" deleted.`)
    pendingDelete.value = null
  }

  const onTokenAction = (event, value, row) => {
    if (value === 'revoke') {
      tokens.value = tokens.value.map((token) =>
        token.id === row.id ? { ...token, status: 'Revoked' } : token
      )
      toast.success(`Personal token "${row.name}" revoked.`)
      return
    }
    if (value === 'delete') {
      pendingDelete.value = row
      deleteOpen.value = true
      return
    }
    toast.info(row.name, { description: row.description })
  }

  // --- Create Drawer state -------------------------------------------------
  // Suggested expiration ranges. The token is only available right after it's
  // created, so a short default (1 day) is the safe pick.
  const expiryOptions = [
    { label: '1 day', value: '1d', days: 1 },
    { label: '7 days', value: '7d', days: 7 },
    { label: '15 days', value: '15d', days: 15 },
    { label: '30 days', value: '30d', days: 30 },
    { label: '60 days', value: '60d', days: 60 },
    { label: '90 days', value: '90d', days: 90 },
    { label: '1 year', value: '1y', days: 365 }
  ]
  const expiryLabel = (value) => expiryOptions.find((option) => option.value === value)?.label ?? ''

  const drawerOpen = ref(false)

  const form = reactive({
    name: '',
    description: '',
    expiresWithin: '1d' // preselected — Expires within is required but never empty
  })

  // Per-field error messages. Empty string = valid. Populated only by validate().
  const errors = reactive({ name: '' })

  // One flag locks the whole drawer scope while the create request is in flight.
  const submitting = ref(false)

  const openCreate = () => {
    drawerOpen.value = true
  }

  // Reset the form + errors whenever the drawer closes (cancel, overlay, Escape,
  // or a successful create) so the next open is pristine.
  watch(drawerOpen, (open) => {
    if (open) return
    form.name = ''
    form.description = ''
    form.expiresWithin = '1d'
    errors.name = ''
  })

  const cancel = () => {
    drawerOpen.value = false
  }

  const validate = () => {
    errors.name = form.name.trim() ? '' : 'This field is required.'
    return !errors.name
  }

  // --- The generated token, shown once in the dialog ----------------------
  const dialogOpen = ref(false)
  const generatedToken = ref('')

  // A realistic, one-time token value. crypto is preferred; a zero-fill fallback
  // keeps the demo working where it's unavailable.
  const generateToken = () => {
    const bytes = new Uint8Array(30)
    globalThis.crypto?.getRandomValues?.(bytes)
    const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
    return `azion_pat_${hex}`
  }

  const formatDate = (date) =>
    date.toLocaleString('en-US', { month: 'long', day: '2-digit', year: 'numeric' })

  const submit = async () => {
    if (submitting.value) return // re-entrancy lock

    // Validation feedback is the field's own amber state + its HelperText.
    if (!validate()) return

    // Lock the scope off one flag (usability Pattern 1): Save shows :loading and
    // every field is :disabled while the request is in flight.
    submitting.value = true
    try {
      await new Promise((resolve) => setTimeout(resolve, 900))

      const now = new Date()
      const days = expiryOptions.find((option) => option.value === form.expiresWithin)?.days ?? 1
      // The new row joins the list immediately; only the plaintext is one-time.
      tokens.value = [
        {
          id: `pt-${Date.now()}`,
          name: form.name.trim(),
          description: form.description.trim() || '—',
          created: formatDate(now),
          expires: formatDate(new Date(now.getTime() + days * 86400000)),
          lastUsed: 'Never',
          status: 'Active'
        },
        ...tokens.value
      ]

      generatedToken.value = generateToken()
      drawerOpen.value = false // close the drawer (watch resets the form)
      dialogOpen.value = true // reveal the token once
      toast.success(`Personal token "${form.name.trim()}" created.`)
    } catch (error) {
      // Request-level failure → toast with a way to recover. Never silent.
      toast.error('Could not create the personal token.', {
        description: error?.message ?? 'Check your connection and try again.',
        action: { label: 'Retry', onClick: () => submit() }
      })
    } finally {
      submitting.value = false // release on success AND failure
    }
  }

  // CopyButton owns the clipboard write + copied state; we just acknowledge it.
  const onTokenCopied = () => toast.success('Personal token copied to clipboard.')

  // Closing the dialog is terminal: the plaintext can't be shown again, so clear it.
  watch(dialogOpen, (open) => {
    if (!open) generatedToken.value = ''
  })
</script>

<template>
  <!-- Personal Tokens is a row in the sidebar's Settings level, so it reads like every
       other settings page: that row active, and "Settings › Personal Tokens" above. -->
  <AppLayout
    active="settings-tokens"
    :breadcrumb="[{ label: 'Settings', href: '/account' }, { label: 'Personal Tokens' }]"
  >
    <main class="layout-column flex min-h-full flex-col">
      <!-- THE PAGE HEADING. A first-level resource page names itself: the module name
           over one line saying what the module is, with the module's own action on the
           right. The breadcrumb says WHERE you are; the heading says WHAT this page is,
           and it gives that action one fixed home above the list instead of a control
           that rides the row narrowing it.
           The action stays here over an EMPTY list as well: where a page's action sits is
           a property of the page, not of how many rows it has. The empty state's own
           button is the in-content door — a `secondary` inside the card — not this same
           control moving.
           `size="medium"` is the first-level list scale (components/page/PageHeading.vue):
           the title names the collection, and the table under it is what the page is for.
           The parent section below is no longer `:first-child`, so `.layout-section-start`
           opens it at the boundary step — the list sits tight under the heading (theme
           semantic/layouts § "THE PAGE SHAPE"). -->
      <PageHeading
        size="medium"
        :documentation="HELP"
        title="Personal Tokens"
        description="Personal tokens securely access your account via API. Create one, then copy it — it's shown only once."
      >
        <template #actions>
          <HeadingAction
            label="Create personal token"
            kind="primary"
            icon="pi pi-plus"
            @click="openCreate"
          />
        </template>
      </PageHeading>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- ONE section: the controls row narrows the table under it, so the two
             sit at --layout-group-gap. -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <!-- The CONTROLS row, under the heading: the narrowing, on a list the page can
               already show — search on the left, nothing on the right, because the
               module's action sits in the heading above.
               Rendered only when there are rows: a search field with nothing to search is
               noise. -->
          <ControlsHeader v-if="tokens.length">
            <FilterButton
              v-model="filters"
              :fields="filterFields"
            />
            <InputText
              v-model="search"
              size="medium"
              placeholder="Search personal tokens"
              aria-label="Search personal tokens"
              class="min-w-36 grow basis-(--container-2xs)"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
            <template #actions>
              <!-- THE RIGHT GROUP: the three controls that act on the LISTING rather
                   than narrow it — fetch it again, take it away as a file, choose which
                   columns it shows. All glyphs, all `medium`, so the row shares one
                   32px height with the field and the Filter button opposite. -->
              <RefreshButton
                :loading="loading"
                @refresh="refresh"
              />
              <ExportButton
                :table="tableRef"
                filename="personal-tokens.csv"
              />
              <ColumnsButton
                v-model="columnVisibility"
                :columns="columns"
              />
            </template>
          </ControlsHeader>

          <FilterChips
            v-if="tokens.length"
            v-model="filters"
            :fields="filterFields"
          />

          <section class="flex min-h-0 flex-col">
            <CardBox :padded="false">
              <template #content>
                <Table
                  ref="tableRef"
                  v-model:pagination="pagination"
                  v-model:globalFilter="search"
                  v-model:columnVisibility="columnVisibility"
                  :data="visibleTokens"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  paginated
                  :page-size="10"
                  :border="false"
                  :loading="loading"
                >
                  <template #cell-status="{ value }">
                    <Tag
                      :label="value"
                      :severity="statusSeverity(value)"
                      size="medium"
                    />
                  </template>

                  <template #cell-actions="{ row }">
                    <Dropdown
                      placement="bottom-end"
                      @select="(event, value) => onTokenAction(event, value, row)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Token actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="outlined"
                            size="small"
                            aria-label="Token actions"
                          />
                        </Tooltip>
                      </Dropdown.Trigger>
                      <Dropdown.Group>
                        <Dropdown.Option
                          value="view"
                          label="View details"
                        />
                      </Dropdown.Group>
                      <Dropdown.Group>
                        <Dropdown.Option
                          value="revoke"
                          label="Revoke"
                        >
                          <template #left>
                            <i
                              class="pi pi-ban"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                        <Dropdown.Option
                          value="delete"
                          label="Delete"
                        >
                          <template #left>
                            <i
                              class="pi pi-trash"
                              aria-hidden="true"
                            />
                          </template>
                        </Dropdown.Option>
                      </Dropdown.Group>
                    </Dropdown>
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>
        </section>
      </section>
    </main>

    <!-- Create flow — a medium Drawer. Body is Cards + ItemGroups: two flush
         CardBoxes (General, Token), each an Item.List with divided rows. -->
    <Drawer
      v-model:open="drawerOpen"
      size="large"
      side="right"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent>
          <!-- One native form owns the scope: the sr-only submit gives real
               Enter-to-submit; the fieldset locks every field while in flight. -->
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
                  Create a personal token to securely access your account via API.
                </p>
              </div>
              <DrawerClose />
            </PanelHeader>

            <PanelContent>
              <fieldset
                class="m-0 flex min-w-0 flex-col gap-(--layout-section-gap) border-0 p-0"
                :disabled="submitting"
              >
                <legend class="sr-only">Create personal token</legend>

                <!-- Section: General -->
                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">General</p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Name</Item.Title>
                            <Item.Description>
                              Give a unique and descriptive name to identify the personal token.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <!-- No Label in an ItemGroup → the validation message is
                                 a HelperText under the control; empty-required is
                                 amber (required is NOT an error). -->
                            <div class="flex w-full flex-col gap-(--spacing-xs)">
                              <InputText
                                v-model="form.name"
                                size="large"
                                class="w-full"
                                aria-label="Name"
                                :disabled="submitting"
                                :required="!!errors.name"
                                :aria-describedby="errors.name ? 'pt-name-error' : undefined"
                                @update:model-value="errors.name = ''"
                              />
                              <HelperText
                                v-if="errors.name"
                                id="pt-name-error"
                                kind="required"
                                :label="errors.name"
                              />
                            </div>
                          </Item.Actions>
                        </Item>

                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Description</Item.Title>
                            <Item.Description>
                              Include a description to specify the token's purpose or usage.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <Textarea
                              v-model="form.description"
                              class="w-full"
                              aria-label="Description"
                              :disabled="submitting"
                            />
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>

                <!-- Section: Token -->
                <section class="flex flex-col gap-(--layout-group-gap)">
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">Token</p>
                  <CardBox :padded="false">
                    <template #content>
                      <Item.List>
                        <Item
                          size="small"
                          class="items-start"
                        >
                          <Item.Content>
                            <Item.Title>Expires within</Item.Title>
                            <Item.Description>
                              Define the token expiration by selecting a suggested range. For
                              security, the token is only available right after it's created.
                            </Item.Description>
                          </Item.Content>
                          <Item.Actions class="justify-end flex-1 max-w-(--container-3xs)">
                            <Select
                              v-model="form.expiresWithin"
                              size="large"
                              class="w-full"
                              :disabled="submitting"
                              :display-value="expiryLabel"
                            >
                              <Select.Trigger aria-label="Expires within" />
                              <!-- TEMPORARY WORKAROUND (webkit bug): Select.Content
                                   teleports to body at z-50 but the drawer panel is
                                   z-[1001], so the dropdown renders behind it. Lift
                                   it above the panel until the fix lands. -->
                              <Select.Content class="z-[1002]!">
                                <Select.Option
                                  v-for="option in expiryOptions"
                                  :key="option.value"
                                  :value="option.value"
                                >
                                  {{ option.label }}
                                </Select.Option>
                              </Select.Content>
                            </Select>
                          </Item.Actions>
                        </Item>
                      </Item.List>
                    </template>
                  </CardBox>
                </section>
              </fieldset>
            </PanelContent>

            <PanelFooter class="flex-col md:flex-row md:justify-end">
              <Button
                class="w-full md:w-auto"
                type="button"
                label="Cancel"
                kind="outlined"
                size="medium"
                :disabled="submitting"
                @click="cancel"
              />
              <!-- webkit Button hardcodes type="button" and doesn't forward a type,
                   so drive submit from its click; the sr-only submit gives Enter. -->
              <Button
                class="w-full md:w-auto"
                label="Create"
                kind="primary"
                size="medium"
                :loading="submitting"
                @click="submit"
              />
              <button
                type="submit"
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
              >
                Create
              </button>
            </PanelFooter>
          </form>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <!-- One-time token reveal. Closing the dialog is terminal (watch clears it). -->
    <Dialog
      v-model:open="dialogOpen"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader class="w-full">
            <DialogTitle>Personal Token has been created</DialogTitle>
            <DialogClose />
          </PanelHeader>

          <PanelContent class="flex flex-col gap-(--spacing-md)">
            <DialogDescription class="sr-only">
              Copy and store your new personal token. It won't be shown again.
            </DialogDescription>

            <Message
              severity="warning"
              label="This token will only be displayed once. Make sure to copy and store it safely before closing this dialog."
            />

            <div class="flex w-full flex-col gap-(--spacing-xs)">
              <Label for="pt-token">Personal Token</Label>
              <FieldPassword
                input-id="pt-token"
                :model-value="generatedToken"
                readonly
                helper-text="Once the dialog is closed, the token cannot be retrieved. It'll be necessary to generate a new one."
              />
            </div>

            <div class="flex justify-end">
              <CopyButton
                :value="generatedToken"
                kind="outlined"
                size="large"
                aria-label="Copy personal token"
                @copy="onTokenCopied"
              />
            </div>
          </PanelContent>

          <PanelFooter class="justify-end">
            <Button
              label="Confirm"
              kind="primary"
              size="medium"
              @click="dialogOpen = false"
            />
          </PanelFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>

    <!-- A token has no "settings or instances" — what it has is whatever is
         authenticating with it right now, which is what the reader needs told. -->
    <DeleteDialog
      v-model:open="deleteOpen"
      kind="Personal token"
      :name="pendingDelete?.name ?? ''"
      description="The selected Personal token will be deleted, and any script or integration signing with it will stop authenticating. Check the"
      @confirm="confirmDelete"
    />
  </AppLayout>
</template>

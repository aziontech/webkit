<script setup>
  // The Switch Account module — a left Drawer that lets an operator move across
  // the console's multi-tenant tree (Brand → Reseller → Group → Client). Built on
  // @aziontech/webkit per /webkit-ui-craft.
  //
  // Anatomy: a "current account" card (identity + type + a Current Logged marker
  // + a shortcut to Account Settings), then the Accounts List — a SegmentedButton
  // that picks WHICH level of the tree is browsed, above a data-driven Table whose
  // context-aware Table.Search filters by name or ID within that level. Selecting
  // a row switches the logged-in account and closes the drawer; the top-rail pill
  // then reflects the choice.
  import Avatar from '@aziontech/webkit/avatar'
  import CardBox from '@aziontech/webkit/card-box'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerDescription from '@aziontech/webkit/drawer-description'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Table from '@aziontech/webkit/table'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { accountTypeOf, accountTypes, useAccounts } from '../../accounts.js'

  const open = defineModel('open', { type: Boolean, default: false })

  // `manage` fires when the gear on the current-account card is chosen — the
  // parent routes it to Account Settings. `manage-resources` fires from the
  // footer link — the parent routes it to the Manage Resources page. Both are
  // event-first per the activation convention. Switching the account itself is
  // owned by the store below.
  const emit = defineEmits(['manage', 'manage-resources'])

  const { accounts, currentAccount, currentAccountId, switchAccount } = useAccounts()

  // The type descriptor for the account the operator is currently logged into —
  // drives the Type tag on the current-account card.
  const currentType = computed(() => accountTypeOf(currentAccount.value.type))

  // Which level of the tree the list is browsing. Defaults to Clients (the leaf
  // level, where an operator spends most of their time).
  const selectedType = ref('clients')
  const activeType = computed(
    () => accountTypes.find((entry) => entry.value === selectedType.value) ?? accountTypes[3]
  )
  // The four levels as segmented choices.
  const typeSegments = accountTypes.map((entry) => ({ label: entry.label, value: entry.value }))

  // Table columns. `principal` marks Name as the row's lead cell; ID sorts
  // numerically. The Type column carries the label so Table.Search matches it.
  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 2, enableSorting: true },
    { id: 'type', accessorKey: 'typeLabel', header: 'Type' },
    { accessorKey: 'id', header: 'ID', enableSorting: true },
    { accessorKey: 'clientId', header: 'Client ID' }
  ]

  // Rows for the level being browsed, tagged with the human Type label for the
  // Type column + the global search.
  const rows = computed(() =>
    accounts.value
      .filter((account) => account.type === activeType.value.singular)
      .map((account) => ({ ...account, typeLabel: accountTypeOf(account.type).typeLabel }))
  )

  // Selecting a row switches the logged-in account and closes the drawer. Picking
  // the account you're already on is a no-op beyond dismissing the drawer.
  const selectAccount = (event, row) => {
    const changed = switchAccount(row)
    open.value = false
    if (changed) {
      toast.success(`Switched to ${row.name}.`, {
        description: `ID ${row.id} · Client ID ${row.clientId}`
      })
    } else {
      toast.info(`You're already on ${row.name}.`)
    }
  }

  const manageAccount = (event) => {
    open.value = false
    emit('manage', event)
  }

  const manageResources = (event) => {
    open.value = false
    emit('manage-resources', event)
  }
</script>

<template>
  <Drawer
    v-model:open="open"
    side="left"
    size="medium"
  >
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <PanelHeader class="w-full">
          <DrawerTitle>Switch Account</DrawerTitle>
          <DrawerClose />
        </PanelHeader>

        <PanelContent class="flex min-h-0 flex-col gap-[var(--spacing-lg)]">
          <DrawerDescription class="sr-only">
            Browse the account hierarchy and switch to another Brand, Reseller, Group, or Client.
          </DrawerDescription>

          <!-- Current account: identity, its level in the tree, a Current Logged
               marker, and a shortcut to that account's settings. -->
          <CardBox>
            <template #content>
              <div class="flex items-center gap-[var(--spacing-sm)]">
                <Avatar
                  :label="currentAccount.name"
                  size="medium"
                  kind="square"
                />
                <div class="flex min-w-0 flex-1 flex-wrap items-center gap-x-[var(--spacing-md)] gap-y-[var(--spacing-xxs)]">
                  <span class="truncate text-label-md text-[var(--text-default)]">
                    {{ currentAccount.name }}
                  </span>
                  <span class="text-body-sm text-[var(--text-muted)]">
                    ID <span class="text-[var(--text-default)]">{{ currentAccount.id }}</span>
                  </span>
                  <span class="text-body-sm text-[var(--text-muted)]">
                    Client ID <span class="text-[var(--text-default)]">{{ currentAccount.clientId }}</span>
                  </span>
                </div>
                <Tag
                  :label="currentType.typeLabel"
                  :icon="currentType.icon"
                  :severity="currentType.severity"
                  size="medium"
                />
                <Tag
                  label="Current Logged"
                  severity="success"
                  size="medium"
                />
                <Tooltip text="Account settings">
                  <IconButton
                    icon="pi pi-cog"
                    kind="outlined"
                    size="small"
                    aria-label="Account settings"
                    @click="manageAccount"
                  />
                </Tooltip>
              </div>
            </template>
          </CardBox>

          <!-- Accounts List: pick a level with the SegmentedButton, filter it with
               search, click a row to switch. -->
          <section class="flex min-h-0 flex-col gap-[var(--spacing-sm)]">
            <div class="flex flex-col gap-[var(--spacing-xxs)]">
              <h2 class="text-heading-xs text-[var(--text-default)]">Accounts List</h2>
              <p class="text-body-sm text-[var(--text-muted)]">
                Type the account name to filter results.
              </p>
            </div>

            <SegmentedButton
              v-model="selectedType"
              :options="typeSegments"
              aria-label="Account type"
              class="w-full"
            />

            <CardBox :padded="false">
              <template #content>
                <Table
                  :data="rows"
                  :columns="columns"
                  row-key="id"
                  enable-sorting
                  max-height="calc(100dvh - 24rem)"
                  :border="false"
                  @row-click="selectAccount"
                >
                  <template #toolbar>
                    <Table.Search
                      size="large"
                      placeholder="Search by name or ID"
                      class="w-full"
                    />
                  </template>

                  <template #cell-name="{ value, row }">
                    <span class="flex min-w-0 items-center gap-[var(--spacing-xs)]">
                      <span class="truncate text-[var(--text-link)] hover:underline">
                        {{ value }}
                      </span>
                      <i
                        v-if="row.id === currentAccountId"
                        class="pi pi-check shrink-0 text-body-xs text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                    </span>
                  </template>

                  <template #cell-type="{ row }">
                    <Tag
                      :label="row.typeLabel"
                      :icon="accountTypeOf(row.type).icon"
                      :severity="accountTypeOf(row.type).severity"
                      size="small"
                    />
                  </template>

                  <template #empty>
                    <EmptyState
                      title="No accounts found"
                      :description="`No ${activeType.label.toLowerCase()} match your search.`"
                    >
                      <template #icon>
                        <i class="pi pi-search text-heading-md text-[var(--text-muted)]" aria-hidden="true" />
                      </template>
                    </EmptyState>
                  </template>
                </Table>
              </template>
            </CardBox>
          </section>
        </PanelContent>

        <!-- Full resource manager: the hierarchy as an expandable, selectable
             tree with bulk actions and a details panel. -->
        <PanelFooter class="justify-between">
          <span class="text-body-sm text-[var(--text-muted)]">
            Need the full hierarchy?
          </span>
          <Button
            label="Manage resources"
            kind="outlined"
            size="medium"
            icon="pi pi-sitemap"
            @click="manageResources"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>

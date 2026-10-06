<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Message from '@aziontech/webkit/message'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import TableRoot from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, onScopeDispose, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { FIT_COLUMN, TAG_COLUMN_WIDE } from '../../lib/behavior/table-columns'
  import {
    accountTreeRows,
    accountTypeOf,
    expandableAccountIds,
    listAccountTree,
    useAccounts
  } from '../../lib/state/accounts.js'
  import IdCell from '../list/IdCell.vue'
  import AccountMark from './AccountMark.vue'

  const open = defineModel('open', { type: Boolean, default: false })

  const { currentAccount, currentAccountId, switchAccount } = useAccounts()

  const route = useRoute()
  const router = useRouter()

  const SEARCH_DEBOUNCE_MS = 250

  const search = ref('')
  const debouncedSearch = ref('')

  const roster = ref([])
  const expanded = ref(new Set())
  const loading = ref(false)
  const error = ref('')

  let requestId = 0
  let debounce

  const load = async () => {
    const id = ++requestId
    loading.value = true
    error.value = ''
    try {
      const { results } = await listAccountTree()
      if (id !== requestId) return
      roster.value = results
      expanded.value = expandableAccountIds(results)
    } catch {
      if (id !== requestId) return
      roster.value = []
      error.value = 'The account list could not be loaded.'
    } finally {
      if (id === requestId) loading.value = false
    }
  }

  onScopeDispose(() => clearTimeout(debounce))

  const searchRef = ref(null)

  watch(open, (isOpen) => {
    if (!isOpen) return
    search.value = ''
    debouncedSearch.value = ''
    load()
    nextTick(() => {
      globalThis.requestAnimationFrame(() => searchRef.value?.querySelector('input')?.focus())
    })
  })

  watch(search, (value) => {
    clearTimeout(debounce)
    debounce = setTimeout(() => {
      debouncedSearch.value = value
    }, SEARCH_DEBOUNCE_MS)
  })

  const rows = computed(() =>
    accountTreeRows(roster.value, {
      expandedIds: expanded.value,
      search: debouncedSearch.value
    })
  )

  const toggle = (row) => {
    const next = new Set(expanded.value)
    if (next.has(row.id)) next.delete(row.id)
    else next.add(row.id)
    expanded.value = next
  }

  const currentType = computed(() => accountTypeOf(currentAccount.value?.type))

  const columns = [
    { accessorKey: 'name', header: 'Name', principal: true, grow: 3 },
    { accessorKey: 'typeLabel', header: 'Type', minWidth: TAG_COLUMN_WIDE },
    { accessorKey: 'id', header: 'ID', minWidth: FIT_COLUMN },
    { accessorKey: 'clientId', header: 'Client ID', minWidth: FIT_COLUMN }
  ]

  const onSelect = (_event, row) => {
    open.value = false
    if (switchAccount(row)) {
      toast.success(`Switched to ${row.name}.`, {
        description: `ID ${row.id} · Client ID ${row.clientId}`
      })
    } else {
      toast.info(`You're already on ${row.name}.`)
    }
  }

  const openAccountSettings = () => {
    open.value = false
    router.push({
      path: '/account',
      query: route.query.email ? { email: route.query.email } : {}
    })
  }
</script>

<template>
  <Dialog
    v-model:open="open"
    size="large"
    data-testid="switch-account-dialog"
  >
    <DialogPortal>
      <DialogOverlay />
      <DialogContent>
        <PanelHeader class="w-full">
          <DialogTitle>Switch account</DialogTitle>
          <DialogClose />
        </PanelHeader>

        <PanelContent class="flex flex-col gap-(--layout-section-gap)">
          <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
            <p class="text-body-sm text-(--text-muted)">
              Pick the account to operate as. Search matches a name, an account ID or a client ID.
            </p>

            <div ref="searchRef">
              <InputText
                v-model="search"
                size="medium"
                placeholder="Search accounts..."
                aria-label="Search accounts"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
            </div>

            <Message
              v-if="error"
              severity="danger"
              size="medium"
              :label="error"
              action-label="Try again"
              @action="load"
            />

            <CardBox
              v-if="!error"
              :padded="false"
            >
              <template #content>
                <TableRoot
                  :data="rows"
                  :columns="columns"
                  row-key="id"
                  :loading="loading"
                  :border="false"
                  max-height="var(--container-md)"
                  data-testid="switch-account-table"
                  @row-click="onSelect"
                >
                  <template #cell-name="{ value, row }">
                    <div
                      class="flex w-full min-w-0 items-center gap-(--spacing-xxs)"
                      :style="{ paddingInlineStart: `calc(var(--spacing-md) * ${row.depth})` }"
                    >
                      <IconButton
                        v-if="row.hasChildren"
                        :icon="row.expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
                        kind="transparent"
                        size="small"
                        :aria-label="row.expanded ? `Collapse ${value}` : `Expand ${value}`"
                        :aria-expanded="row.expanded"
                        class="shrink-0"
                        @click.stop="toggle(row)"
                      />
                      <span
                        v-else
                        class="size-(--size-7) shrink-0"
                        aria-hidden="true"
                      />
                      <i
                        :class="row.icon"
                        class="shrink-0 text-body-sm text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <span class="min-w-0 cursor-pointer truncate hover:underline">{{
                        value
                      }}</span>
                      <Tag
                        v-if="row.id === currentAccountId"
                        label="Current"
                        severity="success"
                        size="small"
                        class="ml-auto shrink-0"
                      />
                    </div>
                  </template>

                  <template #cell-typeLabel="{ row }">
                    <Tag
                      :label="row.typeLabel"
                      :severity="accountTypeOf(row.type).severity"
                      size="small"
                    />
                  </template>

                  <template #cell-id="{ value }">
                    <IdCell
                      :value="value"
                      resource="account"
                    />
                  </template>

                  <template #empty>
                    <EmptyState
                      v-if="search"
                      key="no-match"
                      size="small"
                      icon="pi pi-search"
                      title="No accounts match your search"
                      :description="`Nothing in this tree matches “${search}”.`"
                    >
                      <template #actions>
                        <Button
                          label="Clear search"
                          kind="outlined"
                          size="medium"
                          @click="search = ''"
                        />
                      </template>
                    </EmptyState>
                    <EmptyState
                      v-else
                      key="no-tree"
                      size="small"
                      icon="pi pi-sitemap"
                      title="No other account to switch to"
                      description="This account is the only tenancy you can operate."
                    />
                  </template>
                </TableRoot>
              </template>
            </CardBox>
          </section>
        </PanelContent>

        <PanelFooter class="flex-col items-stretch gap-(--spacing-sm) sm:flex-row sm:items-center">
          <div
            class="flex min-w-0 flex-1 items-start gap-(--spacing-sm) sm:items-center"
            data-testid="switch-account-current"
          >
            <AccountMark
              :name="currentAccount?.name"
              size="medium"
              class="shrink-0"
            />

            <div class="flex min-w-0 flex-col">
              <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                <span
                  class="min-w-0 basis-full truncate text-label-sm text-(--text-default) sm:basis-auto"
                >
                  {{ currentAccount?.name }}
                </span>
                <Tag
                  :label="currentType.typeLabel"
                  :icon="currentType.icon"
                  :severity="currentType.severity"
                  size="small"
                  class="shrink-0"
                />
                <Tag
                  label="Current"
                  severity="success"
                  size="small"
                  class="shrink-0"
                />
              </div>

              <p class="flex flex-wrap gap-(--spacing-sm) text-body-xs">
                <span class="text-(--text-muted)">
                  ID
                  <span class="tabular-nums text-(--text-default)">
                    {{ currentAccount?.id }}
                  </span>
                </span>
                <span class="text-(--text-muted)">
                  Client ID
                  <span class="tabular-nums text-(--text-default)">
                    {{ currentAccount?.clientId }}
                  </span>
                </span>
              </p>
            </div>
          </div>

          <Button
            label="Account settings"
            kind="outlined"
            size="medium"
            icon="pi pi-cog"
            class="shrink-0 max-sm:w-full"
            @click="openAccountSettings"
          />
        </PanelFooter>
      </DialogContent>
    </DialogPortal>
  </Dialog>
</template>

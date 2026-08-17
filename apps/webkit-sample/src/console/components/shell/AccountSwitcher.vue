<script setup>
  // The account switcher — the second link of the header's tenancy chain
  // (Azion mark / organization / account).
  //
  // It used to live at the top of the rail, where it competed with navigation
  // for the same corner of the eye. Identity is not navigation: which tenant
  // you are acting as belongs in the global header, next to the organization
  // that owns it, and the rail is left to answer "where in this tenant am I".
  //
  // The pill names the account you're logged into, read from the shared
  // accounts store — the same source the Switch Account drawer and the Manage
  // Resources page use, so switching anywhere updates everywhere. The popover
  // is the short list (current + recently accessed); the full
  // Brand → Reseller → Group → Client tree is one row further down, in the
  // drawer this component hosts.
  import Avatar from '@aziontech/webkit/avatar'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'

  import { accountInitials, accountTypeOf, useAccounts } from '../../lib/state/accounts.js'
  import SwitchAccountDrawer from './SwitchAccountDrawer.vue'

  // The drawer's own actions bubble to the shell, which owns the router: the
  // gear on its current-account card goes to Account Settings, its footer link
  // to the Manage Resources page. Same event contract as AppSidebar, so the
  // shell routes both surfaces with one pair of handlers.
  const emit = defineEmits(['select', 'navigate'])

  const { accounts, currentAccount, currentAccountId, switchAccount } = useAccounts()

  // The popover is the short list: the current account first, then the accounts
  // with a recent visit (the console's "recently accessed"), capped so it stays
  // a menu rather than becoming the tree.
  const RECENT_LIMIT = 5
  const recentAccounts = computed(() => {
    const recent = accounts.value.filter(
      (account) => account.lastAccessed && account.id !== currentAccountId.value
    )
    return [currentAccount.value, ...recent].slice(0, RECENT_LIMIT)
  })

  // Past this many accounts the panel earns a search field — the same threshold the
  // organization and workspace panels use.
  const SEARCH_THRESHOLD = 5
  const query = ref('')

  // Searching leaves the recent list behind and looks at EVERY account, by name, id
  // or client id: the reason to type is that what you want is not one of the five.
  // Capped at RECENT_LIMIT × 2 so the panel stays a menu; the full tree is one row
  // further down, behind "Switch account".
  const matches = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return []
    return accounts.value
      .filter((account) =>
        `${account.name} ${account.id} ${account.clientId}`.toLowerCase().includes(term)
      )
      .slice(0, RECENT_LIMIT * 2)
  })

  const searching = computed(() => query.value.trim().length > 0)
  const shownAccounts = computed(() => (searching.value ? matches.value : recentAccounts.value))

  // The heading states which list is on screen, so a short result set is never
  // mistaken for the account roster shrinking.
  const listLabel = computed(() => {
    if (!searching.value) return 'Accounts'
    const count = matches.value.length
    return count === 1 ? '1 result' : `${count} results`
  })

  // Both surfaces are controlled: choosing an account — or handing off to the
  // drawer — closes the popover.
  const open = ref(false)
  const switchDrawerOpen = ref(false)

  // Opening clears the last visit's term and puts the caret in the field when the
  // roster is long enough to have one, so the panel always opens on the short list.
  const panelRef = ref(null)
  watch(open, (isOpen) => {
    if (!isOpen) return
    query.value = ''
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

  // Switching is owned by the store; re-picking the current account is a no-op
  // the popover acknowledges instead of silently dismissing.
  const selectAccount = (event, account) => {
    const changed = switchAccount(account)
    open.value = false
    if (changed) {
      toast.success(`Switched to ${account.name}.`, {
        description: `ID ${account.id} · Client ID ${account.clientId}`
      })
    } else {
      toast.info(`You're already on ${account.name}.`)
    }
  }

  const openSwitchDrawer = () => {
    open.value = false
    switchDrawerOpen.value = true
  }

  const onDrawerManage = (event) => emit('select', event, 'settings')
  const onDrawerManageResources = (event) =>
    emit('navigate', event, { id: 'resources', label: 'Manage Resources', path: '/resources' })
</script>

<template>
  <div class="flex min-w-0 items-center">
    <Popover
      v-model:open="open"
      placement="bottom-start"
      width="medium"
    >
      <Popover.Trigger #default="{ isOpen }">
        <button
          type="button"
          :data-state="isOpen ? 'open' : 'closed'"
          :aria-label="`Account: ${currentAccount.name}. Switch account`"
          class="flex w-auto items-center gap-1.5 rounded-[var(--shape-button)] p-[var(--spacing-xxs)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[state=open]:bg-[var(--bg-hover)] motion-reduce:transition-none"
        >
          <!-- 20px, not the DS Avatar's 24px `small`: the header chain's box is
               20 + 4 top + 4 bottom = 28. The scale has no 20px step, so the
               size token overrides it (Avatar merges consumer classes). -->
          <Avatar
            :label="accountInitials(currentAccount.name)"
            size="small"
            kind="square"
            class="size-[var(--size-5)]"
          />
          <!-- Below `md` the header is tight: the account keeps its mark and
               its disclosure, and gives up the name the organization beside it
               is already carrying.
               The label token's own weight, like the organization and workspace
               links: the chain is one line of chrome, and weighting one of its three
               names heavier makes that name read as a heading over the page below
               it. What distinguishes the links is their marks, not their weight. -->
          <span class="hidden whitespace-nowrap text-label-sm text-[var(--text-default)] md:inline">
            {{ currentAccount.name }}
          </span>
          <i
            class="pi pi-chevron-down shrink-0 text-body-xs text-[var(--text-muted)] transition-transform duration-fast-02 ease-productive-entrance data-[state=open]:rotate-180 motion-reduce:transition-none"
            :data-state="isOpen ? 'open' : 'closed'"
            aria-hidden="true"
          />
        </button>
      </Popover.Trigger>

      <Popover.Content>
        <div
          ref="panelRef"
          class="flex flex-col"
        >
          <!-- The field appears only past SEARCH_THRESHOLD accounts, the same rule the
               organization and workspace panels follow. Typing searches ALL accounts,
               not the five recent ones on screen — a field that only filters what is
               already visible is a field that cannot find anything. -->
          <div
            v-if="accounts.length > SEARCH_THRESHOLD"
            class="border-b border-[var(--border-muted)] p-[var(--spacing-xxs)]"
          >
            <InputText
              v-model="query"
              placeholder="Search accounts"
              size="medium"
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

          <div class="flex max-h-[16rem] flex-col overflow-y-auto p-[var(--spacing-xxs)]">
            <p
              class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]"
            >
              {{ listLabel }}
            </p>

            <button
              v-for="account in shownAccounts"
              :key="account.id"
              type="button"
              class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
              @click="(event) => selectAccount(event, account)"
            >
              <!-- 24px, not 32: the row is one line now, and a mark taller than the
                 name it belongs to makes a menu read as a list of cards. -->
              <Avatar
                :label="accountInitials(account.name)"
                size="small"
                kind="square"
              />
              <span class="flex min-w-0 flex-1 items-center gap-[var(--spacing-xxs)]">
                <span class="truncate text-label-sm text-[var(--text-default)]">
                  {{ account.name }}
                </span>
                <Tag
                  :label="accountTypeOf(account.type).typeLabel"
                  :icon="accountTypeOf(account.type).icon"
                  :severity="accountTypeOf(account.type).severity"
                  size="small"
                  class="shrink-0"
                />
                <!-- The tick sits with the NAME, not at the row's end: it says which
                   account you are on, and the identifier at the far edge is a
                   different fact about a different account on every row. -->
                <i
                  v-if="account.id === currentAccountId"
                  class="pi pi-check shrink-0 text-body-xs text-[var(--text-muted)]"
                  aria-hidden="true"
                />
              </span>
              <!-- The account id, as a Tag on the trailing edge. It used to be a second
                 line reading "ID 6528 · Client ID 9757a", which doubled every row's
                 height to carry two numbers nobody scans — and made the popover twice
                 as tall as the short list it is meant to be. One number, right aligned,
                 so the ids form a column the eye can run down; the client id stays
                 where it is actually used (the Switch account drawer's table and
                 Account Settings). `secondary` is the neutral tag, so the id never
                 competes with the type tag beside the name; `tabular-nums` keeps the
                 column from jittering between rows. -->
              <Tag
                :label="String(account.id)"
                severity="secondary"
                size="small"
                class="shrink-0 tabular-nums"
              />
            </button>

            <p
              v-if="!shownAccounts.length"
              class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
            >
              No account matches your search.
            </p>
          </div>

          <!-- The way to the whole tree, over the line that separates it from the
               short list above — the organization and workspace panels end the same
               way, with the action that goes beyond what the panel can show. -->
          <div class="flex flex-col border-t border-[var(--border-muted)] p-[var(--spacing-xxs)]">
            <button
              type="button"
              class="flex w-full items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left text-label-sm text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
              @click="openSwitchDrawer"
            >
              <i
                class="pi pi-sort-alt text-body-xs"
                aria-hidden="true"
              />
              Switch account
            </button>
          </div>
        </div>
      </Popover.Content>
    </Popover>

    <!-- The full switcher, handed off from the popover's "Switch account" row:
         the whole Brand → Reseller → Group → Client tree, one level at a time,
         with search. It teleports to the body, so it opens the same way from
         any header width. -->
    <SwitchAccountDrawer
      v-model:open="switchDrawerOpen"
      @manage="onDrawerManage"
      @manage-resources="onDrawerManageResources"
    />
  </div>
</template>

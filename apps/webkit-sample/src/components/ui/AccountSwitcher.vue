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
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, ref } from 'vue'

  import { accountInitials, accountTypeOf, useAccounts } from '../../accounts.js'
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

  // Both surfaces are controlled: choosing an account — or handing off to the
  // drawer — closes the popover.
  const open = ref(false)
  const switchDrawerOpen = ref(false)

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
          class="flex min-w-0 max-w-[9rem] items-center gap-1.5 rounded-[var(--shape-button)] p-[var(--spacing-xxs)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[state=open]:bg-[var(--bg-hover)] motion-reduce:transition-none md:max-w-[15rem]"
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
               is already carrying. -->
          <span
            class="hidden min-w-0 truncate text-label-sm font-medium text-[var(--text-default)] md:inline"
          >
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
        <div class="flex flex-col p-[var(--spacing-xxs)]">
          <p
            class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
          >
            Accounts
          </p>

          <button
            v-for="account in recentAccounts"
            :key="account.id"
            type="button"
            class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
            @click="(event) => selectAccount(event, account)"
          >
            <Avatar
              :label="accountInitials(account.name)"
              size="medium"
              kind="square"
            />
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="flex items-center gap-[var(--spacing-xxs)]">
                <span class="truncate text-label-sm text-[var(--text-default)]">
                  {{ account.name }}
                </span>
                <Tag
                  :label="accountTypeOf(account.type).typeLabel"
                  :icon="accountTypeOf(account.type).icon"
                  :severity="accountTypeOf(account.type).severity"
                  size="small"
                />
              </span>
              <span class="truncate text-body-xs text-[var(--text-muted)]">
                ID {{ account.id }} · Client ID {{ account.clientId }}
              </span>
            </span>
            <i
              v-if="account.id === currentAccountId"
              class="pi pi-check shrink-0 text-body-sm text-[var(--text-muted)]"
              aria-hidden="true"
            />
          </button>

          <div
            class="my-[var(--spacing-xxs)] h-px bg-[var(--border-muted)]"
            role="separator"
          />

          <button
            type="button"
            class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left text-label-sm text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
            @click="openSwitchDrawer"
          >
            <i
              class="pi pi-sort-alt text-body-xs"
              aria-hidden="true"
            />
            Switch account
          </button>
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

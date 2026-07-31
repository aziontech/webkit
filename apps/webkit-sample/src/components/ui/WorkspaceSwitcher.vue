<script setup>
  // The workspace switcher — the third and innermost link of the header's
  // tenancy chain (Azion mark / organization / account / workspace).
  //
  // Where the account says whose infrastructure you are operating, the
  // workspace says which slice of it: one product surface inside that account,
  // with its own workloads. It is the level a page is actually scoped to, which
  // is why it sits closest to the breadcrumb.
  //
  // No filter field here, unlike the organization switcher: an account holds a
  // handful of workspaces, and a search box over three rows is furniture. The
  // list is the whole list.
  import Avatar from '@aziontech/webkit/avatar'
  import Popover from '@aziontech/webkit/popover'
  import { toast } from '@aziontech/webkit/toast'
  import { ref } from 'vue'

  import { accountInitials } from '../../accounts.js'
  import { useWorkspaces } from '../../workspaces.js'

  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces()

  // Controlled, so picking a row — or handing off to the create flow — closes
  // the panel instead of leaving it hanging over the page.
  const open = ref(false)

  const selectWorkspace = (workspace) => {
    const changed = switchWorkspace(workspace)
    open.value = false
    if (changed) {
      toast.success(`Switched to ${workspace.name}.`, {
        description: `${workspace.workloads} workloads`
      })
    } else {
      toast.info(`You're already in ${workspace.name}.`)
    }
  }

  // Nowhere to go yet: creating a workspace is its own flow (name, region,
  // starting workloads) and is not built. It acknowledges the way every other
  // not-in-the-demo entry does, and becomes a route the day that flow lands.
  const createWorkspace = () => {
    open.value = false
    toast.info('Creating a workspace is not wired up in the demo.')
  }
</script>

<template>
  <Popover
    v-model:open="open"
    placement="bottom-start"
    width="small"
  >
    <Popover.Trigger #default="{ isOpen }">
      <button
        type="button"
        :data-state="isOpen ? 'open' : 'closed'"
        :aria-label="`Workspace: ${currentWorkspace.name}. Switch workspace`"
        class="flex min-w-0 max-w-[9rem] items-center gap-1.5 rounded-[var(--shape-button)] p-[var(--spacing-xxs)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[state=open]:bg-[var(--bg-hover)] motion-reduce:transition-none md:max-w-[12rem]"
      >
        <Avatar
          :label="accountInitials(currentWorkspace.name)"
          size="small"
          kind="square"
          class="size-[var(--size-5)]"
        />
        <!-- Below `md` the chain gives up its innermost name first: three names
             in a row is more header than a phone has. -->
        <span
          class="hidden min-w-0 truncate text-label-sm font-medium text-[var(--text-default)] md:inline"
        >
          {{ currentWorkspace.name }}
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
          Workspaces
        </p>

        <button
          v-for="workspace in workspaces"
          :key="workspace.id"
          type="button"
          class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
          @click="selectWorkspace(workspace)"
        >
          <Avatar
            :label="accountInitials(workspace.name)"
            size="medium"
            kind="square"
          />
          <span class="flex min-w-0 flex-1 flex-col">
            <span class="truncate text-label-sm text-[var(--text-default)]">
              {{ workspace.name }}
            </span>
            <span class="truncate text-body-xs text-[var(--text-muted)]">
              {{ workspace.workloads }} workloads
            </span>
          </span>
          <i
            v-if="workspace.id === currentWorkspace.id"
            class="pi pi-check shrink-0 text-body-sm text-[var(--text-default)]"
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
          @click="createWorkspace"
        >
          <i
            class="pi pi-plus text-body-xs"
            aria-hidden="true"
          />
          New workspace
        </button>
      </div>
    </Popover.Content>
  </Popover>
</template>

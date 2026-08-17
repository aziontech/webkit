<script setup>
  // The workspace switcher — the third and innermost link of the header's
  // tenancy chain (Azion mark / organization / account / workspace).
  //
  // Where the account says whose infrastructure you are operating, the
  // workspace says which slice of it: one product surface inside that account,
  // with its own workloads. It is the level a page is actually scoped to, which
  // is why it sits closest to the breadcrumb.
  //
  // The filter field is conditional, the same way it is in the other two panels: an
  // account usually holds a handful of workspaces, and a search box over three rows
  // is furniture — but the control is there the moment the list outgrows a look.
  import Avatar from '@aziontech/webkit/avatar'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'

  import { accountInitials } from '../../lib/state/accounts.js'
  import { useWorkspaces } from '../../lib/state/workspaces.js'

  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces()

  // Past this many rows the panel earns a search field.
  const SEARCH_THRESHOLD = 5

  // Controlled, so picking a row — or handing off to the create flow — closes
  // the panel instead of leaving it hanging over the page.
  const open = ref(false)
  const query = ref('')

  const filtered = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return workspaces.value
    return workspaces.value.filter((workspace) => workspace.name.toLowerCase().includes(term))
  })

  // Opening clears the last visit's term and puts the caret in the field when there
  // is one, so the list always opens complete.
  const panelRef = ref(null)
  watch(open, (isOpen) => {
    if (!isOpen) return
    query.value = ''
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

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
        class="flex w-auto items-center gap-1.5 rounded-(--shape-button) p-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[state=open]:bg-(--bg-hover) motion-reduce:transition-none"
      >
        <Avatar
          :label="accountInitials(currentWorkspace.name)"
          size="small"
          kind="square"
          class="size-(--size-5)"
        />
        <!-- Below `md` the chain gives up its innermost name first: three names
             in a row is more header than a phone has.
             The label token's own weight — all three chain links carry it, none is
             emphasised over the others (see AccountSwitcher.vue). -->
        <span class="hidden whitespace-nowrap text-label-sm text-(--text-default) md:inline">
          {{ currentWorkspace.name }}
        </span>
        <i
          class="pi pi-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance data-[state=open]:rotate-180 motion-reduce:transition-none"
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
        <!-- Same rule as the other two panels: a field only once the list is longer
             than a look. An account holds a handful of workspaces, so this is usually
             absent — but it is the same control when it is not. -->
        <div
          v-if="workspaces.length > SEARCH_THRESHOLD"
          class="border-b border-(--border-muted) p-(--spacing-xxs)"
        >
          <InputText
            v-model="query"
            placeholder="Find workspace"
            size="medium"
            aria-label="Find workspace"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>

        <div class="flex max-h-[16rem] flex-col overflow-y-auto p-(--spacing-xxs)">
          <p
            class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
          >
            Workspaces
          </p>

          <!-- One line, 24px mark, the workload count as a trailing Tag — the shape
               the account and organization panels use (see AccountSwitcher.vue). -->
          <button
            v-for="workspace in filtered"
            :key="workspace.id"
            type="button"
            class="flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="selectWorkspace(workspace)"
          >
            <Avatar
              :label="accountInitials(workspace.name)"
              size="small"
              kind="square"
            />
            <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xxs)">
              <span class="truncate text-label-sm text-(--text-default)">
                {{ workspace.name }}
              </span>
              <i
                v-if="workspace.id === currentWorkspace.id"
                class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
            </span>
            <Tag
              :label="`${workspace.workloads} workloads`"
              severity="secondary"
              size="small"
              class="shrink-0 tabular-nums"
            />
          </button>

          <p
            v-if="!filtered.length"
            class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
          >
            No workspace matches your search.
          </p>
        </div>

        <!-- Create: the last row, over the line that separates it from the roster it
             adds to — the organization panel's footer, same shape. -->
        <div class="flex flex-col border-t border-(--border-muted) p-(--spacing-xxs)">
          <button
            type="button"
            class="flex w-full items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="createWorkspace"
          >
            <i
              class="pi pi-plus text-body-xs"
              aria-hidden="true"
            />
            New workspace
          </button>
        </div>
      </div>
    </Popover.Content>
  </Popover>
</template>

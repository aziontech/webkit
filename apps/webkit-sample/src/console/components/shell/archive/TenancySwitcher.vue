<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { planSeverityFor } from '../../../lib/data/plans.js'
  import { useAccounts } from '../../../lib/state/accounts.js'
  import { useOrganizations } from '../../../lib/state/organizations.js'
  import { orderByRecents, rememberRecent } from '../../../lib/state/recents.js'
  import { useSamplePreset } from '../../../lib/state/sample-preset.js'
  import { useWorkspaces } from '../../../lib/state/workspaces.js'
  import ChangePlanDrawer from '../../billing/ChangePlanDrawer.vue'
  import AccountMark from '../AccountMark.vue'
  import OrgAvatar from '../OrgAvatar.vue'
  import SwitchAccountDialog from '../SwitchAccountDialog.vue'

  interface Props {
    fluid?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    fluid: false
  })

  const { organizations, currentOrganization, currentOrganizationId, switchOrganization } =
    useOrganizations()
  const { currentAccount } = useAccounts()
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces()

  const { plan, accountSwitcherVisible } = useSamplePreset()

  const route = useRoute()
  const router = useRouter()

  const SEARCH_THRESHOLD = 5

  const STACK_QUERY = '(max-width: 639px)'
  const stacked = ref(false)
  let stackMql = null
  const onStackChange = (event) => {
    stacked.value = event.matches
  }

  const open = ref(false)
  const accountDialogOpen = ref(false)
  const changePlanOpen = ref(false)

  const hintOpen = ref(false)

  const isMac = computed(
    () =>
      typeof navigator !== 'undefined' &&
      /mac/i.test(navigator.platform || navigator.userAgent || '')
  )

  const SHORTCUT_HINT = computed(() => (isMac.value ? '⌘O' : 'Ctrl+O'))

  const onDocumentKeydown = (event) => {
    if (event.key?.toLowerCase() !== 'o') return
    if (!(isMac.value ? event.metaKey : event.ctrlKey)) return
    if (event.altKey || event.shiftKey) return
    event.preventDefault()
    open.value = !open.value
  }

  onMounted(() => {
    stackMql = globalThis.matchMedia?.(STACK_QUERY)
    if (stackMql) {
      stacked.value = stackMql.matches
      stackMql.addEventListener('change', onStackChange)
    }
    globalThis.document?.addEventListener('keydown', onDocumentKeydown)
  })

  onUnmounted(() => {
    stackMql?.removeEventListener('change', onStackChange)
    globalThis.document?.removeEventListener('keydown', onDocumentKeydown)
  })

  const orgQuery = ref('')
  const workspaceQuery = ref('')

  const accountCountOf = (organization) =>
    `${organization.accounts} ${organization.accounts === 1 ? 'account' : 'accounts'}`

  const narrow = (items, term, haystack) => {
    const needle = term.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => haystack(item).toLowerCase().includes(needle))
  }

  const orgRows = computed(() =>
    orderByRecents(
      'organization',
      narrow(organizations.value, orgQuery.value, (item) => `${item.name} ${item.plan}`),
      currentOrganizationId.value
    )
  )

  const workspaceRows = computed(() =>
    orderByRecents(
      'workspace',
      narrow(workspaces.value, workspaceQuery.value, (item) => item.name),
      currentWorkspace.value?.id
    )
  )

  const orgSearchable = computed(() => organizations.value.length > SEARCH_THRESHOLD)
  const workspaceSearchable = computed(() => workspaces.value.length > SEARCH_THRESHOLD)

  const organizationName = computed(() => currentOrganization.value?.name ?? '')
  const workspaceName = computed(() => currentWorkspace.value?.name ?? '')

  const panelRef = ref(null)

  watch(open, (isOpen) => {
    if (isOpen) hintOpen.value = false
    if (!isOpen) return
    orgQuery.value = ''
    workspaceQuery.value = ''
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

  const openAccountDialog = () => {
    open.value = false
    accountDialogOpen.value = true
  }

  const remember = (scope, fromId, toId) => {
    rememberRecent(scope, fromId)
    rememberRecent(scope, toId)
  }

  const selectOrganization = (item) => {
    remember('organization', currentOrganizationId.value, item.id)
    if (switchOrganization(item)) {
      toast.success(`Switched to ${item.name}.`, {
        description: `${item.plan} · ${accountCountOf(item)}`
      })
    } else {
      toast.info(`You're already in ${item.name}.`)
    }
  }

  const selectWorkspace = (item) => {
    remember('workspace', currentWorkspace.value?.id, item.id)
    open.value = false
    if (switchWorkspace(item)) {
      toast.success(`Switched to ${item.name}.`, { description: `${item.workloads} workloads` })
    } else {
      toast.info(`You're already in ${item.name}.`)
    }
  }

  const openCreateFlow = () =>
    router.push({
      path: '/organizations/new',
      query: { email: route.query.email || 'myemail@azion.com' }
    })

  const onNewOrganization = () => {
    open.value = false
    if (plan.value === 'hobby') {
      changePlanOpen.value = true
      return
    }
    openCreateFlow()
  }

  const onNewWorkspace = () => {
    open.value = false
    toast.info('Creating a workspace is not wired up in the demo.')
  }

  const onPlanUpgraded = () => openCreateFlow()

  const ROW_CLASS =
    'flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none'

  const FOOTER_CLASS =
    'flex w-full items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <div :class="['flex min-w-0 items-center', props.fluid && 'w-full']">
    <Popover
      v-model:open="open"
      placement="bottom-start"
      :width="stacked ? 'small' : 'large'"
      :class="['flex!', props.fluid && 'w-full']"
    >
      <Popover.Trigger
        #default="{ isOpen }"
        :class="props.fluid && 'w-full!'"
      >
        <Tooltip
          v-model:open="hintOpen"
          :text="`Switch organization or workspace (${SHORTCUT_HINT})`"
          :placement="props.fluid ? 'right' : 'bottom'"
          :disabled="isOpen"
          :class="props.fluid && 'w-full!'"
        >
          <button
            type="button"
            :data-state="isOpen ? 'open' : 'closed'"
            :aria-label="`Scope: ${organizationName} / ${workspaceName}. Switch organization or workspace`"
            :data-fluid="props.fluid || null"
            class="flex h-7 w-auto max-w-80 items-center gap-1.5 rounded-(--shape-button) px-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[state=open]:bg-(--bg-hover) data-[fluid]:h-10 data-[fluid]:w-full data-[fluid]:max-w-none data-[fluid]:px-(--spacing-xs) motion-reduce:transition-none"
          >
            <OrgAvatar
              :name="currentOrganization?.name"
              :accent="currentOrganization?.accent"
              size="medium"
            />
            <span class="min-w-0 truncate text-label-sm text-(--text-default)">
              {{ organizationName }}
            </span>
            <span
              class="hidden shrink-0 text-body-sm text-(--text-muted) md:inline"
              aria-hidden="true"
              >/</span
            >
            <span class="hidden min-w-0 truncate text-label-sm text-(--text-default) md:inline">
              {{ workspaceName }}
            </span>
            <i
              :class="[
                'pi pi-chevron-down shrink-0 text-body-xs text-(--text-muted) transition-transform duration-fast-02 ease-productive-entrance data-[state=open]:rotate-180 motion-reduce:transition-none',
                props.fluid && 'ml-auto'
              ]"
              :data-state="isOpen ? 'open' : 'closed'"
              aria-hidden="true"
            />
          </button>
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content>
        <div ref="panelRef">
          <button
            v-if="accountSwitcherVisible"
            type="button"
            aria-label="Change account"
            class="flex w-full items-center gap-(--spacing-xs) border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="openAccountDialog"
          >
            <AccountMark
              :name="currentAccount?.name"
              size="medium"
            />
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="text-body-xs text-(--text-muted)">Account</span>
              <span class="truncate text-label-sm text-(--text-default)">
                {{ currentAccount?.name }}
              </span>
            </span>
            <i
              class="pi pi-angle-right shrink-0 text-body-xs text-(--text-muted)"
              aria-hidden="true"
            />
          </button>

          <div class="flex flex-col sm:flex-row">
            <section
              class="flex min-w-0 flex-1 flex-col"
              aria-label="Organizations"
            >
              <p class="px-(--spacing-xs) pt-(--spacing-xs) text-label-sm text-(--text-muted)">
                Organizations
              </p>

              <div
                v-if="orgSearchable"
                class="p-(--spacing-xxs)"
              >
                <InputText
                  v-model="orgQuery"
                  placeholder="Find organization"
                  aria-label="Find organization"
                  size="medium"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </div>

              <div class="flex max-h-(--size-60) flex-1 flex-col overflow-y-auto p-(--spacing-xxs)">
                <button
                  v-for="item in orgRows"
                  :key="item.id"
                  type="button"
                  :aria-current="item.id === currentOrganizationId || undefined"
                  :class="ROW_CLASS"
                  @click="selectOrganization(item)"
                >
                  <OrgAvatar
                    :name="item.name"
                    :accent="item.accent"
                    size="medium"
                  />
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xxs)">
                    <span class="truncate text-label-sm text-(--text-default)">
                      {{ item.name }}
                    </span>
                    <i
                      v-if="item.id === currentOrganizationId"
                      class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                  <Tag
                    :label="item.plan"
                    :severity="planSeverityFor(item.plan)"
                    size="small"
                    class="shrink-0"
                  />
                </button>

                <p
                  v-if="!orgRows.length"
                  class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                >
                  No organization matches your search.
                </p>
              </div>

              <div class="flex flex-col border-t border-(--border-muted) p-(--spacing-xxs)">
                <button
                  type="button"
                  :class="FOOTER_CLASS"
                  @click="onNewOrganization"
                >
                  <i
                    class="pi pi-plus-circle text-body-xs"
                    aria-hidden="true"
                  />
                  New organization
                </button>
              </div>
            </section>

            <section
              class="flex min-w-0 flex-1 flex-col border-t border-(--border-muted) sm:border-t-0 sm:border-l"
              aria-label="Workspaces"
            >
              <p class="px-(--spacing-xs) pt-(--spacing-xs) text-label-sm text-(--text-muted)">
                Workspaces
              </p>

              <div
                v-if="workspaceSearchable"
                class="p-(--spacing-xxs)"
              >
                <InputText
                  v-model="workspaceQuery"
                  placeholder="Find workspace"
                  aria-label="Find workspace"
                  size="medium"
                >
                  <template #iconLeft>
                    <i
                      class="pi pi-search"
                      aria-hidden="true"
                    />
                  </template>
                </InputText>
              </div>

              <div class="flex max-h-(--size-60) flex-1 flex-col overflow-y-auto p-(--spacing-xxs)">
                <button
                  v-for="item in workspaceRows"
                  :key="item.id"
                  type="button"
                  :aria-current="item.id === currentWorkspace?.id || undefined"
                  :aria-label="`${item.name}, ${item.workloads} workloads`"
                  :class="ROW_CLASS"
                  @click="selectWorkspace(item)"
                >
                  <Avatar
                    icon="pi pi-th-large"
                    size="small"
                    kind="square"
                    class="border-(length:--border-width-default) border-(--border-default)"
                  />
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xxs)">
                    <span class="truncate text-label-sm text-(--text-default)">
                      {{ item.name }}
                    </span>
                    <i
                      v-if="item.id === currentWorkspace?.id"
                      class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                  <Tag
                    :label="String(item.workloads)"
                    severity="secondary"
                    size="small"
                    class="shrink-0 tabular-nums"
                  />
                </button>

                <p
                  v-if="!workspaceRows.length"
                  class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
                >
                  No workspace matches your search.
                </p>
              </div>

              <div class="flex flex-col border-t border-(--border-muted) p-(--spacing-xxs)">
                <button
                  type="button"
                  :class="FOOTER_CLASS"
                  @click="onNewWorkspace"
                >
                  <i
                    class="pi pi-plus-circle text-body-xs"
                    aria-hidden="true"
                  />
                  New workspace
                </button>
              </div>
            </section>
          </div>
        </div>
      </Popover.Content>
    </Popover>

    <SwitchAccountDialog v-model:open="accountDialogOpen" />

    <ChangePlanDrawer
      v-model:open="changePlanOpen"
      title="Need more organizations?"
      @upgraded="onPlanUpgraded"
    />
  </div>
</template>

<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { planSeverityFor } from '../../../lib/data/plans.js'
  import { accountTypes, useAccounts } from '../../../lib/state/accounts.js'
  import { useOrganizations } from '../../../lib/state/organizations.js'
  import { orderByRecents, rememberRecent } from '../../../lib/state/recents.js'
  import { useSamplePreset } from '../../../lib/state/sample-preset.js'
  import { useWorkspaces } from '../../../lib/state/workspaces.js'
  import ChangePlanDrawer from '../../billing/ChangePlanDrawer.vue'
  import AccountMark from '../AccountMark.vue'
  import OrgAvatar from '../OrgAvatar.vue'

  interface Props {
    kind?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    kind: 'account'
  })

  const { organizations, currentOrganization, currentOrganizationId, switchOrganization } =
    useOrganizations()
  const { accounts, currentAccount, currentAccountId, switchAccount } = useAccounts()
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces()

  const { plan } = useSamplePreset()

  const route = useRoute()
  const router = useRouter()

  const SEARCH_THRESHOLD = 5

  const accountCountOf = (organization) =>
    `${organization.accounts} ${organization.accounts === 1 ? 'account' : 'accounts'}`

  const KINDS = {
    organization: {
      noun: 'Organization',
      heading: 'Organizations',
      searchPlaceholder: 'Find organization',
      emptyText: 'No organization matches your search.',
      width: 'small',
      nameClass: '',
      footer: { icon: 'pi pi-plus-circle', label: 'New organization' }
    },
    account: {
      noun: 'Account',
      heading: 'Accounts',
      searchPlaceholder: 'Search accounts',
      emptyText: 'No account matches your search.',
      width: 'medium',
      nameClass: 'hidden md:inline',
      footer: null
    },
    workspace: {
      noun: 'Workspace',
      heading: 'Workspaces',
      searchPlaceholder: 'Find workspace',
      emptyText: 'No workspace matches your search.',
      icon: 'pi pi-th-large',
      width: 'small',
      nameClass: 'hidden md:inline',
      footer: { icon: 'pi pi-plus-circle', label: 'New workspace' }
    }
  }

  const config = computed(() => KINDS[props.kind] ?? KINDS.account)
  const isOrganization = computed(() => props.kind === 'organization')
  const isAccount = computed(() => props.kind === 'account')

  const SEGMENT_ORDER = ['clients', 'groups', 'resellers']

  const typeSegments = SEGMENT_ORDER.map((value) => {
    const type = accountTypes.find((entry) => entry.value === value)
    return { label: type.label, value: type.singular }
  })

  const DEFAULT_SEGMENT = typeSegments[0].value
  const segmentValues = typeSegments.map((segment) => segment.value)

  const segmentFor = (type) => (segmentValues.includes(type) ? type : DEFAULT_SEGMENT)

  const typeFilter = ref(DEFAULT_SEGMENT)

  const switchableAccounts = computed(() =>
    accounts.value.filter((account) => segmentValues.includes(account.type))
  )

  const roster = computed(() => {
    if (isOrganization.value) return organizations.value
    if (isAccount.value)
      return switchableAccounts.value.filter((account) => account.type === typeFilter.value)
    return workspaces.value
  })

  const current = computed(() => {
    if (isOrganization.value) return currentOrganization.value
    if (isAccount.value) return currentAccount.value
    return currentWorkspace.value
  })

  const currentId = computed(() =>
    isOrganization.value
      ? currentOrganizationId.value
      : isAccount.value
        ? currentAccountId.value
        : currentWorkspace.value?.id
  )

  const open = ref(false)
  const query = ref('')
  const changePlanOpen = ref(false)

  const searchable = computed(
    () => (isAccount.value ? switchableAccounts.value : roster.value).length > SEARCH_THRESHOLD
  )

  const haystack = (item) => {
    if (isOrganization.value) return `${item.name} ${item.plan}`
    if (isAccount.value) return `${item.name} ${item.id} ${item.clientId}`
    return item.name
  }

  const rows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const matched = term
      ? roster.value.filter((item) => haystack(item).toLowerCase().includes(term))
      : roster.value
    return orderByRecents(props.kind, matched, currentId.value)
  })

  const nameTag = (item) => {
    if (isOrganization.value) return { label: item.plan, severity: planSeverityFor(item.plan) }
    return null
  }

  const trailingTag = (item) => {
    if (isOrganization.value) return { label: accountCountOf(item) }
    if (isAccount.value) return { label: String(item.id) }
    return { label: `${item.workloads} workloads` }
  }

  const panelRef = ref(null)
  watch(open, (isOpen) => {
    if (!isOpen) return
    query.value = ''
    if (isAccount.value) typeFilter.value = segmentFor(currentAccount.value?.type)
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

  const select = (item) => {
    open.value = false
    rememberRecent(props.kind, currentId.value)
    rememberRecent(props.kind, item.id)

    if (isOrganization.value) {
      const changed = switchOrganization(item)
      if (changed) {
        toast.success(`Switched to ${item.name}.`, {
          description: `${item.plan} · ${accountCountOf(item)}`
        })
      } else {
        toast.info(`You're already in ${item.name}.`)
      }
      return
    }

    if (isAccount.value) {
      const changed = switchAccount(item)
      if (changed) {
        toast.success(`Switched to ${item.name}.`, {
          description: `ID ${item.id} · Client ID ${item.clientId}`
        })
      } else {
        toast.info(`You're already on ${item.name}.`)
      }
      return
    }

    const changed = switchWorkspace(item)
    if (changed) {
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

  const onFooter = () => {
    open.value = false

    if (isOrganization.value) {
      if (plan.value === 'hobby') {
        changePlanOpen.value = true
        return
      }
      openCreateFlow()
      return
    }

    toast.info('Creating a workspace is not wired up in the demo.')
  }

  const onPlanUpgraded = () => openCreateFlow()
</script>

<template>
  <div class="flex min-w-0 items-center">
    <Popover
      v-model:open="open"
      placement="bottom-start"
      :width="config.width"
      class="flex!"
    >
      <Popover.Trigger #default="{ isOpen }">
        <button
          type="button"
          :data-state="isOpen ? 'open' : 'closed'"
          :aria-label="`${config.noun}: ${current?.name}. Switch ${config.noun.toLowerCase()}`"
          class="flex h-7 w-auto max-w-60 items-center gap-1.5 rounded-(--shape-button) px-(--spacing-xxs) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) data-[state=open]:bg-(--bg-hover) motion-reduce:transition-none"
        >
          <OrgAvatar
            v-if="isOrganization"
            :name="current?.name"
            :accent="current?.accent"
            size="medium"
          />
          <AccountMark
            v-else-if="isAccount"
            :name="current?.name"
            size="medium"
          />
          <Avatar
            v-else
            :icon="config.icon"
            size="small"
            kind="square"
            class="border-(length:--border-width-default) border-(--border-default)"
          />
          <span :class="['min-w-0 truncate text-label-sm text-(--text-default)', config.nameClass]">
            {{ current?.name }}
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
          <div
            v-if="searchable || isAccount"
            class="flex flex-col gap-(--spacing-xxs) border-b border-(--border-muted) p-(--spacing-xxs)"
          >
            <InputText
              v-if="searchable"
              v-model="query"
              :placeholder="config.searchPlaceholder"
              :aria-label="config.searchPlaceholder"
              size="medium"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>

            <SegmentedButton
              v-if="isAccount"
              v-model="typeFilter"
              :options="typeSegments"
              aria-label="Account level"
            />
          </div>

          <div class="flex max-h-(--size-64) flex-col overflow-y-auto p-(--spacing-xxs)">
            <p
              v-if="!isAccount"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
            >
              {{ config.heading }}
            </p>

            <button
              v-for="item in rows"
              :key="item.id"
              type="button"
              :aria-current="item.id === currentId || undefined"
              class="flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              @click="select(item)"
            >
              <OrgAvatar
                v-if="isOrganization"
                :name="item.name"
                :accent="item.accent"
                size="medium"
              />
              <AccountMark
                v-else-if="isAccount"
                :name="item.name"
                size="medium"
              />
              <Avatar
                v-else
                :icon="config.icon"
                size="small"
                kind="square"
                class="border-(length:--border-width-default) border-(--border-default)"
              />
              <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xxs)">
                <span class="truncate text-label-sm text-(--text-default)">
                  {{ item.name }}
                </span>
                <Tag
                  v-if="nameTag(item)"
                  :label="nameTag(item).label"
                  :icon="nameTag(item).icon"
                  :severity="nameTag(item).severity"
                  size="small"
                  class="shrink-0"
                />
                <i
                  v-if="item.id === currentId"
                  class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                  aria-hidden="true"
                />
              </span>
              <Tag
                :label="trailingTag(item).label"
                severity="secondary"
                size="small"
                class="shrink-0 tabular-nums"
              />
            </button>

            <p
              v-if="!rows.length"
              class="px-(--spacing-xs) py-(--spacing-sm) text-body-sm text-(--text-muted)"
            >
              {{ config.emptyText }}
            </p>
          </div>

          <div
            v-if="config.footer"
            class="flex flex-col border-t border-(--border-muted) p-(--spacing-xxs)"
          >
            <button
              type="button"
              class="flex w-full items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
              @click="onFooter"
            >
              <i
                :class="['text-body-xs', config.footer.icon]"
                aria-hidden="true"
              />
              {{ config.footer.label }}
            </button>
          </div>
        </div>
      </Popover.Content>
    </Popover>

    <ChangePlanDrawer
      v-if="isOrganization"
      v-model:open="changePlanOpen"
      title="Need more organizations?"
      @upgraded="onPlanUpgraded"
    />
  </div>
</template>

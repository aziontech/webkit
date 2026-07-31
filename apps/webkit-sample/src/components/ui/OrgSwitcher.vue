<script setup>
  // The organization switcher — the first link of the header's tenancy chain
  // (Azion mark / organization / account).
  //
  // An organization is the outermost thing an operator can be "inside", so it
  // sits in the global header rather than in the rail: the rail is navigation
  // WITHIN a tenant, and mixing the two made the sidebar answer two unrelated
  // questions at once. The pill names the org you're in; the popover is the
  // whole list — a filter field (three orgs today, but the field is what keeps
  // the control honest at thirty), one row per org with its mark, plan and
  // account count, a checkmark on the current one, and the way to create
  // another.
  //
  // Two kinds of row end up in this list, and the footer names both: the ones the
  // user was INVITED into — which is the whole reason a switcher exists — and the
  // ones they created. "New organization" opens the console's Create Organization
  // flow (/organizations/new); the first organization a user ever gets is created
  // for them at signup instead (see Onboarding.vue).
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useOrganizations } from '../../organizations.js'
  import OrgAvatar from './OrgAvatar.vue'

  const { organizations, currentOrganization, currentOrganizationId, switchOrganization } =
    useOrganizations()

  const route = useRoute()
  const router = useRouter()

  // Controlled, so picking a row closes the panel instead of leaving it hanging
  // over the page.
  const open = ref(false)
  const query = ref('')

  // The two facts that tell two same-named organizations apart. Pluralized
  // because a freshly created organization holds exactly one tenant, and
  // "1 accounts" in the first thing a new user reads about their own
  // organization is the kind of detail that makes a product feel unfinished.
  const orgSummary = (organization) =>
    `${organization.plan} · ${organization.accounts} ${organization.accounts === 1 ? 'account' : 'accounts'}`

  // Filter on name AND plan: an operator who remembers "the enterprise one"
  // finds it without remembering what it was called.
  const filtered = computed(() => {
    const term = query.value.trim().toLowerCase()
    if (!term) return organizations.value
    return organizations.value.filter((org) =>
      `${org.name} ${org.plan}`.toLowerCase().includes(term)
    )
  })

  // Opening puts the caret in the filter field (the panel is a fresh mount, so
  // the input only exists after the next tick) and clears whatever the last
  // visit typed, so the list always opens complete.
  const panelRef = ref(null)
  watch(open, (isOpen) => {
    if (!isOpen) return
    query.value = ''
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

  const selectOrg = (organization) => {
    const changed = switchOrganization(organization)
    open.value = false
    if (changed) {
      toast.success(`Switched to ${organization.name}.`, {
        description: orgSummary(organization)
      })
    } else {
      toast.info(`You're already in ${organization.name}.`)
    }
  }

  // The create flow is a focused page, so the panel closes behind it. The email
  // rides along, like every other navigation out of the console shell.
  const createOrg = () => {
    open.value = false
    router.push({
      path: '/organizations/new',
      query: { email: route.query.email || 'myemail@azion.com' }
    })
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
        :aria-label="`Organization: ${currentOrganization.name}. Switch organization`"
        class="flex min-w-0 max-w-[11rem] items-center gap-1.5 rounded-[var(--shape-button)] p-[var(--spacing-xxs)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[state=open]:bg-[var(--bg-hover)] motion-reduce:transition-none"
      >
        <OrgAvatar
          :name="currentOrganization.name"
          :accent="currentOrganization.accent"
          size="small"
        />
        <span class="min-w-0 truncate text-label-sm font-medium text-[var(--text-default)]">
          {{ currentOrganization.name }}
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
        <!-- Filter: the panel's own field, not the page search. -->
        <div class="border-b border-[var(--border-muted)] p-[var(--spacing-xxs)]">
          <InputText
            v-model="query"
            placeholder="Find organization..."
            size="medium"
            aria-label="Find organization"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>

        <!-- The list. Capped so a long roster scrolls inside the panel instead
             of growing it past the viewport. -->
        <div class="flex max-h-[16rem] flex-col overflow-y-auto p-[var(--spacing-xxs)]">
          <p
            class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-overline-sm text-[var(--text-muted)]"
          >
            Organizations
          </p>

          <button
            v-for="org in filtered"
            :key="org.id"
            type="button"
            class="flex items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
            @click="selectOrg(org)"
          >
            <OrgAvatar
              :name="org.name"
              :accent="org.accent"
              size="medium"
            />
            <span class="flex min-w-0 flex-1 flex-col">
              <span class="truncate text-label-sm text-[var(--text-default)]">
                {{ org.name }}
              </span>
              <span class="truncate text-body-xs text-[var(--text-muted)]">
                {{ orgSummary(org) }}
              </span>
            </span>
            <i
              v-if="org.id === currentOrganizationId"
              class="pi pi-check shrink-0 text-body-sm text-[var(--text-default)]"
              aria-hidden="true"
            />
          </button>

          <p
            v-if="!filtered.length"
            class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
          >
            No organization matches your search.
          </p>
        </div>

        <!-- Create: the last row, separated from the roster it adds to, over the
             line that says where the other rows came from. -->
        <div class="flex flex-col border-t border-[var(--border-muted)] p-[var(--spacing-xxs)]">
          <button
            type="button"
            class="flex w-full items-center gap-[var(--spacing-xs)] rounded-[var(--shape-button)] px-[var(--spacing-xs)] py-[var(--spacing-xs)] text-left text-label-sm text-[var(--text-default)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ring-color)] motion-reduce:transition-none"
            @click="createOrg"
          >
            <i
              class="pi pi-plus text-body-xs"
              aria-hidden="true"
            />
            New organization
          </button>
          <p
            class="px-[var(--spacing-xs)] pb-[var(--spacing-xxs)] text-body-xs text-[var(--text-muted)]"
          >
            You also appear here in organizations you were invited to.
          </p>
        </div>
      </div>
    </Popover.Content>
  </Popover>
</template>

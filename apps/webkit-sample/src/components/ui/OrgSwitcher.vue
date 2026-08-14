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
  // Two kinds of row end up in this list: the ones the user was invited into — which
  // is the whole reason a switcher exists — and the ones they created. "New
  // organization" opens the console's Create Organization flow (/organizations/new);
  // the first organization a user ever gets is created for them at signup instead
  // (see Onboarding.vue).
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useSamplePreset } from '../../lib/sample-preset.js'
  import { useOrganizations } from '../../organizations.js'
  import { planSeverityFor } from '../../plans.js'
  import ChangePlanDrawer from './ChangePlanDrawer.vue'
  import OrgAvatar from './OrgAvatar.vue'

  const { organizations, currentOrganization, currentOrganizationId, switchOrganization } =
    useOrganizations()

  // The contract in force — it decides whether "New organization" opens the create
  // flow or the plan comparison (../../lib/sample-preset.js).
  const { plan } = useSamplePreset()

  const route = useRoute()
  const router = useRouter()

  // Controlled, so picking a row closes the panel instead of leaving it hanging
  // over the page.
  const open = ref(false)
  const query = ref('')

  // Past this many rows the panel earns a search field. Shared with the account and
  // workspace switchers by convention, not by import — each panel states its own
  // threshold next to the list it governs.
  const SEARCH_THRESHOLD = 5

  // Pluralized because a freshly created organization holds exactly one tenant, and
  // "1 accounts" in the first thing a new user reads about their own organization is
  // the kind of detail that makes a product feel unfinished.
  const accountCountOf = (organization) =>
    `${organization.accounts} ${organization.accounts === 1 ? 'account' : 'accounts'}`

  // The whole summary, for the toast — the row itself now carries the two facts as
  // separate tags.
  const orgSummary = (organization) => `${organization.plan} · ${accountCountOf(organization)}`

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
  const openCreateFlow = () => {
    router.push({
      path: '/organizations/new',
      query: { email: route.query.email || 'myemail@azion.com' }
    })
  }

  // A SECOND ORGANIZATION IS A PAID FEATURE.
  //
  // Hobby is one organization — the one you were given at signup — so the row is
  // still offered and still answers, but what it opens is the plan comparison
  // (./ChangePlanDrawer.vue) with the sentence that says which action asked for it.
  // Hiding or disabling the row instead would leave the reader to work out WHY on
  // their own, which is the version of this moment that loses the customer: a
  // refusal that names the contract and shows the way past it is a sale, and a
  // greyed-out row is a dead end.
  const changePlanOpen = ref(false)
  const createOrg = () => {
    open.value = false
    if (plan.value === 'hobby') {
      changePlanOpen.value = true
      return
    }
    openCreateFlow()
  }

  // Paid: pick up exactly where the reader was stopped.
  const onPlanUpgraded = () => openCreateFlow()
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
        class="flex w-auto items-center gap-1.5 rounded-[var(--shape-button)] p-[var(--spacing-xxs)] transition-colors duration-fast-02 ease-productive-entrance hover:bg-[var(--bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] data-[state=open]:bg-[var(--bg-hover)] motion-reduce:transition-none"
      >
        <OrgAvatar
          :name="currentOrganization.name"
          :accent="currentOrganization.accent"
          size="small"
        />
        <!-- The label token's own weight — all three chain links carry it, none is
             emphasised over the others (see AccountSwitcher.vue).
             `whitespace-nowrap`, not `truncate`: the DS Popover.Trigger wrapping this
             button is `w-fit shrink-0`, so the pill can never be compressed and the
             ellipsis could never fire — all `truncate` did was open an overflow box
             that sized itself off the flex line rather than off the word in it. The
             name decides the width now. -->
        <span class="whitespace-nowrap text-label-sm text-[var(--text-default)]">
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
        <!-- Filter: the panel's own field, not the page search. It appears only past
             SEARCH_THRESHOLD rows — a search box over a list you can read in one look
             is furniture, and it puts a keystroke between the reader and a row that
             was already on screen. Same rule in the account and workspace switchers,
             so the three panels behave alike. -->
        <div
          v-if="organizations.length > SEARCH_THRESHOLD"
          class="border-b border-[var(--border-muted)] p-[var(--spacing-xxs)]"
        >
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
          <p class="px-[var(--spacing-xs)] py-[var(--spacing-xxs)] text-label-sm text-[var(--text-muted)]">
            Organizations
          </p>

          <!-- One line per row, 24px mark, and the row's numbers as Tags on the
               trailing edge — the same shape the account and workspace panels use,
               so the three links of the chain open into three panels that read as
               one control (see AccountSwitcher.vue). -->
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
              size="small"
            />
            <span class="flex min-w-0 flex-1 items-center gap-[var(--spacing-xxs)]">
              <span class="truncate text-label-sm text-[var(--text-default)]">
                {{ org.name }}
              </span>
              <!-- The tier in the tier's OWN colour (../../plans.js) — the same tag
                   the entrance's plan step shows, the upgrade drawer sells and the
                   account menu carries on the profile. A neutral tag here would make
                   the one fact this row shares with the rest of the console the one
                   place it looks different. -->
              <Tag
                :label="org.plan"
                :severity="planSeverityFor(org.plan)"
                size="small"
                class="shrink-0"
              />
              <i
                v-if="org.id === currentOrganizationId"
                class="pi pi-check shrink-0 text-body-xs text-[var(--text-muted)]"
                aria-hidden="true"
              />
            </span>
            <Tag
              :label="accountCountOf(org)"
              severity="secondary"
              size="small"
              class="shrink-0 tabular-nums"
            />
          </button>

          <p
            v-if="!filtered.length"
            class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
          >
            No organization matches your search.
          </p>
        </div>

        <!-- Create: the last row, over the line that separates it from the roster it
             adds to — the same footer the account and workspace panels end with. -->
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
        </div>
      </div>
    </Popover.Content>
  </Popover>

  <!-- Opened when the plan refuses a second organization. It teleports to the body,
       so it survives this popover closing behind it. -->
  <ChangePlanDrawer
    v-model:open="changePlanOpen"
    title="Need more organizations?"
    @upgraded="onPlanUpgraded"
  />
</template>

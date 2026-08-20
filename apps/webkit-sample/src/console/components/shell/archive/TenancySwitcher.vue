<script setup>
  // ARCHIVED — not mounted. See ./README.md.
  //
  // The organization and workspace levels are parked: the header now carries the
  // ACCOUNT alone (../AccountSwitcher.vue), which opens the roster dialog this file
  // used to open from its account band. Kept whole because the two columns, their
  // recents ordering, the ⌘O panel and the plan-gated "New organization" footer are a
  // direction we expect to come back to, not a defect.
  //
  // The tenancy switcher — ONE control for the whole chain.
  //
  // WHAT CHANGED, AND WHY. This used to be three pills in the header —
  // organization / account / workspace — joined by slashes, each with its own
  // popover (kept whole at ./archive/AccountSwitcherPopover.vue). They were already
  // one component told which level it was, so they could not drift apart; what they
  // could not stop being was three separate places to click. The reader had to know
  // which pill held which level before they could switch anything, and the chain
  // spent the header's entire left region saying who you are.
  //
  // So the levels collapse into one switch: one pill that NAMES the scope, one panel
  // that holds it. The panel is two columns because the two levels an operator moves
  // between all day are the outermost and the innermost — the organization you belong
  // to and the workspace you are looking at — and putting them side by side makes
  // switching either one click from the same place, with the other still on screen.
  //
  // Each column names a level that narrows the next: the organization is who you belong
  // to, the account is whose infrastructure you operate, the workspace is which slice of
  // it you are looking at.
  //
  // WHAT OWNS THE WORKSPACE COLUMN is the ACCOUNT, not the organization
  // (../../../lib/state/workspaces.js keys its seeds by account id, and an organization
  // contributes its own workspaces only when it created them at signup). So picking an
  // account re-scopes that column in place, and picking an organization normally leaves
  // it standing — which is why neither of them closes the panel: the tick moving is the
  // acknowledgement, and the reader is one click from the other column either way. Only
  // the workspace closes it. It is the leaf, so choosing one is the end of the move.
  //
  // THE ACCOUNT IS NOT A THIRD COLUMN. The Brand → Reseller → Group → Client tree only
  // exists for customers who have one (../../../lib/state/sample-preset.js gates it), and
  // it needs room the two columns do not have: a level picker, four columns of
  // identifying facts, and the longest names of the three levels. Three cramped
  // columns would have made the common move (organization, workspace) worse to serve
  // the rare one.
  //
  // So the panel carries a BAND naming the account in scope — it is the tenant that owns
  // the workspaces in the column below, which is the one thing the pill has no room to
  // say — and the roster itself opens as a modal DIALOG (see `accountDialogOpen`).
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

  // The pill has two shapes, one per host.
  //
  // In the NAVIGATION RAIL it is `fluid`: a full-width row at the top of the header
  // region, above the search field, sized like it (40px) — the shape Cloudflare's
  // console uses for the same control. That is where the chain belongs once the app
  // bar moves into the content zone, because the bar's leading edge is spoken for:
  // it has to hold the breadcrumb, on the page column's own vertical.
  //
  // In the APP HEADER it stays a content-sized pill (28px), beside the other header
  // controls. That is the shape below `md`, where the rail is not on screen at all and
  // the header is the only chrome left to carry identity — and where the breadcrumb is
  // hidden anyway, so nothing is competing for the leading edge.
  const props = defineProps({
    // Take the full width of the host and push the chevron to its trailing edge.
    fluid: { type: Boolean, default: false }
  })

  // All three stores are module-level singletons, so reading all of them here costs
  // nothing — and it is what lets one panel speak for the whole chain.
  const { organizations, currentOrganization, currentOrganizationId, switchOrganization } =
    useOrganizations()
  const { currentAccount } = useAccounts()
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces()

  // The contract in force — it decides whether "New organization" opens the create
  // flow or the plan comparison, and whether this customer has an account level at
  // all (../../../lib/state/sample-preset.js).
  const { plan, accountSwitcherVisible } = useSamplePreset()

  const route = useRoute()
  const router = useRouter()

  // Past this many rows a list earns a search field. One constant for the three
  // levels, because the reason is the same at each: a search box over a list you can
  // read in one look is furniture, and it puts a keystroke between the reader and a
  // row that was already on screen.
  const SEARCH_THRESHOLD = 5

  // Below `sm` the two columns stack, and the panel narrows with them — a 472px panel
  // on a 360px phone is not a wide panel, it is a panel with a piece missing off the
  // right edge. The DS panel's width comes from a PROP (min-width, so no child can
  // talk it down), which is why this is a media query in JS rather than a breakpoint
  // class: the same boolean has to pick the preset and the axis, or the two disagree
  // and the columns are laid out for a width the panel does not have.
  const STACK_QUERY = '(max-width: 639px)'
  const stacked = ref(false)
  let stackMql = null
  const onStackChange = (event) => {
    stacked.value = event.matches
  }

  // THE ACCOUNT LEVEL IS A DIALOG, NOT A FACE OF THE POPOVER.
  //
  // It was a step inside the panel — the columns turned over to the account roster and
  // back. Two things are wrong with that. A popover is a light surface you dismiss by
  // looking away, and switching the tenant whose infrastructure you operate is not a
  // light move: it re-scopes every page behind it, so it deserves a surface that says
  // so and that you have to answer. And a panel that swaps its own contents makes the
  // reader's click change what the thing they opened IS, with no way back except a
  // control they have to find.
  //
  // A modal dialog is the honest surface for it: its own title naming the move, a focus
  // trap, Escape, and room for the level segments and the longest names of the three
  // levels without the columns paying for them.
  const open = ref(false)
  const accountDialogOpen = ref(false)
  const changePlanOpen = ref(false)

  // The hint's own state, CONTROLLED — not left to the DS Tooltip's hover.
  //
  // A tooltip that is already open when the panel opens cannot be closed by
  // `disabled` alone: the DS `setOpen` returns early while disabled, so the hint
  // would sit over the panel's first column for as long as the panel is up — and the
  // path there is the ordinary one, since a reader hovers the pill (reads the hint)
  // and then clicks it. Holding the model here means the panel can close the hint
  // outright, and `disabled` only has to keep it from coming back while the panel is
  // the thing being read.
  const hintOpen = ref(false)

  // ⌘O opens it from anywhere, like the palette's ⌘K one rail over (the DS CommandMenu
  // in ./AppSidebar.vue owns that one). Switching scope is the most frequent thing an
  // operator does that is not on the page they are reading, and the pill sits in the
  // one region a wide screen makes them travel furthest to reach.
  //
  // ONE MODIFIER PER PLATFORM, matched the way the DS matches ⌘K: Meta on macOS, Ctrl
  // everywhere else — not "either one". Accepting both would fire this on Windows for
  // Win+O, which is the OS's own chord and not ours to take, and it would leave the
  // hint below lying to every reader who is not on a Mac.
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
    // The browser's own Open-file dialog is the default here, and it would take the
    // keystroke and the reader's attention with it.
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

  // One term per list, not one shared across them: the columns are two lists on screen
  // at the same time, and a term typed into either would otherwise empty the other.
  const orgQuery = ref('')
  const workspaceQuery = ref('')

  // Pluralized because a freshly created organization holds exactly one tenant, and
  // "1 accounts" in the first thing a new user reads about their own organization is
  // the kind of detail that makes a product feel unfinished.
  const accountCountOf = (organization) =>
    `${organization.accounts} ${organization.accounts === 1 ? 'account' : 'accounts'}`

  // WHAT A TERM MATCHES: the name, plus whatever else identifies the row. An operator
  // who remembers "the enterprise one" finds the organization without remembering what
  // it was called.
  const narrow = (items, term, haystack) => {
    const needle = term.trim().toLowerCase()
    if (!needle) return items
    return items.filter((item) => haystack(item).toLowerCase().includes(needle))
  }

  // Every list shows its whole roster and filters it in place — one rule for the three
  // levels. Ordered by RECENTS (../../../lib/state/recents.js): where you are, then where
  // you have been, then the roster's own order. Ordering last, after the filter, so a
  // search result set is ordered the same way the full list is — the row you last used
  // is the first row whether you scrolled to it or typed for it.
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

  // The pill's own sentence, and the panel's account head. `plan` rides along on the
  // organization row because it is the one fact that decides what the footer below it
  // can do.
  const organizationName = computed(() => currentOrganization.value?.name ?? '')
  const workspaceName = computed(() => currentWorkspace.value?.name ?? '')

  // Both surfaces are controlled: picking a row — or handing off to a drawer — closes
  // the panel instead of leaving it hanging over the page.
  const panelRef = ref(null)

  // Opening clears the last visit's terms, returns to the two columns, and puts the
  // caret in the first field that exists — so a panel always opens on its complete
  // lists, on the face it was designed to open on. The panel is a fresh mount, so the
  // input only exists after the next tick.
  watch(open, (isOpen) => {
    if (isOpen) hintOpen.value = false
    if (!isOpen) return
    orgQuery.value = ''
    workspaceQuery.value = ''
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

  // Opening the dialog closes the popover under it: the dialog is modal and teleported,
  // so a click inside it counts as a click outside the popover and would dismiss it
  // anyway — closing it deliberately means the panel does not flicker away a frame
  // after the dialog lands on top of it.
  //
  // Everything the roster then does — the level it opens on, its own search, its
  // states — belongs to ./SwitchAccountDialog.vue: it is a surface with a fetch
  // behind it, not a face of this panel.
  const openAccountDialog = () => {
    open.value = false
    accountDialogOpen.value = true
  }

  // BOTH ENDS OF THE MOVE go into the trail: the place being left is the one you are
  // most likely to want back (an operator comparing two accounts bounces between
  // exactly those two), so it lands right behind the one being chosen. Written on the
  // CLICK, not on the store's answer: re-picking where you already are is a no-op for
  // the store, but it is still the most recent thing you chose.
  const remember = (scope, fromId, toId) => {
    rememberRecent(scope, fromId)
    rememberRecent(scope, toId)
  }

  // Switching is owned by the store, and every store's switch is idempotent:
  // re-picking what you are already in is a no-op the panel acknowledges instead of
  // silently dismissing.
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
    // The leaf closes the panel — there is nothing left to narrow.
    open.value = false
    if (switchWorkspace(item)) {
      toast.success(`Switched to ${item.name}.`, { description: `${item.workloads} workloads` })
    } else {
      toast.info(`You're already in ${item.name}.`)
    }
  }

  // The create flow is a focused page, so the panel closes behind it. The email rides
  // along, like every other navigation out of the console shell.
  const openCreateFlow = () =>
    router.push({
      path: '/organizations/new',
      query: { email: route.query.email || 'myemail@azion.com' }
    })

  // THE FOOTERS GO WHERE THEIR COLUMN CANNOT.
  //
  // A SECOND organization is a paid feature. Hobby is one — the one you were given at
  // signup — so the row is still offered and still answers, but what it opens is the
  // plan comparison (../../billing/ChangePlanDrawer.vue) with the sentence that says
  // which action asked for it. Hiding or disabling the row would leave the reader to
  // work out WHY on their own, which is the version of this moment that loses the
  // customer: a refusal that names the contract and shows the way past it is a sale,
  // and a greyed-out row is a dead end.
  const onNewOrganization = () => {
    open.value = false
    if (plan.value === 'hobby') {
      changePlanOpen.value = true
      return
    }
    openCreateFlow()
  }

  // Nowhere to go yet — creating a workspace is its own flow (name, region, starting
  // workloads) and is not built. It acknowledges the way every other not-in-the-demo
  // entry does, and becomes a route the day that flow lands.
  const onNewWorkspace = () => {
    open.value = false
    toast.info('Creating a workspace is not wired up in the demo.')
  }

  // Paid: pick up exactly where the reader was stopped.
  const onPlanUpgraded = () => openCreateFlow()

  // ONE ROW SHAPE FOR THE THREE LISTS. A flat literal, not a class map: a row in the
  // organization column and a row in the account dialog are the same control listing a
  // different kind of thing, and the moment they are two strings they start drifting
  // in padding and focus ring (.claude/rules/styling.md).
  const ROW_CLASS =
    'flex items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none'

  // The action under a list, over the line that separates it from one.
  const FOOTER_CLASS =
    'flex w-full items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-left text-label-sm text-(--text-default) transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none'
</script>

<template>
  <!-- ONE OPTICAL CENTRE. `flex!` on the Popover, and a flex wrapper around it, are
       what make the pill sit on the row's centre line. The DS Popover root is
       `inline-block`, so its trigger is an INLINE box: the browser gives it a line box
       sized by the font's strut and drops the pill onto that line's baseline, leaving
       the descender gap BELOW it — a 31px box holding a 28px pill, with the pill pinned
       to the top. In a header region that centres its children, that lands the switcher
       1.5px above the actions beside it — measured, and visible. Flex has no baseline
       to fall off: the pill is a flex item, the box is 28, the centre is the centre.
       Important, because `flex` and `inline-block` are the same property and the winner
       is CSS source order, not the order they are written. -->
  <div :class="['flex min-w-0 items-center', props.fluid && 'w-full']">
    <Popover
      v-model:open="open"
      placement="bottom-start"
      :width="stacked ? 'small' : 'large'"
      :class="['flex!', props.fluid && 'w-full']"
    >
      <!-- `w-full!`, important, on both passthrough wrappers: the DS Trigger and the DS
           Tooltip are each `inline-flex w-fit shrink-0`, and `w-fit` / `w-full` are the same
           property — a plain class would be settled by CSS source order, not by which one is
           written here. Without it the pill inside a full-width rail row stays content-sized
           and the chevron sits mid-row. -->
      <Popover.Trigger
        #default="{ isOpen }"
        :class="props.fluid && 'w-full!'"
      >
        <!-- The shortcut has to be discoverable from the thing it operates, and a
             tooltip is the only place in the header with room to say it. It is disabled
             while the panel is open: a tooltip explaining how to open what is already
             open is a label on top of the reader's own click. -->
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
            <!-- THE PILL IS 28 TALL AND ITS MARK IS 24 (Figma 6037:55164: pill 108×28,
                 avatar 24×24 at y=2, 4px of horizontal padding, 6px gaps). So the height
                 is stated on the pill — `h-7`, padding on the x axis only — and the mark
                 is the marble at its own 24 (OrgAvatar `medium`), the same size the
                 rows below use: the mark you click in the header is the mark you see in
                 the list.
                 ONE mark, not one per level: the pill names a path, and a mark per name
                 would rebuild the three-pill row inside a single button. -->
            <OrgAvatar
              :name="currentOrganization?.name"
              :accent="currentOrganization?.accent"
              size="medium"
            />
            <!-- The label token's own weight for both names, and the slash between them
                 in the muted one: the pill is one line of chrome naming a path, and
                 weighting either end makes that end read as a heading over the page
                 below it.
                 The WORKSPACE is what the pill gives up first when the row runs out of
                 room — below `md` the header also carries the nav trigger and the
                 actions, and the organization is the outermost thing you are inside and
                 the only level that is never absent. `truncate` earns its keep against
                 the pill's `max-w-80`: a long customer name has something to be clipped
                 against. -->
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
          <!-- THE ACCOUNT, ACROSS THE TOP — when the customer has more than one to be
               (../../../lib/state/sample-preset.js gates it). A band rather than the head
               of the workspace column, for one reason worth stating: as a column head
               it pushed that column's list one row down, so the two columns' headings
               stopped lining up and the panel read as two panels that happened to be
               adjacent. Full width, and both columns start level.
               It also gets to state the level plainly — this is the tenant whose
               infrastructure you are operating — which the pill above cannot afford to
               do while naming two other levels. -->
          <button
            v-if="accountSwitcherVisible"
            type="button"
            aria-label="Change account"
            class="flex w-full items-center gap-(--spacing-xs) border-b border-(--border-muted) px-(--spacing-xs) py-(--spacing-xs) text-left transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--ring-color) motion-reduce:transition-none"
            @click="openAccountDialog"
          >
            <!-- An ACCOUNT is a COMPANY, so it wears that company's logo
                 (./AccountMark.vue, over the site's own client registry), falling back
                 to initials for a customer whose mark this repo does not own. -->
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

          <!-- THE TWO COLUMNS. Equal halves (`flex-1` + `min-w-0`, so a long name
               truncates instead of pushing its neighbour), divided by a rule that
               changes axis with them: below `sm` they stack and the rule goes across. -->
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

              <!-- Capped so a long roster scrolls inside the column instead of growing
                   the panel past the viewport — and `flex-1` so the SHORTER column's
                   list absorbs the slack instead of leaving its footer stranded halfway
                   up a full-height column. Two footers at two different heights read as
                   two panels side by side; on the panel's bottom edge they read as one
                   panel with two columns. -->
              <div class="flex max-h-[15rem] flex-1 flex-col overflow-y-auto p-(--spacing-xxs)">
                <!-- Picking an organization does NOT close the panel: it re-scopes the
                     column beside this one, and that column is the reason the panel is
                     two columns. The tick moves, the workspaces change, the reader is
                     still in the control. -->
                <button
                  v-for="item in orgRows"
                  :key="item.id"
                  type="button"
                  :aria-current="item.id === currentOrganizationId || undefined"
                  :class="ROW_CLASS"
                  @click="selectOrganization(item)"
                >
                  <!-- Generated marble art seeded by the org's own name: an operator
                       lives in a handful of organizations at once and has to tell them
                       apart before reading a character. -->
                  <OrgAvatar
                    :name="item.name"
                    :accent="item.accent"
                    size="medium"
                  />
                  <span class="flex min-w-0 flex-1 items-center gap-(--spacing-xxs)">
                    <span class="truncate text-label-sm text-(--text-default)">
                      {{ item.name }}
                    </span>
                    <!-- The tick sits with the NAME, not at the row's end, where the
                         column's own trailing fact lives. It is `aria-hidden`: the same
                         fact reaches assistive tech through the row's `aria-current`. -->
                    <i
                      v-if="item.id === currentOrganizationId"
                      class="pi pi-check shrink-0 text-body-xs text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                  <!-- The tier in the tier's OWN colour (../../../lib/data/plans.js) — the
                       same tag the entrance's plan step shows and the upgrade drawer
                       sells. The account COUNT this row used to carry is gone: the
                       column beside it now names the account outright, so the number was
                       an estimate of something on screen. -->
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

              <div class="flex max-h-[15rem] flex-1 flex-col overflow-y-auto p-(--spacing-xxs)">
                <button
                  v-for="item in workspaceRows"
                  :key="item.id"
                  type="button"
                  :aria-current="item.id === currentWorkspace?.id || undefined"
                  :aria-label="`${item.name}, ${item.workloads} workloads`"
                  :class="ROW_CLASS"
                  @click="selectWorkspace(item)"
                >
                  <!-- A workspace is a partition, not a party — there is nothing to
                       identify, only the kind of link to state — so every row carries
                       the level's own glyph, per the Figma header (node 6037:55154).
                       Icon mode: no `label`, so the DS Avatar renders its `icon` at the
                       root's own 12px. The border is the one thing the DS gives a
                       lettered avatar and not an icon one, and the design has it on
                       both — so it comes from here until the DS catches up, at the
                       design's hairline `--border-width-default` (0.8px) rather than the
                       1px the DS hard-codes for the lettered variant. -->
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
                  <!-- THE COUNT, NOT THE SENTENCE. "22 workloads" spelled out took
                       about 90 of the column's 236px and the NAME paid for it: "Internet
                       Banking" clipped to "Internet …" in a panel with room to spare. The
                       column is headed "Workspaces" and the number on a workspace row is
                       the one number a workspace has, so the word was carrying nothing
                       the heading does not — and the row's `aria-label` says it in full
                       for anyone the heading does not reach.
                       `secondary` is the neutral tag, so the number never competes with a
                       name; `tabular-nums` keeps the column from jittering. -->
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

    <!-- THE ACCOUNT ROSTER — a modal dialog, because switching the tenant you operate
         re-scopes every page behind it. See the note beside `accountDialogOpen`. It
         teleports to the body, so it survives the popover closing under it and opens
         the same way from any header width. -->
    <SwitchAccountDialog v-model:open="accountDialogOpen" />

    <!-- It teleports to the body, so it survives the popover closing behind it and
         opens the same way from any header width. -->
    <ChangePlanDrawer
      v-model:open="changePlanOpen"
      title="Need more organizations?"
      @upgraded="onPlanUpgraded"
    />
  </div>
</template>

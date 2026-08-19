<script setup>
  // The tenancy switcher — ONE component for every link of the header's chain
  // (Azion mark / organization / account / workspace).
  //
  // There used to be three files here — OrgSwitcher, AccountSwitcher,
  // WorkspaceSwitcher — and they were the same control three times: a pill that
  // names what you are inside, a popover that lists the alternatives, a filter
  // field that appears once the list outgrows a look, a row per entry with its
  // mark and its numbers, and a footer that goes where the panel cannot. Each
  // copy carried a comment saying "the same shape the other two use", which is
  // the codebase asking to be collapsed: three files that must not drift are one
  // file with a `kind`.
  //
  // What differs between the levels is DATA, not anatomy — which store answers,
  // what the mark is, which two facts a row carries, and where the footer goes —
  // so the differences live in `KINDS` below and the markup is written once.
  // That is also what keeps the three panels reading as one control: they cannot
  // drift apart, because there is only one of them.
  //
  // Each link narrows the one before it: the organization is who you belong to,
  // the account is whose infrastructure you operate, the workspace is which
  // slice of it you are looking at.
  import Avatar from '@aziontech/webkit/avatar'
  import InputText from '@aziontech/webkit/input-text'
  import Popover from '@aziontech/webkit/popover'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import { computed, nextTick, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { planSeverityFor } from '../../lib/data/plans.js'
  import { accountTypes, useAccounts } from '../../lib/state/accounts.js'
  import { useOrganizations } from '../../lib/state/organizations.js'
  import { orderByRecents, rememberRecent } from '../../lib/state/recents.js'
  import { useSamplePreset } from '../../lib/state/sample-preset.js'
  import { useWorkspaces } from '../../lib/state/workspaces.js'
  import ChangePlanDrawer from '../billing/ChangePlanDrawer.vue'
  import AccountMark from './AccountMark.vue'
  import OrgAvatar from './OrgAvatar.vue'

  const props = defineProps({
    // Which link of the tenancy chain this instance is:
    // 'organization' | 'account' | 'workspace'.
    kind: { type: String, default: 'account' }
  })

  // All three stores are module-level singletons, so reading all of them costs
  // nothing and keeps the descriptors below plain data.
  const { organizations, currentOrganization, currentOrganizationId, switchOrganization } =
    useOrganizations()
  const { accounts, currentAccount, currentAccountId, switchAccount } = useAccounts()
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaces()

  // The contract in force — it decides whether "New organization" opens the create
  // flow or the plan comparison (../../lib/state/sample-preset.js).
  const { plan } = useSamplePreset()

  const route = useRoute()
  const router = useRouter()

  // Past this many rows a panel earns a search field. One constant for the three
  // levels, because the reason is the same at each: a search box over a list you
  // can read in one look is furniture, and it puts a keystroke between the reader
  // and a row that was already on screen.
  const SEARCH_THRESHOLD = 5

  // Pluralized because a freshly created organization holds exactly one tenant, and
  // "1 accounts" in the first thing a new user reads about their own organization is
  // the kind of detail that makes a product feel unfinished.
  const accountCountOf = (organization) =>
    `${organization.accounts} ${organization.accounts === 1 ? 'account' : 'accounts'}`

  // WHAT EACH LEVEL IS — the whole difference between the three switchers.
  //
  // THE MARK, per level — three different answers, because the three levels are
  // different kinds of thing:
  //
  //   • An ORGANIZATION wears generated marble art seeded by its own name
  //     (./OrgAvatar.vue). An operator lives in a handful of organizations at once and
  //     has to tell them apart before reading a character, so that mark must be unique
  //     per org.
  //   • An ACCOUNT is a COMPANY, so it wears that company's logo (./AccountMark.vue,
  //     over the site's own client registry), falling back to initials for a customer
  //     whose mark this repo does not own. A generic glyph here was the one mark that
  //     said nothing: every account row carried the same picture.
  //   • A WORKSPACE is a partition, not a party — there is nothing to identify, only
  //     the kind of link to state — so it keeps a fixed glyph: `pi-th-large`, per the
  //     Figma header (node 6037:55154).
  //
  // `nameClass` is where the chain sheds width: below `md` three names in a row is
  // more header than a phone has, so the account and the workspace give up their
  // names and keep their marks, while the organization — the outermost thing you
  // are inside, and the only link that is never absent — keeps its own.
  const KINDS = {
    organization: {
      noun: 'Organization',
      heading: 'Organizations',
      searchPlaceholder: 'Find organization',
      emptyText: 'No organization matches your search.',
      // Small: the org row carries a name and two short tags.
      width: 'small',
      nameClass: '',
      footer: { icon: 'pi pi-plus-circle', label: 'New organization' }
    },
    account: {
      noun: 'Account',
      heading: 'Accounts',
      searchPlaceholder: 'Search accounts',
      emptyText: 'No account matches your search.',
      // Medium: an account row carries a type tag AND an id, and customer names
      // are the longest of the three.
      width: 'medium',
      nameClass: 'hidden md:inline',
      // No footer: the panel IS the whole list of accounts the operator is part of,
      // so there is nothing left for a footer to open. It used to carry "Switch
      // account", which handed off to a drawer that browsed the Brand → Reseller →
      // Group → Client tree one level at a time — a second switcher behind the
      // switcher. Managing that tree (labels, charges, expanding nodes) is the
      // Manage Resources page's job (../../pages/account/ManageResources.vue); the
      // header's job is to switch, and a list does that in one click instead of two.
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

  // The whole roster of this level, and the entry currently in scope.
  //
  // ONE LEVEL AT A TIME — the account panel's segmented filter.
  //
  // The account roster is three different kinds of thing stacked in one list: the
  // client accounts an operator actually works in, and the groups and resellers those
  // clients hang under. A flat list made every row carry a type tag to say which it
  // was — ten identical tags, and the reader still had to skim past two levels to find
  // the one they wanted. A segment picks the level, so the list holds one kind of thing
  // and the row no longer has to explain itself.
  //
  // Built from the store's own `accountTypes` (one source for the four levels), minus
  // BRANDS: a brand is the same tenancy as an organization, and the organization link
  // one step up the chain already names it — offering both would be the same thing
  // twice under two words. The synthetic "No organization" root is not a level at all.
  //
  // Ordered by how often it is the answer, not by the hierarchy: you switch to a client
  // constantly, to a reseller almost never.
  const SEGMENT_ORDER = ['clients', 'groups', 'resellers']

  const typeSegments = SEGMENT_ORDER.map((value) => {
    const type = accountTypes.find((entry) => entry.value === value)
    return { label: type.label, value: type.singular }
  })

  const DEFAULT_SEGMENT = typeSegments[0].value
  const segmentValues = typeSegments.map((segment) => segment.value)

  // A level the segments offer, or the first one — so a current account that is a brand
  // (reachable from Manage Resources) does not leave the panel on an empty segment.
  const segmentFor = (type) => (segmentValues.includes(type) ? type : DEFAULT_SEGMENT)

  const typeFilter = ref(DEFAULT_SEGMENT)

  // Every account the operator can act as — what the search field's threshold and the
  // segments are measured against, before the segment narrows it.
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

  // Both surfaces are controlled: picking a row — or handing off to a drawer —
  // closes the panel instead of leaving it hanging over the page.
  const open = ref(false)
  const query = ref('')
  const changePlanOpen = ref(false)

  // Measured on ALL the accounts, not on the current segment: a field that appears when
  // you pick Clients and vanishes when you pick Resellers moves the list under the
  // reader's cursor to say something they did not ask about.
  const searchable = computed(
    () => (isAccount.value ? switchableAccounts.value : roster.value).length > SEARCH_THRESHOLD
  )

  // WHAT A TERM MATCHES: the name, plus whatever else identifies the row. An operator
  // who remembers "the enterprise one" finds the organization without remembering what
  // it was called; an account matches on both identifiers, because a support thread
  // usually carries the id and not the name. Type is deliberately NOT in here for
  // accounts — the segment above owns that, and matching it as text would answer
  // "reseller" with an empty list while the Clients segment is selected.
  const haystack = (item) => {
    if (isOrganization.value) return `${item.name} ${item.plan}`
    if (isAccount.value) return `${item.name} ${item.id} ${item.clientId}`
    return item.name
  }

  // Every panel shows its whole roster and filters it in place — one list, one rule.
  // The account panel used to be the exception (a short recent list, with the full
  // roster only behind the search field) because the complete list lived in a drawer one
  // row below; with that drawer gone the exception has nothing left to justify it, and
  // the reader sees everything they can switch to.
  //
  // Ordered by RECENTS (../../lib/state/recents.js): where you are, then where you have
  // been, then the roster's own order. Ordering last, after the filter, so a search
  // result set is ordered the same way the full list is — the row you last used is the
  // first row whether you scrolled to it or typed for it.
  const rows = computed(() => {
    const term = query.value.trim().toLowerCase()
    const matched = term
      ? roster.value.filter((item) => haystack(item).toLowerCase().includes(term))
      : roster.value
    return orderByRecents(props.kind, matched, currentId.value)
  })

  // TWO FACTS PER ROW, always in the same two places: one tag beside the name that
  // says what KIND of thing this is, one on the trailing edge that says how much is
  // in it. Right-aligning the second gives the panel a column the eye can run down.
  const nameTag = (item) => {
    // The tier in the tier's OWN colour (../../lib/data/plans.js) — the same tag the
    // entrance's plan step shows, the upgrade drawer sells and the account menu
    // carries on the profile. A neutral tag here would make the one fact this row
    // shares with the rest of the console the one place it looks different.
    if (isOrganization.value) return { label: item.plan, severity: planSeverityFor(item.plan) }
    // No type tag on an account row any more: the segment above the list states the
    // level, so the tag repeated the same word on every visible row.
    return null
  }

  // `secondary` is the neutral tag, so the number never competes with the tag beside
  // the name; `tabular-nums` keeps the column from jittering between rows.
  const trailingTag = (item) => {
    if (isOrganization.value) return { label: accountCountOf(item) }
    // One number, not the "ID 6528 · Client ID 9757a" second line this row used to
    // carry: two identifiers nobody scans doubled every row's height. The client id
    // stays where it is actually used — the Switch account drawer and Account Settings.
    if (isAccount.value) return { label: String(item.id) }
    return { label: `${item.workloads} workloads` }
  }

  // Opening clears the last visit's term and puts the caret in the filter field when
  // the roster is long enough to have one (the panel is a fresh mount, so the input
  // only exists after the next tick), so a panel always opens on its complete list.
  //
  // It no longer has to scroll to the row you are on: recents ordering puts that row
  // first, so it is already the top of the list. (It used to scroll, because the account
  // list is the hierarchy in ownership order and the account you operate sat below the
  // fold.)
  const panelRef = ref(null)
  watch(open, (isOpen) => {
    if (!isOpen) return
    query.value = ''
    // Open on the level you are actually in, so the ticked row is in the list you are
    // looking at rather than one segment away.
    if (isAccount.value) typeFilter.value = segmentFor(currentAccount.value?.type)
    nextTick(() => panelRef.value?.querySelector('input')?.focus())
  })

  // Switching is owned by the store, and every store's switch is idempotent:
  // re-picking what you are already in is a no-op the panel acknowledges instead of
  // silently dismissing.
  const select = (item) => {
    open.value = false
    // BOTH ENDS OF THE MOVE go into the trail: the place being left is the one you are
    // most likely to want back (an operator comparing two accounts bounces between
    // exactly those two), so it lands right behind the one being chosen. Without this
    // the account you just came from — including the one the session booted into — fell
    // back to its roster position, which is the opposite of recent.
    //
    // Written on the CLICK, not on the store's answer: re-picking where you already are
    // is a no-op for the store, but it is still the most recent thing you chose.
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

  // The create flow is a focused page, so the panel closes behind it. The email
  // rides along, like every other navigation out of the console shell.
  const openCreateFlow = () =>
    router.push({
      path: '/organizations/new',
      query: { email: route.query.email || 'myemail@azion.com' }
    })

  // THE FOOTER GOES WHERE THE PANEL CANNOT.
  //
  // Organization: a SECOND organization is a paid feature. Hobby is one — the one
  // you were given at signup — so the row is still offered and still answers, but
  // what it opens is the plan comparison (../billing/ChangePlanDrawer.vue) with the
  // sentence that says which action asked for it. Hiding or disabling the row would
  // leave the reader to work out WHY on their own, which is the version of this
  // moment that loses the customer: a refusal that names the contract and shows the
  // way past it is a sale, and a greyed-out row is a dead end.
  //
  // Workspace: nowhere to go yet — creating a workspace is its own flow (name,
  // region, starting workloads) and is not built. It acknowledges the way every
  // other not-in-the-demo entry does, and becomes a route the day that flow lands.
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

  // Paid: pick up exactly where the reader was stopped.
  const onPlanUpgraded = () => openCreateFlow()
</script>

<template>
  <!-- ONE OPTICAL CENTRE FOR THE WHOLE CHAIN.
       `flex!` on the Popover, and a flex wrapper around it, are what make the pill
       sit on the row's centre line. The DS Popover root is `inline-block`, so its
       trigger is an INLINE box: the browser gives it a line box sized by the font's
       strut and drops the pill onto that line's baseline, leaving the descender gap
       BELOW it — a 31px box holding a 28px pill, with the pill pinned to the top. In
       a header region that centres its children, that lands this link 1.5px above
       the Azion mark and the switchers beside it — measured, and visible.
       Whether it happens at all depends on the mark inside the pill (a text avatar
       and an svg avatar sit on different baselines), which is exactly why it must
       not be left to chance on any of the three. Flex has no baseline to fall off:
       the pill is a flex item, the box is 28, the centre is the centre.
       Important, because `flex` and `inline-block` are the same property and the
       winner is CSS source order, not the order they are written. -->
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
          <!-- THE PILL IS 28 TALL AND ITS MARK IS 24 (Figma 6037:55164: pill 108×28,
               avatar 24×24 at y=2, 4px of horizontal padding, 6px gaps). So the height
               is stated on the pill — `h-7`, padding on the x axis only — and the mark
               is the DS Avatar's own `small`, with no size override left to maintain.
               The marble matches it at 24 (OrgAvatar's `medium`): with the account and
               workspace marks now 24, a 20px marble read as a smaller link in a row of
               equals — and the whole point of the chain is that it is one control. It is
               the same 24 the switcher's own rows use, so the mark you click in the
               header is the mark you see in the list. -->
          <OrgAvatar
            v-if="isOrganization"
            :name="current?.name"
            :accent="current?.accent"
            size="medium"
          />
          <!-- The customer's own logo, or its initials when we don't have one. -->
          <AccountMark
            v-else-if="isAccount"
            :name="current?.name"
            size="medium"
          />
          <!-- Icon mode: no `label`, so the DS Avatar renders its `icon` at the root's
               own 12px, in `--text-default` over `--bg-surface-raised`. The border is
               the one thing the DS gives a lettered avatar and not an icon one, and the
               design has it on both — so it comes from here until the DS catches up, at
               the design's hairline `--border-width-default` (0.8px) rather than the
               1px the DS hard-codes for the lettered variant. -->
          <Avatar
            v-else
            :icon="config.icon"
            size="small"
            kind="square"
            class="border-(length:--border-width-default) border-(--border-default)"
          />
          <!-- The label token's own weight — all three links carry it, none is
               emphasised over the others. The chain is one line of chrome, and
               weighting one of its names heavier makes that name read as a heading
               over the page below it. What distinguishes the links is their marks.
               `truncate` earns its keep now that the pill is capped at `max-w-60` (the
               design's 240px): a long customer name has something to be clipped
               against. Without the cap it was inert — the DS Popover.Trigger is
               `w-fit shrink-0`, so the pill could never be compressed and the ellipsis
               could never fire. -->
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
          <!-- THE PANEL'S OWN FILTERS, in one bordered band above the list it narrows:
               the field (not the page search, and only past SEARCH_THRESHOLD rows), then
               the level segments on the account panel. Both stay put while the list
               scrolls under them — a filter that scrolls out of reach is a filter you
               have to hunt for to undo. -->
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

            <!-- Which level the list holds. It replaces the "Accounts" heading below
                 rather than sitting under it: the selected segment already names the
                 list, so a heading over it would say the same thing twice. -->
            <SegmentedButton
              v-if="isAccount"
              v-model="typeFilter"
              :options="typeSegments"
              aria-label="Account level"
            />
          </div>

          <!-- The list. Capped so a long roster scrolls inside the panel instead of
               growing it past the viewport. -->
          <div class="flex max-h-[16rem] flex-col overflow-y-auto p-(--spacing-xxs)">
            <p
              v-if="!isAccount"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
            >
              {{ config.heading }}
            </p>

            <!-- One line per row, a 24px mark, and the row's number as a Tag on the
                 trailing edge. A mark taller than the name it belongs to makes a menu
                 read as a list of cards. -->
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
              <!-- Same mark in the list as in the pill, so the thing you click is the
                   thing you were looking at. -->
              <AccountMark
                v-else-if="isAccount"
                :name="item.name"
                size="medium"
              />
              <!-- A workspace has no identity of its own to show — its name IS the
                   identity — so every row carries the level's glyph, the same one the
                   pill above wears. Initials here were two letters of the name already
                   spelled out beside them. -->
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
                <!-- The tick sits with the NAME, not at the row's end: it says which
                     entry you are in, and the number at the far edge is a different
                     fact about a different entry on every row.
                     It is `aria-hidden`, so the same fact reaches assistive tech
                     through the row's own `aria-current` — which is also what the
                     panel scrolls to on open. -->
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

          <!-- The action that goes beyond what the panel can show, over the line that
               separates it from the list above — when there is one. The account panel
               has none: its list is already everything it could open. -->
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

    <!-- It teleports to the body, so it survives the popover closing behind it and
         opens the same way from any header width. -->
    <ChangePlanDrawer
      v-if="isOrganization"
      v-model:open="changePlanOpen"
      title="Need more organizations?"
      @upgraded="onPlanUpgraded"
    />
  </div>
</template>

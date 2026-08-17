<script setup>
  // Home — Overview for an account that OWNS things: account usage down the left, what
  // it owns on the right. The app shell (sidebar + GlobalHeader with the breadcrumb)
  // comes from AppLayout; this page renders only its content.
  //
  // It is one half of /home. The other is the first access (HomeEmptyState.vue), and
  // which one the URL resolves to is the sample's VERSION — empty account or populated
  // (../lib/sample-mode.js, dispatched by Overview.vue). So everything here can assume
  // the account has resources.
  //
  // ── WHY THE RIGHT COLUMN IS NOT A TABLE ANY MORE ──
  //
  // It was a tab row (one tab per resource type) over a table of the selected type.
  // Two things were wrong with that, and both come from the same place — a table's
  // columns have to be the same for every row:
  //
  //   THE READER HAD TO PICK A TYPE BEFORE SEEING ANYTHING. "What do I have" and
  //     "what was I just working on" are not questions about one type, and a tab row
  //     answers neither until you have already answered them yourself.
  //   THE COLUMNS FLATTENED THE TYPES. Applications are identified by a domain,
  //     functions by a runtime, workloads by a domain and a status. Held in one table
  //     those become "the fields all three happen to share", which is exactly the
  //     information a summary should not be dropping.
  //
  // So the column is now RESOURCES: a segmented control over the types, a search that
  // spans all of them, and a CARD LIST. A card carries each type's own second line, so
  // one list holds applications, workloads and functions without flattening any of
  // them, and the search finds a name without knowing which type owns it.
  //
  // The list itself is normalized in ../lib/home-resources.js, from the SAME fixtures
  // the module lists read — so a name here is the name over there.
  //
  // ── WHY RECENTS IS NO LONGER ITS OWN BLOCK ──
  //
  // It was a card of its own above the list, and it held the four most recently
  // touched resources. But the list underneath it is sorted newest first, so those
  // four rows WERE the top of that list — the same resources, twice, in two different
  // shapes, one of which the filter and the search did not reach.
  //
  // Recents is not a different set. It is the HEAD of this one. So it is a labelled
  // group at the top of the same list now: `Recent`, then `Older`. The reader still
  // gets "where was I" first and "what do I have" below it, out of one list that the
  // type control and the search both narrow — and a resource appears exactly once.
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useAgentOnboarding } from '@shared/lib/agent-onboarding'
  import ContrastBanner from '@shared/ui/ContrastBanner.vue'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import HomeWire from '../../components/home/HomeWire.vue'
  import IconFrame from '../../components/home/IconFrame.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import { useGreeting } from '../../lib/data/greeting'
  import {
    allResources,
    matchesSearch,
    recentResources,
    RESOURCE_TYPES
  } from '../../lib/data/home-resources'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { relativeTime } from '../../lib/format/relative-time'
  import { useTenancyReload } from '../../lib/state/tenancy-reload'

  // Account-level usage. `value` + `unit` is the reading; `percent` drives the
  // small progress bar showing how much of the plan allowance is consumed.
  const metrics = [
    {
      label: 'Data Transferred',
      value: '842',
      unit: 'GB',
      percent: 62,
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests / Second',
      value: '1,240',
      unit: '/s',
      percent: 41,
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      // GB, not MB: it is a share of what was transferred above, and two different
      // magnitudes for the same traffic read as two unrelated numbers.
      label: 'Bandwidth Saving',
      value: '588',
      unit: 'GB',
      percent: 70,
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data Offload',
      value: '70',
      unit: '%',
      percent: 70,
      hint: 'Share of traffic offloaded from your origin to the edge.'
    }
  ]

  // ── What the account owns, as ONE list ────────────────────────────────────
  // Normalized from the three seeded fixtures (../lib/home-resources.js) and sorted
  // newest first, which is what lets the head of it be `Recent` without holding a
  // second collection. `ref` on a plain array — a card action removes from it, and
  // everything below re-derives.
  const rows = ref(allResources())

  // ── The Resources band ────────────────────────────────────────────────────
  // `All` leads, and it is the default: the summary's first job is to show what is
  // there, not to make the reader choose a type before anything appears.
  //
  // NO COUNT ON THE CONTROL. The old tab row carried one per type, which was its best
  // feature — but a segmented control renders a label and nothing else, and a number
  // folded INTO the label makes the control's width move as the data does. The count
  // that matters here is the one for what is on screen right now, narrowed by both the
  // type and the search, so it sits beside the heading instead — one number that is
  // always about what the reader is looking at.
  const typeFilters = computed(() => [
    { value: 'all', label: 'All' },
    ...RESOURCE_TYPES.map((type) => ({ value: type.value, label: type.label }))
  ])

  const selectedType = ref('all')
  const search = ref('')

  const typeLabel = computed(
    () => typeFilters.value.find((type) => type.value === selectedType.value)?.label ?? 'All'
  )

  const visibleResources = computed(() =>
    rows.value.filter(
      (row) =>
        (selectedType.value === 'all' || row.type === selectedType.value) &&
        matchesSearch(row, search.value)
    )
  )

  // Two different empties, because they need two different answers: a search that
  // matched nothing is told so; a type with nothing in it is offered the way to make
  // one. Nothing here can be BOTH, because `All` on a populated account always has
  // rows.
  const narrowed = computed(() => Boolean(search.value.trim()))

  // ── RECENT, then OLDER ────────────────────────────────────────────────────
  // The head of the visible list, labelled. Six and not four: the group is a slice of
  // the same grid now, and six divides every column count the grid runs at (1, 2, 3),
  // so the label lands on a full row instead of leaving one card stranded beside a
  // gap. Six rows is still a trail — past that it stops being "where was I".
  const RECENT_COUNT = 6

  // A SEARCH IS NOT A LIST WITH A HEAD. Typing produces matches ranked by nothing but
  // the query, so calling the first six of them "Recent" would be labelling an
  // accident. A search returns one flat list; the type control keeps the grouping,
  // because the newest six APPLICATIONS is the same honest answer as the newest six of
  // everything. The grouping also drops when the list is too short to have a tail.
  const grouped = computed(() => !narrowed.value && visibleResources.value.length > RECENT_COUNT)

  // ONE grid, groups included: a label is a `col-span-full` item in the same grid the
  // cards live in, not a second grid. Two grids would have to agree on their column
  // counts at three breakpoints forever, and would break the card rhythm at the seam.
  const listItems = computed(() => {
    const asCard = (resource) => ({ key: `${resource.type}-${resource.id}`, resource })
    if (!grouped.value) return visibleResources.value.map(asCard)
    return [
      { key: 'group-recent', label: 'Recent' },
      ...recentResources(visibleResources.value, RECENT_COUNT).map(asCard),
      { key: 'group-older', label: 'Older', spaced: true },
      ...visibleResources.value.slice(RECENT_COUNT).map(asCard)
    ]
  })

  // Switching organization, account or workspace reloads Home: usage is metered for
  // the scope in force and the resources below are that scope's, so both go to
  // skeletons and come back re-read (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // THE COLD ARRIVAL. Overview is the console's landing page and nothing on it is
  // held: account usage is metered per scope and the resource list is a query. So
  // the page opens as its own WIRE (./ui/HomeWire.vue) and settles once, which is a
  // different window from the tenancy re-read below and deliberately handled
  // differently — arriving there is no page yet to leave standing, whereas a scope
  // switch has a page on screen whose readings are merely stale, so that one keeps
  // the page and swaps only its numbers for skeletons.
  //
  // Long enough to read as a fetch, short enough that nobody waits for it. Shorter
  // than the tenancy reload's 900ms on purpose: this window lands on a first paint,
  // where the shell's own entrance is still arriving underneath it.
  const LOAD_MS = 620
  const arriving = ref(true)
  let arrivalTimer
  onMounted(() => {
    arrivalTimer = setTimeout(() => {
      arriving.value = false
    }, LOAD_MS)
  })
  onUnmounted(() => clearTimeout(arrivalTimer))

  // The agent pill, and whether the reader has already sent it away. The flag is
  // shared and persisted (../lib/agent-onboarding.js) — one answer for the whole
  // onboarding, not one per screen.
  const { agentOnboardingVisible, dismissAgentOnboarding } = useAgentOnboarding()

  // The greeting. Five time bands, re-read on the hour so a tab left open overnight
  // does not still say "Good morning" (../lib/greeting.js), and the name comes from
  // the address every route in the console already carries, falling back to the seeded
  // account's owner when that address is the sample's placeholder.
  //
  // The label and the name are read SEPARATELY because the heading renders them in two
  // colours: "Good morning," is muted and the name is at full contrast, so the line has
  // a subject the eye lands on. As one uniform string the whole thing reads as chrome —
  // which is what it was: a heading the size of a heading, saying nothing to anybody.
  const route = useRoute()
  const { greeting, nameFor } = useGreeting()
  const userName = computed(() => nameFor(route.query.email))

  // Say what dismissing DID. The pill is gone by the time this is read, so the toast
  // names the thing that left and where the prompt still lives — a dismissal with no
  // way back reads as a control that broke something.
  const onAgentOnboardingClose = () => {
    dismissAgentOnboarding()
    toast.info('Agent onboarding removed.', {
      description: 'The setup prompt stays available from the docs.'
    })
  }

  // A card on Overview goes where the same row goes in its own module — the detail
  // page. Overview is a way INTO the console, so a card that only highlighted would be
  // a dead end; a resource whose detail view this prototype does not have carries a
  // null `path` and simply does not navigate.
  const router = useRouter()

  const openResource = (resource) => {
    if (resource.path) router.push(resource.path)
  }

  // Colored Tag for a resource that is serving — Applications say "Active", Workloads
  // say "Live" — and neutral for everything else.
  const statusSeverity = (value) =>
    value === 'Active' || value === 'Live' ? 'success' : 'secondary'

  // Deleting from Overview removes the SAME resource its module list owns, so it asks
  // the same way: the menu click arms the dialog, and the card goes only once its name
  // has been typed back.
  const pendingDelete = ref(null)
  const deleteOpen = ref(false)

  const confirmDelete = () => {
    const target = pendingDelete.value
    if (!target) return
    rows.value = rows.value.filter((item) => item.id !== target.id)
    toast.success(`${target.name} deleted.`)
    pendingDelete.value = null
  }

  // Card action menu — Dropdown emits (event, value); routed per card.
  const onCardAction = (event, value, resource) => {
    if (value === 'delete') {
      pendingDelete.value = resource
      deleteOpen.value = true
      return
    }
    if (value === 'view') return openResource(resource)
    toast.info(`Editing ${resource.name}`, {
      description: `${resource.typeLabel} · ${resource.id}`
    })
  }
</script>

<template>
  <!-- No AppLayout here: the shell is owned by Overview.vue, which holds it ACROSS
       the version swap. When each version rendered its own, flipping the sample's
       version unmounted the sidebar and the header and replayed the route
       transition — measured, the nav, the header and the content zone were all
       replaced and `pageEnter` ran again — so a change of what the page shows read
       as a reload of an app that never reloaded. -->
  <!-- FULL BLEED — no column class at all. Full-bleed in this system is the
         ABSENCE of `.layout-column*`, not a `w-full` (packages/theme/src/tokens/
         semantic/layouts.data.js), so the page takes the scroll box's own
         boundary and nothing else.
         Overview is the one page that earns it: it is a summary of the whole
         account, two side-by-side blocks whose value is how much of each is
         visible at once. Held at the focused measure (1024px) inside a 1428px
         scroll box, it wasted a third of the viewport to a void while the
         resource cards below truncated their own second line.
         The measure is what capped the row, so dropping it is also what
         rebalances the columns: the usage rail is a FIXED 348px and the
         resources column takes every pixel the measure used to throw away —
         1:1.7 before, 1:3 after (measured at 1728px). -->
  <!-- ── ONLY THE RESOURCES COLUMN SCROLLS (from `xl`) ──
         The page is a FRAME from `xl` up: the greeting, the usage rail, and the
         Resources header with its type control and its search all hold still,
         and the card list under them is the only thing that moves. What the
         reader narrows with therefore cannot scroll away from what it narrows —
         the old page scrolled the whole column, so the search field and the
         segmented control left the viewport as soon as the reader started
         reading results, which is exactly when they are next needed.
         `h-full`, not `h-dvh`: the shell's content zone is already a
         definite-height flex child (./ui/AppLayout.vue), and a percentage
         height resolves against its CONTENT box — so the page fills the zone
         exactly and its `layout-boundary` padding stays outside the frame
         instead of pushing a viewport-sized child into overflow.
         Below `xl` the columns are stacked, there is no frame to fill, and the
         page scrolls as one — a one-column phone layout with an inner scroll
         region traps the reader in a box inside a box. -->
  <div class="flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start">
    <!-- THE COLD ARRIVAL: the page's own wire, in the page's own column.
           Everything below is read rather than held — usage is metered per
           tenancy scope, the resource list is a query — so Overview opens as its
           own shape in placeholder fill and settles once the read lands. The wire
           is the same component the session teardown draws for this route family
           (./ui/HomeWire.vue), so the layout the reader sees for that beat is
           exactly the layout that resolves: nothing shifts on arrival.

           A wire and not in-place skeletons, for THIS window only: on a cold
           arrival there is no page yet to leave standing. A tenancy switch is the
           other case — the page is already there and only its readings are stale,
           so that window keeps the numbers' own skeletons (bound to
           `tenancyReloading` below) instead of tearing the page down. -->
    <HomeWire v-if="arriving" />

    <template v-else>
      <!-- THE OPENING ROW: who is here, and the one offer the page makes them.
           The greeting is the only line on Overview addressed to the PERSON rather
           than to their infrastructure, and it is what gives the agent pill a place
           to sit that is not a band of its own. The pill was centred on its own row
           above the columns; once it became dismissible that row had to disappear
           with it, and a row that exists only sometimes is a page that jumps. Here
           the greeting holds the row and the pill rides its right edge — dismissing
           it takes the pill out and moves nothing else.
           They stack below `md`, greeting first: the greeting is the heading, and a
           heading does not go second. -->
      <header
        class="flex flex-col gap-[var(--spacing-md)] md:flex-row md:items-center md:justify-between md:gap-[var(--spacing-lg)]"
      >
        <h1 class="text-heading-sm text-[var(--text-muted)]">
          {{ greeting }},
          <span class="text-[var(--text-default)]">{{ userName }}</span>
        </h1>

        <!-- `closable` removes the pill from the LAYOUT (it unmounts — no reserved
             band, nothing left tabbable), and the answer is persisted in
             lib/agent-onboarding.js so it survives the reload and the first-access
             surface that offers the same thing. -->
        <ContrastBanner
          v-if="agentOnboardingVisible"
          closable
          class="md:shrink-0"
          @close="onAgentOnboardingClose"
        />
      </header>

      <!-- Two columns that terminate at the same y. No `items-start`: the row
           keeps `align-items: stretch`, so its height is max(aside, section) and
           both columns stretch to it. Each column then needs one internal grow
           target (the metric grid; the resources CardBox) or the slack would
           pile up below the cards. `grow`, never `flex-1` — a zero flex-basis
           makes a column's intrinsic height contribution ill-defined, and that
           contribution is exactly what the row height derives from. -->
      <!--
        THE ENTRANCE. Replacing the wire MOUNTS these two columns, so each one
        rises into place as it arrives (`animate-content-enter`, src/styles/motion.css) —
        usage first, resources one beat behind it, so the page assembles in
        reading order instead of popping as one slab. Simultaneous arrival reads
        as a swap; a stagger reads as choreography (the same reasoning as the
        signed-out screens' entrance, ../lib/auth-entrance.js).

        It rises rather than travelling sideways: the page itself already arrived
        from the left a beat ago (the route transition), and only what is inside
        it changed now. The delay token is one fast-01 (70ms) — long enough to
        read as an order, short enough that the two still land together.
      -->
      <main
        class="layout-section-start flex flex-col gap-[var(--layout-boundary-start)] xl:min-h-0 xl:flex-1 xl:flex-row xl:gap-[var(--layout-section-gap)]"
      >
        <!-- Left (minor): account usage — one metric per card, its reading beside a
             small progress bar showing plan consumption. Below `xl` it spans the
             full width above the resources; from `xl` it becomes the narrow rail.
             THE RAIL IS A SHARE, THEN A CAP. It used to be a flat 348px from `lg`,
             which inverted the whole page in the 1024-1200 band: the row had 676px
             of content there, the rail took 348 of it, and the MAJOR column ended up
             at 264 — narrower than the minor one it is supposed to dominate. A fixed
             minor column only stays minor while the row is wide.
             So: side by side from `xl` (below it the rail goes full width and runs
             its metrics 2-up, which is a better read than a 200px card), sized at
             30% of the row, capped at `--container-xs`. The share keeps resources at
             roughly 2x the rail through the middle widths; the cap stops the rail
             from growing past a metric card's useful width, so everything a full
             bleed adds past ~1500px goes to resources — 1:2 at `xl`, 1:2.7 at
             1728px, 1:5 at 2560px. -->
        <!-- `xl:overflow-y-auto` is an escape hatch, not the design: the rail is
             four cards and a heading, so it fits the frame at every laptop
             height. It exists so a very short viewport degrades to a scrollable
             rail instead of a clipped one — the fourth metric silently cut off
             would be worse than a scrollbar that almost never appears. -->
        <aside
          class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-[var(--layout-group-gap)] xl:w-[30%] xl:max-w-[var(--container-xs)] xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain"
        >
          <!-- `--size-10`, matched by the Resources header opposite it: that one is
               38px tall because the segmented control in it is, and a 32px header
               here put the two column titles 3px out of line with each other across
               the widest gap on the page. Both headers reserve one row of 40px, so
               the titles sit on one line whatever controls ride along. -->
          <div class="flex min-h-[var(--size-10)] items-center px-[var(--spacing-xs)]">
            <h2 class="text-heading-xxs text-[var(--text-default)]">Usage</h2>
          </div>

          <!-- 2-up while the aside is full width; single column once it narrows into
               the desktop rail at `xl` — the same breakpoint the row splits at.

               `auto-rows-min`, and NO `grow`. The right column used to be one table
               sized to end level with this rail, so the rail stretched to meet it; it
               is now a recents card over a card list whose height is the account's,
               and stretching four metric cards to match that turns each of them into
               a mostly-empty panel. The rail is its own height and the row's extra
               space is simply below it. -->
          <div class="grid auto-rows-min grid-cols-2 gap-[var(--layout-group-gap)] xl:grid-cols-1">
            <CardBox
              v-for="metric in metrics"
              :key="metric.label"
              :padded="false"
            >
              <template #content>
                <div class="flex grow flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]">
                  <div class="flex items-center gap-[var(--spacing-xs)]">
                    <span class="min-w-0 truncate text-label-sm text-[var(--text-default)]">
                      {{ metric.label }}
                    </span>
                    <Tooltip :text="metric.hint">
                      <i
                        class="pi pi-info-circle text-body-sm text-[var(--text-muted)]"
                        aria-hidden="true"
                      />
                    </Tooltip>
                  </div>
                  <div class="flex items-baseline gap-[var(--spacing-xxs)]">
                    <!-- A reading from the scope we just left is worse than no
                         reading: while the switch reloads, the number is a
                         placeholder the size of the number it replaces. -->
                    <Skeleton
                      v-if="tenancyReloading"
                      width="4.5rem"
                      height="1.75rem"
                    />
                    <template v-else>
                      <span class="text-big-number-sm tabular-nums text-[var(--text-default)]">
                        {{ metric.value }}
                      </span>
                      <span
                        v-if="metric.unit"
                        class="text-body-xs text-[var(--text-muted)]"
                        >{{ metric.unit }}</span
                      >
                    </template>
                  </div>
                </div>
                <!-- Progress reads as a flush bar on the card's bottom edge — a
                     consumption "border" that costs no inline space. -->
                <ProgressBar
                  :value="tenancyReloading ? 0 : metric.percent"
                  :max="100"
                  size="small"
                  shape="flat"
                  class="w-full shrink-0"
                  :aria-label="`${metric.label} usage`"
                />
              </template>
            </CardBox>
          </div>
        </aside>

        <!-- Right (major): RESOURCES — `Recent` at the top of it, then `Older`.
             The entrance's follower — one fast-01 behind the usage column. -->
        <section
          class="animate-content-enter motion-reduce:animate-none flex w-full min-w-0 flex-col gap-[var(--layout-group-gap)] xl:min-h-0 xl:flex-1 [--content-enter-delay:var(--transition-duration-fast-01)]"
        >
          <!-- ── RESOURCES ──
               The type narrows, the search finds. They sit on the same row because
               they narrow the SAME list — the segmented control by kind, the field by
               name — and the cards below are the result of both.
               The header sits OUTSIDE the scroll region on purpose: it is what the
               reader operates the list with, and a control that leaves the viewport
               the moment its results are being read is a control you have to scroll
               back to find. `shrink-0` so the list, not the header, absorbs the
               frame's height. -->
          <header
            class="flex min-h-[var(--size-10)] shrink-0 flex-wrap items-center gap-[var(--spacing-sm)] px-[var(--spacing-xs)]"
          >
            <h2 class="shrink-0 text-heading-xxs text-[var(--text-default)]">Resources</h2>
            <!-- The one count, and it is about what is on screen: narrowed by the
                   type AND the search, so it never disagrees with the cards below. -->
            <span class="shrink-0 text-body-xs tabular-nums text-[var(--text-muted)]">
              {{ visibleResources.length }}
            </span>

            <SegmentedButton
              v-model="selectedType"
              :options="typeFilters"
              aria-label="Resource type"
              class="shrink-0"
            />

            <InputText
              v-model="search"
              size="medium"
              placeholder="Search resources"
              aria-label="Search resources"
              class="min-w-36 grow basis-[var(--container-2xs)]"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </InputText>
          </header>

          <!-- THE ONLY SCROLL REGION ON THE PAGE (from `xl`).
               `min-h-0` is what makes it one: a flex child's default `min-height:
               auto` refuses to shrink below its content, so the column would grow
               past the frame and hand the scroll back to the shell. `overscroll-contain`
               keeps a flick at the end of the list from scrolling the app behind it.
               The bottom padding is the list's own: a card flush against the frame's
               edge reads as a list that was cut, not one that ended. -->
          <div
            class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain xl:pb-[var(--spacing-md)]"
          >
            <!-- Reading the new scope: the cards are that scope's, and a card carried
                 over from the one we just left is worse than no card. -->
            <div
              v-if="tenancyReloading"
              class="grid grid-cols-1 gap-[var(--layout-group-gap)] lg:grid-cols-2 2xl:grid-cols-3"
            >
              <Skeleton
                v-for="index in 6"
                :key="index"
                kind="shape"
                height="6.5rem"
              />
            </div>

            <!-- THE CARD LIST. Two up from `lg` — where the block is still full width,
                 because the row has not split yet — and one up below that.
                 THREE up at `2xl`, which only exists because the page went full
                 bleed — the resources column gained ~360px there. Spent on wider
                 cards it would have bought nothing (a card is a name, a
                 domain-or-runtime and a status; it stops filling its row well before
                 that), so it is spent on a third column instead: 50% more resources
                 on screen, at a card width that stays inside the same ~230-320px band
                 the two-up already ran at. How much of the account is visible at once
                 is the block's whole job.
                 THE GROUP LABELS ARE ITEMS OF THIS GRID (`col-span-full`), not a
                 second grid around a second v-for: one grid means one set of column
                 rules and one card rhythm across the seam, and the card markup is
                 written once. -->
            <div
              v-else-if="visibleResources.length"
              class="grid grid-cols-1 gap-[var(--layout-group-gap)] lg:grid-cols-2 2xl:grid-cols-3"
            >
              <template
                v-for="item in listItems"
                :key="item.key"
              >
                <h3
                  v-if="item.label"
                  class="col-span-full px-[var(--spacing-xs)] text-label-sm text-[var(--text-muted)]"
                  :class="item.spaced ? 'mt-[var(--spacing-md)]' : ''"
                >
                  {{ item.label }}
                </h3>

                <CardBox
                  v-else
                  :padded="false"
                >
                  <template #content>
                    <div
                      class="flex min-w-0 flex-col gap-[var(--spacing-sm)] p-[var(--spacing-md)]"
                    >
                      <div class="flex min-w-0 items-start gap-[var(--spacing-sm)]">
                        <IconFrame
                          :icon="
                            item.resource.preset
                              ? `ai-cor ${presetIcon(item.resource.preset)}`
                              : item.resource.icon
                          "
                          :title="
                            item.resource.preset
                              ? presetLabel(item.resource.preset)
                              : item.resource.typeLabel
                          "
                        />

                        <div class="flex min-w-0 flex-1 flex-col gap-[var(--spacing-xxs)]">
                          <button
                            type="button"
                            class="cursor-pointer truncate rounded-[var(--shape-button)] text-left text-label-md text-[var(--text-default)] outline-none hover:underline focus-visible:ring-2 focus-visible:ring-[var(--ring-color)]"
                            @click="openResource(item.resource)"
                          >
                            {{ item.resource.name }}
                          </button>
                          <!-- THE CARD'S REASON FOR EXISTING: each type's own second
                               line — a domain, a runtime and an instance count — which
                               a shared column set could not have carried. -->
                          <p class="min-w-0 truncate text-body-xs text-[var(--text-muted)]">
                            {{ item.resource.subtitle }}
                          </p>
                        </div>

                        <Dropdown
                          placement="bottom-end"
                          @select="(event, value) => onCardAction(event, value, item.resource)"
                        >
                          <Dropdown.Trigger>
                            <Tooltip text="Resource actions">
                              <IconButton
                                icon="pi pi-ellipsis-h"
                                kind="outlined"
                                size="small"
                                :aria-label="`Actions for ${item.resource.name}`"
                              />
                            </Tooltip>
                          </Dropdown.Trigger>

                          <Dropdown.Group>
                            <Dropdown.Option
                              value="view"
                              label="View details"
                            />
                            <Dropdown.Option
                              value="edit"
                              label="Edit"
                            />
                          </Dropdown.Group>

                          <Dropdown.Group>
                            <Dropdown.Option
                              value="delete"
                              label="Delete"
                            >
                              <template #left>
                                <i
                                  class="pi pi-trash"
                                  aria-hidden="true"
                                />
                              </template>
                            </Dropdown.Option>
                          </Dropdown.Group>
                        </Dropdown>
                      </div>

                      <div class="flex items-center gap-[var(--spacing-xs)]">
                        <Tag
                          :label="item.resource.status"
                          :severity="statusSeverity(item.resource.status)"
                          size="medium"
                        />
                        <span class="text-body-xs text-[var(--text-muted)]">
                          {{ item.resource.typeLabel }} · edited
                          {{ relativeTime(item.resource.modifiedAt) }}
                        </span>
                      </div>
                    </div>
                  </template>
                </CardBox>
              </template>
            </div>

            <!-- Nothing matched. A search that found nothing is told so and nothing
                 else; a TYPE with nothing in it is offered the way to make one. -->
            <CardBox
              v-else
              :padded="false"
            >
              <template #content>
                <EmptyState
                  v-if="narrowed"
                  key="resources-no-match"
                  size="medium"
                  icon="pi pi-search"
                  title="No resources match your search"
                  :description="`Nothing named &quot;${search}&quot; in ${selectedType === 'all' ? 'this account' : typeLabel}.`"
                />
                <EmptyState
                  v-else
                  key="resources-none"
                  size="medium"
                  icon="pi pi-inbox"
                  :title="`No ${typeLabel.toLowerCase()} yet`"
                  description="Create one from the module in the navigation to see it here."
                />
              </template>
            </CardBox>
          </div>
        </section>

        <DeleteDialog
          v-model:open="deleteOpen"
          :kind="pendingDelete?.singular ?? 'resource'"
          :name="pendingDelete?.name ?? ''"
          @confirm="confirmDelete"
        />
      </main>
    </template>
  </div>
</template>

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
  // So the column is now RESOURCES: a segmented control over the types, and a LIST. A
  // row carries each type's own second line, so one list holds applications, workloads,
  // domains and functions without flattening any of them — and the page's own search,
  // a row above both columns, finds a name without knowing which type owns it.
  //
  // ── WHY A LIST AND NOT A CARD GRID ──
  //
  // It was a 1/2/3-up grid of CardBoxes. That fixed the flattening, but it made
  // Overview the one screen in the console that renders a collection its own way:
  // every other list of things — a module's rows, a repository picker, a settings
  // group — is `Item.List` inside a flush CardBox, so a reader who learns the row
  // here has to learn it again one click in. The row shape is the DS's, and the
  // second line the grid was built for is exactly what `Item.Description` is.
  //
  // The band also reads better as one column: a name, its domain-or-runtime and its
  // status line up down the list instead of restarting at three different x
  // positions per grid row, so "what do I have" is one scan rather than nine.
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
  // group at the top of the same list now: `Recents`, then `Older`. The reader still
  // gets "where was I" first and "what do I have" below it, out of one list that the
  // type control and the search both narrow — and a resource appears exactly once.
  import CardBox from '@aziontech/webkit/card-box'
  import Dropdown from '@aziontech/webkit/dropdown'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import ProgressBar from '@aziontech/webkit/progress-bar'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useAgentOnboarding } from '@shared/lib/agent-onboarding'
  import ContrastBanner from '@shared/ui/ContrastBanner.vue'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import HomeWire from '../../components/home/HomeWire.vue'
  import IconFrame from '../../components/home/IconFrame.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import { useTabEnter } from '../../lib/behavior/tab-enter'
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
  // newest first, which is what lets the head of it be `Recents` without holding a
  // second collection. `ref` on a plain array — a card action removes from it, and
  // everything below re-derives.
  const rows = ref(allResources())

  // ── The Resources band ────────────────────────────────────────────────────
  // `All` leads, and it is the default: the summary's first job is to show what is
  // there, not to make the reader choose a type before anything appears.
  //
  // NO COUNT, ANYWHERE IN THE BAND. The old tab row carried one per type, which was its
  // best feature — but a segmented control renders a label and nothing else, and a
  // number folded INTO the label makes the control's width move as the data does. It
  // moved beside the heading for a while; it is now gone, because a summary's list
  // ANSWERS "how many" by being read, and the number was the one thing on the header
  // row that changed as the reader typed — a moving digit beside a fixed title. What is
  // on screen is what there is.
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

  // ── RECENTS, then OLDER ───────────────────────────────────────────────────
  // The head of the visible list, labelled. Six: enough of a trail that "where was I"
  // is answered without scrolling the band, few enough that the `Older` seam still
  // lands on the first screen. (It was six because six divided the grid's 1/2/3
  // column counts and left no card stranded beside a gap; a list has no column
  // arithmetic, and six rows is a trail on its own terms.)
  const RECENT_COUNT = 6

  // A SEARCH IS NOT A LIST WITH A HEAD. Typing produces matches ranked by nothing but
  // the query, so calling the first six of them "Recents" would be labelling an
  // accident. A search returns one flat list; the type control keeps the grouping,
  // because the newest six APPLICATIONS is the same honest answer as the newest six of
  // everything. The grouping also drops when the list is too short to have a tail.
  const grouped = computed(() => !narrowed.value && visibleResources.value.length > RECENT_COUNT)

  // The band as BLOCKS, so the row markup is written once whether or not the list is
  // grouped: ungrouped is a single unlabelled block. A label sits ABOVE its own
  // `Item.List` rather than inside it — a list's children are its rows, and a heading
  // spliced between them is a `role="list"` with something in it that is not a
  // `listitem`. Each block is its own flush CardBox, which is also what makes the seam
  // legible: the dividers stop at the end of `Recents` instead of running through the
  // label.
  //
  // `recent` rides on the group, not on the row: it is what puts the history glyph on
  // the title (see the template), and being recent is a fact about the row's POSITION
  // in this list, not about the resource — the same resource is an `Older` row the
  // moment six newer ones exist.
  const listGroups = computed(() => {
    if (!grouped.value)
      return [{ key: 'all', label: '', recent: false, resources: visibleResources.value }]
    return [
      {
        key: 'recent',
        label: 'Recents',
        recent: true,
        resources: recentResources(visibleResources.value, RECENT_COUNT)
      },
      {
        key: 'older',
        label: 'Older',
        recent: false,
        resources: visibleResources.value.slice(RECENT_COUNT)
      }
    ]
  })

  // ── THE BAND'S EDGE FADE ──────────────────────────────────────────────────
  // The resource list is the only scroll region on the page (from `xl`), and it ended
  // at a hard line against the frame's edge — a row sliced mid-height, which reads as
  // a rendering fault rather than as "there is more". So the region dissolves into the
  // page at whichever edge has content past it, exactly as the framework catalog does
  // (components/marketplace/TemplateBrowser.vue — same 64px band, same formula; when a
  // third surface needs it, this is the pair to promote into a composable).
  //
  // Each edge fades only while there IS content past it: nothing at rest, a top band
  // once the first row has scrolled under the header, a bottom band that shrinks to
  // zero as the last row arrives. A fixed band would dim the first and last rows
  // permanently and pop off at the ends of the scroll; tracking the real scroll
  // distance lets the fade ease itself in and out as you move.
  const MAX_FADE = 64 // px — --spacing-xl at its widest step
  const scrollRef = ref(null)
  const fadeTop = ref(0)
  const fadeBottom = ref(0)

  // Held outside the ref so teardown still reaches the element after `v-if` has
  // dropped it (the band swaps to skeletons on a scope switch, and to an EmptyState
  // when a search matches nothing).
  let observedEl = null
  let scrollObserver = null

  const clampFade = (distance) => Math.max(0, Math.min(MAX_FADE, distance))

  const updateFade = () => {
    const el = scrollRef.value
    if (!el) {
      fadeTop.value = 0
      fadeBottom.value = 0
      return
    }
    fadeTop.value = clampFade(el.scrollTop)
    fadeBottom.value = clampFade(el.scrollHeight - el.clientHeight - el.scrollTop)
  }

  // No mask at rest: an always-on one costs a compositing layer and would leave the
  // first and last rows permanently half-lit. Below `xl` the region does not scroll at
  // all (the page does), so `scrollTop` stays 0 and the overflow is 0 — the mask is
  // never built there.
  const fadeStyle = computed(() => {
    if (!fadeTop.value && !fadeBottom.value) return undefined
    const mask = `linear-gradient(to bottom, transparent 0, #000 ${fadeTop.value}px, #000 calc(100% - ${fadeBottom.value}px), transparent 100%)`
    return { maskImage: mask, WebkitMaskImage: mask }
  })

  const unobserveScroll = () => {
    if (observedEl) observedEl.removeEventListener('scroll', updateFade)
    scrollObserver?.disconnect()
    observedEl = null
    scrollObserver = null
  }

  const observeScroll = () => {
    const el = scrollRef.value
    if (el && el === observedEl) {
      updateFade()
      return
    }
    unobserveScroll()
    if (!el) {
      updateFade()
      return
    }
    observedEl = el
    el.addEventListener('scroll', updateFade, { passive: true })
    // Catches the region resizing (the window, and the `xl` split). Content-height
    // changes come from the filters, which the watch below covers.
    scrollObserver = new ResizeObserver(updateFade)
    scrollObserver.observe(el)
    updateFade()
  }

  // Switching organization, account or workspace reloads Home: usage is metered for
  // the scope in force and the resources below are that scope's, so both go to
  // skeletons and come back re-read (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // Anything that changes what the band holds changes how far it scrolls: the type,
  // the search, a delete, and the skeleton/list swap on a scope switch.
  watch([listGroups, tenancyReloading], async () => {
    await nextTick()
    observeScroll()
  })

  // ── PICKING A TYPE ARRIVES LIKE A TAB ─────────────────────────────────────
  // The band's type control is a tab row in everything but name — each option replaces
  // the whole list under it — so it gets the console's tab entrance rather than a
  // bespoke one: `useTabEnter` replays `animate-page-enter` on the band's stable
  // wrapper and sends the scroll region back to the top, exactly as the application,
  // workload and function detail shells do for theirs
  // (../../lib/behavior/tab-enter.js). One definition, four shells, one feel.
  //
  // The scroller is passed explicitly: below `xl` the band does not scroll and the
  // wrapper's parent is not a scroll region, so the helper's default (the parent) would
  // reset the wrong element.
  const bandRef = ref(null)
  useTabEnter(bandRef, selectedType, scrollRef)

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
    arrivalTimer = setTimeout(async () => {
      arriving.value = false
      // The band does not exist until the wire is replaced, so the fade attaches to
      // the scroll region on the frame after that swap — not on mount.
      await nextTick()
      observeScroll()
    }, LOAD_MS)
  })
  onUnmounted(() => {
    clearTimeout(arrivalTimer)
    unobserveScroll()
  })

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

  // A row on Overview goes where the same row goes in its own module — the detail
  // page. Overview is a way INTO the console, so a row that only highlighted would be
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
  // the same way: the menu click arms the dialog, and the row goes only once its name
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

  // Row action menu — Dropdown emits (event, value); routed per row.
  const onRowAction = (event, value, resource) => {
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
  <!-- ── THE CONTAINER: DATA MEASURE, SELF-PADDED ──
         This div is the page's container, and it declares both halves of what a
         container is in this system (the catalog: Foundations/Layout, generated
         from packages/theme/src/tokens/semantic/layouts.data.js):
           THE MEASURE is `.layout-column` — the DATA measure, `--layout-measure`
             / 1620px. The populated Overview is a usage rail beside a scrolling
             list of every resource the account owns, which is what that measure
             is for ("lists and detail dashboards", and they want every pixel
             they can get because more rows and columns visible IS the point).
             It is NOT the focused measure (1024px) any more: that cap is for a
             single task, and it wasted a third of a 1428px content zone on a
             void while the resource rows inside it truncated their own second
             line. It is also not full bleed, which the page ran briefly and
             which has the opposite failure — past ~2000px the row actions end up
             a head-turn away from the name that identifies the row, and there is
             nothing on this page that a 2200px-wide list row tells you that a
             1620px one does not.
           THE BOUNDARY is `.layout-boundary`, carried HERE rather than inherited
             from the shell. Overview.vue passes `padded=false` to AppLayout for
             exactly this reason, so the inset is declared once, on the same block
             as the measure, in the file that owns the layout. This is the
             documented self-padded shape, and the cap grows by exactly the inset
             it now contains (`calc(measure + 2 * --layout-boundary-inline)`), so
             the CONTENT column is 1620px either way.
         Why the page owns the boundary: the page is a FRAME from `xl` (see
         below), and a frame has to know where its own edges are. With the inset
         on the shell's scroll box it sat OUTSIDE the frame — so the list scrolled
         to an edge the page could not see, the bottom inset was height the frame
         had already given away, and the one number that decides whether a card
         looks flush against the viewport lived in a different component. On the
         container, `box-sizing: border-box` puts the inset inside the same 100%
         height the frame measures.
         The measure no longer decides the column split: the usage rail is 30% of
         the row capped at 348px and the resources column takes the rest, so it
         reads 1:2 at `xl` and 1:2.7 once the row reaches the cap. -->
  <!-- ── ONLY THE RESOURCES COLUMN SCROLLS (from `xl`) ──
         The page is a FRAME from `xl` up: the greeting, the usage rail, and the
         Resources header with its type control and its search all hold still,
         and the list under them is the only thing that moves. What the
         reader narrows with therefore cannot scroll away from what it narrows —
         the old page scrolled the whole column, so the search field and the
         segmented control left the viewport as soon as the reader started
         reading results, which is exactly when they are next needed.
         `h-full`, not `h-dvh`: the shell's content zone is already a
         definite-height flex child (../../components/shell/AppLayout.vue), so
         100% resolves against it — and because the container's own boundary is
         inside that 100% (border-box), the frame and its inset are one box that
         fits the zone exactly instead of overflowing it by the inset.
         Below `xl` the columns are stacked, there is no frame to fill, and the
         page scrolls as one — a one-column phone layout with an inner scroll
         region traps the reader in a box inside a box. `min-h-full` is
         border-box too, so the boundary does not push a short page into a
         scroll of exactly its own padding. -->
  <div
    class="layout-column layout-boundary flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
  >
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
        class="flex flex-col gap-(--spacing-md) md:flex-row md:items-center md:justify-between md:gap-(--spacing-lg)"
      >
        <h1 class="text-heading-sm text-(--text-muted)">
          {{ greeting }},
          <span class="text-(--text-default)">{{ userName }}</span>
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

      <!-- ── THE SEARCH, AT PAGE LEVEL ──
           It spans the whole content width, above both columns, rather than riding
           the Resources header. Three reasons it belongs here:
           IT IS THE PAGE'S OPENING MOVE. A reader who arrives knowing the name of
             what they want should not have to find the field inside the band that
             happens to own it; at the top of the page it is the first thing after the
             greeting, which is where a search is looked for.
           IT NEVER COMPETES FOR THE HEADER'S ROW. In the band it shared a
             `flex-wrap` row with the heading, the count and the segmented control, so
             at narrow widths the field wrapped to its own line anyway and the header
             changed height as the viewport moved. The header now holds exactly two
             things that fit.
           IT IS OUTSIDE THE SCROLL REGION, still. That was the reason it sat above
             the list, and it holds a row higher just as well — the control never
             leaves the viewport while its results are being read.
           `size="large"` (40px) so it reads as the page's field and not as one of the
           band's controls.
           It lives INSIDE `<main>`, not between the greeting and it: content that sits
           in no landmark at all is an axe `region` violation (measured — one node), and
           a page-level search is main content, not a banner. -->

      <!-- Two columns that terminate at the same y. No `items-start`: the row
           keeps `align-items: stretch`, so its height is max(aside, section) and
           both columns stretch to it. Each column then needs one internal grow
           target (the metric grid; the resources CardBox) or the slack would
           pile up below the blocks. `grow`, never `flex-1` — a zero flex-basis
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
        class="layout-section-start flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
      >
        <!-- The page's search (see the note above): its own row, full content width,
             above both columns. `shrink-0` so the frame takes its height out of the
             list below and never out of this field. -->
        <div class="flex min-h-(--size-10) shrink-0 items-center">
          <InputText
            v-model="search"
            size="large"
            placeholder="Search resources"
            aria-label="Search resources"
            class="w-full"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>

        <div
          class="flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1 xl:flex-row xl:gap-(--layout-section-gap)"
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
            class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:w-[30%] xl:max-w-(--container-xs) xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain"
          >
            <!-- `--size-10`, matched by the Resources header opposite it: that one is
               38px tall because the segmented control in it is, and a 32px header
               here put the two column titles 3px out of line with each other across
               the widest gap on the page. Both headers reserve one row of 40px, so
               the titles sit on one line whatever controls ride along. -->
            <div class="flex min-h-(--size-10) items-center px-(--spacing-xs)">
              <h2 class="text-heading-xxs text-(--text-default)">Usage</h2>
            </div>

            <!-- 2-up while the aside is full width; single column once it narrows into
               the desktop rail at `xl` — the same breakpoint the row splits at.

               `auto-rows-min`, and NO `grow`. The right column used to be one table
               sized to end level with this rail, so the rail stretched to meet it; it
               is now a `Recents` block over an `Older` one whose height is the
               account's, and stretching four metric cards to match that turns each into
               a mostly-empty panel. The rail is its own height and the row's extra
               space is simply below it. -->
            <div
              class="grid auto-rows-min grid-cols-2 gap-(--layout-group-gap) xl:grid-cols-1"
            >
              <CardBox
                v-for="metric in metrics"
                :key="metric.label"
                :padded="false"
              >
                <template #content>
                  <div class="flex grow flex-col gap-(--spacing-sm) p-(--spacing-md)">
                    <div class="flex items-center gap-(--spacing-xs)">
                      <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                        {{ metric.label }}
                      </span>
                      <Tooltip :text="metric.hint">
                        <i
                          class="pi pi-info-circle text-body-sm text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </Tooltip>
                    </div>
                    <div class="flex items-baseline gap-(--spacing-xxs)">
                      <!-- A reading from the scope we just left is worse than no
                         reading: while the switch reloads, the number is a
                         placeholder the size of the number it replaces. -->
                      <Skeleton
                        v-if="tenancyReloading"
                        width="4.5rem"
                        height="1.75rem"
                      />
                      <template v-else>
                        <span class="text-big-number-sm tabular-nums text-(--text-default)">
                          {{ metric.value }}
                        </span>
                        <span
                          v-if="metric.unit"
                          class="text-body-xs text-(--text-muted)"
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

          <!-- Right (major): RESOURCES — `Recents` at the top of it, then `Older`.
             The entrance's follower — one fast-01 behind the usage column. -->
          <section
            class="animate-content-enter motion-reduce:animate-none flex w-full min-w-0 flex-col gap-(--layout-group-gap) xl:min-h-0 xl:flex-1 [--content-enter-delay:var(--transition-duration-fast-01)]"
          >
            <!-- ── RESOURCES ──
               The band's title, and the one control that belongs to the band: the
               segmented type filter, on the header's far edge. The search that used to
               share this row is now the page's own, a row above (see above) — the type
               narrows THIS list, so it stays with the list; the field searches by name
               across every type, so it reads as the page's.
               The header sits OUTSIDE the scroll region on purpose: it is what the
               reader operates the list with, and a control that leaves the viewport
               the moment its results are being read is a control you have to scroll
               back to find. `shrink-0` so the list, not the header, absorbs the
               frame's height.
               `min-h-(--size-10)` matches the Usage heading opposite it, so the two
               column titles sit on one line across the widest gap on the page even
               though only this one carries a 36px control. -->
            <header
              class="flex min-h-(--size-10) shrink-0 flex-wrap items-center justify-between gap-(--spacing-sm) pl-(--spacing-xs)"
            >
              <h2 class="shrink-0 text-heading-xxs text-(--text-default)">Resources</h2>

              <SegmentedButton
                v-model="selectedType"
                :options="typeFilters"
                aria-label="Resource type"
                class="shrink-0"
              />
            </header>

            <!-- THE ONLY SCROLL REGION ON THE PAGE (from `xl`).
               `min-h-0` is what makes it one: a flex child's default `min-height:
               auto` refuses to shrink below its content, so the column would grow
               past the frame and hand the scroll back to the shell. `overscroll-contain`
               keeps a flick at the end of the list from scrolling the app behind it.
               NO BOTTOM PADDING — THE FADE IS THE BOTTOM TREATMENT. The region used to
               end 16px short of the frame so a row would not sit flush against its edge;
               that inset was doing the fade's job badly, because at the end of the scroll
               (where the fade correctly goes to zero) it read as dead space under the
               last row, and everywhere else it just shortened the list. The band now runs
               the full height of the frame and the fade says "there is more" — that is
               what `fadeStyle`'s 64px band, the framework catalog's own, is for.
               The mask goes on the SCROLLER, not on the list inside it — masking the
               content would scroll the gradient along with the rows.
               ── ROOM FOR THE ENTRANCE TO TRAVEL ──
               The negative inline-start margin with the matching padding is what lets the
               band below SLIDE without being cut. A scroll container cannot have
               `overflow-x: visible` (one axis scrolling forces the other to compute away
               from `visible`), so anything that travels sideways inside this region is
               clipped at its edge — which is exactly what ate the card's left edge and
               rounded corner during `pageEnter`.
               So the region's BOX is pushed one travel-distance further into the column
               gutter and its content padded back by the same amount: the card rests
               precisely where it did before, and the leftward travel now lands ON the
               box's edge instead of past it. Both use `--layout-boundary-inline` — the
               same token the keyframe's distance defaults to — so they cannot drift apart
               when that token changes with the breakpoint. The 48px gutter absorbs it. -->
            <div
              ref="scrollRef"
              class="min-w-0 xl:ml-[calc(var(--layout-boundary-inline)*-1)] xl:min-h-0 xl:flex-1 xl:overflow-x-hidden xl:overflow-y-auto xl:overscroll-contain xl:pl-(--layout-boundary-inline)"
              :style="fadeStyle"
            >
              <!-- ── THE TYPE CHANGE ARRIVES LIKE A TAB ──
                   A STABLE, DELIBERATELY UNKEYED wrapper: `useTabEnter` replays
                   `animate-page-enter` on it whenever the type changes, exactly as the
                   application / workload / function detail shells do for their tab bars
                   (../../lib/behavior/tab-enter.js). Picking a type replaces every row in
                   the band, and done in one frame that reads as a repaint — the reader
                   cannot tell whether the list narrowed or the page reloaded.
                   A class replay rather than a `<Transition>`, for the same reason the
                   tab shells use one: keying this wrapper would re-mount the whole band
                   on every tap. The replay also resets the scroll to the top, which is
                   what makes the entrance land on content the reader can see — and it
                   happens under reduced motion too, because arriving mid-list in a set
                   you have not seen is a correctness problem, not a decorative one.
                   THE SEARCH IS NOT ANIMATED. Typing narrows these same rows, but a
                   keystroke that animates feels laggy: the field patches the list in
                   place, the type swaps it.
                   IT TRAVELS, at the entrance's own distance
                   (`--layout-boundary-inline`, what `pageEnter` defaults to). The room it
                   travels through is made by the scroll region above, which extends its
                   box one distance further into the gutter and pads the content back —
                   without that the region clips the slide and the card loses its left edge
                   for the whole 240ms. -->
              <div ref="bandRef">
                <!-- Reading the new scope: the rows are that scope's, and a row carried
                 over from the one we just left is worse than no row. Skeletons stand in
                 the SAME list, so the band keeps its frame and its row rhythm instead of
                 collapsing to a block of placeholders in a different shape. -->
                <CardBox
                  v-if="tenancyReloading"
                  key="resources-loading"
                  :padded="false"
                >
                  <template #content>
                    <Item.List aria-busy="true">
                      <Item
                        v-for="index in 6"
                        :key="`resource-skeleton-${index}`"
                        role="listitem"
                      >
                        <Item.Media>
                          <Skeleton
                            kind="shape"
                            width="2rem"
                            height="2rem"
                          />
                        </Item.Media>
                        <!-- The content column is pinned to what a real row's two lines
                         MEASURE — 37.5px: a 21px title line box (`text-label-md`) over a
                         16.5px description one (`text-body-xs`) — with the bars pushed to
                         its ends. A fixed-height Skeleton carries no line-height, so two
                         bars and a gap come to 34px and every placeholder row is 4px
                         short: 24px of drift over six of them, paid back as a jump the
                         moment the data lands. Same shape as the cold-arrival wire
                         (../../components/home/HomeWire.vue). -->
                        <Item.Content class="h-[37.5px] justify-between">
                          <Skeleton
                            width="35%"
                            height="0.875rem"
                          />
                          <Skeleton
                            width="55%"
                            height="0.75rem"
                          />
                        </Item.Content>
                        <Item.Actions>
                          <Skeleton
                            width="4rem"
                            height="1.5rem"
                          />
                        </Item.Actions>
                      </Item>
                    </Item.List>
                  </template>
                </CardBox>

                <!-- THE LIST. `Item.List` inside a flush CardBox — the console's one shape
                 for a collection of things, so the row a reader learns here is the row
                 they meet in every module list, repository picker and settings group.
                 The band is ONE column at every width. The 1/2/3-up card grid that used
                 to sit here spent the full-bleed width on more columns; a list spends it
                 on the row instead — a name, a domain-or-runtime and a status align down
                 a single edge, and the second line stops being truncated at ~230px.
                 One block per group, each its own CardBox, so the dividers end where
                 `Recents` ends instead of running under its label. -->
                <div
                  v-else-if="visibleResources.length"
                  class="flex flex-col gap-(--layout-group-gap)"
                >
                  <section
                    v-for="group in listGroups"
                    :key="group.key"
                    class="flex flex-col gap-(--spacing-xs)"
                  >
                    <h3
                      v-if="group.label"
                      class="px-(--spacing-xs) text-label-sm text-(--text-muted)"
                    >
                      {{ group.label }}
                    </h3>

                    <CardBox :padded="false">
                      <template #content>
                        <Item.List>
                          <!-- `role="listitem"`: `Item.List` declares `role="list"`, but `Item`
                           does not declare the matching child role, so the list is an
                           `aria-required-children` violation until the row says what it
                           is (measured with axe — 2 nodes, one per block). It belongs in
                           the DS, on `Item`; until then every consumer of `Item.List`
                           carries it, and this page states it. -->
                          <Item
                            v-for="resource in group.resources"
                            :key="`${resource.type}-${resource.id}`"
                            role="listitem"
                          >
                            <Item.Media>
                              <IconFrame
                                :icon="
                                  resource.preset
                                    ? `ai-cor ${presetIcon(resource.preset)}`
                                    : resource.icon
                                "
                                :title="
                                  resource.preset
                                    ? presetLabel(resource.preset)
                                    : resource.typeLabel
                                "
                              />
                            </Item.Media>

                            <Item.Content>
                              <Item.Title class="w-full">
                                <!-- The history glyph marks a RECENTS row, and only a
                                 recents row: it repeats what the group label already
                                 says, which is the point — the label is at the top of
                                 the block and the rows below it scroll, so the mark is
                                 what still says "you were just here" once the label has
                                 gone past the header. `aria-hidden`: the label carries
                                 it for a screen reader, and 6 rows announcing "history"
                                 before their own name would be noise. -->
                                <i
                                  v-if="group.recent"
                                  class="pi pi-history shrink-0 text-body-sm text-(--text-default)"
                                  aria-hidden="true"
                                />
                                <button
                                  type="button"
                                  class="cursor-pointer truncate rounded-(--shape-button) text-left text-label-md text-(--text-default) outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                  @click="openResource(resource)"
                                >
                                  {{ resource.name }}
                                </button>
                              </Item.Title>
                              <!-- THE ROW'S REASON FOR EXISTING: each type's own second
                               line — a domain, a runtime and an instance count — which
                               a shared column set could not have carried.
                               AND IT IS USUALLY A DESTINATION. An application's and a
                               workload's line is the live hostname; a domain's names the
                               workload serving it. The type declares which
                               (`subtitleUrl` / `subtitlePath` in
                               ../../lib/data/home-resources.js) rather than the template
                               sniffing the string, and a function's line — prose —
                               declares neither and stays text.
                               The live-hostname shape is the console's existing one
                               (components/list/DomainCell.vue): the name, then
                               `pi pi-arrow-up-right`, opening in a new tab. Without its
                               CopyButton — that cell pins one to a table's right edge,
                               and 60 of them stacked under 60 names is chrome the row
                               already answers with its ⋯ menu.
                               The line keeps its muted colour at rest — the design's,
                               and the whole point of a second line — and takes the
                               underline plus full contrast on hover/focus, so what is
                               clickable is discoverable without a third weight in the
                               list. -->
                              <Item.Description class="text-body-xs">
                                <a
                                  v-if="resource.subtitleUrl"
                                  :href="resource.subtitleUrl"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  class="inline-flex max-w-full items-center gap-(--spacing-xxs) rounded-(--shape-button) align-bottom outline-none hover:text-(--text-default) hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                  @click.stop
                                >
                                  <span class="truncate">{{ resource.subtitle }}</span>
                                  <!-- Size and colour inherited, unlike DomainCell's copy
                                     of this glyph: there the cell text is at full
                                     contrast so the arrow is dimmed to muted, here the
                                     line is already muted and the arrow rides the
                                     hover brightening with it. -->
                                  <i
                                    class="pi pi-arrow-up-right shrink-0"
                                    aria-hidden="true"
                                  />
                                </a>

                                <button
                                  v-else-if="resource.subtitlePath"
                                  type="button"
                                  class="max-w-full cursor-pointer truncate rounded-(--shape-button) text-left align-bottom outline-none hover:text-(--text-default) hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                                  @click.stop="router.push(resource.subtitlePath)"
                                >
                                  {{ resource.subtitle }}
                                </button>

                                <span
                                  v-else
                                  class="block truncate"
                                  >{{ resource.subtitle }}</span
                                >
                              </Item.Description>
                            </Item.Content>

                            <Item.Actions>
                              <Tag
                                :label="resource.status"
                                :severity="statusSeverity(resource.status)"
                                size="medium"
                              />
                              <!-- The type and the edit time are the row's least-read
                               fields and the first thing a narrow column should give
                               up: the glyph already carries the type (it is the frame's
                               `title`), and the list is sorted by this timestamp, so
                               below `lg` the order says what the text did. -->
                              <span class="hidden text-body-xs text-(--text-muted) lg:inline">
                                {{ resource.typeLabel }} · edited
                                {{ relativeTime(resource.modifiedAt) }}
                              </span>

                              <Dropdown
                                placement="bottom-end"
                                @select="(event, value) => onRowAction(event, value, resource)"
                              >
                                <Dropdown.Trigger>
                                  <Tooltip text="Resource actions">
                                    <IconButton
                                      icon="pi pi-ellipsis-h"
                                      kind="outlined"
                                      size="small"
                                      :aria-label="`Actions for ${resource.name}`"
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
                            </Item.Actions>
                          </Item>
                        </Item.List>
                      </template>
                    </CardBox>
                  </section>
                </div>

                <!-- Nothing matched. A search that found nothing is told so and nothing
                 else; a TYPE with nothing in it is offered the way to make one. -->
                <CardBox
                  v-else
                  key="resources-empty"
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
            </div>
          </section>
        </div>

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

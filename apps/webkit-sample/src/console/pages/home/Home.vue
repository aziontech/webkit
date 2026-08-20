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
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { AGENT_SETUP_PROMPT, AGENT_TOOLS, useAgentOnboarding } from '@shared/lib/agent-onboarding'
  import AgentMark from '@shared/ui/brand/AgentMark.vue'
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import FirstUsePromo from '../../components/home/FirstUsePromo.vue'
  import HomeWire from '../../components/home/HomeWire.vue'
  import IconFrame from '../../components/home/IconFrame.vue'
  import DeleteDialog from '../../components/list/DeleteDialog.vue'
  import { useGreeting } from '../../lib/data/greeting'
  import { allResources, matchesSearch, recentResources } from '../../lib/data/home-resources'
  import { AGENT_PROMO } from '../../lib/data/product-empty-states'
  import { presetIcon, presetLabel } from '../../lib/format/presets'
  import { useTenancyReload } from '../../lib/state/tenancy-reload'

  // Account-level usage. `value` + `unit` is the whole reading — a label, a number
  // and its unit, and nothing else.
  //
  // THERE IS NO `percent`. Each metric used to carry one, drawn as a bar flush along
  // the bottom edge of its card. It read as "how much of your plan is gone", and there
  // is no allowance in this business model for it to be a share of — so it was a gauge
  // against nothing, in the loudest colour on the card, under every number on the page.
  // A reading the reader cannot verify is worse than one less thing to look at.
  //
  // WHAT REPLACES IT IS `trend`: which way the reading moved against the window before
  // this one, as a `direction` and the size of the move. It is the one thing the bar
  // was reaching for and could never say — a number on its own answers "how much" and
  // says nothing about whether that is more or less than yesterday — and unlike a share
  // of a plan, a delta between two windows is something this data actually contains.
  //
  // THE TAG IS COLOURED BY THE SIGN: `success` when the reading went up, `danger` when
  // it went down — the DS's own two severities, so the strip reads at a glance and from
  // across the room, before any of the four numbers has been read. The arrow and the
  // `+`/`-` say the same thing a second and a third way, which is what keeps it legible
  // to a reader who cannot separate the two hues and to one hearing it read out.
  // The colour is about the DIRECTION, not about whether the direction is good news —
  // these four readings do not share one answer to that (more bandwidth saved is better,
  // more data transferred is simply more traffic), and the tag is not the place to
  // adjudicate it.
  const metrics = [
    {
      label: 'Data Transferred',
      value: '842',
      unit: 'GB',
      trend: { direction: 'up', delta: '12.4%' },
      hint: 'Total bytes delivered across all your resources.'
    },
    {
      label: 'Requests / Second',
      value: '1,240',
      unit: '/s',
      trend: { direction: 'up', delta: '3.8%' },
      hint: 'Average requests handled per second in the selected window.'
    },
    {
      // GB, not MB: it is a share of what was transferred above, and two different
      // magnitudes for the same traffic read as two unrelated numbers.
      label: 'Bandwidth Saving',
      value: '588',
      unit: 'GB',
      trend: { direction: 'up', delta: '6.2%' },
      hint: 'Bytes served from cache instead of your origin.'
    },
    {
      label: 'Data Offload',
      value: '70',
      unit: '%',
      trend: { direction: 'down', delta: '1.5%' },
      hint: 'Share of traffic offloaded from your origin to the edge.'
    }
  ]

  // ── What the account owns, as ONE list ────────────────────────────────────
  // Normalized from the three seeded fixtures (../lib/home-resources.js) and sorted
  // newest first, which is what lets the head of it be `Recents` without holding a
  // second collection. `ref` on a plain array — a card action removes from it, and
  // everything below re-derives.
  const rows = ref(allResources())

  // ── THE RESOURCES BAND: THREE MODULE PANELS, NOT ONE FILTERED LIST ────────
  //
  // It was one list of everything with a segmented type control above it, and before
  // that a tab row over a table. Both made the same trade: ONE band, and a control the
  // reader has to operate before the band says anything about a given module. Two costs
  // came with it —
  //
  //   THE MODULES WERE INVISIBLE UNTIL YOU FILTERED. "How many applications do I have"
  //     and "is that workload still there" are questions about a module, and a mixed
  //     list answers them only after a tap that hides everything else.
  //   THE ROW HAD TO CARRY THE DIFFERENCE. Because any row could be any type, each one
  //     spelled out its type, its status, its second line and its edit time — four
  //     fields whose only job was to say which module the row belonged to and how it
  //     was doing. Under a module's own heading, all four are context the PANEL
  //     already gives.
  //
  // So the band is four panels across one row, each its own module, and the row inside
  // them is a name and nothing else (see the template).
  //
  // WHICH FOUR. The three things the account owns AT THE TOP LEVEL —
  // `Applications`, `Workloads`, `Domains` — and `Recents` last.
  // NOT `Functions`, though the type is one of `RESOURCE_TYPES`
  // (../../lib/data/home-resources.js) and has a module list of its own: a function is
  // not a thing an operator manages from Overview, it is a thing that runs INSIDE an
  // application, and a column of function names beside the applications they belong to
  // invites the reader to treat them as peers. Functions are one click away through
  // `Applications`, and the recent ones are in the panel below — the same place domains
  // and functions both lived before either had a column.
  // `Recents` is the fourth because "where was I" is not a module and never was — it is
  // the newest of EVERYTHING, so it is the one panel whose rows come from more than one
  // type (functions included), and the only one that therefore has to say which type
  // each row is (it names it — see the template).
  // FIVE ROWS is the ceiling for a panel, not a target. A summary's job is to say what
  // is there and hand the reader the module list; past five names a column stops being a
  // glance and starts being a list with the wrong controls on it.
  const PANEL_ROWS = 5

  // The SAMPLE shows fewer of some types on purpose. The seed generates 20 workloads
  // (one per row of a paginated module list — @shared/lib/workloads.js) and one domain
  // per workload, so at a flat cap every column in the band opened full and the band
  // read as five columns of exactly five, which is the one shape a real account never
  // has. Three workloads and four domains give the band the ragged bottom edge it has in
  // life — and they are what makes the create row at the foot of a column visible in the
  // demo instead of only in the empty state. A real console passes `PANEL_ROWS` for
  // every type; this is mock shaping, and it is the only thing in this file that is.
  const MOCK_ROWS = { workloads: 3, domains: 4 }
  const rowsFor = (type) => MOCK_ROWS[type] ?? PANEL_ROWS

  const search = ref('')

  // Two different empties, and they need two different answers: a search that matched
  // nothing is told so, and an EMPTY MODULE is offered the way to make one. So the flag
  // is read per panel rather than for the band.
  const narrowed = computed(() => Boolean(search.value.trim()))

  // The search runs across the WHOLE account and lands in whichever panels match — it
  // is the page's field (a row above the band), not a control of any one module, and a
  // reader typing a name does not know which module owns it.
  const matched = computed(() => rows.value.filter((row) => matchesSearch(row, search.value)))

  // `create` is the module's own create route, which is where the panel's empty state
  // sends the reader — the console's create surfaces are pages at the first level
  // (../../lib/behavior/surfaces.js), so this is a link out and not a dialog here.
  // `Recents` has no create: it is a view of the other panels, not a place to put
  // anything, so its empty state is a line of prose.
  const panels = computed(() => [
    {
      key: 'applications',
      label: 'Applications',
      path: '/applications',
      create: '/applications/new',
      createLabel: 'Add Application',
      recent: false,
      // Its rows open with the framework mark, so they carry the same leading gutter
      // `Recents` does — and the heading mirrors it, so the column has ONE label rail
      // (see the heading in the template).
      marked: true,
      resources: matched.value
        .filter((row) => row.type === 'applications')
        .slice(0, rowsFor('applications'))
    },
    {
      key: 'workloads',
      label: 'Workloads',
      path: '/workloads',
      create: '/workloads/new',
      createLabel: 'Add Workload',
      recent: false,
      resources: matched.value
        .filter((row) => row.type === 'workloads')
        .slice(0, rowsFor('workloads'))
    },
    // Domains carry NO heading link, and it is not an omission: this prototype has no
    // domains LIST page (the type is projected off each workload's primary domain —
    // ../../lib/data/home-resources.js), so the heading would promise a page that does
    // not exist. It does have a create page (`/domains/new`, generated from the create
    // descriptors), so the panel can still be filled from its own empty row.
    {
      key: 'domains',
      label: 'Domains',
      path: '',
      create: '/domains/new',
      createLabel: 'Add domain',
      recent: false,
      resources: matched.value.filter((row) => row.type === 'domains').slice(0, rowsFor('domains'))
    },
    {
      key: 'recents',
      label: 'Recents',
      path: '',
      create: '',
      createLabel: '',
      recent: true,
      // `matched` is already newest-first (../../lib/data/home-resources.js sorts it),
      // so the head of it IS the trail — no second collection to keep in step.
      resources: recentResources(matched.value, PANEL_ROWS)
    }
  ])

  // Switching organization, account or workspace reloads Home: usage is metered for
  // the scope in force and the resources below are that scope's, so both go to
  // skeletons and come back re-read (src/lib/tenancy-reload.js).
  const { tenancyReloading } = useTenancyReload()

  // NO TYPE CONTROL, SO NO TAB ENTRANCE. The band used to replay `animate-page-enter`
  // on every change of the segmented type filter (`useTabEnter`, the entrance the
  // application / workload / function detail shells give their tab bars), because
  // picking a type replaced every row under it and doing that in one frame reads as a
  // repaint. The four panels are all on screen at once and only the SEARCH narrows
  // them now — and typing is exactly the case that entrance was never for: a list that
  // animates on every keystroke feels laggy. The panels patch in place.

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
  onUnmounted(() => {
    clearTimeout(arrivalTimer)
  })

  // ── THE AGENT ONBOARDING, AT THE FOOT OF THE USAGE RAIL ──
  //
  // It was a contrast pill on the greeting row (ui/ContrastBanner.vue): a near-black
  // capsule in the loudest position the page has, for the one offer on Overview the
  // reader did not come here for. Two things were wrong with it there.
  //
  //   IT WAS THE LOUDEST THING ON A PAGE ABOUT SOMETHING ELSE. Contrast inverts against
  //     the surface, so the pill outshouted the numbers and the resource list — the two
  //     reasons the page exists — to advertise a clipboard copy.
  //   IT MADE THE PAGE OPEN AT TWO HEIGHTS. Dismissible and persisted, riding a row it
  //     shared with the heading, it set that row to 37px for a reader who still had it
  //     and 25px for one who did not, and the wire had to read the flag to guess which.
  //
  // So the offer keeps its place on the page and loses the volume: it is the SAME quiet
  // promo card every module's first use already offers it with
  // (../../components/home/FirstUsePromo.vue, the agent card of ProductFirstUse.vue) —
  // the editors' own logos in an overlapping cluster, the shared copy under them, and the
  // whole card as one control that copies. At the END of the usage band at the foot of
  // the page: the readings are one strip across the bottom and the card takes the last
  // third of that row, so the offer sits after the numbers rather than over them, and a
  // reader who came to work on their infrastructure meets it after the work and not
  // before.
  //
  // Its copy is READ from the shared const (`AGENT_PROMO`, lib/product-empty-states.js)
  // rather than restated here — the same title and line every product's first use shows,
  // because one offer described two ways is two offers to the reader.
  //
  // Whether the reader has already sent it away. The flag is shared and persisted
  // (../lib/agent-onboarding.js) — one answer for the whole onboarding, not one per
  // screen.
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

  // The card's whole action is the clipboard — there is no page to open, and a button
  // that opened one to then offer a copy button would be a step with no decision in it.
  // Same prompt the first access copies (lib/agent-onboarding.js): one text, two
  // surfaces, because a prompt that drifts between them is two different onboardings.
  const copyAgentPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AGENT_SETUP_PROMPT)
      toast.success('Setup prompt copied.', {
        description: 'Paste it into Claude, Cursor, Windsurf, Codex or OpenCode.'
      })
    } catch {
      toast.error("Couldn't copy the prompt.", {
        description: 'Clipboard access was blocked by the browser.'
      })
    }
  }

  // Dismissing is SILENT: the card unmounts and the strip takes the width back, and that
  // is the whole
  // feedback. It used to raise a toast naming what left, which is the right instinct for a
  // destructive action and the wrong one here — the toast is the loudest motion the console
  // has (the Toaster enters from the bottom edge with a scale and a fade), so "no thanks"
  // to an offer answered with a panel flying in was a bigger event than the thing it
  // reported. Nothing is lost either: the offer is the same one every product's first use
  // still makes, so there is no state to explain a way back to.
  const onAgentOnboardingClose = () => {
    dismissAgentOnboarding()
  }

  // The create row rides the FOOT of every module panel — its own module has a create
  // page and the reader is not mid-search. `Recents` has no create page, so it never
  // shows one; a narrowed panel does not either (see the template).
  const showCreateRow = (panel) => Boolean(panel.create) && !narrowed.value

  // The muted line a panel shows when it has nothing to list. `Recents` is not a
  // plural of anything ("No recents match your search" is not English), so it says what
  // it is: a trail that has not started yet, or a query nothing recent matches.
  const emptyLine = (panel) => {
    if (panel.recent)
      return narrowed.value ? 'Nothing recent matches your search.' : 'Nothing opened here yet.'
    return narrowed.value
      ? `No ${panel.label.toLowerCase()} match your search.`
      : 'Nothing here yet.'
  }

  // A row on Overview goes where the same row goes in its own module — the detail
  // page. Overview is a way INTO the console, so a row that only highlighted would be
  // a dead end; a resource whose detail view this prototype does not have carries a
  // null `path` and simply does not navigate.
  const router = useRouter()

  const openResource = (resource) => {
    if (resource.path) router.push(resource.path)
  }

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
           THE MEASURE is `.layout-column` — the STANDARD page container,
             `--layout-measure` / 1388px, the one width home, the product
             overviews and every listing share (it was 1620px until the
             container standardization). The populated Overview is a full-width list of every
             resource the account owns over a strip of usage readings, which is
             what that measure is for ("lists and detail dashboards", and they want every pixel
             they can get because more rows and columns visible IS the point).
             It is NOT the focused measure (1024px): that cap is for a
             single task, and it wasted a third of a 1428px content zone on a
             void while the resource rows inside it truncated their own second
             line. It is also not full bleed, which the page ran briefly and
             which has the opposite failure — past ~2000px the row actions end up
             a head-turn away from the name that identifies the row, and there is
             nothing on this page that a 2200px-wide list row tells you that a
             1388px one does not. The empty half of /home came down to this
             same measure, so the two halves are one width (./HomeEmptyState.vue).
           THE BOUNDARY is `.layout-boundary`, carried HERE rather than inherited
             from the shell. Overview.vue passes `padded=false` to AppLayout for
             exactly this reason, so the inset is declared once, on the same block
             as the measure, in the file that owns the layout. This is the
             documented self-padded shape, and the cap grows by exactly the inset
             it now contains (`calc(measure + 2 * --layout-boundary-inline)`), so
             the CONTENT column is 1388px either way.
         Why the page owns the boundary: the page is a FRAME from `xl` (see
         below), and a frame has to know where its own edges are. With the inset
         on the shell's scroll box it sat OUTSIDE the frame — so the list scrolled
         to an edge the page could not see, the bottom inset was height the frame
         had already given away, and the one number that decides whether a card
         looks flush against the viewport lived in a different component. On the
         container, `box-sizing: border-box` puts the inset inside the same 100%
         height the frame measures.
         There is no column split left for the measure to decide: the page is ONE
         column — the resource list at the full content width, the usage strip
         under it — and the measure is simply how wide a row gets. -->
  <!-- ── ONLY THE RESOURCE LIST SCROLLS (from `xl`) ──
         The page is a FRAME from `xl` up: the greeting, the search, the Resources
         header with its type control, and the usage strip at the foot all hold still,
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
      <!-- THE OPENING ROW: who is here, and nothing else.
           The greeting is the only line on Overview addressed to the PERSON rather
           than to their infrastructure, and it holds this row ALONE. The agent
           onboarding used to ride its right edge as a contrast pill; it is the card at
           the end of the usage strip at the foot of the page now (see the aside below,
           and the note in the script). The row therefore has ONE height for every reader — it no longer
           grows or shrinks with a dismissal the page has to remember. -->
      <header class="flex items-center">
        <h1 class="text-heading-sm text-(--text-muted)">
          {{ greeting }},
          <span class="text-(--text-default)">{{ userName }}</span>
        </h1>
      </header>

      <!-- ── THE SEARCH, AT PAGE LEVEL ──
           It spans the whole content width, above the list, rather than riding
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

      <!-- ONE COLUMN, TWO BLOCKS. The resource list takes the frame's remaining
           height (`xl:flex-1` on it, `min-h-0` so it can actually shrink) and the
           usage strip under it is `shrink-0` — so the band the reader operates
           absorbs every pixel the viewport gives or takes, and the four readings
           are the same 90px on a laptop and on a 27" display. -->
      <!--
        THE ENTRANCE. Replacing the wire MOUNTS these two blocks, so each one
        rises into place as it arrives (`animate-content-enter`, src/styles/motion.css) —
        resources first, usage one beat behind it, so the page assembles in
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
             above the list. `shrink-0` so the frame takes its height out of the
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

        <!-- ── RESOURCES: FOUR PANELS, ONE ROW ──
             `Applications`, `Workloads`, `Domains`, `Recents` side by side from `xl`,
             two-up from `sm` and three-up from `lg`, stacked below that. The
             type control that used to sit over one mixed list is gone:
             a panel per module IS the filter, permanently applied and permanently
             visible, so the reader never taps to find out whether a module has
             anything in it.
             Full content width (the usage rail is a strip at the foot now), and the
             entrance's LEADER — it is what the reader came for, so it arrives first and
             the readings follow one fast-01 behind it. -->
        <section
          class="animate-content-enter motion-reduce:animate-none grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap)"
          aria-label="Resources"
        >
          <!-- Each panel is a column that owns its own height: the heading holds still
               and only its list scrolls, so four modules of very different sizes end
               level with each other instead of the row taking the tallest one's height.
               `min-h-0` on both the column and the scroller is what lets a flex child
               shrink below its content; without it the panel grows and the page hands
               the scroll back to the shell. -->
          <!-- FIVE TRACKS FOR FOUR PANELS, AND `RECENTS` TAKES TWO OF THEM. Its row
               carries two fields where a module row carries one
               (`Domain / my-workload-1…`), so at an equal share of the band the type name
               ate the column and the resource name truncated to a single character
               (measured: 19px of name in a 212px column). A double track is the honest
               fix — the panel that says twice as much gets twice the width. -->
          <div
            v-for="panel in panels"
            :key="panel.key"
            class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
            :class="panel.recent ? 'xl:col-span-2' : ''"
          >
            <!-- THE HEADING IS THE WAY IN. A module's panel is a summary of that module,
                 so its title is the link to it — the chevron says so, and it is the only
                 chrome on the row. `Recents` is not a module and carries no link, so it
                 is a plain heading; `<h2>` in both cases, which is the level under the
                 greeting's `<h1>` now that the band has no title of its own (axe's
                 `heading-order` catches the jump to `<h3>`).
                 FULL CONTRAST, not muted. A muted heading is the design's instinct here,
                 but `--text-muted` measures 3.95:1 on this surface — under AA — and axe
                 flags every one; a heading is the last text on the page to spend that.
                 The row reserves `--size-6` so the four titles sit on one line whether
                 or not they carry a control.
                 ── IT SITS ON THE LABEL RAIL, NOT ON THE ROW'S EDGE ──
                 With the card gone there is no box edge to align to, so the heading
                 aligns to the one thing in the column that matters: the NAME under it.
                 That rail is not the row's left edge, and the difference was visible in
                 every column: a row is `px-(--spacing-md)` inside a 1px transparent
                 border, so its text starts 17px in, not 16 — and in the two columns whose
                 rows open with a mark (`Applications`' vendor logo, `Recents`' trail
                 glyph) the label starts a further gutter + gap in. So the inset is the
                 row's real one, and the mark columns mirror the gutter with an empty
                 spacer of the same width, at the same `--spacing-xs` gap the row's title
                 uses. Measured: heading text and name text now start at the same x to
                 the pixel in all four columns (was 24px out in `Applications`, 24 in
                 `Recents`, 1 in `Workloads` / `Domains`). -->
            <h2
              class="flex min-h-(--size-6) items-center gap-(--spacing-xs) px-[calc(var(--spacing-md)+1px)] text-label-sm text-(--text-default)"
            >
              <!-- The mark gutter, mirrored. `aria-hidden` and empty: it is width, not
                   content — the heading's own text is what the reader needs. -->
              <span
                v-if="panel.marked || panel.recent"
                class="w-(--size-4) shrink-0"
                aria-hidden="true"
              />
              <RouterLink
                v-if="panel.path"
                :to="panel.path"
                class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) outline-none hover:underline focus-visible:ring-2 focus-visible:ring-(--ring-color)"
              >
                {{ panel.label }}
                <i
                  class="pi pi-chevron-right text-[10px] leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
              </RouterLink>
              <span v-else>{{ panel.label }}</span>
            </h2>

            <!-- ── NO CARD AROUND THE LIST ──
                 It was `Item.List` inside a flush CardBox, the console's one shape for a
                 collection. Four of them side by side broke it: grid columns stretch to
                 the row's height, so the two shorter panels became BORDERED BOXES WITH A
                 VOID IN THEM — the border drew a promise of content that the module did
                 not have, and the emptiest module got the largest empty box.
                 Flat, the stretching costs nothing to look at: a column that runs out of
                 rows simply ends, and the space below it is page. The dividers between
                 rows come from `Item.List` itself, so the rows still read as one list —
                 what left is the box around them, not the structure.
                 `xl:min-h-0 xl:flex-1` + `overflow-y-auto`: the panel still scrolls inside
                 itself and its heading still never leaves. -->
            <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
              <!-- Reading the new scope: the rows are that scope's, and a row carried
                   over from the one we just left is worse than no row. Skeletons stand
                   in the SAME list, so the panel keeps its frame and its row rhythm. -->
              <Item.List
                v-if="tenancyReloading"
                key="panel-loading"
                aria-busy="true"
              >
                <Item
                  v-for="index in 3"
                  :key="`${panel.key}-skeleton-${index}`"
                  role="listitem"
                  size="small"
                >
                  <!-- On the column's LABEL RAIL, like the heading above it: the two
                       mark-bearing panels indent their names by the gutter, and a
                       placeholder bar that ignores it slides sideways on arrival. -->
                  <Item.Content
                    class="h-[21px] justify-center"
                    :class="
                      panel.marked || panel.recent
                        ? 'pl-[calc(var(--size-4)+var(--spacing-xs))]'
                        : ''
                    "
                  >
                    <Skeleton
                      :width="index % 2 ? '55%' : '42%'"
                      height="0.875rem"
                    />
                  </Item.Content>
                </Item>
              </Item.List>

              <Item.List
                v-else-if="panel.resources.length || showCreateRow(panel)"
                key="panel-rows"
              >
                <!-- `role="listitem"`: `Item.List` declares `role="list"`, but `Item`
                     does not declare the matching child role, so the list is an
                     `aria-required-children` violation until the row says what it is.
                     It belongs in the DS, on `Item`; until then every consumer of
                     `Item.List` carries it, and this page states it. -->
                <!-- ── THE WHOLE ROW IS THE TARGET ──
                     The name was the only thing clickable in it, which made a 58px row
                     with a 120px target in the middle of it: the reader aims at a word
                     rather than at the thing the word names, and nothing under the
                     pointer says the row goes anywhere.
                     So the row LIGHTS UP on hover (`--bg-hover`, the token the DS's own
                     `muted` row uses), the NAME UNDERLINES with it — the row's fill says
                     "this responds", the underline says "and it is a link", which is the
                     half a fill alone never states — and the name's hit area is STRETCHED
                     over the row: an
                     `::after` at `inset-0`, which is what lets one real `<button>` cover
                     the row without the row becoming a control. That distinction is the
                     whole reason for the technique: the ⋯ menu lives in this row too, and
                     a button inside a button is invalid HTML that browsers un-nest at
                     parse time, breaking both. The menu simply sits ABOVE the stretched
                     layer (`relative z-10` on the actions), so it takes its own clicks.
                     KEYBOARD GETS THE SAME ROW. Focus lands on the name (the row is not
                     focusable — it is a `<div>`), so the ring is drawn on the ROW via
                     `has-[[data-row-link]:focus-visible]`, scoped to the name so the ⋯
                     button's own focus does not also ring the whole row; the name takes
                     its own `focus-visible:underline` so the keyboard reader gets the
                     same two signals the pointer does.
                     THE FILL IS A SHAPE, NOT A BAND. `Item.List` sets `rounded-none` on
                     every row it holds (right for a list inside a card, where the card's
                     edge is the shape); flat on the page there is no card edge, and a
                     full-bleed rectangle lighting up reads as a table selection rather
                     than as an element responding. `--shape-elements` gives it the corner
                     radius the DS's own small surfaces use. The `!` is not decoration:
                     the list's `[&>[data-slot=item]]:rounded-none` is an attribute
                     selector (specificity 0,2,0) and a plain utility (0,1,0) loses to it
                     outright. -->
                <Item
                  v-for="resource in panel.resources"
                  :key="`${resource.type}-${resource.id}`"
                  role="listitem"
                  size="small"
                  class="relative rounded-(--shape-elements)! transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) has-[[data-row-link]:focus-visible]:ring-2 has-[[data-row-link]:focus-visible]:ring-(--ring-color) has-[[data-row-link]:focus-visible]:ring-inset"
                >
                  <!-- ── ONE LINE, AND IT IS THE NAME ──
                       The row used to carry four more fields: a second line (a domain,
                       a runtime), a status Tag, the type, and how long ago it was
                       edited. Under a module's own heading every one of them is either
                       context the panel gives (the type), or detail the module list one
                       click away is the right place for (status, edit time, hostname).
                       What a summary owes the reader is WHICH THINGS EXIST and a way
                       in — so the row is a name and a chevron, with a vendor logo in
                       front of it in `Applications` and the trail mark plus the type in
                       `Recents`. -->
                  <Item.Content>
                    <Item.Title class="w-full">
                      <!-- ── THE MARK BELONGS TO `RECENTS`, AND ONLY TO IT ──
                           Every row used to open with a 32px framed mark in
                           `Item.Media`: the framework logo for an application, the type
                           glyph for everything else. Under a column already titled
                           `Workloads`, a workload glyph on all six rows is the heading
                           restated six times — 40px of every row spent saying what the
                           reader read once above it, in a band that just shed four
                           fields for exactly that reason.
                           `Recents` is the one column that is NOT one type, so it is the
                           one column where the mark carries information: it says which
                           module each row came from, in less width than the word it
                           replaces (the row used to spell out "Application /" in front
                           of the name). The TYPE glyph, deliberately — not the framework
                           logo an application also has: what a mixed list has to answer
                           is WHICH MODULE, and a Next.js mark answers a different
                           question.
                           ONE glyph for the column, not one per row: the mark says this
                           is a TRAIL (`pi-history`), and the type is named in words
                           right after it — `Domain / my-workload-1.azion.app`. A per-row
                           type glyph was the alternative and it asks the reader to learn
                           seven marks to answer a question a word answers outright,
                           while the column's own identity goes unmarked.
                           Muted, and the type is muted with it, so the NAME is the only
                           thing at full contrast in the row — five columns of names is
                           what the band reads as, and this column should not read as
                           two fields fighting.
                           A bare glyph on the title line, not a framed tile in
                           `Item.Media`: the frame is 32px in a row whose line box is
                           21px, so a tile in this one column made its rows 58px against
                           the other columns' 54 (measured) — columns whose row
                           rhythms do not line up read as unrelated lists. -->
                      <!-- ── THE MARK IS A GUTTER, NOT ITS OWN WIDTH ──
                           A font glyph is as wide as its advance (measured: 8.67px for
                           `pi-history`, 16.09 for an `ai-cor` framework mark), so a mark
                           left to its natural width puts the label a different distance
                           in on every column that has one — and nothing above can align
                           to it. Both mark columns reserve the same `--size-4` box and
                           center the glyph in it, so the label rail is one number the
                           heading can mirror. -->
                      <template v-if="panel.recent">
                        <span
                          class="flex w-(--size-4) shrink-0 items-center justify-center"
                          aria-hidden="true"
                        >
                          <i class="pi pi-history text-body-xs leading-none text-(--text-muted)" />
                        </span>
                        <!-- ── AND THE TYPE IS A COLUMN, NOT A PREFIX ──
                             At its natural width the type set every name in the panel a
                             different distance in (measured: `Domain /` 62.8px against
                             `Application /` 90.2 — a 27px ragged edge down the one
                             column that has two fields), so the column read as four
                             unrelated lines rather than as a list of names. `min-w`, not
                             `w`: the rail is the widest label this prototype can hold
                             (`Application /`) plus a hair, and a longer type would push
                             its own row's name across rather than truncate under a
                             number that stopped being true. -->
                        <span class="min-w-[5.75rem] shrink-0 text-body-sm text-(--text-muted)"
                          >{{ resource.typeLabel }} /</span
                        >
                      </template>

                      <!-- ── THE VENDOR LOGO STAYS, AND ONLY IN `APPLICATIONS` ──
                           An application's framework mark is the one mark in this band
                           that is not its column's heading restated: `Workloads` glyphs
                           are all the same glyph, but a Next.js row and a Vue row are
                           told apart by theirs, and it is the fact about an application
                           a reader scans a list of them FOR. It is the same colored
                           `ai-cor` glyph at the same `1.15em` the module's own list
                           draws beside the name (../applications/Applications.vue), so
                           the row reads the same in both places.
                           The GUTTER is unconditional and the glyph inside it is not:
                           an unrecognized preset resolves to no icon class
                           (../../lib/format/presets.js), and a row that drops the gutter
                           with it would put its name 24px left of every other name in
                           the column — the one place in the band where a missing icon
                           could break the rail. -->
                      <span
                        v-else-if="panel.marked"
                        class="flex w-(--size-4) shrink-0 items-center justify-center"
                        aria-hidden="true"
                      >
                        <i
                          v-if="presetIcon(resource.preset)"
                          :class="presetIcon(resource.preset)"
                          class="text-[1.15em] leading-none"
                          :title="presetLabel(resource.preset)"
                        />
                      </span>
                      <!-- `after:absolute after:inset-0` is the stretched hit area; the
                           row's own `relative` is what it resolves against. No ring of
                           its own — the ROW draws it (see the note above), so the focused
                           row and the hovered row are the same shape. -->
                      <button
                        type="button"
                        data-row-link
                        class="min-w-0 cursor-pointer truncate text-left text-label-md text-(--text-default) outline-none group-hover/item:underline focus-visible:underline after:absolute after:inset-0 after:content-['']"
                        @click="openResource(resource)"
                      >
                        {{ resource.name }}
                      </button>
                    </Item.Title>
                  </Item.Content>

                  <!-- `relative z-10`: above the name's stretched `::after`, or the row
                       would swallow every click meant for the menu.
                       ── ONE 28px BOX FOR BOTH, NOT TWO SIDE BY SIDE ──
                       The ⋯ button reserves 28px whether or not it is visible
                       (`opacity-0` still takes its space, and it has to — a control that
                       appears on hover and MOVES the name is worse than one that is
                       always there), and the chevron took 12 more beside it. In a 169px
                       column that pair was 56px of a row (a third of it) for two things
                       the reader looks at last, and the NAME paid — measured at 81px,
                       which truncates every application in the seed.
                       So they share one `--size-7` box and swap: the chevron at rest, the
                       ⋯ on hover or keyboard focus. Nothing moves (the box is one size),
                       both affordances survive, and every name in the band gains 28px. -->
                  <Item.Actions class="relative z-10 grid size-(--size-7) place-items-center">
                    <!-- THE MENU IS NOT PART OF THE RESTING ROW. Row actions are the
                         one thing a summary cannot delegate to the module list (the
                         reader is here, and deleting from here is the point), but a
                         control on every row at rest is exactly the noise this band
                         just shed. So it appears on hover and on keyboard focus
                         anywhere in the row — `group-focus-within/item` is what keeps it
                         reachable by Tab, since a control that only exists on hover is
                         a control a keyboard cannot press.
                         The group is the DS row's OWN (`group/item`, declared by
                         `Item`), not a second one added here: two group scopes on one
                         element is two things to keep in step.
                         `motion-reduce:transition-none`: the fade is decoration, and a
                         reader who asked for no motion gets it instantly. -->
                    <Dropdown
                      placement="bottom-end"
                      class="col-start-1 row-start-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-100 group-focus-within/item:opacity-100"
                      @select="(event, value) => onRowAction(event, value, resource)"
                    >
                      <Dropdown.Trigger>
                        <Tooltip text="Resource actions">
                          <IconButton
                            icon="pi pi-ellipsis-h"
                            kind="transparent"
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

                    <!-- The row goes somewhere, and the chevron is the whole of what
                         says so now that the status and the timestamp are gone.
                         Decorative: the name beside it is the control. It hands the box
                         to the ⋯ on hover / focus rather than sitting beside it (see
                         above), so the two never cost the name more than one control. -->
                    <i
                      class="pi pi-chevron-right col-start-1 row-start-1 shrink-0 text-body-xs text-(--text-muted) transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/item:opacity-0 group-focus-within/item:opacity-0"
                      aria-hidden="true"
                    />
                  </Item.Actions>
                </Item>
                <!-- ── THE LAST LINE OF EVERY MODULE COLUMN IS THE WAY TO ADD ONE ──
                     It used to appear only when the module was EMPTY, as a filled
                     panel-wide plaque — which made the emptiest column the loudest thing
                     in the band, and meant the one affordance that puts something in this
                     account was invisible to every reader who already had one thing.
                     It is a ROW now, the last one in the same list: same `size="small"`,
                     same hover fill, same stretched hit area as a resource row, so the
                     column reads as a list whose final line happens to be "add another".
                     A panel caps at five names (`PANEL_ROWS`) with this row under them,
                     so it is always on screen without the column ever scrolling to it.
                     NOT WHILE NARROWED (see `showCreateRow`): a search is a question
                     about what exists, and "Add Application" is not an answer to it —
                     a query that matched nothing gets the muted line below instead.
                     `Recents` has no create at all: it is a view of the other panels,
                     not a place to put anything. -->
                <Item
                  v-if="showCreateRow(panel)"
                  role="listitem"
                  size="small"
                  class="relative rounded-(--shape-elements)! transition-colors duration-150 ease-out motion-reduce:transition-none hover:bg-(--bg-hover) has-[[data-row-link]:focus-visible]:ring-2 has-[[data-row-link]:focus-visible]:ring-(--ring-color) has-[[data-row-link]:focus-visible]:ring-inset"
                >
                  <!-- CENTERED, WHICH IS THE POINT: every other row in the band is a
                       name on the left edge, so a centered line is legible as NOT one of
                       them before it is read — the column's own control rather than its
                       last resource. It is the one thing that distinguishes the two, now
                       that the create affordance is a row like the rest and no longer a
                       filled plaque.
                       `min-h-(--size-7)`: a resource row is 54px because its ⋯ button
                       reserves 28px beside a 21px line, and this row has no actions at
                       all — left alone it lands at 47px (measured), so the row would be
                       the one row in the band with a different height. It reserves the
                       same 28px the button would have. -->
                  <Item.Content class="min-h-(--size-7) items-center justify-center">
                    <Item.Title>
                      <!-- A real `RouterLink`, not the resource row's `<button>`: this
                           one goes to a page and has an href, so it should be
                           middle-clickable and copyable like any link. The `::after` is
                           the same stretched hit area the resource rows use, so the
                           whole row is the target. The plus is INSIDE the label rather
                           than in `Item.Media`: the media slot is the type mark's
                           column (`Recents` only, see above), and a 32px framed plus
                           would put a bordered tile in a column that has none.
                           NO UNDERLINE, unlike a resource name. The underline there says
                           "this word is the link"; here the whole centered line is, and
                           the row's fill plus the label going to full contrast is the
                           entire hover signal. The keyboard reader is not left out — the
                           ROW draws the focus ring (`has-[[data-row-link]:focus-visible]`
                           on the `Item`), which is the same signal it draws for a name. -->
                      <RouterLink
                        :to="panel.create"
                        data-row-link
                        class="inline-flex min-w-0 items-center gap-(--spacing-xxs) truncate text-label-md text-(--text-muted) outline-none transition-colors duration-150 ease-out motion-reduce:transition-none group-hover/item:text-(--text-default) after:absolute after:inset-0 after:content-['']"
                      >
                        <i
                          class="pi pi-plus shrink-0 text-body-xs"
                          aria-hidden="true"
                        />
                        {{ panel.createLabel }}
                      </RouterLink>
                    </Item.Title>
                  </Item.Content>
                </Item>
              </Item.List>

              <!-- The one empty left: a search that matched nothing in THIS panel, or
                   `Recents` before the reader has opened anything. One muted line — it is
                   not the module's state, it is this query's. -->
              <p
                v-else
                class="px-(--spacing-md) py-(--spacing-sm) text-body-sm text-(--text-muted)"
              >
                {{ emptyLine(panel) }}
              </p>
            </div>
          </div>
        </section>

        <!-- ── USAGE: A STRIP AT THE FOOT, NOT A RAIL DOWN THE SIDE ──

             It was the page's left column: four stacked cards, each with a progress
             bar under its reading, holding 30% of every row beside the resource list.
             Two things were wrong with that, and removing the bar is what settled both.

               THE BAR MEASURED NOTHING. It read as plan consumption, and there is no
                 allowance in this business model for it to be a share OF — so it drew
                 a percentage of nothing, in the loudest colour the card had, under
                 every number on the page. A gauge with no ceiling is not a quiet
                 detail: it is the first thing the eye lands on and the only thing on
                 the card that cannot be verified.
               THE COLUMN WAS SIZED FOR THE BAR. Four cards need a rail only while each
                 one carries a chart; a label and a number do not — they are one line of
                 text, and stacking four of them down a 348px column spent a third of
                 the page's width on eight short lines while the resource rows beside
                 them truncated.

             So usage is now ONE STRIP: four readings inline, divided by hairlines inside
             a single card, at the FOOT of the page. Which makes the page a COLUMN — the
             list takes the full content width and the readings sit under it, in the band
             a summary's numbers belong in: they are the account's context, read once on
             arrival, and the resources are what the reader came to operate.

             `shrink-0`, so the frame takes its height out of the list above and never out
             of these four lines.

             THE ENTRANCE FOLLOWS THE LIST NOW. The stagger is unchanged in kind and
             reversed in order — whatever is on top arrives first, so the delay token
             (one fast-01) moved off the resources column and onto this one. -->
        <aside
          class="animate-content-enter motion-reduce:animate-none flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap) [--content-enter-delay:var(--transition-duration-fast-01)]"
          aria-label="Usage"
        >
          <!-- NO SECTION HEADING. The rail had one because a column of four cards needs
               to say what column it is; a strip of four labelled readings says it in the
               labels, and a `Usage` title over a 90px band is a row of height spent on a
               word the cells already carry. The landmark keeps the name for a screen
               reader (`aria-label` above).
               ONE CARD, DIVIDED — not four cards in a row. Four separate boxes at this
               width read as four unrelated panels with three gaps between them; the
               readings are one set, taken over one window, so they share one surface and
               a hairline says where each ends. -->
          <CardBox
            :padded="false"
            class="min-w-0 xl:flex-1"
          >
            <template #content>
              <!-- One per row on a phone, 2-up from `sm`, 4-up from `xl` — the same
                   breakpoint the promo beside it stops stacking, so the strip is only ever
                   asked to fit four readings while it has the full row to do it in. A
                   reading is a 28px number and a tag beside it; four of those in a 630px
                   band (which is what `lg` would have given it, with the card taking the
                   rest) is where the number and its delta start colliding.
                   THE RULES ARE DRAWN BY THE CELLS, not by a divider element, so they move
                   with the wrap: stacked, every cell but the first takes a top rule; at two
                   columns only the bottom pair does, plus a left rule on the evens; at four
                   there are no top rules and the left rule is on every cell but the first.
                   Only INTERNAL edges are ever drawn — the card's own border is the outside.
                   EACH RULE IS SCOPED TO ITS OWN WIDTH RANGE (`max-sm:`, `sm:max-xl:`, `xl:`)
                   rather than being switched off again at the next breakpoint. A
                   `sm:…:border-t-0` written to cancel the stacked layout's top rule does not
                   cancel it: Tailwind emits both declarations at the same specificity and
                   sorts `border-t-0` BEFORE `border-t` (the utility's own value order beats
                   the variant's), so the base rule wins inside the media query and every
                   cell keeps a top border it should have dropped — measured, and visible as
                   a stray rule running through the strip at 2-up and 4-up. Ranges cannot
                   collide, so there is nothing to out-order. -->
              <!-- `grow`: the band is `items-stretch`, so this card is as tall as the
                     promo beside it, and without it the grid keeps its content height and
                     leaves 30px of dead surface under the readings (measured). Growing the
                     grid stretches its auto rows, and the cells' own `justify-center` then
                     puts the readings on the card's optical centre. -->
              <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  v-for="metric in metrics"
                  :key="metric.label"
                  class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:[&:nth-child(n+2)]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-l xl:[&:nth-child(n+2)]:border-l"
                >
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
                  <!-- The reading on the left, the move on the right. `justify-between`
                       rather than a gap, so the tag sits on the cell's own right edge and
                       the four of them line up down the strip instead of each floating at
                       whatever width its number happened to take. `items-center`: the tag
                       is a 20px box beside a 28px number, and hanging it off the number's
                       baseline drops it below the cell's optical centre. -->
                  <div class="flex items-center justify-between gap-(--spacing-sm)">
                    <div class="flex min-w-0 items-baseline gap-(--spacing-xxs)">
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

                    <!-- WHICH WAY IT MOVED, against the window before this one. The arrow
                         and the sign both carry the direction, and the SEVERITY carries it
                         a third time — `success` for a rise, `danger` for a fall, so the
                         strip is readable as a shape before it is read as four numbers.
                         Three signals for one fact on purpose: the colour is the fastest
                         and the only one a reader who cannot separate the hues, or who is
                         hearing the page, does not get. See the note on `trend` in the
                         script for why the colour tracks the direction and not whether the
                         direction is good news.
                         It goes with the number, not with the label: it is a fact about
                         the reading, and it disappears with the reading while the scope
                         reloads rather than hanging a stale delta over a placeholder.
                         `aria-label` says the direction in words — a screen reader gets
                         "Up 12.4%…" instead of a percentage with a decorative arrow in
                         front of it, and the glyph is `aria-hidden` inside Tag already. -->
                    <Tag
                      v-if="!tenancyReloading"
                      size="small"
                      :severity="metric.trend.direction === 'up' ? 'success' : 'danger'"
                      class="shrink-0 tabular-nums"
                      :icon="
                        metric.trend.direction === 'up' ? 'pi pi-arrow-up' : 'pi pi-arrow-down'
                      "
                      :label="`${metric.trend.direction === 'up' ? '+' : '-'}${metric.trend.delta}`"
                      :aria-label="`${metric.trend.direction === 'up' ? 'Up' : 'Down'} ${metric.trend.delta} versus the previous window`"
                    />
                  </div>
                </div>
              </div>
            </template>
          </CardBox>

          <!-- ── THE AGENT ONBOARDING, BESIDE THE READINGS ──
               The quiet promo card every module's first use already makes this offer with
               (../../components/home/FirstUsePromo.vue): the four editors' own logos as an
               overlapping cluster, the shared line under them, and the WHOLE card as one
               control — pressing it copies the setup prompt. Same component, same copy
               (`AGENT_PROMO`), so the offer is one object across Overview and every
               product's first use instead of a pill here and a card there.
               It rode the foot of the usage rail; with the rail gone it keeps the same
               place in the reading order — last, after the numbers — by taking the end of
               the same bottom band. At the rail's own width (30% of the row, capped at
               `--container-xs`) so it stays a CARD and does not stretch into a banner, and
               beside the strip rather than under it because the page is a frame from `xl`
               and a second full-width block down here is height the resource list pays for.
               The rule that used to sit above it is gone with the stack: two cards side by
               side are already two objects, and a vertical hairline between them would only
               repeat what the gap and the borders say.
               No corner glyph on it (no `href`, no `navigates`) — it copies and leaves the
               reader exactly where they were, and the glyph is what says a card takes you
               somewhere. -->
          <!-- ── DISMISSING IT IS THE ONE ANIMATED MOMENT IN THE BAND ──
               `v-if` on its own unmounted the card on the click (measured: zero
               interpolated frames), which reads as the page dropping a block rather than
               as the reader removing it. So a `<Transition>` wraps it, and only the leave
               is animated — the card arrives with the band it sits in
               (`animate-content-enter` on the aside), so an enter here would be a second
               entrance on the same element.
               It scales down a hair, slides `--spacing-xs` DOWN and fades — the exact
               inverse of the rise the band arrives with, so leaving is the entrance played
               backwards and the eye reads it as the same object departing.
               UTILITIES, NOT A KEYFRAME: both ends are known at author time, so a
               `transition-*` on the leave is the whole mechanism and nothing has to be
               added to the animation catalogue. The property list names `scale` and
               `translate` — the properties Tailwind v4's `scale-*` / `translate-y-*`
               ACTUALLY set (naming `transform` animates nothing, silently: the styling
               rule's trap). `motion-reduce:transition-none` so a reader who asked for no
               motion gets the instant removal they had before. -->
          <Transition
            leave-active-class="transition-[scale,translate,opacity] duration-moderate-01 ease-productive-exit motion-reduce:transition-none"
            leave-to-class="scale-95 translate-y-(--spacing-xs) opacity-0"
          >
            <div
              v-if="agentOnboardingVisible"
              class="relative w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)"
            >
              <FirstUsePromo
                :title="AGENT_PROMO.title"
                :description="AGENT_PROMO.description"
                @activate="copyAgentPrompt"
              >
                <!-- The marks are the EDITORS themselves, four of the five, matching the
                     cluster on every product's first use so the two are the same object at
                     the same width (../../components/home/IconFrame.vue is the one 32px
                     frame all three surfaces share). In color, not `mono`: here they are a
                     row of logos, and a reader spots the editor they use before reading a
                     word. -->
                <template #logos>
                  <IconFrame
                    v-for="agent in AGENT_TOOLS.slice(0, 4)"
                    :key="agent"
                  >
                    <AgentMark
                      :name="agent"
                      class="size-[18px] text-(--text-default)"
                    />
                  </IconFrame>
                </template>
              </FirstUsePromo>
              <!-- The dismissal is a SIBLING of the card, never inside it: the card is
                   itself a `<button>`, and a button inside a button is invalid HTML that
                   browsers un-nest at parse time — which breaks both controls. So it is
                   pinned over the corner the card's own glyph would use, and hovering it
                   does not tint the card underneath (it is outside the `group`).
                   `transparent` and `small`: it is the quietest control in the band, and
                   dismissing UNMOUNTS the card — no reserved space, nothing left tabbable.
                   The answer is persisted (lib/agent-onboarding.js), so it survives the
                   reload and the first-access surface offering the same thing. -->
              <div class="absolute right-(--spacing-xs) top-(--spacing-xs)">
                <Tooltip
                  text="Dismiss"
                  placement="top"
                >
                  <IconButton
                    icon="pi pi-times"
                    kind="transparent"
                    size="small"
                    aria-label="Dismiss agent setup"
                    @click="onAgentOnboardingClose"
                  />
                </Tooltip>
              </div>
            </div>
          </Transition>
        </aside>
      </main>

      <!-- OUTSIDE `<main>`, deliberately. The dialog teleports its panel, so what it
           leaves behind in the flow is an empty node — and inside `<main>` that node was
           still a flex child, taking one 24px `gap` after the usage strip. In a page that
           is a frame from `xl` that gap is real height: the strip stopped 24px short of
           the frame's edge, and the wire (which has no dialog) resolved into a page whose
           bottom band sat 24px higher. Out here the container has no `gap` of its own, so
           the dialog costs nothing and the strip ends where the frame does. -->
      <DeleteDialog
        v-model:open="deleteOpen"
        :kind="pendingDelete?.singular ?? 'resource'"
        :name="pendingDelete?.name ?? ''"
        @confirm="confirmDelete"
      />
    </template>
  </div>
</template>

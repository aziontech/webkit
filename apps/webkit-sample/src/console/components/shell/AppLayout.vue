<script setup>
  // The single Azion Console app shell, shared by every console page.
  //
  // THE SHAPE: the rail runs the FULL HEIGHT of the window, and the GlobalHeader sits
  // INSIDE the content zone beside it (`kind="content"`) rather than spanning the app
  // above it. Cloudflare's console is the reference, and the reason is alignment: the
  // bar's job at its leading edge is to say WHERE you are, and a breadcrumb read against
  // the page under it has to start on the same vertical. A window-wide bar cannot find
  // that vertical — it measures its inset from the window, so the gap moves with the
  // rail's width. The content-zone bar is FULL BLEED across the zone and takes the page's
  // own boundary (`--layout-boundary-inline`), which is the whole mechanism: one inset,
  // measured from the same edge as the page's.
  //
  // It does NOT chase a capped, centred page column. A page that narrows its own measure
  // on purpose — a settings form, a single-task hero — keeps its heading where it put it,
  // and the bar keeps its leading edge where the zone begins.
  //
  // What that displaced: the ACCOUNT SWITCHER used to own this bar's leading edge (as a
  // whole tenancy chain — organization / account / workspace — kept at
  // ./archive/TenancySwitcher.vue). It now sits at the top of the rail — see
  // ./AppSidebar.vue's `tenancy` — which is where Cloudflare puts the same control, and
  // the only place left that still reads outermost-inward. Below `md` the rail is off
  // screen entirely, so it comes back into the bar there (`isMobile`), where the
  // breadcrumb is hidden anyway and nothing is competing for the leading edge.
  //
  // Pages render only their own content through the default slot.
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import SplitButton from '@aziontech/webkit/split-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import HeaderSearch from '@shared/ui/HeaderSearch.vue'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { routeActivation } from '../../lib/behavior/anchor-nav'
  import { endSession } from '../../lib/state/session'
  import AccountSwitcher from './AccountSwitcher.vue'
  import AppSidebar from './AppSidebar.vue'
  import SamplePresetDrawer from './SamplePresetDrawer.vue'

  // ACCOUNT SWITCHING IS PARKED, FOR NOW.
  //
  // The account switcher (./AccountSwitcher.vue) and the roster it opens
  // (./SwitchAccountDialog.vue) are built and kept whole; what is undecided is whether
  // the console re-scopes by ACCOUNT at all, and from where. Until that is settled the
  // control is off rather than half-shown: a chain that names a tenant you cannot
  // change is a promise the console does not keep, and it takes the rail's first row
  // and the mobile bar's leading edge to make it.
  //
  // ONE flag for BOTH hosts, because there are two mount sites and exactly one of them
  // may exist at a time (the switcher owns the global ⌘O binding, so a second copy
  // would toggle a second dialog on the same keystroke). Flip it to `true` to bring the
  // rail row and the mobile pill back together — nothing else has to move.
  const ACCOUNT_SWITCHING = false

  const props = defineProps({
    // Sidebar item id to render as selected.
    active: { type: String, default: '' },
    // Breadcrumb trail for the current page, outermost first, e.g.
    // [{ label: "Applications", href: "/applications" }, { label: application.name }].
    // A page still passes its trail whatever its depth, but the bar RENDERS it only
    // from two crumbs up (see `showBreadcrumb`): a first-level page names itself in
    // its own heading, so a lone crumb of the same word is dropped here.
    breadcrumb: { type: Array, default: () => [] },
    // Whether the nav sidebar is shown. Focused flows (create/edit) hide it so
    // the form is the only thing competing for attention.
    sidebar: { type: Boolean, default: true },
    // Whether the header carries a toggle that fully collapses the rail. On by
    // default, so the sidebar toggle is available on every console page.
    collapsible: { type: Boolean, default: true },
    // Whether the content zone applies the standard page inset. Focused flows
    // that manage their own full-bleed layout (create/edit) opt out.
    padded: { type: Boolean, default: true }
  })

  const route = useRoute()
  const router = useRouter()

  // The email carried over from the login flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // Locally track the highlighted item, seeded from the page's `active` prop, so a
  // clicked row highlights on the click rather than after the route resolves. The
  // full console navigation lives inside AppSidebar; this handles routing.
  //
  // It has to FOLLOW the prop as well: the Settings module keeps one shell mounted
  // across its six pages, so this instance survives those navigations and the prop
  // is the only thing that changes on a browser Back — without the watcher the rail
  // would keep marking the page the reader came from.
  const activeItem = ref(props.active)
  watch(
    () => props.active,
    (value) => {
      activeItem.value = value
    }
  )

  // Collapsible pages let the user hide the rail entirely to reclaim the space, and drag its
  // edge to size it in between. Both are backed by a module-level singleton (persisted to
  // localStorage) so the choices survive navigation between modules and page reloads —
  // AppSidebar binds them straight to `Sidebar`'s own `collapsed` / `width` models, so this
  // shell no longer touches either. The gesture itself lives in `Sidebar`.

  // Below `md` (768px — the same breakpoint the webkit Drawer treats as mobile)
  // the fixed rail is hidden and navigation moves into a right-side Drawer opened
  // from the header. Detected with native matchMedia since @vueuse is not a
  // dependency of this sample app.
  const MOBILE_QUERY = '(max-width: 767px)'
  const isMobile = ref(false)
  const navOpen = ref(false)
  const rail = ref(null)
  let mobileMql = null
  const onMobileChange = (event) => {
    isMobile.value = event.matches
    // Re-measure once the rail is visible again — a rail measured while
    // display:none reports 0, which would leave the expanded rail invisible.
    if (!event.matches) nextTick(() => rail.value?.measure())
  }

  onMounted(() => {
    mobileMql = window.matchMedia?.(MOBILE_QUERY)
    if (mobileMql) {
      isMobile.value = mobileMql.matches
      mobileMql.addEventListener('change', onMobileChange)
    }
  })
  onUnmounted(() => {
    mobileMql?.removeEventListener('change', onMobileChange)
  })

  // `item.query` is optional and additive: a nav row carries none, and a global-search
  // result carries whatever its destination opens on — the generated settings pages read
  // the record's name from `?name=`, the same way every module's own Edit action hands it
  // over (../../lib/data/search-index.js). The email rides along on every push, so it
  // survives the trip like it does everywhere else in the shell.
  const onNavigate = (event, item) => {
    activeItem.value = item.id
    if (item.path && item.path !== route.path) {
      router.push({ path: item.path, query: { email: userEmail.value, ...item.query } })
    }
  }

  // The Drawer nav reuses the shell's navigation handlers, then dismisses itself
  // so the mobile user lands on the chosen page with the nav out of the way.
  const closeNav = () => {
    navOpen.value = false
  }
  const onMobileNavigate = (event, item) => {
    onNavigate(event, item)
    closeNav()
  }

  // THE TRAIL STARTS AT THE SECOND LEVEL. A page the sidebar routes to directly is
  // already named twice: the rail's active item says which module you are in, and the
  // page heading opening its content says what the page is (../page/PageHeading.vue).
  // A lone crumb repeating that same word is a third copy of it, and it spends the
  // bar's leading edge — the one place a reader looks to ask "where am I" — on an
  // answer they already had.
  //
  // So the breadcrumb renders from TWO crumbs up (Workloads › my-workload,
  // Applications › New Application), where it does the one job no heading can do:
  // name the ancestor you came from, as a link back to it. First level, nothing.
  //
  // A first-level page still declares its single crumb. It keeps the prop's shape
  // uniform across the console, it is the label its own children repeat as the first
  // entry of their trail, and it means the level rule lives HERE, in one line, instead
  // of in thirty page templates that each have to remember it.
  //
  // Crumb links navigate; the last crumb is the current page. It is the FIRST thing in
  // the bar — the chain that used to precede it moved to the rail — which is what lets
  // it share the page's left edge.
  const showBreadcrumb = computed(() => props.breadcrumb.length >= 2)

  // The crumb is a real anchor, so the click has to be CLAIMED before it is routed —
  // otherwise the browser follows the same href as a document load on top of the push,
  // which reloads the whole console and, on a settings page with a pending edit, raises
  // the browser's own "Leave site?" beside ours (../../lib/anchor-nav.js).
  // The brand in the bar, below `md`: a link home, like the one at the top of the rail.
  // Same guard as the crumb below — a modifier-click stays the browser's, everything else
  // is claimed for the router so the console does not reload under the push.
  const onBrand = (event) => {
    if (!routeActivation(event)) return
    onNavigate(event, { id: 'overview', label: 'Overview', path: '/home' })
  }

  const onCrumb = (event, href) => {
    if (!routeActivation(event)) return
    if (href && href !== '#') {
      // A crumb href may carry its own query (e.g. /deployments?tab=strategies);
      // split it out and merge so the target tab is preserved alongside email.
      const [path, queryString] = href.split('?')
      const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
      router.push({ path, query: { email: userEmail.value, ...extra } })
    }
  }

  const openCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  // THE GLOBAL CREATE'S OTHER WAYS IN. This is the console's front door for "make
  // something", so it is the one Create in the product that legitimately offers more than
  // one object: the reader here has not navigated to a module yet, and the split is what
  // lets them skip the Creation Center when they already know what they want.
  //
  // A resource-level Create is NOT this. On a module list the object is decided by the
  // page the reader is standing on, so that button stays one plain
  // `Create <object>` (../page/HeadingAction.vue).
  //
  // The menu names the two OBJECTS this door can make — an application and a workload —
  // and then the one method that is worth naming beside them.
  //
  // `Import from Git` is not a third object: it is the same application, entered from a
  // repository, and it lands on the CREATION CENTER (/create) — the screen that actually
  // does that work, where a provider is connected, an account scope chosen and a repo
  // picked (../../pages/resources/CreationCenter.vue). Its wording is the flow's own
  // rather than "GitHub": the step connects a provider account, but which provider is the
  // reader's business, and naming one here would narrow a door that is not narrow.
  //
  // `Create application` is the OTHER way to the same object, and the difference between
  // the two rows is only where they put the reader. It opens the application create
  // (../../pages/applications/CreateApplication.vue), whose FIRST part is the method — so
  // Import from Git is one of the three answers waiting there, beside from scratch and a
  // template. A reader who already knows the code sits in a repository takes the Git row
  // and skips that question; a reader who wants to see the choice takes this one.
  const CREATE_ACTIONS = [
    { label: 'Create application', value: 'application', icon: 'ai ai-edge-application' },
    { label: 'Create workload', value: 'workload', icon: 'ai ai-workloads' },
    { label: 'Import from Git', value: 'import-git', icon: 'pi pi-github' }
  ]

  const CREATE_ROUTES = {
    application: { path: '/applications/new' },
    workload: { path: '/workloads/new' },
    'import-git': { path: '/create' }
  }

  const onCreateAction = (item) => {
    const target = CREATE_ROUTES[item?.value]
    if (!target) return
    router.push({ ...target, query: { email: userEmail.value, ...(target.query ?? {}) } })
  }

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  // The sample's own configuration — which customer this prototype is pretending to
  // be (../../lib/sample-preset.js). The drawer is hosted HERE, not in the sidebar
  // that offers it: the rail and the mobile nav drawer are two copies of AppSidebar,
  // so a panel owned there would exist twice and the second copy would open behind
  // the first. The shell is the one thing on screen exactly once.
  const presetOpen = ref(false)

  // Account-menu entries (the sidebar footer ⋮ Dropdown). Navigations route to
  // their page; "Personal Tokens" opens the token create flow (the tokens area
  // under Account Settings), Docs opens externally, and Settings / anything else
  // lands on the /account Settings page. Soft demo entries are handled in the
  // sidebar itself and never reach here.
  const onAccountSelect = (event, value) => {
    if (value === 'sample-preset') {
      presetOpen.value = true
    } else if (value === 'personal-tokens') {
      router.push({ path: '/personal-tokens', query: { email: userEmail.value } })
    } else if (value === 'home') {
      router.push({ path: '/home', query: { email: userEmail.value } })
    } else if (value === 'docs') {
      // The in-app documentation, not azion.com — the demo has its own docs route, so this
      // stays inside the SPA instead of throwing the reader out to a new tab.
      router.push('/site/docs')
    } else {
      openAccount()
    }
  }

  // Logging out deliberately: the session closes with no ceremony — no wire and no
  // "Session expired" toast, because the operator asked for this and knows why they
  // are on Sign In. That is the whole difference between this and an expiry (see
  // ../../lib/session.js).
  const signOut = () => {
    endSession()
    router.push('/login')
  }

  // Drawer variants of the create / account-menu / logout handlers — dismiss the
  // nav first, so the mobile user lands on the target with the nav out of the way.
  const onMobileCreate = () => {
    closeNav()
    openCreationCenter()
  }
  const onMobileSelect = (event, value) => {
    closeNav()
    onAccountSelect(event, value)
  }
  const onMobileLogout = () => {
    closeNav()
    signOut()
  }

  // SEARCH, from the head of the bar's trailing cluster (`HeaderSearch`). The trigger is
  // the bar's; the
  // PALETTE is still the rail's — its list is the rail's own navigation plus the
  // app-level commands, all built from the tree in AppSidebar, so moving the list up
  // here would mean rebuilding that tree twice. The rail stays mounted at every width
  // (below `md` it is CSS-hidden, not removed) and the palette teleports to the body, so
  // the one copy is reachable from anywhere — the same forwarding the Overview hero's
  // search field uses through `defineExpose` below.
  //
  // The nav sheet closes first, because the palette REPLACES it rather than stacking over
  // it: two overlays would trap focus in the one underneath. Below `lg` the trigger is
  // the bar's own 32px square, so the sheet carries no search row of its own and the
  // drawer copy of the rail is navigation only (`:palette="false"`).
  const openPalette = () => {
    closeNav()
    rail.value?.showPalette()
  }

  // The DS focus trap moves initial focus to the panel's FIRST focusable, which here is
  // the search field — that reads as if the drawer opened mid-search, and a focused input
  // is what makes mobile Safari zoom the viewport in. Park focus on the panel itself
  // instead (`role="dialog"`, `tabindex="-1"`), which is the conventional initial focus for
  // a dialog; Tab from there still walks into the nav from the top. Scheduled on a frame
  // because the trap's own focus call runs in the microtask after open.
  const navPanel = ref(null)
  watch(navOpen, (open) => {
    if (!open) return
    globalThis.requestAnimationFrame(() => navPanel.value?.$el?.focus?.())
  })

  // A PAGE may open the palette too — the first-access Overview leads with a search
  // field in its hero (HomeEmptyState.vue), and that field has to open the SAME
  // palette the rail owns. It cannot mount its own: the ⌘K shortcut and the command
  // list live in the rail's copy, and a second palette would fight it for the
  // shortcut and drift from its groups. So the shell forwards the one call, the same
  // way it does for the mobile drawer above.
  defineExpose({ showPalette: () => rail.value?.showPalette() })
</script>

<template>
  <!-- The window: one row. The rail runs its full height, the content zone holds the
       bar and the page. That is the whole structural change behind the alignment — the
       bar can only find the page's left edge from inside the box the page is in.

       THE INSET IS NOT DECLARED HERE. The bar and the page both read
       `--layout-boundary-inline`, and the console takes the token's own value (16 on a
       phone, 24 from `sm`) — so every console shell, this one and the create flows and
       the wizards alike, opens on the same vertical without restating it. A surface
       that wants another step declares its own on its shell root: the site and the hub
       widen from `sm` up, the docs column runs tighter. See src/style.css. -->
  <div class="relative flex h-dvh overflow-hidden bg-(--bg-canvas)">
    <!-- The rail, now full-height: it starts at the top of the window, above where the
         bar used to be. Hidden in focused flows. On a
         collapsible page the rail stays mounted and its width animates to 0 while its
         content slides out to the left; the content zone below is `flex-1`, so it morphs
         to fill the freed space on the same frames. The gesture — the drag on the rail's
         trailing edge, the collapse trigger at the bottom, the keyboard nudge, the
         affordance that brings a collapsed rail back — belongs to `Sidebar` itself, so
         this shell owns only the persisted state and what the rail carries. Below `md`
         the rail is hidden and navigation moves into the Drawer further down, so the
         gesture is off there: there is nothing to collapse. -->
    <AppSidebar
      v-if="sidebar"
      ref="rail"
      class="hidden h-full md:block"
      :user="userEmail"
      :active="activeItem"
      :collapsible="collapsible && !isMobile"
      :tenancy="ACCOUNT_SWITCHING && !isMobile"
      aria-label="Main navigation"
      @navigate="onNavigate"
      @create="openCreationCenter"
      @select="onAccountSelect"
      @logout="signOut"
    />

    <!-- THE CONTENT ZONE: the bar, then the page. Both are FULL BLEED across the zone and
         both take the same page boundary inset — `--layout-boundary-inline`, from
         `kind="content"` on the bar and from `.layout-boundary` on the scroll box below —
         so the breadcrumb opens on the same vertical as the page's content. Retuning the
         boundary moves both, in one place (packages/theme's layout tokens). -->
    <div class="flex min-w-0 flex-1 flex-col">
      <!-- `@container`, because the search in the trailing cluster switches between its two
           shapes on THIS BAR's width. The bar is the only box in the header whose width is
           independent of what is inside it (`w-full` off the content zone), and the console
           bar is ~300px narrower than the docs bar at every window because the rail is
           beside it — which is why a viewport breakpoint could not serve both.
           See @shared/ui/HeaderSearch.vue. -->
      <GlobalHeader
        kind="content"
        aria-label="Azion Console"
        class="@container"
      >
        <!-- `justify-start!`, because the DS region ships `justify-end` — a left region
           that packs its children against its own trailing edge. It is invisible while
           the region is content-sized (it grows 0, so there is no free space to
           distribute), and it becomes visible the moment anything gives the row slack
           or takes it away: the chain drifts toward the middle, and under pressure it
           overflows off the START edge, clipping the outermost tenant instead of the
           innermost link. The gap between the links stays the region's own — spacing
           is the gap's job, not the justification's.
           Important, not a plain class: `justify-start` and `justify-end` are the same
           property, and the winner is CSS source order, not the order they are written
           in the attribute. -->
        <GlobalHeader.Left class="justify-start!">
          <!-- Mobile nav trigger: below `md` the rail is hidden, so this
             hamburger opens the right-side Drawer that carries the full
             navigation. -->
          <Tooltip
            v-if="sidebar && isMobile"
            key="nav-trigger"
            text="Open navigation"
            placement="bottom"
          >
            <IconButton
              icon="pi pi-bars"
              aria-label="Open navigation"
              kind="outlined"
              size="medium"
              @click="navOpen = true"
            />
          </Tooltip>

          <!-- BRAND, below `md` only: the rail carries it at every wider width, and two
               copies of the same lockup on one screen is one too many.

               THE FULL WORDMARK AT EVERY MOBILE WIDTH. This used to swap kinds by width —
               `reduced` (the bare "A" glyph) below `sm`, `default` above it — on the
               assumption that a phone bar could not spend the wordmark's width. It can:
               `default` at `size="small"` is a 90×18 viewBox at 16px, so 80px of bar, and
               the row still lays out with room to spare at 320px (measured: 0px of
               overflow at 320 / 360 / 375 / 414, the phone widths this shell is used at).
               Which makes the glyph a cost with no payer — it dropped the product's NAME
               to buy 61px nobody needed, and it made the identity change shape halfway
               down the viewport. One Brand now covers every width under `md`, in the same
               `default` + `small` pair the rail above it renders, so the mark reads
               identically whether the rail is on screen or the bar is standing in for
               it. -->
          <a
            href="/home"
            aria-label="Azion home"
            class="flex h-6 w-fit shrink-0 items-center rounded-(--shape-button) px-(--spacing-xxs) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none md:hidden"
            @click="onBrand"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>

          <!-- Below `md` the rail — and with it the account switcher at its top — is off
             screen, so identity comes back HERE, next to the hamburger that opens the
             nav. It is the only chrome left on a phone that can say which tenant you are
             acting as, and it costs the breadcrumb nothing: the crumb is hidden at this
             width anyway (see below), so nothing is competing for the leading edge.
             `v-if`, not a `hidden md:flex` class: the switcher owns the global ⌘O
             binding, and a second mounted copy would toggle a second panel on the same
             keystroke. Exactly one of the two instances exists at any width. -->
          <AccountSwitcher v-if="ACCOUNT_SWITCHING && isMobile" />

          <!-- LOCATION, and the reason this bar sits in the content zone at all: the first
             crumb has to land on the same vertical as the page heading below it. That
             comes from the Row above — the page boundary inset plus the page column's own
             cap and centring — and from the negative inline margin here, which pulls back
             the crumb's own `--spacing-xs` of padding (its hover/focus ghost extends past
             the glyph, so the TEXT is inset by that much from the control's box). Without
             it the crumb reads 8px right of the heading, which is exactly the kind of
             near-miss that looks like a mistake rather than a margin.

           `w-auto`, against the DS root's own `w-full`: as a flex item in a
           content-sized region that is the width of nothing in particular, so the
           trail collapsed to its `truncate` and read "Custom Pa…" with two thirds of
           the bar empty beside it. It merges through `cn`, so the later utility wins.

             It appears from `md`, where the rail exists and the chain has moved out of
             this bar, and only from the SECOND level up (see `showBreadcrumb`). Below
             `md` the chain is here instead and the crumb gives way: the page below
             repeats its last crumb as the page heading, and the chain repeats
             nowhere. -->
          <Breadcrumb
            v-if="showBreadcrumb"
            :items="breadcrumb"
            class="-ml-(--spacing-xs) hidden w-auto min-w-0 shrink md:flex"
            @navigate="onCrumb"
          />
        </GlobalHeader.Left>
        <!-- The empty spacer. It is the region that GROWS, so it is what holds the trailing
             cluster against the end of the bar; nothing lives in it. Search used to, packed
             against its trailing edge — which put the control one region away from the
             actions it belongs with. It is in `Right` now. -->
        <GlobalHeader.Middle />
        <GlobalHeader.Right>
          <!-- SEARCH LEADS THE ACTIONS. It is one of them — the utility you reach for before
               you know what you want — so it sits at the head of this cluster rather than
               alone in the middle of the bar, and takes the cluster's own `--spacing-sm`
               rhythm like every control beside it. Wide it is a 160px field; narrow it is
               the DS IconButton, matching the icon-only shapes the rest of the cluster
               collapses to at the same widths.

               `v-if="sidebar"`, because the palette it opens lives in the rail: a focused
               flow that drops the rail drops the palette with it, and a search field that
               opens nothing is worse than no search field. -->
          <HeaderSearch
            v-if="sidebar"
            label="Search"
            @click="openPalette"
          />

          <!-- Below `md` the header actions collapse to icon-only buttons to fit
             the narrow bar; from `md` up they carry their labels. A Tooltip
             names each icon on hover/focus, matching the left-side controls.

             Agent is a ButtonHighlight — the gradient/glow treatment reserved
             for the assistant entry point, so it reads as the one special
             control in the bar while Create stays a plain `secondary` action.
             ButtonHighlight requires a label, so the mobile branch keeps an
             IconButton (icon-only has no highlight variant).

             Its glyph is `ai-ask-azion` — the Azion assistant mark, a speech
             bubble carrying a sparkle. It is deliberately NOT a sparkles-only
             glyph: neither icon set this app loads has a working one.
             `pi-sparkles` does not exist in the pinned `primeicons@6.0.1` (only
             in the newer copy bundled inside @aziontech/icons, which
             src/style.css does not import), and `ai-sparkles` IS declared but
             its glyph is broken in azionicons.woff2 — it draws a solid filled
             square, unlike every other azion icon. Neither set ships a cursor /
             mouse-pointer glyph at all, and Button takes an icon CLASS, not a
             slot, so an inline SVG is not an option here. -->
          <template v-if="isMobile">
            <Tooltip
              text="Create"
              placement="bottom"
            >
              <IconButton
                icon="pi pi-plus-circle"
                kind="secondary"
                size="medium"
                aria-label="Create"
                @click="openCreationCenter"
              />
            </Tooltip>
            <Tooltip
              text="Agent"
              placement="bottom"
            >
              <IconButton
                icon="ai ai-ask-azion"
                kind="outlined"
                size="medium"
                aria-label="Agent"
              />
            </Tooltip>
          </template>
          <template v-else>
            <!-- The primary segment is the front door it always was; the menu is the
                 shortcut past it. Mobile keeps the single icon button above: a split
                 button's second segment is a 20px target beside another 20px target, and
                 the Creation Center it opens already lists every path as a full row. -->
            <SplitButton
              label="Create"
              kind="secondary"
              size="medium"
              icon="pi pi-plus-circle"
              :model="CREATE_ACTIONS"
              @click="openCreationCenter"
              @item-click="(event, item) => onCreateAction(item)"
            />
            <ButtonHighlight
              label="Agent"
              size="medium"
              icon="ai ai-ask-azion"
            />
          </template>

          <button
            type="button"
            aria-label="Account settings"
            class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            @click="openAccount"
          >
            <Avatar
              :label="userEmail"
              size="medium"
              kind="square"
            />
          </button>
        </GlobalHeader.Right>
      </GlobalHeader>

      <!--
        THE ROUTE TRANSITION lives here, on the content zone alone: the page
        arrives from the left and travels right into place (`animate-page-enter`, see
        src/styles/motion.css), while the header and the rail — the same chrome
        before and after — stay put. Sliding those would read as a full reload
        of an app that did not reload.

        `:key="route.path"`, and the path rather than the full path: most
        routes mount their own component, so the entrance would already play
        on mount, but one component serves several paths (Settings owns
        /account, /account/users, /account/teams …) and a detail view stays
        mounted across a change of id. Keying on the path replays the arrival
        for those too. The QUERY is deliberately excluded — `?tab=`, a filter
        or the carried email is the same page answering differently, and
        re-entering it on every keystroke would be noise.
      -->
      <div
        :key="route.path"
        class="animate-page-enter motion-reduce:animate-none min-h-0 flex-1 overflow-auto"
        :class="{ 'layout-boundary': padded }"
      >
        <slot />
      </div>
    </div>

    <!-- Mobile navigation: the same AppSidebar, hosted in a right-side Drawer
         that the header hamburger opens below `md`. Navigating, selecting an
         account entry, or logging out dismisses it. `shortcut=""` gives up the
         global ⌘K binding — the rail above already owns it, and while the drawer
         is open both sidebars are mounted, which would otherwise open two
         command palettes at once. -->
    <Drawer
      v-if="sidebar"
      v-model:open="navOpen"
      side="right"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent
          ref="navPanel"
          aria-label="Navigation"
        >
          <AppSidebar
            :user="userEmail"
            :active="activeItem"
            aria-label="Main navigation"
            fluid
            :palette="false"
            shortcut=""
            @navigate="onMobileNavigate"
            @create="onMobileCreate"
            @select="onMobileSelect"
            @logout="onMobileLogout"
          />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>

    <!-- The sample's own configuration, opened from the account menu on either
         sidebar. The mobile nav drawer closes itself before handing the selection
         over (`onMobileSelect`), so the two right-side panels never stack. It
         teleports to the body, so it costs the shell nothing until it is asked for. -->
    <SamplePresetDrawer v-model:open="presetOpen" />
  </div>
</template>

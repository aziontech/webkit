<script setup>
  // The single Azion Console app shell, shared by every console page.
  //
  // The GlobalHeader spans the FULL width of the app, above the sidebar, and owns
  // the tenancy chain: the Azion mark, then the organization, the account and the
  // workspace — `Azion / Azion / Magalu / Ecommerce` — followed by the breadcrumb
  // for the module the user entered. Each link narrows the one before it: who you
  // belong to, whose infrastructure you operate, which slice of it you are in. The rail below it is navigation and nothing else. That split is
  // deliberate: identity ("who am I acting as") is global and outranks the rail,
  // which only answers "where in this tenant am I". Keeping both in the sidebar
  // made one column answer two unrelated questions, and pinned the switcher to a
  // rail that collapses.
  //
  // Pages render only their own content through the default slot.
  import { curve, duration } from '@aziontech/theme/animations'
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { useSidebar } from '../../sidebar.js'
  import AccountSwitcher from './AccountSwitcher.vue'
  import AppSidebar from './AppSidebar.vue'
  import OrgSwitcher from './OrgSwitcher.vue'
  import WorkspaceSwitcher from './WorkspaceSwitcher.vue'

  const props = defineProps({
    // Sidebar item id to render as selected.
    active: { type: String, default: '' },
    // Breadcrumb trail for the current module, e.g. [{ label: "Applications" }].
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

  // Locally track the highlighted item, seeded from the page's `active` prop.
  // The full console navigation lives inside AppSidebar; this handles routing.
  const activeItem = ref(props.active)

  // Collapsible pages let the user hide the rail entirely to reclaim the space,
  // and drag its edge to size it in between. Both are backed by a module-level
  // singleton (persisted to localStorage) so the choices survive navigation
  // between modules and page reloads.
  const { collapsed, railWidth } = useSidebar()

  // ── Sidebar slide timing — tweak these token keys and reload to test ──
  // They index the motion tokens from @aziontech/theme/animations (DESIGN.md
  // § Motion), so the resolved ms / cubic-bezier come from the design system,
  // never hardcoded here. Available keys:
  //   duration: fast-01 (70ms) · fast-02 (110ms) · moderate-01 (150ms) ·
  //             moderate-02 (240ms) · slow-01 (400ms) · slow-02 (700ms)
  //   curve:    productive-entrance · productive-exit ·
  //             expressive-entrance · expressive-exit
  const SIDEBAR_DURATION = 'moderate-02'
  const SIDEBAR_ENTER_CURVE = 'expressive-entrance'
  const SIDEBAR_LEAVE_CURVE = 'expressive-exit'

  // Resolved token values (what actually gets applied) — the inline comments
  // show the ms / cubic-bezier each key currently maps to.
  const sidebarDurationValue = duration[SIDEBAR_DURATION] // 'moderate-02' → 240ms
  const sidebarEnterCurveValue = curve[SIDEBAR_ENTER_CURVE] // 'expressive-entrance' → cubic-bezier(0.17, 0.84, 0.44, 1)
  const sidebarLeaveCurveValue = curve[SIDEBAR_LEAVE_CURVE] // 'expressive-exit' → cubic-bezier(0.95, 0.05, 0.8, 0.04)

  const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  // Below `md` (768px — the same breakpoint the webkit Drawer treats as mobile)
  // the fixed rail is hidden and navigation moves into a right-side Drawer opened
  // from the header. Detected with native matchMedia (like `prefersReducedMotion`
  // above) since @vueuse is not a dependency of this sample app.
  const MOBILE_QUERY = '(max-width: 767px)'
  const isMobile = ref(false)
  const navOpen = ref(false)
  let mobileMql = null
  const onMobileChange = (event) => {
    isMobile.value = event.matches
    // Re-measure once the rail is visible again — a rail measured while
    // display:none reports 0, which would leave the expanded rail invisible.
    if (!event.matches) nextTick(measureRail)
  }

  // The rail stays mounted; collapsing animates its WIDTH to 0 (and slides the
  // inner sidebar out via translateX). Because the content zone is `flex-1`, it
  // morphs frame-by-frame to fill the freed space on the SAME timing — the main
  // container and the sidebar animate as one. The width is a real length at both
  // ends of the transition: it comes from the singleton once the user has sized
  // the rail, and is seeded from the rail's own natural width before that.
  const railRef = ref(null)
  const measureRail = () => {
    if (railWidth.value == null && railRef.value?.offsetWidth) {
      railWidth.value = clampRail(railRef.value.offsetWidth)
    }
  }

  // ── Resizable rail (native pointer drag, no library — the same pattern as the
  // SQL Database detail splitter) ──
  // The bounds come from the container scale, read off the theme at runtime so
  // the cap is a token rather than a magic number: the rail may shrink to
  // `--container-3xs` and may not grow past `--container-sm`. Dragging further
  // left than SNAP px past the minimum collapses the rail out of the layout
  // instead of pinning it at the minimum — the pull IS the collapse gesture,
  // and the width it had is kept for when it comes back.
  const RAIL_MIN_TOKEN = '--container-3xs'
  const RAIL_MAX_TOKEN = '--container-sm'
  const RAIL_MIN_FALLBACK = 256
  const RAIL_MAX_FALLBACK = 408
  const COLLAPSE_SNAP = 56
  const NUDGE_STEP = 16
  // How faint the rail gets at zero presence. Not 0: a rail being pulled in or
  // dropped out should stay legible enough to read as the same object moving,
  // and the width/translate already carry the "gone".
  const RAIL_MIN_OPACITY = 0.2

  const railMin = ref(RAIL_MIN_FALLBACK)
  const railMax = ref(RAIL_MAX_FALLBACK)
  const readTokenPx = (token, fallback) => {
    const value = Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(token)
    )
    return Number.isFinite(value) && value > 0 ? value : fallback
  }
  const clampRail = (value) => Math.min(Math.max(value, railMin.value), railMax.value)

  const resizing = ref(false)
  let resizeStartX = 0
  let resizeStartWidth = 0
  let restoreWidth = 0

  // The gesture is continuous on both sides of the boundary, and one number
  // carries it: `pullProgress` is how present the rail is while the pointer is
  // down — 0 fully out of the layout, 1 fully in. Width, slide and opacity all
  // read from it, so a half-pulled rail is half in AND half faded. That is what
  // makes opening feel like picking the rail up off the edge and dragging it
  // into the layout, instead of tripping a switch at an invisible line.
  // `peekWidth` is the sliver the pull has revealed while the rail is still
  // formally collapsed; the rail's edge sits exactly under the cursor.
  const pullProgress = ref(1)
  const peekWidth = ref(0)
  const peeking = computed(() => resizing.value && collapsed.value)

  const onResizeMove = (event) => {
    const next = resizeStartWidth + (event.clientX - resizeStartX)

    // Appearance is ONE monotonic function of how far out the rail is — a full
    // minimum-width rail is fully present, half of one is half present. Both
    // directions read the same ramp, so the fade never inverts as the gesture
    // crosses a commit point.
    pullProgress.value = Math.max(0, Math.min(1, next / railMin.value))
    peekWidth.value = Math.max(0, Math.min(next, railMin.value))

    if (collapsed.value) {
      // Held out of the layout, the panel rides the cursor: its right edge sits
      // under the pointer, growing and fading in as it is pulled. It commits
      // only once the pull has earned a whole minimum-width rail — more than
      // dragging in has to give up to collapse, so the rail cannot flicker in
      // and out around a single pixel.
      if (next >= railMin.value) {
        collapsed.value = false
        railWidth.value = clampRail(next)
      }
      return
    }

    if (next < railMin.value - COLLAPSE_SNAP) {
      // The width the rail had when the drag began is restored on collapse, so
      // re-expanding returns the size the user chose, not the minimum.
      railWidth.value = clampRail(restoreWidth)
      collapsed.value = true
      return
    }

    railWidth.value = clampRail(next)
  }

  const onResizeEnd = () => {
    if (!resizing.value) return
    resizing.value = false
    // Releasing hands the rail back to the transition: whatever fraction it was
    // pulled to animates to fully in or fully out on the motion tokens.
    peekWidth.value = 0
    pullProgress.value = 1
    document.body.style.removeProperty('user-select')
    document.body.style.removeProperty('cursor')
    window.removeEventListener('pointermove', onResizeMove)
    window.removeEventListener('pointerup', onResizeEnd)
  }

  const onResizeStart = (event) => {
    const fromCollapsed = collapsed.value
    resizing.value = true
    resizeStartX = event.clientX
    // From collapsed the gesture starts at zero, so the rail's edge tracks the
    // pointer's distance from the viewport edge — pull and the rail comes out
    // from under the cursor.
    resizeStartWidth = fromCollapsed ? 0 : (railWidth.value ?? railMin.value)
    restoreWidth = railWidth.value ?? railMin.value
    pullProgress.value = fromCollapsed ? 0 : 1
    peekWidth.value = 0
    // The drag crosses the whole page — kill text selection, and keep a cursor
    // that matches the gesture: picking the rail up off the edge is a grab,
    // sizing it in place is a resize.
    document.body.style.userSelect = 'none'
    document.body.style.cursor = fromCollapsed ? 'grabbing' : 'col-resize'
    window.addEventListener('pointermove', onResizeMove)
    window.addEventListener('pointerup', onResizeEnd)
    event.preventDefault()
  }

  // Keyboard equivalent of the drag: the separator is focusable, arrows nudge.
  // Left past the snap point collapses; right from collapsed restores.
  const nudgeRail = (delta) => {
    if (collapsed.value) {
      if (delta > 0) collapsed.value = false
      return
    }
    const next = (railWidth.value ?? railMin.value) + delta
    if (next < railMin.value - COLLAPSE_SNAP) {
      collapsed.value = true
      return
    }
    railWidth.value = clampRail(next)
  }

  onMounted(() => {
    mobileMql = window.matchMedia?.(MOBILE_QUERY)
    if (mobileMql) {
      isMobile.value = mobileMql.matches
      mobileMql.addEventListener('change', onMobileChange)
    }
    railMin.value = readTokenPx(RAIL_MIN_TOKEN, RAIL_MIN_FALLBACK)
    railMax.value = readTokenPx(RAIL_MAX_TOKEN, RAIL_MAX_FALLBACK)
    if (railWidth.value != null) railWidth.value = clampRail(railWidth.value)
    measureRail()
  })
  onUnmounted(() => {
    mobileMql?.removeEventListener('change', onMobileChange)
    onResizeEnd()
  })

  // Phase-aware timing: entrance curve when expanding, exit curve when
  // collapsing — same duration token for both. Width + transform share it, so
  // the slide and the morph stay locked together.
  const railTransition = computed(() => {
    // A drag has to track the pointer frame-for-frame; an eased width would lag
    // behind the cursor and read as a broken handle.
    if (resizing.value || prefersReducedMotion()) return 'none'
    const curveValue = collapsed.value ? sidebarLeaveCurveValue : sidebarEnterCurveValue
    const timing = `${sidebarDurationValue} ${curveValue}`
    return `width ${timing}, transform ${timing}, opacity ${timing}`
  })

  // Outer rail: the width that the content morphs against. While a pull is in
  // flight that width is the pulled distance, so the page reflows under the
  // gesture in real time. On mobile the rail is hidden via CSS and nav lives in
  // the Drawer, so no inline width is applied.
  const railStyle = computed(() => {
    if (isMobile.value) return {}
    if (peeking.value) return { width: `${peekWidth.value}px`, transition: 'none' }
    return {
      width: railWidth.value == null ? undefined : collapsed.value ? '0px' : `${railWidth.value}px`,
      transition: railTransition.value
    }
  })

  // How present the rail is, as one number the whole animation reads from: while
  // dragging it is the live pull, otherwise it is simply in (1) or out (0).
  const railPresence = computed(() => {
    if (isMobile.value) return 1
    if (resizing.value) return pullProgress.value
    return collapsed.value ? 0 : 1
  })

  // Inner sidebar: kept at a fixed width (so its own layout never reflows while
  // the rail shrinks), slid out to the left and faded on the same number — the
  // fade is what stops a half-emerged rail from reading as a clipped one.
  //
  // Two details make the pull continuous. While peeking the panel is sized to
  // the width it will COMMIT to, so nothing resizes at the instant it lands. And
  // the slide only applies while the rail is out of the layout, where the rail
  // clips it: translating a rail that is in the layout would open a gap between
  // it and the page. In the snap zone the rail therefore only fades — which is
  // what telegraphs the drop — while its width stays pinned at the minimum.
  const railInnerStyle = computed(() => {
    const width = peeking.value ? railMin.value : railWidth.value
    const presence = railPresence.value
    return {
      width: width == null ? undefined : `${width}px`,
      transform: collapsed.value ? `translateX(${(presence - 1) * 100}%)` : 'none',
      opacity: RAIL_MIN_OPACITY + (1 - RAIL_MIN_OPACITY) * presence,
      transition: railTransition.value
    }
  })

  const onNavigate = (event, item) => {
    activeItem.value = item.id
    if (item.path && item.path !== route.path) {
      router.push({ path: item.path, query: { email: userEmail.value } })
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

  // The header always names the current location: the breadcrumb renders on
  // every page that passes one, from a single first-level crumb (Home,
  // Applications) up through a nested trail (Applications › New Application).
  // Crumb links navigate; the last crumb is the current page.
  const showBreadcrumb = computed(() => props.breadcrumb.length >= 1)

  const onCrumb = (event, href) => {
    if (href && href !== '#') {
      // A crumb href may carry its own query (e.g. /account?tab=teams-permissions);
      // split it out and merge so the target tab is preserved alongside email.
      const [path, queryString] = href.split('?')
      const extra = Object.fromEntries(new URLSearchParams(queryString || ''))
      router.push({ path, query: { email: userEmail.value, ...extra } })
    }
  }

  const openCreationCenter = () =>
    router.push({ path: '/create', query: { email: userEmail.value } })

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  // Account-menu entries (the sidebar footer ⋮ Dropdown). Navigations route to
  // their page; "Personal Tokens" opens the token create flow (the tokens area
  // under Account Settings), Docs opens externally, and Settings / anything else
  // lands on the /account Settings page. Soft demo entries are handled in the
  // sidebar itself and never reach here.
  const onAccountSelect = (event, value) => {
    if (value === 'personal-tokens') {
      router.push({ path: '/personal-tokens', query: { email: userEmail.value } })
    } else if (value === 'home') {
      router.push({ path: '/home', query: { email: userEmail.value } })
    } else if (value === 'docs') {
      window.open('https://www.azion.com/en/documentation/', '_blank', 'noopener')
    } else {
      openAccount()
    }
  }

  const signOut = () => router.push('/login')

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
</script>

<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-[var(--bg-canvas)]">
    <!-- The header spans the FULL width of the app, above the rail — it is the
         one piece of chrome that outranks navigation. Left to right it reads
         outermost tenant inward: the Azion mark, the organization, the account,
         then the module breadcrumb. -->
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Left>
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

        <!-- The tenancy chain. The mark is the minimal Azion glyph and the way
             back to the console home; a RouterLink (not a button) so the user
             keeps middle-click / open-in-new-tab.

             It is NOT wrapped in GlobalHeader.Brand: that region pins any svg
             inside it to 18px with a descendant rule, which outranks a class on
             the svg itself. The chain's mark is specified at 20 (`--size-5`),
             the same box as the org and account marks beside it, so the three
             sit on one baseline. The glyph is 21x18, so it fits INSIDE the 20px
             box (preserveAspectRatio) rather than being stretched to fill it. -->
        <RouterLink
          :to="{ path: '/home', query: { email: userEmail } }"
          aria-label="Azion — home"
          class="inline-flex shrink-0 items-center self-center rounded-[var(--shape-elements)] transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
        >
          <AzionLogoMin
            class="size-[var(--size-5)]"
            aria-label="Azion"
          />
        </RouterLink>

        <span
          class="shrink-0 text-body-sm text-[var(--text-muted)]"
          aria-hidden="true"
          >/</span
        >
        <OrgSwitcher />

        <span
          class="shrink-0 text-body-sm text-[var(--text-muted)]"
          aria-hidden="true"
          >/</span
        >
        <AccountSwitcher
          @select="onAccountSelect"
          @navigate="onNavigate"
        />

        <!-- The innermost link is the first thing the chain gives up: below `md`
             three marks plus the hamburger and the header actions do not fit,
             and they collapse into an unreadable row of initials. Organization
             and account survive; the workspace comes back at `md`. -->
        <div class="hidden items-center gap-[var(--spacing-xs)] md:flex">
          <span
            class="shrink-0 text-body-sm text-[var(--text-muted)]"
            aria-hidden="true"
            >/</span
          >
          <WorkspaceSwitcher />
        </div>

        <!-- Location, separated from identity by a rule rather than another
             slash: the chain above says WHO you are acting as, the breadcrumb
             says WHERE you are.

             It appears at `lg`, not `md`, and that is a hard requirement rather
             than taste: the DS Popover.Trigger is `shrink-0`, so a pill cannot
             compress to make room. Below `lg` the chain plus the breadcrumb
             plus the header actions over-subscribe the row, and the overflow
             does not clip — it paints one control on top of the next. The
             breadcrumb is what gives way, because the page below it repeats its
             last crumb as the page heading and the chain does not repeat
             anywhere. -->
        <div
          v-if="showBreadcrumb"
          class="hidden min-w-0 items-center gap-[var(--spacing-xs)] lg:flex"
        >
          <span
            class="h-4 w-px shrink-0 bg-[var(--border-muted)]"
            aria-hidden="true"
          />
          <Breadcrumb
            :items="breadcrumb"
            @navigate="onCrumb"
          />
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <!-- Below `md` the header actions collapse to icon-only buttons to fit
             the narrow bar; from `md` up they carry their labels. A Tooltip
             names each icon on hover/focus, matching the left-side controls.

             Agent is `outlined`, so Create is the only filled control in the
             header and stays the unambiguous primary action.

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
          <Button
            label="Create"
            kind="secondary"
            size="medium"
            icon="pi pi-plus-circle"
            @click="openCreationCenter"
          />
          <Button
            label="Agent"
            kind="outlined"
            size="medium"
            icon="ai ai-ask-azion"
          />
        </template>

        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
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

    <!-- Everything under the header: the navigation rail and the page. -->
    <div class="relative flex min-h-0 flex-1">
      <!-- Single, full-height Azion app sidebar (hidden in focused flows). On a
         collapsible page the rail stays mounted and its width animates to 0
         while the inner sidebar slides out to the left; the content zone morphs
         to fill the space on the same timing. -->
      <div
        v-if="sidebar"
        ref="railRef"
        class="relative hidden shrink-0 overflow-hidden md:block"
        :style="railStyle"
        :inert="collapsed || isMobile || null"
        :aria-hidden="collapsed || isMobile || null"
      >
        <AppSidebar
          class="h-full"
          :style="railInnerStyle"
          :user="userEmail"
          :active="activeItem"
          :collapsible="collapsible && !isMobile"
          aria-label="Main navigation"
          @navigate="onNavigate"
          @create="openCreationCenter"
          @select="onAccountSelect"
          @logout="signOut"
        />

        <!-- Resize handle: the rail's own right edge. Drag to size it between
           `--container-3xs` and `--container-sm`; drag past the minimum and the
           rail collapses out of the layout. Arrow keys nudge it, double-click
           collapses it. The line only shows on hover / focus / drag so the rail
           reads as a flat edge at rest. -->
        <div
          v-if="collapsible"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize sidebar"
          tabindex="0"
          :data-resizing="resizing || null"
          class="group absolute inset-y-0 right-0 z-10 w-[var(--spacing-xs)] cursor-col-resize outline-none"
          @pointerdown="onResizeStart"
          @keydown.left.prevent="nudgeRail(-NUDGE_STEP)"
          @keydown.right.prevent="nudgeRail(NUDGE_STEP)"
          @dblclick="collapsed = true"
        >
          <span
            class="pointer-events-none absolute inset-y-0 right-0 w-[var(--border-2)] bg-[var(--accent)] opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[resizing]:opacity-100 motion-reduce:transition-none"
          />
        </div>
      </div>

      <!-- Collapsed edge affordance — the OPEN side of the pair. Collapsing is
         driven from the control at the bottom of the rail itself; that control
         goes inert with the rail, so bringing it back belongs here. This zone
         takes over the shell's left edge while the rail is out, and hovering it —
         or focusing anything inside it, which is how a keyboard reaches it —
         reveals the two ways back: the grab bar (pull the rail out from under the
         cursor; it grows and fades in with the pull, and drops back if released
         short of the boundary) and the trigger, centered on the edge and stepping
         out of the way once a pull is under way. Both stay hidden at rest so the
         collapsed layout is genuinely clean. -->
      <Transition
        enter-active-class="transition-opacity duration-200 ease-out motion-reduce:transition-none"
        leave-active-class="transition-opacity duration-200 ease-out motion-reduce:transition-none"
        enter-from-class="opacity-0"
        leave-to-class="opacity-0"
      >
        <div
          v-if="sidebar && collapsible && !isMobile && collapsed"
          :data-resizing="resizing || null"
          class="group absolute inset-y-0 left-0 z-20"
        >
          <!-- The bar: grab it and pull right to bring the rail back. `grab` /
               `grabbing` rather than `col-resize` — from here the gesture is
               picking the rail up, not sizing one that is already in place. -->
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="Expand sidebar by dragging"
            tabindex="0"
            class="absolute inset-y-0 left-0 w-[var(--spacing-sm)] cursor-grab outline-none active:cursor-grabbing"
            @pointerdown="onResizeStart"
            @keydown.right.prevent="nudgeRail(NUDGE_STEP)"
          >
            <span
              class="pointer-events-none absolute inset-y-0 left-0 w-[var(--border-2)] bg-[var(--accent)] opacity-0 transition-opacity duration-fast-02 ease-productive-entrance group-hover:opacity-100 group-focus-within:opacity-100 group-data-[resizing]:opacity-100 motion-reduce:transition-none"
            />
          </div>

          <div
            class="absolute left-[var(--spacing-xs)] top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-fast-02 ease-productive-entrance motion-reduce:transition-none"
            :class="
              resizing ? 'opacity-0' : 'group-hover:opacity-100 group-focus-within:opacity-100'
            "
          >
            <Tooltip
              text="Expand sidebar"
              placement="right"
            >
              <IconButton
                icon="pi pi-angle-double-right"
                aria-label="Expand sidebar"
                kind="outlined"
                size="medium"
                @click="collapsed = false"
              />
            </Tooltip>
          </div>
        </div>
      </Transition>

      <!-- Content zone: the page itself. The header above owns the breadcrumb.
           Content inset comes from the app's layout tokens (`.layout-boundary`
           in src/styles/layout.css): `--layout-boundary-inline` on the sides,
           one step more at the top so the header's bottom border gets air
           below it. Retuning the boundary is a one-line edit in that file. -->
      <div class="flex min-w-0 flex-1 flex-col">
        <div
          class="min-h-0 flex-1 overflow-auto"
          :class="{ 'layout-boundary': padded }"
        >
          <slot />
        </div>
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
        <DrawerContent aria-label="Navigation">
          <AppSidebar
            :user="userEmail"
            :active="activeItem"
            aria-label="Main navigation"
            shortcut=""
            @navigate="onMobileNavigate"
            @create="onMobileCreate"
            @select="onMobileSelect"
            @logout="onMobileLogout"
          />
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>

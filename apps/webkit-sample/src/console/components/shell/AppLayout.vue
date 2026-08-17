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
  import Avatar from '@aziontech/webkit/avatar'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import AzionLogoMin from '@aziontech/webkit/svg/azion/min'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { routeActivation } from '../../lib/behavior/anchor-nav'
  import { useSamplePreset } from '../../lib/state/sample-preset'
  import { endSession } from '../../lib/state/session'
  import AccountSwitcher from './AccountSwitcher.vue'
  import AppSidebar from './AppSidebar.vue'
  import OrgSwitcher from './OrgSwitcher.vue'
  import SamplePresetDrawer from './SamplePresetDrawer.vue'
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

  // The crumb is a real anchor, so the click has to be CLAIMED before it is routed —
  // otherwise the browser follows the same href as a document load on top of the push,
  // which reloads the whole console and, on a settings page with a pending edit, raises
  // the browser's own "Leave site?" beside ours (../../lib/anchor-nav.js).
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

  const openAccount = () => router.push({ path: '/account', query: { email: userEmail.value } })

  // The sample's own configuration — which customer this prototype is pretending to
  // be (../../lib/sample-preset.js). The drawer is hosted HERE, not in the sidebar
  // that offers it: the rail and the mobile nav drawer are two copies of AppSidebar,
  // so a panel owned there would exist twice and the second copy would open behind
  // the first. The shell is the one thing on screen exactly once.
  const presetOpen = ref(false)

  // Whether the header chain carries the account link at all. A single-account
  // contract has nothing to switch to, so the link and the slash before it go
  // together — a chain that ends in a dangling separator reads as a broken row.
  const { accountSwitcherVisible } = useSamplePreset()

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

  // Drawer search: the palette REPLACES the nav rather than stacking over it — two
  // overlays would trap focus in the one underneath, and the reader asked for search,
  // not search on top of the thing they were searching.
  //
  // The palette opened is the RAIL's, not the drawer copy's: closing the drawer unmounts
  // everything inside it, and a palette that unmounted a beat after opening is no palette
  // at all. The rail stays mounted below `md` (it is CSS-hidden, not removed) and its
  // palette teleports to the body, so it is the copy that can outlive the drawer. Hence
  // `:palette="false"` on the drawer copy — it announces `search`, it does not own one.
  const onMobileSearch = () => {
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
  <div class="flex h-dvh flex-col overflow-hidden bg-[var(--bg-canvas)]">
    <!-- The header spans the FULL width of the app, above the rail — it is the
         one piece of chrome that outranks navigation. Left to right it reads
         outermost tenant inward: the Azion mark, the organization, the account,
         then the module breadcrumb. -->
    <GlobalHeader aria-label="Azion Console">
      <!-- `justify-start!`, because the DS region ships `justify-end` — a left region
           that packs its children against its own trailing edge. It is invisible while
           the region is content-sized (it grows 0, so there is no free space to
           distribute), and it becomes visible the moment anything gives the row slack
           or takes it away: the chain drifts toward the middle, and under pressure it
           overflows off the START edge, clipping the Azion mark instead of the
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

        <!-- The tenancy chain. The mark is the minimal Azion glyph and the way
             back to the console home; a RouterLink (not a button) so the user
             keeps middle-click / open-in-new-tab.

             It is NOT wrapped in GlobalHeader.Brand: that region pins any svg
             inside it to 18px with a descendant rule, which outranks a class on
             the svg itself. The chain's mark is specified at 20 (`--size-5`),
             the same box as the org and account marks beside it, so the three
             sit on one baseline. The glyph is 21x18, so it fits INSIDE the 20px
             box (preserveAspectRatio) rather than being stretched to fill it. -->
        <!-- ONE RHYTHM FOR THE WHOLE CHAIN.
             The chain is a single child of the header region, with NO gap of its own:
             every element in it — the mark, each slash, each pill — carries the same
             `--spacing-xxs` of its own padding instead, so the space between any two
             neighbours is always 4 + 4 and the row reads as one repeating unit.
             Left to the region's `gap`, the spacing came out uneven in a way that had
             nothing to do with the design: the gap lands between every child, so each
             separator collected it TWICE (once before, once after) while the pills
             added their own padding on top — a pill/slash pair sat at gap + padding
             and the slash itself at gap + gap, so no two spaces in the chain matched. -->
        <div class="flex min-w-0 items-center">
          <RouterLink
            :to="{ path: '/home', query: { email: userEmail } }"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-[var(--shape-elements)] p-[var(--spacing-xxs)] transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)] motion-reduce:transition-none"
          >
            <AzionLogoMin
              class="size-[var(--size-5)]"
              aria-label="Azion"
            />
          </RouterLink>

          <span
            class="shrink-0 px-[var(--spacing-xxs)] text-body-sm text-[var(--text-muted)]"
            aria-hidden="true"
            >/</span
          >
          <OrgSwitcher />

          <!-- The account link, and only when the preset says this customer has more
               than one account to be (../../lib/sample-preset.js). The separator is
               inside the same condition: the chain reads as links joined by slashes,
               so a slash with nothing after it is a chain that lost a link. -->
          <template v-if="accountSwitcherVisible">
            <span
              class="shrink-0 px-[var(--spacing-xxs)] text-body-sm text-[var(--text-muted)]"
              aria-hidden="true"
              >/</span
            >
            <AccountSwitcher
              @select="onAccountSelect"
              @navigate="onNavigate"
            />
          </template>

          <!-- The innermost link is the first thing the chain gives up: below `md`
               three marks plus the hamburger and the header actions do not fit,
               and they collapse into an unreadable row of initials. Organization
               and account survive; the workspace comes back at `md`. -->
          <div class="hidden items-center md:flex">
            <span
              class="shrink-0 px-[var(--spacing-xxs)] text-body-sm text-[var(--text-muted)]"
              aria-hidden="true"
              >/</span
            >
            <WorkspaceSwitcher />
          </div>
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
          <Button
            label="Create"
            kind="secondary"
            size="medium"
            icon="pi pi-plus-circle"
            @click="openCreationCenter"
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
        aria-label="Main navigation"
        @navigate="onNavigate"
        @create="openCreationCenter"
        @select="onAccountSelect"
        @logout="signOut"
      />

      <!-- Content zone: the page itself. The header above owns the breadcrumb.
           Content inset comes from the app's layout tokens (`.layout-boundary`
           in src/styles/layout.css): `--layout-boundary-inline` on the sides,
           one step more at the top so the header's bottom border gets air
           below it. Retuning the boundary is a one-line edit in that file. -->
      <div class="flex min-w-0 flex-1 flex-col">
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
            @search="onMobileSearch"
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

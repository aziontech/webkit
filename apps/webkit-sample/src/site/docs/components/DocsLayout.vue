<script setup>
  // Developer-docs shell — a Cloudflare-docs-style layout rebuilt on
  // @aziontech/webkit and theme tokens, with the Azion documentation's own
  // navigation. Unlike SiteLayout (marketing nav + footer, single scrolling
  // column), this is a docs layout: a fixed docs top bar, a resizable left
  // navigation rail (webkit Sidebar), and an independently scrolling main
  // content region. Pages pass their content through the default slot.
  //
  // Two behaviours are shared with the console shell rather than reinvented here,
  // because a reader who has used one already knows the other:
  //
  //   · the rail is RESIZABLE and collapsible — the same drag / snap / keyboard
  //     gesture, which `Sidebar` itself owns, backed by its own persisted state
  //     (docs-sidebar.js) so sizing the docs tree never moves the console rail;
  //   · ⌘K opens a COMMAND PALETTE over the whole documentation — 275 pages, the
  //     eight sections as its groups, plus the shell's own commands. Selecting a page
  //     opens the condensed rows above it and scrolls it into view.
  //
  // THE SECTIONS ARE SEGMENTED, NOT DRILLED. The eight are `Menu.Group` labels — one
  // column, eight titles, and the CONDENSED rows (`Migrate`, `Modules`, `Guides`,
  // `Reference`) doing all of the folding, which is the shape the live docs sidebar has.
  // They were drill levels: the root of the rail was the eight pillars and choosing one
  // replaced the whole rail with that pillar's menu behind a Back row, which hid seven
  // pillars to show one.
  //
  // ONE ROW IS A DRILL, and it is `Functions` — a product sitting beside `Applications` in
  // the `Build` segment, whose eleven pages are a menu rather than a list to unfold under a
  // peer row. Activating it replaces the column with the Functions menu behind a `Menu.Back`
  // button — from anywhere on the row, because the row carries no `href` of its own — and the
  // same drill carries both homes of the tree: the rail and the
  // sheet share one stack, so opening the level in one shows it in the other. So the rail
  // runs TWO models — `expanded` for the condensed rows, and the stack (`path`) for that
  // one level — and the stack is DERIVED from the page rather than remembered, which is
  // what makes a pasted link to a page inside the level open it.
  //
  // Search lives in the CENTRE OF THE TOP BAR — the shape Google Cloud's console uses,
  // and the same control the Azion console's bar now carries (@shared/ui/HeaderSearch).
  // It used to sit at the top of the rail, on the argument that searching the tree
  // belongs to the tree; what that missed is that the palette does not search the tree,
  // it searches every PAGE, and it is the way past the tree rather than part of it. In
  // the bar it is on screen at every width and in every state of the rail — collapsed,
  // dragged narrow, or absent below `lg` — instead of only while the rail is expanded.
  // It stays a BUTTON, not a field: the palette owns the typing.
  //
  // RESPONSIVE — one rail, two homes. A persistent rail needs ~300px it does not
  // have below a laptop, so `lg` (1024px) is where the three-region layout starts:
  //
  //   · below lg  — no rail. The tree moves into a `Drawer` opened from the top
  //     bar's menu button (the DS overlay is a left panel at md and a bottom sheet
  //     below it, which is the same treatment every other overlay in the app gets),
  //     and the section links go, which leaves the bar's centre search the room to keep
  //     its full shape down to ~500px. NAV AND SEARCH ARE TWO SEPARATE CONTROLS here:
  //     the sheet carries the tree only. On a phone the search collapses to a 32px
  //     square beside the menu button — that switch is the CENTRE REGION's own width,
  //     not this breakpoint (see @shared/ui/HeaderSearch.vue);
  //   · lg and up — the rail is back, resizable, and the section links appear beside the
  //     brand, which is what they read from. The trailing group is what a reader DOES with
  //     the documentation: search, then the source on GitHub, then the console;
  //   · xl and up — the page's "On this page" rail joins on the right.
  //
  // THEME LIVES WITH THE NAVIGATION, not in the bar. It is a preference the reader sets
  // once, so it belongs at the bottom of the tree — the same place at every width — and
  // the bar keeps only what a reader uses per page (brand, links, search, source, the CTA). So:
  // the rail's own footer from `lg` up, and the nav sheet's footer below it, which is
  // where that tree is. It is driven by the shared app theme singleton either way, so
  // light/dark/system persist across the app like every other route.
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Sidebar from '@aziontech/webkit/sidebar'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { menuLeaves } from '@shared/lib/menu-tree.js'
  import { useTheme } from '@shared/lib/theme.js'
  import HeaderSearch from '@shared/ui/HeaderSearch.vue'
  import SiteFooter from '@shared/ui/SiteFooter.vue'
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    DOCS_HOME_ID,
    docsIdByRoute,
    docsNavGroups,
    docsNavSections,
    docsParentsOf
  } from '../lib/docs-nav.js'
  import { recordDocsLevel, reportDocsLevel, useDocsSidebar } from '../lib/docs-sidebar.js'

  const router = useRouter()
  const route = useRoute()
  const goConsole = () => router.push('/login')

  const { theme } = useTheme()

  // Rail state (collapsed + width + which condensed rows are open) is a singleton so it
  // survives navigation between docs pages and reloads; `Sidebar` owns the gesture that
  // drives the first two, `Menu` the third.
  const { collapsed, railWidth, expanded, entering } = useDocsSidebar()

  // Docs top-bar links — the three pillars the real Azion documentation header
  // carries, kept as anchors so the prototype is self-contained.
  const topLinks = [
    { label: 'Reference', href: '#reference' },
    { label: 'Guides', href: '#guides' },
    { label: 'DevTools', href: '#devtools' }
  ]

  // The docs navigation itself lives in `lib/docs-nav.js` — the real Azion documentation
  // sidebar, transcribed section for section. The eight sections are `Menu.Group` labels
  // (`docsNavGroups` is the section list itself), and a row with `children` is the
  // condensed (inline) sub-menu the documentation uses for product groups, expanding in
  // place behind a chevron and the indent rail: `Secure → Firewall → Modules → WAF →
  // Guides` is four condensed rows inside one segment.
  const active = ref(docsIdByRoute.get(route.path) ?? DOCS_HOME_ID)

  /** Ids of the containers that DRILL rather than condense — `Functions`, and nothing else yet. */
  const drillIds = (() => {
    const ids = new Set()
    const walk = (nodes) =>
      nodes.forEach((node) => {
        if (node.kind === 'drill') ids.add(node.id)
        if (node.children) walk(node.children)
        if (node.groups) walk(node.groups.flatMap((group) => group.items))
      })
    docsNavSections.forEach((section) => walk(section.items))
    return ids
  })()

  /**
   * The rail state a page implies, split by the kind of container each step is.
   *
   * `docsParentsOf` walks the tree down to the row and returns the containers above it as
   * one list, because that is one fact. Which MODEL each step feeds is this shell's
   * knowledge: a condensed ancestor is an `expanded` id, a drill ancestor is a level on the
   * stack. Splitting here is what lets a single call seed both.
   */
  const railStateFor = (id) => {
    const ancestors = docsParentsOf(id)
    return {
      levels: ancestors.filter((ancestorId) => drillIds.has(ancestorId)),
      rows: ancestors.filter((ancestorId) => !drillIds.has(ancestorId))
    }
  }

  // Which condensed rows are open. Seeded from the page that is current, so arriving inside
  // one opens it rather than lighting a row nobody can see. Merged, never replaced — a row
  // the reader opened by hand is theirs to close.
  //
  // A drill ancestor's own condensed ancestors belong in here too — `Functions` has none
  // today, sitting at the top of its segment, but the rule holds for any drill that is
  // nested: the level is rendered by the sub inside that branch, so a level whose branch is
  // folded away has nothing to mount, and the row it returns to is not on screen either.
  expanded.value = [...new Set([...expanded.value, ...railStateFor(active.value).rows])]

  // The drill stack, DERIVED from the page rather than remembered. Every docs view renders
  // its own `DocsLayout`, so navigating remounts this shell — a level held in a component
  // would close on the navigation that opened it. The console rail solves that by persisting
  // the stack in its singleton; here the page itself is enough, because the level a page
  // belongs to is a fact about the tree, so re-deriving it on mount restores the same view a
  // stored stack would have — and it also opens the level for a reader who arrived by a
  // pasted URL or the palette, which a stored stack cannot do.
  const path = ref(railStateFor(active.value).levels)

  // Whether THIS mount is an entrance is the one thing the menu cannot derive: activating
  // the drill row navigates, so the shell remounts and a push arrives looking exactly like a
  // move inside the level. The singleton compares this page against the last one to answer
  // it, and `enter-on-mount` below is where the answer is spent.
  reportDocsLevel(active.value, path.value)

  /**
   * Take the stack back from `Menu`, which owns both ways it changes.
   *
   * A push is left to the navigation that follows it — that arrival is what animates. A POP
   * navigates nothing and plays its own motion here, so it is recorded as seen, or the next
   * navigation would replay an entrance for a column that never left the screen.
   */
  const onPath = (levels) => {
    const previous = path.value
    // Deeper means a push: remember where the level being left was sitting.
    const isPush = levels.length > previous.length
    const el = navScroll.value?.$el
    if (isPush && el) navScrollMemory.set(navScrollKey(previous), el.scrollTop)

    recordDocsLevel(levels, path.value.length)
    path.value = levels

    // A level change REPLACES the column's contents, so the offset has to be set deliberately:
    // 0 on the way IN (a push made from halfway down the tree would otherwise open the new
    // level already scrolled past its first rows, or into the blank space below a short one,
    // which reads as the menu having emptied), and the remembered offset on the way BACK.
    const target = isPush ? 0 : (navScrollMemory.get(navScrollKey(levels)) ?? 0)
    const apply = () => {
      const node = navScroll.value?.$el
      if (node) node.scrollTop = target
    }
    // Twice: `scrollTop` is clamped to the CURRENT scrollHeight, and on a pop the level being
    // returned to has only just re-entered the flow — the first assignment can land against a
    // height that has not grown back yet, silently clamping a restore to a smaller offset.
    nextTick(() => {
      apply()
      globalThis.requestAnimationFrame(apply)
    })
  }

  // The scroll target lives inside the tree, so the ref is on `Menu` rather than on the rail:
  // `Sidebar` renders two roots (the rail, plus the affordance that brings a collapsed one
  // back), so its `$el` is not a single element to query into.
  const menuRef = ref(null)

  // Below `lg` the same tree lives in a sheet instead of a rail. Its own open state,
  // not the rail's `collapsed`: the rail's is persisted sizing, this is one visit.
  const navOpen = ref(false)

  /** The sheet's scroll container. */
  const navScroll = ref(null)

  /**
   * Where each level was left, keyed by the stack that identifies it (`''` is the root column).
   * A push and a pop want opposite things: going INTO a level is arriving somewhere new, so it
   * starts at the top; coming BACK is returning to a place the reader already knows, so it
   * restores the offset they left it at. Landing a pop at the top loses their place in a 275-row
   * column, which is the whole reason they can drill in the first place.
   *
   * Keyed by the stack rather than by depth, so two sibling levels at the same depth keep their
   * own positions. Plain object, not reactive: nothing renders from it.
   */
  const navScrollMemory = new Map()
  const navScrollKey = (levels) => levels.join('>')

  // The DS focus trap moves initial focus to the panel's FIRST focusable. Park it on the
  // panel itself instead (`role="dialog"`, `tabindex="-1"`) — the conventional initial
  // focus for a dialog — so the sheet does not open with its first nav row ringed as if
  // the reader had already picked it. Tab from there still walks in from the top, and the
  // close button is still one Shift+Tab away. Scheduled on a frame because the
  // trap's own focus call runs in the microtask right after open.
  const navPanel = ref(null)
  watch(navOpen, (open) => {
    if (!open) return
    globalThis.requestAnimationFrame(() => navPanel.value?.$el?.focus?.())
  })

  /**
   * The row a container stands for: the first page inside it.
   *
   * A container is not a destination, so lighting one would mark nothing. The `Functions`
   * drill row resolves to `About Functions` — its level's landing row — which is what makes
   * opening the level and arriving somewhere one action instead of two.
   */
  const landingOf = (node) => (node.groups || node.children ? menuLeaves([node])[0] : node)

  // Only rows that HAVE a destination reach here, which in this tree means leaf pages: not one
  // of the 28 container rows carries an `href`, because a container is not a destination (see
  // `landingOf`). `Menu` reads that same `href` to decide the row's anatomy — with one, the row
  // is a link plus an arrow; without one, the WHOLE ROW reveals the children — so every
  // container here unfolds or pushes from its full 268px width and announces nothing.
  //
  // That is what lets the sheet close unconditionally. It used to have to exclude the drill
  // row: one activation both pushed the level and announced it, so closing the sheet would
  // have taken away the very menu the push had just put in it. Now the two are different
  // rows entirely, and only an arrival lands here.
  const onNavigate = (event, node) => {
    const target = landingOf(node)
    active.value = target.id
    // The page it opened is behind the overlay, so the sheet has done its job.
    navOpen.value = false
    followRow(event, target)
  }

  /**
   * Take a plain left click on a row that HAS a page into the app's own router.
   *
   * The row is a real anchor (`href` in the tree), so the browser would leave and reload
   * the whole SPA. Anything modified — a new tab, a new window, a middle click — is left
   * alone, which is the only reason the row is a link rather than a button.
   */
  const followRow = (event, node) => {
    if (!node.href || !node.href.startsWith('/')) return
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
      return
    event.preventDefault()
    if (route.path !== node.href) router.push(node.href)
  }

  /**
   * Light a page's row and open the tree down to it — every condensed row above it, and the
   * drill level it sits in.
   *
   * Used by the palette, and by arrival on a page from anywhere else — a link in the
   * prose, the browser's Back, a pasted URL. A jump that left the row folded away, or off
   * the bottom of a 275-row column, looks like nothing happened.
   */
  const revealPage = (id) => {
    active.value = id
    if (hasRail.value && collapsed.value) collapsed.value = false
    const { levels, rows } = railStateFor(id)
    // Merged, not replaced: a row the reader opened by hand elsewhere in the column is
    // theirs to close, and nothing about arriving here says they are done with it.
    expanded.value = [...new Set([...expanded.value, ...rows])]
    // The stack IS replaced — it is where the reader is, not what they left open. A page
    // inside the drill level pushes it, a page anywhere else pops back to the root column,
    // so the rail can never show a level the page being read is not in.
    reportDocsLevel(id, levels)
    path.value = levels
    nextTick(() => {
      menuRef.value?.$el
        ?.querySelector('[aria-current="page"]')
        ?.scrollIntoView({ block: 'nearest' })
    })
  }

  // Arriving at a page from OUTSIDE the rail — a link in the prose, a card on the home
  // page, the browser's Back button, a pasted URL — moves the rail with it. Not
  // `immediate`: `active` is already seeded from the route above, and `revealPage` reads
  // state (`hasRail`) that is declared further down this setup.
  watch(
    () => route.path,
    (path) => {
      const id = docsIdByRoute.get(path)
      if (id) revealPage(id)
    }
  )

  // ── ⌘K palette ──────────────────────────────────────────────────────────────
  // The bar's centre control is a read-only affordance for it (click, or press the
  // shortcut) at every width. The palette carries every documentation PAGE — containers
  // are not destinations, so each section contributes its leaves — grouped and ordered
  // exactly like the rail, then the shell's own commands.
  const paletteOpen = ref(false)
  const openPalette = () => {
    paletteOpen.value = true
  }

  // The palette REPLACES the sheet instead of covering it: two stacked overlays would
  // trap focus in the one underneath. Watched rather than handled in `openPalette`,
  // because `CommandMenu` owns the ⌘K binding and opens itself through `v-model:open`
  // without going through the trigger.
  watch(paletteOpen, (open) => {
    if (open) navOpen.value = false
  })

  const paletteGroups = computed(() =>
    docsNavSections.map((section) => ({
      key: section.label,
      heading: section.label,
      items: menuLeaves(section.items)
    }))
  )
  const paletteItems = computed(() => paletteGroups.value.flatMap((group) => group.items))

  // Whether the layout currently HAS a rail (the `lg` breakpoint the template
  // switches on). The palette's navigation command needs it, so it toggles the rail
  // on a laptop and opens the sheet below one instead of naming a region that is not
  // rendered.
  const railQuery = globalThis.matchMedia?.('(min-width: 1024px)')
  const hasRail = ref(railQuery?.matches ?? true)
  const onRailQueryChange = (event) => {
    hasRail.value = event.matches
    // Widening past `lg` renders the rail, which is the sheet's own content: leaving
    // the sheet open would hold a focus trap over a tree that is now on the page.
    if (event.matches) navOpen.value = false
  }
  railQuery?.addEventListener('change', onRailQueryChange)
  onBeforeUnmount(() => railQuery?.removeEventListener('change', onRailQueryChange))

  // The theme mode resolved to a concrete value, so the palette's theme command can
  // name the outcome ("Switch to Dark Theme") instead of the toggle.
  const resolvedTheme = computed(() =>
    theme.value === 'system'
      ? window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme.value
  )

  // Shell-level commands, listed below the documentation groups. Labels that depend
  // on current state are computed; the `value` each is registered under keeps a
  // stable keyword so filtering still finds it ("theme", "navigation").
  const commands = computed(() => [
    {
      id: 'theme',
      label: resolvedTheme.value === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme',
      icon: resolvedTheme.value === 'dark' ? 'pi pi-sun' : 'pi pi-moon',
      run: () => {
        theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
      }
    },
    {
      id: 'navigation',
      label: hasRail.value
        ? collapsed.value
          ? 'Expand Navigation'
          : 'Collapse Navigation'
        : 'Open Navigation',
      icon: hasRail.value
        ? collapsed.value
          ? 'pi pi-angle-double-right'
          : 'pi pi-angle-double-left'
        : 'pi pi-bars',
      run: () => {
        if (!hasRail.value) {
          navOpen.value = true
          return
        }
        collapsed.value = !collapsed.value
      }
    },
    {
      id: 'console',
      label: 'Open Console',
      icon: 'pi pi-external-link',
      run: goConsole
    }
  ])

  // CommandMenu emits (event, value). Values are namespaced (`doc:` / `cmd:`) so a
  // page id can never collide with a command id. Selecting a page moves the rail's
  // selection, opens the containers above it, and scrolls it into view — a jump that
  // left the row folded away would look like nothing happened.
  const onPaletteSelect = (event, value) => {
    const [scope, id] = String(value).split(/:(.*)/s)

    if (scope === 'doc') {
      const item = paletteItems.value.find((entry) => entry.id === id)
      if (!item) return
      revealPage(item.id)
      // A page that exists is opened, not just selected: the palette is the fastest way
      // to a page, so it must actually go there.
      if (item.href?.startsWith('/') && route.path !== item.href) router.push(item.href)
      return
    }

    commands.value.find((entry) => entry.id === id)?.run(event)
  }
</script>

<template>
  <!-- Own the scroll region: the global shell locks html/body/#app to
       height:100dvh; overflow:hidden, so this docs shell is a full-height column
       with the top bar fixed and the sidebar + main sharing the remaining height. -->
  <div
    class="docs-shell flex h-dvh flex-col overflow-hidden bg-(--bg-canvas) text-(--text-default)"
  >
    <!-- ── Docs top bar ─────────────────────────────────────────────────────
         The DS bar (`GlobalHeader`), not a hand-rolled `<header>`: the height, the
         surface, the hairline, the `role="banner"` landmark and the rhythm between the
         regions all come from the component, and this shell only says what goes in each
         region — leading cluster, section links, trailing actions.

         NO `kind`: the default placement reads `--layout-boundary-inline`, the token every
         page column below this one opens on, so the logo lands on the same vertical as the
         title under it. This bar spans the WINDOW and has no content zone beside it — the
         same shape CreationHeader.vue has — and the default is still right, because what a
         bar answers to is the page, not a rail. -->
    <!-- `@container`, because the search in the trailing cluster switches between its two
         shapes on THIS BAR's width. The bar is the only box in the header whose width is
         independent of what is inside it (`w-full` off the window), and it is ~300px wider
         than the console's at every window because no rail sits beside it — which is why a
         viewport breakpoint could not serve both. See @shared/ui/HeaderSearch.vue. -->
    <GlobalHeader
      aria-label="Azion documentation"
      class="@container"
    >
      <!-- `justify-start!`, because the DS region ships `justify-end` — inert while the
           region is content-sized, but it packs the cluster against its own trailing edge
           the moment the row has slack, and under pressure it overflows off the START
           edge, clipping the brand rather than the thing nearest the middle. Important,
           not a plain class: `justify-start` and `justify-end` are the same property, and
           the winner is CSS source order, not the order they are written here. -->
      <GlobalHeader.Left class="justify-start!">
        <!-- Below `lg` the tree has no rail to live in, so the bar carries the way into it.
             `outlined` at 32px, the shape the centre search collapses to at the same width:
             nav and search are the bar's own two controls there, so they read as a pair
             across it. Hidden from `lg` up, where the rail is the way in.

             IT LEADS THE MARK, and that placement is the app's, not this shell's: the
             console bar puts its own nav trigger in the same corner (AppLayout.vue), so the
             way into navigation is in one place whichever shell a reader is in. It was
             briefly moved BEHIND the brand to buy the mark its vertical — a phone starts the
             wordmark 40px inside the page boundary with the button in front of it — and that
             is the wrong trade twice over: it breaks the one convention the three shells
             share, and it strands a lone control mid-bar, close enough to the wordmark to
             read as part of the lockup while the actions it belongs with sit a region away. -->
        <IconButton
          icon="pi pi-bars"
          kind="outlined"
          size="medium"
          aria-label="Open documentation navigation"
          class="shrink-0 lg:hidden"
          @click="navOpen = true"
        />

        <GlobalHeader.Brand>
          <!-- `px-(--spacing-xxs)` for the same reason the console rail carries it on its
               own brand (AppSidebar.vue): a nav row's LABEL sits 4px inside the row box,
               so a brand flush to the bar's inset lands 4px to the left of every item in
               the tree below it. The 4px puts the wordmark on the tree's vertical, and
               gives the focus ring the same breathing room the rail's brand has. -->
          <RouterLink
            to="/site/docs"
            aria-label="Azion Docs — home"
            class="inline-flex shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface)"
          >
            <Brand
              kind="default"
              size="small"
            />
            <!-- The wordmark already says Azion; on a 390px bar the badge is the one
                 piece of the identity that can go. -->
            <span
              class="hidden rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) py-px text-overline-sm uppercase tracking-widest text-(--text-muted) sm:inline-block"
            >
              Docs
            </span>
          </RouterLink>
        </GlobalHeader.Brand>

        <!-- The section links READ FROM THE BRAND, so they sit beside it: this end of the
             bar is what the documentation IS, and the trailing end is what a reader does
             with it (search, source, console). They need the room the rail breakpoint frees
             up; below `lg` the bar is already carrying the menu button and three trailing
             controls, and the sections are in the sheet's tree anyway. `shrink-0` because
             the region can shrink and a squashed link row wraps before it truncates. -->
        <NavigationMenu
          aria-label="Documentation sections"
          class="ml-(--spacing-xs) hidden shrink-0 lg:flex"
        >
          <NavigationMenu.List class="items-center gap-(--spacing-xxs)">
            <NavigationMenu.Item
              v-for="link in topLinks"
              :key="link.href"
            >
              <NavigationMenu.Trigger :href="link.href">{{ link.label }}</NavigationMenu.Trigger>
            </NavigationMenu.Item>
          </NavigationMenu.List>

          <NavigationMenu.Portal>
            <NavigationMenu.Positioner
              side="bottom"
              align="start"
              :side-offset="12"
            >
              <NavigationMenu.Popup>
                <NavigationMenu.Arrow />
                <NavigationMenu.Viewport />
              </NavigationMenu.Popup>
            </NavigationMenu.Positioner>
          </NavigationMenu.Portal>
        </NavigationMenu>
      </GlobalHeader.Left>

      <!-- The empty spacer. `Nav` is the DS's alias for the growing middle region, and what
           it does here is hold the trailing group against the end of the bar; nothing lives
           in it. Search used to, packed against its trailing edge — which put the control
           one region away from the actions it belongs with. It is in `Right` now. -->
      <GlobalHeader.Nav />

      <GlobalHeader.Right>
        <!-- SEARCH LEADS THE GROUP. It is one of the actions — the utility you reach for
             before you know which page you want — so it sits at the head of this cluster on
             the cluster's own `--spacing-sm` rhythm, rather than alone in the middle of the
             bar. Wide it is a 160px field; narrow it is the DS IconButton, the same 32px box
             as the GitHub link beside it. -->
        <HeaderSearch
          label="Search"
          @click="openPalette"
        />

        <!-- SOURCE, beside the search that precedes it and the console that follows: the
             trailing group is what a reader DOES with the documentation, in widening order
             — find a page, read the code behind it, go operate it.

             An `href`, so `IconButton` renders a real `<a>` (its own `href` polymorphism)
             and the link is middle-clickable, copyable and crawlable rather than a button
             that navigates. `target="_blank"` leaves the docs where they are; the DS adds
             `rel="noopener noreferrer"` itself for that target. `outlined` at `medium`, so
             it is the same 32px box as the search square it sits beside below `lg`.

             The glyph is `pi pi-github`, which IS in the set this app loads — verified in
             @aziontech/icons' primeicons build rather than assumed, since a missing glyph
             renders as an empty box with no error. -->
        <IconButton
          icon="pi pi-github"
          kind="outlined"
          size="medium"
          aria-label="Azion on GitHub"
          href="https://github.com/aziontech"
          target="_blank"
          class="shrink-0"
        />

        <Button
          label="Console"
          kind="secondary"
          size="medium"
          class="shrink-0"
          @click="goConsole"
        />
      </GlobalHeader.Right>
    </GlobalHeader>

    <!-- ── Sidebar + main ───────────────────────────────────────────────── -->
    <!-- `relative`, because the collapsed rail's edge affordance is positioned
         against this row (see Sidebar's collapsed affordance). -->
    <div class="relative flex min-h-0 flex-1">
      <!-- Below `lg` there is no rail at all — the tree is in the sheet below, and a
           300px rail would leave a phone ~90px of prose. `lg:contents` rather than
           `lg:block` because Sidebar renders TWO roots (the rail plus the affordance
           that brings a collapsed one back) and both are laid out by this flex row. -->
      <div class="hidden lg:contents">
        <!-- The width class is only the NATURAL width the rail is seeded with before the
             reader ever drags it; once sized, the model's inline width takes over. -->
        <Sidebar
          v-model:collapsed="collapsed"
          v-model:width="railWidth"
          resizable
          collapsible
          aria-label="Documentation"
          resize-aria-label="Resize navigation"
          expand-aria-label="Expand navigation"
          collapse-aria-label="Collapse navigation"
          class="h-full w-(--container-2xs)"
        >
          <!-- Theme at the bottom of the tree, the same place the nav sheet puts it below
               `lg`. `Sidebar` lays this region out as a ROW whose trailing edge belongs to
               its own collapse trigger, so the switcher takes the leading edge — on the
               rail's 16px content boundary, like every row above it. It keeps its intrinsic
               width: the control is a fixed-segment track with an absolutely positioned
               thumb, so stretching it to the rail only adds dead track to its right. -->
          <template #footer>
            <ThemeSwitcher
              v-model:value="theme"
              aria-label="Theme"
            />
          </template>

          <!-- The whole sidebar is one Menu: the eight docs sections as `Menu.Group`
               labels — a title over its rows, not a control — with the CONDENSED rows
               inside them doing the folding, three levels deep, and the `Functions` DRILL
               row replacing the column with its own menu. The tree comes from a manifest,
               so data-driven mode renders that recursion rather than us re-implementing it
               here: `groups` + `activeId` + the two view models (`expanded` for the
               condensed rows, `path` for the level) is the whole wiring.
               `role="presentation"` because Sidebar already renders the nav landmark.

               A ROW THAT OWNS CHILDREN SPLITS ONLY IF IT IS ITSELF A DESTINATION — `Menu`
               keys that off the node's `href`. No container in this tree has one (a container
               resolves to its first page through `landingOf` instead), so every one of them
               unfolds or pushes from its whole width, which is the only thing that works on a
               phone: the split shape leaves a 28px arrow as the sole live target, 7% of the
               row's area, with the rest navigating away and dismissing the sheet. -->
          <Menu
            ref="menuRef"
            v-model:expanded="expanded"
            :path="path"
            :groups="docsNavGroups"
            :active-id="active"
            :enter-on-mount="entering"
            role="presentation"
            @update:path="onPath"
            @navigate="onNavigate"
          >
            <!-- Declared unconditionally: it renders nothing until a level is pushed, and
                 it renders INSIDE that level rather than here (the level exposes the anchor
                 and Back teleports into it), so it travels with the slide and never takes a
                 row from the column it returns to.

                 `label` names the DESTINATION, which is the one thing Back cannot work out
                 for itself: the level below `Functions` is the root column, and a root has
                 no trigger to name it. Without this the button reads a bare `Back`; with it,
                 `Back to Docs`. -->
            <Menu.Back label="Docs" />
          </Menu>
        </Sidebar>
      </div>

      <!-- THE BOUNDARY IS NOT RE-DECLARED HERE. `--layout-boundary-inline` is one token
           with one value for the whole app, and the top bar above and every page's own
           column read it — so "the bar and the body are inset by the same amount" is a
           fact rather than numbers kept equal by hand. This
           region used to retune it three times (`sm`, then `md`, then `xl` from `lg`) to
           chase the top bar's own padding, which is a step the bar no longer has: it
           reads the boundary too. Below `lg` there is no rail between them, so the docs
           logo, the trail, the title and the prose all start on one vertical; from `lg`
           up the rail moves the bar's padding off this column, and the two stop being
           comparable — which is fine, because neither is chasing the other any more. -->
      <!-- THE SHELL DRAWS NO PAGE BAR. It used to pin one to the top of this scroll
           region — a sticky strip carrying the trail and Copy page, filled by the page
           through a slot. Both are the PAGE's, and a page already has the region that
           says what it is and what to do with it: its masthead. So a band whose entire
           content was two controls is gone, and with it the second rule above the one the
           masthead draws (see DocsMdxPage). This region is the page's scroll container.

           THE SCROLLING IS THE DESIGN SYSTEM'S, not an `overflow-y-auto` typed here.
           `ScrollArea` is webkit's scroll primitive — the thin, tokenised scrollbar
           (`--border-muted` thumb over a transparent track) plus the keyboard model a
           scroll region owes a keyboard-only reader: it is focusable, and arrows / Page
           / Home / End move it — and it is what `axe` asks of a scrollable region that
           long stretches of prose give the keyboard no other way to move. The rail on
           the left already scrolls through it, so a raw scroller here meant the reading
           column wore the browser's default bar beside a rail wearing ours — two
           scrollbars, one screen, in two styles.

           THE `<main>` STAYS, as the landmark only. `ScrollArea` renders a plain `div`
           and does not forward `role`, so swapping the element for it would cost the
           page its main landmark — the one thing screen-reader users skip TO. So the
           landmark wraps and the primitive scrolls inside it, and nothing needs to know
           which of the two is which: everything that has to reach the scrolling element
           asks `scrollParent` for it (see the views). -->
      <main class="flex min-h-0 min-w-0 flex-1 flex-col">
        <ScrollArea class="flex-1">
          <slot />

          <!-- THE FOOTER SCROLLS WITH THE PAGE, inside the reading zone's own scroller
               rather than pinned under it. A footer outside this region would be fixed at
               the bottom of a viewport-height shell — visible over every article, at the
               end of none of them — and the end of the article is the only place a footer
               means anything.

               It is the SAME footer the marketing site closes with (@shared/ui/SiteFooter),
               in the other placement: `content`, so the bands run full bleed across this
               zone and open on the page boundary, exactly as the docs top bar above does.
               `site` would cap them at the marketing measure and draw the side rules, the
               gutters and the closing band — a page frame the docs shell does not have and
               nothing above here continues. Same links, same social row, same status: one
               file, and the placement is the only difference. -->
          <SiteFooter kind="content" />
        </ScrollArea>
      </main>

      <!-- "On this page": the page's own heading list, so it is the page — not the
           shell — that decides what is in it. Absent slot ⇒ no rail at all.

           IT OPENS ON THE COLUMN BOUNDARY, `pt-(--spacing-md)` — the same step every
           page opens its own column on (DocsMdxPage / DocsAgentPage / DocsAgentSetup),
           so the outline and the trail beside it start on one line. It used to be
           MEASURED instead: forty lines centred the rail's first line on the page's h1
           through an inline `padding-top`, watched by a ResizeObserver on both ends.
           That made the rail's top a function of whatever type scale the title happened
           to render at — an inline number no stylesheet could see, and one that pushed
           the outline a whole band below the trail it sits next to. The boundary is the
           guideline; the rail follows it like every other column.

           A COLUMN, not a block, so its content can address the FOOT of the rail and
           not just the end of the outline. The page's rail is short — ten headings and
           two link groups — so anything after it would otherwise float halfway up a
           mostly empty column. A flex column lets the page's own wrapper take the full
           height (`flex-1`) and push its last block down with `mt-auto`. When the
           outline is long enough to overflow, the column scrolls as before and that
           block simply lands at the end of the scroll.

           It scrolls through `ScrollArea` for the same reason the reading column does:
           the third scrollbar on the screen matches the other two. `flex-col` + the
           `xl:flex` that reveals it survive the swap — the primitive merges the classes
           it is passed onto its own root, so this stays one element, not a column
           wrapped in a scroller.

           `tabindex="-1"`, unlike the reading column. A scroll region has to be
           reachable by keyboard when the keyboard has no other way to move it — which
           is why the prose column keeps the primitive's focusable default, since whole
           screenfuls of it hold no link. This column is nothing BUT links: tabbing
           through them scrolls it, so a stop on the container itself would be a stop
           that does nothing. Same call `Sidebar` makes for the tree on the left. -->
      <ScrollArea
        v-if="$slots.toc"
        tabindex="-1"
        class="hidden w-(--container-3xs) shrink-0 flex-col border-l border-(--border-default) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg) xl:flex"
      >
        <slot name="toc" />
      </ScrollArea>
    </div>

    <!-- The palette: every documentation page, grouped and ordered like the rail,
         then the shell's commands. Teleports to the body, so ⌘K works with the rail
         collapsed. -->
    <CommandMenu
      v-model:open="paletteOpen"
      shortcut="meta+k"
      @select="onPaletteSelect"
    >
      <CommandMenu.Input placeholder="Search documentation" />
      <CommandMenu.List>
        <CommandMenu.Group
          v-for="group in paletteGroups"
          :key="group.key"
          :heading="group.heading"
        >
          <CommandMenu.Item
            v-for="item in group.items"
            :key="item.id"
            :value="`doc:${item.id}`"
          >
            <template #prefix>
              <i
                class="pi pi-file"
                aria-hidden="true"
              />
            </template>
            {{ item.label }}
          </CommandMenu.Item>
        </CommandMenu.Group>

        <CommandMenu.Separator />

        <CommandMenu.Group heading="Commands">
          <CommandMenu.Item
            v-for="command in commands"
            :key="command.id"
            :value="`cmd:${command.id}`"
          >
            <template #prefix>
              <i
                :class="command.icon"
                aria-hidden="true"
              />
            </template>
            {{ command.label }}
          </CommandMenu.Item>
        </CommandMenu.Group>

        <CommandMenu.Empty>No page or command matches your search.</CommandMenu.Empty>
      </CommandMenu.List>
    </CommandMenu>

    <!-- ── Navigation sheet (below `lg`) ───────────────────────────────────
         The rail's TREE, in the overlay the DS already gives every panel on a small
         screen: a left panel at `md`, a bottom sheet below it. Same rows, same
         selection state — the rail is not rebuilt here, it is RE-HOMED, so a row
         tapped in the sheet lands on the page the rail would have opened.

         THE SHEET IS THE TREE, AND ONLY THE TREE. It used to open on a search row of its
         own, back when search was something the rail carried; the bar's centre control is
         on screen behind this sheet at every width, so a second copy in here would be the
         same trigger twice. Opening the palette still dismisses the sheet rather than
         stacking over it (see the `paletteOpen` watch) — two overlays would trap focus in
         the one underneath.

         The tree is `w-full` on the sheet's own edges rather than inside PanelContent's
         padding, so a row's hit area runs the full width of the panel exactly as it does
         in the rail (hence ScrollArea + a bare Menu, not PanelContent). The theme control
         sits in the panel footer, the place the rail keeps it from `lg` up. -->
    <Drawer
      v-model:open="navOpen"
      side="left"
      size="small"
    >
      <DrawerPortal>
        <DrawerOverlay />
        <DrawerContent ref="navPanel">
          <!-- No header on a phone: the sheet is capped at 80vh there, and a title row
               that only repeats what the sheet obviously is would spend 56px of that on
               nothing. It stays for the `md` side panel, which has the full height.

               `hidden` rather than removed, because `DrawerContent` names the dialog with
               `aria-labelledby` pointing at this title — a referenced element still
               provides the accessible name while hidden, so the sheet keeps its name and
               the close button is simply not the way out on mobile (tap the backdrop, or
               press Escape, or pick a page). -->
          <PanelHeader class="hidden w-full md:flex">
            <DrawerTitle>Documentation</DrawerTitle>
            <DrawerClose />
          </PanelHeader>

          <ScrollArea
            ref="navScroll"
            class="min-h-0 min-w-0 w-full flex-1"
          >
            <!-- The same two models as the rail, from the same refs: the sheet is the
                 other home of one tree, so a level opened here is open there. `aria-label`
                 rather than `role="presentation"` — a Drawer panel is not a landmark, so
                 this menu keeps its own. -->
            <Menu
              v-model:expanded="expanded"
              :path="path"
              :groups="docsNavGroups"
              :active-id="active"
              :enter-on-mount="entering"
              aria-label="Documentation"
              class="w-full p-(--spacing-md)"
              @update:path="onPath"
              @navigate="onNavigate"
            >
              <!-- Same destination name as the rail's: one tree, two homes. -->
              <Menu.Back label="Docs" />
            </Menu>
          </ScrollArea>

          <!-- From `lg` up the tree is the rail, and the rail carries this same footer, so
               here it would duplicate it.

               `--spacing-md` (the sheet's own content boundary, the one the tree is on)
               rather than PanelFooter's `--spacing-lg`, so the switcher's right
               edge lands on the same 16px line as every row's hit area. The label carries
               the tree's extra `--spacing-sm` inset, because a row's TEXT sits 12px inside
               that boundary — so "Theme" reads as one more line of the same column, not as
               a label hanging 12px to its left. `--text-default` for the same reason: it
               is a control the reader acts on, like the rows above it, not a muted section
               header. -->
          <PanelFooter
            class="w-full justify-between px-(--spacing-md) text-label-md text-(--text-default) lg:hidden"
          >
            <span class="pl-(--spacing-sm)">Theme</span>
            <ThemeSwitcher
              v-model:value="theme"
              aria-label="Theme"
            />
          </PanelFooter>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  </div>
</template>

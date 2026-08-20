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
  //   · the eight documentation sections are DRILL levels, the console's second-level
  //     pattern: the root of the rail is the eight pillars, and choosing one replaces the
  //     rail with that pillar's own menu behind a Back row. 275 links do not fit one
  //     column, and a reader inside `Secure` should not scroll past `Store` to get there;
  //   · ⌘K opens a COMMAND PALETTE over the whole documentation — 275 pages, the
  //     eight sections as its groups, plus the shell's own commands. Selecting a page
  //     drills the rail to its pillar and opens the inline subs above it.
  //
  // Search lives at the TOP OF THE RAIL, not in the top bar: the rail is what the
  // documentation tree is, so its search belongs to it. It is a single large button
  // rather than a field — the palette owns the typing, and it already does what an
  // in-rail filter did (find a page by name), so the rail carries no second input.
  //
  // RESPONSIVE — one rail, two homes. A persistent rail needs ~300px it does not
  // have below a laptop, so `lg` (1024px) is where the three-region layout starts:
  //
  //   · below lg  — no rail. The tree moves into a `Drawer` opened from the top
  //     bar's menu button (the DS overlay is a left panel at md and a bottom sheet
  //     below it, which is the same treatment every other overlay in the app gets),
  //     and the palette gets its own outlined search IconButton in the bar — the pair
  //     of outlined icon buttons the bar owns at those widths. NAV AND SEARCH ARE TWO
  //     SEPARATE CONTROLS here: the sheet carries the tree only, no search bar, since
  //     the button beside it is already the way into the palette;
  //   · lg and up — the rail is back, resizable, with search at its top;
  //   · xl and up — the page's "On this page" rail joins on the right.
  //
  // THEME LIVES WITH THE NAVIGATION, not in the bar. It is a preference the reader sets
  // once, so it belongs at the bottom of the tree — the same place at every width — and
  // the bar keeps only what a reader uses per page (brand, links, search, the CTA). So:
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
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Sidebar from '@aziontech/webkit/sidebar'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { menuLeaves, menuPath } from '@shared/lib/menu-tree.js'
  import { useTheme } from '@shared/lib/theme.js'
  import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import {
    DOCS_GET_STARTED_ID,
    docsIdByRoute,
    docsNavGroups,
    docsNavSections,
    docsSectionIds
  } from '../lib/docs-nav.js'
  import { useDocsSidebar } from '../lib/docs-sidebar.js'
  import DocsSearchTrigger from './DocsSearchTrigger.vue'

  const router = useRouter()
  const route = useRoute()
  const goConsole = () => router.push('/login')

  const { theme } = useTheme()

  // Rail state (collapsed + width) is a singleton so it survives navigation between
  // docs pages and reloads; `Sidebar` owns the gesture that drives it.
  const { collapsed, railWidth } = useDocsSidebar()

  // Docs top-bar links (mirrors the Cloudflare docs bar), kept as anchors so the
  // prototype is self-contained.
  const topLinks = [
    { label: 'Directory', href: '#directory' },
    { label: 'API', href: '#api' },
    { label: 'SDKs', href: '#sdks' },
    { label: 'Changelog', href: '#changelog' }
  ]

  // The docs navigation itself lives in `lib/docs-nav.js` — the real Azion
  // documentation sidebar, transcribed section for section.
  //
  // The eight sections are DRILL rows (`docsNavGroups`), not group headers: the root of
  // the rail is the eight pillars, and choosing one replaces the rail with that pillar's
  // own menu, with a Back row heading it. That is what keeps a 275-link tree navigable in
  // 300px — a reader inside `Secure` is not scrolling past `Store` and `Observe` to reach
  // it. Inside a level, a row with `children` is still the condensed (inline) sub-menu the
  // documentation uses for product groups, expanding in place behind the indent rail:
  // `Secure → Firewall → Modules → WAF → Guides` is one drill plus four inline levels.
  const active = ref(docsIdByRoute.get(route.path) ?? DOCS_GET_STARTED_ID)

  /**
   * The containers above a page, split by the model that opens each: drill sections into the
   * stack, inline subs into the expansion set. A jump has to open all of them — landing on a
   * row five levels down that nobody can see looks like nothing happened.
   */
  const ancestorsOf = (id) => {
    const ancestors = menuPath(docsNavGroups[0].items, id) ?? []
    return {
      levels: ancestors.filter((ancestorId) => docsSectionIds.has(ancestorId)),
      inline: ancestors.filter((ancestorId) => !docsSectionIds.has(ancestorId))
    }
  }

  const initial = ancestorsOf(active.value)

  // Which level the rail is showing, as `Menu`'s stack of ancestor ids. Seeded from the page
  // that is current, so the rail opens ON the reader's page rather than at a root level where
  // nothing is selected — the same rule the console rail follows.
  const path = ref(initial.levels)

  // Which inline sub-menus are open. Held here rather than left to each row's `defaultOpen`
  // because the palette has to be able to OPEN a path (see `onPaletteSelect`).
  const expanded = ref(initial.inline)
  // The scroll target lives inside the tree, so the ref is on `Menu` rather than on the rail:
  // `Sidebar` renders two roots (the rail, plus the affordance that brings a collapsed one
  // back), so its `$el` is not a single element to query into.
  const menuRef = ref(null)

  // Below `lg` the same tree lives in a sheet instead of a rail. Its own open state,
  // not the rail's `collapsed`: the rail's is persisted sizing, this is one visit.
  const navOpen = ref(false)

  // The DS focus trap moves initial focus to the panel's FIRST focusable. Park it on the
  // panel itself instead (`role="dialog"`, `tabindex="-1"`) — the conventional initial
  // focus for a dialog — so the sheet does not open with its search trigger ringed as if
  // the reader had already tapped it (and, on mobile Safari, with the viewport zoomed into
  // it). Tab from there still walks in from the top. Scheduled on a frame because the
  // trap's own focus call runs in the microtask right after open.
  const navPanel = ref(null)
  watch(navOpen, (open) => {
    if (!open) return
    globalThis.requestAnimationFrame(() => navPanel.value?.$el?.focus?.())
  })

  // A pillar row is a destination as well as a level: `Menu` emits `navigate` for it, and the
  // shell resolves it to the level's LANDING page — the first leaf inside it — so opening
  // `Secure` lands on "About Security" instead of leaving the reader on the page they came
  // from while a new menu appears. Resolving to the leaf (not the container) is also what
  // makes a row read as current on arrival: a container is not a destination.
  //
  // Only a LEAF closes the sheet. A jump to a page puts the destination behind the overlay, so
  // the overlay goes; a pillar row merely pushed a level, and the reader who opened navigation
  // to find a page has not finished choosing one yet.
  const onNavigate = (event, node) => {
    const isLevel = docsSectionIds.has(node.id)
    const target = isLevel ? menuLeaves([node])[0] : node
    if (target) active.value = target.id
    if (!isLevel) navOpen.value = false
    if (!isLevel) followRow(event, node)
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
   * Light a page's row and open every container above it.
   *
   * Used by the palette, and by arrival on a page from anywhere else — a link in the
   * prose, the browser's Back, a pasted URL. A jump that left the row folded away, or
   * the rail on the level the reader came from, looks like nothing happened.
   */
  const revealPage = (id) => {
    active.value = id
    if (hasRail.value && collapsed.value) collapsed.value = false
    const { levels, inline } = ancestorsOf(id)
    // The stack is REPLACED, not merged: a page in another pillar is in another level, and
    // the rail can only be in one. Expansion merges — a sub the reader opened by hand in a
    // level they will come back to is theirs to close.
    path.value = levels
    expanded.value = [...new Set([...expanded.value, ...inline])]
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
  // The search trigger is a read-only affordance for it (click, or press the
  // shortcut), sitting at the top of the rail on a laptop and in the top bar below
  // it. The palette carries every documentation PAGE — containers are not
  // destinations, so each section contributes its leaves — grouped and ordered
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
    <!-- ── Docs top bar ─────────────────────────────────────────────────── -->
    <header
      class="flex h-14 shrink-0 items-center gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) md:gap-(--spacing-lg) md:px-(--spacing-md)"
    >
      <!-- Below `lg` the tree has no rail to live in, so the bar carries the way
           into it. `outlined`, matching the search IconButton at the other end of the
           bar: the two are the bar's own controls, so they read as a pair. Hidden from
           `lg` up, where the rail is the way in. -->
      <IconButton
        icon="pi pi-bars"
        kind="outlined"
        size="medium"
        aria-label="Open documentation navigation"
        class="shrink-0 lg:hidden"
        @click="navOpen = true"
      />

      <RouterLink
        to="/site/docs"
        aria-label="Azion Docs — home"
        class="inline-flex shrink-0 items-center gap-(--spacing-xs) rounded-(--shape-elements) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface)"
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

      <!-- The section links need the room the rail breakpoint frees up; below `lg`
           the bar is already carrying the menu button and the search trigger. -->
      <NavigationMenu
        aria-label="Documentation sections"
        class="hidden lg:flex"
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

      <div class="ml-auto flex min-w-0 items-center gap-(--spacing-xs) md:gap-(--spacing-sm)">
        <!-- The way into the palette for the viewports with no rail: an IconButton, not
             the rail's bar — a phone has no ⌘K to hint at and no room for a label, so
             the glyph alone is the whole control. -->
        <IconButton
          icon="pi pi-search"
          kind="outlined"
          size="medium"
          aria-label="Search docs"
          class="shrink-0 lg:hidden"
          @click="openPalette"
        />
        <Button
          label="Console"
          kind="secondary"
          size="medium"
          class="shrink-0"
          @click="goConsole"
        />
      </div>
    </header>

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
          <template #header>
            <!-- Search → CommandMenu: the rail's ONE search affordance, at the top
                 of the tree it searches (DocsSearchTrigger — glyph, label, ⌘K keycap).
                 The same control, in its compact shape, is in the top bar below `lg`. -->
            <DocsSearchTrigger @click="openPalette" />
          </template>

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

          <!-- The whole sidebar is one Menu, and its ROOT is the eight pillars: each docs
               section is a DRILL row, so choosing one replaces the rail with that section's
               menu instead of unfolding 275 links into one column. The rows come from a
               manifest, so data-driven mode renders the drill plus the four inline levels
               below it rather than us re-implementing the recursion here.
               `role="presentation"` because Sidebar already renders the nav landmark. -->
          <Menu
            ref="menuRef"
            v-model:path="path"
            v-model:expanded="expanded"
            :groups="docsNavGroups"
            :active-id="active"
            role="presentation"
            @navigate="onNavigate"
          >
            <!-- Renders nothing at the root level; heads a pushed one, naming the pillar it
                 returns to. -->
            <Menu.Back />
          </Menu>
        </Sidebar>
      </div>

      <main class="min-w-0 flex-1 overflow-y-auto">
        <!-- The page bar: where the reader is, and what they can do with this page.
             It belongs to the SHELL's layout but to the PAGE's data — the shell has no
             idea which crumbs a page has or what its markdown says — so the page fills
             it through a slot and the shell decides it is pinned to the top of the
             scroll region, once, above the title. That is what lets a page's own
             masthead be title + deck and nothing else: a breadcrumb under the title
             would say the reader's location twice on one screen, and a second Copy
             control would sit a thumb away from this one. Absent slot ⇒ no bar. -->
        <div
          v-if="$slots['page-bar']"
          class="sticky top-0 z-20 flex h-12 items-center gap-(--spacing-sm) border-b border-(--border-default) bg-(--bg-canvas) px-(--spacing-md) md:gap-(--spacing-md) md:px-(--spacing-xl)"
        >
          <slot name="page-bar" />
        </div>
        <slot />
      </main>

      <!-- "On this page": the page's own heading list, so it is the page — not the
           shell — that decides what is in it. Absent slot ⇒ no rail at all. -->
      <div
        v-if="$slots.toc"
        class="hidden w-(--container-3xs) shrink-0 overflow-y-auto border-l border-(--border-default) px-(--spacing-md) py-(--spacing-lg) xl:block"
      >
        <slot name="toc" />
      </div>
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

         Search sits at the top of the sheet exactly as it sits at the top of the rail —
         searching the tree belongs to the tree, and a reader who opened navigation to
         find a page should not have to close it to search for one. Tapping it REPLACES
         the sheet with the palette (see the `paletteOpen` watch): only the palette is on
         screen while searching, never the palette over the nav.

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

          <!-- Fixed region, like the rail's own header: search stays put while the tree
               scrolls under it. It carries its own top padding on mobile, where there is
               no header row above it to provide the air. -->
          <div
            class="w-full shrink-0 px-(--spacing-md) pb-(--spacing-md) pt-(--spacing-md) md:pt-0"
          >
            <DocsSearchTrigger @click="openPalette" />
          </div>

          <ScrollArea class="min-h-0 min-w-0 w-full flex-1">
            <Menu
              v-model:path="path"
              v-model:expanded="expanded"
              :groups="docsNavGroups"
              :active-id="active"
              aria-label="Documentation"
              class="w-full p-(--spacing-md)"
              @navigate="onNavigate"
            >
              <Menu.Back />
            </Menu>
          </ScrollArea>

          <!-- From `lg` up the tree is the rail, and the rail carries this same footer, so
               here it would duplicate it.

               `--spacing-md` (the sheet's own content boundary, like the search row and
               the tree) rather than PanelFooter's `--spacing-lg`, so the switcher's right
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

<script setup>
  // Marketing website navigation — the azion.com top bar, rebuilt on
  // @aziontech/webkit. Left: the Azion Brand lockup. Center: a NavigationMenu
  // whose triggers open mega-menu panels (Solutions, Products, Developers,
  // Resources) plus plain link triggers (Customers, Pricing). Right: the account
  // actions — Contact, Login (routes into the console demo) and the highlighted
  // "Start for Free" CTA (routes to sign-up).
  //
  // RESPONSIVE — one navigation, two homes, the same rule the docs shell follows.
  // A mega-menu row needs a hover-able trigger and a panel wide enough for four
  // columns, neither of which a phone has, so `xl` (1280px) is where the bar carries
  // its menus:
  //
  //   · below xl — no menu bar. The SAME tree moves into a `Drawer` opened from the
  //     bar's menu button (the DS overlay is a left panel at md and a bottom sheet
  //     below it, like every other overlay in the app), where a mega-menu becomes a
  //     DRILL level: tapping `Products` replaces the sheet with its four groups
  //     behind a Back row, instead of unfolding 14 rows into one column. The bar
  //     keeps only the brand and the one CTA — `Contact` and `Login` are in the tree
  //     and its footer, because a 375px bar cannot hold three buttons and stay a bar;
  //   · xl and up — the mega-menus are back in the bar, and the sheet is gone.
  //
  // THE SWITCH IS `xl`, NOT `lg`, BECAUSE THE ROW IS MEASURED, not guessed: brand (80)
  // + six triggers (660) + the three account actions (261) + two region gaps is 1033px
  // of content, so the bar first fits at 1081px of window. At `lg` it was 57px short —
  // and the shortfall was invisible while the row could spill off the window's right
  // edge. On the DS bar it cannot: `GlobalHeader.Right` is `shrink-0` and the middle
  // region carries the menus, so the deficit surfaces as `Pricing` painting over
  // `Contact`. `xl` is the first breakpoint above the measured fit, and from 1192 up the
  // capped row holds a constant 111px of slack.
  //
  // The two homes read from ONE source (`megaMenus`): the sheet's tree is projected
  // from it, never transcribed, so a product added to a panel is in both at once.
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
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
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Product pillars mirror azion.com's Products mega-menu. Each entry carries the
  // `ai-*` product glyph, a label, and a one-line description for the panel.
  const productGroups = [
    {
      label: 'Build',
      href: '#build',
      items: [
        {
          icon: 'ai ai-edge-functions',
          label: 'Functions',
          description: 'Run serverless code at the edge',
          href: '/site/functions'
        },
        {
          icon: 'ai ai-tiered-cache',
          label: 'Cache',
          description: 'Speed up content delivery'
        },
        {
          icon: 'ai ai-edge-application',
          label: 'Application Accelerator',
          description: 'Optimize dynamic applications'
        },
        {
          icon: 'ai ai-edge-ai',
          label: 'AI Inference',
          description: 'Run AI models close to the user'
        }
      ]
    },
    {
      label: 'Store',
      href: '#store',
      items: [
        {
          icon: 'ai ai-edge-sql',
          label: 'SQL Database',
          description: 'A distributed SQL database'
        },
        {
          icon: 'ai ai-edge-storage',
          label: 'Object Storage',
          description: 'Store and serve objects at the edge'
        },
        { icon: 'ai ai-edge-kv', label: 'KV Store', description: 'Low-latency key-value store' }
      ]
    },
    {
      label: 'Protect',
      href: '#protect',
      items: [
        { icon: 'ai ai-waf-rules', label: 'WAF', description: 'Web application firewall' },
        {
          icon: 'ai ai-network-lists',
          label: 'Network Shield',
          description: 'Network and DDoS protection'
        },
        { icon: 'ai ai-edge-dns', label: 'Edge DNS', description: 'Distributed authoritative DNS' },
        {
          icon: 'ai ai-load-balancer',
          label: 'Load Balancer',
          description: 'Global load balancing'
        }
      ]
    },
    {
      label: 'Observe',
      href: '#observe',
      items: [
        {
          icon: 'ai ai-data-stream',
          label: 'Data Stream',
          description: 'Real-time event streaming'
        },
        {
          icon: 'ai ai-real-time-metrics',
          label: 'Real-Time Metrics',
          description: 'Live platform metrics'
        },
        {
          icon: 'ai ai-edge-pulse',
          label: 'Edge Pulse',
          description: 'Real user experience monitoring'
        }
      ]
    }
  ]

  const solutionGroups = [
    {
      label: 'By Use Case',
      href: '#use-cases',
      items: [
        {
          icon: 'ai ai-edge-application',
          label: 'Web Apps',
          description: 'Fast, scalable web applications'
        },
        {
          icon: 'ai ai-ai-pillar',
          label: 'AI',
          description: 'Infrastructure for AI workloads'
        },
        {
          icon: 'ai ai-secure-pillar',
          label: 'Application Security',
          description: 'End-to-end security'
        }
      ]
    },
    {
      label: 'By Industry',
      href: '#industries',
      items: [
        {
          icon: 'ai ai-store',
          label: 'Financial Services',
          description: 'Performance and compliance'
        },
        {
          icon: 'ai ai-build-pillar',
          label: 'Technology',
          description: 'Scale for digital products'
        },
        {
          icon: 'ai ai-marketplace',
          label: 'Retail',
          description: 'Shopping experiences you can trust'
        }
      ]
    }
  ]

  const developerGroups = [
    {
      label: 'Developer Resources',
      href: '/site/docs',
      items: [
        {
          icon: 'ai ai-datasheet',
          label: 'Documentation',
          description: 'Platform guides and reference',
          href: '/site/docs'
        },
        { icon: 'ai ai-azion-cli', label: 'Dev Tools', description: 'CLI, SDKs, and integrations' },
        {
          icon: 'ai ai-azion-api',
          label: 'API Reference',
          description: 'Automate with the Azion API'
        },
        {
          icon: 'ai ai-real-time-events',
          label: 'Release Notes',
          description: 'What is new and recently changed'
        }
      ]
    }
  ]

  const resourceGroups = [
    {
      label: 'Content',
      href: '#content',
      items: [
        { icon: 'ai ai-medium', label: 'Blog', description: 'Technical articles and news' },
        {
          icon: 'ai ai-layers',
          label: 'Resource Hub',
          description: 'E-books, webinars, and whitepapers'
        },
        {
          icon: 'ai ai-marketplace',
          label: 'Marketplace',
          description: 'Ready-made templates and integrations'
        },
        {
          icon: 'ai ai-business-support',
          label: 'Support',
          description: 'Help center and support plans'
        }
      ]
    }
  ]

  // The mega-menu panels share one layout: a grid of labelled groups, one track per group.
  // `columns` is that track count — and, on the four-track panel, the cue that it has the
  // content to be laid on the page column instead of being sized by it.
  const megaMenus = [
    { value: 'solutions', label: 'Solutions', columns: 2, groups: solutionGroups },
    { value: 'products', label: 'Products', columns: 4, groups: productGroups },
    { value: 'developers', label: 'Developers', columns: 1, groups: developerGroups },
    { value: 'resources', label: 'Resources', columns: 1, groups: resourceGroups }
  ]

  // The plain link triggers — the two bar entries that open no panel. Listed here so
  // the bar and the sheet render the same set from one place.
  const plainLinks = [
    { value: 'customers', label: 'Customers', href: '#customers' },
    { value: 'pricing', label: 'Pricing', href: '/site/pricing' }
  ]

  const goLogin = () => router.push('/login')
  const goSignup = () => router.push('/signup')

  // ── Mobile navigation (below `xl`) ──────────────────────────────────────────
  // The bar's menus, projected onto `Menu`'s data-driven shape. A mega-menu becomes a
  // DRILL row (`kind: 'drill'`), and its panel columns become that level's groups — the
  // panel's own anatomy, re-laid as a column. Descriptions do not come along: a phone
  // row is a hit target, and 14 two-line rows is a page, not a menu.
  const navGroups = computed(() => [
    {
      items: [
        ...megaMenus.map((menu) => ({
          id: menu.value,
          label: menu.label,
          kind: 'drill',
          groups: menu.groups.map((group) => ({
            // A single-group level takes no header: the level is already named by the row
            // that opened it and by the Back row heading it, so "Developers → Developer
            // Resources" would title the same list twice.
            label: menu.groups.length > 1 ? group.label : undefined,
            items: group.items.map((item) => ({
              id: `${menu.value}-${item.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
              label: item.label,
              icon: item.icon,
              href: item.href || '#'
            }))
          }))
        })),
        ...plainLinks.map((link) => ({ id: link.value, label: link.label, href: link.href })),
        { id: 'contact', label: 'Contact', href: '#contact' }
      ]
    }
  ])

  const navOpen = ref(false)
  // Which drill level the sheet is showing. Unlike the docs rail, it reflects no current
  // page, so it is reset on close — reopening the sheet inside `Products` from a visit
  // three pages ago would be state the reader never asked to keep.
  const navPath = ref([])
  // The DS focus trap moves initial focus to the panel's FIRST focusable. Park it on the
  // panel instead (`role="dialog"`, `tabindex="-1"`) so the sheet does not open with its
  // first row ringed as if it had been tapped. Scheduled on a frame because the trap's own
  // focus call runs in the microtask right after open.
  const navPanel = ref(null)

  watch(navOpen, (open) => {
    if (!open) {
      navPath.value = []
      return
    }
    globalThis.requestAnimationFrame(() => navPanel.value?.$el?.focus?.())
  })

  // Widening past `xl` puts the menus back in the bar — which is this sheet's own
  // content, so leaving it open would hold a focus trap over navigation that is now
  // on the page. The query mirrors the class breakpoint below; the two are one decision.
  const barQuery = globalThis.matchMedia?.('(min-width: 1280px)')
  const onBarQueryChange = (event) => {
    if (event.matches) navOpen.value = false
  }
  barQuery?.addEventListener('change', onBarQueryChange)
  onBeforeUnmount(() => barQuery?.removeEventListener('change', onBarQueryChange))

  // ── Where the page column starts ────────────────────────────────────────────
  // `GlobalHeader kind="site"` insets itself to the shared column with a formula of its own
  // (`--container-site` capped by the window, plus `--layout-boundary-inline`). The wide
  // Products panel has to land on that same column, and the ONE number the menu needs to do
  // it is how far the column sits from the window edge — which is exactly the bar's own
  // resolved padding. Reading it off the element rather than restating the formula means the
  // panel follows the bar even if the DS changes how the bar is inset.
  const bar = ref(null)
  const columnInset = ref(0)

  // `GlobalHeader`'s template opens with a comment, which makes the component a FRAGMENT —
  // so `$el` is that comment node, not the `<header>`, and handing it to `getComputedStyle`
  // throws. Walk to the first real element instead of trusting `$el` to be one.
  const readColumnInset = () => {
    const node = bar.value?.$el
    const el = node instanceof globalThis.Element ? node : (node?.nextElementSibling ?? null)
    if (!el) return
    columnInset.value = Number.parseFloat(globalThis.getComputedStyle(el).paddingLeft) || 0
  }

  onMounted(() => {
    readColumnInset()
    globalThis.addEventListener('resize', readColumnInset, { passive: true })
  })
  onBeforeUnmount(() => globalThis.removeEventListener('resize', readColumnInset))

  /**
   * Only a LEAF closes the sheet. A drill row merely pushed a level, and the reader who
   * opened navigation to find a page has not finished choosing one yet. In-app routes are
   * pushed through the router so the sheet's rows behave like the bar's — the panel links
   * are anchors, and a bare `href="/site/docs"` would reload the app.
   */
  const onNavigate = (event, node) => {
    if (node.groups) return
    if (node.href?.startsWith('/')) {
      event.preventDefault()
      router.push(node.href)
    }
    navOpen.value = false
  }
</script>

<template>
  <!-- ── The bar ───────────────────────────────────────────────────────────
       THE DS BAR (`GlobalHeader`), not a hand-rolled `<header>` — the same component the
       console shell and the docs shell put at the top of their pages. The height, the
       surface, the hairline, the `role="banner"` landmark, the rhythm between the regions
       and the inset all come from it; this file only says what goes in each region. This
       bar was the one shell in the app still declaring those five things itself, and a bar
       that re-declares them is a bar that drifts from the other two the first time one of
       them is retuned.

       `kind="site"` is the placement for a page that is a FRAME rather than an app zone.
       The surface stays full bleed — the fill and the hairline run to the window edges,
       because a bar is chrome — while the REGIONS are capped at `--container-site` and
       centred, which is exactly BannerContainer's inner column. So the logo opens on the
       same vertical as the hero headline, the plan names and every matrix row label, at
       every width, by construction rather than by two numbers kept equal by hand.

       THE CAP IS THE POINT, and it belongs to the DS, not to this file. The bar used to be
       inset from the WINDOW alone (`--layout-boundary-inline`, uncapped) — correct while
       the window is near the frame, and coming apart above it: the column stops growing at
       1192px and an uncapped bar does not, so at 2560 the logo sat 684px to the left of the
       headline under it and the account actions the same distance to the right. Navigation
       drifting away from the content it navigates is the one thing a top bar cannot afford.
       Below 1192 the cap is inert and the boundary is the whole inset, so the placement
       collapses to `content` and nothing moves on a laptop or a phone.

       It is NOT the page frame climbing into the chrome — the shape the earlier
       `FrameBox borders="x"` version had, which ran the column's side rules up through the
       bar. The bar still draws no rule but its own floor. The navigation sheet and the
       sticky matrix header stay registered to the WINDOW (neither can follow a centred
       column), while the mega-menu panel deliberately takes this same cap — see the
       positioner below, which re-centres the DS placement on `--container-site` so the
       sheet's edges land on the brand and the actions above it.

       `sticky` and the stacking order stay HERE: they are this shell's decision (SiteLayout
       owns the scroll region the bar sticks to), not the bar's. -->
  <GlobalHeader
    ref="bar"
    kind="site"
    aria-label="Azion"
    class="sticky top-0 z-40"
  >
    <!-- `justify-start!`, the same call DocsLayout makes: the DS region ships
         `justify-end`, inert while the region is content-sized, but it packs the cluster
         against its own trailing edge the moment the row has slack. Important, not a plain
         class — `justify-start` and `justify-end` are the same property, and CSS source
         order decides the winner, not the order they are written here. -->
    <GlobalHeader.Left class="justify-start!">
      <!-- Below `xl` the menus have no bar to live in, so the bar carries the way into
           them instead. Leading edge, like the docs shell's — the three shells of this app
           put the way into navigation in the same corner. -->
      <IconButton
        icon="pi pi-bars"
        kind="outlined"
        size="medium"
        aria-label="Open navigation"
        class="shrink-0 xl:hidden"
        @click="navOpen = true"
      />

      <GlobalHeader.Brand>
        <RouterLink
          to="/site"
          aria-label="Azion — home"
          class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </RouterLink>
      </GlobalHeader.Brand>
    </GlobalHeader.Left>

    <!-- The menus are the bar's MIDDLE region, left-aligned against the brand rather than
         centred in the row: azion.com reads brand → menus as one leading cluster, and a
         centred set of six triggers would leave a hole between them and the logo that
         grows with the window. The region keeps its `flex-1`, which is what pushes the
         account actions to the trailing edge — no `ml-auto` anywhere. -->
    <GlobalHeader.Middle class="justify-start!">
      <NavigationMenu
        aria-label="Azion"
        class="min-w-0"
      >
        <NavigationMenu.List class="hidden items-center gap-(--spacing-xxs) xl:flex">
          <NavigationMenu.Item
            v-for="menu in megaMenus"
            :key="menu.value"
            :value="menu.value"
          >
            <NavigationMenu.Trigger>
              {{ menu.label }}
              <NavigationMenu.Icon>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 4.5L6 7.5L9 4.5"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </NavigationMenu.Icon>
            </NavigationMenu.Trigger>
            <NavigationMenu.Content class="w-full">
              <!-- ONLY THE FOUR-TRACK PANEL IS LAID ON THE PAGE COLUMN. `Products` is the
                   one with the content to fill it; giving the same width to `Developers` or
                   `Resources` bought a single group beside three empty tracks. Every other
                   panel is sized by its own content, as before — the shared sheet is PLACED
                   on the column, and only this one is STRETCHED to it.

                   The width is that column exactly — `--container-site` capped by the window,
                   less the boundary on both sides, less the slot's `--spacing-md` padding and
                   the popup's 1px rule on each side, since this grid sits inside both and the
                   sheet has to measure out to the column including them. It goes on the GRID, not on the popup:
                   the DS sizes the popup by measuring the panel, so a panel asking for the
                   column is what makes the popup the column — and a panel that asks for
                   nothing keeps its natural width. -->
              <!-- NO GUTTER OF ITS OWN: the entry's box carries 20px on each side, so a
                   column gap on top of it spends the column twice and buys nothing — 40px
                   already separates one column's text from the next, and every 42px the grid
                   keeps is 10px off each track. The PANEL's own padding is a different thing
                   and is not this element's to give: `NavigationMenu.Content` already pads its
                   slot by `--spacing-md`, which is what holds an entry's hover surface off the
                   popup's rounded edge. It was being overridden to `p-0` here, so the surface
                   ran into the corner. -->
              <div
                class="grid gap-x-0 gap-y-(--spacing-md)"
                :class="{
                  'grid-cols-1': menu.columns === 1,
                  'grid-cols-2': menu.columns === 2,
                  'grid-cols-4 w-[calc(min(var(--container-site),100vw)_-_2*var(--layout-boundary-inline)_-_2*var(--spacing-md)_-_2px)]':
                    menu.columns === 4
                }"
              >
                <!-- The heading carries the section's own page: a reader who came for
                     "everything under Store" should not have to pick one of its products to
                     get there. The DS renders it as a link and closes the panel on the way. -->
                <NavigationMenu.List
                  v-for="group in menu.groups"
                  :key="group.label"
                  :label="group.label"
                  :href="group.href"
                >
                  <NavigationMenu.Item
                    v-for="item in group.items"
                    :key="item.label"
                    layout="entry"
                    :href="item.href || '#'"
                    :description="item.description"
                    close-on-click
                  >
                    <template #icon>
                      <i
                        :class="item.icon"
                        aria-hidden="true"
                      />
                    </template>
                    {{ item.label }}
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </div>
            </NavigationMenu.Content>
          </NavigationMenu.Item>

          <NavigationMenu.Item
            v-for="link in plainLinks"
            :key="link.value"
          >
            <NavigationMenu.Trigger :href="link.href">{{ link.label }}</NavigationMenu.Trigger>
          </NavigationMenu.Item>
        </NavigationMenu.List>

        <NavigationMenu.Portal>
          <!-- THE WIDE PANEL LANDS ON THE PAGE COLUMN — VIA THE COLLISION PADDING, not by
               taking the placement away from the DS. The positioner anchors to the active
               trigger and then clamps itself into the window, which is right for the three
               panels that are sized by their own content, and wrong for `Products`: at 1440
               it put a 1146px sheet at x=345..1432, its right edge 116px past the column the
               bar and the hero share, and between 1024 and ~1103 it did not fit at all.

               Telling the clamp that the "window edge" is the COLUMN edge fixes exactly that
               panel and nothing else. `collisionPadding` is the inset read off the bar, and
               the clamp is `x ∈ [P, vw - W - P]`: a sheet as wide as the column (`W = vw - 2P`)
               has one legal x — P, the column's leading edge — while a narrow panel keeps the
               placement it always had and merely stops short of the column's edges.

               The alternative was to override the placement outright (`transform-none!` +
               `left-1/2!` + an explicit `top`), which pins the wide panel just as well and
               takes the other three with it: they land centred on the page, disconnected from
               the trigger that opened them, and the arrow and the scale origin — both computed
               from the placement — point at nothing. One prop, and the DS keeps its own job. -->
          <NavigationMenu.Positioner
            side="bottom"
            align="start"
            :side-offset="12"
            :collision-padding="columnInset"
          >
            <!-- `kind="contrast"` is the DS's inverted panel: over this page — pinned dark,
                 `--bg-canvas` pure black — a backdrop cannot darken anything and a shadow is
                 invisible, and the fill cannot merely be raised without pushing the entry copy
                 under the contrast floor. The variant swaps to `--bg-contrast` / `--text-contrast`
                 and re-inks its own subtree; see the rationale on the preset. -->
            <NavigationMenu.Popup kind="contrast">
              <NavigationMenu.Arrow />
              <NavigationMenu.Viewport />
            </NavigationMenu.Popup>
          </NavigationMenu.Positioner>
        </NavigationMenu.Portal>
      </NavigationMenu>
    </GlobalHeader.Middle>

    <!-- Below `xl` the bar keeps ONE action — the CTA. `Contact` and `Login` are in the
         sheet (a row in the tree, a button in its footer), because three buttons and a
         brand do not fit a 375px bar without every one of them shrinking below its own
         hit target. -->
    <GlobalHeader.Right>
      <!-- The wrapper, not the buttons, carries the breakpoint: `Button`'s own
           `inline-flex` base wins over a `hidden` passed as a class, so a button told to
           hide itself stays on the bar. -->
      <div class="hidden items-center gap-(--spacing-xs) xl:flex">
        <Button
          label="Contact"
          kind="text"
          size="medium"
          href="#contact"
        />
        <Button
          label="Login"
          kind="secondary"
          size="medium"
          @click="goLogin"
        />
      </div>
      <Button
        label="Start for Free"
        kind="primary"
        size="medium"
        class="shrink-0"
        @click="goSignup"
      />
    </GlobalHeader.Right>
  </GlobalHeader>

  <!-- ── Navigation sheet (below `xl`) ───────────────────────────────────────
       A SIBLING OF THE BAR, not a child of it. The bar is a flex row and `Drawer`'s root is
       a real `div` (its panel is teleported out of it), so inside the header it would be an
       empty region earning the row's own `gap` — 16px of dead space after the CTA. Two
       roots here is safe: SiteLayout renders `<SiteNav />` with no class of its own and its
       column declares no `gap`, so the zero-height drawer div costs nothing. A wrapper
       `div` around both would be worse — the bar's `sticky` would then resolve against that
       wrapper and stop sticking the moment it scrolled past.

       The bar's own menus, in the overlay the DS already gives every panel on a small
       screen: a left panel at `md`, a bottom sheet below it. Each mega-menu is a DRILL row
       here — tapping `Products` replaces the sheet with its four groups behind a Back row —
       so the deepest tree in the bar is still one column of hit targets.

       The tree sits on the sheet's own edges rather than inside PanelContent's padding, so
       a row's hit area runs the full width of the panel (hence ScrollArea + a bare Menu).
       `Login` takes the footer: it is the one action the bar gave up below `xl`, and an
       account action is not a place in the tree. -->
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
               `hidden` rather than removed, because DrawerContent names the dialog with
               `aria-labelledby` pointing at this title — a referenced element still
               provides the accessible name while hidden. -->
        <PanelHeader class="hidden w-full md:flex">
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerClose />
        </PanelHeader>

        <ScrollArea class="min-h-0 w-full min-w-0 flex-1">
          <Menu
            v-model:path="navPath"
            :groups="navGroups"
            aria-label="Azion"
            class="w-full p-(--spacing-md)"
            @navigate="onNavigate"
          >
            <!-- Renders nothing at the root level; heads a pushed one, naming the
                   menu it returns to. -->
            <Menu.Back />
          </Menu>
        </ScrollArea>

        <PanelFooter class="w-full px-(--spacing-md)">
          <Button
            label="Login"
            kind="secondary"
            size="medium"
            class="w-full"
            @click="goLogin"
          />
        </PanelFooter>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>

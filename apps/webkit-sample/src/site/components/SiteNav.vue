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
  // columns, neither of which a phone has, so `lg` (1024px) is where the bar carries
  // its menus:
  //
  //   · below lg — no menu bar. The SAME tree moves into a `Drawer` opened from the
  //     bar's menu button (the DS overlay is a left panel at md and a bottom sheet
  //     below it, like every other overlay in the app), where a mega-menu becomes a
  //     DRILL level: tapping `Products` replaces the sheet with its four groups
  //     behind a Back row, instead of unfolding 14 rows into one column. The bar
  //     keeps only the brand and the one CTA — `Contact` and `Login` are in the tree
  //     and its footer, because a 375px bar cannot hold three buttons and stay a bar;
  //   · lg and up — the mega-menus are back in the bar, and the sheet is gone.
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
  import FrameBox from '@aziontech/webkit/frame-box'
  import IconButton from '@aziontech/webkit/icon-button'
  import Menu from '@aziontech/webkit/menu'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Product pillars mirror azion.com's Products mega-menu. Each entry carries the
  // `ai-*` product glyph, a label, and a one-line description for the panel.
  const productGroups = [
    {
      label: 'Build',
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

  // The mega-menu panels share one layout: an N-column grid of labelled groups.
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
    { value: 'pricing', label: 'Pricing', href: '#pricing' }
  ]

  const goLogin = () => router.push('/login')
  const goSignup = () => router.push('/signup')

  // ── Mobile navigation (below `lg`) ──────────────────────────────────────────
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

  // Widening past `lg` puts the menus back in the bar — which is this sheet's own
  // content, so leaving it open would hold a focus trap over navigation that is now
  // on the page.
  const barQuery = globalThis.matchMedia?.('(min-width: 1024px)')
  const onBarQueryChange = (event) => {
    if (event.matches) navOpen.value = false
  }
  barQuery?.addEventListener('change', onBarQueryChange)
  onBeforeUnmount(() => barQuery?.removeEventListener('change', onBarQueryChange))

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
  <header class="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
    <!-- THE BAR IS THE TOP OF THE PAGE'S FRAME, so its content lands inside the same
         layout boundary as everything under it: `--container-5xl` centred, the width the
         hero band, the framed column and the footer all resolve to. It used to be
         `--container-7xl` with `px-md`, which put the logo 16px from the VIEWPORT while
         every other block on the page started 172px in — the one element registered to
         the window instead of to the frame.
         `borders="x"` continues the column's own side rules up through the bar, so the
         frame is drawn from the first pixel of the page rather than starting under the
         hero. `marks="none"`: at 56px tall a corner tick would sit 4px from the logo and
         read as debris, and the junction below is the bar's own full-bleed rule. -->
    <FrameBox
      borders="x"
      marks="none"
      class="mx-auto w-full max-w-[var(--container-5xl)]"
    >
      <NavigationMenu
        aria-label="Azion"
        class="flex h-14 w-full min-w-0 items-center gap-[var(--spacing-sm)] px-[var(--spacing-xl)] lg:gap-[var(--spacing-lg)]"
      >
        <!-- Below `lg` the menus have no bar to live in, so the bar carries the way into
           them instead. Leading edge, like the docs shell's — the two shells of this app
           put the way into navigation in the same corner. -->
        <IconButton
          icon="pi pi-bars"
          kind="outlined"
          size="medium"
          aria-label="Open navigation"
          class="shrink-0 lg:hidden"
          @click="navOpen = true"
        />

        <RouterLink
          to="/site"
          aria-label="Azion — home"
          class="inline-flex shrink-0 items-center self-center rounded-[var(--shape-elements)] transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
        >
          <Brand
            kind="default"
            size="small"
          />
        </RouterLink>

        <NavigationMenu.List class="hidden items-center gap-[var(--spacing-xxs)] lg:flex">
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
            <NavigationMenu.Content class="w-full p-0">
              <div
                class="grid gap-[var(--spacing-md)] p-[var(--spacing-sm)]"
                :class="{
                  'grid-cols-1': menu.columns === 1,
                  'grid-cols-2': menu.columns === 2,
                  'grid-cols-4': menu.columns === 4
                }"
              >
                <NavigationMenu.List
                  v-for="group in menu.groups"
                  :key="group.label"
                  :label="group.label"
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

        <!-- Below `lg` the bar keeps ONE action — the CTA. `Contact` and `Login` are in the
           sheet (a row in the tree, a button in its footer), because three buttons and a
           brand do not fit a 375px bar without every one of them shrinking below its own
           hit target. -->
        <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
          <!-- The wrapper, not the buttons, carries the breakpoint: `Button`'s own
             `inline-flex` base wins over a `hidden` passed as a class, so a button told
             to hide itself stays on the bar. -->
          <div class="hidden items-center gap-[var(--spacing-xs)] lg:flex">
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
        </div>

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
    </FrameBox>

    <!-- ── Navigation sheet (below `lg`) ─────────────────────────────────────
         The bar's own menus, in the overlay the DS already gives every panel on a small
         screen: a left panel at `md`, a bottom sheet below it. Each mega-menu is a DRILL
         row here — tapping `Products` replaces the sheet with its four groups behind a
         Back row — so the deepest tree in the bar is still one column of hit targets.

         The tree sits on the sheet's own edges rather than inside PanelContent's padding,
         so a row's hit area runs the full width of the panel (hence ScrollArea + a bare
         Menu). `Login` takes the footer: it is the one action the bar gave up below `lg`,
         and an account action is not a place in the tree. -->
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
              class="w-full p-[var(--spacing-md)]"
              @navigate="onNavigate"
            >
              <!-- Renders nothing at the root level; heads a pushed one, naming the
                   menu it returns to. -->
              <Menu.Back />
            </Menu>
          </ScrollArea>

          <PanelFooter class="w-full px-[var(--spacing-md)]">
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
  </header>
</template>

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
  //     eight sections as its groups, plus the shell's own commands.
  //
  // Search lives at the TOP OF THE RAIL, not in the top bar: the rail is what the
  // documentation tree is, so its search belongs to it. It is a single large button
  // rather than a field — the palette owns the typing, and it already does what an
  // in-rail filter did (find a page by name), so the rail carries no second input.
  //
  // The theme is driven by the shared app theme singleton via the header's
  // ThemeSwitcher, so light/dark/system persist across the app like every other
  // route.
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import Kbd from '@aziontech/webkit/kbd'
  import Menu from '@aziontech/webkit/menu'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import Sidebar from '@aziontech/webkit/sidebar'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { computed, nextTick, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { useDocsSidebar } from '../../docs-sidebar.js'
  import { DOCS_GET_STARTED_ID, docsNavSections } from '../../lib/docs-nav.js'
  import { menuLeaves, menuPath } from '../../lib/menu-tree.js'
  import { useTheme } from '../../theme.js'

  const router = useRouter()
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
  // documentation sidebar, transcribed section for section. Each section is a static
  // header with its pillar glyph plus a recursive tree of `Menu` rows, where a row
  // with `children` is a condensed (inline) sub-menu that expands in place behind the
  // indent rail rather than navigating. `Secure → Firewall → Modules → WAF → Guides`
  // nests five levels deep, which is the depth the rail is designed to stay readable at.
  const active = ref(DOCS_GET_STARTED_ID)

  // Which sub-menus are open. Held here rather than left to each row's `defaultOpen`
  // because the palette has to be able to OPEN a path: jumping to a page five levels
  // down means expanding the four containers above it (see `onPaletteSelect`).
  const expanded = ref([])
  // The scroll target lives inside the tree, so the ref is on `Menu` rather than on the rail:
  // `Sidebar` renders two roots (the rail, plus the affordance that brings a collapsed one
  // back), so its `$el` is not a single element to query into.
  const menuRef = ref(null)

  // ── ⌘K palette ──────────────────────────────────────────────────────────────
  // The top bar's search field is a read-only affordance for it (click, or press
  // the shortcut). The palette carries every documentation PAGE — containers are
  // not destinations, so each section contributes its leaves — grouped and ordered
  // exactly like the rail, then the shell's own commands.
  const paletteOpen = ref(false)
  const openPalette = () => {
    paletteOpen.value = true
  }

  const paletteGroups = computed(() =>
    docsNavSections.map((section) => ({
      key: section.label,
      heading: section.label,
      items: menuLeaves(section.items)
    }))
  )
  const paletteItems = computed(() => paletteGroups.value.flatMap((group) => group.items))

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
      label: collapsed.value ? 'Expand Navigation' : 'Collapse Navigation',
      icon: collapsed.value ? 'pi pi-angle-double-right' : 'pi pi-angle-double-left',
      run: () => {
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
      active.value = item.id
      if (collapsed.value) collapsed.value = false
      const ancestors = docsNavSections.flatMap((section) => menuPath(section.items, item.id) ?? [])
      expanded.value = [...new Set([...expanded.value, ...ancestors])]
      nextTick(() => {
        menuRef.value?.$el
          ?.querySelector('[aria-current="page"]')
          ?.scrollIntoView({ block: 'nearest' })
      })
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
    class="docs-shell flex h-dvh flex-col overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-default)]"
  >
    <!-- ── Docs top bar ─────────────────────────────────────────────────── -->
    <header
      class="flex h-14 shrink-0 items-center gap-[var(--spacing-lg)] border-b border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-md)]"
    >
      <RouterLink
        to="/site/docs"
        aria-label="Azion Docs — home"
        class="inline-flex shrink-0 items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
      >
        <Brand
          kind="default"
          size="small"
        />
        <span
          class="rounded-[var(--shape-elements)] border border-[var(--border-muted)] px-[var(--spacing-xxs)] py-px text-overline-sm uppercase tracking-widest text-[var(--text-muted)]"
        >
          Docs
        </span>
      </RouterLink>

      <NavigationMenu
        aria-label="Documentation sections"
        class="hidden md:flex"
      >
        <NavigationMenu.List class="items-center gap-[var(--spacing-xxs)]">
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

      <div class="ml-auto flex items-center gap-[var(--spacing-sm)]">
        <ThemeSwitcher
          v-model:value="theme"
          aria-label="Theme"
        />
        <Button
          label="Console"
          kind="secondary"
          size="medium"
          @click="goConsole"
        />
      </div>
    </header>

    <!-- ── Sidebar + main ───────────────────────────────────────────────── -->
    <!-- `relative`, because the collapsed rail's edge affordance is positioned
         against this row (see Sidebar's collapsed affordance). -->
    <div class="relative flex min-h-0 flex-1">
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
        class="h-full w-[var(--container-2xs)]"
      >
        <template #header>
          <!-- Search → CommandMenu: the rail's ONE search affordance, at the top
                     of the tree it searches. A BUTTON, not a field — the palette owns
                     the typing, and the palette also does what an in-rail filter did
                     (find a page by name), so the rail carries no second input.
                     h-10 / text-label-md, the large InputText's dimensions, because it
                     is the rail's primary action and reads as a search bar. -->
          <button
            type="button"
            aria-keyshortcuts="Meta+K"
            class="flex h-10 w-full cursor-pointer items-center gap-[var(--spacing-xs)] rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)] px-[var(--spacing-sm)] text-left text-label-md text-[var(--text-muted)] transition-colors duration-150 ease-out hover:border-[var(--border-strong)] hover:text-[var(--text-default)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)] motion-reduce:transition-none"
            @click="openPalette"
          >
            <i
              class="pi pi-search shrink-0"
              aria-hidden="true"
            />
            <span class="min-w-0 flex-1 truncate">Search docs</span>
            <Kbd
              meta
              size="small"
              class="shrink-0"
              >K</Kbd
            >
          </button>
        </template>

        <!-- The whole sidebar is one Menu: each docs section is a Menu GROUP, whose
                   label is the section header — a group titles its rows without folding
                   them, which is exactly what the documentation's headers do. The rows come
                   from a manifest, so data-driven mode renders the five levels of recursion
                   rather than us re-implementing it here. `role="presentation"` because
                   Sidebar already renders the nav landmark. -->
        <Menu
          ref="menuRef"
          v-model:expanded="expanded"
          :groups="docsNavSections"
          :active-id="active"
          role="presentation"
          @navigate="(event, node) => (active = node.id)"
        />
      </Sidebar>

      <main class="min-w-0 flex-1 overflow-y-auto">
        <slot />
      </main>

      <!-- "On this page": the page's own heading list, so it is the page — not the
           shell — that decides what is in it. Absent slot ⇒ no rail at all. -->
      <div
        v-if="$slots.toc"
        class="hidden w-[var(--container-3xs)] shrink-0 overflow-y-auto border-l border-[var(--border-default)] px-[var(--spacing-md)] py-[var(--spacing-lg)] xl:block"
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
  </div>
</template>

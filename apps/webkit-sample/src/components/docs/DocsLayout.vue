<script setup>
  // Developer-docs shell — a Cloudflare-docs-style layout rebuilt on
  // @aziontech/webkit and theme tokens, with the Azion documentation's own
  // navigation. Unlike SiteLayout (marketing nav + footer, single scrolling
  // column), this is a docs layout: a fixed docs top bar, a filterable left
  // navigation rail (webkit Sidebar), and an independently scrolling main
  // content region. Pages pass their content through the default slot.
  //
  // The theme is driven by the shared app theme singleton via the header's
  // ThemeSwitcher, so light/dark/system persist across the app like every other
  // route.
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import InputText from '@aziontech/webkit/input-text'
  import MenuItem from '@aziontech/webkit/menu-item'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import Sidebar from '@aziontech/webkit/sidebar'
  import SidebarGroup from '@aziontech/webkit/sidebar-group'
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { computed, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import { useTheme } from '../../theme.js'

  const router = useRouter()
  const goConsole = () => router.push('/login')

  const { theme } = useTheme()

  // Docs top-bar links (mirrors the Cloudflare docs bar), kept as anchors so the
  // prototype is self-contained.
  const topLinks = [
    { label: 'Directory', href: '#directory' },
    { label: 'API', href: '#api' },
    { label: 'SDKs', href: '#sdks' },
    { label: 'Changelog', href: '#changelog' }
  ]

  // The docs navigation, matching the Azion documentation's product groupings
  // (Build / Store / Secure / Deploy / Observe) under a Get-started section. The
  // first item of the first group is the active "Overview" page.
  const navGroups = [
    {
      label: 'Get started',
      items: [
        { id: 'overview', label: 'Overview', icon: 'pi pi-book' },
        { id: 'build-application', label: 'Build an application', icon: 'pi pi-play' },
        { id: 'develop', label: 'Develop with Azion', icon: 'ai ai-azion-cli' },
        { id: 'env-vars', label: 'Environment Variables', icon: 'pi pi-sliders-h' },
        { id: 'troubleshoot', label: 'Troubleshoot', icon: 'pi pi-wrench' }
      ]
    },
    {
      label: 'Build',
      items: [
        { id: 'ai-inference', label: 'AI Inference', icon: 'ai ai-edge-ai' },
        { id: 'accelerator', label: 'Application Accelerator', icon: 'ai ai-edge-application' },
        { id: 'cache', label: 'Cache', icon: 'ai ai-tiered-cache' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions' },
        { id: 'image-processor', label: 'Image Processor', icon: 'pi pi-image' }
      ]
    },
    {
      label: 'Store',
      items: [
        { id: 'object-storage', label: 'Object Storage', icon: 'ai ai-edge-storage' },
        { id: 'sql', label: 'SQL Database', icon: 'ai ai-edge-sql' },
        { id: 'kv', label: 'KV Store', icon: 'ai ai-edge-kv' }
      ]
    },
    {
      label: 'Secure',
      items: [
        { id: 'waf', label: 'Web Application Firewall', icon: 'ai ai-waf-rules' },
        { id: 'network-shield', label: 'Network Shield', icon: 'ai ai-network-lists' },
        { id: 'bot-manager', label: 'Bot Manager', icon: 'pi pi-shield' },
        { id: 'ddos', label: 'DDoS Protection', icon: 'ai ai-origin-shield' },
        { id: 'edge-dns', label: 'Edge DNS', icon: 'ai ai-edge-dns' }
      ]
    },
    {
      label: 'Deploy',
      items: [
        { id: 'orchestrator', label: 'Orchestrator', icon: 'ai ai-edge-orchestrator' },
        { id: 'edge-services', label: 'Edge Services', icon: 'ai ai-edge-services' },
        { id: 'edge-node', label: 'Edge Node', icon: 'ai ai-edge-nodes' }
      ]
    },
    {
      label: 'Observe',
      items: [
        { id: 'data-stream', label: 'Data Stream', icon: 'ai ai-data-stream' },
        { id: 'edge-pulse', label: 'Edge Pulse', icon: 'ai ai-edge-pulse' },
        { id: 'events', label: 'Real-Time Events', icon: 'ai ai-real-time-events' },
        { id: 'metrics', label: 'Real-Time Metrics', icon: 'ai ai-real-time-metrics' }
      ]
    }
  ]

  const active = ref('overview')
  const query = ref('')

  // Filter the baked-in groups by label; drop groups that end up empty.
  const filteredGroups = computed(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return navGroups
    return navGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.label.toLowerCase().includes(q))
      }))
      .filter((group) => group.items.length > 0)
  })

  const hasResults = computed(() => filteredGroups.value.length > 0)
  const clearSearch = () => {
    query.value = ''
  }
</script>

<template>
  <!-- Own the scroll region: the global shell locks html/body/#app to
       height:100dvh; overflow:hidden, so this docs shell is a full-height column
       with the top bar fixed and the sidebar + main sharing the remaining height. -->
  <div class="flex h-dvh flex-col overflow-hidden bg-[var(--bg-canvas)] text-[var(--text-default)]">
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
        <div class="hidden w-64 sm:block">
          <InputText
            v-model="query"
            placeholder="Search docs"
            size="small"
            aria-label="Search documentation"
            @keydown.esc="clearSearch"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>
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
    <div class="flex min-h-0 flex-1">
      <div class="hidden w-[var(--container-2xs)] shrink-0 md:block">
        <Sidebar aria-label="Documentation">
          <template #header>
            <div class="md:hidden">
              <InputText
                v-model="query"
                placeholder="Filter sidebar"
                size="small"
                aria-label="Filter navigation"
                @keydown.esc="clearSearch"
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </InputText>
            </div>
          </template>

          <SidebarGroup
            v-for="group in filteredGroups"
            :key="group.label"
            :label="group.label"
          >
            <MenuItem
              v-for="item in group.items"
              :key="item.id"
              :label="item.label"
              :icon="item.icon"
              :selected="active === item.id"
              @click="active = item.id"
            />
          </SidebarGroup>
          <p
            v-if="!hasResults"
            class="px-[var(--spacing-xs)] py-[var(--spacing-sm)] text-body-sm text-[var(--text-muted)]"
          >
            No results for “{{ query.trim() }}”
          </p>
        </Sidebar>
      </div>

      <main class="min-w-0 flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
  // Marketing website navigation — the azion.com top bar, rebuilt on
  // @aziontech/webkit. Left: the Azion Brand lockup. Center: a NavigationMenu
  // whose triggers open mega-menu panels (Solutions, Products, Developers,
  // Resources) plus plain link triggers (Customers, Pricing). Right: the account
  // actions — Contact, Login (routes into the console demo) and the highlighted
  // "Start for Free" CTA (routes to sign-up).
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
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
          description: 'Run serverless code at the edge'
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

  const goLogin = () => router.push('/login')
  const goSignup = () => router.push('/signup')
</script>

<template>
  <header class="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-surface)]">
    <NavigationMenu
      aria-label="Azion"
      class="mx-auto flex h-14 w-full min-w-0 max-w-[var(--container-7xl)] items-center gap-[var(--spacing-lg)] px-[var(--spacing-md)]"
    >
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

        <NavigationMenu.Item>
          <NavigationMenu.Trigger href="#customers">Customers</NavigationMenu.Trigger>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger href="#pricing">Pricing</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
        <Button
          label="Contact"
          kind="text"
          size="medium"
          class="hidden sm:inline-flex"
          href="#contact"
        />
        <Button
          label="Login"
          kind="secondary"
          size="medium"
          @click="goLogin"
        />
        <Button
          label="Start for Free"
          kind="primary"
          size="medium"
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
  </header>
</template>

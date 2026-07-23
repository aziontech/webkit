<script setup>
  // Marketing website navigation — the azion.com/pt-br top bar, rebuilt on
  // @aziontech/webkit. Left: the Azion Brand lockup. Center: a NavigationMenu
  // whose triggers open mega-menu panels (Soluções, Produtos, Desenvolvedores,
  // Recursos) plus plain link triggers (Clientes, Preços). Right: the account
  // actions — Contato, Login (routes into the console demo) and the highlighted
  // "Começar Gratuitamente" CTA (routes to sign-up).
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'
  import { useRouter } from 'vue-router'

  const router = useRouter()

  // Product pillars mirror azion.com's Products mega-menu. Each entry carries the
  // `ai-*` product glyph, a label, and a one-line description for the panel.
  const productGroups = [
    {
      label: 'Construir',
      items: [
        { icon: 'ai ai-edge-functions', label: 'Functions', description: 'Execute código serverless na borda' },
        { icon: 'ai ai-tiered-cache', label: 'Cache', description: 'Acelere a entrega de conteúdo' },
        { icon: 'ai ai-edge-application', label: 'Application Accelerator', description: 'Otimize aplicações dinâmicas' },
        { icon: 'ai ai-edge-ai', label: 'AI Inference', description: 'Rode modelos de IA próximos ao usuário' }
      ]
    },
    {
      label: 'Armazenar',
      items: [
        { icon: 'ai ai-edge-sql', label: 'SQL Database', description: 'Banco de dados SQL distribuído' },
        { icon: 'ai ai-edge-storage', label: 'Object Storage', description: 'Armazene e sirva objetos na borda' },
        { icon: 'ai ai-edge-kv', label: 'KV Store', description: 'Chave-valor de baixa latência' }
      ]
    },
    {
      label: 'Proteger',
      items: [
        { icon: 'ai ai-waf-rules', label: 'WAF', description: 'Firewall de aplicação web' },
        { icon: 'ai ai-network-lists', label: 'Network Shield', description: 'Proteção de rede e DDoS' },
        { icon: 'ai ai-edge-dns', label: 'Edge DNS', description: 'DNS autoritativo distribuído' },
        { icon: 'ai ai-load-balancer', label: 'Load Balancer', description: 'Balanceamento de carga global' }
      ]
    },
    {
      label: 'Observar',
      items: [
        { icon: 'ai ai-data-stream', label: 'Data Stream', description: 'Streaming de eventos em tempo real' },
        { icon: 'ai ai-real-time-metrics', label: 'Real-Time Metrics', description: 'Métricas ao vivo da plataforma' },
        { icon: 'ai ai-edge-pulse', label: 'Edge Pulse', description: 'Monitoramento da experiência real' }
      ]
    }
  ]

  const solutionGroups = [
    {
      label: 'Por Caso de Uso',
      items: [
        { icon: 'ai ai-edge-application', label: 'Web Apps', description: 'Aplicações web rápidas e escaláveis' },
        { icon: 'ai ai-ai-pillar', label: 'AI', description: 'Infraestrutura para workloads de IA' },
        { icon: 'ai ai-secure-pillar', label: 'Application Security', description: 'Segurança de ponta a ponta' }
      ]
    },
    {
      label: 'Por Indústria',
      items: [
        { icon: 'ai ai-store', label: 'Serviços Financeiros', description: 'Performance e conformidade' },
        { icon: 'ai ai-build-pillar', label: 'Tecnologia', description: 'Escala para produtos digitais' },
        { icon: 'ai ai-marketplace', label: 'Varejo', description: 'Experiências de compra confiáveis' }
      ]
    }
  ]

  const developerGroups = [
    {
      label: 'Recursos para Devs',
      items: [
        { icon: 'ai ai-datasheet', label: 'Documentação', description: 'Guias e referência da plataforma', href: '/site/docs' },
        { icon: 'ai ai-azion-cli', label: 'Dev Tools', description: 'CLI, SDKs e integrações' },
        { icon: 'ai ai-azion-api', label: 'API Reference', description: 'Automatize com a API da Azion' },
        { icon: 'ai ai-real-time-events', label: 'Release Notes', description: 'Novidades e mudanças recentes' }
      ]
    }
  ]

  const resourceGroups = [
    {
      label: 'Conteúdo',
      items: [
        { icon: 'ai ai-medium', label: 'Blog', description: 'Artigos técnicos e novidades' },
        { icon: 'ai ai-layers', label: 'Resource Hub', description: 'E-books, webinars e whitepapers' },
        { icon: 'ai ai-marketplace', label: 'Marketplace', description: 'Templates e integrações prontas' },
        { icon: 'ai ai-business-support', label: 'Suporte', description: 'Central de ajuda e planos' }
      ]
    }
  ]

  // The mega-menu panels share one layout: an N-column grid of labelled groups.
  const megaMenus = [
    { value: 'solucoes', label: 'Soluções', columns: 2, groups: solutionGroups },
    { value: 'produtos', label: 'Produtos', columns: 4, groups: productGroups },
    { value: 'desenvolvedores', label: 'Desenvolvedores', columns: 1, groups: developerGroups },
    { value: 'recursos', label: 'Recursos', columns: 1, groups: resourceGroups }
  ]

  const goLogin = () => router.push('/login')
  const goSignup = () => router.push('/signup')
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b border-[var(--border-default)] bg-[var(--bg-surface)]"
  >
    <NavigationMenu
      aria-label="Azion"
      class="mx-auto flex h-14 w-full min-w-0 max-w-[var(--container-7xl)] items-center gap-[var(--spacing-lg)] px-[var(--spacing-md)]"
    >
      <RouterLink
        to="/site"
        aria-label="Azion — início"
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
          <NavigationMenu.Trigger href="#clientes">Clientes</NavigationMenu.Trigger>
        </NavigationMenu.Item>
        <NavigationMenu.Item>
          <NavigationMenu.Trigger href="#precos">Preços</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <div class="ml-auto flex items-center gap-[var(--spacing-xs)]">
        <Button
          label="Contato"
          kind="text"
          size="medium"
          class="hidden sm:inline-flex"
          href="#contato"
        />
        <Button
          label="Login"
          kind="secondary"
          size="medium"
          @click="goLogin"
        />
        <Button
          label="Começar Gratuitamente"
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

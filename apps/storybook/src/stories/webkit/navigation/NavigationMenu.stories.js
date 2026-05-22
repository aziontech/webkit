import Button from '@aziontech/webkit/actions/button'
import NavigationMenu from '@aziontech/webkit/navigation-menu'
import AzionLogo from '@aziontech/webkit/svg/azion/default'
import { expect, userEvent, within } from '@storybook/test'

const navigationMenuComponents = {
  NavigationMenu,
  NavigationMenuList: NavigationMenu.List,
  NavigationMenuItem: NavigationMenu.Item,
  NavigationMenuTrigger: NavigationMenu.Trigger,
  NavigationMenuIcon: NavigationMenu.Icon,
  NavigationMenuContent: NavigationMenu.Content,
  NavigationMenuLink: NavigationMenu.Link,
  NavigationMenuPortal: NavigationMenu.Portal,
  NavigationMenuPositioner: NavigationMenu.Positioner,
  NavigationMenuPopup: NavigationMenu.Popup,
  NavigationMenuArrow: NavigationMenu.Arrow,
  NavigationMenuViewport: NavigationMenu.Viewport
}

/** @type {import('@storybook/vue3').Meta<typeof NavigationMenu>} */
const meta = {
  title: 'Webkit/Navigation/NavigationMenu',
  component: NavigationMenu,
  subcomponents: navigationMenuComponents,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
          { id: 'focus-order-semantics', enabled: true }
        ]
      }
    },
    docs: {
      description: {
        component:
          'Composable disclosure navigation menu (Base UI anatomy). Root + List + Item + Trigger + Content + Portal + Positioner + Popup + Viewport. See `CONTRACT.md` in the package for the full API.'
      }
    }
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial open item value.',
      table: {
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'null' },
        category: 'props'
      }
    },
    value: {
      control: 'text',
      description: 'Controlled open item (`v-model:value`).',
      table: {
        type: { summary: 'string | number | null' },
        category: 'props'
      }
    },
    delay: {
      control: { type: 'number', min: 0, step: 10 },
      description: 'Hover-open delay in milliseconds.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '50' },
        category: 'props'
      }
    },
    closeDelay: {
      control: { type: 'number', min: 0, step: 10 },
      description: 'Hover-close delay in milliseconds.',
      table: {
        type: { summary: 'number' },
        defaultValue: { summary: '300' },
        category: 'props'
      }
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Menu orientation.',
      table: {
        type: { summary: 'NavigationMenuOrientation' },
        defaultValue: { summary: 'horizontal' },
        category: 'props'
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the root `<nav>`.',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: 'Main' },
        category: 'props'
      }
    },
    'onUpdate:value': {
      action: 'update:value',
      description: 'Emitted when the open item changes (`v-model:value`).',
      table: {
        type: { summary: '(value, eventDetails) => void' },
        category: 'events'
      }
    },
    'onValue-change': {
      action: 'value-change',
      description: 'Alias for value updates with change details.',
      table: {
        type: { summary: '(value, eventDetails) => void' },
        category: 'events'
      }
    },
    'onOpen-change-complete': {
      action: 'open-change-complete',
      description: 'Fires when open/close transition completes.',
      table: {
        type: { summary: '(open: boolean) => void' },
        category: 'events'
      }
    },
    default: {
      description: 'Menu structure (List, Item, Portal subtree).',
      control: false,
      table: { type: { summary: 'VNode' }, category: 'slots' }
    }
  },
  args: {
    delay: 50,
    closeDelay: 300,
    orientation: 'horizontal',
    ariaLabel: 'Azion'
  }
}

export default meta

const ChevronIcon = {
  template: `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `
}

const SearchIcon = {
  template: `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="1.5" />
      <path d="M20 20L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  `
}

const azionMenuData = {
  solucoes: {
    columns: [
      {
        title: 'Por Caso de Uso',
        links: [
          {
            title: 'Desenvolvimento de Aplicações',
            description: 'Acelere o desenvolvimento de aplicações',
            href: 'https://www.azion.com/pt-br/solucoes/desenvolvimento-de-aplicacoes/'
          },
          {
            title: 'Performance e Confiabilidade',
            description: 'Otimize performance e entrega de conteúdo',
            href: 'https://www.azion.com/pt-br/solucoes/performance-e-confiabilidade/'
          },
          {
            title: 'Inteligência Artificial (AI)',
            description: 'Construa e escale aplicações de AI',
            href: 'https://www.azion.com/pt-br/solucoes/inteligencia-artificial/'
          },
          {
            title: 'Segurança de Aplicações e Redes',
            description: 'Segurança avançada e inteligente',
            href: 'https://www.azion.com/pt-br/solucoes/seguranca-de-aplicacoes-e-redes/'
          }
        ]
      },
      {
        title: 'Por Indústria',
        links: [
          {
            title: 'Serviços Financeiros',
            description: 'Acelere serviços financeiros digitais',
            href: 'https://www.azion.com/pt-br/solucoes/servicos-financeiros/'
          },
          {
            title: 'Tecnologia',
            description: 'Construa aplicações de alta performance',
            href: 'https://www.azion.com/pt-br/solucoes/tecnologia/'
          },
          {
            title: 'Varejo',
            description: 'Construa experiências de compra de alta performance',
            href: 'https://www.azion.com/pt-br/solucoes/varejo/'
          },
          {
            title: 'Ver todas as soluções',
            description: '',
            href: 'https://www.azion.com/pt-br/solucoes/',
            featured: true
          }
        ]
      }
    ]
  },
  produtos: {
    columns: [
      {
        title: 'Construir',
        links: [
          {
            title: 'Functions',
            description: 'Implemente funções serverless e aplicações escaláveis',
            href: 'https://www.azion.com/pt-br/produtos/functions/',
            icon: 'ai ai-edge-functions'
          },
          {
            title: 'Cache',
            description: 'Acelere e otimize a entrega de conteúdo',
            href: 'https://www.azion.com/pt-br/produtos/cache/',
            icon: 'ai ai-tiered-cache'
          },
          {
            title: 'Application Accelerator',
            description: 'Aumente a performance, melhore a entrega',
            href: 'https://www.azion.com/pt-br/produtos/application-accelerator/',
            icon: 'ai ai-edge-application'
          },
          {
            title: 'Image Processor',
            description: 'Otimize e transforme imagens instantaneamente',
            href: 'https://www.azion.com/pt-br/produtos/image-processor/',
            icon: 'ai ai-edge-application'
          },
          {
            title: 'AI Inference',
            description: 'Execute inferência de AI globalmente',
            href: 'https://www.azion.com/pt-br/produtos/ai-inference/',
            icon: 'ai ai-edge-ai'
          },
          {
            title: 'Orchestrator',
            description: 'Implante, controle, observe e automatize workloads',
            href: 'https://www.azion.com/pt-br/produtos/orchestrator/',
            icon: 'ai ai-edge-orchestrator'
          }
        ]
      },
      {
        title: 'Armazenar',
        links: [
          {
            title: 'SQL Database',
            description: 'Armazene dados relacionais e estruturados',
            href: 'https://www.azion.com/pt-br/produtos/sql-database/',
            icon: 'ai ai-edge-sql'
          },
          {
            title: 'Object Storage',
            description: 'Armazene dados não-estruturados de forma escalável',
            href: 'https://www.azion.com/pt-br/produtos/object-storage/',
            icon: 'ai ai-edge-storage'
          },
          {
            title: 'KV Store',
            description: 'Armazene dados chave-valor instantaneamente',
            href: 'https://www.azion.com/pt-br/produtos/kv-store/',
            icon: 'ai ai-edge-kv'
          }
        ]
      },
      {
        title: 'Proteger',
        links: [
          {
            title: 'Web Application Firewall (WAF)',
            description: 'Proteja aplicações, bloqueie vulnerabilidades',
            href: 'https://www.azion.com/pt-br/produtos/web-application-firewall/',
            icon: 'ai ai-waf-rules'
          },
          {
            title: 'Bot Manager',
            description: 'Bloqueie bots e proteja o tráfego',
            href: 'https://www.azion.com/pt-br/produtos/bot-manager/',
            icon: 'ai ai-edge-firewall'
          },
          {
            title: 'Network Shield',
            description: 'Defenda e previna ataques no nível de rede',
            href: 'https://www.azion.com/pt-br/produtos/network-shield/',
            icon: 'ai ai-edge-firewall'
          },
          {
            title: 'Edge DNS',
            description: 'Resolva DNS de forma rápida e segura',
            href: 'https://www.azion.com/pt-br/produtos/edge-dns/',
            icon: 'ai ai-edge-dns'
          },
          {
            title: 'Load Balancer',
            description: 'Distribua cargas em seus servidores com segurança e alta performance',
            href: 'https://www.azion.com/pt-br/produtos/load-balancer/',
            icon: 'ai ai-load-balancer'
          }
        ]
      },
      {
        title: 'Observar',
        links: [
          {
            title: 'Data Stream',
            description: 'Transmita dados para análise em tempo real',
            href: 'https://www.azion.com/pt-br/produtos/data-stream/',
            icon: 'ai ai-data-stream'
          },
          {
            title: 'Real-Time Events',
            description: 'Rastreie eventos, ganhe clareza operacional',
            href: 'https://www.azion.com/pt-br/produtos/real-time-events/',
            icon: 'ai ai-real-time-events'
          },
          {
            title: 'Real-Time Metrics',
            description: 'Obtenha insights instantâneos e visibilidade operacional',
            href: 'https://www.azion.com/pt-br/produtos/real-time-metrics/',
            icon: 'ai ai-real-time-metrics'
          },
          {
            title: 'Edge Pulse',
            description: 'Monitore e otimize a performance',
            href: 'https://www.azion.com/pt-br/produtos/edge-pulse/',
            icon: 'ai ai-edge-pulse'
          }
        ]
      }
    ],
    footer: {
      title: 'Plataforma',
      links: [
        {
          title: 'Nossa rede',
          description: 'Entrega global, velocidade, confiabilidade',
          href: 'https://www.azion.com/pt-br/nossa-rede/'
        }
      ]
    }
  },
  desenvolvedor: {
    columns: [
      {
        title: 'Docs',
        links: [
          {
            title: 'Azion Docs',
            description: 'Documentação, suporte técnico',
            href: 'https://www.azion.com/pt-br/documentacao/'
          },
          {
            title: 'Guias',
            description: 'Guias práticos, passo a passo',
            href: 'https://www.azion.com/pt-br/documentacao/produtos/guias/'
          },
          {
            title: 'Dev Tools',
            description: 'Ferramentas, suporte ao dev',
            href: 'https://www.azion.com/pt-br/documentacao/devtools/'
          },
          {
            title: 'Release Notes',
            description: 'Atualizações, novos recursos',
            href: 'https://www.azion.com/pt-br/documentacao/release-notes/'
          }
        ]
      },
      {
        title: 'API',
        links: [
          {
            title: 'Referência da API',
            description: 'API, integração avançada',
            href: 'https://www.azion.com/pt-br/documentacao/api/'
          }
        ]
      },
      {
        title: 'Comunidade',
        links: [
          {
            title: 'Entre em nossa comunidade',
            description: '',
            href: 'https://discord.gg/azion',
            featured: true
          }
        ]
      }
    ]
  },
  recursos: {
    columns: [
      {
        title: 'Conteúdo',
        links: [
          {
            title: 'Blog',
            description: 'Insights, tendências do setor',
            href: 'https://www.azion.com/pt-br/blog/'
          },
          {
            title: 'Resource Hub',
            description: 'Recursos, materiais úteis',
            href: 'https://www.azion.com/pt-br/resource-hub/'
          },
          {
            title: 'Parceiros',
            description: 'Construa conosco',
            href: 'https://www.azion.com/pt-br/parceiros/'
          },
          {
            title: 'Marketplace',
            description: 'Aplicativos, soluções prontas',
            href: 'https://www.azion.com/pt-br/marketplace/'
          },
          {
            title: 'Serviços Profissionais',
            description: 'Orientação especializada, suporte personalizado',
            href: 'https://www.azion.com/pt-br/servicos-profissionais/'
          }
        ]
      }
    ]
  }
}

const defaultArgs = {
  delay: 50,
  closeDelay: 300,
  orientation: 'horizontal'
}

const renderDefault = (args) => ({
  components: {
    ...navigationMenuComponents,
    AzionLogo,
    Button,
    ChevronIcon
  },
  setup() {
    return {
      args,
      azionMenuData
    }
  },
  template: `
      <div class="azion azion-dark min-h-screen bg-[var(--bg-canvas)] text-[var(--text-default)]">
        <header class="border-b border-[var(--border-muted)]">
          <NavigationMenu
            v-bind="args"
            class="mx-auto flex w-full  items-center gap-6 px-6 py-4 lg:px-8"
            aria-label="Azion"
          >
            <NavigationMenuList>
              <NavigationMenuItem value="solucoes">
                <NavigationMenuTrigger>
                  Soluções
                  <NavigationMenuIcon><ChevronIcon /></NavigationMenuIcon>
                </NavigationMenuTrigger>
                <NavigationMenuContent class="w-full p-0">
                  <div class="grid grid-cols-2 gap-6 p-2">
                    <NavigationMenuList
                      v-for="column in azionMenuData.solucoes.columns"
                      :key="column.title"
                      :label="column.title"
                    >
                      <NavigationMenuItem
                        v-for="link in column.links"
                        :key="link.title"
                        layout="entry"
                        :href="link.href"
                        :description="link.description"
                        :featured="link.featured"
                        close-on-click
                      >
                        <template v-if="link.icon" #icon>
                          <i :class="link.icon" />
                        </template>
                        {{ link.title }}
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem value="produtos">
                <NavigationMenuTrigger>
                  Produtos
                  <NavigationMenuIcon><ChevronIcon /></NavigationMenuIcon>
                </NavigationMenuTrigger>
                <NavigationMenuContent class="w-full p-0">
                  <div class="grid grid-cols-4 gap-6 p-2">
                    <NavigationMenuList
                      v-for="column in azionMenuData.produtos.columns"
                      :key="column.title"
                      :label="column.title"
                      :prefix="'<>'"
                    >
                      <NavigationMenuItem
                        v-for="link in column.links"
                        :key="link.title"
                        layout="entry"
                        :href="link.href"
                        :description="link.description"
                        :featured="link.featured"
                        close-on-click
                      >
                        <template v-if="link.icon" #icon>
                          <i :class="link.icon" />
                        </template>
                        {{ link.title }}
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                  <div class="mt-2 border-t border-default px-2 pt-4 pb-2">
                    <NavigationMenuList :label="azionMenuData.produtos.footer.title">
                      <NavigationMenuItem
                        v-for="link in azionMenuData.produtos.footer.links"
                        :key="link.title"
                        layout="entry"
                        :href="link.href"
                        :description="link.description"
                        close-on-click
                      >
                        {{ link.title }}
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger href="https://www.azion.com/pt-br/casos-de-sucesso/">
                  Clientes
                </NavigationMenuTrigger>
              </NavigationMenuItem>

              <NavigationMenuItem value="desenvolvedor">
                <NavigationMenuTrigger>
                  Desenvolvedor
                  <NavigationMenuIcon><ChevronIcon /></NavigationMenuIcon>
                </NavigationMenuTrigger>
                <NavigationMenuContent class="w-[720px] p-0">
                  <div class="grid grid-cols-3 gap-6 p-2">
                    <NavigationMenuList
                      v-for="column in azionMenuData.desenvolvedor.columns"
                      :key="column.title"
                      :label="column.title"
                    >
                      <NavigationMenuItem
                        v-for="link in column.links"
                        :key="link.title"
                        layout="entry"
                        :href="link.href"
                        :description="link.description"
                        :featured="link.featured"
                        close-on-click
                      >
                        <template v-if="link.icon" #icon>
                          <i :class="link.icon" />
                        </template>
                        {{ link.title }}
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem value="recursos">
                <NavigationMenuTrigger>
                  Recursos
                  <NavigationMenuIcon><ChevronIcon /></NavigationMenuIcon>
                </NavigationMenuTrigger>
                <NavigationMenuContent class="w-[360px] p-0">
                  
                    <NavigationMenuList
                      v-for="column in azionMenuData.recursos.columns"
                      :key="column.title"
                      :label="column.title"
                    >
                        <NavigationMenuItem
                          v-for="link in column.links"
                          :key="link.title"
                          layout="entry"
                          :href="link.href"
                          :description="link.description"
                          :featured="link.featured"
                          close-on-click
                        >
                          <template v-if="link.icon" #icon>
                            <i :class="link.icon" />
                          </template>
                          {{ link.title }}
                        </NavigationMenuItem>
                    </NavigationMenuList>
                  
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger href="https://www.azion.com/pt-br/precos/">
                  Preços
                </NavigationMenuTrigger>
              </NavigationMenuItem>
            </NavigationMenuList>

            <div class="ml-auto flex items-center gap-2 sm:gap-3">
              <NavigationMenuTrigger
                href="https://www.azion.com/pt-br/contato-vendas/"
                
              >
                Contato
              </NavigationMenuTrigger>

            </div>

            <NavigationMenuPortal>
              <NavigationMenuPositioner side="bottom" align="start" :sideOffset="12">
                <NavigationMenuPopup>
                  <NavigationMenuArrow />
                  <NavigationMenuViewport />
                </NavigationMenuPopup>
              </NavigationMenuPositioner>
            </NavigationMenuPortal>
          </NavigationMenu>
        </header>

        <div
          class="mx-auto flex max-w-4xl flex-col items-center px-6 py-24 text-center sm:py-32"
          aria-hidden="true"
        >
          <h1 class="text-heading-lg m-0 text-balance sm:text-heading-xl lg:text-heading-xl">
            <span class="text-[var(--text-link)]">Construa</span>,
            <span class="text-[var(--text-link)]">proteja</span> e
            <span class="text-[var(--text-link)]">escale</span><br />
            aplicações em todos os lugares
          </h1>
          <p class="text-body-md mt-6 max-w-2xl text-pretty text-[var(--text-muted)] sm:text-body-lg">
            Faça o deploy instantaneamente em escala global e execute aplicações com zero downtime,
            alta performance e segurança.
          </p>
          <div class="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Button label="Comece Grátis" />
            <Button label="Fale com um Especialista" kind="outlined" />
          </div>
        </div>
      </div>
    `
})

/** @type {import('@storybook/vue3').StoryObj<typeof NavigationMenu>} */
export const Default = {
  args: defaultArgs,
  render: renderDefault,
  parameters: {
    docs: {
      description: {
        story: 'Azion marketing header mega-menu (horizontal, hover + click triggers).'
      }
    }
  }
}

export const Vertical = {
  args: { ...defaultArgs, orientation: 'vertical' },
  render: renderDefault,
  parameters: {
    docs: {
      description: {
        story: 'Same demo with `orientation="vertical"` on the root list.'
      }
    }
  }
}

export const Controlled = {
  args: { ...defaultArgs, value: 'solucoes' },
  render: (args) => ({
    components: { ...navigationMenuComponents, AzionLogo, Button, ChevronIcon },
    setup() {
      return { args, azionMenuData }
    },
    template: `
      <div class="azion azion-dark min-h-screen bg-[var(--bg-canvas)] p-6">
        <NavigationMenu v-bind="args" class="flex w-full max-w-md flex-col gap-4">
          <NavigationMenuList>
            <NavigationMenuItem value="solucoes">
              <NavigationMenuTrigger>Soluções<NavigationMenuIcon><ChevronIcon /></NavigationMenuIcon></NavigationMenuTrigger>
              <NavigationMenuContent class="p-0">
                <NavigationMenuItem layout="entry" href="#" close-on-click>Overview</NavigationMenuItem>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuPortal>
            <NavigationMenuPositioner side="bottom" align="start" :side-offset="8">
              <NavigationMenuPopup><NavigationMenuViewport /></NavigationMenuPopup>
            </NavigationMenuPositioner>
          </NavigationMenuPortal>
        </NavigationMenu>
        <p class="text-body-sm mt-4 text-[var(--text-muted)]">Open panel: {{ args.value ?? 'none' }}</p>
      </div>
    `
  }),
  parameters: {
    docs: {
      description: {
        story: 'Controlled `value` — use Actions / Controls to drive `v-model:value`.'
      }
    }
  }
}

export const Uncontrolled = {
  args: { ...defaultArgs, defaultValue: 'produtos' },
  render: renderDefault,
  parameters: {
    docs: {
      description: {
        story: 'Uncontrolled mode with `defaultValue="produtos"` (Produtos panel opens initially).'
      }
    }
  }
}

export const LightDark = {
  render: renderDefault,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Mega-menu chrome on dark canvas (toggle theme via Storybook toolbar for light verification).'
      }
    }
  },
  decorators: [
    () => ({
      template: `
        <div class="flex flex-col">
          <section class="azion azion-light min-h-[50vh] bg-[var(--bg-canvas)]">
            <story />
          </section>
          <section class="azion azion-dark min-h-[50vh] bg-[var(--bg-canvas)]">
            <story />
          </section>
        </div>
      `
    })
  ]
}

export const Accessibility = {
  args: defaultArgs,
  render: renderDefault,
  parameters: {
    docs: {
      description: {
        story:
          'Keyboard: Tab to triggers; Enter/Space toggles panels; Escape closes. Screen reader: `nav` landmark, `aria-expanded` on triggers.'
      }
    }
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.tab()
    const trigger = canvas.getAllByRole('button', { name: /soluções/i })[0]
    await expect(trigger).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await userEvent.keyboard('{Escape}')
  }
}

export const Playground = {
  args: defaultArgs,
  render: renderDefault,
  parameters: {
    docs: {
      description: {
        story: 'Drive root props from Controls; Actions capture `update:value` and related emits.'
      }
    }
  }
}

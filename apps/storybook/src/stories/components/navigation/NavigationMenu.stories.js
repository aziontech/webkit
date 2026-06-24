import Button from '@aziontech/webkit/button'
import NavigationMenu from '@aziontech/webkit/navigation-menu'
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

const ChevronIcon = {
  template: `
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `
}

const menuColumns = {
  solucoes: [
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
          title: 'Ver todas as soluções',
          description: '',
          href: 'https://www.azion.com/pt-br/solucoes/',
          featured: true
        }
      ]
    }
  ],
  produtos: [
    {
      title: 'Construir',
      links: [
        {
          title: 'Functions',
          description: 'Implemente funções serverless',
          href: 'https://www.azion.com/pt-br/produtos/functions/',
          icon: 'ai ai-edge-functions'
        },
        {
          title: 'Cache',
          description: 'Acelere a entrega de conteúdo',
          href: 'https://www.azion.com/pt-br/produtos/cache/',
          icon: 'ai ai-tiered-cache'
        }
      ]
    }
  ]
}

/** @type {import('@storybook/vue3').Meta<typeof NavigationMenu>} */
const meta = {
 title: 'Components/Navigation/NavigationMenu',
  component: NavigationMenu,
  subcomponents: navigationMenuComponents,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }]
      }
    },
    docs: {
      description: {
        component:
          'Composable disclosure navigation menu (Base UI pattern). Root + List + Item + Trigger + Portal + Popup + Viewport. See `CONTRACT.md` in the package.'
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
      table: { defaultValue: { summary: '50' }, category: 'props' }
    },
    closeDelay: {
      control: { type: 'number', min: 0, step: 10 },
      description: 'Hover-close delay in milliseconds.',
      table: { defaultValue: { summary: '300' }, category: 'props' }
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Menu orientation.',
      table: { defaultValue: { summary: 'horizontal' }, category: 'props' }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the root nav.',
      table: { defaultValue: { summary: 'Main' }, category: 'props' }
    },
    'onUpdate:value': {
      action: 'update:value',
      table: { category: 'events' }
    },
    'onValue-change': {
      action: 'value-change',
      table: { category: 'events' }
    },
    'onOpen-change-complete': {
      action: 'open-change-complete',
      table: { category: 'events' }
    },
    default: {
      control: false,
      description: 'Menu composition.',
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

const DefaultTemplate = {
  components: {
    ...navigationMenuComponents,
    Button,
    ChevronIcon
  },
  setup() {
    return { menuColumns }
  },
  template: `
    <div class="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-default)]">
      <header class="border-b border-solid border-[var(--border-default)]">
        <NavigationMenu
          v-bind="args"
          class="mx-auto flex w-full max-w-[var(--container-xl)] items-center gap-[var(--spacing-6)] px-[var(--spacing-6)] py-[var(--spacing-4)]"
          data-testid="navigation-menu-demo"
        >
          <NavigationMenuList>
            <NavigationMenuItem value="solucoes">
              <NavigationMenuTrigger>
                Soluções
                <NavigationMenuIcon><ChevronIcon /></NavigationMenuIcon>
              </NavigationMenuTrigger>
              <NavigationMenuContent class="w-full p-0">
                <div class="grid grid-cols-2 gap-[var(--spacing-6)] p-[var(--spacing-2)]">
                  <NavigationMenuList
                    v-for="column in menuColumns.solucoes"
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
                <div class="grid grid-cols-2 gap-[var(--spacing-6)] p-[var(--spacing-2)]">
                  <NavigationMenuList
                    v-for="column in menuColumns.produtos"
                    :key="column.title"
                    :label="column.title"
                  >
                    <NavigationMenuItem
                      v-for="link in column.links"
                      :key="link.title"
                      layout="entry"
                      :href="link.href"
                      :description="link.description"
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

            <NavigationMenuItem>
              <NavigationMenuTrigger href="https://www.azion.com/pt-br/precos/">
                Preços
              </NavigationMenuTrigger>
            </NavigationMenuItem>
          </NavigationMenuList>

          <div class="ml-auto flex items-center gap-[var(--spacing-2)]">
            <NavigationMenuTrigger href="https://www.azion.com/pt-br/contato-vendas/">
              Contato
            </NavigationMenuTrigger>
          </div>

          <NavigationMenuPortal>
            <NavigationMenuPositioner side="bottom" align="start" :side-offset="12">
              <NavigationMenuPopup>
                <NavigationMenuArrow />
                <NavigationMenuViewport />
              </NavigationMenuPopup>
            </NavigationMenuPositioner>
          </NavigationMenuPortal>
        </NavigationMenu>
      </header>

      <div
        class="mx-auto flex max-w-2xl flex-col items-center px-[var(--spacing-6)] py-[var(--spacing-24)] text-center"
        aria-hidden="true"
      >
        <h1 class="text-heading-lg text-[var(--text-default)]">
          Navigation menu demo
        </h1>
        <p class="mt-[var(--spacing-6)] text-body-sm text-[var(--text-muted)]">
          Hover top-level items to open panels. Keyboard: arrows, Enter, Escape.
        </p>
        <div class="mt-[var(--spacing-10)] flex flex-wrap justify-center gap-[var(--spacing-3)]">
          <Button label="Primary action" />
          <Button label="Secondary" kind="secondary" />
        </div>
      </div>
    </div>
  `
}

export const Default = {
  render: (args) => ({
    components: DefaultTemplate.components,
    setup() {
      return { args, menuColumns }
    },
    template: DefaultTemplate.template
  }),
  args: {
    delay: 50,
    closeDelay: 300,
    orientation: 'horizontal'
  }
}

export const LightDark = {
  render: (args) => Default.render(args),
  args: Default.args,
  parameters: {
    backgrounds: { default: 'light' },
    docs: {
      description: {
        story: 'Toggle Storybook background to validate light and dark token contrast.'
      }
    }
  },
  globals: {
    backgrounds: { value: 'light' }
  }
}

export const Accessibility = {
  render: () => ({
    components: navigationMenuComponents,
    template: `
      <NavigationMenu
        default-value="one"
        aria-label="Accessibility demo"
        data-testid="navigation-menu-a11y"
        class="flex flex-col gap-[var(--spacing-4)] p-[var(--spacing-4)]"
      >
        <NavigationMenuList>
          <NavigationMenuItem value="one">
            <NavigationMenuTrigger>One</NavigationMenuTrigger>
            <NavigationMenuContent class="p-[var(--spacing-4)] text-body-sm">
              Panel one
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem value="two">
            <NavigationMenuTrigger>Two</NavigationMenuTrigger>
            <NavigationMenuContent class="p-[var(--spacing-4)] text-body-sm">
              Panel two
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
        <NavigationMenuPortal>
          <NavigationMenuPositioner side="bottom" align="start">
            <NavigationMenuPopup class="min-w-[12rem]">
              <NavigationMenuViewport />
            </NavigationMenuPopup>
          </NavigationMenuPositioner>
        </NavigationMenuPortal>
      </NavigationMenu>
    `
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const triggers = canvas.getAllByRole('button', { name: /^(One|Two)$/ })

    await expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')

    await userEvent.click(triggers[0])
    await expect(triggers[0]).toHaveAttribute('aria-expanded', 'true')

    await userEvent.keyboard('{Escape}')
    await expect(triggers[0]).toHaveAttribute('aria-expanded', 'false')
  }
}

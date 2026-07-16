import NavigationMenu from '@aziontech/webkit/navigation-menu'
import Button from '@aziontech/webkit/button'

import { toSfc } from '../../../_shared/story-source'

const NAVIGATION_MENU_IMPORT = "import NavigationMenu from '@aziontech/webkit/navigation-menu'"
const BUTTON_IMPORT = "import Button from '@aziontech/webkit/button'"

// Public sub-components, reachable off the root default export via dot-notation.
const subcomponents = {
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
  title: 'Components/Navigation/NavigationMenu',
  component: NavigationMenu,
  subcomponents,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    backgrounds: {
      default: 'dark'
    },
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
          'Composable disclosure navigation menu for moving between views or sections. Compose the root with `NavigationMenu.List`, `NavigationMenu.Item`, and `NavigationMenu.Trigger`, then a single `NavigationMenu.Portal` holding the shared `NavigationMenu.Viewport` that renders the `NavigationMenu.Content` panel of the active item.'
      },
      canvas: { sourceState: 'shown' }
    }
  },
  argTypes: {
    defaultValue: {
      control: 'text',
      description: 'Uncontrolled initial open item value.',
      table: {
        category: 'props',
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'null' }
      }
    },
    value: {
      control: 'text',
      description:
        'Controlled open item value; enables `v-model:value`. When omitted, the menu is uncontrolled.',
      table: {
        category: 'props',
        type: { summary: 'string | number | null' },
        defaultValue: { summary: 'undefined' }
      }
    },
    delay: {
      control: { type: 'number', min: 0, step: 10 },
      description: 'Hover-open delay in milliseconds.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '50' }
      }
    },
    closeDelay: {
      control: { type: 'number', min: 0, step: 10 },
      description: 'Hover-close delay in milliseconds.',
      table: {
        category: 'props',
        type: { summary: 'number' },
        defaultValue: { summary: '300' }
      }
    },
    orientation: {
      control: 'radio',
      options: ['horizontal', 'vertical'],
      description: 'Menu orientation.',
      table: {
        category: 'props',
        type: { summary: "'horizontal' | 'vertical'" },
        defaultValue: { summary: "'horizontal'" }
      }
    },
    ariaLabel: {
      control: 'text',
      description: 'Accessible name for the root navigation landmark.',
      table: {
        category: 'props',
        type: { summary: 'string' },
        defaultValue: { summary: "'Main'" }
      }
    },
    as: {
      control: 'text',
      description: 'Polymorphic root element (HTML tag name or component).',
      table: {
        category: 'props',
        type: { summary: 'string | object' },
        defaultValue: { summary: "'nav'" }
      }
    },
    'onUpdate:value': {
      action: 'update:value',
      description: 'Fires when the open item changes; supports `v-model:value`.',
      table: {
        category: 'events',
        type: { summary: '(value: string | number | null, details: unknown) => void' }
      }
    },
    onOpenChangeComplete: {
      action: 'open-change-complete',
      description: 'Fires after a panel finishes its open or close transition.',
      table: {
        category: 'events',
        type: { summary: '(open: boolean) => void' }
      }
    },
    default: {
      control: false,
      description: 'Menu composition: lists, items, triggers, and the portal/viewport.',
      table: { category: 'slots', type: { summary: 'VNode' } }
    }
  },
  args: {
    delay: 50,
    closeDelay: 300,
    orientation: 'horizontal',
    ariaLabel: 'Azion',
    as: 'nav'
  }
}

export default meta

const DEMO_COMPONENTS = { NavigationMenu, Button, ...subcomponents }

// Canvas markup. The runtime template compiler resolves a dotted tag as a name
// lookup, so the canvas registers each sub-component under a flat binding and
// uses flat tags (`<NavigationMenuList>`); `v-bind="args"` lets Controls drive
// the root and auto-wires the declared events into the Actions panel.
const DEMO_TEMPLATE = `<div class="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-default)]">
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
            <NavigationMenuIcon>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </NavigationMenuIcon>
          </NavigationMenuTrigger>
          <NavigationMenuContent class="w-full p-0">
            <div class="grid grid-cols-2 gap-[var(--spacing-6)] p-[var(--spacing-2)]">
              <NavigationMenuList label="Por Caso de Uso">
                <NavigationMenuItem
                  layout="entry"
                  href="https://www.azion.com/pt-br/solucoes/desenvolvimento-de-aplicacoes/"
                  description="Acelere o desenvolvimento de aplicações"
                  close-on-click
                >
                  Desenvolvimento de Aplicações
                </NavigationMenuItem>
                <NavigationMenuItem
                  layout="entry"
                  href="https://www.azion.com/pt-br/solucoes/performance-e-confiabilidade/"
                  description="Otimize performance e entrega de conteúdo"
                  close-on-click
                >
                  Performance e Confiabilidade
                </NavigationMenuItem>
                <NavigationMenuItem
                  layout="entry"
                  href="https://www.azion.com/pt-br/solucoes/"
                  featured
                  close-on-click
                >
                  Ver todas as soluções
                </NavigationMenuItem>
              </NavigationMenuList>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem value="produtos">
          <NavigationMenuTrigger>
            Produtos
            <NavigationMenuIcon>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </NavigationMenuIcon>
          </NavigationMenuTrigger>
          <NavigationMenuContent class="w-full p-0">
            <div class="grid grid-cols-2 gap-[var(--spacing-6)] p-[var(--spacing-2)]">
              <NavigationMenuList label="Construir">
                <NavigationMenuItem
                  layout="entry"
                  href="https://www.azion.com/pt-br/produtos/functions/"
                  description="Implemente funções serverless"
                  close-on-click
                >
                  <template #icon>
                    <i class="ai ai-edge-functions" />
                  </template>
                  Functions
                </NavigationMenuItem>
                <NavigationMenuItem
                  layout="entry"
                  href="https://www.azion.com/pt-br/produtos/cache/"
                  description="Acelere a entrega de conteúdo"
                  close-on-click
                >
                  <template #icon>
                    <i class="ai ai-tiered-cache" />
                  </template>
                  Cache
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
</div>`

// Rewrite the flat canvas markup into the single runnable form: `v-bind="args"`
// becomes the concrete default props, and every `<NavigationMenuX>` sub-component
// tag becomes `<NavigationMenu.X>` — the only importable form, since the package
// exposes just the default export (no sub-component subpaths). The pasted SFC
// resolves `<NavigationMenu.List>` to the attached member, so it renders exactly
// what the canvas renders.
const toRunnableSnippet = (markup) =>
  markup
    .replace(
      'v-bind="args"',
      ':delay="50" :close-delay="300" orientation="horizontal" aria-label="Azion"'
    )
    .replace(/\n\s*data-testid="navigation-menu-demo"/, '')
    .replace(/<(\/?)NavigationMenu(?=[A-Z])/g, '<$1NavigationMenu.')

const DEFAULT_SNIPPET = toRunnableSnippet(DEMO_TEMPLATE)

const render = (args) => ({
  components: DEMO_COMPONENTS,
  setup() {
    return { args }
  },
  template: DEMO_TEMPLATE
})

/** @type {import('@storybook/vue3').StoryObj<typeof NavigationMenu>} */
export const Default = {
  render,
  parameters: {
    docs: {
      description: {
        story:
          'A full navigation header composed from the menu primitives. Hover or focus the "Soluções" and "Produtos" triggers to open their panels in the shared portal viewport; "Preços" and "Contato" are plain link triggers. Controls drive the hover delays, orientation, and accessible label.'
      },
      source: { code: toSfc([NAVIGATION_MENU_IMPORT, BUTTON_IMPORT], DEFAULT_SNIPPET) }
    }
  }
}

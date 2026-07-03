import {
  PageContainer,
  PageHeader,
  SectionHeader,
  Card,
  CategoryCard,
  CodeBlock
} from '../foundations/components/layout/index.js'

// Landing / overview page for the Azion WebKit design system. Composed from the
// shared foundations layout blocks so it inherits the same tokens, theming, and
// light/dark behavior as the rest of the docs. Doc-only: no controls, no autodocs.

const principles = [
  {
    title: 'Token-first',
    body: 'Every color, type ramp, spacing step, radius, and motion curve comes from @aziontech/theme as a CSS variable. Components consume tokens — they never redefine raw values.'
  },
  {
    title: 'CSS-only, zero heavy deps',
    body: 'Positioning and animation are handled with plain CSS, Tailwind utilities, and Vue primitives. No floating-ui, no animation runtimes — a smaller, predictable surface we own end to end.'
  },
  {
    title: 'Accessibility built in',
    body: 'Keyboard support, visible focus rings, and reduced-motion fallbacks ship with every component, targeting WCAG 2.1 AA.'
  },
  {
    title: 'Spec-driven',
    body: 'New components follow a spec → scaffold → verify pipeline. The spec in .specs/<name>.md is the contract; the .vue, story, and exports are transcribed from it 1-to-1.'
  },
  {
    title: 'Consistent by default',
    body: 'One flat import surface, one naming convention, and built-in light/dark keep Console, Marketplace, and partner surfaces visually and behaviorally aligned.'
  }
]

const packages = [
  {
    name: '@aziontech/webkit',
    body: 'The Vue 3 component library — actions, inputs, navigation, overlays, feedback, data, and page templates, plus form and utility composables.'
  },
  {
    name: '@aziontech/theme',
    body: 'The design token system: primitive and semantic CSS variables, brand palette, built-in light/dark, and Tailwind preset + plugin integration.'
  },
  {
    name: '@aziontech/icons',
    body: 'Icon fonts delivered as CSS + woff2 — azionicons (ai) for Azion product marks and primeicons (pi) for general UI, plus colored brand icons.'
  }
]

const foundations = [
  {
    overline: 'Foundations',
    title: 'Colors',
    description: 'Primitive scales and semantic tokens for background, text, border, and feedback — every swatch copyable and theme-aware.',
    tokens: 'var(--primary) · var(--bg-canvas) · var(--text-default)',
    storyId: 'foundations-colors--overview'
  },
  {
    overline: 'Foundations',
    title: 'Typography',
    description: 'The type system — heading, body, button, label, and overline ramps generated from the theme text tokens.',
    tokens: '.text-heading-xl · .text-body-md · .text-label-md',
    storyId: 'foundations-typography--overview'
  },
  {
    overline: 'Foundations',
    title: 'Icons',
    description: 'Searchable reference for the azionicons (ai) and primeicons (pi) sets, including the colored brand marks.',
    tokens: 'ai-* · pi-* · ai-*-cor',
    storyId: 'foundations-icons--overview'
  }
]

const componentGroups = [
  {
    title: 'Actions',
    count: 7,
    items: 'button, button-highlight, copy-button, icon-button, mini-button, segmented-button, split-button'
  },
  {
    title: 'Inputs',
    count: 23,
    items: 'input-text, input-number, input-password, textarea, select, multi-select, checkbox, radio-button, switch, chip, calendar, label, helper-text, and field-* wrappers'
  },
  {
    title: 'Navigation',
    count: 7,
    items: 'breadcrumb, breadcrumb-item, dropdown, link, menu-item, navigation-menu, tab-view'
  },
  {
    title: 'Overlay',
    count: 5,
    items: 'dialog, drawer, panel, popover, tooltip'
  },
  {
    title: 'Feedback',
    count: 6,
    items: 'empty-state, message, progress-bar, skeleton, status-indicator, toast'
  },
  {
    title: 'Data',
    count: 5,
    items: 'code-block, flow, paginator, pick-list, table'
  },
  {
    title: 'Content',
    count: 5,
    items: 'badge, card-box, card-pricing, currency, item'
  },
  {
    title: 'Layout',
    count: 4,
    items: 'divider, global-header, scroll-area, sidebar'
  },
  {
    title: 'Code',
    count: 1,
    items: 'log-view'
  },
  {
    title: 'Templates',
    count: 5,
    items: 'deploy-success, onboarding-form, plan-success, platform-shell, sign-up-card'
  },
  {
    title: 'Utils',
    count: 1,
    items: 'spinner'
  }
]

const INSTALL_SNIPPET = 'pnpm add @aziontech/webkit @aziontech/theme @aziontech/icons'

const SETUP_SNIPPET = ["import '@aziontech/theme'", "import '@aziontech/icons'"].join('\n')

const USAGE_SNIPPET = [
  "import Button from '@aziontech/webkit/button'",
  '',
  '// in your template:',
  '// Button with kind="primary" and a loading state'
].join('\n')

export default {
  title: 'Introduction',
  parameters: {
    options: { showPanel: false },
    controls: { disable: true },
    actions: { disable: true }
  }
}

export const Overview = {
  name: 'Overview',
  render: () => ({
    components: { PageContainer, PageHeader, SectionHeader, Card, CategoryCard, CodeBlock },
    setup() {
      return {
        principles,
        packages,
        foundations,
        componentGroups,
        INSTALL_SNIPPET,
        SETUP_SNIPPET,
        USAGE_SNIPPET
      }
    },
    template: /* html */ `
      <PageContainer>
        <PageHeader title="Azion WebKit">
          The shared front-end foundation for Azion products — the Vue components, design
          tokens, and icon fonts that keep Console, Marketplace, and partner surfaces visually
          and behaviorally consistent. This Storybook is the source of truth for every
          component's API, states, and usage.
        </PageHeader>

        <section class="mb-[var(--spacing-xxl)]">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)]">
            <CategoryCard
              overline="Start here"
              title="Explore the foundations"
              description="Colors, typography, and icons — the tokens every component is built from."
              tokens="Foundations · Colors"
              storyId="foundations-colors--overview"
            />
            <Card
              overline="Reference"
              title="Icon catalog"
              href="https://icons-gallery.azion.app/"
              hoverable
            >
              Browse and search the full azionicons (ai) and primeicons (pi) sets in the
              interactive Icons Gallery.
            </Card>
          </div>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <SectionHeader
            size="lg"
            title="Principles"
            description="The decisions that keep the system coherent as it grows."
          />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            <Card
              v-for="principle in principles"
              :key="principle.title"
              :title="principle.title"
            >
              {{ principle.body }}
            </Card>
          </div>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <SectionHeader
            size="lg"
            title="Packages"
            description="Three packages published under the @aziontech scope. icons is standalone, theme has no internal deps, and webkit builds on theme."
          />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)]">
            <Card
              v-for="pkg in packages"
              :key="pkg.name"
              overline="Package"
              :title="pkg.name"
            >
              {{ pkg.body }}
            </Card>
          </div>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <SectionHeader
            size="lg"
            title="Foundations"
            description="The token layer, documented and copyable. Open a page to explore the values."
          />
          <div class="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-md)]">
            <CategoryCard
              v-for="item in foundations"
              :key="item.storyId"
              :overline="item.overline"
              :title="item.title"
              :description="item.description"
              :tokens="item.tokens"
              :storyId="item.storyId"
            />
          </div>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <SectionHeader
            size="lg"
            title="Components"
            description="Around ninety components, organized by category. Every one lives under the Components section of the sidebar, imported flat as @aziontech/webkit/<name>."
          />
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-md)]">
            <Card
              v-for="group in componentGroups"
              :key="group.title"
              :overline="group.count + ' components'"
              :title="group.title"
            >
              {{ group.items }}
            </Card>
          </div>
          <p class="text-body-sm text-muted mt-[var(--spacing-md)] m-0">
            Plus the core singletons avatar, overline, and tag.
          </p>
        </section>

        <section class="mb-[var(--spacing-xxl)]">
          <SectionHeader
            size="lg"
            title="Get started"
            description="Install the packages, import the global styles once, then import components by their flat path."
          />
          <div class="grid grid-cols-1 gap-[var(--spacing-md)]">
            <CodeBlock
              label="Install"
              language="bash"
              :content="INSTALL_SNIPPET"
            />
            <CodeBlock
              label="Global setup (main.js)"
              language="javascript"
              :content="SETUP_SNIPPET"
            />
            <CodeBlock
              label="Use a component"
              language="javascript"
              :content="USAGE_SNIPPET"
            />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-md)] mt-[var(--spacing-md)]">
            <CategoryCard
              overline="Guide"
              title="Full onboarding guide"
              description="Repository architecture, local setup, the Storybook workflow, and the contribution flow."
              tokens="Get Started"
              storyId="get-started--docs"
            />
          </div>
        </section>
      </PageContainer>
    `
  })
}

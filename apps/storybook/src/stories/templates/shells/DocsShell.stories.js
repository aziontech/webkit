import Menu from '@aziontech/webkit/menu'
import MenuGroup from '@aziontech/webkit/menu-group'
import MenuItem from '@aziontech/webkit/menu-item'
import ScrollArea from '@aziontech/webkit/scroll-area'
import Sidebar from '@aziontech/webkit/sidebar'
import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
import { ref } from 'vue'

import {
  DOCS_HEADER_COMPONENTS,
  DOCS_HEADER_IMPORTS,
  DOCS_HEADER_MARKUP,
  DOCS_HEADER_SETUP,
  DOCS_SECTIONS,
  mergeImports
} from '../../_shared/headers'
import { indent } from '../../_shared/markup'
import {
  LG_PROBE_IMPORT,
  SITE_FOOTER_COMPONENTS,
  SITE_FOOTER_IMPORTS,
  SITE_FOOTER_SETUP,
  siteFooterMarkup,
  useSiteFooter
} from '../../_shared/site-footer'
import { toSfc } from '../../_shared/story-source'

const PAGES = [
  'Overview',
  'Getting started',
  'How it works',
  'Examples',
  'Reference',
  'Limits',
  'Best practices',
  'Troubleshooting'
]

const OUTLINE = [
  'Overview',
  'Prerequisites',
  'Create the function',
  'Instantiate it in your application',
  'Verify the response',
  'Next steps'
]

const IMPORTS = [
  ...mergeImports(DOCS_HEADER_IMPORTS, [
    "import Menu from '@aziontech/webkit/menu'",
    "import MenuGroup from '@aziontech/webkit/menu-group'",
    "import MenuItem from '@aziontech/webkit/menu-item'",
    "import ScrollArea from '@aziontech/webkit/scroll-area'",
    "import Sidebar from '@aziontech/webkit/sidebar'",
    "import ThemeSwitcher from '@aziontech/webkit/theme-switcher'",
    ...SITE_FOOTER_IMPORTS,
    LG_PROBE_IMPORT
  ]),
  '',
  ...DOCS_HEADER_SETUP,
  `const pages = ['${PAGES.join("', '")}']`,
  `const outline = ['${OUTLINE.join("', '")}']`,
  "const theme = ref('dark')",
  '',
  ...SITE_FOOTER_SETUP
]

const TEMPLATE = `<div class="flex h-screen min-h-0 w-full flex-col bg-(--bg-canvas) text-(--text-default)">
${indent(DOCS_HEADER_MARKUP)}

  <div class="relative flex min-h-0 flex-1">
    <aside class="hidden h-full w-(--container-2xs) shrink-0 lg:flex">
      <Sidebar aria-label="Docs" class="h-full w-full">
        <template #footer>
          <ThemeSwitcher v-model:value="theme" aria-label="Theme" />
        </template>
        <Menu role="presentation">
          <MenuGroup label="Functions">
            <MenuItem
              v-for="page in pages"
              :key="page"
              :label="page"
              :selected="page === 'Getting started'"
              href="#"
            />
          </MenuGroup>
        </Menu>
      </Sidebar>
    </aside>

    <main class="flex min-h-0 min-w-0 flex-1 flex-col">
      <ScrollArea class="flex-1">
        <article class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-md) pt-(--spacing-md) pb-(--spacing-xxl)">
          <p class="text-overline-sm uppercase text-(--text-muted)">Functions</p>
          <h1 class="text-heading-xl">Getting started</h1>
          <p class="text-body-md text-(--text-muted)">
            Create a function, instantiate it in an application, and verify the response from the edge.
          </p>
          <h2 class="pt-(--spacing-lg) text-heading-md">Create the function</h2>
          <p class="text-body-md text-(--text-muted)">
            Open Functions in the console, select Create Function, paste the handler below and save it.
          </p>
          <h2 class="pt-(--spacing-lg) text-heading-md">Instantiate it in your application</h2>
          <p class="text-body-md text-(--text-muted)">
            On the application's Functions tab, add an instance pointing at the function you just created.
          </p>
          <h2 class="pt-(--spacing-lg) text-heading-md">Verify the response</h2>
          <p class="text-body-md text-(--text-muted)">
            Request the domain and read the header the function sets.
          </p>
        </article>

${indent(siteFooterMarkup('content'), 4)}
      </ScrollArea>
    </main>

    <aside class="hidden w-(--container-3xs) shrink-0 flex-col gap-(--spacing-sm) border-l border-(--border-default) px-(--spacing-md) pt-(--spacing-md) pb-(--spacing-lg) xl:flex">
      <p class="text-overline-sm uppercase text-(--text-muted)">On this page</p>
      <ul class="flex flex-col border-l border-(--border-default)">
        <li v-for="item in outline" :key="item">
          <a href="#" class="block px-(--spacing-sm) py-(--spacing-xxs) text-label-md text-(--text-muted) hover:text-(--text-default)">
            {{ item }}
          </a>
        </li>
      </ul>
    </aside>
  </div>
</div>`

const components = {
  ...DOCS_HEADER_COMPONENTS,
  Menu,
  MenuGroup,
  MenuItem,
  ScrollArea,
  Sidebar,
  ThemeSwitcher,
  ...SITE_FOOTER_COMPONENTS
}

const meta = {
  title: 'Templates/Shells/DocsShell',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
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
          'The documentation shell: a `GlobalHeader` in its `content` placement (see Templates › Headers › DocsHeader), a `Sidebar` rail from `lg` carrying a `Menu` of the current product’s pages and the theme switcher in its footer, the reading column scrolling inside its own `ScrollArea`, and the “On this page” outline from `xl`. The `Footer` sits INSIDE the reading column’s scroller, in its `content` placement: the bands run full bleed across the zone between the rail and the outline and open on the page boundary, like the top bar above. Below `lg` the rail leaves and the footer takes the whole width; below `md` the footer stacks. The social buttons are small and row two sizes its bands by content, so the brand mark, seven icons and the status pair share one line in a zone as narrow as this column at 1024 wide; the brand leads that row from `lg` (answered by the `lg:` utility, so it follows the breakpoint token) and moves to the signature band below it. Built from `GlobalHeader`, `Sidebar`, `Menu`, `ScrollArea`, `ThemeSwitcher` and `Footer`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup() {
      return {
        sections: DOCS_SECTIONS,
        pages: PAGES,
        outline: OUTLINE,
        theme: ref('dark'),
        ...useSiteFooter()
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The shell around one guide. Scroll the reading column to the end to reach the footer: it closes the article, not the viewport, so it is visible at the end of every page and over none of them.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

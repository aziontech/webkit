import Brand from '@aziontech/webkit/brand'
import Button from '@aziontech/webkit/button'
import Drawer from '@aziontech/webkit/drawer'
import DrawerClose from '@aziontech/webkit/drawer-close'
import DrawerContent from '@aziontech/webkit/drawer-content'
import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
import DrawerPortal from '@aziontech/webkit/drawer-portal'
import DrawerTitle from '@aziontech/webkit/drawer-title'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import Menu from '@aziontech/webkit/menu'
import NavigationMenu from '@aziontech/webkit/navigation-menu'
import PanelFooter from '@aziontech/webkit/panel-footer'
import PanelHeader from '@aziontech/webkit/panel-header'
import ScrollArea from '@aziontech/webkit/scroll-area'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { toSfc } from '../../_shared/story-source'

const MEGA_MENUS = [
  {
    value: 'solutions',
    label: 'Solutions',
    columns: [
      [
        {
          label: 'By Need',
          items: [
            {
              label: 'Build and Run Applications',
              description: 'Ship and scale web apps and APIs'
            },
            {
              label: 'Improve Application Performance and Reliability',
              description: 'Faster, always-on delivery'
            },
            { label: 'Build and Run AI Workloads', description: 'Infrastructure for AI workloads' },
            { label: 'Secure Applications and Networks', description: 'End-to-end security' },
            {
              label: 'Deliver Media and Streaming Content',
              description: 'Low-latency video and live streams'
            }
          ]
        }
      ],
      [
        {
          label: 'By Industries',
          items: [
            { label: 'Financial Services', description: 'Performance and compliance' },
            { label: 'Technology', description: 'Scale for digital products' },
            { label: 'Retail', description: 'Shopping experiences you can trust' }
          ]
        }
      ]
    ]
  },
  {
    value: 'products',
    label: 'Products',
    columns: [
      [
        {
          label: 'Build',
          items: [
            { label: 'Workloads', description: 'Put an application on a hostname, everywhere' },
            { label: 'Applications', description: 'Deliver and configure web applications' },
            { label: 'Functions', description: 'Run serverless code at the edge' },
            { label: 'Cache', description: 'Speed up content delivery' },
            { label: 'Application Accelerator', description: 'Optimize dynamic applications' },
            { label: 'Image Processor', description: 'Resize and convert images on the fly' },
            { label: 'AI Inference', description: 'Run AI models close to the user' },
            { label: 'Orchestrator', description: 'Provision and manage edge nodes' }
          ]
        }
      ],
      [
        {
          label: 'Store',
          items: [
            { label: 'SQL Database', description: 'A distributed SQL database' },
            { label: 'Object Storage', description: 'Store and serve objects at the edge' },
            { label: 'KV Store', description: 'Low-latency key-value store' }
          ]
        }
      ],
      [
        {
          label: 'Protect',
          items: [
            { label: 'WAF', description: 'Web application firewall' },
            { label: 'Firewall', description: 'Filter traffic before it reaches you' },
            { label: 'DDoS Protection', description: 'Absorb volumetric attacks' },
            { label: 'Bot Manager', description: 'Detect and block malicious bots' },
            { label: 'Network Shield', description: 'Control access by network' },
            { label: 'Edge DNS', description: 'Distributed authoritative DNS' },
            { label: 'Load Balancer', description: 'Global load balancing' }
          ]
        }
      ],
      [
        {
          label: 'Observe',
          items: [
            { label: 'Data Stream', description: 'Real-time event streaming' },
            { label: 'Real-Time Events', description: 'Query raw request logs' },
            { label: 'Real-Time Metrics', description: 'Live platform metrics' },
            { label: 'Edge Pulse', description: 'Real user experience monitoring' }
          ]
        },
        {
          label: 'Platform',
          items: [{ label: 'Our Network', description: 'The global edge network' }]
        }
      ]
    ]
  },
  {
    value: 'developers',
    label: 'Developers',
    columns: [
      [
        {
          label: 'Developer Resources',
          items: [
            { label: 'Documentation', description: 'Platform guides and reference' },
            { label: 'Dev Tools', description: 'CLI, SDKs, and integrations' },
            { label: 'API Reference', description: 'Automate with the Azion API' },
            { label: 'Release Notes', description: 'What is new and recently changed' }
          ]
        }
      ]
    ]
  },
  {
    value: 'resources',
    label: 'Resources',
    columns: [
      [
        {
          label: 'Content',
          items: [
            { label: 'Blog', description: 'Technical articles and news' },
            { label: 'Learning', description: 'Fundamentals, subject by subject' },
            { label: 'Resource Hub', description: 'E-books, webinars, and whitepapers' },
            { label: 'Marketplace', description: 'Ready-made templates and integrations' },
            { label: 'Support', description: 'Expert help when you need it' },
            {
              label: 'Professional Services',
              description: 'Guidance to move faster with confidence'
            }
          ]
        }
      ]
    ]
  }
]

const PLAIN_LINKS = [
  { value: 'customers', label: 'Customers' },
  { value: 'pricing', label: 'Pricing' }
]

const slug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const toNavGroups = (menus, links) => [
  {
    items: [
      ...menus.map((menu) => {
        const groups = menu.columns.flat()
        return {
          id: menu.value,
          label: menu.label,
          kind: 'drill',
          groups: groups.map((group) => ({
            label: groups.length > 1 ? group.label : undefined,
            items: group.items.map((item) => ({
              id: [menu.value, slug(item.label)].join('-'),
              label: item.label,
              href: '#'
            }))
          }))
        }
      }),
      ...links.map((link) => ({ id: link.value, label: link.label, href: '#' })),
      { id: 'contact', label: 'Contact', href: '#' }
    ]
  }
]

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const literal = (value, depth = 0) => {
  const pad = '  '.repeat(depth + 1)
  const end = '  '.repeat(depth)
  if (typeof value === 'string') return quoted(value)
  if (Array.isArray(value)) {
    return `[\n${value.map((entry) => `${pad}${literal(entry, depth + 1)}`).join(',\n')}\n${end}]`
  }
  const entries = Object.entries(value).map(([key, entry]) => [key, literal(entry, depth + 1)])
  const inline = `{ ${entries.map(([key, entry]) => `${key}: ${entry}`).join(', ')} }`
  return !inline.includes('\n') && inline.length + depth * 2 <= 96
    ? inline
    : `{\n${entries.map(([key, entry]) => `${pad}${key}: ${entry}`).join(',\n')}\n${end}}`
}

const IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import Drawer from '@aziontech/webkit/drawer'",
  "import DrawerClose from '@aziontech/webkit/drawer-close'",
  "import DrawerContent from '@aziontech/webkit/drawer-content'",
  "import DrawerOverlay from '@aziontech/webkit/drawer-overlay'",
  "import DrawerPortal from '@aziontech/webkit/drawer-portal'",
  "import DrawerTitle from '@aziontech/webkit/drawer-title'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import Menu from '@aziontech/webkit/menu'",
  "import NavigationMenu from '@aziontech/webkit/navigation-menu'",
  "import PanelFooter from '@aziontech/webkit/panel-footer'",
  "import PanelHeader from '@aziontech/webkit/panel-header'",
  "import ScrollArea from '@aziontech/webkit/scroll-area'",
  "import { onBeforeUnmount, onMounted, ref, watch } from 'vue'",
  '',
  `const megaMenus = ${literal(MEGA_MENUS)}`,
  '',
  `const plainLinks = ${literal(PLAIN_LINKS)}`,
  '',
  "const slug = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-')",
  '',
  'const navGroups = [',
  '  {',
  '    items: [',
  '      ...megaMenus.map((menu) => {',
  '        const groups = menu.columns.flat()',
  '        return {',
  '          id: menu.value,',
  '          label: menu.label,',
  "          kind: 'drill',",
  '          groups: groups.map((group) => ({',
  '            label: groups.length > 1 ? group.label : undefined,',
  '            items: group.items.map((item) => ({',
  "              id: [menu.value, slug(item.label)].join('-'),",
  '              label: item.label,',
  "              href: '#'",
  '            }))',
  '          }))',
  '        }',
  '      }),',
  "      ...plainLinks.map((link) => ({ id: link.value, label: link.label, href: '#' })),",
  "      { id: 'contact', label: 'Contact', href: '#' }",
  '    ]',
  '  }',
  ']',
  '',
  'const navOpen = ref(false)',
  'const navPath = ref([])',
  '',
  'watch(navOpen, (open) => {',
  '  if (!open) navPath.value = []',
  '})',
  '',
  'const onNavigate = (event, node) => {',
  '  if (!node.groups) navOpen.value = false',
  '}',
  '',
  'const bar = ref(null)',
  'const columnInset = ref(0)',
  '',
  'const readColumnInset = () => {',
  '  const node = bar.value?.$el',
  '  const el = node instanceof Element ? node : node?.nextElementSibling',
  '  if (el) columnInset.value = Number.parseFloat(getComputedStyle(el).paddingLeft) || 0',
  '}',
  '',
  'onMounted(() => {',
  '  readColumnInset()',
  "  window.addEventListener('resize', readColumnInset, { passive: true })",
  '})',
  "onBeforeUnmount(() => window.removeEventListener('resize', readColumnInset))"
]

const BRAND_LINK_CLASS =
  'inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none'

const PANEL_GRID_CLASS = `{
            'grid-cols-1': menu.columns.length === 1,
            'grid-cols-2': menu.columns.length === 2,
            'grid-cols-4 w-[calc(min(var(--layout-measure-site-header),100vw)_-_2*var(--layout-boundary-inline)_-_2*var(--spacing-md)_-_2px)]':
              menu.columns.length === 4
          }`

const TEMPLATE = `<GlobalHeader ref="bar" kind="site" aria-label="Azion" class="sticky top-0 z-40">
  <GlobalHeader.Left class="justify-start!">
    <IconButton
      icon="pi pi-bars"
      kind="outlined"
      size="medium"
      aria-label="Open navigation"
      class="shrink-0 xl:hidden"
      @click="navOpen = true"
    />
    <GlobalHeader.Brand>
      <a
        href="#"
        aria-label="Azion home"
        class="${BRAND_LINK_CLASS}"
      >
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
  </GlobalHeader.Left>

  <GlobalHeader.Middle class="justify-start!">
    <NavigationMenu aria-label="Azion" class="min-w-0">
      <NavigationMenu.List class="hidden items-center gap-(--spacing-xxs) xl:flex">
        <NavigationMenu.Item v-for="menu in megaMenus" :key="menu.value" :value="menu.value">
          <NavigationMenu.Trigger>
            {{ menu.label }}
            <NavigationMenu.Icon>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
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
          <NavigationMenu.Content class="w-full">
            <div
              class="grid gap-x-0 gap-y-(--spacing-md)"
              :class="${PANEL_GRID_CLASS}"
            >
              <div
                v-for="column in menu.columns"
                :key="column[0].label"
                class="flex flex-col gap-y-(--spacing-md)"
              >
                <NavigationMenu.List
                  v-for="group in column"
                  :key="group.label"
                  :label="group.label"
                  href="#"
                >
                  <NavigationMenu.Item
                    v-for="item in group.items"
                    :key="item.label"
                    layout="entry"
                    href="#"
                    :description="item.description"
                    close-on-click
                  >
                    {{ item.label }}
                  </NavigationMenu.Item>
                </NavigationMenu.List>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item v-for="link in plainLinks" :key="link.value">
          <NavigationMenu.Trigger href="#">{{ link.label }}</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>

      <NavigationMenu.Portal>
        <NavigationMenu.Positioner
          side="bottom"
          align="start"
          :side-offset="12"
          :collision-padding="{ x: columnInset, y: 8 }"
        >
          <NavigationMenu.Popup kind="contrast">
            <NavigationMenu.Arrow />
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu>
  </GlobalHeader.Middle>

  <GlobalHeader.Right>
    <div class="hidden items-center gap-(--spacing-xs) xl:flex">
      <Button label="Contact" kind="text" size="medium" href="#" />
      <Button label="Login" kind="secondary" size="medium" href="#" />
    </div>
    <Button label="Start for Free" kind="primary" size="medium" class="shrink-0" href="#" />
    <IconButton icon="pi pi-search" kind="outlined" size="medium" aria-label="Search" class="shrink-0" />
  </GlobalHeader.Right>
</GlobalHeader>

<Drawer v-model:open="navOpen" side="left" size="small">
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerContent>
      <PanelHeader class="hidden w-full md:flex">
        <DrawerTitle>Menu</DrawerTitle>
        <DrawerClose />
      </PanelHeader>

      <ScrollArea class="min-h-0 w-full min-w-0 flex-1">
        <Menu
          v-model:path="navPath"
          :groups="navGroups"
          aria-label="Azion"
          class="w-full p-(--spacing-md)"
          @navigate="onNavigate"
        >
          <Menu.Back />
        </Menu>
      </ScrollArea>

      <PanelFooter class="w-full px-(--spacing-md)">
        <Button label="Login" kind="secondary" size="medium" class="w-full" href="#" />
      </PanelFooter>
    </DrawerContent>
  </DrawerPortal>
</Drawer>`

const components = {
  Brand,
  Button,
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Right': GlobalHeader.Right,
  IconButton,
  Menu,
  'Menu.Back': Menu.Back,
  NavigationMenu,
  'NavigationMenu.List': NavigationMenu.List,
  'NavigationMenu.Item': NavigationMenu.Item,
  'NavigationMenu.Trigger': NavigationMenu.Trigger,
  'NavigationMenu.Icon': NavigationMenu.Icon,
  'NavigationMenu.Content': NavigationMenu.Content,
  'NavigationMenu.Portal': NavigationMenu.Portal,
  'NavigationMenu.Positioner': NavigationMenu.Positioner,
  'NavigationMenu.Popup': NavigationMenu.Popup,
  'NavigationMenu.Arrow': NavigationMenu.Arrow,
  'NavigationMenu.Viewport': NavigationMenu.Viewport,
  PanelFooter,
  PanelHeader,
  ScrollArea
}

const meta = {
  title: 'Templates/Marketing/Shell/SiteNav',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The bar above every marketing page: the Azion mark, the four mega-menus (Solutions, Products, Developers, Resources) and two plain links (Customers, Pricing), then the account actions, the `Start for Free` call to action and a search trigger. `GlobalHeader kind="site"` keeps the surface full bleed and caps the regions at the bar’s own measure, one rung wider than the page frame under it. From `xl` the menus sit in the bar; below it the bar keeps only the menu button, the mark, the call to action and the search trigger, and the same menus open in a `Drawer` where each mega-menu is a drill level behind a Back row. Built from `GlobalHeader`, `NavigationMenu`, `Brand`, `Button`, `IconButton`, `Drawer`, `Menu` and `ScrollArea`.'
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
      const navOpen = ref(false)
      const navPath = ref([])
      const bar = ref(null)
      const columnInset = ref(0)

      watch(navOpen, (open) => {
        if (!open) navPath.value = []
      })

      const onNavigate = (event, node) => {
        if (!node.groups) navOpen.value = false
      }

      const readColumnInset = () => {
        const node = bar.value?.$el
        const el = node instanceof globalThis.Element ? node : node?.nextElementSibling
        if (el) {
          columnInset.value = Number.parseFloat(globalThis.getComputedStyle(el).paddingLeft) || 0
        }
      }

      onMounted(() => {
        readColumnInset()
        globalThis.addEventListener('resize', readColumnInset, { passive: true })
      })
      onBeforeUnmount(() => globalThis.removeEventListener('resize', readColumnInset))

      return {
        megaMenus: MEGA_MENUS,
        plainLinks: PLAIN_LINKS,
        navGroups: toNavGroups(MEGA_MENUS, PLAIN_LINKS),
        navOpen,
        navPath,
        onNavigate,
        bar,
        columnInset
      }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The site’s own navigation. Each mega-menu lists its panel as `columns`, an array of columns that each hold one or more groups, so the panel’s track count is the column count; Products stacks Platform under Observe to keep four tracks. Only that four-track panel is stretched to the page column, and `collision-padding` is set to the bar’s own inset (read off the bar once it mounts and on resize) so the clamp lands it on the column’s leading edge. The sheet’s tree is projected from the same `megaMenus`, so a product added to a panel is in both. Below `xl`, open the sheet with the menu button; widen past `xl` to see the menus in the bar.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

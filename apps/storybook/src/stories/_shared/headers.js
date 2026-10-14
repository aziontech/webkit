import Avatar from '@aziontech/webkit/avatar'
import Brand from '@aziontech/webkit/brand'
import Breadcrumb from '@aziontech/webkit/breadcrumb'
import Button from '@aziontech/webkit/button'
import ButtonHighlight from '@aziontech/webkit/button-highlight'
import GlobalHeader from '@aziontech/webkit/global-header'
import IconButton from '@aziontech/webkit/icon-button'
import NavigationMenu from '@aziontech/webkit/navigation-menu'

import { BRAND_LINK_CLASS } from './site-footer'

const SEARCH_BUTTON = (label) =>
  `<IconButton icon="pi pi-search" kind="outlined" size="medium" aria-label="${label}" class="shrink-0" />`

const pathOf = (line) => line.match(/from '([^']+)'/)?.[1] ?? line

export const mergeImports = (...lists) =>
  [...new Set(lists.flat())].sort((a, b) => pathOf(a).localeCompare(pathOf(b)))

const GLOBAL_HEADER_COMPONENTS = {
  GlobalHeader,
  'GlobalHeader.Left': GlobalHeader.Left,
  'GlobalHeader.Brand': GlobalHeader.Brand,
  'GlobalHeader.Middle': GlobalHeader.Middle,
  'GlobalHeader.Nav': GlobalHeader.Nav,
  'GlobalHeader.Right': GlobalHeader.Right
}

const NAVIGATION_MENU_COMPONENTS = {
  NavigationMenu,
  'NavigationMenu.List': NavigationMenu.List,
  'NavigationMenu.Item': NavigationMenu.Item,
  'NavigationMenu.Trigger': NavigationMenu.Trigger,
  'NavigationMenu.Portal': NavigationMenu.Portal,
  'NavigationMenu.Positioner': NavigationMenu.Positioner,
  'NavigationMenu.Popup': NavigationMenu.Popup,
  'NavigationMenu.Arrow': NavigationMenu.Arrow,
  'NavigationMenu.Viewport': NavigationMenu.Viewport
}

export const DOCS_SECTIONS = ['Reference', 'Guides', 'Dev tools']

export const DOCS_HEADER_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import NavigationMenu from '@aziontech/webkit/navigation-menu'"
]

export const DOCS_HEADER_SETUP = [`const sections = ['${DOCS_SECTIONS.join("', '")}']`]

export const DOCS_HEADER_COMPONENTS = {
  Brand,
  Button,
  IconButton,
  ...GLOBAL_HEADER_COMPONENTS,
  ...NAVIGATION_MENU_COMPONENTS
}

export const DOCS_HEADER_MARKUP = `<GlobalHeader aria-label="Azion documentation">
  <GlobalHeader.Left class="justify-start!">
    <IconButton
      icon="pi pi-bars"
      kind="outlined"
      size="medium"
      aria-label="Open documentation navigation"
      class="shrink-0 lg:hidden"
    />
    <GlobalHeader.Brand>
      <a href="#" aria-label="Azion Docs home" class="${BRAND_LINK_CLASS} gap-(--spacing-xs)">
        <Brand kind="default" size="small" />
        <span class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)">
          Docs
        </span>
      </a>
    </GlobalHeader.Brand>
    <NavigationMenu aria-label="Documentation sections" class="ml-(--spacing-xs) hidden shrink-0 lg:flex">
      <NavigationMenu.List class="items-center gap-(--spacing-xxs)">
        <NavigationMenu.Item v-for="section in sections" :key="section">
          <NavigationMenu.Trigger href="#">{{ section }}</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner side="bottom" align="start" :side-offset="12">
          <NavigationMenu.Popup>
            <NavigationMenu.Arrow />
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu>
  </GlobalHeader.Left>
  <GlobalHeader.Nav />
  <GlobalHeader.Right>
    ${SEARCH_BUTTON('Search documentation')}
    <IconButton
      icon="pi pi-github"
      kind="outlined"
      size="medium"
      aria-label="Azion on GitHub"
      href="https://github.com/aziontech"
      target="_blank"
      class="shrink-0"
    />
    <Button label="Console" kind="secondary" size="medium" class="shrink-0" href="#" />
  </GlobalHeader.Right>
</GlobalHeader>`

export const SITE_LINKS = [
  'Solutions',
  'Products',
  'Developers',
  'Resources',
  'Customers',
  'Pricing'
]

export const SITE_HEADER_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'",
  "import NavigationMenu from '@aziontech/webkit/navigation-menu'"
]

export const SITE_HEADER_SETUP = [`const links = ['${SITE_LINKS.join("', '")}']`]

export const SITE_HEADER_COMPONENTS = {
  Brand,
  Button,
  IconButton,
  ...GLOBAL_HEADER_COMPONENTS,
  ...NAVIGATION_MENU_COMPONENTS
}

export const SITE_HEADER_MARKUP = `<GlobalHeader kind="site" aria-label="Azion" class="sticky top-0 z-40">
  <GlobalHeader.Left class="justify-start!">
    <IconButton
      icon="pi pi-bars"
      kind="outlined"
      size="medium"
      aria-label="Open navigation"
      class="shrink-0 xl:hidden"
    />
    <GlobalHeader.Brand>
      <a href="#" aria-label="Azion home" class="${BRAND_LINK_CLASS}">
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
  </GlobalHeader.Left>

  <GlobalHeader.Middle class="justify-start!">
    <NavigationMenu aria-label="Azion" class="min-w-0">
      <NavigationMenu.List class="hidden items-center gap-(--spacing-xxs) xl:flex">
        <NavigationMenu.Item v-for="link in links" :key="link">
          <NavigationMenu.Trigger href="#">{{ link }}</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner side="bottom" align="start" :side-offset="12">
          <NavigationMenu.Popup kind="contrast">
            <NavigationMenu.Arrow />
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu>
  </GlobalHeader.Middle>

  <GlobalHeader.Right>
    ${SEARCH_BUTTON('Search')}
    <div class="hidden xl:flex">
      <Button label="Contact" kind="text" size="medium" href="#" />
    </div>
    <Button label="Login" kind="secondary" size="medium" href="#" />
    <Button label="Start for Free" kind="primary" size="medium" class="shrink-0" href="#" />
  </GlobalHeader.Right>
</GlobalHeader>`

const AVATAR_BUTTON = `<button
      type="button"
      aria-label="Account settings"
      class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
    >
      <Avatar label="gabriel@azion.com" size="medium" kind="square" />
    </button>`

export const AUTH_HEADER_IMPORTS = [
  "import Brand from '@aziontech/webkit/brand'",
  "import Button from '@aziontech/webkit/button'",
  "import GlobalHeader from '@aziontech/webkit/global-header'"
]

export const AUTH_HEADER_COMPONENTS = { Brand, Button, ...GLOBAL_HEADER_COMPONENTS }

export const AUTH_HEADER_MARKUP = `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Brand>
    <a href="/home" aria-label="Azion home" class="${BRAND_LINK_CLASS} self-center">
      <Brand kind="default" size="small" />
    </a>
  </GlobalHeader.Brand>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
    <Button label="Documentation" kind="outlined" size="medium" icon="pi pi-book" href="/docs" />
  </GlobalHeader.Right>
</GlobalHeader>`

export const CREATION_HEADER_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'"
]

export const CREATION_CRUMBS = [
  { label: 'Applications', href: '/applications' },
  { label: 'Create application' }
]

export const CREATION_HEADER_SETUP = [
  "const crumbs = [{ label: 'Applications', href: '/applications' }, { label: 'Create application' }]"
]

export const CREATION_HEADER_COMPONENTS = {
  Avatar,
  Brand,
  Breadcrumb,
  IconButton,
  ...GLOBAL_HEADER_COMPONENTS
}

export const CREATION_HEADER_MARKUP = `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left>
    <IconButton icon="pi pi-chevron-left" kind="outlined" size="small" aria-label="Back to applications" />
    <GlobalHeader.Brand>
      <a href="/home" aria-label="Azion home" class="${BRAND_LINK_CLASS} self-center">
        <Brand kind="default" size="small" />
      </a>
    </GlobalHeader.Brand>
    <Breadcrumb :items="crumbs" />
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
    ${AVATAR_BUTTON}
  </GlobalHeader.Right>
</GlobalHeader>`

export const RESOURCE_HEADER_IMPORTS = [
  "import Avatar from '@aziontech/webkit/avatar'",
  "import Brand from '@aziontech/webkit/brand'",
  "import Breadcrumb from '@aziontech/webkit/breadcrumb'",
  "import Button from '@aziontech/webkit/button'",
  "import ButtonHighlight from '@aziontech/webkit/button-highlight'",
  "import GlobalHeader from '@aziontech/webkit/global-header'",
  "import IconButton from '@aziontech/webkit/icon-button'"
]

export const RESOURCE_CRUMBS = [{ label: 'Build', href: '/build' }, { label: 'Applications' }]

export const RESOURCE_SECOND_LEVEL_SETUP = [
  "const crumbs = [{ label: 'Build', href: '/build' }, { label: 'Applications' }]"
]

export const RESOURCE_HEADER_COMPONENTS = {
  Avatar,
  Brand,
  Breadcrumb,
  Button,
  ButtonHighlight,
  IconButton,
  ...GLOBAL_HEADER_COMPONENTS
}

const resourceHeader = (crumb) => `<GlobalHeader aria-label="Azion Console">
  <GlobalHeader.Left class="justify-start!">
    <IconButton
      icon="pi pi-bars"
      kind="outlined"
      size="medium"
      aria-label="Open navigation"
      class="shrink-0 md:hidden"
    />
    <a href="/home" aria-label="Azion home" class="${BRAND_LINK_CLASS} h-6 shrink-0 px-(--spacing-xxs)">
      <Brand kind="default" size="small" />
    </a>${crumb}
  </GlobalHeader.Left>
  <GlobalHeader.Middle />
  <GlobalHeader.Right>
    ${SEARCH_BUTTON('Search')}
    <Button label="Create" kind="primary" size="medium" icon="pi pi-plus-circle" />
    <ButtonHighlight label="Agent" size="medium" icon="ai ai-ask-azion" />
    ${AVATAR_BUTTON}
  </GlobalHeader.Right>
</GlobalHeader>`

export const RESOURCE_FIRST_LEVEL_MARKUP = resourceHeader('')

export const RESOURCE_SECOND_LEVEL_MARKUP = resourceHeader(
  '\n    <Breadcrumb :items="crumbs" class="-ml-(--spacing-xs) hidden w-auto min-w-0 shrink md:flex" />'
)

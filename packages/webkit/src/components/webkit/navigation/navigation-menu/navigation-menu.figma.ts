import figma from '@figma/code-connect/html'

import NavigationMenu from './navigation-menu-root.vue'

/**
 * Composition navigation menu (header mega-menu). Map the Figma Header Navigation frame when available.
 */
figma.connect(
  NavigationMenu,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=0-1',
  {
    example: () => `
<NavigationMenu aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>
        Products
        <NavigationMenu.Icon><i class="pi pi-chevron-down" /></NavigationMenu.Icon>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.List label="Build">
          <NavigationMenu.Item layout="entry" href="#" description="Edge apps">
            Edge Application
          </NavigationMenu.Item>
        </NavigationMenu.List>
      </NavigationMenu.Content>
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
    `
  }
)

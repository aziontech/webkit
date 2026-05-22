import figma from '@figma/code-connect/html'

import NavigationMenuItem from './navigation-menu-item.vue'
import NavigationMenuRoot from './navigation-menu-root.vue'

figma.connect(
  NavigationMenuRoot,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6191',
  {
    example: () => `
<NavigationMenu v-model:value="openItem" :delay="50" :close-delay="300" aria-label="Main">
  <NavigationMenu.List>
    <NavigationMenu.Item value="products">
      <NavigationMenu.Trigger>
        Products
        <NavigationMenu.Icon><ChevronIcon /></NavigationMenu.Icon>
      </NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <NavigationMenu.List label="Build">
          <NavigationMenu.Item
            layout="entry"
            href="#"
            description="Serverless functions"
            close-on-click
          >
            Functions
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

figma.connect(
  NavigationMenuItem,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6170',
  {
    example: () => `
<NavigationMenu.Item
  layout="entry"
  href="#"
  description="Secondary line"
  :featured="false"
  close-on-click
>
  <template #icon><i class="ai ai-edge-functions" aria-hidden="true" /></template>
  Entry title
</NavigationMenu.Item>
    `
  }
)

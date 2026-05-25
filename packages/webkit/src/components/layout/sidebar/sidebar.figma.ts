import figma from '@figma/code-connect/html'

import Sidebar from './sidebar.vue'

/**
 * Figma Webkit Sidebar shell (3735:14866) — search header + grouped menu items.
 */
figma.connect(
  Sidebar,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3735-14866',
  {
    example: () => `
<Sidebar aria-label="Application">
  <template #header>
    <InputText placeholder="Search" size="medium" />
  </template>
  <SidebarGroup scroll>
    <SidebarGroup>
      <MenuItem label="Home" icon="pi pi-home" selected href="/" />
      <MenuItem label="Marketplace" icon="pi pi-shopping-cart" tag-value="Label" tag-severity="info" href="/marketplace" />
    </SidebarGroup>
    <SidebarGroup label="Build">
      <MenuItem label="Edge Application" icon="pi pi-home" href="/edge-application" />
    </SidebarGroup>
  </SidebarGroup>
</Sidebar>
  `
  }
)

import figma from '@figma/code-connect/html'

import TabViewItem from './tab-view-item.vue'
import TabView from './tab-view-root.vue'

figma.connect(
  TabView,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6191',
  {
    example: () => `
<TabView.Root v-model:value="activeTab" default-value="tab-1">
  <TabView.List>
    <TabView.Item value="tab-1" label="Tab Item" />
    <TabView.Item value="tab-2" label="Tab Item" />
    <TabView.Item value="tab-3" label="Tab Item" />
  </TabView.List>
  <TabView.Content>
    <TabView.Panel value="tab-1">Panel one</TabView.Panel>
    <TabView.Panel value="tab-2">Panel two</TabView.Panel>
    <TabView.Panel value="tab-3">Panel three</TabView.Panel>
  </TabView.Content>
</TabView.Root>
    `
  }
)

figma.connect(
  TabViewItem,
  'https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6170',
  {
    example: () => `
<TabView.Item value="tab-1" label="Tab Item" closable>
  <template #leading><i class="ai ai-build-pillar" aria-hidden="true" /></template>
  <template #trailing><i class="ai ai-build-pillar" aria-hidden="true" /></template>
</TabView.Item>
    `
  }
)

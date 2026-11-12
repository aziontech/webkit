import TabsContent from './tabs-content.vue'
import TabsItem from './tabs-item.vue'
import TabsList from './tabs-list.vue'
import TabsPanel from './tabs-panel.vue'
import TabsRoot from './tabs-root.vue'

type CompoundTabs = typeof TabsRoot & {
  Root: typeof TabsRoot
  List: typeof TabsList
  Item: typeof TabsItem
  Content: typeof TabsContent
  Panel: typeof TabsPanel
}

const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Item: TabsItem,
  Content: TabsContent,
  Panel: TabsPanel
}) as CompoundTabs

export default Tabs
export type { TabsValue } from './injection-key'
export type { TabsListAlign } from './tabs-list.vue'

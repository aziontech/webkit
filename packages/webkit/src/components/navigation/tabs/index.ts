import TabsRoot from './tabs.vue'
import TabsContent from './tabs-content.vue'
import TabsList from './tabs-list.vue'
import TabsTrigger from './tabs-trigger.vue'

type CompoundTabs = typeof TabsRoot & {
  List: typeof TabsList
  Trigger: typeof TabsTrigger
  Content: typeof TabsContent
}

const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent
}) as CompoundTabs

export default Tabs
export type { TabsValue } from './injection-key'
export type { TabsActivationMode, TabsProps } from './tabs.vue'
export type { TabsListAlign } from './tabs-list.vue'

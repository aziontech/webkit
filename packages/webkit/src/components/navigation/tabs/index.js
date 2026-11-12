import TabsContent from './tabs-content.vue'
import TabsItem from './tabs-item.vue'
import TabsList from './tabs-list.vue'
import TabsPanel from './tabs-panel.vue'
import TabsRoot from './tabs-root.vue'

/** @type {any} */
const Tabs = TabsRoot

Tabs.Root = TabsRoot
Tabs.List = TabsList
Tabs.Item = TabsItem
Tabs.Content = TabsContent
Tabs.Panel = TabsPanel

export default Tabs

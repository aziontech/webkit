import TabViewContent from './tab-view-content.vue'
import TabViewItem from './tab-view-item.vue'
import TabViewList from './tab-view-list.vue'
import TabViewPanel from './tab-view-panel.vue'
import TabViewRoot from './tab-view-root.vue'

const TabView = TabViewRoot

TabView.Root = TabViewRoot
TabView.List = TabViewList
TabView.Item = TabViewItem
TabView.Content = TabViewContent
TabView.Panel = TabViewPanel

export default TabView

// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6191
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/tab-view/tab-view-root.vue
// component=TabView
import figma from 'figma'

const instance = figma.selectedInstance

const panel = instance.getSlot('panel')

const tabs = instance
  .findLayers((node) => node.type === 'INSTANCE' && node.name === 'TabViewItem')
  .filter((node) => node.type === 'INSTANCE')
  .map((node, index) => ({
    value: `tab-${index + 1}`,
    label: node.getString('label'),
    closable: node.getBoolean('closable'),
    active: node.getPropertyValue('state') === 'Highlight'
  }))

const active = (tabs.find((tab) => tab.active) || tabs[0] || { value: 'tab-1' }).value

const items = tabs
  .map(
    (tab) =>
      `
    <TabView.Item value="${tab.value}" label="${tab.label}"${tab.closable ? ' closable' : ''} />`
  )
  .join('')

export default {
  example: figma.code`<TabView.Root default-value="${active}">
  <TabView.List>${items}
  </TabView.List>
  <TabView.Content>
    <TabView.Panel value="${active}">
      ${panel}
    </TabView.Panel>
  </TabView.Content>
</TabView.Root>`,
  imports: ["import TabView from '@aziontech/webkit/tab-view'"],
  id: 'tab-view',
  metadata: { nestable: true }
}

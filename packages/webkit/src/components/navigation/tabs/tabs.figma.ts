// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6191
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/tabs/tabs-root.vue
// component=Tabs
import figma from 'figma'

const instance = figma.selectedInstance

const panel = instance.getSlot('panel')

const tabs = instance
  .findLayers((node) => node.type === 'INSTANCE' && node.name === 'TabsItem')
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
    <Tabs.Item value="${tab.value}" label="${tab.label}"${tab.closable ? ' closable' : ''} />`
  )
  .join('')

export default {
  example: figma.code`<Tabs.Root default-value="${active}">
  <Tabs.List>${items}
  </Tabs.List>
  <Tabs.Content>
    <Tabs.Panel value="${active}">
      ${panel}
    </Tabs.Panel>
  </Tabs.Content>
</Tabs.Root>`,
  imports: ["import Tabs from '@aziontech/webkit/tabs'"],
  id: 'tabs',
  metadata: { nestable: true }
}

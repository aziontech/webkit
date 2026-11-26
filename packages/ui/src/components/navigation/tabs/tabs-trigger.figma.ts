// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6170
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/tabs/tabs-trigger.vue
// component=TabsTrigger
import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('label')
const state = instance.getEnum('state', {
  idle: 'idle',
  hover: 'idle',
  highlight: 'selected',
  disabled: 'disabled'
})
const showLeftIcon = instance.getBoolean('showLeftIcon')
const showRightIcon = instance.getBoolean('showRightIcon')
const closable = instance.getBoolean('closable')

const attrs = figma.code`${label === 'Tab Item' ? '' : figma.code` label="${label}"`}${state === 'disabled' ? ' disabled' : ''}${closable ? ' closable' : ''}`

export default {
  example:
    showLeftIcon || showRightIcon
      ? figma.code`<Tabs.Trigger${attrs}>${
          showLeftIcon
            ? figma.code`
  <template #leading><i class="az az-box" aria-hidden="true" /></template>`
            : ''
        }${
          showRightIcon
            ? figma.code`
  <template #trailing><i class="az az-box" aria-hidden="true" /></template>`
            : ''
        }
</Tabs.Trigger>`
      : figma.code`<Tabs.Trigger${attrs} />`,
  imports: ["import Tabs from '@aziontech/webkit/tabs'"],
  id: 'tab-view-item',
  metadata: { nestable: true }
}

// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6301
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/navigation/breadcrumb/breadcrumb.vue
// component=Breadcrumb
import figma from 'figma'

const instance = figma.selectedInstance

const quote = (value) =>
  `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;')}'`

const segments = instance
  .findLayers((node) => node.type === 'INSTANCE' && node.name === 'Breadcrumb Item')
  .filter((node) => node.type === 'INSTANCE')

const items = segments
  .map((node, index) => {
    const isLast = index === segments.length - 1
    const fields = [`label: ${quote(node.getString('label'))}`]
    if (!isLast) fields.push("href: '#'")
    if (node.getBoolean('showIcon')) fields.push('showIcon: true')
    return `
    { ${fields.join(', ')} }`
  })
  .join(',')

export default {
  example: figma.code`<Breadcrumb
  :items="[${items}
  ]"
/>`,
  imports: ["import Breadcrumb from '@aziontech/webkit/breadcrumb'"],
  id: 'breadcrumb',
  metadata: { nestable: true }
}

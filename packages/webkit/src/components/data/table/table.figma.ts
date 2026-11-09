// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=2053-7649
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/data/table/table.vue
// component=Table
import figma from 'figma'

const instance = figma.selectedInstance

const template = instance.getEnum('templateType', {
  basic: 'basic',
  filtered: 'filtered',
  empty: 'empty'
})
const toolbar = instance.getSlot('header')
const filters = instance.getSlot('filterBar')

const toKey = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .map((word, index) => (index === 0 ? word : word[0].toUpperCase() + word.slice(1)))
    .join('')

const columns = instance
  .findLayers((node) => node.type === 'INSTANCE' && node.name === 'HeaderCell', {
    traverseInstances: true
  })
  .reduce(
    (acc, node) => {
      if (node.type !== 'INSTANCE') return acc
      const kind = node.getEnum('kind', {
        default: 'default',
        checkbox: 'checkbox',
        slot: 'slot'
      })
      const content = node.findText('Cell Content')
      if (kind !== 'default' || content.type !== 'TEXT') return acc
      const sortable = node.getEnum('sortable', {
        default: false,
        true: true
      })
      return figma.code`${acc}
    { accessorKey: '${toKey(content.textContent)}', header: '${content.textContent}'${sortable ? figma.code`, enableSorting: true` : ''} },`
    },
    figma.code``
  )

const paginator = instance.findInstance('_Paginator', { traverseInstances: true })
const emptyState = instance.findInstance('EmptyState', { traverseInstances: true })

export default {
  example: figma.code`<Table
  :data="${template === 'empty' ? '[]' : 'rows'}"
  :columns="[${columns}
  ]"${
    paginator.type === 'INSTANCE' && template !== 'empty'
      ? figma.code`
  paginated`
      : ''
  }
>
  <template #toolbar>
    ${toolbar}
  </template>${
    template === 'filtered'
      ? figma.code`

  <template #filters>
    ${filters}
  </template>`
      : ''
  }${
    template === 'empty' && emptyState.type === 'INSTANCE'
      ? figma.code`

  <template #empty>
    ${emptyState.executeTemplate().example}
  </template>`
      : ''
  }
</Table>`,
  imports: ["import Table from '@aziontech/webkit/table'"],
  id: 'table',
  metadata: { nestable: false }
}

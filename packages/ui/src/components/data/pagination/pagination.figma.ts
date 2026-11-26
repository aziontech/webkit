// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4438-11665
// source=https://github.com/aziontech/webkit/blob/main/packages/ui/src/components/data/pagination/pagination.vue
// component=Pagination
import figma from 'figma'

const instance = figma.selectedInstance

const buttons = instance
  .findLayers((node) => node.type === 'INSTANCE' && node.name === 'PaginationButton')
  .reduce(
    (acc, node) => {
      if (node.type !== 'INSTANCE') return acc
      const selected = node.getEnum('state', {
        default: false,
        active: false,
        hover: false,
        selected: true
      })
      const type = selected
        ? 'number'
        : node.getEnum('kind', {
            previous: 'previous',
            next: 'next',
            number: 'number',
            more: 'more'
          })
      const number = node.findText('99')
      const page = number.type === 'TEXT' ? number.textContent : '1'
      if (type === 'previous') {
        return figma.code`${acc}
  <Pagination.Button type="previous" aria-label="Previous page" />`
      }
      if (type === 'next') {
        return figma.code`${acc}
  <Pagination.Button type="next" aria-label="Next page" />`
      }
      if (type === 'more') {
        return figma.code`${acc}
  <Pagination.Button type="more" />`
      }
      return figma.code`${acc}
  <Pagination.Button${selected ? figma.code` active` : ''}>${page}</Pagination.Button>`
    },
    figma.code``
  )

const pageSize = instance.findInstance('Select')

export default {
  example: figma.code`<Pagination>${buttons}${
    pageSize.type === 'INSTANCE'
      ? figma.code`

  <template #controls>
    <Pagination.PageSize :model-value="10" />
  </template>`
      : ''
  }
</Pagination>`,
  imports: ["import Pagination from '@aziontech/ui/pagination'"],
  id: 'pagination',
  metadata: { nestable: true }
}

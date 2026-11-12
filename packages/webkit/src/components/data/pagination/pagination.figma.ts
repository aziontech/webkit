// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4438-11665
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/data/pagination/pagination.vue
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
      const kind = selected
        ? 'number'
        : node.getEnum('kind', {
            previous: 'previous',
            next: 'next',
            number: 'number',
            more: 'more'
          })
      const number = node.findText('99')
      const page = number.type === 'TEXT' ? number.textContent : '1'
      if (kind === 'previous') {
        return figma.code`${acc}
  <Pagination.Button kind="previous" aria-label="Previous page" />`
      }
      if (kind === 'next') {
        return figma.code`${acc}
  <Pagination.Button kind="next" aria-label="Next page" />`
      }
      if (kind === 'more') {
        return figma.code`${acc}
  <Pagination.Button kind="more" />`
      }
      return figma.code`${acc}
  <Pagination.Button${selected ? figma.code` selected` : ''}>${page}</Pagination.Button>`
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
  imports: ["import Pagination from '@aziontech/webkit/pagination'"],
  id: 'pagination',
  metadata: { nestable: true }
}

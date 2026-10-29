// url=https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=4438-11665
// source=https://github.com/aziontech/webkit/blob/main/packages/webkit/src/components/data/paginator/paginator.vue
// component=Paginator
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
  <Paginator.Button kind="previous" aria-label="Previous page" />`
      }
      if (kind === 'next') {
        return figma.code`${acc}
  <Paginator.Button kind="next" aria-label="Next page" />`
      }
      if (kind === 'more') {
        return figma.code`${acc}
  <Paginator.Button kind="more" />`
      }
      return figma.code`${acc}
  <Paginator.Button${selected ? figma.code` selected` : ''}>${page}</Paginator.Button>`
    },
    figma.code``
  )

const pageSize = instance.findInstance('Select')

export default {
  example: figma.code`<Paginator>${buttons}${
    pageSize.type === 'INSTANCE'
      ? figma.code`

  <template #controls>
    <Paginator.PageSize :model-value="10" />
  </template>`
      : ''
  }
</Paginator>`,
  imports: ["import Paginator from '@aziontech/webkit/paginator'"],
  id: 'paginator',
  metadata: { nestable: true }
}

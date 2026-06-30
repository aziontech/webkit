import Item from './item.vue'
import ItemActions from './item-actions.vue'
import ItemContent from './item-content.vue'
import ItemDescription from './item-description.vue'
import ItemFooter from './item-footer.vue'
import ItemGroup from './item-group.vue'
import ItemHeader from './item-header.vue'
import ItemMedia from './item-media.vue'
import ItemSeparator from './item-separator.vue'
import ItemTitle from './item-title.vue'

type CompoundItem = typeof Item & {
  Group: typeof ItemGroup
  Separator: typeof ItemSeparator
  Media: typeof ItemMedia
  Content: typeof ItemContent
  Title: typeof ItemTitle
  Description: typeof ItemDescription
  Actions: typeof ItemActions
  Header: typeof ItemHeader
  Footer: typeof ItemFooter
}

const ItemRoot = Object.assign(Item, {
  Group: ItemGroup,
  Separator: ItemSeparator,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
  Header: ItemHeader,
  Footer: ItemFooter
}) as CompoundItem

export default ItemRoot

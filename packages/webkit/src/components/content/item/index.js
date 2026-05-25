import ItemRoot from './item.vue'
import ItemActions from './item-actions.vue'
import ItemContent from './item-content.vue'
import ItemDescription from './item-description.vue'
import ItemFooter from './item-footer.vue'
import ItemGroup from './item-group.vue'
import ItemHeader from './item-header.vue'
import ItemMedia from './item-media.vue'
import ItemSeparator from './item-separator.vue'
import ItemTitle from './item-title.vue'

const Item = ItemRoot

Item.Group = ItemGroup
Item.Separator = ItemSeparator
Item.Media = ItemMedia
Item.Content = ItemContent
Item.Title = ItemTitle
Item.Description = ItemDescription
Item.Actions = ItemActions
Item.Header = ItemHeader
Item.Footer = ItemFooter

export default Item

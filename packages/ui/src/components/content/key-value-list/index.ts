import KeyValueList from './key-value-list.vue'
import KeyValueListGroup from './key-value-list-group/key-value-list-group.vue'
import KeyValueListItem from './key-value-list-item/key-value-list-item.vue'

type CompoundKeyValuePairs = typeof KeyValueList & {
  Item: typeof KeyValueListItem
  Group: typeof KeyValueListGroup
}

const KeyValueListRoot = Object.assign(KeyValueList, {
  Item: KeyValueListItem,
  Group: KeyValueListGroup
}) as CompoundKeyValuePairs

export default KeyValueListRoot
export { KeyValueListGroup, KeyValueListItem }
export type { KeyValueListColumns, KeyValueListVariant } from './key-value-list.vue'
export type { KeyValueListProps } from './key-value-list.vue'
export type { KeyValueListGroupProps } from './key-value-list-group/key-value-list-group.vue'
export type { KeyValueListItemProps } from './key-value-list-item/key-value-list-item.vue'

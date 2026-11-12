import KeyValuePairs from './key-value-pairs.vue'
import KeyValuePairsGroup from './key-value-pairs-group/key-value-pairs-group.vue'
import KeyValuePairsItem from './key-value-pairs-item/key-value-pairs-item.vue'

type CompoundKeyValuePairs = typeof KeyValuePairs & {
  Item: typeof KeyValuePairsItem
  Group: typeof KeyValuePairsGroup
}

const KeyValuePairsRoot = Object.assign(KeyValuePairs, {
  Item: KeyValuePairsItem,
  Group: KeyValuePairsGroup
}) as CompoundKeyValuePairs

export default KeyValuePairsRoot
export { KeyValuePairsGroup, KeyValuePairsItem }
export type { KeyValuePairsColumns, KeyValuePairsKind } from './key-value-pairs.vue'

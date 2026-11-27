import TransferList from './transfer-list.vue'
import TransferListControls from './transfer-list-controls/transfer-list-controls.vue'
import TransferListSource from './transfer-list-source/transfer-list-source.vue'
import TransferListTarget from './transfer-list-target/transfer-list-target.vue'

type CompoundTransferList = typeof TransferList & {
  Source: typeof TransferListSource
  Target: typeof TransferListTarget
  Controls: typeof TransferListControls
}

const TransferListRoot = Object.assign(TransferList, {
  Source: TransferListSource,
  Target: TransferListTarget,
  Controls: TransferListControls
}) as CompoundTransferList

export default TransferListRoot
export { TransferListControls, TransferListSource, TransferListTarget }
export type {
  TransferListItems,
  TransferListItemSlotProps,
  TransferListMoveDirection,
  TransferListSide,
  TransferListValue
} from './injection-key'
export type { TransferListProps } from './transfer-list.vue'
export type { TransferListSourceProps } from './transfer-list-source/transfer-list-source.vue'
export type { TransferListTargetProps } from './transfer-list-target/transfer-list-target.vue'

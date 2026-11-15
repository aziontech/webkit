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
  MoveDirection,
  TransferListItems,
  TransferListSide,
  TransferListValue
} from './injection-key'

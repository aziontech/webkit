import BoardRoot from './board.vue'
import BoardItem from './board-item/board-item.vue'

interface BoardStatic {
  Item: typeof BoardItem
}

const Board = BoardRoot as typeof BoardRoot & BoardStatic
Board.Item = BoardItem

export default Board
export { BoardItem }
export type { BoardLayoutItem, BoardMoveDirection } from './injection-key'

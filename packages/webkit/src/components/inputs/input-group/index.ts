import InputGroup from './input-group.vue'
import InputGroupSlotLeft from './input-group-slot-left/input-group-slot-left.vue'
import InputGroupSlotRight from './input-group-slot-right/input-group-slot-right.vue'

export default Object.assign(InputGroup, {
  SlotLeft: InputGroupSlotLeft,
  SlotRight: InputGroupSlotRight
})

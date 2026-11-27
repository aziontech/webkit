import type { FunctionalComponent, Slots, VNodeChild } from 'vue'

export interface SlotOutletProps {
  slots: Slots
  name: string
  scope?: Record<string, unknown>
}

const SlotOutlet: FunctionalComponent<SlotOutletProps> = (props): VNodeChild =>
  props.slots[props.name]?.(props.scope ?? {})

export default SlotOutlet

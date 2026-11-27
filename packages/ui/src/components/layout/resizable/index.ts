import ResizableRoot from './resizable.vue'
import ResizableHandle from './resizable-handle/resizable-handle.vue'
import ResizablePane from './resizable-pane/resizable-pane.vue'

interface ResizableStatic {
  Pane: typeof ResizablePane
  Handle: typeof ResizableHandle
}

const Resizable = ResizableRoot as typeof ResizableRoot & ResizableStatic
Resizable.Pane = ResizablePane
Resizable.Handle = ResizableHandle

export default Resizable
export { ResizableHandle, ResizablePane }
export type { ResizableOrientation } from './resizable.vue'
export type { ResizableProps } from './resizable.vue'
export type { ResizableHandleProps } from './resizable-handle/resizable-handle.vue'
export type { ResizablePaneProps } from './resizable-pane/resizable-pane.vue'

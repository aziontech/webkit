import ResizablePanelRoot from './resizable-panel.vue'
import ResizablePanelHandle from './resizable-panel-handle/resizable-panel-handle.vue'
import ResizablePanelPane from './resizable-panel-pane/resizable-panel-pane.vue'

interface ResizablePanelStatic {
  Pane: typeof ResizablePanelPane
  Handle: typeof ResizablePanelHandle
}

const ResizablePanel = ResizablePanelRoot as typeof ResizablePanelRoot & ResizablePanelStatic
ResizablePanel.Pane = ResizablePanelPane
ResizablePanel.Handle = ResizablePanelHandle

export default ResizablePanel
export { ResizablePanelHandle, ResizablePanelPane }

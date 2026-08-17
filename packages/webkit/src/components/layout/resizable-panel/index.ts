import ResizablePanelRoot from './resizable-panel.vue'
import ResizablePanelHandle from './resizable-panel-handle/resizable-panel-handle.vue'
import ResizablePanelPane from './resizable-panel-pane/resizable-panel-pane.vue'

// The compound, in the shape `accordion/index.ts` already uses rather than a bare
// `Object.assign`. Both attach the same members; the difference is that `Object.assign`
// asks TypeScript to INFER the resulting type, and inferring it walks each part's local
// `interface Props` into the emitted declaration — `TS4082: default export ... is using
// private name 'Props'`. Naming the static surface up front and casting once keeps the
// declaration self-contained, and `<ResizablePanel.Pane>` stays typed either way.
interface ResizablePanelStatic {
  Pane: typeof ResizablePanelPane
  Handle: typeof ResizablePanelHandle
}

const ResizablePanel = ResizablePanelRoot as typeof ResizablePanelRoot & ResizablePanelStatic
ResizablePanel.Pane = ResizablePanelPane
ResizablePanel.Handle = ResizablePanelHandle

export default ResizablePanel
export { ResizablePanelHandle, ResizablePanelPane }

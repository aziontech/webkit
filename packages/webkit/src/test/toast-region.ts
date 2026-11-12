// The app's one toast region, for tests that render a block on its own. A block is a page body:
// it only calls `toast`, and the app mounts the region once (ToastPlugin, or one Toaster at its
// root). A test that asserts a block's toast mounts the region the way an app does, before the
// block, and drops it (with every toast still in the store) when the test ends.
import { afterEach, beforeEach } from 'vitest'
import { createApp } from 'vue'

import { toast, ToastPlugin } from '../components/feedback/toast'

export function mountToastRegion(): () => void {
  const app = createApp({ render: () => null })
  app.use(ToastPlugin, { position: 'bottom-right' })
  app.mount(document.createElement('div'))
  return () => {
    toast.dismiss()
    app.unmount()
  }
}

export function useToastRegion(): void {
  let release: (() => void) | undefined
  beforeEach(() => {
    release = mountToastRegion()
  })
  afterEach(() => {
    release?.()
    release = undefined
  })
}

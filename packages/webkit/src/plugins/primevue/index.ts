import type { App, Plugin } from 'vue'

import { DialogService, PrimeVueConfig, ToastService, Tooltip } from './primevue-internals.js'

export const WebkitPlugin: Plugin = {
  install(app: App, options: Record<string, unknown> = {}): void {
    // @ts-expect-error - Vue version mismatch between dependencies
    app.use(PrimeVueConfig, options)
    // @ts-expect-error - Vue version mismatch between dependencies
    app.use(ToastService)
    // @ts-expect-error - Vue version mismatch between dependencies
    app.use(DialogService)
    // @ts-expect-error - Vue version mismatch between dependencies
    app.directive('tooltip', Tooltip)
  }
}

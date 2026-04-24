import { DialogService, PrimeVueConfig, ToastService, Tooltip } from './primevue-internals.js'

export const WebkitPlugin = {
  install(app, options = {}) {
    app.use(PrimeVueConfig, options)
    app.use(ToastService)
    app.use(DialogService)
    app.directive('tooltip', Tooltip)
  }
}

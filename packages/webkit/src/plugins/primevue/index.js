import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import Tooltip from 'primevue/tooltip'

export const WebkitPlugin = {
  install(app, options = {}) {
    app.use(PrimeVue, options)
    app.use(ToastService)
    app.use(DialogService)
    app.directive('tooltip', Tooltip)
  }
}

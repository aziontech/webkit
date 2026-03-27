import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import type { App } from 'vue';

/**
 * Vue application setup entrypoint.
 *
 * Registered via astro.config.mjs `vue({ appEntrypoint: '/src/vue-app-setup' })`.
 * This runs once for every island/client component, so only register global
 * plugins here — avoid heavy side-effects.
 */
export default (app: App) => {
  app.use(PrimeVue, { ripple: false });
  app.use(ToastService);
};

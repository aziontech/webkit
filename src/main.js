import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import App from './App.vue';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import './assets/main.css';
import './assets/themes/scss/themes/azion-light/theme.scss';
import './assets/themes/scss/themes/azion-dark/theme.scss';

const app = createApp(App);
app.use(PrimeVue, { ripple: true });
app.directive('tooltip', Tooltip)
app.mount('#app');

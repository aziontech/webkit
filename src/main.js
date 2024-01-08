import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';
import InstantSearch from 'vue-instantsearch/vue3/es';

import App from './App.vue';

import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import './assets/icons/azionicons.scss'

import './assets/main.css';
import './assets/themes/scss/themes/azion-light/theme.scss';
import './assets/themes/scss/themes/azion-dark/theme.scss';

const app = createApp(App);
const pinia = createPinia();

app.use(InstantSearch);
app.use(pinia);
app.use(PrimeVue);

app.directive('tooltip', Tooltip)
app.mount('#app');

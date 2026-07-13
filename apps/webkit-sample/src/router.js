import { createRouter, createWebHistory } from 'vue-router'

import LoginScreen from './components/LoginScreen.vue'
import Dashboard from './components/Dashboard.vue'
import CreationCenter from './components/CreationCenter.vue'
import DeployTemplate from './components/DeployTemplate.vue'
import AccountSettings from './components/AccountSettings.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginScreen },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/create', name: 'create', component: CreationCenter },
  { path: '/deploy', name: 'deploy', component: DeployTemplate },
  { path: '/account', name: 'account', component: AccountSettings },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

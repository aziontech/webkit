import { createRouter, createWebHistory } from 'vue-router'

import AccountSettings from './components/AccountSettings.vue'
import ApplicationDetail from './components/ApplicationDetail.vue'
import Applications from './components/Applications.vue'
import CardBoxSaves from './components/CardBoxSaves.vue'
import CreateApplication from './components/CreateApplication.vue'
import CreateTeam from './components/CreateTeam.vue'
import CreateWorkload from './components/CreateWorkload.vue'
import CreationCenter from './components/CreationCenter.vue'
import Dashboard from './components/Dashboard.vue'
import DeployTemplate from './components/DeployTemplate.vue'
import DialogForm from './components/DialogForm.vue'
import DrawerForm from './components/DrawerForm.vue'
import DrawerItemGroups from './components/DrawerItemGroups.vue'
import FormsIndex from './components/FormsIndex.vue'
import Home from './components/Home.vue'
import InPageForm from './components/InPageForm.vue'
import ItemGroupSaves from './components/ItemGroupSaves.vue'
import ItemGroupSettings from './components/ItemGroupSettings.vue'
import LoginScreen from './components/LoginScreen.vue'
import Marketplace from './components/Marketplace.vue'
import NestedDrawer from './components/NestedDrawer.vue'
import PersonalTokens from './components/PersonalTokens.vue'
import Playground from './components/Playground.vue'
import TemplateSettings from './components/TemplateSettings.vue'
import Variables from './components/Variables.vue'
import WorkloadDetail from './components/WorkloadDetail.vue'
import Workloads from './components/Workloads.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'login', component: LoginScreen },
  { path: '/home', name: 'home', component: Home },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/applications', name: 'applications', component: Applications },
  { path: '/marketplace', name: 'marketplace', component: Marketplace },
  { path: '/workloads', name: 'workloads', component: Workloads },
  { path: '/workloads/new', name: 'workloads-new', component: CreateWorkload },
  { path: '/workloads/:id', name: 'workload-detail', component: WorkloadDetail },
  { path: '/applications/new', name: 'applications-new', component: CreateApplication },
  { path: '/applications/:id', name: 'application-detail', component: ApplicationDetail },
  { path: '/variables', name: 'variables', component: Variables },
  { path: '/forms', name: 'forms', component: FormsIndex },
  { path: '/forms/in-page', name: 'forms-in-page', component: InPageForm },
  { path: '/forms/fields-separated', name: 'forms-fields-separated', component: TemplateSettings },
  { path: '/forms/drawer', name: 'forms-drawer', component: DrawerForm },
  { path: '/forms/drawer-itemgroups', name: 'forms-drawer-itemgroups', component: DrawerItemGroups },
  { path: '/forms/nested-drawer', name: 'forms-nested-drawer', component: NestedDrawer },
  { path: '/forms/dialog', name: 'forms-dialog', component: DialogForm },
  { path: '/forms/itemgroup', name: 'forms-itemgroup', component: ItemGroupSettings },
  { path: '/forms/itemgroup-saves', name: 'forms-itemgroup-saves', component: ItemGroupSaves },
  { path: '/forms/cardbox', name: 'forms-cardbox', component: CardBoxSaves },
  { path: '/create', name: 'create', component: CreationCenter },
  { path: '/deploy', name: 'deploy', component: DeployTemplate },
  { path: '/account', name: 'account', component: AccountSettings },
  { path: '/personal-tokens', name: 'personal-tokens', component: PersonalTokens },
  { path: '/playground', name: 'playground', component: Playground },
  { path: '/teams/new', name: 'teams-new', component: CreateTeam },
  { path: '/teams/:id', name: 'teams-edit', component: CreateTeam },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

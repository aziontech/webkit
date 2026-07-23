import { createRouter, createWebHistory } from 'vue-router'

import AccountSettings from './components/AccountSettings.vue'
import ApplicationDetail from './components/ApplicationDetail.vue'
import Applications from './components/Applications.vue'
import BucketBrowser from './components/BucketBrowser.vue'
import CardBoxSaves from './components/CardBoxSaves.vue'
import CheckInbox from './components/CheckInbox.vue'
import CreateApplication from './components/CreateApplication.vue'
import CreateSqlDatabase from './components/CreateSqlDatabase.vue'
import CreateTeam from './components/CreateTeam.vue'
import CreateWorkload from './components/CreateWorkload.vue'
import CreateZone from './components/CreateZone.vue'
import CreationCenter from './components/CreationCenter.vue'
import Dashboard from './components/Dashboard.vue'
import DeployTemplate from './components/DeployTemplate.vue'
import DialogForm from './components/DialogForm.vue'
import DrawerForm from './components/DrawerForm.vue'
import DrawerItemGroups from './components/DrawerItemGroups.vue'
import EdgeDns from './components/EdgeDns.vue'
import EdgeDnsZoneDetail from './components/EdgeDnsZoneDetail.vue'
import FormsIndex from './components/FormsIndex.vue'
import Home from './components/Home.vue'
import InPageForm from './components/InPageForm.vue'
import ItemGroupSaves from './components/ItemGroupSaves.vue'
import ItemGroupSettings from './components/ItemGroupSettings.vue'
import LoginScreen from './components/LoginScreen.vue'
import Marketplace from './components/Marketplace.vue'
import NestedDrawer from './components/NestedDrawer.vue'
import ObjectStorage from './components/ObjectStorage.vue'
import Personalize from './components/Personalize.vue'
import PersonalTokens from './components/PersonalTokens.vue'
import Playground from './components/Playground.vue'
import SignUp from './components/SignUp.vue'
import AzionDocs from './components/docs/AzionDocs.vue'
import LandingAzion from './components/site/LandingAzion.vue'
import SqlDatabase from './components/SqlDatabase.vue'
import SqlDatabaseDetail from './components/SqlDatabaseDetail.vue'
import TemplateSettings from './components/TemplateSettings.vue'
import Variables from './components/Variables.vue'
import WorkloadDetail from './components/WorkloadDetail.vue'
import Workloads from './components/Workloads.vue'

const routes = [
  { path: '/', redirect: '/login' },
  // Segregated marketing router: landing-page examples that render in the
  // sidebar-less SiteLayout (azion.com-style website nav + footer), separate
  // from the console app shell used by every other route.
  { path: '/site', redirect: '/site/home' },
  { path: '/site/home', name: 'site-home', component: LandingAzion },
  { path: '/site/docs', name: 'site-docs', component: AzionDocs },
  { path: '/login', name: 'login', component: LoginScreen },
  { path: '/signup', name: 'signup', component: SignUp },
  { path: '/signup/verify', name: 'signup-verify', component: CheckInbox },
  { path: '/signup/personalize', name: 'signup-personalize', component: Personalize },
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
  { path: '/edge-dns', name: 'edge-dns', component: EdgeDns },
  { path: '/edge-dns/new', name: 'edge-dns-new', component: CreateZone },
  { path: '/edge-dns/:id', name: 'edge-dns-zone-detail', component: EdgeDnsZoneDetail },
  { path: '/object-storage', name: 'object-storage', component: ObjectStorage },
  { path: '/object-storage/:bucket', name: 'bucket-browser', component: BucketBrowser },
  { path: '/sql-database', name: 'sql-database', component: SqlDatabase },
  { path: '/sql-database/new', name: 'sql-database-new', component: CreateSqlDatabase },
  { path: '/sql-database/:id', name: 'sql-database-detail', component: SqlDatabaseDetail },
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

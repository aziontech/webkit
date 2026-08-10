import { createRouter, createWebHistory } from 'vue-router'

import AccountSettings from './components/AccountSettings.vue'
import ApplicationDetail from './components/ApplicationDetail.vue'
import Applications from './components/Applications.vue'
import AsyncDeployment from './components/AsyncDeployment.vue'
import AuthErrors from './components/AuthErrors.vue'
import BucketBrowser from './components/BucketBrowser.vue'
import CardBoxSaves from './components/CardBoxSaves.vue'
import CheckInbox from './components/CheckInbox.vue'
import CreateApplication from './components/CreateApplication.vue'
import CreateOrganization from './components/CreateOrganization.vue'
import CreateSqlDatabase from './components/CreateSqlDatabase.vue'
import CreateTeam from './components/CreateTeam.vue'
import CreateWorkload from './components/CreateWorkload.vue'
import CreateZone from './components/CreateZone.vue'
import CreationCenter from './components/CreationCenter.vue'
import Dashboard from './components/Dashboard.vue'
import DeploymentDetail from './components/DeploymentDetail.vue'
import Deployments from './components/Deployments.vue'
import DeployTemplate from './components/DeployTemplate.vue'
import Diagrams from './components/Diagrams.vue'
import DialogForm from './components/DialogForm.vue'
import AzionDocs from './components/docs/AzionDocs.vue'
import DrawerForm from './components/DrawerForm.vue'
import DrawerItemGroups from './components/DrawerItemGroups.vue'
import EdgeDns from './components/EdgeDns.vue'
import EdgeDnsZoneDetail from './components/EdgeDnsZoneDetail.vue'
import ErrorValidation from './components/ErrorValidation.vue'
import FormsIndex from './components/FormsIndex.vue'
import Home from './components/Home.vue'
import InPageForm from './components/InPageForm.vue'
import ItemGroupSaves from './components/ItemGroupSaves.vue'
import ItemGroupSettings from './components/ItemGroupSettings.vue'
import LoginScreen from './components/LoginScreen.vue'
import ManageResources from './components/ManageResources.vue'
import Marketplace from './components/Marketplace.vue'
import NestedDrawer from './components/NestedDrawer.vue'
import ObjectStorage from './components/ObjectStorage.vue'
import Onboarding from './components/Onboarding.vue'
import PersonalTokens from './components/PersonalTokens.vue'
import Playground from './components/Playground.vue'
import ReleaseComposer from './components/ReleaseComposer.vue'
import SignUp from './components/SignUp.vue'
import SignupFlow from './components/SignupFlow.vue'
import LandingAzion from './components/site/LandingAzion.vue'
import WebkitHub from './components/site/WebkitHub.vue'
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
  { path: '/site/hub', name: 'site-hub', component: WebkitHub },
  // The sample's changelog, rendered as a HIDDEN Hub view: no HubSidebar entry and
  // nothing in the Hub links to it, so it exists only for whoever gets the URL.
  // `props` seeds the shell's opening view (see WebkitHub.vue).
  {
    path: '/site/hub/changelog',
    name: 'site-hub-changelog',
    component: WebkitHub,
    props: { view: 'changelog' }
  },
  { path: '/site/docs', name: 'site-docs', component: AzionDocs },
  { path: '/login', name: 'login', component: LoginScreen },
  // The pre-verification signup flow, NESTED so it is one continuous screen.
  // SignupFlow owns the split (and therefore the entrance), and vue-router keeps a
  // parent instance alive across its children — so the header, the seam and the
  // network panel hold still from /signup to /signup/verify and only the card
  // cross-fades. As siblings, each step re-mounted the split and replayed the whole
  // entrance, which read as three separate page loads.
  {
    path: '/signup',
    component: SignupFlow,
    children: [
      { path: '', name: 'signup', component: SignUp },
      { path: 'verify', name: 'signup-verify', component: CheckInbox }
    ]
  },
  // The last step of signup: the user's organization is created here (and
  // nowhere else — see Onboarding.vue), which is also their first access to the
  // console. Deliberately OUTSIDE the flow above: this is where the flow arrives
  // once the email is verified, on its own composition and its own entrance, so
  // the full slide is spent on the one move that is a real scene change.
  { path: '/signup/onboarding', name: 'signup-onboarding', component: Onboarding },
  { path: '/home', name: 'home', component: Home },
  // Creating an organization from inside the console (the header switcher's New
  // organization entry). A focused creation flow on its own page, like every
  // other module create.
  { path: '/organizations/new', name: 'organizations-new', component: CreateOrganization },
  { path: '/dashboard', name: 'dashboard', component: Dashboard },
  { path: '/applications', name: 'applications', component: Applications },
  { path: '/marketplace', name: 'marketplace', component: Marketplace },
  { path: '/workloads', name: 'workloads', component: Workloads },
  { path: '/deployments', name: 'deployments', component: Deployments },
  // Review and deploy — the release composer. A page rather than a drawer because a
  // release's blast radius is bigger than the thing being deployed: the review has to be
  // linkable, reloadable, and wide enough to hold the release beside what it reaches. Its
  // whole entry context rides the query string (`deploymentIds`, `pickTarget`,
  // `scopedType`, `resourceId`, `versionId`) so a reload lands in the same scenario. It is
  // declared BEFORE `/deployments/:id` so `releases` is never read as a deployment id.
  {
    path: '/deployments/releases/new',
    name: 'release-composer',
    component: ReleaseComposer
  },
  // The deploy page for a container deployment. A URL, not a drawer: a container
  // deployment's runtime and its six-step lifecycle are what a support thread
  // links to and what a user reloads.
  { path: '/deployments/:id', name: 'deployment-detail', component: DeploymentDetail },
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
  {
    path: '/forms/drawer-itemgroups',
    name: 'forms-drawer-itemgroups',
    component: DrawerItemGroups
  },
  { path: '/forms/nested-drawer', name: 'forms-nested-drawer', component: NestedDrawer },
  { path: '/forms/dialog', name: 'forms-dialog', component: DialogForm },
  { path: '/forms/itemgroup', name: 'forms-itemgroup', component: ItemGroupSettings },
  { path: '/forms/itemgroup-saves', name: 'forms-itemgroup-saves', component: ItemGroupSaves },
  { path: '/forms/cardbox', name: 'forms-cardbox', component: CardBoxSaves },
  {
    path: '/forms/error-validation',
    name: 'forms-error-validation',
    component: ErrorValidation
  },
  // The async counterpart of error-validation: a failure that arrives after the
  // user has left the screen. `?outcome=success|error` picks the ending.
  {
    path: '/forms/async-deployment',
    name: 'forms-async-deployment',
    component: AsyncDeployment
  },
  // The auth counterpart of error-validation: the same "where does an error go"
  // question asked on the signed-out screens, where the temptation to answer
  // "a toast" is strongest and wrong most of the time. One picker arms the
  // endpoint (401 / 503 / 500 / timeout / 409) and the card shows where each
  // lands.
  {
    path: '/forms/auth-errors',
    name: 'forms-auth-errors',
    component: AuthErrors
  },
  { path: '/create', name: 'create', component: CreationCenter },
  { path: '/deploy', name: 'deploy', component: DeployTemplate },
  // Settings: ONE ROUTE PER CATEGORY, all mounting the same shell (which picks the
  // view from the path — see AccountSettings.vue). The categories are rows in the
  // sidebar's Settings level, so each one is a page with its own URL instead of a
  // `?tab=` on a single page. `/account` is the level's landing (General).
  { path: '/account', name: 'account', component: AccountSettings },
  { path: '/account/users', name: 'account-users', component: AccountSettings },
  { path: '/account/teams', name: 'account-teams', component: AccountSettings },
  { path: '/account/credentials', name: 'account-credentials', component: AccountSettings },
  { path: '/account/billing', name: 'account-billing', component: AccountSettings },
  { path: '/account/activity', name: 'account-activity', component: AccountSettings },
  { path: '/resources', name: 'resources', component: ManageResources },
  { path: '/personal-tokens', name: 'personal-tokens', component: PersonalTokens },
  { path: '/playground', name: 'playground', component: Playground },
  { path: '/diagrams', name: 'diagrams', component: Diagrams },
  { path: '/teams/new', name: 'teams-new', component: CreateTeam },
  { path: '/teams/:id', name: 'teams-edit', component: CreateTeam }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  // Section deep links. SectionHeading's `anchor` copy button hands out URLs like
  // /applications/1784552864?tab=build#build-configuration, and opening one has to
  // land ON that section. Returning `{ el }` is what makes that work here: the
  // console never scrolls the window (body/#app are overflow-hidden) — it scrolls a
  // nested container — and vue-router resolves `el` through `scrollIntoView()`,
  // which scrolls the nearest scrollable ancestor whatever that happens to be.
  //
  // Only hash navigations are handled; everything else returns `false` (no scroll),
  // which is exactly what the router did before this option existed. The guard
  // keeps a stale or hand-typed hash from logging vue-router's "couldn't find
  // element" warning, and `matchMedia` honours prefers-reduced-motion, since a
  // smooth scroll is motion like any other.
  scrollBehavior(to) {
    if (!to.hash) return false
    try {
      if (!document.querySelector(to.hash)) return false
    } catch {
      return false // not a valid selector
    }
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
    return { el: to.hash, behavior: reduced ? 'auto' : 'smooth' }
  }
})

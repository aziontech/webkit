// The console's routes — every signed-in product screen, plus the signed-out auth
// screens that lead into it. The bulk of the app.
//
// Order matters in two places, both marked below: `/deployments/releases/new`
// is declared before `/deployments/:id`, and the generated create/settings routes
// come from one list so a route and its form cannot drift apart.

import {
  createResourcePath,
  createResources,
  resourceSettingsPath
} from '@console/lib/data/create-resources'
import AccountSettings from '@console/pages/account/AccountSettings.vue'
import CreateOrganization from '@console/pages/account/CreateOrganization.vue'
import CreateTeam from '@console/pages/account/CreateTeam.vue'
import ManageResources from '@console/pages/account/ManageResources.vue'
import PersonalTokens from '@console/pages/account/PersonalTokens.vue'
import ApplicationDetail from '@console/pages/applications/ApplicationDetail.vue'
import Applications from '@console/pages/applications/Applications.vue'
import CreateApplication from '@console/pages/applications/CreateApplication.vue'
import CheckInbox from '@console/pages/auth/CheckInbox.vue'
import LoginScreen from '@console/pages/auth/LoginScreen.vue'
import Onboarding from '@console/pages/auth/Onboarding.vue'
import SignUp from '@console/pages/auth/SignUp.vue'
import SignupFlow from '@console/pages/auth/SignupFlow.vue'
import Connectors from '@console/pages/build/Connectors.vue'
import CustomPages from '@console/pages/build/CustomPages.vue'
import Functions from '@console/pages/build/Functions.vue'
import Variables from '@console/pages/build/Variables.vue'
import DeploymentDetail from '@console/pages/deployments/DeploymentDetail.vue'
import Deployments from '@console/pages/deployments/Deployments.vue'
import ReleaseComposer from '@console/pages/deployments/ReleaseComposer.vue'
import CreateZone from '@console/pages/edge-dns/CreateZone.vue'
import EdgeDns from '@console/pages/edge-dns/EdgeDns.vue'
import EdgeDnsZoneDetail from '@console/pages/edge-dns/EdgeDnsZoneDetail.vue'
import AsyncDeployment from '@console/pages/forms/AsyncDeployment.vue'
import AuthErrors from '@console/pages/forms/AuthErrors.vue'
import CardBoxSaves from '@console/pages/forms/CardBoxSaves.vue'
import DialogForm from '@console/pages/forms/DialogForm.vue'
import DrawerForm from '@console/pages/forms/DrawerForm.vue'
import DrawerItemGroups from '@console/pages/forms/DrawerItemGroups.vue'
import ErrorValidation from '@console/pages/forms/ErrorValidation.vue'
import FormsIndex from '@console/pages/forms/FormsIndex.vue'
import InPageForm from '@console/pages/forms/InPageForm.vue'
import ItemGroupSaves from '@console/pages/forms/ItemGroupSaves.vue'
import ItemGroupSettings from '@console/pages/forms/ItemGroupSettings.vue'
import NestedDrawer from '@console/pages/forms/NestedDrawer.vue'
import TemplateSettings from '@console/pages/forms/TemplateSettings.vue'
import Dashboard from '@console/pages/home/Dashboard.vue'
import Overview from '@console/pages/home/Overview.vue'
import Playground from '@console/pages/lab/Playground.vue'
import ProductEmptyStates from '@console/pages/lab/ProductEmptyStates.vue'
import DeployTemplate from '@console/pages/marketplace/DeployTemplate.vue'
import Marketplace from '@console/pages/marketplace/Marketplace.vue'
import DataStream from '@console/pages/observe/DataStream.vue'
import EdgePulse from '@console/pages/observe/EdgePulse.vue'
import RealTimeEvents from '@console/pages/observe/RealTimeEvents.vue'
import RealTimeMetrics from '@console/pages/observe/RealTimeMetrics.vue'
import RealTimePurge from '@console/pages/observe/RealTimePurge.vue'
import CreateResource from '@console/pages/resources/CreateResource.vue'
import CreationCenter from '@console/pages/resources/CreationCenter.vue'
import ResourceSettings from '@console/pages/resources/ResourceSettings.vue'
import Certificates from '@console/pages/secure/Certificates.vue'
import Firewall from '@console/pages/secure/Firewall.vue'
import NetworkLists from '@console/pages/secure/NetworkLists.vue'
import WafRules from '@console/pages/secure/WafRules.vue'
import CreateSqlDatabase from '@console/pages/sql/CreateSqlDatabase.vue'
import SqlDatabase from '@console/pages/sql/SqlDatabase.vue'
import SqlDatabaseDetail from '@console/pages/sql/SqlDatabaseDetail.vue'
import BucketBrowser from '@console/pages/storage/BucketBrowser.vue'
import ObjectStorage from '@console/pages/storage/ObjectStorage.vue'
import CreateWorkload from '@console/pages/workloads/CreateWorkload.vue'
import WorkloadDetail from '@console/pages/workloads/WorkloadDetail.vue'
import Workloads from '@console/pages/workloads/Workloads.vue'

export const consoleRoutes = [
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
  // Overview. ONE URL, two screens: a brand-new account gets the first access (hero +
  // doors), and once the reader has walked through Applications or Workloads the same
  // address becomes the summary with usage and the resource table. Overview.vue holds
  // the dispatch; ./lib/sample-mode.js holds the condition.
  { path: '/home', name: 'home', component: Overview },
  // Each version pinned to its own route, so a review can link to the shape it is
  // talking about instead of asking the reader to flip the header switcher first.
  // Both mount the SAME component as /home — the shell is Overview's, and pinning is
  // a prop on it — so a pinned link and the mode-driven URL cannot drift apart.
  {
    path: '/home-empty-state',
    name: 'home-empty-state',
    component: Overview,
    props: { version: 'empty' }
  },
  {
    path: '/home-populated',
    name: 'home-populated',
    component: Overview,
    props: { version: 'populated' }
  },
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
  // Build
  { path: '/functions', name: 'functions', component: Functions },
  // Functions is the one resource whose create is NOT the generic renderer: the
  // resource IS the code, so it creates in a code editor (./components/CreateFunction.vue
  // argues it). It is still a PAGE at `/<module>/new` — the surface rule holds, only the
  // page's shape changes — which is why it is declared here and excluded from the
  // generated list below rather than routed somewhere new.
  //
  // LAZY, unlike every other route in this file: it pulls in Monaco and its language
  // workers, and none of that belongs in the entry chunk of an app whose other 60 screens
  // never open an editor.
  {
    path: '/functions/new',
    name: 'functions-new',
    component: () => import('@console/pages/build/CreateFunction.vue')
  },
  // ...and the same argument for the VIEW of one: a function's record is its code, so it
  // is read and edited in the same three tabs the create page writes it in
  // (./components/FunctionDetail.vue), not as a row in the generic settings page. Lazy
  // for the same reason, and it shares the create page's Monaco chunk.
  {
    path: '/functions/:id',
    name: 'functions-detail',
    component: () => import('@console/pages/build/FunctionDetail.vue')
  },
  { path: '/connectors', name: 'connectors', component: Connectors },
  { path: '/custom-pages', name: 'custom-pages', component: CustomPages },
  // Secure
  { path: '/firewall', name: 'firewall', component: Firewall },
  { path: '/waf-rules', name: 'waf-rules', component: WafRules },
  { path: '/certificates', name: 'certificates', component: Certificates },
  { path: '/network-lists', name: 'network-lists', component: NetworkLists },
  // Observe
  { path: '/data-stream', name: 'data-stream', component: DataStream },
  { path: '/real-time-events', name: 'real-time-events', component: RealTimeEvents },
  { path: '/real-time-metrics', name: 'real-time-metrics', component: RealTimeMetrics },
  { path: '/edge-pulse', name: 'edge-pulse', component: EdgePulse },
  { path: '/real-time-purge', name: 'real-time-purge', component: RealTimePurge },
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
  // First use, per product: the screen a module shows before it owns anything —
  // the ways in, then the templates that skip the blank page. One route rather
  // than one per product: the two sections are the pattern, and what changes
  // between products is only what they are asked in (see ProductEmptyStates.vue).
  { path: '/empty-states', name: 'empty-states', component: ProductEmptyStates },
  { path: '/create', name: 'create', component: CreationCenter },
  // The create page of every first-level resource that did not have one — Domains,
  // Functions, Connectors, Custom Pages, Firewall, WAF Rules, Certificate Manager,
  // Network Lists, Data Stream and Object Storage. Ten routes, generated from the one
  // list that also holds their fields (./lib/create-resources.js), so a route and its
  // form cannot drift apart: `<module>/new`, the same convention the four hand-written
  // create flows above already follow.
  //
  // Variables is deliberately absent: its create flow is an in-place row on the module's
  // own page, and turning that into a page would be a regression, not a gap. Functions is
  // absent for the opposite reason: it has a create page of its own, declared above.
  ...createResources
    .filter((resource) => resource.id !== 'functions')
    .map((resource) => ({
      path: createResourcePath(resource.id),
      name: `${resource.id}-new`,
      component: CreateResource,
      props: { resource: resource.id }
    })),
  // ...and the SETTINGS page of each of them, from the same list and the same fields
  // (./components/ResourceSettings.vue). Every module's row menu already offered Edit, and
  // every one of them raised a toast saying the demo stopped there — a reader could create a
  // resource and then had nowhere to change it. This is where that action goes.
  //
  // `<module>/:id/settings`, so it is linkable and survives a reload, and ONE component for
  // all of them for the same reason the create page is one: what differs between resources
  // is which fields the API takes, not the shape of the screen. Functions is filtered out
  // for the same reason it is filtered out above: its record is code, so it is read and
  // edited at `/functions/:id` in the editor tabs, not as a stack of field rows.
  ...createResources
    .filter((resource) => resource.id !== 'functions')
    .map((resource) => ({
      path: resourceSettingsPath(resource.id, ':id'),
      name: `${resource.id}-settings`,
      component: ResourceSettings,
      props: { resource: resource.id }
    })),
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
  // Lazy for the same reason the Monaco routes above are: @vue-flow/core and its
  // stylesheet are a graph engine one lab screen uses and the other 60 never touch.
  {
    path: '/diagrams',
    name: 'diagrams',
    component: () => import('@console/pages/lab/Diagrams.vue')
  },
  { path: '/teams/new', name: 'teams-new', component: CreateTeam },
  { path: '/teams/:id', name: 'teams-edit', component: CreateTeam }
]

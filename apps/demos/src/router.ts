import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const focused = { shell: 'focused' }

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/resources' },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('./views/OnboardingForm.vue'),
    meta: focused
  },
  {
    path: '/onboarding/plan',
    name: 'onboarding-plan',
    component: () => import('./views/OnboardingFormPlan.vue'),
    meta: focused
  },
  {
    path: '/onboarding/profile',
    name: 'onboarding-profile',
    component: () => import('./views/OnboardingFormProfile.vue'),
    meta: focused
  },
  { path: '/resources', name: 'resources', component: () => import('./views/TableView.vue') },
  {
    path: '/resources/:id/delete',
    name: 'resource-delete',
    components: {
      default: () => import('./views/TableView.vue'),
      dialog: () => import('./views/DeleteWithConfirmation.vue')
    }
  },
  {
    path: '/resources/new',
    name: 'resource-create',
    component: () => import('./views/SinglePageCreate.vue'),
    meta: focused
  },
  {
    path: '/resources/:id',
    name: 'resource',
    component: () => import('./views/DetailsPage.vue')
  },
  {
    path: '/resources/:id/edit',
    name: 'resource-edit',
    component: () => import('./views/EditResource.vue')
  },
  {
    path: '/resources/:id/deploy',
    name: 'resource-deploy',
    component: () => import('./views/AsyncSubmit.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./views/SettingsForm.vue'),
    meta: { breadcrumbs: [{ label: 'Account settings' }, { label: 'Profile' }] }
  },
  { path: '/assistant', name: 'assistant', component: () => import('./views/AiChat.vue') },
  { path: '/:path(.*)*', redirect: '/resources' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

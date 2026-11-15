import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const focused = { shell: 'focused' }

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/resources' },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('./pages/onboarding-form-page.vue'),
    meta: focused
  },
  {
    path: '/onboarding/plan',
    name: 'onboarding-plan',
    component: () => import('./pages/onboarding-form-plan-page.vue'),
    meta: focused
  },
  {
    path: '/onboarding/profile',
    name: 'onboarding-profile',
    component: () => import('./pages/onboarding-form-profile-page.vue'),
    meta: focused
  },
  { path: '/resources', name: 'resources', component: () => import('./pages/table-view-page.vue') },
  {
    path: '/resources/:id/delete',
    name: 'resource-delete',
    components: {
      default: () => import('./pages/table-view-page.vue'),
      dialog: () => import('./pages/delete-with-confirmation-page.vue')
    }
  },
  {
    path: '/resources/new',
    name: 'resource-create',
    component: () => import('./pages/single-page-create-page.vue'),
    meta: focused
  },
  {
    path: '/resources/:id',
    name: 'resource',
    component: () => import('./pages/details-page.vue')
  },
  {
    path: '/resources/:id/edit',
    name: 'resource-edit',
    component: () => import('./pages/edit-resource-page.vue')
  },
  {
    path: '/resources/:id/deploy',
    name: 'resource-deploy',
    component: () => import('./pages/async-submit-page.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./pages/settings-form-page.vue'),
    meta: { breadcrumbs: [{ label: 'Account settings' }, { label: 'Profile' }] }
  },
  { path: '/assistant', name: 'assistant', component: () => import('./pages/ai-chat-page.vue') },
  { path: '/:path(.*)*', redirect: '/resources' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

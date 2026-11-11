import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/resources' },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('./views/OnboardingForm.vue')
  },
  {
    path: '/onboarding/plan',
    name: 'onboarding-plan',
    component: () => import('./views/OnboardingFormPlan.vue')
  },
  {
    path: '/onboarding/profile',
    name: 'onboarding-profile',
    component: () => import('./views/OnboardingFormProfile.vue')
  },
  {
    path: '/resources',
    component: () => import('./layouts/Console.vue'),
    children: [
      { path: '', name: 'resources', component: () => import('./views/TableView.vue') },
      {
        path: ':id/delete',
        name: 'resource-delete',
        components: {
          default: () => import('./views/TableView.vue'),
          dialog: () => import('./views/DeleteWithConfirmation.vue')
        }
      }
    ]
  },
  {
    path: '/resources/new',
    name: 'resource-create',
    component: () => import('./views/SinglePageCreate.vue')
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
  { path: '/settings', name: 'settings', component: () => import('./views/SettingsForm.vue') },
  { path: '/assistant', name: 'assistant', component: () => import('./views/AiChat.vue') },
  { path: '/:path(.*)*', redirect: '/resources' }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

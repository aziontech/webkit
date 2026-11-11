import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/HomePage.vue') },
  {
    path: '/components',
    name: 'components',
    component: () => import('./pages/ComponentsIndex.vue')
  },
  {
    path: '/components/:name(.*)',
    name: 'component',
    component: () => import('./pages/ComponentPage.vue')
  },
  { path: '/blocks', name: 'blocks', component: () => import('./pages/BlocksIndex.vue') },
  { path: '/blocks/:id(.*)', name: 'block', component: () => import('./pages/BlockPage.vue') },
  {
    path: '/foundations',
    name: 'foundations',
    component: () => import('./pages/FoundationsIndex.vue')
  },
  {
    path: '/foundations/:slug',
    name: 'foundation',
    component: () => import('./pages/FoundationPage.vue')
  },
  {
    path: '/frame/:state/:id(.*)',
    name: 'frame',
    component: () => import('./pages/FramePage.vue'),
    meta: { bare: true }
  },
  {
    path: '/example',
    name: 'example-frame',
    component: () => import('./pages/ExampleFrame.vue'),
    meta: { bare: true }
  },
  { path: '/404', name: 'not-found', component: () => import('./pages/NotFound.vue') },
  { path: '/:path(.*)*', component: () => import('./pages/NotFound.vue') }
]

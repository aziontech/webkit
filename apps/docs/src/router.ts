import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('./pages/home-page.vue') },
  {
    path: '/components',
    name: 'components',
    component: () => import('./pages/components-page.vue')
  },
  {
    path: '/components/:name(.*)',
    name: 'component',
    component: () => import('./pages/component-page.vue')
  },
  { path: '/blocks', name: 'blocks', component: () => import('./pages/blocks-page.vue') },
  { path: '/blocks/:id(.*)', name: 'block', component: () => import('./pages/block-page.vue') },
  {
    path: '/foundations',
    name: 'foundations',
    component: () => import('./pages/foundations-page.vue')
  },
  { path: '/foundations/icon', redirect: '/assets/icons' },
  {
    path: '/foundations/:slug',
    name: 'foundation',
    component: () => import('./pages/foundation-page.vue')
  },
  { path: '/ai', name: 'ai', component: () => import('./pages/ai-page.vue') },
  { path: '/assets', name: 'assets', component: () => import('./pages/assets-page.vue') },
  {
    path: '/assets/icons',
    name: 'icons',
    component: () => import('./pages/icons-page.vue')
  },
  {
    path: '/frame/block/:id(.*)/:state',
    name: 'block-frame',
    component: () => import('./pages/block-frame-page.vue'),
    meta: { bare: true }
  },
  {
    path: '/frame/example/:path(.*)*',
    name: 'example-frame',
    component: () => import('./pages/example-frame-page.vue'),
    meta: { bare: true }
  },
  { path: '/404', name: 'not-found', component: () => import('./pages/not-found-page.vue') },
  { path: '/:path(.*)*', component: () => import('./pages/not-found-page.vue') }
]

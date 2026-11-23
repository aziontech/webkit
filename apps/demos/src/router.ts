import { nextTick, ref } from 'vue'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteRecordRaw
} from 'vue-router'

import { resources } from './lib/store'

const SITE = 'Azion'
const RESOURCES = 'Resources'

const routes: RouteRecordRaw[] = [
  { path: '/', redirect: '/resources' },
  {
    path: '/onboarding',
    name: 'onboarding',
    component: () => import('./pages/onboarding-form-page.vue'),
    meta: { shell: 'focused', title: 'Welcome' }
  },
  {
    path: '/onboarding/plan',
    name: 'onboarding-plan',
    component: () => import('./pages/onboarding-form-page.vue'),
    meta: { shell: 'focused', title: 'Choose a plan' }
  },
  {
    path: '/onboarding/profile',
    name: 'onboarding-profile',
    component: () => import('./pages/onboarding-form-page.vue'),
    meta: { shell: 'focused', title: 'Your profile' }
  },
  {
    path: '/resources',
    name: 'resources',
    component: () => import('./pages/table-view-page.vue'),
    meta: { title: RESOURCES }
  },
  {
    path: '/resources/:id/delete',
    name: 'resource-delete',
    components: {
      default: () => import('./pages/table-view-page.vue'),
      dialog: () => import('./pages/delete-with-confirmation-page.vue')
    },
    meta: { title: 'Delete', resource: true }
  },
  {
    path: '/resources/new',
    name: 'resource-create',
    component: () => import('./pages/single-page-create-page.vue'),
    meta: { shell: 'focused', title: `Create Resource - ${RESOURCES}` }
  },
  {
    path: '/resources/:id',
    name: 'resource',
    component: () => import('./pages/details-page.vue'),
    meta: { title: '', resource: true }
  },
  {
    path: '/resources/:id/edit',
    name: 'resource-edit',
    component: () => import('./pages/edit-resource-page.vue'),
    meta: { title: 'Edit', resource: true }
  },
  {
    path: '/resources/:id/deploy',
    name: 'resource-deploy',
    component: () => import('./pages/async-submit-page.vue'),
    meta: { title: 'Deploy', resource: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('./pages/settings-form-page.vue'),
    meta: {
      title: 'Profile - Account settings',
      breadcrumbs: [{ label: 'Account settings' }, { label: 'Profile' }]
    }
  },
  {
    path: '/assistant',
    name: 'assistant',
    component: () => import('./pages/ai-chat-page.vue'),
    meta: { title: 'Agent' }
  },
  {
    path: '/settings/ai-keys',
    name: 'ai-keys',
    component: () => import('./pages/ai-api-key-page.vue'),
    meta: {
      title: 'AI provider keys - Account settings',
      breadcrumbs: [{ label: 'Account settings' }, { label: 'AI provider keys' }]
    }
  },
  {
    path: '/:path(.*)*',
    name: 'not-found',
    component: () => import('./pages/not-found-page.vue'),
    meta: { title: 'Page not found' }
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

function pageTitle(route: RouteLocationNormalized): string {
  const title = String(route.meta.title ?? '')
  if (!route.meta.resource) return [title, SITE].filter(Boolean).join(' - ')
  const id = String(route.params.id ?? '')
  const name = resources.value.find((resource) => resource.id === id)?.name ?? id
  return [title, name, RESOURCES, SITE].filter(Boolean).join(' - ')
}

function samePage(to: RouteLocationNormalized, from: RouteLocationNormalized): boolean {
  const next = to.matched[0]?.components?.default
  return next !== undefined && next === from.matched[0]?.components?.default
}

function pageTookFocus(): boolean {
  const active = document.activeElement
  return (
    active instanceof HTMLElement && active !== document.body && Boolean(active.closest('main'))
  )
}

export function focusElement(target: HTMLElement | null): boolean {
  if (!target) return false
  if (!target.hasAttribute('tabindex')) {
    target.setAttribute('tabindex', '-1')
    target.classList.add('focus:outline-none')
    target.addEventListener(
      'blur',
      () => {
        target.removeAttribute('tabindex')
        target.classList.remove('focus:outline-none')
      },
      { once: true }
    )
  }
  target.focus({ preventScroll: true })
  return true
}

function focusPage(): boolean {
  return focusElement(
    document.querySelector<HTMLElement>('main h1') ??
      document.querySelector<HTMLElement>('h1') ??
      document.querySelector<HTMLElement>('main')
  )
}

export function focusResourceRow(id: string) {
  globalThis.requestAnimationFrame(() => {
    const row = id ? document.querySelector<HTMLElement>(`main a[href="/resources/${id}"]`) : null
    if (row) row.focus({ preventScroll: false })
    else focusPage()
  })
}

export const announcement = ref('')

router.afterEach(async (to, from, failure) => {
  if (failure) return
  document.title = pageTitle(to)
  if (from.matched.length === 0 || samePage(to, from) || to.matched[0]?.components?.dialog) return
  await nextTick()
  globalThis.requestAnimationFrame(() => {
    announcement.value = ''
    if (pageTookFocus() || !focusPage()) announcement.value = document.title
  })
})

import { computed, ref } from 'vue'

const WIRE_MS = 1000

const SIGNED_OUT_ROUTE = /^\/(login|signup|site)(\/|$)/

const email = ref('')
const expiresAt = ref(0)
const armedTtl = ref(0)
const expiring = ref(false)

let timer = null
let appRouter = null

export function useSession() {
  return {
    expiring: computed(() => expiring.value),
    expiresAt: computed(() => expiresAt.value)
  }
}

const clearTimer = () => {
  clearTimeout(timer)
  timer = null
}

const isSignedOut = (route) => SIGNED_OUT_ROUTE.test(route.path)

const ttlFromQuery = (value) => {
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0
}

export function startSession(address, { ttlMs = armedTtl.value } = {}) {
  clearTimer()
  if (address) email.value = String(address)
  armedTtl.value = ttlMs
  expiresAt.value = ttlMs ? Date.now() + ttlMs : 0
  if (ttlMs) timer = setTimeout(() => expireSession(), ttlMs)
}

export function endSession() {
  clearTimer()
  expiresAt.value = 0
  expiring.value = false
  email.value = ''
}

export function expireSession() {
  clearTimer()
  expiresAt.value = 0
  if (expiring.value) return

  const route = appRouter?.currentRoute.value
  if (!route || isSignedOut(route)) {
    endSession()
    return
  }

  const from = route.fullPath
  const address = email.value || route.query.email || ''
  expiring.value = true

  timer = setTimeout(async () => {
    timer = null
    await appRouter.replace({
      name: 'login',
      query: { email: address, expired: '1', redirect: from }
    })
    email.value = ''
    expiring.value = false
  }, WIRE_MS)
}

export function installSessionExpiry(router) {
  appRouter = router

  router.afterEach((to) => {
    if (isSignedOut(to)) return
    if (to.query.email) email.value = String(to.query.email)

    const ttl = ttlFromQuery(to.query.ttl)
    if (ttl && ttl !== armedTtl.value) {
      startSession(email.value, { ttlMs: ttl })
      return
    }
    if (expiresAt.value && Date.now() >= expiresAt.value) expireSession()
  })
}

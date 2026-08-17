// The signed-in session, and what an EXPIRED token does to the page you are on.
//
// The sample has no backend and therefore no real token — but it has the shape of
// the event, which is the part a design review needs to see. An access token dies
// while the operator is mid-page, and the console owes them four things, in this
// order:
//
//   1. WIRE — the route they are on is replaced by a Skeleton wire OF ITSELF
//      (see ../components/ui/SessionWire.vue), measured off the shell that is on
//      screen. Not a spinner and not a modal: every value on that page arrived
//      through a request the dead token authorised, so the honest picture is the
//      page without its data — held for a beat, so the sign-out reads as the
//      session draining rather than as a click they did not make.
//   2. SIGN OUT — the session is cleared while the wire covers the screen.
//   3. REDIRECT — `replace`, never `push`: the expired page must not be one Back
//      away. Where they were rides along as `redirect`, so signing in RETURNS
//      there instead of dropping them on Home. `expired=1` rides along too.
//   4. THE REPORT — what explains the trip is a `Message` INSIDE the Sign In card,
//      above both fields, rendered off that `expired=1` (see LoginScreen.vue). Not
//      a toast: per `/forms/auth-errors`, a report goes where its recovery is, and
//      the recovery for an expired session is the two fields on that card. A toast
//      would dismiss itself and point nowhere, in the one corner nobody is looking
//      at on a screen they were just thrown onto. Keeping it in the URL is also
//      what makes it reload-safe — a Message is the state of the screen, so it is
//      right for it to come back on a reload, where an event report would not be.
//
// NOTHING EXPIRES ON ITS OWN. A prototype that signed you out on a timer would
// ambush every other flow in this app mid-demo, so an expiry is always asked for:
//
//   - the account menu's "Expire session token", or ⌘K → the same command —
//     expires immediately, from whatever page you are on;
//   - `?ttl=<seconds>` on any console URL — arms a countdown, for recording the
//     event hands-free: `/applications?email=you@azion.com&ttl=20`. The knob rides
//     in the `redirect`, so signing back in re-arms the same countdown and the
//     whole loop repeats.
//
// Installed once, by the app shell (App.vue), which also mounts the wire.
import { computed, ref } from 'vue'

// How long the wire holds before the redirect. Long enough to be read as the page
// losing its data (and to cover the route change), short enough that nobody waits.
const WIRE_MS = 1000

// Screens that are already signed out — an expiry there has nothing to tear down.
const SIGNED_OUT_ROUTE = /^\/(login|signup|site)(\/|$)/

// The signed-in address. The sample's session identity is the `email` query every
// console navigation carries, so this only mirrors it (and survives the redirect,
// which is what lets Sign In come back already knowing the account).
const email = ref('')
// When the armed countdown fires; 0 means no countdown is armed.
const expiresAt = ref(0)
// The TTL currently armed, so re-arming is idempotent across navigations: a
// session does not restart because the operator clicked a nav item.
const armedTtl = ref(0)
// The wire window — App.vue mounts SessionWire off this.
const expiring = ref(false)

let timer = null
let appRouter = null

// Read the session. `expiring` is the wire window; only this module drives it.
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

// `?ttl=<seconds>` → ms. Anything not a positive number arms nothing.
const ttlFromQuery = (value) => {
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : 0
}

/**
 * Open a session for `address`. Called on sign-in, and on arriving at a console
 * route by deep link (nobody in this sample has to pass through /login first).
 * With no explicit `ttlMs` it re-arms whatever countdown was last armed — which
 * is what makes signing back in after an expiry repeat the same scenario.
 */
export function startSession(address, { ttlMs = armedTtl.value } = {}) {
  clearTimer()
  if (address) email.value = String(address)
  armedTtl.value = ttlMs
  expiresAt.value = ttlMs ? Date.now() + ttlMs : 0
  if (ttlMs) timer = setTimeout(() => expireSession(), ttlMs)
}

/** Close the session deliberately (the Log Out entry). No wire, no notice. */
export function endSession() {
  clearTimer()
  expiresAt.value = 0
  expiring.value = false
  email.value = ''
}

/**
 * The expiry itself: wire → sign out → Sign In, which renders the notice off
 * `expired=1`. Safe to call twice; the second call lands inside the wire window
 * and is ignored.
 */
export function expireSession() {
  clearTimer()
  expiresAt.value = 0
  if (expiring.value) return

  const route = appRouter?.currentRoute.value
  // Already signed out (or no router yet): there is no page to tear down and
  // nowhere to send them, so the session just ends.
  if (!route || isSignedOut(route)) {
    endSession()
    return
  }

  const from = route.fullPath
  const address = email.value || route.query.email || ''
  expiring.value = true

  timer = setTimeout(async () => {
    timer = null
    // The wire is still covering the screen, so the route change happens behind
    // it — the console never flashes back for a frame on its way out. `expired=1`
    // is what puts the Message in the card that lands underneath.
    await appRouter.replace({
      name: 'login',
      query: { email: address, expired: '1', redirect: from }
    })
    email.value = ''
    expiring.value = false
  }, WIRE_MS)
}

/**
 * Wire the session to the router: identity follows the URL, `?ttl=` arms the
 * countdown, and a countdown that elapsed while the tab was in the background
 * (where timers are throttled) is caught on the next navigation.
 */
export function installSessionExpiry(router) {
  appRouter = router

  router.afterEach((to) => {
    if (isSignedOut(to)) return
    if (to.query.email) email.value = String(to.query.email)

    const ttl = ttlFromQuery(to.query.ttl)
    // A ttl in the URL arms the countdown — once. An URL WITHOUT one says nothing
    // about the session (the console's own nav links only carry `email`), so it
    // must not disarm a countdown that is already running.
    if (ttl && ttl !== armedTtl.value) {
      startSession(email.value, { ttlMs: ttl })
      return
    }
    if (expiresAt.value && Date.now() >= expiresAt.value) expireSession()
  })
}

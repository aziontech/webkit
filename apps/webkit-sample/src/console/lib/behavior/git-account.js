// THE GIT ACCOUNT — connect it, then work inside it.
//
// Two parts of the application create need the same thing from GitHub and needed it for
// two different reasons, which is exactly the shape that drifts if each one keeps its own
// copy:
//
//   ../../pages/applications/wizard/GitSourceStep.vue   importing code the reader already
//                                                       has, so it browses the account's
//                                                       repositories
//   ../../pages/applications/wizard/RepositoryStep.vue  cloning a framework starter INTO
//                                                       the account, so it creates one
//
// Both ask for the same authorization, offer the same account switcher with the same
// "Add GitHub account" tail, and reload behind the same Skeletons afterwards. So that
// lives here once: a connect that takes a beat, the linked accounts, and a `reposLoading`
// flag the caller reads while the rows for the chosen account arrive.
//
// It is a DEMO connect — a timer, not an OAuth round trip. What it reproduces faithfully
// is the SHAPE: nothing is browsable before the authorization, the chrome appears at once
// and the rows arrive a beat later, and adding a second account lands you inside it.
import { onBeforeUnmount, reactive, ref } from 'vue'

import { GIT_SCOPES } from '../data/git-repositories'

/**
 * Sentinel value for the switcher's trailing "Add GitHub account" option. Choosing it
 * runs the connect flow instead of becoming the selected account, so it is not a scope
 * any caller can end up holding.
 */
export const ADD_ACCOUNT = '__add-account__'

/**
 * @param {{ connectMs?: number, loadMs?: number }} [options] — the two beats, exposed so a
 *   caller can slow them for a demo rather than editing them here.
 */
export function useGitAccount({ connectMs = 1200, loadMs = 900 } = {}) {
  const connected = ref(false)
  const connecting = ref(false)
  const reposLoading = ref(false)

  const scopes = reactive([...GIT_SCOPES])
  const scope = ref(scopes[0].value)

  let connectTimer = null
  let reposTimer = null
  let linkedCount = 0

  // The rows are "fetched" on connect and on every account change: the chrome appears at
  // once, the rows a beat later behind Skeletons, so the reveal never pops in blank and
  // never jumps.
  const loadRepos = () => {
    reposLoading.value = true
    if (reposTimer) clearTimeout(reposTimer)
    reposTimer = setTimeout(() => {
      reposLoading.value = false
    }, loadMs)
  }

  const connect = () => {
    if (connecting.value) return
    connecting.value = true
    connectTimer = setTimeout(() => {
      connecting.value = false
      connected.value = true
      loadRepos()
    }, connectMs)
  }

  // Choosing an account switches to it and reloads; choosing the sentinel LINKS a new one
  // and lands inside it, because "add an account" is only ever pressed by somebody who
  // wants to work in the account they are adding.
  const selectScope = (value) => {
    if (value !== ADD_ACCOUNT) {
      if (value === scope.value) return
      scope.value = value
      loadRepos()
      return
    }
    linkedCount += 1
    const account = `github-account-${linkedCount}`
    scopes.push({ label: account, value: account })
    scope.value = account
    loadRepos()
  }

  onBeforeUnmount(() => {
    if (connectTimer) clearTimeout(connectTimer)
    if (reposTimer) clearTimeout(reposTimer)
  })

  return { connected, connecting, reposLoading, scopes, scope, connect, selectScope, loadRepos }
}

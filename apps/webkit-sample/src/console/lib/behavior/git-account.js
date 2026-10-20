import { onBeforeUnmount, reactive, ref } from 'vue'

import { GIT_SCOPES } from '../data/git-repositories'

export const ADD_ACCOUNT = '__add-account__'

export function useGitAccount({ connectMs = 1200, loadMs = 900 } = {}) {
  const connected = ref(false)
  const connecting = ref(false)
  const reposLoading = ref(false)

  const scopes = reactive([...GIT_SCOPES])
  const scope = ref(scopes[0].value)

  let connectTimer = null
  let reposTimer = null
  let linkedCount = 0

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

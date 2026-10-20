import { ref } from 'vue'

export const RECENT_SCOPES = ['organization', 'account', 'workspace']

const emptyTrail = () => ({ organization: [], account: [], workspace: [] })

const trail = ref(emptyTrail())

export function rememberRecent(scope, id) {
  if (!RECENT_SCOPES.includes(scope)) return
  if (id === undefined || id === null) return
  const visited = trail.value[scope] ?? []
  trail.value = { ...trail.value, [scope]: [id, ...visited.filter((entry) => entry !== id)] }
}

export function orderByRecents(scope, items, currentId) {
  const visited = trail.value[scope] ?? []
  if (!visited.length && (currentId === undefined || currentId === null)) return items

  const rankOf = (item) => {
    if (item?.id === currentId) return -1
    const index = visited.indexOf(item?.id)
    return index === -1 ? visited.length : index
  }

  return [...items].sort((a, b) => rankOf(a) - rankOf(b))
}

export function forgetRecents() {
  trail.value = emptyTrail()
}

export function useRecents() {
  return { trail, rememberRecent, orderByRecents, forgetRecents }
}

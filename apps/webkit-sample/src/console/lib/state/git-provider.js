import { computed, ref } from 'vue'

export const GIT_PROVIDER = { id: 'github', label: 'GitHub', icon: 'pi pi-github' }

const HANDSHAKE_MS = 1500

const linked = ref([])

const connecting = ref(false)
let handshake = null

const FIRST_CONNECT_SCOPES = ['gab-az', 'aziontech', 'azion-templates']

let extraCount = 0

const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

export const gitAccounts = computed(() =>
  linked.value.map((name) => ({ label: name, value: name }))
)

export const gitConnected = computed(() => linked.value.length > 0)

export const gitConnecting = computed(() => connecting.value)

export function connectGitProvider() {
  if (handshake) return handshake
  connecting.value = true
  handshake = wait(HANDSHAKE_MS).then(() => {
    connecting.value = false
    handshake = null
    if (!linked.value.length) {
      linked.value = [...FIRST_CONNECT_SCOPES]
      return linked.value[0]
    }
    extraCount += 1
    const account = `github-account-${extraCount}`
    linked.value = [...linked.value, account]
    return account
  })
  return handshake
}

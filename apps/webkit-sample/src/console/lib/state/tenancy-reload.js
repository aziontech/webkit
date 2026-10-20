import { computed, ref, watch } from 'vue'

import { useAccounts } from './accounts'
import { useOrganizations } from './organizations'
import { useWorkspaces } from './workspaces'

const RELOAD_MS = 900

const LIST_OF_DETAIL = {
  'application-detail': '/applications',
  'workload-detail': '/workloads',
  'deployment-detail': '/deployments',
  'edge-dns-zone-detail': '/edge-dns',
  'bucket-browser': '/object-storage',
  'sql-database-detail': '/sql-database'
}

const reloading = ref(false)
const tenancyReloading = computed(() => reloading.value)
let timer

export function useTenancyReload() {
  return { tenancyReloading }
}

export function installTenancyReload(router) {
  const { currentAccountId } = useAccounts()
  const { currentOrganizationId } = useOrganizations()
  const { currentWorkspace } = useWorkspaces()

  watch([currentOrganizationId, currentAccountId, () => currentWorkspace.value?.id], () => {
    reloading.value = true
    clearTimeout(timer)
    timer = setTimeout(() => {
      reloading.value = false
    }, RELOAD_MS)

    const route = router.currentRoute.value
    const list = LIST_OF_DETAIL[route.name]
    if (!list) return

    const email = route.query.email
    router.replace({ path: list, query: email ? { email } : {} })
  })
}

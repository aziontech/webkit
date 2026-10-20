import { computed, ref } from 'vue'

import { useAccounts } from './accounts.js'
import { useOrganizations } from './organizations.js'
import { useSampleMode } from './sample-mode.js'

const { accountEmpty } = useSampleMode()

const seedWorkspaces = {
  6: [
    { id: 'magalu-ecommerce', name: 'Ecommerce', workloads: 24 },
    { id: 'magalu-marketplace', name: 'Marketplace', workloads: 11 },
    { id: 'magalu-retail-media', name: 'Retail Media', workloads: 6 }
  ],
  33024: [
    { id: 'mm-storefront', name: 'Storefront', workloads: 9 },
    { id: 'mm-checkout', name: 'Checkout', workloads: 4 }
  ],
  29025: [
    { id: 'tray-platform', name: 'Platform', workloads: 14 },
    { id: 'tray-partners', name: 'Partners', workloads: 3 }
  ],
  5791: [
    { id: 'lwsa-hosting', name: 'Hosting', workloads: 31 },
    { id: 'lwsa-email', name: 'Email', workloads: 7 }
  ],
  31204: [
    { id: 'ifood-consumer', name: 'Consumer App', workloads: 18 },
    { id: 'ifood-merchant', name: 'Merchant Portal', workloads: 12 },
    { id: 'ifood-logistics', name: 'Logistics', workloads: 8 }
  ],
  28836: [
    { id: 'caixa-banking', name: 'Internet Banking', workloads: 22 },
    { id: 'caixa-public', name: 'Public Portal', workloads: 5 }
  ]
}

const DEFAULT_WORKSPACE = { id: 'default', name: 'Default', workloads: 0 }

const selectedWorkspaceId = ref(null)

export function useWorkspaces() {
  const { currentAccount } = useAccounts()
  const { currentOrganization } = useOrganizations()

  const workspaces = computed(() => {
    if (accountEmpty.value) return [DEFAULT_WORKSPACE]
    const owned = currentOrganization.value?.workspaces
    if (owned?.length) return owned
    return seedWorkspaces[currentAccount.value?.id] ?? [DEFAULT_WORKSPACE]
  })

  const currentWorkspace = computed(
    () =>
      workspaces.value.find((workspace) => workspace.id === selectedWorkspaceId.value) ??
      workspaces.value[0]
  )

  const switchWorkspace = (workspace) => {
    const changed = workspace.id !== currentWorkspace.value?.id
    selectedWorkspaceId.value = workspace.id
    return changed
  }

  return { workspaces, currentWorkspace, switchWorkspace }
}

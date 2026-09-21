import { createdRowsFor } from '../state/created-resources'
import { CONNECTORS } from './connectors'
import { allCustomPages } from './custom-pages'
import { existingFirewallOptions } from './firewalls'

const allConnectors = () => [...createdRowsFor('connectors'), ...CONNECTORS]

const RECENT_LIMIT = 5

export const TOPOLOGY_BIND_TARGETS = {
  firewall: {
    key: 'firewall',
    kind: 'Firewall',
    icon: 'ai ai-edge-firewall',
    module: 'firewall',
    bindLabel: 'Bind Firewall',
    changeLabel: 'Change Firewall',
    removeLabel: 'Remove Firewall',
    groupLabel: 'Firewalls',
    createLabel: 'Create Firewall',
    unboundMessage: 'Requests reach the application without inspection.',
    emptyLabel: 'No firewalls yet.',
    options: () =>
      existingFirewallOptions()
        .slice(0, RECENT_LIMIT)
        .map((option) => ({ value: option.id, label: option.label }))
  },
  customPage: {
    key: 'customPage',
    kind: 'Custom Page',
    icon: 'ai ai-custom-pages',
    module: 'custom-pages',
    bindLabel: 'Bind Custom Page',
    changeLabel: 'Change Custom Page',
    removeLabel: 'Remove Custom Page',
    groupLabel: 'Custom Pages',
    createLabel: 'Create Custom Page',
    unboundMessage: "Errors answer with Azion's default page.",
    emptyLabel: 'No custom pages yet.',
    options: () =>
      allCustomPages()
        .slice(0, RECENT_LIMIT)
        .map((page) => ({ value: page.id, label: page.name }))
  },
  connector: {
    key: 'connector',
    kind: 'Connector',
    icon: 'ai ai-edge-connectors',
    module: 'connectors',
    bindLabel: 'Bind Connector',
    changeLabel: 'Change Connector',
    removeLabel: 'Remove Connector',
    groupLabel: 'Connectors',
    createLabel: 'Create Connector',
    unboundMessage: 'A connector routes traffic from the application to its origins.',
    // Shown on a connector the CREATE provisioned, where the remove control is absent:
    // that connector IS the application's origin, so the flow that made this workload
    // chose it and the application cannot be left without one.
    keptMessage: 'Provisioned with this workload. It is the application’s origin, so it can be re-pointed but not removed.',
    emptyLabel: 'No connectors yet.',
    options: () =>
      allConnectors()
        .slice(0, RECENT_LIMIT)
        .map((connector) => ({ value: connector.id, label: connector.name }))
  }
}

export const BIND_TARGET_ORDER = ['firewall', 'customPage', 'connector']

export const bindTargetFor = (key) => TOPOLOGY_BIND_TARGETS[key] ?? null

export const bindTargetOptions = (key) => bindTargetFor(key)?.options() ?? []

export const stagedMessage = (key) => {
  const target = bindTargetFor(key)
  return target ? `Deploy to apply this ${target.kind}.` : ''
}

export const removalMessage = (key) => {
  const target = bindTargetFor(key)
  return target ? `Deploy to remove this ${target.kind}.` : ''
}

export const unboundMessage = (key) => bindTargetFor(key)?.unboundMessage ?? ''

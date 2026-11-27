import type { CreateDrawerDeploymentPolicy } from '../create-drawer.vue'

export type RobotsPolicy = 'preserve_origin' | 'index' | 'noindex'
export type BranchMode = 'branch_is' | 'branch_starts_with' | 'branch_ends_with'

export const DEPLOYMENT_POLICIES: {
  value: CreateDrawerDeploymentPolicy
  label: string
  description: string
}[] = [
  {
    value: 'single_version',
    label: 'Single',
    description: 'One version serves the environment. Deploying replaces what is live.'
  },
  {
    value: 'versioned_urls',
    label: 'Versioned',
    description: 'Each version keeps its own URL, so several are reachable at once.'
  }
]
export const ROBOTS_POLICIES: { value: RobotsPolicy; label: string; description: string }[] = [
  {
    value: 'preserve_origin',
    label: 'Preserve origin',
    description: 'Serves the robots.txt the resource returns.'
  },
  {
    value: 'index',
    label: 'Index',
    description:
      'The edge answers with a robots.txt that allows indexing. The origin is not reached.'
  },
  {
    value: 'noindex',
    label: 'No index',
    description:
      'The edge answers with a robots.txt that blocks indexing. The origin is not reached.'
  }
]
export const BRANCH_MODES: { value: BranchMode; label: string }[] = [
  { value: 'branch_is', label: 'Branch is' },
  { value: 'branch_starts_with', label: 'Branch starts with' },
  { value: 'branch_ends_with', label: 'Branch ends with' }
]

const isOctet = (octet: string) =>
  /^\d{1,3}$/.test(octet) && Number(octet) <= 255 && (octet === '0' || !octet.startsWith('0'))
export const isIpOrCidr = (entry: string) => {
  const [address, prefix, ...rest] = entry.split('/')
  if (rest.length) return false
  const octets = address.split('.')
  if (octets.length !== 4 || !octets.every(isOctet)) return false
  return prefix === undefined || (/^\d{1,2}$/.test(prefix) && Number(prefix) <= 32)
}

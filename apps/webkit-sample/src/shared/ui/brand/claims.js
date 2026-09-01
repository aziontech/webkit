// The infrastructure claims the Network argument is made of — one list, read by
// every surface that makes it: the site's Network band (AzionHome), and the
// signed-out NetworkPanel that used to sit beside the auth forms (now archived at
// console/components/auth/archive/NetworkPanel.vue).
//
// It lives here rather than inline in the page because the two surfaces argue the
// same thing to the same person minutes apart. A number that is right in one place
// and stale in the other is worse than no number, and a list copied into two files
// is a list that will disagree.
export const NETWORK_CLAIMS = [
  '100+ data centers',
  '100+ Tbps throughput',
  'High availability',
  '30 ms median latency',
  'PCI and SOC 2/3 compliant'
]

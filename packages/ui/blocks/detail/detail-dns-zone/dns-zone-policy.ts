export const DNS_ZONE_POLICY_TYPES = [
  { value: 'simple', label: 'Simple' },
  { value: 'weighted', label: 'Weighted' }
]

export const dnsZonePolicyLabel = (value: string) =>
  DNS_ZONE_POLICY_TYPES.find((policy) => policy.value === value)?.label ?? ''

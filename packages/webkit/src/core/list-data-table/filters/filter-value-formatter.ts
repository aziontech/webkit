const STATUS_MAP = {
  true: 'Active',
  false: 'Inactive'
}

const INFRASTRUCTURE_MAP = {
  1: 'Production',
  2: 'Staging'
}

const CERTIFICATE_TYPE_MAP = {
  edge_certificate: 'TLS Certificate',
  trusted_ca_certificate: 'Trusted CA Certificate'
}

export const formatFilterValue = (filterKey: string, value: unknown): string | number | boolean => {
  const normalizedKey = filterKey.toLowerCase()

  switch (normalizedKey) {
    case 'active':
    case 'status':
      return STATUS_MAP[value as keyof typeof STATUS_MAP] || (value as string | number | boolean)

    case 'infrastructure':
      return (
        INFRASTRUCTURE_MAP[value as keyof typeof INFRASTRUCTURE_MAP] ||
        (value as string | number | boolean)
      )

    case 'last_editor':
      return value as string | number | boolean

    case 'type':
      return (
        CERTIFICATE_TYPE_MAP[value as keyof typeof CERTIFICATE_TYPE_MAP] ||
        (value as string | number | boolean)
      )

    default:
      return value as string | number | boolean
  }
}

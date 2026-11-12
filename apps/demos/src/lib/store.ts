import { ref } from 'vue'

export type Resource = {
  id: string
  name: string
  domain: string
  domains: string[]
  domainCount: number
  status: 'Live' | 'Inactive'
  owner: string
  modifiedAt: Date
  lastModified: string
  dnssec: boolean
}

export const OWNERS = [
  'Ana Souza',
  'Bruno Lima',
  'Carla Mendes',
  'Diego Rocha',
  'Elisa Prado',
  'Felipe Nunes'
]

const REFERENCE = Date.UTC(2026, 10, 10, 12)
const AGES = ['just now', '3 weeks ago', '1 month ago', '2 months ago', '3 months ago']

function seed(n: number): Resource {
  const name = `resource-${String(n).padStart(2, '0')}`
  const domain = `${name}.example.com`
  const aliases = Array.from({ length: n * 3 }, (_, j) => `${name}-alias-${j + 1}.example.com`)
  return {
    id: String(1020482 + n * 173),
    name,
    domain,
    domains: [domain, ...aliases],
    domainCount: aliases.length,
    status: n === 7 ? 'Inactive' : 'Live',
    owner: OWNERS[n % OWNERS.length],
    modifiedAt: new Date(REFERENCE - n * 18 * 86_400_000),
    lastModified: AGES[Math.min(n - 1, AGES.length - 1)],
    dnssec: n % 2 === 0
  }
}

export const resources = ref<Resource[]>(Array.from({ length: 8 }, (_, i) => seed(i + 1)))

let nextId = 1030000

export function findResource(id: unknown): Resource | undefined {
  return resources.value.find((item) => item.id === String(id))
}

export function createResource(input: { name: string; domain: string; dnssec: boolean }) {
  nextId += 1
  const resource: Resource = {
    id: String(nextId),
    name: input.name,
    domain: input.domain,
    domains: [input.domain],
    domainCount: 0,
    status: 'Live',
    owner: OWNERS[0],
    modifiedAt: new Date(REFERENCE),
    lastModified: 'just now',
    dnssec: input.dnssec
  }
  resources.value = [resource, ...resources.value]
  return resource
}

export function updateResource(id: string, patch: Partial<Resource>) {
  resources.value = resources.value.map((item) =>
    item.id === id ? { ...item, ...patch, lastModified: 'just now' } : item
  )
}

export function deleteResource(id: string) {
  resources.value = resources.value.filter((item) => item.id !== id)
}

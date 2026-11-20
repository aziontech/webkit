import type { TableViewResource, TableViewResourceStatus } from './table-view.vue'

const referenceTime = Date.UTC(2026, 10, 10, 12)
const daysAgo = (days: number) => new Date(referenceTime - days * 86_400_000)

const resource = (
  n: number,
  owner: string,
  days: number,
  status: TableViewResourceStatus = 'Live'
): TableViewResource => {
  const name = `resource-${String(n).padStart(2, '0')}`
  const domain = `${name}.example.com`
  return {
    id: `10${20482 + n * 173}`,
    name,
    domain,
    domains: [
      domain,
      ...Array.from({ length: n * 7 }, (_, j) => `${name}-alias-${j + 1}.example.com`)
    ],
    status,
    owner,
    modifiedAt: daysAgo(days)
  }
}

export const sampleResources: TableViewResource[] = [
  resource(1, 'Ethan Brooks', 0),
  resource(2, 'Jordan Kim', 18),
  resource(3, 'Taylor Reed', 36),
  resource(4, 'John Smith', 54),
  resource(5, 'Sam Lee', 72),
  resource(6, 'Priya Patel', 90),
  resource(7, 'Chris Taylor', 108),
  resource(8, 'Riley Carter', 126),
  resource(9, 'Ethan Brooks', 144, 'Inactive'),
  resource(10, 'Jordan Kim', 162)
]

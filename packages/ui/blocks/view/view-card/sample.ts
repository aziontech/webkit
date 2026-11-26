import type { CardViewApplication, CardViewApplicationStatus } from './view-card.vue'

const app = (
  n: number,
  name: string,
  status: CardViewApplicationStatus,
  domain: string,
  region: string,
  requests: number,
  owner: string
): CardViewApplication => ({
  id: `app-${String(n).padStart(2, '0')}`,
  name,
  status,
  domain,
  region,
  requests,
  owner
})

export const sampleApplications: CardViewApplication[] = [
  app(1, 'storefront', 'Active', 'shop.example.com', 'sa-east', 1240000, 'Ethan Brooks'),
  app(2, 'checkout', 'Active', 'pay.example.com', 'us-east', 310000, 'Jordan Kim'),
  app(3, 'blog', 'Inactive', 'blog.example.com', 'eu-west', 0, 'Riley Carter'),
  app(4, 'docs', 'Active', 'docs.example.com', 'sa-east', 88000, 'Priya Patel'),
  app(5, 'status-page', 'Active', 'status.example.com', 'us-east', 42000, 'Chris Taylor'),
  app(6, 'image-resizer', 'Active', 'img.example.com', 'eu-west', 2900000, 'John Smith'),
  app(7, 'auth-gateway', 'Degraded', 'auth.example.com', 'sa-east', 520000, 'Sam Lee'),
  app(8, 'landing', 'Inactive', 'www.example.com', 'us-east', 0, 'Taylor Reed'),
  app(9, 'api', 'Active', 'api.example.com', 'eu-west', 4100000, 'Ethan Brooks'),
  app(10, 'search', 'Active', 'search.example.com', 'sa-east', 760000, 'Jordan Kim'),
  app(11, 'webhooks', 'Degraded', 'hooks.example.com', 'us-east', 12000, 'Riley Carter'),
  app(12, 'reports', 'Active', 'reports.example.com', 'eu-west', 9000, 'Priya Patel'),
  app(13, 'media', 'Active', 'media.example.com', 'sa-east', 1800000, 'Chris Taylor'),
  app(14, 'admin', 'Inactive', 'admin.example.com', 'us-east', 300, 'John Smith')
]

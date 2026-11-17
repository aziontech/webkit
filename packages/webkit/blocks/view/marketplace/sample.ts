import type { MarketplaceContext, MarketplaceIntegration } from './marketplace.vue'

export const sampleApplications: string[] = ['storefront', 'checkout', 'docs', 'api']

const integration = (
  id: string,
  name: string,
  vendor: string,
  logo: string,
  category: string,
  context: MarketplaceContext,
  description: string,
  extra: Partial<MarketplaceIntegration> = {}
): MarketplaceIntegration => ({
  id,
  name,
  vendor,
  logo,
  category,
  context,
  description,
  version: '1.4.0',
  updated: 'Oct 30, 2026',
  featured: false,
  installedOn: [],
  ...extra
})

export const sampleIntegrations: MarketplaceIntegration[] = [
  integration(
    'request-signer',
    'Request Signer',
    'Acme',
    'az az-key',
    'Access control',
    'firewall',
    'Sign every request with a rotating key, so the origin only answers traffic that passed through.',
    { featured: true }
  ),
  integration(
    'waiting-room',
    'Waiting Room',
    'Acme',
    'az az-hourglass',
    'Traffic management',
    'application',
    'Queue visitors during a traffic surge and let them in as capacity frees up.',
    { featured: true, installedOn: ['storefront'] }
  ),
  integration(
    'bot-score',
    'Bot Score',
    'Acme',
    'az az-shield',
    'Bot management',
    'firewall',
    'Score each request on known bot behaviour and block the ones above your threshold.',
    { featured: true }
  ),
  integration(
    'split-traffic',
    'Split Traffic',
    'Azion',
    'az az-sitemap',
    'Testing',
    'application',
    'Send a share of visitors to a second version of a page and keep each one on theirs.'
  ),
  integration(
    'geo-content',
    'Geo Content',
    'Azion',
    'az az-globe',
    'Personalization',
    'application',
    'Serve a regional version of a page from the visitor’s country, with a fallback.'
  ),
  integration(
    'signed-urls',
    'Signed URLs',
    'Azion',
    'az az-link',
    'Access control',
    'firewall',
    'Issue links that expire, so protected files can only be fetched for a limited time.',
    { installedOn: ['docs', 'api'] }
  ),
  integration(
    'rate-guard',
    'Rate Guard',
    'Acme',
    'az az-sliders-horizontal',
    'Access control',
    'firewall',
    'Limit how many requests one client can make in a window, per path or per key.'
  ),
  integration(
    'payload-limit',
    'Payload Limit',
    'Azion',
    'az az-box',
    'Traffic management',
    'firewall',
    'Refuse request bodies above a size you set, before they reach the origin.'
  ),
  integration(
    'request-id',
    'Request ID',
    'Azion',
    'az az-hash',
    'Observability',
    'application',
    'Add a unique identifier header to every request, to trace it across services.'
  ),
  integration(
    'phone-check',
    'Phone Check',
    'Acme',
    'az az-phone',
    'Fraud prevention',
    'firewall',
    'Validate phone numbers on sign-up forms and flag numbers linked to fraud.'
  ),
  integration(
    'queue-writer',
    'Queue Writer',
    'Azion',
    'az az-inbox',
    'Messaging',
    'application',
    'Write each request to a queue for processing later, and answer the client right away.'
  ),
  integration(
    'schedule-block',
    'Scheduled Block',
    'Azion',
    'az az-calendar-x',
    'Access control',
    'firewall',
    'Close an application to traffic on a schedule, such as outside business hours.'
  )
]

import { daysAgo, formatListDate } from '@shared/lib/dates'
import { authorAt, emailOf } from '@shared/lib/people'

export const APPLICATIONS = [
  {
    id: '1784552864',
    name: 'webkit-sample-vue',
    preset: 'vue',
    source: 'git',
    repository: 'gab-az/webkit-sample-vue',
    branch: 'main',
    domainName: 'e7b4verynr.azion.run',
    modifiedAt: daysAgo(2)
  },
  {
    id: '2041778390',
    name: 'hello-edge',
    preset: 'javascript',
    source: 'platform',
    repository: '',
    branch: '',
    domainName: 'h3l1oedge42.azion.run',
    modifiedAt: daysAgo(1)
  },
  {
    id: '3344556677',
    name: 'edgeflow-site',
    preset: 'html',
    source: 'git',
    repository: 'edgeflow/edgeflow-site',
    branch: 'main',
    domainName: 'w2e3r4t5y6.azion.run',
    customDomains: [
      {
        id: 'domain-edgeflow-www',
        domain: 'www.edgeflow.com',
        environment: 'Production',
        certificate: 'cert-8801'
      },
      { id: 'domain-edgeflow-apex', domain: 'edgeflow.com', environment: 'Stage', certificate: '' }
    ],
    modifiedAt: daysAgo(4)
  },
  {
    id: '8899001122',
    name: 'edgeflow-docs',
    preset: 'html',
    source: 'drop',
    repository: '',
    branch: '',
    domainName: 'u7i8o9p0a1.azion.run',
    customDomains: [
      {
        id: 'domain-edgeflow-docs',
        domain: 'docs.edgeflow.com',
        environment: 'Production',
        certificate: 'cert-8801'
      }
    ],
    modifiedAt: daysAgo(6)
  },
  {
    id: '7658392017',
    name: 'analytics-pro',
    preset: 'next',
    source: 'git',
    repository: 'acme/analytics-pro',
    branch: 'main',
    domainName: 'q7w8e9r0t1.azion.run',
    modifiedAt: daysAgo(320)
  },
  {
    id: '5120983746',
    name: 'analytics-edge',
    preset: 'next',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'z1x2c3v4b5.azion.run',
    modifiedAt: daysAgo(17)
  },
  {
    id: '9823746510',
    name: 'react-dashboard',
    preset: 'react',
    source: 'git',
    repository: 'acme/react-dashboard',
    branch: 'main',
    domainName: 'd9m8j2k4l5.azion.run',
    modifiedAt: daysAgo(375)
  },
  {
    id: '9900112233',
    name: 'legacy-api',
    preset: 'react',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'g6h7j8k9l0.azion.run',
    active: false,
    modifiedAt: daysAgo(5)
  },
  {
    id: '6677889900',
    name: 'docs-portal',
    preset: 'vue',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'p9o8i7u6y5.azion.run',
    modifiedAt: daysAgo(47)
  },
  {
    id: '4532109876',
    name: 'ecommerce-v2',
    preset: 'nuxt',
    source: 'git',
    repository: 'shopco/ecommerce-v2',
    branch: 'develop',
    domainName: 'y6u7i8o9p0.azion.run',
    customDomains: [
      {
        id: 'domain-shopco-shop',
        domain: 'shop.shopco.com',
        environment: 'Production',
        certificate: ''
      }
    ],
    modifiedAt: daysAgo(250)
  },
  {
    id: '6284013975',
    name: 'ecommerce-storefront',
    preset: 'nuxt',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'n4m5b6v7c8.azion.run',
    modifiedAt: daysAgo(33)
  },
  {
    id: '9988776655',
    name: 'marketing-site',
    preset: 'astro',
    source: 'git',
    repository: 'acme/marketing-site',
    branch: 'main',
    domainName: 'z9x8c7v6b5.azion.run',
    modifiedAt: daysAgo(141)
  },
  {
    id: '5566778899',
    name: 'blog-platform',
    preset: 'astro',
    source: 'drop',
    repository: '',
    branch: '',
    domainName: 'k1l2m3n4o5.azion.run',
    modifiedAt: daysAgo(63)
  },
  {
    id: '7788990011',
    name: 'status-page',
    preset: 'svelte',
    source: 'git',
    repository: 'acme/status-page',
    branch: 'main',
    domainName: 'm4n5b6v7c8.azion.run',
    modifiedAt: daysAgo(21)
  },
  {
    id: '1122334455',
    name: 'mobile-app',
    preset: 'svelte',
    source: 'cli',
    repository: '',
    branch: '',
    domainName: 'a1s2d3f4g5.azion.run',
    modifiedAt: daysAgo(190)
  }
].map((app, index) => {
  const person = authorAt(index)
  return {
    ...app,
    author: person.name,
    authorEmail: emailOf(person.name),
    authorAvatar: person.avatar,
    lastModified: formatListDate(app.modifiedAt)
  }
})

export const applicationById = (id) => APPLICATIONS.find((app) => app.id === String(id))

export const applicationIdByName = (name) => APPLICATIONS.find((app) => app.name === name)?.id ?? ''

export const applicationAt = (index) => APPLICATIONS[index % APPLICATIONS.length]

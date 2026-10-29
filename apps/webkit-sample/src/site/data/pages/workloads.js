import { markRaw } from 'vue'

import DiagramSet from '../../ui/diagram/DiagramSet.vue'
import { productWidget } from '../../ui/product-widget'
import {
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_DOCS_ACTIONS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const WorkloadDeployFragment = productWidget('workload-deploy')
const WorkloadDomainFragment = productWidget('workload-domain')
const WorkloadRolloutRowsWidget = productWidget('workload-rollout-rows')
const WorkloadTopologyFlowWidget = productWidget('workload-topology-flow')

const PILLARS = [
  {
    icon: 'ai ai-edge-nodes',
    title: 'Close to your users, by default',
    description:
      'One create puts the workload in every Azion data center. There is no region to pick, no replica to add, and no traffic manager to keep in step.'
  },
  {
    icon: 'ai ai-edge-functions',
    title: 'No cold starts, no capacity to buy',
    description:
      'Azion Runtime starts an isolate per request, so nothing is pre-warmed and a launch day scales the same way an ordinary Tuesday does.'
  },
  {
    icon: 'ai ai-certificate-manager',
    title: 'Certificates that renew themselves',
    description:
      'The workload domain ships with TLS on, and a custom domain gets a Let’s Encrypt certificate issued and renewed for you.'
  }
]

const USE_CASES = [
  {
    icon: 'ai ai-edge-application',
    title: 'Serve a web application',
    description:
      'Point a domain at an application and let every data center answer it. Static assets, server-rendered pages and API routes all come from the same workload.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-origin-shield',
    title: 'Front an origin you already have',
    description:
      'Keep the infrastructure you run today. The workload terminates TLS, applies the rules, caches what it can, and forwards only what it has to.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-git-branch',
    title: 'Split traffic across environments',
    description:
      'Give staging its own hostname on the same application, or point a second workload at a new deployment and move traffic to it when you are ready.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'ai ai-edge-firewall',
    title: 'Protect what you expose',
    description:
      'Bind a firewall to the workload and every request that reaches the hostname passes WAF, rate limiting and network lists before anything else runs.',
    href: '/site/docs/firewall'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is a workload?',
    answer:
      'A workload is the entry point of an application on Azion: the domains, the certificate, the protocols and a deployment that names the application — and optionally the firewall — that answer its traffic. Create one and it is served from every Azion data center.'
  },
  {
    value: 'domains',
    question: 'How do custom domains work?',
    answer:
      'Every workload gets its own azionedge.net domain the moment it is created, and production workloads can claim an azion.app hostname. To use your own domain, add it to the workload and point a CNAME at the workload domain. A workload holds up to 50 domains.'
  },
  {
    value: 'certificates',
    question: 'How are TLS certificates handled?',
    answer:
      'The workload domain is covered by an Azion certificate out of the box. For custom domains, Azion issues and renews a Let’s Encrypt certificate automatically, or you bring your own through Certificate Manager. The minimum TLS version is configurable up to 1.3.'
  },
  {
    value: 'mtls',
    question: 'Does it support mutual TLS?',
    answer:
      'Yes. A workload can require client certificates verified against a Trusted CA, in enforce mode, which refuses requests without a valid certificate, or permissive mode, which lets the application decide. mTLS applies to HTTPS traffic.'
  },
  {
    value: 'staging',
    question: 'Can I test before going to production?',
    answer:
      'A workload targets the production infrastructure or the staging one. Staging serves a preview domain with limited propagation, so you can exercise the real runtime and the real rules before the change reaches users. The CLI also runs the same runtime locally with azion dev.'
  },
  {
    value: 'rollout',
    question: 'How do rollouts and rollbacks work?',
    answer:
      'A deployment binds the workload to an application. Promote a new deployment to every data center at once, or move a share of traffic to it and watch the metrics first. If errors rise, roll back to the deployment that was serving before.'
  },
  {
    value: 'firewall',
    question: 'Where does security attach?',
    answer:
      'On the workload. A deployment can name a firewall alongside the application, so WAF rules, rate limiting and network lists run on every request to the hostname before any application logic does.'
  },
  {
    value: 'limits',
    question: 'How many workloads can I have?',
    answer:
      'Standard plans hold up to 100 workloads per account, and Mission-Critical raises that to 1,000. Each workload serves up to 50 domains over HTTP/1.1, HTTP/2 and HTTP/3.'
  }
]

const ARCHITECTURE_DIAGRAMS = [
  {
    value: 'request-path',
    name: 'workloads',
    ariaLabel:
      'A user request is routed to the nearest data center and reaches the workload; a cache hit is served from cache close to the user and a miss goes to the origin'
  },
  { value: 'isolates', name: 'workloads-isolate-per-request' },
  { value: 'rollout', name: 'workloads-gradual-rollout' },
  { value: 'security', name: 'workloads-security' }
]

const ARCHITECTURE_TABS = [
  {
    value: 'request-path',
    title: 'Request path',
    description:
      'Routing sends each request to the nearest data center, where the workload answers it.'
  },
  {
    value: 'isolates',
    title: 'Isolate per request',
    description:
      'Every request gets its own isolate, so nothing is pre-warmed and nothing is reserved.'
  },
  {
    value: 'rollout',
    title: 'Gradual rollout',
    description:
      'Move a share of traffic to a new deployment, and return to the old one if errors rise.'
  },
  {
    value: 'security',
    title: 'Security on the workload',
    description: 'A bound firewall filters every request before the application runs.'
  }
]

export const WORKLOAD_ARCHITECTURE_BAND = {
  section: 'ArchitectureTabs',
  anchor: 'architecture',
  eyebrow: 'Architecture',
  title: 'How a workload answers a request',
  description:
    'Routing sends each request to the nearest data center, where Azion Runtime starts an isolate for it.',
  position: 'bottom',
  tabs: ARCHITECTURE_TABS,
  scene: { component: markRaw(DiagramSet), props: { diagrams: ARCHITECTURE_DIAGRAMS } },
  action: { label: 'Read the architecture', href: PRODUCT_DOCS, trailing: true }
}

export const WORKLOADS_PAGE = [
  {
    section: 'Heroes',
    kind: 'copy-on-top-art',
    eyebrow: 'Workloads',
    title: 'Put your application close to users in seconds',
    description:
      'A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion data center — no servers to size, no regions to pick.',
    actions: PRODUCT_HERO_ACTIONS,
    scene: { component: WorkloadTopologyFlowWidget }
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'The parts you never assemble',
    description:
      'Every workload ships with the operational pieces an application needs, working from the first deploy.',
    actions: PRODUCT_DOCS_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-cloud-upload',
        title: 'Deploys that report themselves',
        description:
          'Build, upload and propagation run as one pipeline, and the workload shows each step as it lands in every data center.',
        scene: { component: markRaw(WorkloadDeployFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-domains',
        title: 'Domains with TLS handled',
        description:
          'Every domain answers with a certificate that is issued and renewed for you, from the generated hostname to your own.',
        scene: { component: markRaw(WorkloadDomainFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-undo',
        title: 'Versions you promote or roll back',
        description:
          'Every deployment stays on the list. Promote a preview to production, or return to the version that was serving before.',
        scene: { component: markRaw(WorkloadRolloutRowsWidget) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams run on Workloads',
    description:
      'Put a workload in front of any application and serve it from Azion’s distributed infrastructure, with the domains, certificates and deployments you set. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]

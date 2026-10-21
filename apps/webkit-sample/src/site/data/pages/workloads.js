import { CLIENT_STRIP } from '@shared/ui/brand/strips.js'
import { markRaw } from 'vue'

import DiagramSet from '../../ui/diagram/DiagramSet.vue'
import WorkloadDeployFragment from '../../ui/mockup/widgets/WorkloadDeployFragment.vue'
import WorkloadDeploymentsWidget from '../../ui/mockup/widgets/WorkloadDeploymentsWidget.vue'
import WorkloadDomainFragment from '../../ui/mockup/widgets/WorkloadDomainFragment.vue'
import WorkloadOverviewWidget from '../../ui/mockup/widgets/WorkloadOverviewWidget.vue'
import WorkloadsConsoleScene from '../../ui/mockup/WorkloadsConsoleScene.vue'
import WorkloadTopologyScene from '../../ui/WorkloadTopologyScene.vue'
import { cliBand } from '../cli-band.js'
import {
  GRADUAL_ROLLOUT,
  ISOLATE_PER_REQUEST,
  WORKLOAD_REQUEST_PATH,
  WORKLOAD_SECURITY
} from '../diagrams.js'
import {
  PRODUCT_CLOSING,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_GROUPS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const BENEFITS = [
  {
    title: 'Close to your users, by default',
    description:
      'One create puts the workload in every Azion data center. There is no region to pick, no replica to add, and no traffic manager to keep in step.'
  },
  {
    title: 'No cold starts',
    description:
      'Azion Runtime starts an isolate per request, so there is nothing to pre-warm and no first-request penalty to design around.'
  },
  {
    title: 'Scale without pre-provisioning',
    description:
      'Concurrency is not capacity you buy in advance. A launch day scales the same way an ordinary Tuesday does.'
  },
  {
    title: 'Certificates that renew themselves',
    description:
      'The workload domain ships with TLS on, and a custom domain gets a Let’s Encrypt certificate issued and renewed for you.'
  },
  {
    title: 'Roll out gradually, roll back fast',
    description:
      'Move a share of traffic to a new deployment and watch the metrics first. If errors rise, return to the deployment that was serving before.'
  },
  {
    title: 'Run it locally first',
    description:
      'The Azion CLI runs your application against the same runtime on your machine, so what you test is what the workload serves.'
  }
]

const USE_CASES = [
  {
    title: 'Serve a web application',
    description:
      'Point a domain at an application and let every data center answer it. Static assets, server-rendered pages and API routes all come from the same workload.'
  },
  {
    title: 'Front an origin you already have',
    description:
      'Keep the infrastructure you run today. The workload terminates TLS, applies the rules, caches what it can, and forwards only what it has to.'
  },
  {
    title: 'Split traffic across environments',
    description:
      'Give staging its own hostname on the same application, or point a second workload at a new deployment and move traffic to it when you are ready.'
  },
  {
    title: 'Protect what you expose',
    description:
      'Bind a firewall to the workload and every request that reaches the hostname passes WAF, rate limiting and network lists before anything else runs.'
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
    spec: WORKLOAD_REQUEST_PATH,
    ariaLabel:
      'A user request is routed to the nearest data center and reaches the workload; a cache hit is served from cache close to the user and a miss goes to the origin'
  },
  {
    value: 'isolates',
    spec: ISOLATE_PER_REQUEST,
    ariaLabel:
      'Requests reach Azion Runtime, which starts a separate isolate for each one, with no cold start'
  },
  {
    value: 'rollout',
    spec: GRADUAL_ROLLOUT,
    ariaLabel:
      'A workload splits traffic between two deployments: 10% to the new one, which is being watched, and 90% to the one that was serving'
  },
  {
    value: 'security',
    spec: WORKLOAD_SECURITY,
    ariaLabel:
      'A user request reaches the workload over TLS, passes the bound firewall, and only then reaches the application'
  }
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

export const WORKLOADS_PAGE = [
  {
    section: 'Heroes',
    kind: 'copy-on-top-art',
    eyebrow: 'Workloads',
    title: 'Put your application close to users in seconds',
    description:
      'A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion data center — no servers to size, no regions to pick.',
    actions: PRODUCT_HERO_ACTIONS,
    carouselMarks: CLIENT_STRIP,
    scene: { component: markRaw(WorkloadTopologyScene) },
    scenePlacement: 'bottom'
  },
  { section: 'CapabilityGrid', items: BENEFITS },
  {
    section: 'ConsolePanel',
    anchor: 'overview',
    eyebrow: 'Console',
    title: 'Everything a workload is, on one screen',
    description:
      'The domain and status of a workload, the topology it serves through, and the deploy flow that ships it.',
    scene: { component: markRaw(WorkloadOverviewWidget), props: { fade: 'bottom' } },
    tabs: [
      {
        value: 'overview',
        title: 'Overview'
      },
      {
        value: 'topology',
        title: 'Topology'
      },
      {
        value: 'deploy',
        title: 'Deploy flow'
      }
    ],
    crop: 0.1,
    action: { label: 'Open the console', href: '/signup' }
  },
  {
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
  },
  { section: 'CapabilityGrid', items: USE_CASES },
  {
    section: 'FeatureTabs',
    anchor: 'console',
    eyebrow: 'Console',
    title: 'Run it from the console',
    description:
      'Everything a workload is lives on one screen: the list that answers traffic, the topology behind it, and the domains it is served on.',
    tabs: [
      {
        value: 'list',
        title: 'Every workload in one list',
        description:
          'Search, filter and reach any workload, with its status and domains on the same row.'
      },
      {
        value: 'topology',
        title: 'Read the deployment topology',
        description:
          'The domains, the application and the firewall a workload serves, drawn as one chain.'
      },
      {
        value: 'domains',
        title: 'Domains and TLS, handled',
        description:
          'Add a domain, get its certificate issued and renewed, and set the TLS floor without leaving the page.'
      }
    ],
    scene: { component: markRaw(WorkloadsConsoleScene) },
    action: { label: 'Start free', href: '/signup' }
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Go fast, or slow',
        description:
          'Promote a deployment to every data center at once, or move a share of traffic to it and watch the metrics first. If errors rise, roll back to the deployment that was serving before — from the same screen that shipped it.',
        href: PRODUCT_DOCS,
        scene: { component: markRaw(WorkloadDeploymentsWidget), props: { fade: 'bottom' } },
        actions: [{ label: 'Deployment strategies', href: PRODUCT_DOCS }]
      }
    ]
  },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'The parts you never assemble',
    description:
      'Every workload ships with the operational pieces an application needs, working from the first deploy.',
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
      }
    ]
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  { ...PRODUCT_DIRECTORY, groups: PRODUCT_GROUPS },
  { section: 'FaqSection', items: FAQ },
  cliBand({
    script: 'deployWorkload',
    title: 'Deploy your first workload in two commands',
    description:
      'Link a project, deploy it, and curl the domain the CLI hands back. The first deploy creates the workload; every one after that updates it.'
  }),
  PRODUCT_CLOSING
]

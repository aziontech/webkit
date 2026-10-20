import { markRaw } from 'vue'

import WorkloadDeployFragment from '../../ui/mockup/widgets/WorkloadDeployFragment.vue'
import WorkloadDeploymentsWidget from '../../ui/mockup/widgets/WorkloadDeploymentsWidget.vue'
import WorkloadDomainFragment from '../../ui/mockup/widgets/WorkloadDomainFragment.vue'
import WorkloadOverviewWidget from '../../ui/mockup/widgets/WorkloadOverviewWidget.vue'
import WorkloadsConsoleScene from '../../ui/mockup/WorkloadsConsoleScene.vue'
import Diagram from '../../ui/diagram/Diagram.vue'
import { cliBand } from '../cli-band.js'
import { PLATFORM_REQUEST_PATH } from '../diagrams.js'
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
      'One create puts the workload in every Azion location. There is no region to pick, no replica to add, and no traffic manager to keep in step.'
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
      'Point a domain at an application and let every location answer it. Static assets, server-rendered pages and API routes all come from the same workload.'
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
      'A deployment binds the workload to an application. Promote a new deployment to every location at once, or move a share of traffic to it and watch the metrics first. If errors rise, roll back to the deployment that was serving before.'
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

export const WORKLOADS_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Workloads',
    title: 'Put your application on the edge in seconds',
    description:
      'A workload is the hostname, the certificate and the routing that make an application reachable. Create one and it is live in every Azion location — no servers to size, no regions to pick.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: BENEFITS },
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
    section: 'MediaSplitBand',
    eyebrow: 'Architecture',
    title: 'Serverless from the ground up: isolates, not containers',
    description:
      'A workload does not reserve a container per deployment. Azion Runtime runs your code in an isolate — a sandbox measured in kilobytes rather than gigabytes — so one location holds thousands of them and starts another the moment a request arrives.',
    orientation: 'vertical',
    texture: 'none',
    scene: {
      component: markRaw(Diagram),
      props: {
        spec: PLATFORM_REQUEST_PATH,
        label:
          'A user request passes routing into an Azion data center, where Firewall, Applications, Cache, Application Accelerator, Functions and Image Processor run, then Tiered Cache and Load Balancer before the origin'
      }
    },
    actions: [{ label: 'Read the architecture', href: PRODUCT_DOCS }]
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
          'Promote a deployment to every location at once, or move a share of traffic to it and watch the metrics first. If errors rise, roll back to the deployment that was serving before — from the same screen that shipped it.',
        href: PRODUCT_DOCS,
        scene: { component: markRaw(WorkloadDeploymentsWidget), props: { fade: 'bottom' } },
        actions: [{ label: 'Deployment strategies', href: PRODUCT_DOCS }]
      }
    ]
  },
  {
    section: 'WidgetGrid',
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
          'Build, upload and propagation run as one pipeline, and the workload shows each step as it lands in every location.',
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

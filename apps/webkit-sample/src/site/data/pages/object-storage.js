import { markRaw } from 'vue'

import ObjectStorageAccessFragment from '../../ui/mockup/widgets/ObjectStorageAccessFragment.vue'
import ObjectStorageBrowserFragment from '../../ui/mockup/widgets/ObjectStorageBrowserFragment.vue'
import ObjectStorageBucketsFragment from '../../ui/mockup/widgets/ObjectStorageBucketsFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-bolt',
    title: 'Fast content delivery',
    description: 'Deliver static assets to users globally with integrated caching and performance.'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Zero egress fees',
    description: 'Move data between storage and Azion Applications without additional cost.'
  },
  {
    icon: 'ai ai-edge-storage',
    title: 'Widely compatible',
    description:
      'Use standard S3-compatible tools and workflows to store and manage assets without friction.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-video',
    title: 'Deliver media from centralized storage',
    description:
      'Centralize images, videos, and downloadable assets in Object Storage. Integrate with Cache and Applications for fast delivery. Process media through Functions for optimization.',
    href: '/site/solutions/streaming'
  },
  {
    icon: 'pi pi-history',
    title: 'Automate backup and recovery',
    description:
      'Organize backups per bucket and automate upload and restore routines via API. Use multipart upload for reliable large-file transfers. Maintain recovery workflows.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-microchip-ai',
    title: 'Serve AI datasets and models',
    description:
      'Store training datasets, model weights, and inference artifacts. Access from Functions for AI workloads. Integrate with AI Inference for model serving.',
    href: '/site/solutions/ai'
  },
  {
    icon: 'pi pi-cloud',
    title: 'Build multi-cloud storage',
    description:
      'Use S3-compatible storage as part of a multi-cloud strategy. Standard API enables portability between providers. Avoid ecosystem lock-in with open protocols.',
    href: '/site/solutions/technology'
  }
]

const FAQ = [
  {
    value: 'what-to-store',
    question: 'What can I store in Object Storage?',
    answer:
      'Azion Object Storage is S3-compatible storage for unstructured data. Key features include: zero egress fees between Azion services, 99.9% availability, bucket-as-origin for static sites, multipart upload support, and native Functions integration. Store files, media, logs, datasets, and application assets with predictable costs.'
  },
  {
    value: 'vs-r2',
    question: 'How does Object Storage compare to Cloudflare R2?',
    answer:
      'Both offer S3-compatible storage with zero egress fees. Azion Object Storage integrates directly with Functions and Applications on the Azion Web Platform with 99.9% availability SLA. Cloudflare R2 offers R2 Data Catalog for SQL analytics and deeper Workers ecosystem integration. Choose Azion for simpler platform integration. Choose R2 if Data Catalog or Workers bindings are required.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate from AWS S3 or Cloudflare R2?',
    answer:
      "Create S3 credentials for your Azion bucket, then use standard S3 tools (AWS CLI, rclone, boto3) to copy objects. Point your existing applications to Azion's endpoint with the new credentials. No code changes required—Object Storage uses the same S3 API."
  },
  {
    value: 'buckets',
    question: 'How do buckets organize my data?',
    answer:
      'A bucket is a top-level container used to organize objects. Buckets can be configured as an origin for Applications, enabling static site hosting and asset delivery. Each bucket has configurable access permissions and S3 credentials.'
  },
  {
    value: 'origin',
    question: 'Can I use Object Storage as an origin for Applications?',
    answer:
      'Yes. Configure a bucket as an origin for Applications to serve static sites, HTML, CSS, JavaScript, and other assets. Choose to serve from the bucket root or a specific prefix. Integrate with Cache for performance optimization.'
  },
  {
    value: 'functions',
    question: 'Can Functions access Object Storage?',
    answer:
      'Yes. Functions can interact with Object Storage through the Storage API, enabling you to read, write, delete, and list objects programmatically. This allows data processing, validation, and transformation without egress fees within the platform.'
  },
  {
    value: 's3-operations',
    question: 'What operations are supported via S3 API?',
    answer:
      'Object Storage supports core S3 operations: create and delete buckets, list buckets and objects, upload, download, copy, and delete objects. Multipart upload is supported for large objects. Use standard S3 tools or the AWS SDK.'
  },
  {
    value: 'egress',
    question: 'Are there egress fees for Object Storage?',
    answer:
      'Zero egress fees between Azion services. Data transferred between Object Storage and Functions or Applications incurs no egress cost. This applies to all operations: serving static sites, processing data, or delivering media.'
  },
  {
    value: 'limits',
    question: 'What are the default limits for Object Storage?',
    answer:
      'Default limits include up to 100 buckets per account and a default ListObjects limit of up to 1,000 objects per request. Limits can be increased depending on your plan. Contact support for enterprise requirements.'
  },
  {
    value: 'secure-access',
    question: 'How do I secure access to my buckets?',
    answer:
      'Create S3 credentials with specific capabilities (read, write, delete) per bucket. Control who can access objects by mediating through Functions where you can enforce authentication and validation. Configure bucket-level access permissions.'
  }
]

export const OBJECT_STORAGE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Object Storage',
    title: 'S3-compatible object storage for global workloads',
    description:
      'Store and deliver static assets globally with S3-compatible APIs, integrated directly with your application stack.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every bucket in one console',
    description:
      'Buckets, the access workloads have to them and the objects they hold live in the same workspace as the applications that serve them.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Store application data at scale',
        description:
          'Store user uploads, datasets, logs, and unstructured data in buckets using the S3-compatible API. Scale storage on demand while keeping object access fast.',
        scene: { component: markRaw(ObjectStorageBucketsFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-application',
        title: 'From storage to full application delivery',
        description:
          'Object Storage integrates with Cache, Functions, and Applications for complete content delivery workflows. Set the access your workloads get to each bucket when you create it.',
        scene: { component: markRaw(ObjectStorageAccessFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-globe',
        title: 'Host static sites from buckets',
        description:
          'Host JAMstack sites, SPAs, and static assets in a bucket and serve through Applications with high availability. Configure bucket as origin and deliver via Cache for performance.',
        scene: { component: markRaw(ObjectStorageBrowserFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Connect Object Storage to your stack',
        description:
          'Manage Object Storage through Azion Console, CLI, or S3-compatible API. Use standard tools like AWS CLI, rclone, and Terraform for seamless integration.',
        href: PRODUCT_DOCS,
        illustration: 'infrastructure-as-code',
        illustrationLabel:
          'An Azion provider declared in Terraform, raising the resources beside it',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Migrate from S3 without rewriting code',
        description:
          'Move objects from AWS S3, Cloudflare R2, or any S3-compatible provider without code changes. Object Storage exposes a standard S3 API, so your current clients, scripts, and SDKs work immediately.',
        href: '/signup',
        illustration: 'global-network',
        illustrationLabel: 'Traffic routed across a global network of locations',
        actions: [{ label: 'Start Free', href: '/signup' }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use Object Storage for',
    description:
      'Put Object Storage behind any application and serve files, media and datasets from Azion’s distributed infrastructure, with zero egress between Azion services. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('herospark') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]

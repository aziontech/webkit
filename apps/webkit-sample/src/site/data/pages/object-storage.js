import { markRaw } from 'vue'

import { productWidget } from '../../ui/product-widget'
import {
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_DOCS_ACTIONS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const ObjectStorageAccessFragment = productWidget('object-storage-access')
const ObjectStorageBrowserFragment = productWidget('object-storage-browser')
const ObjectStorageBucketsFragment = productWidget('object-storage-buckets')

const PILLARS = [
  {
    icon: 'pi pi-bolt',
    title: 'Fast content delivery',
    description: 'Deliver static assets to users globally, with caching built in.'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Zero egress fees',
    description: 'Move data between storage and Azion Applications at no extra cost.'
  },
  {
    icon: 'ai ai-edge-storage',
    title: 'Widely compatible',
    description: 'Store and manage assets with standard S3-compatible tools and workflows.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-video',
    title: 'Deliver media from centralized storage',
    description:
      'Keep images, videos, and downloadable assets in Object Storage. Deliver them fast through Cache and Applications, and optimize media in Functions.',
    href: '/site/solutions/streaming'
  },
  {
    icon: 'pi pi-history',
    title: 'Automate backup and recovery',
    description:
      'Organize backups per bucket and automate upload and restore routines through the API. Use multipart upload for reliable large-file transfers.',
    href: PRODUCT_DOCS
  },
  {
    icon: 'pi pi-microchip-ai',
    title: 'Serve AI datasets and models',
    description:
      'Store training datasets, model weights, and inference artifacts. Read them from Functions for AI workloads, and serve models with AI Inference.',
    href: '/site/solutions/ai'
  },
  {
    icon: 'pi pi-cloud',
    title: 'Build multi-cloud storage',
    description:
      'Use S3-compatible storage as part of a multi-cloud strategy. The standard API keeps data portable between providers and avoids lock-in.',
    href: '/site/solutions/technology'
  }
]

const FAQ = [
  {
    value: 'what-to-store',
    question: 'What can I store in Object Storage?',
    answer:
      'Azion Object Storage is S3-compatible storage for unstructured data. It offers zero egress fees between Azion services, 99.9% availability, bucket-as-origin for static sites, multipart upload, and native Functions integration. Store files, media, logs, datasets, and application assets with predictable costs.'
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
      'Create S3 credentials for your Azion bucket, then copy objects with standard S3 tools (AWS CLI, rclone, boto3). Point your existing applications to Azion’s endpoint with the new credentials. Object Storage uses the same S3 API, so no code changes are required.'
  },
  {
    value: 'buckets',
    question: 'How do buckets organize my data?',
    answer:
      'A bucket is a top-level container that organizes objects. You can configure a bucket as an origin for Applications to host static sites and deliver assets. Each bucket has its own access permissions and S3 credentials.'
  },
  {
    value: 'origin',
    question: 'Can I use Object Storage as an origin for Applications?',
    answer:
      'Yes. Configure a bucket as an origin for Applications to serve static sites, HTML, CSS, JavaScript, and other assets. Choose to serve from the bucket root or a specific prefix. Add Cache to speed up delivery.'
  },
  {
    value: 'functions',
    question: 'Can Functions access Object Storage?',
    answer:
      'Yes. Functions use the Storage API to read, write, delete, and list objects. You can process, validate, and transform data with no egress fees inside the platform.'
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
      'Zero egress fees between Azion services. Data moving between Object Storage and Functions or Applications has no egress cost, whether you serve static sites, process data, or deliver media.'
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
      'Create S3 credentials with specific capabilities (read, write, delete) per bucket. To control who reads objects, route access through Functions and enforce authentication and validation there. You can also set bucket-level access permissions.'
  }
]

export const OBJECT_STORAGE_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'short',
    eyebrow: 'Object Storage',
    title: 'S3-compatible object storage for global workloads',
    description:
      'Store and deliver static assets globally with S3-compatible APIs, integrated with your application stack.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'FeatureWidgets',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every bucket in one console',
    description:
      'Buckets, the access workloads have to them and the objects they hold live in the same workspace as the applications that serve them.',
    actions: PRODUCT_DOCS_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-edge-storage',
        title: 'Store application data at scale',
        description:
          'Store user uploads, datasets, logs, and unstructured data in buckets through the S3-compatible API. Storage scales on demand and object access stays fast.',
        scene: { component: markRaw(ObjectStorageBucketsFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'ai ai-edge-application',
        title: 'From storage to full application delivery',
        description:
          'Object Storage works with Cache, Functions, and Applications for complete content delivery. Set the access your workloads get to each bucket when you create it.',
        scene: { component: markRaw(ObjectStorageAccessFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-globe',
        title: 'Host static sites from buckets',
        description:
          'Host JAMstack sites, SPAs, and static assets in a bucket and serve them through Applications with high availability. Set the bucket as origin and deliver through Cache for speed.',
        scene: { component: markRaw(ObjectStorageBrowserFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'What teams use Object Storage for',
    description:
      'Put Object Storage behind any application and serve files, media and datasets from Azion’s distributed infrastructure, with zero egress between Azion services. Teams use it to:',
    action: { label: 'Docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('herospark') },
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]

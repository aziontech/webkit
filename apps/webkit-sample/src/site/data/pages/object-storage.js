import { cliBand } from '../cli-band.js'
import {
  PRODUCT_CLOSING,
  PRODUCT_DIRECTORY,
  PRODUCT_DOCS,
  PRODUCT_GROUPS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const S3_ENDPOINT = 'https://s3.us-east-005.azionstorage.net'

const FIGURES = [
  { value: '16', label: 'S3 operations supported' },
  { prefix: '$', value: '0', label: 'Egress between Azion services' },
  { value: '6', label: 'Interfaces to the same bucket' },
  { value: '100', suffix: '+', label: 'Data centers serving buckets' }
]

const S3_SAMPLE = `aws s3 cp ./launch.mp4 s3://media/launch.mp4 \\
  --endpoint-url ${S3_ENDPOINT}

aws s3 ls s3://media \\
  --endpoint-url ${S3_ENDPOINT}`

const FUNCTION_SAMPLE = `import { createObject } from 'azion/storage'

export default {
  async fetch(request) {
    const file = (await request.formData()).get('file')
    const { data, error } = await createObject({
      bucket: 'uploads',
      key: file.name,
      content: await file.arrayBuffer()
    })
    if (error) return Response.json(error, { status: 502 })
    return Response.json({ key: data.key }, { status: 201 })
  }
}`

const DEPLOY_SAMPLE = `npx azion deploy

Building your application
Uploading static assets to the bucket
Your Application was deployed successfully
Domain: https://k7q2fmx4ze.map.azionedge.net`

const ORIGIN_SAMPLE = `export default {
  rules: {
    request: [
      {
        name: 'Deliver Media from the Bucket',
        match: '^/media/',
        behavior: {
          setOrigin: { name: 'origin-storage-default' },
          deliver: true
        }
      }
    ]
  }
}`

const INTERFACES = [
  {
    icon: 'pi pi-cloud-upload',
    title: 'The S3 protocol',
    description:
      'Point the AWS CLI, an SDK or rclone at the Azion endpoint with a credential you scope per bucket, and your existing tooling keeps working.'
  },
  {
    icon: 'ai ai-edge-functions',
    title: 'A function',
    description:
      'Read, write, list and delete objects at request time with the azion/storage library — uploads land in the bucket from the same code that answers the user.'
  },
  {
    icon: 'ai ai-azion-cli',
    title: 'The CLI',
    description:
      'azion deploy puts a project’s build output into a bucket and wires the application that serves it, in the same command that ships the code.'
  },
  {
    icon: 'ai ai-edge-application',
    title: 'An application',
    description:
      'A rule routes a path to the bucket and delivers the object directly — served from the edge, cached like any other response, behind your own domain.'
  }
]

const sample = (value, label, code, language = 'javascript', fileName = '', fileIcon = '') => ({
  label,
  value,
  language,
  code,
  fileName: fileName || (language === 'bash' ? 'terminal' : 'azion.config.js'),
  fileIcon: fileIcon || 'pi pi-code'
})

const INTERFACE_SAMPLES = [
  sample('s3', 'The S3 protocol', S3_SAMPLE, 'bash'),
  sample(
    'function',
    'A function',
    FUNCTION_SAMPLE,
    'javascript',
    'upload.js',
    'ai ai-edge-functions'
  ),
  sample('cli', 'The CLI', DEPLOY_SAMPLE, 'bash'),
  sample('origin', 'An application', ORIGIN_SAMPLE)
]

const CAPABILITIES = [
  {
    icon: 'pi pi-cloud-upload',
    title: 'S3-compatible API',
    description:
      'Sixteen S3 operations, signed with an access key and secret you create as a credential — so migrating means changing an endpoint, not rewriting an application.'
  },
  {
    icon: 'pi pi-lock',
    title: 'Credentials with boundaries',
    description:
      'Scope each credential to the buckets and capabilities it needs, and give platform access levels of read only, read write or restricted per bucket.'
  },
  {
    icon: 'ai ai-edge-application',
    title: 'Buckets as origins',
    description:
      'Serve objects behind your own domain through an application, cached at the edge — faster than the storage endpoint and free of its rate limits.'
  },
  {
    icon: 'ai ai-edge-functions',
    title: 'Processing where the data is',
    description:
      'Functions read and write the same buckets at request time, so validation, enrichment and uploads happen without a round trip to another provider.'
  },
  {
    icon: 'pi pi-wallet',
    title: 'Zero egress on the platform',
    description:
      'Moving objects between storage, functions, cache and delivery costs nothing. You pay for what you store and the operations you run.'
  },
  {
    icon: 'pi pi-file',
    title: 'Whole objects, simple model',
    description:
      'Objects are written whole and replaced on write — a model built for files written rarely and read often: images, video, archives and build output.'
  }
]

const FAQ = [
  {
    value: 'what-is',
    question: 'What is Object Storage?',
    answer:
      'Buckets of whole objects — images, video, archives, build output — stored on Azion and addressed by key. The same bucket is reachable from the Console, the API, the CLI, a function at request time, the azion library, and the S3 protocol.'
  },
  {
    value: 's3-compat',
    question: 'How compatible with S3 is it?',
    answer:
      'Sixteen S3 operations are supported, signed with an access key and secret you create as a credential. The AWS CLI, SDKs and tools like rclone connect to s3.us-east-005.azionstorage.net, and each credential can be scoped to specific buckets and capabilities.'
  },
  {
    value: 'migrate',
    question: 'How do I migrate an existing bucket?',
    answer:
      'Sync it with the tooling you already use — aws s3 sync or rclone pointed at the Azion endpoint. Because the API is S3-compatible, the application code that reads and writes objects keeps working after the endpoint changes.'
  },
  {
    value: 'serving',
    question: 'How do I serve objects publicly?',
    answer:
      'Through an application: a rule routes a path to the bucket and delivers the object from the edge, cached, behind your own domain. That path is faster than the storage endpoint and avoids its rate limits — the endpoint stays for management and tooling.'
  },
  {
    value: 'functions',
    question: 'Can Functions read and write buckets?',
    answer:
      'Yes. The azion/storage library creates, reads, lists and deletes objects from inside a function, so uploads, validation and enrichment run at request time with no keys to wire between products.'
  },
  {
    value: 'pricing',
    question: 'What does it cost?',
    answer:
      'You pay for what you store, per GB, and for the operations you run. Data moving between Azion services — storage to functions, buckets to delivery — carries no egress charge.'
  },
  {
    value: 'versioning',
    question: 'Does it keep versions of an object?',
    answer:
      'No. Writes replace the previous content permanently, which keeps the model simple and the pricing predictable. For records that change often, use SQL Database or KV Store and keep buckets for files written rarely and read often.'
  },
  {
    value: 'limits',
    question: 'What are the limits?',
    answer:
      'Bucket names are 6 to 63 characters, unique per account and immutable. Object keys hold up to 1,024 characters, list operations return up to 1,000 keys per page, and a bucket can be deleted once it is empty.'
  }
]

const [HEROSPARK_QUOTE] = quotesLedBy('herospark')

export const OBJECT_STORAGE_PAGE = [
  {
    section: 'Heroes',
    kind: 'centered-band',
    eyebrow: 'Object Storage',
    title: 'S3-compatible storage, built into the platform',
    description:
      'Store media, uploads and build output in buckets, and serve them from the same platform that runs your code — with zero egress between Azion services.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'StatsBand', items: FIGURES },
  {
    section: 'StickyScrollCode',
    eyebrow: 'Interfaces',
    title: 'One bucket, every way in',
    description:
      'The S3 protocol, the CLI, a function and an application all address the same bucket — pick the way in that fits the job, not the one the provider left you.',
    items: INTERFACES,
    samples: INTERFACE_SAMPLES,
    action: { label: 'Explore the storage APIs', href: PRODUCT_DOCS }
  },
  { section: 'CapabilityGrid', items: CAPABILITIES },
  {
    section: 'QuoteBand',
    kind: 'signed',
    text: HEROSPARK_QUOTE.text,
    name: HEROSPARK_QUOTE.name,
    jobTitle: HEROSPARK_QUOTE.jobTitle,
    client: HEROSPARK_QUOTE.clientName,
    actions: [
      {
        label: 'View success story',
        href: 'https://www.azion.com/en/success-case/herospark-30-percent-performance-azion/',
        kind: 'outlined',
        trailing: true,
        external: true
      }
    ]
  },
  { ...PRODUCT_DIRECTORY, groups: PRODUCT_GROUPS },
  { section: 'FaqSection', items: FAQ },
  cliBand({
    script: 'deployStorage',
    title: 'Your first bucket ships with your first deploy',
    description:
      'azion deploy builds the project, puts the static output in a bucket, and hands back a live domain that serves it — storage included, nothing to wire.'
  }),
  PRODUCT_CLOSING
]

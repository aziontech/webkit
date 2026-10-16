import { markRaw } from 'vue'

import DataStreamConnectorFragment from '../../ui/mockup/widgets/DataStreamConnectorFragment.vue'
import DataStreamSamplingFragment from '../../ui/mockup/widgets/DataStreamSamplingFragment.vue'
import DataStreamSourceFragment from '../../ui/mockup/widgets/DataStreamSourceFragment.vue'
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
    title: 'Detect threats in seconds',
    description: 'Feed your SIEM with near real-time data. Accelerate investigation and response.'
  },
  {
    icon: 'pi pi-shield',
    title: 'Pass compliance audits',
    description:
      'Retain logs for audits and investigations with secure, continuous backups that meet regulatory requirements.'
  },
  {
    icon: 'pi pi-dollar',
    title: 'Pay only for what you use',
    description:
      'Consumption-based pricing with no hidden costs, no infrastructure to manage, and no vendor lock-in.'
  }
]

const USE_CASES = [
  {
    icon: 'pi pi-shield',
    title: 'Automate threat response',
    description:
      'Correlate events across applications to update protection rules automatically. Reduce security team workload.',
    href: '/site/solutions/security'
  },
  {
    icon: 'pi pi-file-check',
    title: 'Ensure regulatory compliance',
    description:
      'Maintain audit trails with real-time monitoring. Meet PCI-DSS, HIPAA, and SOC 2 requirements.',
    href: '/site/solutions/financial-services'
  },
  {
    icon: 'pi pi-eye',
    title: 'Protect from OWASP attacks',
    description:
      'Block OWASP Top 10 and zero-day attacks with WAAP. Simplify security without performance trade-offs.',
    href: '/site/solutions/security'
  },
  {
    icon: 'pi pi-chart-line',
    title: 'Accelerate applications globally',
    description:
      'Improve performance up to 10x with protocol optimizations. Handle traffic spikes without degradation.',
    href: '/site/solutions/performance'
  }
]

const FAQ = [
  {
    value: 'vs-cloud-logging',
    question: 'How is Data Stream different from native cloud logging services?',
    answer:
      "Data Stream delivers data from Azion's global infrastructure directly to your existing tools—AWS Kinesis, Splunk, S3, BigQuery, Elasticsearch, and more—in near real-time. Unlike vendor-specific logging, it works across your entire stack without lock-in, with built-in filtering, sampling, and multi-destination support from a single configuration."
  },
  {
    value: 'delivery-speed',
    question: 'How fast is data delivery?',
    answer:
      'Data Stream delivers logs in near real-time with a maximum interval of 60 seconds or when 2,000 records are accumulated, whichever comes first. This ensures timely data availability for security monitoring, compliance, and analytics while optimizing throughput and reducing overhead.'
  },
  {
    value: 'connectors',
    question: 'Which connectors and endpoints are supported?',
    answer:
      'Data Stream supports more than 10 connectors including AWS Kinesis Data Firehose, Splunk, Amazon S3, Google BigQuery, Elasticsearch, Datadog, IBM QRadar, Azure Monitor, Azure Blob Storage, Apache Kafka, and standard HTTP/HTTPS POST endpoints. You can connect to multiple destinations simultaneously.'
  },
  {
    value: 'filter-customize',
    question: 'Can I filter and customize the data before streaming?',
    answer:
      'Yes. Data Stream allows you to select specific variables using ready-made templates or create custom configurations. You can filter by domains, apply sampling to control volume, and choose specifically, field by field the data before delivery. This helps reduce costs and ensures you stream only the data you need.'
  },
  {
    value: 'high-traffic',
    question: 'How does Data Stream handle high traffic volumes?',
    answer:
      "Data Stream scales automatically with your traffic using Azion's distributed global architecture. You can choose 100% data capture or apply optional sampling to manage volume. The service handles traffic spikes with no configuration changes or performance degradation."
  },
  {
    value: 'compliance',
    question: 'Is Data Stream suitable for compliance and audit requirements?',
    answer:
      'Yes. Data Stream enables continuous log retention for historical analysis and incident investigations. Stream to secure storage endpoints like S3 or Azure Blob Storage for long-term retention, helping meet PCI-DSS, HIPAA, and other regulatory requirements.'
  },
  {
    value: 'siem',
    question: 'How do I integrate Data Stream with my SIEM?',
    answer:
      "Configure a stream in Azion Console or via API, select your data source (Applications, WAF Events, etc.), choose a template or customize variables, and connect to your SIEM endpoint (Splunk, IBM QRadar, Datadog, etc.). The integration takes minutes to set up. See our SIEM integration guide for detailed steps. Want just receive raw logs in S3? No problem. Just setup the connector and you're all good."
  },
  {
    value: 'pricing',
    question: 'What is the pricing model for Data Stream?',
    answer:
      'Data Stream uses transparent usage-based pricing. Pay only for the data you stream with no hidden fees, infrastructure costs, or vendor lock-in. Pricing is based on the volume of data transferred. See the pricing page for detailed information.'
  },
  {
    value: 'data-types',
    question: 'What data types can be exported for compliance and auditing?',
    answer:
      'Data Stream exports complete field types to support compliance and audit requirements. For Applications, you can capture request data (timestamp, client IP, HTTP method, URI, headers, user agent), response data (status codes, bytes sent, cache status), and performance metrics (upstream response time, request time). For WAF Events, fields include attack signatures, threat scores, blocked requests, rule IDs, and geographic data. Activity History provides user actions, API calls, configuration changes, and authentication events. All data includes precise timestamps, session identifiers, and can be filtered by domain, allowing you to meet requirements for PCI-DSS, HIPAA, SOC 2, and GDPR with detailed audit records.'
  }
]

export const DATA_STREAM_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Data Stream',
    title: 'React faster to security and performance issues',
    description:
      'Send request logs, security events, and metrics to SIEM, data lake, and analytics tools in near real time.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every stream setting in one configuration',
    description:
      'The data source, the sampling that trims it and the connector that receives it live in one stream, saved and changed together.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'ai ai-variables',
        title: 'Unified data collection',
        description:
          'Collect event data from Applications, Functions, WAF Events, and Activity History, and send only the fields you need with templates or custom mappings.',
        scene: { component: markRaw(DataStreamSourceFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-filter',
        title: 'Reduce SIEM costs',
        description:
          'Filter and sample events before delivery to reduce data volume and lower your SIEM ingestion costs.',
        scene: { component: markRaw(DataStreamSamplingFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-sitemap',
        title: 'Integrate your existing stack',
        description:
          'Stream to AWS Kinesis, Splunk, S3, Elasticsearch, Datadog, and more. No workflow changes.',
        scene: { component: markRaw(DataStreamConnectorFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Stream, filter, and route event data',
        description:
          'Run continuous streaming with full capture or optional sampling. Filter and transform events before routing them to SIEM, analytics, and BI platforms.',
        href: PRODUCT_DOCS,
        illustration: 'live-debugging',
        illustrationLabel: 'A time window of streamed requests, errors and events',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      },
      {
        title: 'Integrate with your existing tools',
        description:
          'Stream structured event data to SIEM, analytics, storage, and HTTP endpoints, including Splunk, Datadog, BigQuery, S3, and Azure Monitor. Customize payload format, batching, and delivery intervals to match your existing workflows.',
        href: '/site/products/web-application-firewall',
        illustration: 'automate-threat-mitigation',
        illustrationLabel: 'Event data passing along a line of destination tools',
        actions: [
          { label: 'Web Application Firewall', href: '/site/products/web-application-firewall' }
        ]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Power critical use cases with real-time data',
    description:
      'Put Data Stream behind any application and send its logs and events from Azion’s distributed infrastructure to the tools you already run. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('contabilizei') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]

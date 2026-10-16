import { markRaw } from 'vue'

import RealTimeMetricsDashboardFragment from '../../ui/mockup/widgets/RealTimeMetricsDashboardFragment.vue'
import RealTimeMetricsFilterFragment from '../../ui/mockup/widgets/RealTimeMetricsFilterFragment.vue'
import RealTimeMetricsPanelFragment from '../../ui/mockup/widgets/RealTimeMetricsPanelFragment.vue'
import {
  PLATFORM_DIRECTORY,
  PRODUCT_CLOSING,
  PRODUCT_DOCS,
  PRODUCT_HERO_ACTIONS
} from '../product-pages.js'
import { quotesLedBy } from '../solutions.js'

const PILLARS = [
  {
    icon: 'pi pi-search',
    title: 'Detect anomalies instantly',
    description:
      'Spot traffic spikes and error surges as they happen to react before issues spread across regions.'
  },
  {
    icon: 'pi pi-chart-bar',
    title: 'Optimize application performance',
    description:
      'Analyze latency and error rates across dashboards to identify bottlenecks by host or region.'
  },
  {
    icon: 'pi pi-server',
    title: 'Predict and prevent bottlenecks',
    description:
      'Track trends with 24 months retention to forecast capacity needs and optimize scalability.'
  }
]

const USE_CASES = [
  {
    icon: 'ai ai-real-time-metrics',
    title: 'Monitor application performance',
    description:
      'Track Data Transferred, Requests, Status Codes, and Bandwidth across all your applications on distributed infrastructure. Use Average Request Time charts to identify latency bottlenecks by host, method, or region.',
    href: '/site/solutions/web-apps'
  },
  {
    icon: 'ai ai-waf-rules',
    title: 'Analyze security threats',
    description:
      'View WAF Threats vs Requests, SQL Injection, XSS, RFI, and Bot Manager dashboards. Analyze threats by country, IP, host, and attack family to create targeted security policies.',
    href: '/site/solutions/security'
  },
  {
    icon: 'ai ai-tiered-cache',
    title: 'Optimize cache performance',
    description:
      'Monitor cache offload, Saved Data, Missed Data, and Tiered Cache performance. Maximize bandwidth savings and reduce origin load by analyzing offload percentages and cache hit ratios.',
    href: '/site/solutions/performance'
  },
  {
    icon: 'ai ai-graphql',
    title: 'Build custom reports',
    description:
      'Export charts to CSV, copy GraphQL queries for programmatic access, and build custom Grafana dashboards. Retain up to 24 months of data for compliance audits and trend analysis.',
    href: '/site/solutions/financial-services'
  }
]

const FAQ = [
  {
    value: 'data-updates',
    question: 'How often is my data updated?',
    answer:
      'The maximum time for data aggregation to occur is 10 minutes. When you select the Last Hour time range, Real-Time Metrics automatically refreshes your data every one minute.'
  },
  {
    value: 'retention',
    question: 'How long can I keep historical data?',
    answer:
      'Azion stores your metrics events and logs for up to 2 years (24 months). The current Real-Time Metrics provides data starting from October 15th, 2022. For earlier data, you can use Historical Real-Time Metrics.'
  },
  {
    value: 'products',
    question: 'Which products can I monitor with Real-Time Metrics?',
    answer:
      'You can monitor metrics across three categories: Build (Applications, Tiered Cache, Functions, Image Processor), Secure (WAF, Edge DNS, Bot Manager, Threats Breakdown), and Observe (Data Stream). Some products like Data Stream, Functions, and Edge DNS require subscription and activation.'
  },
  {
    value: 'programmatic-access',
    question: 'Can I access metrics data programmatically?',
    answer:
      'Yes. Real-Time Metrics fetches data using the Azion GraphQL API. You can copy chart queries directly from the console, use the GraphQL Playground, or build custom dashboards with the Azion Grafana plugin. The API supports up to 10,000 lines per query and 120 requests per minute.'
  },
  {
    value: 'sampling',
    question: 'Is sampling used?',
    answer:
      'No. Real-Time Metrics provides 100% of your data with no sampling. It uses an at-most-once approach focused on performance. On average, the difference between Real-Time Metrics and Azion Billing data is smaller than 1%.'
  },
  {
    value: 'time-ranges',
    question: 'Which time ranges can I select?',
    answer:
      'You can select from Last Hour, Last 24 Hours, Last 7 Days, Last 30 Days, and Last 6 Months. You can also set custom date ranges using the calendar fields. The timezone matches your user preferences.'
  },
  {
    value: 'filter-share',
    question: 'Can I filter and share metric views?',
    answer:
      'Yes. Real-Time Metrics supports advanced filters by host, status code, request method, geographic location, and more. After applying a filter, the URL is updated with an encoded parameter that you can copy and share with other users.'
  },
  {
    value: 'get-started',
    question: 'How do I get started with Real-Time Metrics?',
    answer:
      'Sign up for a free Azion account at console.azion.com/signup and navigate to Real-Time Metrics. Select a product category (Build, Secure, or Observe), choose a time range, and start analyzing your charts. See the first steps guide in the documentation for a detailed walkthrough.'
  }
]

export const REAL_TIME_METRICS_PAGE = [
  {
    section: 'Heroes',
    kind: 'title-band',
    titleLength: 'long',
    eyebrow: 'Real-Time Metrics',
    title: 'Monitor application performance in real time',
    description:
      'Monitor traffic, performance, security, and cache metrics across all Azion products with long-term retention and no sampling.',
    actions: PRODUCT_HERO_ACTIONS
  },
  { section: 'CapabilityGrid', gap: false, items: PILLARS },
  {
    section: 'WidgetGrid',
    anchor: 'built-in',
    eyebrow: 'Built in',
    title: 'Every product’s metrics in one console',
    description:
      'Dashboards for each product, the filters that slice them and the charts that track them live in one console, with no sampling and 24 months of history.',
    actions: PRODUCT_HERO_ACTIONS,
    columns: 3,
    items: [
      {
        icon: 'pi pi-shield',
        title: 'Track security threats',
        description:
          'Monitor WAF and Bot Manager activity with breakdowns by country, IP, or attack category.',
        scene: { component: markRaw(RealTimeMetricsDashboardFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-filter',
        title: 'Filter and share views',
        description:
          'Slice metrics by host, region, or status code and share filtered dashboards across teams.',
        scene: { component: markRaw(RealTimeMetricsFilterFragment) },
        href: PRODUCT_DOCS
      },
      {
        icon: 'pi pi-code',
        title: 'Build custom dashboards',
        description:
          'Query via GraphQL API or Grafana plugin to create views tailored to your workflows.',
        scene: { component: markRaw(RealTimeMetricsPanelFragment) },
        href: PRODUCT_DOCS
      }
    ]
  },
  {
    section: 'MediaSplitStack',
    kind: 'solutions',
    bands: [
      {
        title: 'Monitor metrics from one console',
        description:
          'Monitor up to 24 months of metrics across Applications, Functions, WAF, and other Azion products through centralized dashboards, with Real-Time Events integration for deeper investigation.',
        href: '/signup',
        illustration: 'live-debugging',
        illustrationLabel: 'A console window with a time range of requests, errors and events',
        actions: [{ label: 'Start Free', href: '/signup' }]
      },
      {
        title: 'Dashboards built for fast decisions',
        description:
          'Filter metrics by time range, compare changes with delta indicators, and export reports to quickly identify trends and operational impact.',
        href: PRODUCT_DOCS,
        illustration: 'stay-in-control',
        illustrationLabel: 'A bar chart with traffic rising and cost falling',
        actions: [{ label: 'Docs', href: PRODUCT_DOCS }]
      }
    ]
  },
  {
    section: 'UseCases',
    eyebrow: 'Use Cases',
    title: 'Power operational workflows',
    description:
      'Put Real-Time Metrics in front of every application, function and firewall you run and read their traffic as Azion’s distributed infrastructure serves it, with no sampling. Teams use it to:',
    action: { label: 'View docs', href: PRODUCT_DOCS, trailing: true },
    items: USE_CASES
  },
  { section: 'ClientQuotes', quotes: quotesLedBy('magalu') },
  PLATFORM_DIRECTORY,
  { section: 'FaqSection', items: FAQ },
  PRODUCT_CLOSING
]

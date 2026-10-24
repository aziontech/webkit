import type { DiagramSpec } from '../../components/marketing/diagram/types'

const spec: DiagramSpec = {
  ariaLabel:
    'Requests reach the workload; Data Stream collects HTTP, firewall and function logs and sends them through connectors to a SIEM or a data lake',
  nodes: [
    {
      key: 'user',
      kind: 'pill',
      title: 'Requests',
      icon: 'pi pi-user',
      active: true
    },
    {
      key: 'workload',
      kind: 'card',
      eyebrow: 'Workload',
      title: 'shop.example.com',
      icon: 'ai ai-workloads',
      active: true
    },
    {
      key: 'stream',
      kind: 'card',
      eyebrow: 'Data Stream',
      title: 'HTTP, firewall and function logs',
      icon: 'ai ai-data-stream',
      status: {
        label: 'Near real time',
        severity: 'success'
      },
      active: true,
      lit: true
    },
    {
      key: 'siem',
      kind: 'item',
      eyebrow: 'SIEM',
      title: 'Splunk, Datadog',
      icon: 'pi pi-chart-bar',
      active: true
    },
    {
      key: 'lake',
      kind: 'item',
      eyebrow: 'Data lake',
      title: 'S3, Kafka, Elasticsearch',
      icon: 'pi pi-database'
    }
  ],
  layout: {
    gap: 'wide',
    row: [
      {
        node: 'user'
      },
      {
        node: 'workload'
      },
      {
        node: 'stream'
      },
      {
        branches: [
          {
            node: 'siem'
          },
          {
            node: 'lake'
          }
        ]
      }
    ]
  },
  edges: [
    {
      from: 'user',
      to: 'workload',
      active: true
    },
    {
      from: 'workload',
      to: 'stream',
      active: true
    },
    {
      from: 'stream',
      to: 'siem',
      label: 'connector',
      active: true
    },
    {
      from: 'stream',
      to: 'lake',
      label: 'connector'
    }
  ]
}

export default spec

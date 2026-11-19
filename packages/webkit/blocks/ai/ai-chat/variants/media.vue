<script setup lang="ts">
  import branches from '@aziontech/webkit/assets/branches.svg'
  import placeholderClip from '@aziontech/webkit/assets/placeholder-clip.webm'
  import usageChart from '@aziontech/webkit/assets/usage-chart.svg'

  import AiChat, { type AiChatMessage } from '../ai-chat.vue'
  import { sampleReportCsv } from '../sample'

  const messages: AiChatMessage[] = [
    {
      id: 'q1',
      role: 'user',
      parts: [
        { type: 'text', content: 'Show me the traffic of acme-store this week, split like this' },
        {
          type: 'image',
          source: { type: 'url', value: branches, mimeType: 'image/svg+xml' },
          metadata: { alt: 'The acme-store branches' }
        }
      ],
      createdAt: new Date('2026-11-19T11:02:00')
    },
    {
      id: 'a1',
      role: 'assistant',
      parts: [
        {
          type: 'text',
          content:
            'Traffic held steady at about **1.2 million requests a day**, with the cache hit ratio rising from 90% to 92%.'
        },
        {
          type: 'tool-call',
          id: 'chart-call',
          name: 'render_chart',
          arguments: '{"workload":"acme-store","range":"7d"}',
          state: 'complete'
        },
        {
          type: 'tool-result',
          toolCallId: 'chart-call',
          state: 'complete',
          content: [
            { type: 'text', content: 'Requests per day for acme-store, last 7 days.' },
            { type: 'image', source: { type: 'url', value: usageChart } }
          ]
        },
        {
          type: 'image',
          id: 'chart',
          source: { type: 'url', value: usageChart },
          metadata: { alt: 'Requests per day for acme-store' }
        },
        {
          type: 'image',
          id: 'branches',
          source: { type: 'url', value: branches },
          metadata: { alt: 'Traffic split across the acme-store branches' }
        },
        {
          type: 'structured-output',
          status: 'complete',
          raw: '{"requestsPerDay":1200000,"cacheHitRatio":0.92}',
          data: { requestsPerDay: 1200000, cacheHitRatio: 0.92 }
        },
        {
          type: 'document',
          id: 'report',
          source: { type: 'data', value: sampleReportCsv, mimeType: 'text/csv' },
          metadata: { name: 'traffic-report.csv' }
        },
        {
          type: 'audio',
          id: 'summary',
          source: { type: 'url', value: placeholderClip, mimeType: 'audio/webm' }
        }
      ],
      createdAt: new Date('2026-11-19T11:02:00')
    }
  ]
</script>

<template>
  <AiChat
    :messages="messages"
    :tools="{ render_chart: { title: 'Charting the traffic' } }"
    attachable
  />
</template>

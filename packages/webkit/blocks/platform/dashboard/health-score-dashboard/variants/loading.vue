<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import Card from '@aziontech/webkit/card'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tracker from '@aziontech/webkit/tracker'
  import { computed, ref } from 'vue'

  const loading = true
  const period = ref('Last 24 hours')
  const activeIndex = ref(null)

  const periods = [
    {
      label: 'Last hour',
      phrase: 'the last hour'
    },
    {
      label: 'Last 24 hours',
      phrase: 'the last 24 hours'
    },
    {
      label: 'Last 7 days',
      phrase: 'the last 7 days'
    }
  ]

  const phrase = computed(() => periods.find((option) => option.label === period.value).phrase)

  const hours = [
    '00:00',
    '01:00',
    '02:00',
    '03:00',
    '04:00',
    '05:00',
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
    '23:00'
  ]

  const overall = {
    score: 79,
    band: {
      label: 'Fair',
      severity: 'warning'
    },
    cause: 'packet loss',
    series: [
      {
        id: 'score',
        name: 'Score',
        values: [
          84, 85, 86, 86, 85, 84, 82, 79, 74, 71, 73, 76, 78, 77, 75, 72, 70, 74, 78, 81, 83, 84,
          85, 84
        ]
      }
    ]
  }

  const applications = [
    {
      id: 'video-calls',
      name: 'Video calls · packet loss',
      value: 48
    },
    {
      id: 'file-storage',
      name: 'File storage · slow server response',
      value: 64
    },
    {
      id: 'crm',
      name: 'CRM · slow DNS lookups',
      value: 73
    },
    {
      id: 'mail',
      name: 'Mail · Wi-Fi signal',
      value: 83
    },
    {
      id: 'chat',
      name: 'Chat · Wi-Fi signal',
      value: 89
    },
    {
      id: 'docs',
      name: 'Docs · high latency',
      value: 93
    }
  ]

  const locations = [
    {
      id: 'travel',
      name: 'Travel · high latency',
      value: 58
    },
    {
      id: 'home',
      name: 'Home · Wi-Fi signal',
      value: 71
    },
    {
      id: 'south-branch',
      name: 'South branch · packet loss',
      value: 76
    },
    {
      id: 'north-branch',
      name: 'North branch · slow DNS lookups',
      value: 84
    },
    {
      id: 'main-office',
      name: 'Main office · slow server response',
      value: 89
    }
  ]

  const hourly = [
    {
      id: 'video-calls',
      name: 'Video calls',
      band: {
        label: 'Fair',
        severity: 'warning'
      },
      blocks: [
        {
          id: 'video-calls-00:00',
          severity: 'warning',
          label: '00:00 · 62 · Fair'
        },
        {
          id: 'video-calls-01:00',
          severity: 'warning',
          label: '01:00 · 57 · Fair'
        },
        {
          id: 'video-calls-02:00',
          severity: 'warning',
          label: '02:00 · 54 · Fair'
        },
        {
          id: 'video-calls-03:00',
          severity: 'warning',
          label: '03:00 · 60 · Fair'
        },
        {
          id: 'video-calls-04:00',
          severity: 'warning',
          label: '04:00 · 61 · Fair'
        },
        {
          id: 'video-calls-05:00',
          severity: 'warning',
          label: '05:00 · 55 · Fair'
        },
        {
          id: 'video-calls-06:00',
          severity: 'warning',
          label: '06:00 · 56 · Fair'
        },
        {
          id: 'video-calls-07:00',
          severity: 'warning',
          label: '07:00 · 62 · Fair'
        },
        {
          id: 'video-calls-08:00',
          severity: 'danger',
          label: '08:00 · 35 · Poor'
        },
        {
          id: 'video-calls-09:00',
          severity: 'danger',
          label: '09:00 · 30 · Poor'
        },
        {
          id: 'video-calls-10:00',
          severity: 'danger',
          label: '10:00 · 34 · Poor'
        },
        {
          id: 'video-calls-11:00',
          severity: 'danger',
          label: '11:00 · 38 · Poor'
        },
        {
          id: 'video-calls-12:00',
          severity: 'danger',
          label: '12:00 · 33 · Poor'
        },
        {
          id: 'video-calls-13:00',
          severity: 'danger',
          label: '13:00 · 30 · Poor'
        },
        {
          id: 'video-calls-14:00',
          severity: 'danger',
          label: '14:00 · 36 · Poor'
        },
        {
          id: 'video-calls-15:00',
          severity: 'danger',
          label: '15:00 · 37 · Poor'
        },
        {
          id: 'video-calls-16:00',
          severity: 'danger',
          label: '16:00 · 32 · Poor'
        },
        {
          id: 'video-calls-17:00',
          severity: 'danger',
          label: '17:00 · 31 · Poor'
        },
        {
          id: 'video-calls-18:00',
          severity: 'warning',
          label: '18:00 · 61 · Fair'
        },
        {
          id: 'video-calls-19:00',
          severity: 'warning',
          label: '19:00 · 60 · Fair'
        },
        {
          id: 'video-calls-20:00',
          severity: 'warning',
          label: '20:00 · 54 · Fair'
        },
        {
          id: 'video-calls-21:00',
          severity: 'warning',
          label: '21:00 · 57 · Fair'
        },
        {
          id: 'video-calls-22:00',
          severity: 'warning',
          label: '22:00 · 62 · Fair'
        },
        {
          id: 'video-calls-23:00',
          severity: 'warning',
          label: '23:00 · 58 · Fair'
        }
      ]
    },
    {
      id: 'file-storage',
      name: 'File storage',
      band: {
        label: 'Fair',
        severity: 'warning'
      },
      blocks: [
        {
          id: 'file-storage-00:00',
          severity: 'warning',
          label: '00:00 · 72 · Fair'
        },
        {
          id: 'file-storage-01:00',
          severity: 'warning',
          label: '01:00 · 68 · Fair'
        },
        {
          id: 'file-storage-02:00',
          severity: 'warning',
          label: '02:00 · 73 · Fair'
        },
        {
          id: 'file-storage-03:00',
          severity: 'warning',
          label: '03:00 · 76 · Fair'
        },
        {
          id: 'file-storage-04:00',
          severity: 'warning',
          label: '04:00 · 70 · Fair'
        },
        {
          id: 'file-storage-05:00',
          severity: 'warning',
          label: '05:00 · 69 · Fair'
        },
        {
          id: 'file-storage-06:00',
          severity: 'warning',
          label: '06:00 · 75 · Fair'
        },
        {
          id: 'file-storage-07:00',
          severity: 'warning',
          label: '07:00 · 74 · Fair'
        },
        {
          id: 'file-storage-08:00',
          severity: 'danger',
          label: '08:00 · 49 · Poor'
        },
        {
          id: 'file-storage-09:00',
          severity: 'warning',
          label: '09:00 · 51 · Fair'
        },
        {
          id: 'file-storage-10:00',
          severity: 'warning',
          label: '10:00 · 56 · Fair'
        },
        {
          id: 'file-storage-11:00',
          severity: 'warning',
          label: '11:00 · 52 · Fair'
        },
        {
          id: 'file-storage-12:00',
          severity: 'danger',
          label: '12:00 · 48 · Poor'
        },
        {
          id: 'file-storage-13:00',
          severity: 'warning',
          label: '13:00 · 53 · Fair'
        },
        {
          id: 'file-storage-14:00',
          severity: 'warning',
          label: '14:00 · 56 · Fair'
        },
        {
          id: 'file-storage-15:00',
          severity: 'warning',
          label: '15:00 · 50 · Fair'
        },
        {
          id: 'file-storage-16:00',
          severity: 'danger',
          label: '16:00 · 49 · Poor'
        },
        {
          id: 'file-storage-17:00',
          severity: 'warning',
          label: '17:00 · 54 · Fair'
        },
        {
          id: 'file-storage-18:00',
          severity: 'warning',
          label: '18:00 · 75 · Fair'
        },
        {
          id: 'file-storage-19:00',
          severity: 'warning',
          label: '19:00 · 69 · Fair'
        },
        {
          id: 'file-storage-20:00',
          severity: 'warning',
          label: '20:00 · 70 · Fair'
        },
        {
          id: 'file-storage-21:00',
          severity: 'warning',
          label: '21:00 · 76 · Fair'
        },
        {
          id: 'file-storage-22:00',
          severity: 'warning',
          label: '22:00 · 73 · Fair'
        },
        {
          id: 'file-storage-23:00',
          severity: 'warning',
          label: '23:00 · 68 · Fair'
        }
      ]
    },
    {
      id: 'crm',
      name: 'CRM',
      band: {
        label: 'Good',
        severity: 'success'
      },
      blocks: [
        {
          id: 'crm-00:00',
          severity: 'warning',
          label: '00:00 · 76 · Fair'
        },
        {
          id: 'crm-01:00',
          severity: 'success',
          label: '01:00 · 81 · Good'
        },
        {
          id: 'crm-02:00',
          severity: 'success',
          label: '02:00 · 84 · Good'
        },
        {
          id: 'crm-03:00',
          severity: 'warning',
          label: '03:00 · 78 · Fair'
        },
        {
          id: 'crm-04:00',
          severity: 'warning',
          label: '04:00 · 77 · Fair'
        },
        {
          id: 'crm-05:00',
          severity: 'success',
          label: '05:00 · 83 · Good'
        },
        {
          id: 'crm-06:00',
          severity: 'success',
          label: '06:00 · 82 · Good'
        },
        {
          id: 'crm-07:00',
          severity: 'warning',
          label: '07:00 · 76 · Fair'
        },
        {
          id: 'crm-08:00',
          severity: 'warning',
          label: '08:00 · 63 · Fair'
        },
        {
          id: 'crm-09:00',
          severity: 'warning',
          label: '09:00 · 68 · Fair'
        },
        {
          id: 'crm-10:00',
          severity: 'warning',
          label: '10:00 · 64 · Fair'
        },
        {
          id: 'crm-11:00',
          severity: 'warning',
          label: '11:00 · 60 · Fair'
        },
        {
          id: 'crm-12:00',
          severity: 'warning',
          label: '12:00 · 65 · Fair'
        },
        {
          id: 'crm-13:00',
          severity: 'warning',
          label: '13:00 · 68 · Fair'
        },
        {
          id: 'crm-14:00',
          severity: 'warning',
          label: '14:00 · 62 · Fair'
        },
        {
          id: 'crm-15:00',
          severity: 'warning',
          label: '15:00 · 61 · Fair'
        },
        {
          id: 'crm-16:00',
          severity: 'warning',
          label: '16:00 · 66 · Fair'
        },
        {
          id: 'crm-17:00',
          severity: 'warning',
          label: '17:00 · 67 · Fair'
        },
        {
          id: 'crm-18:00',
          severity: 'warning',
          label: '18:00 · 77 · Fair'
        },
        {
          id: 'crm-19:00',
          severity: 'warning',
          label: '19:00 · 78 · Fair'
        },
        {
          id: 'crm-20:00',
          severity: 'success',
          label: '20:00 · 84 · Good'
        },
        {
          id: 'crm-21:00',
          severity: 'success',
          label: '21:00 · 81 · Good'
        },
        {
          id: 'crm-22:00',
          severity: 'warning',
          label: '22:00 · 76 · Fair'
        },
        {
          id: 'crm-23:00',
          severity: 'success',
          label: '23:00 · 80 · Good'
        }
      ]
    },
    {
      id: 'mail',
      name: 'Mail',
      band: {
        label: 'Good',
        severity: 'success'
      },
      blocks: [
        {
          id: 'mail-00:00',
          severity: 'success',
          label: '00:00 · 93 · Good'
        },
        {
          id: 'mail-01:00',
          severity: 'success',
          label: '01:00 · 89 · Good'
        },
        {
          id: 'mail-02:00',
          severity: 'success',
          label: '02:00 · 85 · Good'
        },
        {
          id: 'mail-03:00',
          severity: 'success',
          label: '03:00 · 90 · Good'
        },
        {
          id: 'mail-04:00',
          severity: 'success',
          label: '04:00 · 93 · Good'
        },
        {
          id: 'mail-05:00',
          severity: 'success',
          label: '05:00 · 87 · Good'
        },
        {
          id: 'mail-06:00',
          severity: 'success',
          label: '06:00 · 86 · Good'
        },
        {
          id: 'mail-07:00',
          severity: 'success',
          label: '07:00 · 91 · Good'
        },
        {
          id: 'mail-08:00',
          severity: 'warning',
          label: '08:00 · 78 · Fair'
        },
        {
          id: 'mail-09:00',
          severity: 'warning',
          label: '09:00 · 72 · Fair'
        },
        {
          id: 'mail-10:00',
          severity: 'warning',
          label: '10:00 · 73 · Fair'
        },
        {
          id: 'mail-11:00',
          severity: 'warning',
          label: '11:00 · 79 · Fair'
        },
        {
          id: 'mail-12:00',
          severity: 'warning',
          label: '12:00 · 76 · Fair'
        },
        {
          id: 'mail-13:00',
          severity: 'warning',
          label: '13:00 · 71 · Fair'
        },
        {
          id: 'mail-14:00',
          severity: 'warning',
          label: '14:00 · 75 · Fair'
        },
        {
          id: 'mail-15:00',
          severity: 'warning',
          label: '15:00 · 79 · Fair'
        },
        {
          id: 'mail-16:00',
          severity: 'warning',
          label: '16:00 · 74 · Fair'
        },
        {
          id: 'mail-17:00',
          severity: 'warning',
          label: '17:00 · 71 · Fair'
        },
        {
          id: 'mail-18:00',
          severity: 'success',
          label: '18:00 · 91 · Good'
        },
        {
          id: 'mail-19:00',
          severity: 'success',
          label: '19:00 · 92 · Good'
        },
        {
          id: 'mail-20:00',
          severity: 'success',
          label: '20:00 · 86 · Good'
        },
        {
          id: 'mail-21:00',
          severity: 'success',
          label: '21:00 · 86 · Good'
        },
        {
          id: 'mail-22:00',
          severity: 'success',
          label: '22:00 · 92 · Good'
        },
        {
          id: 'mail-23:00',
          severity: 'success',
          label: '23:00 · 91 · Good'
        }
      ]
    },
    {
      id: 'chat',
      name: 'Chat',
      band: {
        label: 'Good',
        severity: 'success'
      },
      blocks: [
        {
          id: 'chat-00:00',
          severity: 'success',
          label: '00:00 · 94 · Good'
        },
        {
          id: 'chat-01:00',
          severity: 'success',
          label: '01:00 · 98 · Good'
        },
        {
          id: 'chat-02:00',
          severity: 'success',
          label: '02:00 · 93 · Good'
        },
        {
          id: 'chat-03:00',
          severity: 'success',
          label: '03:00 · 90 · Good'
        },
        {
          id: 'chat-04:00',
          severity: 'success',
          label: '04:00 · 96 · Good'
        },
        {
          id: 'chat-05:00',
          severity: 'success',
          label: '05:00 · 97 · Good'
        },
        {
          id: 'chat-06:00',
          severity: 'success',
          label: '06:00 · 91 · Good'
        },
        {
          id: 'chat-07:00',
          severity: 'success',
          label: '07:00 · 92 · Good'
        },
        {
          id: 'chat-08:00',
          severity: 'success',
          label: '08:00 · 86 · Good'
        },
        {
          id: 'chat-09:00',
          severity: 'success',
          label: '09:00 · 83 · Good'
        },
        {
          id: 'chat-10:00',
          severity: 'warning',
          label: '10:00 · 78 · Fair'
        },
        {
          id: 'chat-11:00',
          severity: 'success',
          label: '11:00 · 82 · Good'
        },
        {
          id: 'chat-12:00',
          severity: 'success',
          label: '12:00 · 86 · Good'
        },
        {
          id: 'chat-13:00',
          severity: 'success',
          label: '13:00 · 81 · Good'
        },
        {
          id: 'chat-14:00',
          severity: 'warning',
          label: '14:00 · 78 · Fair'
        },
        {
          id: 'chat-15:00',
          severity: 'success',
          label: '15:00 · 84 · Good'
        },
        {
          id: 'chat-16:00',
          severity: 'success',
          label: '16:00 · 85 · Good'
        },
        {
          id: 'chat-17:00',
          severity: 'success',
          label: '17:00 · 80 · Good'
        },
        {
          id: 'chat-18:00',
          severity: 'success',
          label: '18:00 · 91 · Good'
        },
        {
          id: 'chat-19:00',
          severity: 'success',
          label: '19:00 · 97 · Good'
        },
        {
          id: 'chat-20:00',
          severity: 'success',
          label: '20:00 · 96 · Good'
        },
        {
          id: 'chat-21:00',
          severity: 'success',
          label: '21:00 · 90 · Good'
        },
        {
          id: 'chat-22:00',
          severity: 'success',
          label: '22:00 · 93 · Good'
        },
        {
          id: 'chat-23:00',
          severity: 'success',
          label: '23:00 · 98 · Good'
        }
      ]
    },
    {
      id: 'docs',
      name: 'Docs',
      band: {
        label: 'Good',
        severity: 'success'
      },
      blocks: [
        {
          id: 'docs-00:00',
          severity: 'success',
          label: '00:00 · 97 · Good'
        },
        {
          id: 'docs-01:00',
          severity: 'success',
          label: '01:00 · 93 · Good'
        },
        {
          id: 'docs-02:00',
          severity: 'success',
          label: '02:00 · 98 · Good'
        },
        {
          id: 'docs-03:00',
          severity: 'success',
          label: '03:00 · 100 · Good'
        },
        {
          id: 'docs-04:00',
          severity: 'success',
          label: '04:00 · 95 · Good'
        },
        {
          id: 'docs-05:00',
          severity: 'success',
          label: '05:00 · 94 · Good'
        },
        {
          id: 'docs-06:00',
          severity: 'success',
          label: '06:00 · 99 · Good'
        },
        {
          id: 'docs-07:00',
          severity: 'success',
          label: '07:00 · 100 · Good'
        },
        {
          id: 'docs-08:00',
          severity: 'success',
          label: '08:00 · 84 · Good'
        },
        {
          id: 'docs-09:00',
          severity: 'success',
          label: '09:00 · 85 · Good'
        },
        {
          id: 'docs-10:00',
          severity: 'success',
          label: '10:00 · 91 · Good'
        },
        {
          id: 'docs-11:00',
          severity: 'success',
          label: '11:00 · 88 · Good'
        },
        {
          id: 'docs-12:00',
          severity: 'success',
          label: '12:00 · 83 · Good'
        },
        {
          id: 'docs-13:00',
          severity: 'success',
          label: '13:00 · 87 · Good'
        },
        {
          id: 'docs-14:00',
          severity: 'success',
          label: '14:00 · 91 · Good'
        },
        {
          id: 'docs-15:00',
          severity: 'success',
          label: '15:00 · 86 · Good'
        },
        {
          id: 'docs-16:00',
          severity: 'success',
          label: '16:00 · 83 · Good'
        },
        {
          id: 'docs-17:00',
          severity: 'success',
          label: '17:00 · 89 · Good'
        },
        {
          id: 'docs-18:00',
          severity: 'success',
          label: '18:00 · 100 · Good'
        },
        {
          id: 'docs-19:00',
          severity: 'success',
          label: '19:00 · 94 · Good'
        },
        {
          id: 'docs-20:00',
          severity: 'success',
          label: '20:00 · 95 · Good'
        },
        {
          id: 'docs-21:00',
          severity: 'success',
          label: '21:00 · 100 · Good'
        },
        {
          id: 'docs-22:00',
          severity: 'success',
          label: '22:00 · 99 · Good'
        },
        {
          id: 'docs-23:00',
          severity: 'success',
          label: '23:00 · 93 · Good'
        }
      ]
    }
  ]

  const incidents = [
    {
      id: 'incident-03',
      name: 'Video calls',
      scope: 'Application',
      icon: 'pi pi-th-large',
      devices: 34,
      share: 12,
      cause: 'Packet loss',
      opened: '2026-11-10T09:40:00Z',
      openedLabel: '09:40',
      band: {
        label: 'Poor',
        severity: 'danger'
      }
    },
    {
      id: 'incident-02',
      name: 'Travel',
      scope: 'Location',
      icon: 'pi pi-map-marker',
      devices: 9,
      share: 31,
      cause: 'High latency',
      opened: '2026-11-10T07:15:00Z',
      openedLabel: '07:15',
      band: {
        label: 'Fair',
        severity: 'warning'
      }
    },
    {
      id: 'incident-01',
      name: 'File storage',
      scope: 'Application',
      icon: 'pi pi-th-large',
      devices: 18,
      share: 7,
      cause: 'Slow server response',
      opened: '2026-11-10T06:02:00Z',
      openedLabel: '06:02',
      band: {
        label: 'Fair',
        severity: 'warning'
      }
    }
  ]

  const formatScore = (value) => value.toFixed(0)
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Experience score"
        description="How people experience each application: the overall score, the score per application and location, each hour of the period and the incidents still open."
      >
        <template #actions>
          <div class="w-44 shrink-0">
            <Select
              v-model="period"
              size="medium"
            >
              <Select.Trigger aria-label="Period" />
              <Select.Content>
                <Select.Option
                  v-for="option in periods"
                  :key="option.label"
                  :value="option.label"
                >
                  {{ option.label }}
                </Select.Option>
              </Select.Content>
            </Select>
          </div>
        </template>
      </PageHeader>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Overall score</ChartCard.Title>
              <Hint
                text="Average of every sample in the period, out of 100. Good is 80 or more, fair 50 to 79, poor under 50."
              />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="overall.band && !loading"
                :label="overall.band.label"
                :severity="overall.band.severity"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <div
              class="grid grid-cols-1 items-center gap-(--spacing-lg) md:grid-cols-[minmax(0,12rem)_1fr]"
            >
              <div
                v-if="loading"
                aria-busy="true"
                class="flex flex-col gap-(--spacing-xs)"
              >
                <Skeleton
                  width="6rem"
                  height="2.5rem"
                />
                <Skeleton
                  width="80%"
                  height="1rem"
                />
              </div>
              <div
                v-else
                class="flex flex-col gap-(--spacing-xxs)"
              >
                <p class="flex items-baseline gap-(--spacing-xxs)">
                  <span class="text-heading-lg tabular-nums text-(--text-default)">
                    {{ overall.score === null ? '—' : formatScore(overall.score) }}
                  </span>
                  <span class="text-body-sm text-(--text-muted)">/ 100</span>
                </p>
                <p
                  v-if="overall.cause"
                  class="text-pretty text-body-sm text-(--text-muted)"
                >
                  Top cause: {{ overall.cause }}
                </p>
              </div>
              <Chart
                v-model:active-index="activeIndex"
                :series="overall.series"
                :labels="hours"
                :min="0"
                :max="100"
                :format-value="formatScore"
                :height="200"
                :empty-title="'No samples in ' + phrase"
                empty-description="Scores appear once devices report their first samples. Select a longer period."
                :loading="loading"
              >
                <Chart.Grid />
                <Chart.Axis kind="y" />
                <Chart.Axis
                  kind="x"
                  :ticks="6"
                />
                <Chart.Line curve="monotone" />
                <Chart.Crosshair />
                <Chart.Tooltip />
              </Chart>
            </div>
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Score per application</ChartCard.Title>
              <Hint text="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="applications"
              sort="ascending"
              :format-value="formatScore"
              :empty-title="'No application samples in ' + phrase"
              :loading="loading"
              aria-label="Score per application"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Score per location</ChartCard.Title>
              <Hint text="Lowest first, with the cause of most poor samples." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <BarList
              :items="locations"
              sort="ascending"
              :color="2"
              :format-value="formatScore"
              :empty-title="'No location samples in ' + phrase"
              :loading="loading"
              aria-label="Score per location"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Hourly score</ChartCard.Title>
              <Hint text="One block per hour for each application, colored by its band." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <ul
              v-if="loading"
              aria-busy="true"
              class="flex flex-col gap-(--spacing-sm)"
            >
              <li
                v-for="index in 4"
                :key="index"
                class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
              >
                <Skeleton
                  width="70%"
                  height="1rem"
                />
                <Tracker
                  :items="[]"
                  loading
                />
                <Skeleton
                  width="3rem"
                  height="1.25rem"
                />
              </li>
            </ul>
            <ul
              v-else-if="hourly.length"
              class="flex flex-col gap-(--spacing-sm)"
            >
              <li
                v-for="application in hourly"
                :key="application.id"
                class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
              >
                <span class="truncate text-label-md text-(--text-default)">{{
                  application.name
                }}</span>
                <Tracker
                  :items="application.blocks"
                  :aria-label="application.name + ', score per hour'"
                />
                <span class="flex md:justify-end">
                  <Tag
                    :label="application.band.label"
                    :severity="application.band.severity"
                    size="small"
                  />
                </span>
              </li>
            </ul>
            <EmptyState
              v-else
              size="small"
              icon="pi pi-chart-bar"
              :title="'No samples in ' + phrase"
              description="Each application gets a row once its first sample arrives. Select a longer period."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>

      <Card
        title="Open incidents"
        :padded="false"
      >
        <template #content>
          <Item.List
            key="item.list-1"
            v-if="loading"
            aria-busy="true"
          >
            <Item
              v-for="index in 3"
              :key="index"
              size="small"
              role="listitem"
            >
              <Item.Media>
                <Skeleton
                  kind="shape"
                  width="2rem"
                  height="2rem"
                />
              </Item.Media>
              <Item.Content>
                <div class="flex flex-col gap-(--spacing-xs)">
                  <Skeleton
                    width="30%"
                    height="1rem"
                  />
                  <Skeleton
                    width="55%"
                    height="0.75rem"
                  />
                </div>
              </Item.Content>
            </Item>
          </Item.List>
          <Item.List
            key="item.list-2"
            v-else-if="incidents.length"
          >
            <Item
              v-for="incident in incidents"
              :key="incident.id"
              size="small"
              role="listitem"
            >
              <Item.Media kind="icon">
                <i
                  :class="incident.icon"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ incident.name }} · {{ incident.cause }}</Item.Title>
                <Item.Description>
                  {{ incident.scope }} · {{ incident.devices }} devices, {{ incident.share }}% of
                  samples · Opened
                  <time :datetime="incident.opened">{{ incident.openedLabel }}</time>
                </Item.Description>
              </Item.Content>
              <Item.Actions>
                <Tag
                  :label="incident.band.label"
                  :severity="incident.band.severity"
                  size="small"
                />
              </Item.Actions>
            </Item>
          </Item.List>
          <div
            v-else
            class="p-(--spacing-md)"
          >
            <EmptyState
              size="small"
              icon="pi pi-check-circle"
              :title="'No open incidents in ' + phrase"
              description="An incident opens when an application or a location stays poor for several samples in a row."
            />
          </div>
        </template>
      </Card>
    </main>
  </div>
</template>

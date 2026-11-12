<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import Field from '@aziontech/webkit/field'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs prior day'
  const timeRange = ref('Last 24 hours')
  const actor = ref('Any actor')
  const outcome = ref('Any outcome')
  const category = ref('Any category')
  const destination = ref('')
  const timeRanges: { value: string; label: string; disabled?: boolean }[] = [
    {
      value: 'Last hour',
      label: 'Last hour'
    },
    {
      value: 'Last 24 hours',
      label: 'Last 24 hours'
    },
    {
      value: 'Last 7 days',
      label: 'Last 7 days'
    },
    {
      value: 'Last 30 days',
      label: 'Last 30 days'
    }
  ]

  const actorOptions: { value: string; label: string; disabled?: boolean }[] = [
    {
      value: 'Any actor',
      label: 'Any actor'
    },
    {
      value: 'report-builder',
      label: 'report-builder'
    },
    {
      value: 'ticket-triage',
      label: 'ticket-triage'
    },
    {
      value: 'inventory-sync',
      label: 'inventory-sync'
    },
    {
      value: 'invoice-reader',
      label: 'invoice-reader'
    },
    {
      value: 'release-helper',
      label: 'release-helper'
    },
    {
      value: 'data-export',
      label: 'data-export'
    },
    {
      value: 'calendar-sync',
      label: 'calendar-sync'
    }
  ]

  const outcomeOptions: { value: string; label: string; disabled?: boolean }[] = [
    {
      value: 'Any outcome',
      label: 'Any outcome'
    },
    {
      value: 'Allowed',
      label: 'Allowed'
    },
    {
      value: 'Blocked',
      label: 'Blocked'
    },
    {
      value: 'Held',
      label: 'Held'
    },
    {
      value: 'Approved',
      label: 'Approved'
    },
    {
      value: 'Denied',
      label: 'Denied'
    }
  ]

  const categoryOptions: { value: string; label: string; disabled?: boolean }[] = [
    {
      value: 'Any category',
      label: 'Any category'
    },
    {
      value: 'Read',
      label: 'Read'
    },
    {
      value: 'Write',
      label: 'Write'
    },
    {
      value: 'Search',
      label: 'Search'
    },
    {
      value: 'Export',
      label: 'Export'
    },
    {
      value: 'Delete',
      label: 'Delete'
    },
    {
      value: 'Admin',
      label: 'Admin'
    }
  ]

  const figures = [
    {
      id: 'requests',
      label: 'Requests',
      description: 'Every request the rules evaluated in the time range.',
      value: null,
      delta: null,
      inverse: false
    },
    {
      id: 'allowed',
      label: 'Allowed',
      description: 'Requests a rule let through to their destination.',
      value: null,
      delta: null,
      inverse: false
    },
    {
      id: 'blocked',
      label: 'Blocked',
      description: 'Requests a rule stopped before they reached their destination.',
      value: null,
      delta: null,
      inverse: true
    },
    {
      id: 'held',
      label: 'Held',
      description: 'Requests a rule paused until someone approves or denies them.',
      value: null,
      delta: null,
      inverse: true
    },
    {
      id: 'approved',
      label: 'Approved',
      description: 'Held requests a reviewer approved.',
      value: null,
      delta: null,
      inverse: false
    },
    {
      id: 'denied',
      label: 'Denied',
      description: 'Held requests a reviewer denied.',
      value: null,
      delta: null,
      inverse: true
    },
    {
      id: 'over-budget',
      label: 'Over budget',
      description: 'Requests that went past the spending or volume budget set for their actor.',
      value: null,
      delta: null,
      inverse: true
    }
  ]

  const rows: unknown[] = []

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })

  const formatCount = (value: number) => compact.format(value)

  const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Request activity"
        description="What each actor requested through the rules: what was allowed, blocked or held for approval, and what went over budget, per actor, category and destination."
      >
        <template #actions>
          <IconButton
            icon="pi pi-refresh"
            kind="outlined"
            size="medium"
            aria-label="Refresh"
          />
        </template>
      </PageHeader>

      <section
        aria-label="Filters"
        class="grid grid-cols-1 items-start gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-5"
      >
        <Field>
          <Field.Label>Time range</Field.Label>
          <Select
            v-model="timeRange"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in timeRanges"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Actor</Field.Label>
          <Select
            v-model="actor"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in actorOptions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Outcome</Field.Label>
          <Select
            v-model="outcome"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in outcomeOptions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Category</Field.Label>
          <Select
            v-model="category"
            size="medium"
          >
            <Select.Trigger />
            <Select.Content>
              <Select.Option
                v-for="option in categoryOptions"
                :key="String(option.value)"
                :value="option.value"
                :disabled="option.disabled"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </Field>
        <Field>
          <Field.Label>Destination</Field.Label>
          <Input
            v-model="destination"
            placeholder="api.example.com"
            size="medium"
          />
          <Field.Description>Exact host.</Field.Description>
        </Field>
      </section>

      <section aria-label="Outcomes">
        <ul class="grid grid-cols-2 gap-(--spacing-md) sm:grid-cols-4 2xl:grid-cols-7">
          <li
            v-for="figure in figures"
            :key="figure.id"
            class="flex min-w-0 flex-col"
          >
            <StatTile
              :label="figure.label"
              :value="figure.value"
              :format-value="formatCount"
              :delta="figure.delta"
              :delta-label="comparison"
              :inverse="figure.inverse"
              :loading="loading"
            >
              <template #aside>
                <Hint :text="figure.description" />
              </template>
            </StatTile>
          </li>
        </ul>
      </section>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Outcomes over time</ChartCard.Title>
              <Hint text="Requests per hour, stacked by the outcome the rules gave them." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load outcomes over time. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Actors</ChartCard.Title>
              <Hint text="Requests per actor, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load actors. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Categories</ChartCard.Title>
              <Hint text="Requests per category of action, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load categories. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Destinations</ChartCard.Title>
              <Hint text="Requests per destination host, every outcome included." />
            </span>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load destinations. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Requests</ChartCard.Title>
              <Hint
                text="The latest requests, newest first, with the rule that decided each one."
              />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="!loading && rows.length"
                :label="rows.length + ' requests'"
                severity="secondary"
                size="small"
              />
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load requests. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </div>
  </div>
</template>

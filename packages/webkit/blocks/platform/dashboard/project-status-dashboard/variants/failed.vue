<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const loading = false
  const comparison = 'vs previous sprint'

  const projects = [
    {
      value: 'product-launch',
      label: 'Product launch'
    },
    {
      value: 'website-redesign',
      label: 'Website redesign'
    },
    {
      value: 'billing-migration',
      label: 'Billing migration'
    }
  ]

  const sprints = [
    {
      value: 'sprint-6',
      label: 'Sprint 6 · Oct 27 to Nov 7'
    },
    {
      value: 'sprint-5',
      label: 'Sprint 5 · Oct 13 to Oct 24'
    },
    {
      value: 'sprint-4',
      label: 'Sprint 4 · Sep 29 to Oct 10'
    }
  ]

  const figures = [
    {
      id: 'completion',
      label: 'Completion',
      description: 'Share of the project’s tasks marked done.',
      value: null,
      format: 'percentage',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'done',
      label: 'Tasks done',
      description: 'Tasks marked done since the project started.',
      value: null,
      format: 'count',
      delta: null,
      inverse: false,
      trend: []
    },
    {
      id: 'open',
      label: 'Open tasks',
      description: 'Tasks not done yet: in progress, blocked or not started.',
      value: null,
      format: 'count',
      delta: null,
      inverse: true,
      trend: []
    },
    {
      id: 'overdue',
      label: 'Overdue',
      description: 'Open tasks past their due date. A rise is a risk to the launch date.',
      value: null,
      format: 'count',
      delta: null,
      inverse: true,
      trend: []
    }
  ]

  const behind = null as { label: string; severity: TagSeverity; icon?: string } | null

  const atRisk: unknown[] = []

  const formatters: Record<string, (value: number) => string> = {
    count: (value: number) => new Intl.NumberFormat('en-US').format(value),
    percentage: (value: number) => `${value.toFixed(0)}%`,
    points: (value: number) => `${value} pts`
  }

  const labelOf = (options: { value: string; label: string }[]) => (value: unknown) =>
    options.find((option) => option.value === value)?.label ?? String(value)

  const project = ref('product-launch')
  const sprint = ref('sprint-6')

  const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Project status"
        description="Progress, milestones and risks for the selected project and sprint."
      >
        <template #actions>
          <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-sm)">
            <div class="w-full sm:w-fit sm:min-w-48">
              <Select
                v-model="project"
                size="medium"
                class="w-full"
                :display-value="labelOf(projects)"
              >
                <Select.Trigger aria-label="Project" />
                <Select.Content>
                  <Select.Option
                    v-for="option in projects"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>
            <div class="w-full sm:w-fit sm:min-w-64">
              <Select
                v-model="sprint"
                size="medium"
                class="w-full"
                :display-value="labelOf(sprints)"
              >
                <Select.Trigger aria-label="Sprint" />
                <Select.Content>
                  <Select.Option
                    v-for="option in sprints"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </div>
          </div>
        </template>
      </PageHeader>

      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 xl:grid-cols-4">
        <li
          v-for="figure in figures"
          :key="figure.id"
          class="flex min-w-0 flex-col"
        >
          <StatTile
            :label="figure.label"
            :value="figure.value"
            :format-value="formatters[figure.format]"
            :delta="figure.delta"
            :delta-label="comparison"
            :inverse="figure.inverse"
            :trend="figure.trend"
            :loading="loading"
          >
            <template #aside>
              <Hint :text="figure.description" />
            </template>
          </StatTile>
        </li>
      </ul>

      <div
        class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
      >
        <ChartCard :span="4">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Completion</ChartCard.Title>
              <Hint text="Every task in the project, by its current status." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    ariaLabel="More options for Completion"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load completion. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="8">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Sprint burndown</ChartCard.Title>
              <Hint
                text="Story points left in the sprint each working day, against a straight line to zero."
              />
            </span>
            <ChartCard.Controls>
              <Tag
                label="Story points"
                severity="secondary"
                size="small"
                icon="pi pi-chart-line"
              />
              <Tag
                v-if="behind && !loading"
                :label="behind.label"
                :severity="behind.severity"
                :icon="behind.icon"
                size="small"
              />
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    ariaLabel="More options for Sprint burndown"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load sprint burndown. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Milestones</ChartCard.Title>
              <Hint text="Dated checkpoints to launch, oldest first." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    ariaLabel="More options for Milestones"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load milestones. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="6">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>At risk</ChartCard.Title>
              <Hint text="Tasks that threaten the next milestone, with the reason." />
            </span>
            <ChartCard.Controls>
              <Tag
                v-if="atRisk.length && !loading"
                :label="atRisk.length + ' open'"
                severity="secondary"
                size="small"
              />
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    ariaLabel="More options for At risk"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load at-risk work. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>

        <ChartCard :span="12">
          <ChartCard.Header>
            <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
              <ChartCard.Title>Owners</ChartCard.Title>
              <Hint text="Tasks per owner. Overdue counts open tasks past their due date." />
            </span>
            <ChartCard.Controls>
              <DropdownMenu placement="bottom-end">
                <DropdownMenu.Trigger>
                  <IconButton
                    icon="pi pi-ellipsis-h"
                    kind="transparent"
                    size="small"
                    ariaLabel="More options for Owners"
                  />
                </DropdownMenu.Trigger>
                <DropdownMenu.Group>
                  <DropdownMenu.Option
                    value="link"
                    label="Copy link"
                  />
                  <DropdownMenu.Option
                    value="export"
                    label="Export CSV"
                  />
                </DropdownMenu.Group>
              </DropdownMenu>
            </ChartCard.Controls>
          </ChartCard.Header>
          <ChartCard.Content>
            <Alert
              severity="danger"
              label="Couldn't load owners. Check your connection and retry."
              action-label="Retry"
              @action="emit('retry')"
            />
          </ChartCard.Content>
        </ChartCard>
      </div>
    </main>
  </div>
</template>

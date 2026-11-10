<script setup>
  import BarList from '@aziontech/webkit/bar-list'
  import CardBox from '@aziontech/webkit/card-box'
  import Chart from '@aziontech/webkit/chart'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tracker from '@aziontech/webkit/tracker'
  import { computed, ref } from 'vue'

  const loading = false
  const period = ref('Last hour')
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
    score: null,
    band: null,
    cause: '',
    series: []
  }

  const applications = []

  const locations = []

  const hourly = []

  const incidents = []

  const formatScore = (value) => value.toFixed(0)
</script>

<template>
  <div class="layout-boundary min-h-dvh bg-(--bg-canvas)">
    <main class="layout-column flex flex-col gap-(--layout-group-gap)">
      <header class="flex flex-wrap items-start justify-between gap-(--spacing-md)">
        <div class="flex min-w-0 grow basis-96 flex-col gap-(--spacing-xxs)">
          <h1 class="text-balance text-heading-sm text-(--text-default)">Experience score</h1>
          <p class="text-pretty text-body-sm text-(--text-muted)">
            How people experience each application: the overall score, the score per application and
            location, each hour of the period and the incidents still open.
          </p>
        </div>
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
      </header>

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
                    {{ overall.score === null ? '–' : formatScore(overall.score) }}
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
                empty-description="Scores appear once devices report their first samples. Choose a longer period."
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
              description="Each application gets a row once its first sample arrives. Choose a longer period."
            />
          </ChartCard.Content>
        </ChartCard>
      </div>

      <CardBox
        title="Open incidents"
        :padded="false"
      >
        <template #content>
          <Item.List
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
          <Item.List v-else-if="incidents.length">
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
      </CardBox>
    </main>
  </div>
</template>

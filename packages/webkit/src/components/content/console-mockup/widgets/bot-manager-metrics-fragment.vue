<script setup lang="ts">
  import { computed } from 'vue'

  import { useMediaQuery } from '../../../../composables/use-media-query'
  import ToggleGroup from '../../../action/toggle-group/toggle-group.vue'
  import Card from '../../card/card.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'

  defineOptions({ name: 'BotManagerMetricsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Bot Manager dashboard switches from Overview to Breakdown while it is, and back after. */
    hovered?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)

  const DASHBOARDS = [
    { label: 'Overview', value: 'overview' },
    { label: 'Breakdown', value: 'breakdown' }
  ]

  const BIG_NUMBERS = [
    {
      label: 'Bad Bot Hits',
      value: '256,081',
      description: 'Number of requests identified as bad bots.'
    },
    {
      label: 'Good Bot Hits',
      value: '222,919',
      description: 'Number of requests identified as good bots.'
    },
    {
      label: 'Bot Hits',
      value: '479,000',
      description: 'Number of requests identified as bots.'
    },
    {
      label: 'Transactions',
      value: '1,842,310',
      description: 'Number of requests evaluated by Azion Bot Manager.'
    }
  ]

  const IMPACTED_URLS = [
    { url: '/login', requests: '118,204', share: 100 },
    { url: '/checkout', requests: '61,950', share: 52 },
    { url: '/api/cart', requests: '40,377', share: 34 },
    { url: '/account/reset', requests: '21,880', share: 19 }
  ]

  const dashboard = computed(() =>
    props.active && (props.hovered || !canHover.value) ? 'breakdown' : 'overview'
  )
</script>

<template>
  <ConsoleMockupShell
    variant="bare"
    shell="legacy"
    fade="bottom"
    class="[--console-mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <ToggleGroup
          :model-value="dashboard"
          :options="DASHBOARDS"
          size="medium"
          fluid
          aria-label="Bot Manager dashboards"
        />
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem :order="1">
        <div class="grid">
          <div
            :data-active="dashboard === 'overview' || null"
            class="col-start-1 row-start-1 grid translate-y-1 grid-cols-2 gap-(--spacing-sm) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance data-active:translate-y-0 data-active:opacity-100 motion-reduce:transition-none"
          >
            <Card
              v-for="metric in BIG_NUMBERS"
              :key="metric.label"
            >
              <template #default>
                <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                      {{ metric.label }}
                    </span>
                    <i
                      class="az az-circle-info text-body-xs leading-none text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="text-heading-sm text-(--text-default)">{{ metric.value }}</span>
                  <span class="text-body-xs text-(--text-muted)">{{ metric.description }}</span>
                </div>
              </template>
            </Card>
          </div>

          <div
            :data-active="dashboard === 'breakdown' || null"
            class="col-start-1 row-start-1 flex translate-y-1 flex-col gap-(--spacing-sm) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance data-active:translate-y-0 data-active:opacity-100 motion-reduce:transition-none"
          >
            <Card>
              <template #default>
                <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                  <span class="text-label-sm text-(--text-default)">Impacted URLs</span>
                  <span class="text-heading-sm text-(--text-default)">38</span>
                  <span class="text-body-xs text-(--text-muted)">
                    Sum of the detected bot actions, broken down by the affected URLs.
                  </span>
                </div>
              </template>
            </Card>
            <Card>
              <template #default>
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <span class="text-label-sm text-(--text-default)">Top Impacted URLs</span>
                  <ul class="flex flex-col gap-(--spacing-xs)">
                    <li
                      v-for="row in IMPACTED_URLS"
                      :key="row.url"
                      class="flex flex-col gap-(--spacing-2xs)"
                    >
                      <span class="flex items-baseline justify-between gap-(--spacing-xs)">
                        <span class="truncate text-body-xs text-(--text-default)">
                          {{ row.url }}
                        </span>
                        <span class="shrink-0 text-body-xs text-(--text-muted)">
                          {{ row.requests }}
                        </span>
                      </span>
                      <span class="h-1.5 rounded-(--shape-control) bg-(--bg-hover)">
                        <span
                          :style="{ width: `${row.share}%` }"
                          class="block h-full rounded-(--shape-control) bg-(--primary)"
                        />
                      </span>
                    </li>
                  </ul>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>

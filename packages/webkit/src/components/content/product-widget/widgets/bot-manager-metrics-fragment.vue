<script setup lang="ts">
  import { computed } from 'vue'

  import SegmentedButton from '../../../actions/segmented-button/segmented-button.vue'
  import CardBox from '../../card-box/card-box.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'

  defineOptions({ name: 'BotManagerMetricsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the Bot Manager dashboard switches from Overview to Breakdown while it is, and back after. */
    hover?: boolean
  }

  const props = withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

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
    props.active && (props.hover || !canHover) ? 'breakdown' : 'overview'
  )
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    fade="bottom"
    class="[--mockup-fade-start:80%]"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex flex-col gap-(--spacing-md) py-(--spacing-xs)">
      <ShellMockupPart :order="0">
        <SegmentedButton
          :model-value="dashboard"
          :options="DASHBOARDS"
          size="medium"
          fluid
          aria-label="Bot Manager dashboards"
        />
      </ShellMockupPart>

      <ShellMockupPart :order="1">
        <div class="grid">
          <div
            :data-shown="dashboard === 'overview' || null"
            class="col-start-1 row-start-1 grid translate-y-1 grid-cols-2 gap-(--spacing-sm) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance data-shown:translate-y-0 data-shown:opacity-100 motion-reduce:transition-none"
          >
            <CardBox
              v-for="metric in BIG_NUMBERS"
              :key="metric.label"
            >
              <template #content>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <span class="flex items-center gap-(--spacing-xs)">
                    <span class="min-w-0 truncate text-label-sm text-(--text-default)">
                      {{ metric.label }}
                    </span>
                    <i
                      class="pi pi-info-circle text-body-xs leading-none text-(--text-muted)"
                      aria-hidden="true"
                    />
                  </span>
                  <span class="text-heading-sm text-(--text-default)">{{ metric.value }}</span>
                  <span class="text-body-xs text-(--text-muted)">{{ metric.description }}</span>
                </div>
              </template>
            </CardBox>
          </div>

          <div
            :data-shown="dashboard === 'breakdown' || null"
            class="col-start-1 row-start-1 flex translate-y-1 flex-col gap-(--spacing-sm) opacity-0 transition-[translate,opacity] duration-moderate-02 ease-productive-entrance data-shown:translate-y-0 data-shown:opacity-100 motion-reduce:transition-none"
          >
            <CardBox>
              <template #content>
                <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                  <span class="text-label-sm text-(--text-default)">Impacted URLs</span>
                  <span class="text-heading-sm text-(--text-default)">38</span>
                  <span class="text-body-xs text-(--text-muted)">
                    Sum of the detected bot actions, broken down by the affected URLs.
                  </span>
                </div>
              </template>
            </CardBox>
            <CardBox>
              <template #content>
                <div class="flex min-w-0 flex-col gap-(--spacing-sm)">
                  <span class="text-label-sm text-(--text-default)">Top Impacted URLs</span>
                  <ul class="flex flex-col gap-(--spacing-xs)">
                    <li
                      v-for="row in IMPACTED_URLS"
                      :key="row.url"
                      class="flex flex-col gap-(--spacing-xxs)"
                    >
                      <span class="flex items-baseline justify-between gap-(--spacing-xs)">
                        <span class="truncate text-body-xs text-(--text-default)">
                          {{ row.url }}
                        </span>
                        <span class="shrink-0 text-body-xs text-(--text-muted)">
                          {{ row.requests }}
                        </span>
                      </span>
                      <span class="h-1.5 rounded-(--shape-elements) bg-(--bg-hover)">
                        <span
                          :style="{ width: `${row.share}%` }"
                          class="block h-full rounded-(--shape-elements) bg-(--primary)"
                        />
                      </span>
                    </li>
                  </ul>
                </div>
              </template>
            </CardBox>
          </div>
        </div>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>

<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'

  import MockupPart from '../MockupPart.vue'
  import ShellMockup, { type ShellMockupFade, type ShellMockupKind } from '../ShellMockup.vue'

  defineOptions({ name: 'WorkloadsListWidget' })

  interface Props {
    /** How the mockup is plated. */
    kind?: ShellMockupKind
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ShellMockupFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    kind: 'window',
    chrome: true,
    width: 860,
    fade: 'none',
    active: true
  })

  interface WorkloadRow {
    name: string
    domain: string
    status: string
    severity: StatusIndicatorSeverity
    loading: boolean
    owner: string
    time: string
  }

  const ROWS: WorkloadRow[] = [
    {
      name: 'storefront-prod',
      domain: 'shop.example.com',
      status: 'Live',
      severity: 'success',
      loading: false,
      owner: 'Maria Costa',
      time: '2 minutes ago'
    },
    {
      name: 'api-gateway',
      domain: 'api.example.com',
      status: 'Live',
      severity: 'success',
      loading: false,
      owner: 'Jonas Ribeiro',
      time: '1 hour ago'
    },
    {
      name: 'checkout-service',
      domain: 'checkout.example.com',
      status: 'Building',
      severity: 'info',
      loading: true,
      owner: 'Alice Lemos',
      time: 'Just now'
    },
    {
      name: 'assets-cdn',
      domain: 'cdn.example.com',
      status: 'Live',
      severity: 'success',
      loading: false,
      owner: 'Alice Lemos',
      time: 'Yesterday'
    },
    {
      name: 'checkout-canary',
      domain: 'canary.example.com',
      status: 'Queued',
      severity: 'neutral',
      loading: false,
      owner: 'Maria Costa',
      time: 'Just now'
    },
    {
      name: 'search-api',
      domain: 'search.example.com',
      status: 'Building',
      severity: 'info',
      loading: true,
      owner: 'Maria Costa',
      time: '12 minutes ago'
    },
    {
      name: 'auth-edge',
      domain: 'auth.example.com',
      status: 'Live',
      severity: 'success',
      loading: false,
      owner: 'Jonas Ribeiro',
      time: 'Yesterday'
    },
    {
      name: 'docs-site',
      domain: 'docs.example.com',
      status: 'Live',
      severity: 'success',
      loading: false,
      owner: 'Carla Nunes',
      time: '2 days ago'
    }
  ]

  const ROW_GRID =
    'grid grid-cols-[1.1fr_6.5rem] items-center gap-(--spacing-sm) md:grid-cols-[1.1fr_1.4fr_6.5rem_1fr]'
</script>

<template>
  <ShellMockup
    :kind="kind"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
    title="Workloads"
  >
    <div class="flex h-full flex-col gap-(--spacing-md) p-(--spacing-lg)">
      <MockupPart :order="0">
        <div class="flex items-center gap-(--spacing-sm)">
          <InputText
            model-value=""
            size="medium"
            placeholder="Search workloads"
            aria-label="Search workloads"
            class="w-60 max-md:flex-1"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
          <span class="ml-auto inline-flex shrink-0">
            <Button
              label="Create Workload"
              kind="outlined"
              size="medium"
              icon="pi pi-plus"
            />
          </span>
        </div>
      </MockupPart>

      <MockupPart
        :order="1"
        class="min-h-0 flex-1"
      >
        <CardBox
          :padded="false"
          class="h-full overflow-hidden"
        >
          <template #content>
            <div
              :class="ROW_GRID"
              class="shrink-0 border-b border-(--border-default) px-(--spacing-md) py-(--spacing-xs) text-label-sm text-(--text-muted)"
            >
              <span>Name</span>
              <span class="hidden md:block">Domains</span>
              <span>Status</span>
              <span class="hidden md:block">Last Modified</span>
            </div>

            <MockupPart
              v-for="(row, index) in ROWS"
              :key="row.name"
              :order="2 + index"
              class="flex flex-1 flex-col"
            >
              <div
                :class="ROW_GRID"
                :data-last="index === ROWS.length - 1 || null"
                class="flex-1 border-b border-(--border-muted) px-(--spacing-md) py-(--spacing-sm) data-last:border-b-0"
              >
                <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <i
                    class="ai ai-workloads shrink-0 text-body-md leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-body-sm text-(--text-default)">{{ row.name }}</span>
                </span>
                <span class="hidden min-w-0 items-center gap-(--spacing-xs) md:flex">
                  <i
                    class="ai ai-domains shrink-0 text-body-md leading-none text-(--text-muted)"
                    aria-hidden="true"
                  />
                  <span class="truncate text-body-sm text-(--text-muted)">{{ row.domain }}</span>
                </span>
                <span class="inline-flex">
                  <StatusIndicator
                    :label="row.status"
                    :severity="row.severity"
                    :loading="row.loading"
                  />
                </span>
                <span class="hidden min-w-0 items-center gap-(--spacing-xs) md:flex">
                  <Avatar
                    :label="row.owner"
                    size="small"
                  />
                  <span class="truncate text-body-sm text-(--text-muted)">{{ row.time }}</span>
                </span>
              </div>
            </MockupPart>
          </template>
        </CardBox>
      </MockupPart>
    </div>
  </ShellMockup>
</template>

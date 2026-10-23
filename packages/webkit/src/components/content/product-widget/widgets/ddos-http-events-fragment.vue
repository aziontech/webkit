<script setup lang="ts">
  import Button from '../../../actions/button/button.vue'
  import IconButton from '../../../actions/icon-button/icon-button.vue'
  import InputText from '../../../inputs/input-text/input-text.vue'
  import ShellMockup from '../../shell-mockup/shell-mockup.vue'
  import ShellMockupPart from '../../shell-mockup/shell-mockup-part/shell-mockup-part.vue'
  import MockupElevator from '../parts/mockup-elevator.vue'

  defineOptions({ name: 'DdosHttpEventsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs through the logged requests only while it is. */
    hover?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = globalThis.matchMedia?.('(hover: hover)').matches ?? true

  const EVENTS = [
    {
      time: 'Oct 16, 2026, 02:14:09 PM',
      requestUri: '/checkout',
      requestMethod: 'GET',
      status: '403',
      httpUserAgent: 'python-requests/2.31.0',
      remoteAddress: '185.220.101.34'
    },
    {
      time: 'Oct 16, 2026, 02:14:09 PM',
      requestUri: '/products/sneakers',
      requestMethod: 'GET',
      status: '200',
      httpUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      remoteAddress: '189.40.72.18'
    },
    {
      time: 'Oct 16, 2026, 02:14:08 PM',
      requestUri: '/api/cart',
      requestMethod: 'POST',
      status: '403',
      httpUserAgent: 'Go-http-client/1.1',
      remoteAddress: '45.142.212.61'
    },
    {
      time: 'Oct 16, 2026, 02:14:08 PM',
      requestUri: '/checkout',
      requestMethod: 'GET',
      status: '403',
      httpUserAgent: 'python-requests/2.31.0',
      remoteAddress: '185.220.101.47'
    },
    {
      time: 'Oct 16, 2026, 02:14:07 PM',
      requestUri: '/',
      requestMethod: 'GET',
      status: '200',
      httpUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      remoteAddress: '177.92.14.205'
    },
    {
      time: 'Oct 16, 2026, 02:14:07 PM',
      requestUri: '/checkout',
      requestMethod: 'GET',
      status: '403',
      httpUserAgent: 'curl/8.4.0',
      remoteAddress: '103.251.167.10'
    }
  ]

  const summary = (index: number) => {
    const event = EVENTS[index]
    return [
      { key: 'configurationId', value: '1790219143' },
      { key: 'host', value: 'shop.example.com' },
      { key: 'requestUri', value: event.requestUri },
      { key: 'requestMethod', value: event.requestMethod },
      { key: 'status', value: event.status },
      { key: 'httpReferer', value: '-' },
      { key: 'httpUserAgent', value: event.httpUserAgent },
      { key: 'remoteAddress', value: event.remoteAddress }
    ]
  }
</script>

<template>
  <ShellMockup
    kind="bare"
    shell="legacy"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex h-full flex-col gap-(--spacing-sm) py-(--spacing-xs)">
      <ShellMockupPart :order="0">
        <div class="flex flex-col gap-(--spacing-xs)">
          <span class="flex items-center gap-(--spacing-xs)">
            <IconButton
              icon="pi pi-filter"
              kind="outlined"
              size="small"
              ariaLabel="Filter"
            />
            <span class="min-w-0 flex-1">
              <InputText
                placeholder="Filter using Azion Query Language syntax..."
                size="small"
                readonly
                aria-label="Filter"
              />
            </span>
          </span>
          <span class="flex items-center gap-(--spacing-xs)">
            <span
              class="flex h-7 items-center gap-(--spacing-xs) rounded-(--shape-button) border border-(--border-default) px-(--spacing-sm)"
            >
              <i
                class="pi pi-calendar text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="text-body-xs text-(--text-default)">Last 5 minutes</span>
            </span>
            <Button
              label="Refresh"
              icon="pi pi-refresh"
              kind="outlined"
              size="small"
            />
            <span
              class="ml-auto flex h-7 items-center rounded-(--shape-button) border border-(--border-default) px-(--spacing-sm) text-body-xs text-(--text-default)"
            >
              1000 records found
            </span>
          </span>
        </div>
      </ShellMockupPart>

      <ShellMockupPart
        :order="1"
        class="min-h-0 flex-1"
      >
        <div class="flex h-full flex-col rounded-(--shape-card) border border-(--border-default)">
          <span
            class="flex items-center gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
          >
            <span class="w-24 shrink-0 text-label-sm text-(--text-default)">Time</span>
            <span class="text-label-sm text-(--text-default)">Log Body</span>
          </span>
          <div class="min-h-0 flex-1 px-(--spacing-md)">
            <MockupElevator
              :count="EVENTS.length"
              :active="hover || !canHover"
            >
              <template #default="{ index }">
                <div class="flex items-start gap-(--spacing-sm) py-(--spacing-xxs)">
                  <span class="w-24 shrink-0 text-body-xs text-(--text-muted)">
                    {{ EVENTS[index].time }}
                  </span>
                  <span
                    class="line-clamp-3 min-w-0 flex-1 break-all text-body-code-sm text-(--text-default)"
                  >
                    <span
                      v-for="field in summary(index)"
                      :key="field.key"
                      class="mr-(--spacing-sm)"
                    >
                      <span class="bg-(--bg-surface-raised)">{{ field.key }}:</span>
                      <span class="ml-(--spacing-xxs)">{{ field.value }}</span>
                    </span>
                  </span>
                </div>
              </template>
            </MockupElevator>
          </div>
        </div>
      </ShellMockupPart>
    </div>
  </ShellMockup>
</template>

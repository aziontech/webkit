<script setup lang="ts">
  import { useMediaQuery } from '../../../../composables/use-media-query'
  import Button from '../../../action/button/button.vue'
  import IconButton from '../../../action/icon-button/icon-button.vue'
  import Input from '../../../input/input/input.vue'
  import ConsoleMockupShell from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'
  import MockupElevator from '../parts/mockup-elevator.vue'

  defineOptions({ name: 'DdosHttpEventsFragment' })

  interface Props {
    /** Whether this fragment is the one showing. */
    active?: boolean
    /** Whether the pointer is over the fragment's card; the elevator runs through the logged requests only while it is. */
    hovered?: boolean
  }

  withDefaults(defineProps<Props>(), { active: true, hover: false })

  const canHover = useMediaQuery('(hover: hover)', true)

  const EVENTS = [
    {
      time: 'Oct 16, 2026, 02:14:09 PM',
      requestUri: '/checkout',
      requestMethod: 'GET',
      status: '403',
      httpUserAgent: 'python-requests/2.31.0',
      remoteAddress: '203.0.113.34'
    },
    {
      time: 'Oct 16, 2026, 02:14:09 PM',
      requestUri: '/products/sneakers',
      requestMethod: 'GET',
      status: '200',
      httpUserAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)',
      remoteAddress: '198.51.100.18'
    },
    {
      time: 'Oct 16, 2026, 02:14:08 PM',
      requestUri: '/api/cart',
      requestMethod: 'POST',
      status: '403',
      httpUserAgent: 'Go-http-client/1.1',
      remoteAddress: '203.0.113.61'
    },
    {
      time: 'Oct 16, 2026, 02:14:08 PM',
      requestUri: '/checkout',
      requestMethod: 'GET',
      status: '403',
      httpUserAgent: 'python-requests/2.31.0',
      remoteAddress: '203.0.113.47'
    },
    {
      time: 'Oct 16, 2026, 02:14:07 PM',
      requestUri: '/',
      requestMethod: 'GET',
      status: '200',
      httpUserAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      remoteAddress: '198.51.100.205'
    },
    {
      time: 'Oct 16, 2026, 02:14:07 PM',
      requestUri: '/checkout',
      requestMethod: 'GET',
      status: '403',
      httpUserAgent: 'curl/8.4.0',
      remoteAddress: '192.0.2.10'
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
  <ConsoleMockupShell
    variant="bare"
    shell="legacy"
    :chrome="false"
    :active="active"
    :width="420"
    :mobile-width="380"
  >
    <div class="flex h-full flex-col gap-(--spacing-sm) py-(--spacing-xs)">
      <ConsoleMockupShellItem :order="0">
        <div class="flex flex-col gap-(--spacing-xs)">
          <span class="flex items-center gap-(--spacing-xs)">
            <IconButton
              icon="ai ai-filter"
              variant="outline"
              size="small"
              ariaLabel="Filter"
            />
            <span class="min-w-0 flex-1">
              <Input
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
                class="ai ai-calendar text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="text-body-xs text-(--text-default)">Last 5 minutes</span>
            </span>
            <Button
              label="Refresh"
              icon="ai ai-refresh"
              variant="outline"
              size="small"
            />
            <span
              class="ms-auto flex h-7 items-center rounded-(--shape-button) border border-(--border-default) px-(--spacing-sm) text-body-xs text-(--text-default)"
            >
              1000 records found
            </span>
          </span>
        </div>
      </ConsoleMockupShellItem>

      <ConsoleMockupShellItem
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
              :active="hovered || !canHover"
            >
              <template #default="{ index }">
                <div class="flex items-start gap-(--spacing-sm) py-(--spacing-2xs)">
                  <span class="w-24 shrink-0 text-body-xs text-(--text-muted)">
                    {{ EVENTS[index].time }}
                  </span>
                  <span
                    class="line-clamp-3 min-w-0 flex-1 break-all text-body-code-sm text-(--text-default)"
                  >
                    <span
                      v-for="field in summary(index)"
                      :key="field.key"
                      class="me-(--spacing-sm)"
                    >
                      <span class="bg-(--bg-surface-raised)">{{ field.key }}:</span>
                      <span class="ms-(--spacing-2xs)">{{ field.value }}</span>
                    </span>
                  </span>
                </div>
              </template>
            </MockupElevator>
          </div>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>

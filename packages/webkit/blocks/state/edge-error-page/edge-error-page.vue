<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import FlowDiagram from '@aziontech/webkit/flow-diagram'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusCode from '@aziontech/webkit/status-code'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Timestamp from '@aziontech/webkit/timestamp'
  import { computed, useId } from 'vue'

  /** The way back the primary button offers: reload the address, or open the site's home page. */
  export type EdgeErrorPageRecovery = 'retry' | 'home'

  /** The state of one hop of the request path. */
  export interface EdgeErrorPageHopState {
    /** The status label, in a word or two (Working, Error, Blocked). */
    status: string
    /** The colour of the status dot. */
    severity: StatusIndicatorSeverity
  }

  /** The state of the three hops a request crosses: the visitor, Azion's edge and the site's origin server. */
  export interface EdgeErrorPagePath {
    /** The visitor's browser. */
    visitor: EdgeErrorPageHopState
    /** The Azion edge location that answered. */
    edge: EdgeErrorPageHopState
    /** The site's own server. */
    origin: EdgeErrorPageHopState
  }

  export interface EdgeErrorPageProps {
    /** HTTP status code of the response. */
    code?: number
    /** The status reason phrase shown beside the code (Bad gateway). */
    reason?: string
    /** What happened, in the visitor's words. */
    title?: string
    /** The answer to What happened. */
    cause?: string
    /** The answer to What can I do; never an account action, the visitor has no account. */
    advice?: string
    /** The host the visitor asked for. */
    host?: string
    /** The ID of the request, to quote to the site owner. */
    requestId?: string
    /** When the request was answered, as an ISO string. */
    time?: string
    /** The code of the Azion edge location that answered (IAD). */
    location?: string
    /** The state of each hop of the request path. */
    path?: EdgeErrorPagePath
    /** The primary way back: Try again reloads the address, Go to home page opens the site's root. */
    recovery?: EdgeErrorPageRecovery
  }

  const props = withDefaults(defineProps<EdgeErrorPageProps>(), {
    code: 502,
    reason: 'Bad gateway',
    title: "The site's server could not be reached",
    cause:
      "Azion's edge received your request, but the server that hosts this site did not accept the connection.",
    advice:
      'Try again in a few minutes. If it keeps happening, let the site owner know and quote the request ID below.',
    host: 'www.example.com',
    requestId: '8f3c91ab2e4d7a10',
    time: '2026-11-18T14:02:11Z',
    location: 'IAD',
    path: () => ({
      visitor: { status: 'Working', severity: 'success' },
      edge: { status: 'Working', severity: 'success' },
      origin: { status: 'Error', severity: 'danger' }
    }),
    recovery: 'retry'
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    back: [event: MouseEvent]
  }>()

  const pathId = useId()

  const hops = computed(() => [
    { key: 'visitor', name: 'You', detail: 'Browser', ...props.path.visitor },
    { key: 'edge', name: 'Azion edge', detail: props.location, ...props.path.edge },
    { key: 'origin', name: 'Origin', detail: props.host, ...props.path.origin }
  ])

  const homeHref = computed(() => `https://${props.host}/`)

  const onRetry = (event: MouseEvent) => {
    emit('retry', event)
    if (!event.defaultPrevented) globalThis.location.reload()
  }

  const onBack = (event: MouseEvent) => {
    emit('back', event)
    if (!event.defaultPrevented) globalThis.history.back()
  }
</script>

<template>
  <div class="flex min-h-dvh w-full flex-col bg-(--bg-canvas) text-(--text-default)">
    <main
      class="mx-auto flex w-full max-w-(--container-4xl) flex-1 flex-col gap-(--spacing-xl) px-(--spacing-md) py-(--spacing-2xl) md:px-(--spacing-xl)"
    >
      <header class="flex flex-col items-start gap-(--spacing-sm)">
        <p class="m-0 flex flex-wrap items-center gap-(--spacing-xs)">
          <StatusCode :code="code" />
          <span class="text-label-md text-(--text-muted)">{{ reason }}</span>
        </p>
        <h1 class="m-0 text-heading-lg text-(--text-default)">{{ title }}</h1>
      </header>

      <section
        :aria-labelledby="pathId"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <h2
          :id="pathId"
          class="m-0 text-label-md text-(--text-muted)"
        >
          Request path
        </h2>
        <div class="-mx-(--spacing-md) hidden md:block">
          <FlowDiagram uniform>
            <FlowDiagram.Node
              v-for="hop in hops"
              :key="hop.key"
            >
              <span
                :data-hop="hop.key"
                class="flex w-full min-w-0 flex-col items-start gap-(--spacing-2xs)"
              >
                <span class="text-label-md text-(--text-default)">{{ hop.name }}</span>
                <bdi class="text-body-xs text-(--text-muted)">{{ hop.detail }}</bdi>
                <StatusIndicator
                  :severity="hop.severity"
                  :label="hop.status"
                />
              </span>
            </FlowDiagram.Node>
          </FlowDiagram>
        </div>
        <ol class="m-0 flex list-none flex-col p-0 md:hidden">
          <li
            v-for="(hop, index) in hops"
            :key="hop.key"
            class="flex flex-col"
          >
            <span
              v-if="index > 0"
              aria-hidden="true"
              class="ms-(--spacing-lg) h-(--spacing-md) w-px border-s border-dashed border-(--accent)"
            />
            <span
              :data-hop="hop.key"
              class="flex items-center justify-between gap-(--spacing-sm) rounded-(--shape-button) border border-(--border-default) bg-(--bg-surface-raised) px-(--spacing-md) py-(--spacing-sm) shadow-(--shadow-xs)"
            >
              <span class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                <span class="text-label-md text-(--text-default)">{{ hop.name }}</span>
                <bdi class="truncate text-body-xs text-(--text-muted)">{{ hop.detail }}</bdi>
              </span>
              <StatusIndicator
                :severity="hop.severity"
                :label="hop.status"
              />
            </span>
          </li>
        </ol>
      </section>

      <div class="grid gap-(--spacing-lg) md:grid-cols-2">
        <section class="flex flex-col gap-(--spacing-xs)">
          <h2 class="m-0 text-heading-2xs text-(--text-default)">What happened?</h2>
          <p class="m-0 text-body-sm text-(--text-muted)">{{ cause }}</p>
        </section>
        <section class="flex flex-col gap-(--spacing-xs)">
          <h2 class="m-0 text-heading-2xs text-(--text-default)">What can I do?</h2>
          <p class="m-0 text-body-sm text-(--text-muted)">{{ advice }}</p>
        </section>
      </div>

      <div class="flex flex-wrap items-center gap-(--spacing-xs)">
        <Button
          key="retry"
          v-if="recovery === 'retry'"
          label="Try again"
          variant="primary"
          size="medium"
          icon="az az-refresh"
          @click="onRetry"
        />
        <Button
          key="home"
          v-else
          label="Go to home page"
          variant="primary"
          size="medium"
          icon="az az-home"
          :href="homeHref"
        />
        <Button
          label="Go back"
          variant="outline"
          size="medium"
          icon="az az-arrow-left"
          @click="onBack"
        />
      </div>

      <div class="border-t border-(--border-default) pt-(--spacing-lg)">
        <KeyValueList
          :columns="2"
          aria-label="Request details"
        >
          <KeyValueList.Item label="Request ID">
            <bdi class="text-label-code-sm text-(--text-default)">{{ requestId }}</bdi>
            <CopyButton
              :value="requestId"
              aria-label="Copy the request ID"
              copied-label="Request ID copied"
              size="small"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Time">
            <Timestamp
              :value="time"
              format="utc"
            />
          </KeyValueList.Item>
          <KeyValueList.Item label="Edge location">{{ location }}</KeyValueList.Item>
          <KeyValueList.Item label="Host">
            <bdi>{{ host }}</bdi>
          </KeyValueList.Item>
        </KeyValueList>
      </div>
    </main>
    <footer
      class="flex items-center justify-center gap-(--spacing-xs) border-t border-(--border-default) px-(--spacing-md) py-(--spacing-md) text-body-xs text-(--text-muted)"
    >
      Served by
      <Brand size="small" />
    </footer>
  </div>
</template>

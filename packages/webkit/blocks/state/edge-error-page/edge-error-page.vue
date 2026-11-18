<script setup lang="ts">
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'
  import TopologyDiagram, {
    type TopologyDiagramLevel,
    type TopologyDiagramNodeSeverity
  } from '@aziontech/webkit/topology-diagram'
  import { computed, useId } from 'vue'

  /** The way back the primary button offers: reload the address, or open the site's home page. */
  export type EdgeErrorPageRecovery = 'retry' | 'home'

  /** The state of one hop of the request path. */
  export interface EdgeErrorPageHopState {
    /** The status label, in a word or two (Working, Error, Blocked). */
    status: string
    /** The colour of the status tag. */
    severity: TopologyDiagramNodeSeverity
  }

  /** The state of the three hops a request crosses: the visitor, Azion's infrastructure and the site's application. */
  export interface EdgeErrorPagePath {
    /** The visitor's browser. */
    visitor: EdgeErrorPageHopState
    /** The Azion location that answered. */
    azion: EdgeErrorPageHopState
    /** The site's application, on Azion's infrastructure or on the site's own servers. */
    application: EdgeErrorPageHopState
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
    /** The code of the Azion location that answered (IAD). */
    location?: string
    /** The state of each hop of the request path. */
    path?: EdgeErrorPagePath
    /** The primary way back: Try again reloads the address, Go to home page opens the site's root. */
    recovery?: EdgeErrorPageRecovery
  }

  const props = withDefaults(defineProps<EdgeErrorPageProps>(), {
    code: 502,
    reason: 'Bad gateway',
    title: "The site's application could not be reached",
    cause:
      'Azion received your request, but the application that serves this site did not accept the connection.',
    advice:
      'Try again in a few minutes. If it keeps happening, let the site owner know and quote the request ID below.',
    host: 'www.example.com',
    requestId: '8f3c91ab2e4d7a10',
    time: '2026-11-18T14:02:11Z',
    location: 'IAD',
    path: () => ({
      visitor: { status: 'Working', severity: 'success' },
      azion: { status: 'Working', severity: 'success' },
      application: { status: 'Error', severity: 'danger' }
    }),
    recovery: 'retry'
  })

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    back: [event: MouseEvent]
  }>()

  const pathId = useId()

  const hops = computed(() => [
    {
      key: 'visitor',
      type: 'You',
      icon: 'az az-user',
      name: 'Browser',
      message: 'Your browser, where the request started.',
      ...props.path.visitor
    },
    {
      key: 'azion',
      type: 'Azion',
      icon: 'az az-azion',
      name: props.location,
      message: 'The Azion location that received your request and answered with this page.',
      ...props.path.azion
    },
    {
      key: 'application',
      type: 'Application',
      icon: 'az az-applications',
      name: props.host,
      message:
        "The application that serves this site, on Azion's infrastructure or on the site's own servers.",
      ...props.path.application
    }
  ])

  const levels = computed<TopologyDiagramLevel[]>(() =>
    hops.value.map(({ key, ...hop }, index) => ({
      id: key,
      nodes: [{ id: key, terminal: index === hops.value.length - 1, ...hop }]
    }))
  )

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

      <div class="flex flex-col gap-(--spacing-sm)">
        <h2
          :id="pathId"
          class="m-0 text-label-md text-(--text-muted)"
        >
          Request path
        </h2>
        <div class="-mx-(--spacing-md) hidden lg:block">
          <TopologyDiagram
            :levels="levels"
            :aria-labelledby="pathId"
            data-testid="edge-error-page__path"
          />
        </div>
        <div class="-mx-(--spacing-md) lg:hidden">
          <TopologyDiagram
            :levels="levels"
            orientation="vertical"
            :aria-labelledby="pathId"
            data-testid="edge-error-page__path-stacked"
          />
        </div>
      </div>

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
          <KeyValueList.Item label="Azion location">{{ location }}</KeyValueList.Item>
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

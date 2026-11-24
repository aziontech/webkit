<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import CopyButton from '@aziontech/webkit/copy-button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import StatusCode from '@aziontech/webkit/status-code'
  import Timestamp from '@aziontech/webkit/timestamp'

  export interface StateErrorPageProps {
    /** HTTP status code the page answers with. */
    code?: number
    /** Machine-readable error code shown in the reference line (NOT_FOUND). */
    errorCode?: string
    /** What happened, in the user's words. */
    title?: string
    /** Why it may have happened and what to do next, in one sentence. */
    description?: string
    /** The ID of the failed request, to quote to support. */
    requestId?: string
    /** When the request failed, as an ISO string. */
    time?: string
    /** Where Go to home goes. */
    homeHref?: string
    /** Where Docs goes; it opens in a new tab. */
    docsHref?: string
  }

  withDefaults(defineProps<StateErrorPageProps>(), {
    code: 404,
    errorCode: 'NOT_FOUND',
    title: 'Page not found',
    description: 'There is nothing at this address. Check the URL or head back to the start.',
    requestId: 'req_7f3c91ab',
    time: '2026-11-18T14:02:11Z',
    homeHref: '/',
    docsHref: 'https://example.com/docs'
  })

  const emit = defineEmits<{
    home: [event: MouseEvent]
  }>()

  defineSlots<{
    /** Replaces Go to home and Docs; two buttons at most. */
    actions(): unknown
  }>()
</script>

<template>
  <div
    class="flex w-full flex-1 flex-col items-center justify-center px-(--spacing-md) py-(--spacing-xl)"
  >
    <h1 class="sr-only">Error {{ code }}</h1>
    <div class="w-full max-w-(--container-md)">
      <EmptyState
        :title="title"
        :description="description"
      >
        <template #icon>
          <StatusCode :code="code" />
        </template>
        <template #actions>
          <div class="flex flex-wrap items-center justify-center gap-(--spacing-xs)">
            <slot name="actions">
              <Button
                label="Go to home"
                variant="primary"
                size="medium"
                icon="az az-home"
                :href="homeHref"
                @click="(event: MouseEvent) => emit('home', event)"
              />
              <Button
                label="Docs"
                aria-label="Docs (opens in a new tab)"
                variant="outline"
                icon="az az-book"
                size="medium"
                :href="docsHref"
                target="_blank"
              />
            </slot>
          </div>
          <div
            class="flex flex-col items-center gap-(--spacing-2xs) text-body-xs text-(--text-muted)"
          >
            <p
              class="m-0 flex flex-col items-center justify-center gap-x-(--spacing-xs) gap-y-(--spacing-2xs) sm:flex-row sm:flex-wrap"
              data-testid="state-error-page__reference"
            >
              <span>
                Code <bdi class="text-label-code-sm text-(--text-default)">{{ errorCode }}</bdi>
              </span>
              <span
                aria-hidden="true"
                class="hidden sm:inline"
                data-testid="state-error-page__separator"
                >·</span
              >
              <span class="inline-flex items-center gap-(--spacing-2xs)">
                ID <bdi class="text-label-code-sm text-(--text-default)">{{ requestId }}</bdi>
                <CopyButton
                  :value="requestId"
                  aria-label="Copy the request ID"
                  copied-label="Request ID copied"
                  size="small"
                />
              </span>
            </p>
            <Timestamp
              :value="time"
              format="utc"
            />
          </div>
        </template>
      </EmptyState>
    </div>
  </div>
</template>

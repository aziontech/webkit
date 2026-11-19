<script setup lang="ts">
  import { defaultWindow, useEventListener } from '@vueuse/core'
  import { computed, onScopeDispose, ref, useAttrs, watch } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import Alert from '../../feedback/alert/alert.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import {
    buildSrcdoc,
    clampHeight,
    decodeBlob,
    isHttpsUrl,
    isInlineHtml,
    isSizeMessage,
    readMessage,
    readSize,
    startHeight
  } from './lib/sandbox'

  defineOptions({
    name: 'McpAppFrame',
    inheritAttrs: false
  })

  /** A UI resource a tool returned: its uri, its MIME type, and the HTML as text or a base64 blob. */
  export interface McpAppFrameResource {
    /** Resource address, such as a ui:// uri. */
    uri: string
    /** MIME type, such as text/html;profile=mcp-app. */
    mimeType: string
    /** The HTML as text. */
    text?: string
    /** The HTML as base64 UTF-8. */
    blob?: string
  }

  /** An MCP-UI message. */
  export interface McpAppFrameUiMessage {
    /** Message type, 1 to 128 characters. */
    type: string
    /** Message data. */
    payload?: Record<string, unknown>
    /** Id the reply refers to. */
    messageId?: string
  }

  /** An MCP Apps JSON-RPC 2.0 message. */
  export interface McpAppFrameRpcMessage {
    /** Protocol version, always 2.0. */
    jsonrpc: '2.0'
    /** Request id; absent on a notification. */
    id?: string | number
    /** Method name of a request or notification. */
    method?: string
    /** Request or notification parameters. */
    params?: Record<string, unknown> | unknown[]
    /** Result of a successful response. */
    result?: unknown
    /** Error of a failed response. */
    error?: Record<string, unknown>
  }

  /** A message exchanged with the widget. */
  export type McpAppFrameMessage = McpAppFrameUiMessage | McpAppFrameRpcMessage

  export interface McpAppFrameProps {
    /** The UI resource the tool returned: its uri, mimeType, and the HTML as text or base64 blob. */
    resource: McpAppFrameResource
    /** Accessible name of the widget, announced before its content. */
    title: string
    /** Turns a resource that is not inline HTML into an https URL the frame may load; return an empty string to block it. Without it such resources are blocked. */
    resolveUrl?: (resource: McpAppFrameResource) => string | Promise<string>
    /** Largest height in pixels the widget may grow the frame to; 48 is the floor. */
    maxHeight?: number
  }

  type McpAppFramePhase = 'loading' | 'ready' | 'error'

  const props = withDefaults(defineProps<McpAppFrameProps>(), {
    resolveUrl: undefined,
    maxHeight: 640
  })

  const emit = defineEmits<{
    /** A message the widget sent, validated and rebuilt from its known keys; size messages are not emitted. */
    message: [message: McpAppFrameMessage]
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ mcpAppFrame: en.mcpAppFrame })

  const iframeEl = ref<HTMLIFrameElement | null>(null)
  const phase = ref<McpAppFramePhase>('loading')
  const documentKey = ref(0)
  const srcdoc = ref('')
  const src = ref('')
  const height = ref(startHeight(props.maxHeight))
  let loadCount = 0
  let canPost = false
  let runToken = 0
  let disposed = false

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'mcp-app-frame'
  )

  const contentKey = computed(() =>
    JSON.stringify([
      props.resource.uri,
      props.resource.mimeType,
      props.resource.text ?? null,
      props.resource.blob ?? null
    ])
  )

  const hasDocument = computed(() => srcdoc.value !== '' || src.value !== '')

  const viewStyle = computed(() => ({
    '--mcp-app-frame-view-height': `${height.value}px`
  }))

  watch(
    contentKey,
    () => {
      void start()
    },
    { immediate: true }
  )

  watch(
    () => props.maxHeight,
    (maxHeight) => {
      height.value = clampHeight(height.value, maxHeight)
    }
  )

  useEventListener(defaultWindow, 'message', onMessage)

  onScopeDispose(() => {
    disposed = true
    runToken += 1
    canPost = false
  })

  function reset(): void {
    phase.value = 'loading'
    srcdoc.value = ''
    src.value = ''
    height.value = startHeight(props.maxHeight)
    loadCount = 0
    canPost = false
  }

  function fail(): void {
    phase.value = 'error'
    srcdoc.value = ''
    src.value = ''
    canPost = false
  }

  function readInlineHtml(resource: McpAppFrameResource): string {
    return typeof resource.text === 'string' ? resource.text : decodeBlob(resource.blob ?? '')
  }

  async function start(): Promise<void> {
    runToken += 1
    const token = runToken
    reset()
    const resource = props.resource

    if (isInlineHtml(resource)) {
      let html: string
      try {
        html = readInlineHtml(resource)
      } catch {
        fail()
        return
      }
      documentKey.value += 1
      srcdoc.value = buildSrcdoc(html)
      return
    }

    const resolveUrl = props.resolveUrl
    if (!resolveUrl) {
      fail()
      return
    }

    let url: string
    try {
      url = await resolveUrl(resource)
    } catch {
      if (token === runToken && !disposed) fail()
      return
    }

    if (token !== runToken || disposed) return
    if (!isHttpsUrl(url)) {
      fail()
      return
    }
    documentKey.value += 1
    src.value = url
  }

  function onLoad(): void {
    if (phase.value === 'error') return
    loadCount += 1
    if (loadCount === 1) {
      phase.value = 'ready'
      canPost = true
      return
    }
    fail()
  }

  function onMessage(event: MessageEvent): void {
    if (phase.value === 'error') return
    const view = iframeEl.value?.contentWindow
    if (!view || event.source !== view || event.origin !== 'null') return
    const message = readMessage(event.data)
    if (!message) return
    canPost = true
    if (isSizeMessage(message)) {
      const size = readSize(message)
      if (size !== null) height.value = clampHeight(size, props.maxHeight)
      return
    }
    emit('message', message)
  }

  function post(message: McpAppFrameMessage): void {
    if (!canPost || phase.value === 'error') return
    iframeEl.value?.contentWindow?.postMessage(message, '*')
  }

  defineExpose({
    /** Sends a message to the current widget's window with the target origin star; dropped before the widget is ready, while blocked and after it navigated away. */
    post
  })
</script>

<template>
  <div
    v-bind="$attrs"
    class="relative w-full overflow-hidden rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) focus-within:ring-2 focus-within:ring-(--ring-color) data-[error]:overflow-visible data-[error]:border-0 data-[error]:bg-transparent"
    :style="viewStyle"
    :data-testid="testId"
    :data-loading="phase === 'loading' || null"
    :data-error="phase === 'error' || null"
    :aria-busy="phase === 'loading' ? 'true' : undefined"
  >
    <Alert
      v-if="phase === 'error'"
      severity="warning"
      :title="t('mcpAppFrame.errorTitle', { title })"
      :label="t('mcpAppFrame.errorDescription')"
      :data-testid="`${testId}__error`"
    />
    <div
      v-else
      class="relative h-(--mcp-app-frame-view-height)"
    >
      <iframe
        v-if="hasDocument"
        ref="iframeEl"
        :key="documentKey"
        :title="title"
        sandbox="allow-scripts"
        referrerpolicy="no-referrer"
        allow=""
        loading="lazy"
        :srcdoc="srcdoc || undefined"
        :src="src || undefined"
        class="block h-full w-full border-0"
        :data-testid="`${testId}__view`"
        @load="onLoad"
      />
      <Skeleton
        v-if="phase === 'loading'"
        width="100%"
        height="100%"
        class="absolute inset-0"
        :data-testid="`${testId}__loading`"
      />
    </div>
    <span
      role="status"
      class="sr-only"
    >
      {{ phase === 'loading' ? t('mcpAppFrame.loading', { title }) : '' }}
    </span>
  </div>
</template>

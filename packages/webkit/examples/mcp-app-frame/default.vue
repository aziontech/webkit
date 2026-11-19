<script setup>
  import McpAppFrame from '@aziontech/webkit/mcp-app-frame'
  import { ref } from 'vue'

  const widget = `<style>
  :root { color-scheme: light dark; }
  body { margin: 0; padding: 16px; font: 14px/1.5 system-ui, sans-serif; }
  p { margin: 0 0 12px; }
</style>
<p>Acme Pro adds 10 workloads and priority support for $49 a month.</p>
<button id="choose" type="button">Choose the Pro plan</button>
<p id="result" role="status"></p>
<script>
  let next = 1
  const waiting = new Map()
  const send = (message) => parent.postMessage({ jsonrpc: '2.0', ...message }, '*')
  const request = (method, params) =>
    new Promise((resolve) => {
      const id = next++
      waiting.set(id, resolve)
      send({ id, method, params })
    })
  addEventListener('message', (event) => {
    const reply = event.data
    if (reply && waiting.has(reply.id)) {
      waiting.get(reply.id)(reply)
      waiting.delete(reply.id)
    }
  })
  const report = () =>
    send({
      method: 'ui/notifications/size-changed',
      params: { width: document.body.scrollWidth, height: document.documentElement.scrollHeight }
    })
  request('ui/initialize', {
    protocolVersion: '2026-01-26',
    appCapabilities: {},
    clientInfo: { name: 'plan-picker', version: '1.0.0' }
  }).then(() => {
    send({ method: 'ui/notifications/initialized', params: {} })
    report()
  })
  document.getElementById('choose').addEventListener('click', () => {
    request('tools/call', { name: 'select_plan', arguments: { plan: 'pro' } }).then((reply) => {
      document.getElementById('result').textContent = reply.error
        ? reply.error.message
        : reply.result.content[0].text
      report()
    })
  })
<${'/'}script>`

  const resource = {
    uri: 'ui://billing/plan-picker',
    mimeType: 'text/html;profile=mcp-app',
    text: widget
  }

  const allowedTools = ['select_plan']
  const frame = ref(null)
  const requests = ref([])

  const onMessage = (message) => {
    if (!('jsonrpc' in message) || message.id === undefined) return
    requests.value = [...requests.value, message.method ?? 'response']
    if (message.method === 'ui/initialize') {
      frame.value?.post({
        jsonrpc: '2.0',
        id: message.id,
        result: {
          protocolVersion: '2026-01-26',
          hostInfo: { name: 'Acme console', version: '1.0.0' },
          hostCapabilities: {},
          hostContext: {}
        }
      })
      return
    }
    if (message.method === 'tools/call') {
      const allowed = allowedTools.includes(String(message.params?.name))
      frame.value?.post(
        allowed
          ? {
              jsonrpc: '2.0',
              id: message.id,
              result: { content: [{ type: 'text', text: 'Pro plan selected for Acme Inc.' }] }
            }
          : {
              jsonrpc: '2.0',
              id: message.id,
              error: { code: -32000, message: 'This tool is not available.' }
            }
      )
    }
  }
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <McpAppFrame
      ref="frame"
      :resource="resource"
      title="Plan picker from the billing tool"
      @message="onMessage"
    />
    <p
      v-if="requests.length"
      class="text-body-sm text-(--text-muted)"
    >
      Requests from the widget: {{ requests.join(', ') }}
    </p>
  </div>
</template>

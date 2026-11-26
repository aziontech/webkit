<script setup>
  import McpAppFrame from '@aziontech/ui/mcp-app-frame'
  import { ref } from 'vue'

  const widget = `<style>
  :root {
    color-scheme: light dark;
    --ink: CanvasText;
    --muted: color-mix(in srgb, CanvasText 64%, Canvas);
    --line: color-mix(in srgb, CanvasText 16%, Canvas);
    --accent: CanvasText;
    --accent-ink: Canvas;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: auto; font: 14px/1.5 system-ui, -apple-system, sans-serif; color: var(--ink); }
  .card { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .row { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
  .name { font-size: 15px; font-weight: 600; margin: 0; }
  .price { font-size: 14px; font-weight: 600; margin: 0; }
  .price span { font-weight: 400; color: var(--muted); }
  .desc { margin: 0; color: var(--muted); }
  .actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; padding-top: 4px; }
  button {
    appearance: none;
    border: 0;
    border-radius: 6px;
    background: var(--accent);
    color: var(--accent-ink);
    font: inherit;
    font-weight: 500;
    padding: 8px 14px;
    cursor: pointer;
  }
  button:hover { filter: brightness(0.95); }
  button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  .status { margin: 0; font-size: 13px; color: var(--muted); }
  .status:empty { display: none; }
</style>
<div class="card">
  <div class="row">
    <p class="name">Acme Pro</p>
    <p class="price">$49 <span>/ month</span></p>
  </div>
  <p class="desc">Adds 10 workloads, custom certificates, and priority support for your team.</p>
  <div class="actions">
    <button id="choose" type="button">Choose the Pro plan</button>
    <p id="result" class="status" role="status"></p>
  </div>
</div>
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
      params: {
        width: Math.ceil(document.body.scrollWidth),
        height: Math.ceil(document.body.getBoundingClientRect().height)
      }
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

  const onMessage = (message) => {
    if (!('jsonrpc' in message) || message.id === undefined) return
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
  <div class="w-full max-w-(--container-3xl)">
    <McpAppFrame
      ref="frame"
      :resource="resource"
      title="Plan picker from the billing tool"
      @message="onMessage"
    />
  </div>
</template>

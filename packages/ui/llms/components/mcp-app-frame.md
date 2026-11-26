# Mcp App Frame

> The safe frame for an interactive widget a tool returns inside a chat answer: an MCP app (MCP Apps, or the older MCP-UI) such as a plan picker, a booking form or a map that a tool call rendered as HTML. It runs the widget in a sandboxed `iframe` with an opaque origin and a strict content policy, gives it an accessible name, shows a loading state while it starts and a blocked state when the resource cannot be shown safely, grows to the height the widget reports, and forwards every well-formed message the widget sends (call a tool, open a link, send a prompt, the start handshake) to the app as a `message` event. It never acts on a message itself: the app decides, and answers through `post()`. Unlike `embed` (a third-party page an author places on purpose and trusts), the content here is written by a tool at run time and is untrusted by default, so the frame owns the sandbox, the content policy, the message checks and the navigation guard instead of leaving them to the consumer. Threat model. The widget is hostile: it comes from an MCP server the reader may not control, through a model hostile content may have steered. - Page access: the `iframe` has exactly `sandbox="allow-scripts"` (no `allow-same-origin`, `allow-top-navigation`, `allow-popups`, `allow-forms`, `allow-modals` or `allow-downloads`), `referrerpolicy="no-referrer"` and `allow=""`. Its document has an opaque origin: no parent DOM, cookies, storage or session (`window.parent.document` throws), no device permissions, no tab navigation, windows, forms, downloads or dialogs. - Network: inline HTML is prefixed with `<!doctype html>` and a Content Security Policy `meta` (`default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; media-src data:; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'`), so it cannot fetch or load remote content. A resolved URL follows its server's policy. An inline widget also inherits the page's own policy: with a nonce, a hash or `'strict-dynamic'` there, its scripts never run (it stays `ready` and silent), so such an app resolves widgets to an https origin of its own. - URLs: the frame never loads a URL taken from the resource; only an absolute `https:` URL that `resolveUrl` returns. - Messages: accepted only from the current `iframe`'s window with the origin `null`, in one of two shapes, and rebuilt from their known keys; the raw `MessageEvent` (its `source` window and `ports`) never reaches the app. `post()` targets `*`, the only target an opaque origin has, and only that window. - Navigation: the widget can navigate its own frame; the second `load` blocks the frame, but the new page runs until then. The app's own `frame-src`, limited to the origins `resolveUrl` returns, stops it before it leaves. - Residual: WebRTC, DNS prefetch and self-navigation can carry out what the widget holds, so everything sent with `post()` counts as disclosed; a widget can draw look-alike controls inside its bordered box (show its `tool-call` row before it, never ask for credentials in it) and can hold keyboard focus. Height is clamped to 48 px–`maxHeight`. - Out of scope: the MCP Apps sandbox-proxy flow (it needs `allow-same-origin` on a second origin) and what the app does with a message (check tool names and arguments; `tool-approval` for a sensitive tool).

- Import: `import McpAppFrame from '@aziontech/ui/mcp-app-frame'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [mcp-app-frame.json](mcp-app-frame.json)

## When to use

- A tool call returns a UI resource (an MCP app: `text/html;profile=mcp-app`, `text/html`, or a `ui://` resource the app can resolve) and the answer should show it working inside the message.
- Any HTML or remote app produced at run time that the reader should use without it getting access to the page.

## Do

- Write a `title` that says what the widget is (`Plan picker from the billing tool`); it is the frame's accessible name.
- Handle `message` with an allow-list: answer only the methods and types you support, check the tool name and its arguments, and route a sensitive tool through `tool-approval`. Never deep-merge a payload into your own objects: nested values are structured clones and may carry an own `__proto__` key.
- Answer with `post()`; never reach into the frame. An MCP Apps widget waits for the reply to its `ui/initialize` request before it starts; an MCP-UI widget that sends `ui-lifecycle-iframe-ready` or `ui-request-data` waits for its data.
- Treat everything you `post()` as disclosed to the widget's author, and limit how often the handler acts on a widget's messages.
- Show where a widget comes from right before it (its `tool-call` row) and never ask the reader for credentials inside one.
- Resolve `ui://` and `https` resources only from servers you trust, and only to `https:` URLs; return `''` to block one.
- Set the app's own Content Security Policy: `frame-src` limited to the origins `resolveUrl` returns, so a widget cannot navigate its frame elsewhere. An inline widget inherits the app's policy as well as its own: with a nonce, a hash or `'strict-dynamic'` in the page's `script-src` its scripts never run, so such an app resolves widgets to an https origin of its own through `resolveUrl` rather than loosening its policy.

## Don’t

- A third-party page an author places on purpose (a demo, a player, a form) → `embed`.
- A remote multi-page site: the frame blocks a widget that navigates.
- Live Azion UI components shown in the documentation → `browser-frame`.
- A generated file the reader may copy, download or open → `artifact-preview`.
- The record of what the tool did (name, input, output, status) → `tool-call`; the app frame sits after it in the same message.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tool-call](tool-call.md) — the row that records the call the widget belongs to; render the frame right after it.
- [tool-approval](tool-approval.md) — ask the reader before acting on a widget's tool request when the tool changes something.
- [chat-message](chat-message.md) — the message the frame sits in.
- [embed](embed.md) — the author-placed, trusted counterpart.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `resource` | `McpAppFrameResource` | `—` | true | The UI resource the tool returned: its `uri`, `mimeType`, and the HTML as `text` or base64 `blob`. |
| `title` | `string` | `—` | true | Accessible name of the widget, announced before its content. |
| `resolveUrl` | `(resource: McpAppFrameResource) => string \| Promise<string>` | `undefined` | false | Turns a resource that is not inline HTML into an https URL the frame may load; return an empty string to block it. Without it such resources are blocked. |
| `maxHeight` | `number` | `640` | false | Largest height in pixels the widget may grow the frame to; 48 is the floor. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `message` | `(message: McpAppFrameMessage)` | A message the widget sent (a tool call, a prompt, a link, a notification, the start handshake), validated and rebuilt from its known keys. Not a user activation, so it carries no DOM event. Size messages are handled by the frame and not emitted. |

## States

- Visual states: `loading`, `ready`, `error` (blocked). The frame has no `disabled`, `readonly`, `invalid`, `empty` or open/closed state.
- `loading` starts on mount and whenever the resource's content changes (its `uri`, `mimeType`, `text` or `blob`); a new `resolveUrl` function alone does not restart it. While `resolveUrl` is pending no `iframe` exists and a `Skeleton` at the starting height holds the place. A `resolveUrl` result that settles after the resource changed or the component unmounted is discarded. Once the document is known (the `srcdoc` built or the URL resolved), a new `iframe` is created for it (keyed, so listeners and posts never cross two widgets) and stays rendered and in layout, with the `Skeleton` absolutely on top, until that `iframe`'s first `load`. The root carries `data-loading` and `aria-busy="true"`, and a polite `role="status"` says `Loading {title}`.
- Messages are accepted from the moment the `iframe` exists, before its `load`, because a widget sends its handshake while it starts; early size messages apply too.
- `ready` follows the first `load` of the current `iframe`: the `Skeleton` goes.
- `error` (`data-error` on the root) replaces the `iframe` with an `Alert` (`severity="warning"`) naming the app that cannot be shown; the root then drops its own border and fill so the Alert's frame is the only line. Recovery (a retry) belongs to the app, next to the `tool-call` row. It happens when the resource is not inline HTML and there is no `resolveUrl`; when `resolveUrl` returns an empty string or a URL that is not absolute `https:`, throws, or rejects; when a `blob` is not valid base64 UTF-8; and on a second `load` of the same `iframe` (the widget navigated). A resolved URL that fails on the network cannot be detected (an `iframe` fires no `error` event), so its failure shows inside the frame and does not become `error`.
- Inline: a resource is shown inline when its `mimeType` is `text/html` (with any parameters, such as `;profile=mcp-app`) and it carries `text` or a base64 `blob`; every other resource goes through `resolveUrl`.
- Height: the frame starts at `max(48, min(240, maxHeight))` px and follows the widget's size message (MCP-UI `ui-size-change` with `payload.height`, MCP Apps `ui/notifications/size-changed` with `params.height`), a finite number clamped between 48 px and `max(48, maxHeight)` (48 px is the floor even when `maxHeight` is smaller), written to `--mcp-app-frame-view-height`; the widget scrolls inside beyond that. A size message whose height is not a finite number is dropped. Size messages are not emitted. A smaller `maxHeight` clamps the current height again.
- Accepted messages: `source` is the current `iframe`'s window, `origin` is `null`, and the data is a plain object that is either an MCP-UI message (a string `type` of 1 to 128 characters, an optional plain-object `payload`, an optional string `messageId`) or a JSON-RPC 2.0 message (`jsonrpc: '2.0'` with a string `method` or a string or number `id`; optional plain-object or array `params`, any `result`, plain-object `error`). Everything else is dropped silently.

## Accessibility

- Visible focus: the widget draws focus inside its own document; the frame adds no focusable element of its own, and its root shows the ring token (`focus-within:ring-2 focus-within:ring-(--ring-color)`) while focus is inside the widget, so the reader sees they are in third-party content.
- Keyboard map: `Tab` moves into the widget and on through it; the frame intercepts no key.
- ARIA: `title` renders as the `iframe`'s `title`; the root carries `aria-busy="true"` while loading; the loading text is a `role="status"` region that stays rendered and is emptied when loading ends; the blocked state is an `Alert`.
- Contrast: the `iframe` element keeps the page's `color-scheme` (the theme sets `light` or `dark`). A widget that declares no `color-scheme` gets the browser's opaque light canvas with dark default text in the dark theme (the two schemes differ), and is transparent over `var(--bg-surface)` with dark default text in the light theme, so a default-styled widget reads in both. A widget that declares `color-scheme: light dark` is transparent over `var(--bg-surface)` with the browser's matching default text. Loading (`Skeleton`) and blocked (`Alert`) keep their own token contrast; the frame adds only its border.
- Touch target: not applicable; controls belong to the widget.

## Right-to-left

- Layout: the frame is a full-width block; no physical utility.
- Icons: the Alert's icon is not directional.
- Keyboard: none.
- User data: the widget renders its own document and sets its own direction.

## Internationalization

| Key                            | English source                                    | Override prop |
| ------------------------------ | ------------------------------------------------- | ------------- |
| `mcpAppFrame.loading`          | `Loading {title}`                                 | —             |
| `mcpAppFrame.errorTitle`       | `{title} can't be shown`                          | —             |
| `mcpAppFrame.errorDescription` | `The app was blocked or couldn't be loaded here.` | —             |

- Formatting: none. The widget's own text is the widget's.

## Responsive

- Container queries: none; the frame always fills the width of its message, and the `width` of a size message is ignored.
- Narrow: the widget reflows inside the frame's width; the height follows its size messages within 48 px to `maxHeight`.
- Touch: the widget's own targets.
- Reflow: at 320 px and 200 % zoom the frame causes no horizontal scroll; a widget wider than the frame, or taller than `maxHeight`, scrolls inside it.

## Examples

### Default

```vue
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
```

### Resolved URL

```vue
<script setup>
  import McpAppFrame from '@aziontech/ui/mcp-app-frame'

  const widgetUrls = {
    'ui://status/overview': 'https://example.com/'
  }

  const known = {
    uri: 'ui://status/overview',
    mimeType: 'text/html;profile=mcp-app'
  }

  const unknown = {
    uri: 'ui://unknown/report',
    mimeType: 'text/uri-list',
    text: 'https://example.org/report'
  }

  const resolveUrl = (resource) => widgetUrls[resource.uri] ?? ''
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <McpAppFrame
      :resource="known"
      :resolve-url="resolveUrl"
      title="Status overview from the status tool"
    />
    <McpAppFrame
      :resource="unknown"
      :resolve-url="resolveUrl"
      title="Report from an unknown tool"
    />
  </div>
</template>
```

### Loading

```vue
<script setup>
  import McpAppFrame from '@aziontech/ui/mcp-app-frame'

  const resource = {
    uri: 'ui://analytics/traffic-map',
    mimeType: 'text/html;profile=mcp-app'
  }

  const resolveUrl = () => new Promise(() => {})
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <McpAppFrame
      :resource="resource"
      :resolve-url="resolveUrl"
      title="Traffic map from the analytics tool"
    />
  </div>
</template>
```

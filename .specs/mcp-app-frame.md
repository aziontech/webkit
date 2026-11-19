---
name: mcp-app-frame
category: ai
structure: monolithic
status: draft
spec_version: 1
template: 2
checksum: 0000000000000000000000000000000000000000000000000000000000000000
created: 2026-11-19
last_updated: 2026-11-19
---

# McpAppFrame — Component Spec

## Purpose

The safe frame for an interactive widget a tool returns inside a chat answer: an MCP app (MCP Apps, or the older MCP-UI) such as a plan picker, a booking form or a map that a tool call rendered as HTML. It runs the widget in a sandboxed `iframe` with an opaque origin and a strict content policy, gives it an accessible name, shows a loading state while it starts and a blocked state when the resource cannot be shown safely, grows to the height the widget reports, and forwards every well-formed message the widget sends (call a tool, open a link, send a prompt, the start handshake) to the app as a `message` event. It never acts on a message itself: the app decides, and answers through `post()`.

Unlike `embed` (a third-party page an author places on purpose and trusts), the content here is written by a tool at run time and is untrusted by default, so the frame owns the sandbox, the content policy, the message checks and the navigation guard instead of leaving them to the consumer.

Threat model. The widget's HTML comes from an MCP server the reader may not control, through a model that hostile content may have steered, so it is treated as hostile.

- Reaching the page: the `iframe` carries exactly `sandbox="allow-scripts"` (never `allow-same-origin`), `referrerpolicy="no-referrer"`, `allow=""` and no `allowfullscreen`. Inline HTML renders through `srcdoc`, a resolved URL through `src`; either way the document has an opaque origin, so it cannot read or change the parent DOM, cookies, `localStorage` or the app's session (`window.parent.document` throws), and it gets no camera, microphone, geolocation, clipboard or full screen. A resolved URL never learns the conversation's address from the `Referer`, and it has no cookies or storage of its own (reading them throws).
- Leaving the page: no `allow-top-navigation`, `allow-popups`, `allow-forms` or `allow-modals`, so the widget cannot navigate the tab, open windows, submit forms or block the page with `alert()`. Opening a link is a message the app approves.
- Sending data out: inline HTML is prefixed with `<!doctype html>` and a Content Security Policy `meta` (a leading byte order mark is dropped first), so the policy is the first thing the parser meets whatever the widget's markup holds: `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; media-src data:; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'` (the MCP Apps default without `'self'`, which means nothing for an opaque origin). The widget cannot `fetch`, open a WebSocket, or load remote scripts, images, fonts or frames; a policy the widget adds can only narrow it. A resolved URL is governed by the policy its server sends.
- Residual channels: a content policy does not govern WebRTC (`RTCPeerConnection` to a STUN or TURN host), some engines leak DNS prefetches, and a document may navigate its own frame (next point). So anything the app sends through `post()` (tool results, render data) is disclosed to the widget's author; the app's data the widget never received stays out of reach.
- Navigating itself: a sandboxed document may still navigate its own frame (a link with `target="_self"`, `location.href`, a `refresh` meta). The parent sees nothing until the new document's `load`: until then the new page is displayed, is not bound by the injected policy, keeps the same window and the `null` origin, so its messages pass the checks and `post()` reaches it; a page that never finishes loading stays that way. When the second `load` of the same `iframe` arrives, the frame moves to the blocked state, removes the `iframe`, and stops forwarding and posting. The app closes the gap with its own Content Security Policy: `frame-src` limited to the https origins its `resolveUrl` returns (an inline `srcdoc` needs no entry), which blocks the navigation before it leaves.
- Loading arbitrary URLs: the frame never loads `resource.uri` or a URL from the resource on its own. A resource that is not inline HTML is shown only when the app's `resolveUrl` returns an absolute `https:` URL for it; anything else is blocked.
- Spoofed messages: a message is accepted only when its `source` is the current `iframe`'s window and its `origin` is the string `null` (the opaque origin every frame has under this sandbox), and its data is a plain object in one of the two documented shapes. It is rebuilt from the known keys before it is emitted, and the raw `MessageEvent` (its `data`, `source` window and transferred `ports`) never reaches the app. `post()` uses the target origin `*`, the only one that reaches an opaque origin, and only the current `iframe`'s window.
- Resource exhaustion: a reported height is clamped between 48 px and `maxHeight`, so a widget cannot grow the conversation without bound; a reported width is ignored.
- Out of scope: the network of a widget loaded from a resolved URL (its server's policy governs it); the MCP Apps sandbox-proxy flow, which needs `allow-same-origin` on a second origin and so cannot run inside this frame; and what the app does with a message (it must check the tool name and arguments, and ask the reader before a sensitive tool runs, with `tool-approval`).

## When to use

- A tool call returns a UI resource (an MCP app: `text/html;profile=mcp-app`, `text/html`, or a `ui://` resource the app can resolve) and the answer should show it working inside the message.
- Any HTML or remote app produced at run time that the reader should use without it getting access to the page.

## When NOT to use

- A third-party page an author places on purpose (a demo, a player, a form) → `embed`.
- Live WebKit components shown in the documentation → `browser-frame`.
- A generated file the reader may copy, download or open → `artifact-preview`.
- The record of what the tool did (name, input, output, status) → `tool-call`; the app frame sits after it in the same message.

## Related

- `tool-call` — the row that records the call the widget belongs to; render the frame right after it.
- `tool-approval` — ask the reader before acting on a widget's tool request when the tool changes something.
- `chat-message` — the message the frame sits in.
- `embed` — the author-placed, trusted counterpart.

## Best practices

- Write a `title` that says what the widget is (`Plan picker from the billing tool`); it is the frame's accessible name.
- Handle `message` with an allow-list: answer only the methods and types you support, check the tool name and its arguments, and route a sensitive tool through `tool-approval`. Never deep-merge a payload into your own objects.
- Answer with `post()`; never reach into the frame. An MCP Apps widget waits for the reply to its `ui/initialize` request before it starts; an MCP-UI widget that sends `ui-lifecycle-iframe-ready` or `ui-request-data` waits for its data.
- Treat everything you `post()` as disclosed to the widget's author.
- Resolve `ui://` and `https` resources only from servers you trust, and only to `https:` URLs; return `''` to block one.
- Set the app's own Content Security Policy: `frame-src` limited to the origins `resolveUrl` returns, so a widget cannot navigate its frame elsewhere. An inline widget inherits the app's policy as well as its own, so the app's `script-src` must allow inline scripts in that frame (`'unsafe-inline'`), or inline widgets will not run.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import McpAppFrame from '@aziontech/webkit/mcp-app-frame'

  const frame = ref(null)
  const resource = {
    uri: 'ui://billing/plan-picker',
    mimeType: 'text/html;profile=mcp-app',
    text: '<button>Choose the Pro plan</button>'
  }
  const allowedTools = ['select_plan']

  const onMessage = (message) => {
    if (!('jsonrpc' in message) || message.id === undefined) return
    if (message.method === 'ui/initialize') {
      frame.value?.post({
        jsonrpc: '2.0',
        id: message.id,
        result: { protocolVersion: '2026-01-26', hostInfo: { name: 'Acme console', version: '1.0.0' }, hostCapabilities: {}, hostContext: {} }
      })
    } else if (message.method === 'tools/call') {
      const allowed = allowedTools.includes(String(message.params?.name))
      frame.value?.post(
        allowed
          ? { jsonrpc: '2.0', id: message.id, result: { content: [{ type: 'text', text: 'Pro plan selected.' }] } }
          : { jsonrpc: '2.0', id: message.id, error: { code: -32000, message: 'This tool is not available.' } }
      )
    }
  }
</script>

<template>
  <McpAppFrame
    ref="frame"
    :resource="resource"
    title="Plan picker from the billing tool"
    @message="onMessage"
  />
</template>
```

## Props

| Prop         | Type                                                           | Default     | Required | JSDoc                                                                                                                                                     |
| ------------ | -------------------------------------------------------------- | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `resource`   | `McpAppFrameResource`                                          | —           | true     | The UI resource the tool returned: its `uri`, `mimeType`, and the HTML as `text` or base64 `blob`.                                                        |
| `title`      | `string`                                                       | —           | true     | Accessible name of the widget, announced before its content.                                                                                              |
| `resolveUrl` | `(resource: McpAppFrameResource) => string \| Promise<string>` | `undefined` | false    | Turns a resource that is not inline HTML into an https URL the frame may load; return an empty string to block it. Without it such resources are blocked. |
| `maxHeight`  | `number`                                                       | `640`       | false    | Largest height in pixels the widget may grow the frame to.                                                                                                |

Types exported with the component:

- `McpAppFrameResource` — `{ uri: string; mimeType: string; text?: string; blob?: string }`.
- `McpAppFrameMessage` — `McpAppFrameUiMessage | McpAppFrameRpcMessage`.
- `McpAppFrameUiMessage` — an MCP-UI message: `{ type: string; payload?: Record<string, unknown>; messageId?: string }`.
- `McpAppFrameRpcMessage` — an MCP Apps JSON-RPC 2.0 message: `{ jsonrpc: '2.0'; id?: string | number; method?: string; params?: Record<string, unknown> | unknown[]; result?: unknown; error?: Record<string, unknown> }`.

## Events

| Event     | Payload                         | Notes                                                                                                                                                                                                                                                 |
| --------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | `(message: McpAppFrameMessage)` | A message the widget sent (a tool call, a prompt, a link, a notification, the start handshake), validated and rebuilt from its known keys. Not a user activation, so it carries no DOM event. Size messages are handled by the frame and not emitted. |

## Slots

_No slots._

## Exposed

| Method                                    | Notes                                                                                                                                                                                                                                                                                                           |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `post(message: McpAppFrameMessage): void` | Sends a message to the current widget's window with the target origin `*` (the result of a tool it asked for, the reply to its handshake, new render data). Works once the widget has sent an accepted message or loaded; dropped, not queued, before that, while blocked, and after the widget navigated away. |

## States

- Visual states: `loading`, `ready`, `error` (blocked). The frame has no `disabled`, `readonly`, `invalid`, `empty` or open/closed state.
- `loading` starts on mount and whenever the resource's content changes (its `uri`, `mimeType`, `text` or `blob`); a new `resolveUrl` function alone does not restart it. While `resolveUrl` is pending no `iframe` exists and a 240 px `Skeleton` holds the place. Once the document is known (the `srcdoc` built or the URL resolved), a new `iframe` is created for it (keyed, so listeners and posts never cross two widgets) and stays rendered and in layout, with the `Skeleton` absolutely on top, until that `iframe`'s first `load`. The root carries `data-loading` and `aria-busy="true"`, and a polite `role="status"` says `Loading {title}`.
- Messages are accepted from the moment the `iframe` exists, before its `load`, because a widget sends its handshake while it starts; early size messages apply too.
- `ready` follows the first `load` of the current `iframe`: the `Skeleton` goes.
- `error` (`data-error` on the root) replaces the `iframe` with an `Alert` (`severity="warning"`) saying the app cannot be shown. It happens when the resource is not inline HTML and there is no `resolveUrl`; when `resolveUrl` returns an empty string or a URL that is not absolute `https:`, throws, or rejects; when a `blob` is not valid base64 UTF-8; and on a second `load` of the same `iframe` (the widget navigated). A resolved URL that fails on the network cannot be detected (an `iframe` fires no `error` event), so its failure shows inside the frame and does not become `error`.
- Inline: a resource is shown inline when its `mimeType` is `text/html` (with any parameters, such as `;profile=mcp-app`) and it carries `text` or a base64 `blob`; every other resource goes through `resolveUrl`.
- Height: the frame starts at 240 px and follows the widget's size message (MCP-UI `ui-size-change` with `payload.height`, MCP Apps `ui/notifications/size-changed` with `params.height`), a finite number clamped between 48 px and `maxHeight`, written to `--mcp-app-frame-view-height`; the widget scrolls inside beyond that. Size messages are not emitted.
- Accepted messages: `source` is the current `iframe`'s window, `origin` is `null`, and the data is a plain object that is either an MCP-UI message (a string `type` of 1 to 128 characters, an optional plain-object `payload`, an optional string `messageId`) or a JSON-RPC 2.0 message (`jsonrpc: '2.0'` with a string `method` or a string or number `id`; optional plain-object or array `params`, any `result`, plain-object `error`). Everything else is dropped silently.

## Motion & Animations

| Trigger         | Animation / Transition | Token     | Reduced-motion fallback |
| --------------- | ---------------------- | --------- | ----------------------- |
| loading shimmer | `Skeleton`             | component | handled by `Skeleton`   |

## Tokens

| Region  | Token                                                             |
| ------- | ----------------------------------------------------------------- |
| frame   | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| loading | `Skeleton` tokens                                                 |
| blocked | `Alert` tokens (`severity="warning"`)                             |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the widget draws focus inside its own document; the frame adds no focusable element of its own.
- Keyboard map: `Tab` moves into the widget and on through it; the frame intercepts no key.
- ARIA: `title` renders as the `iframe`'s `title`; the root carries `aria-busy="true"` while loading; the loading text is a `role="status"` region; the blocked state is an `Alert`.
- Contrast: the `iframe` element keeps the page's `color-scheme` (the theme sets `light` or `dark`). A widget that declares no `color-scheme` gets the browser's opaque light canvas with dark default text in the dark theme (the two schemes differ), and is transparent over `var(--bg-surface)` with dark default text in the light theme, so a default-styled widget reads in both. A widget that declares `color-scheme: light dark` is transparent over `var(--bg-surface)` with the browser's matching default text. Loading (`Skeleton`) and blocked (`Alert`) keep their own token contrast; the frame adds only its border.
- Touch target: not applicable; controls belong to the widget.

## Internationalization

| Key                            | English source                                                   | Override prop |
| ------------------------------ | ---------------------------------------------------------------- | ------------- |
| `mcpAppFrame.loading`          | `Loading {title}`                                                | —             |
| `mcpAppFrame.errorTitle`       | `This app can't be shown`                                        | —             |
| `mcpAppFrame.errorDescription` | `The tool returned content that this page can't display safely.` | —             |

- Formatting: none. The widget's own text is the widget's.

## Right-to-left

- Layout: the frame is a full-width block; no physical utility.
- Icons: the Alert's icon is not directional.
- Keyboard: none.
- User data: the widget renders its own document and sets its own direction.

## Responsive

- Container queries: none; the frame always fills the width of its message, and the `width` of a size message is ignored.
- Narrow: the widget reflows inside the frame's width; the height follows its size messages within 48 px to `maxHeight`.
- Touch: the widget's own targets.
- Reflow: at 320 px and 200 % zoom the frame causes no horizontal scroll; a widget wider than the frame, or taller than `maxHeight`, scrolls inside it.

## Performance

- Bundle budget: at most 9.5 KB gzip for the `mcp-app-frame` entry, excluding Vue (it composes `Alert` and `Skeleton`); recorded in `.size-limit.json`.
- Runtime budget: one `message` listener on `window` while mounted, removed when the component's scope is disposed; a size message costs one style write.
- Heavy parts: the widget document, loaded lazily (`loading="lazy"`).

## Examples

- Default (`default.vue`) — an inline MCP Apps widget (a plan picker) that starts with `ui/initialize` and asks for a tool call; the example answers the handshake, checks the tool against an allow-list and answers with `post()`.
- Resolved URL (`resolved-url.vue`) — `ui://` resources with no inline HTML: one that `resolveUrl` turns into an `https` URL, and one it blocks (the blocked state). Justified: the second way a resource is shown, and the blocked state the spec defines.
- Loading (`loading.vue`) — a resource whose `resolveUrl` never settles, so the loading state stays.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

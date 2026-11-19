---
name: app-frame
category: ai
structure: monolithic
status: draft
spec_version: 1
template: 2
checksum: 0000000000000000000000000000000000000000000000000000000000000000
created: 2026-11-19
last_updated: 2026-11-19
---

# AppFrame — Component Spec

## Purpose

The safe frame for an interactive widget a tool returns inside a chat answer: an MCP app (MCP Apps and MCP-UI) such as a chart picker, a booking form or a map that the model's tool call rendered as HTML. It runs the widget's HTML in a sandboxed `iframe` with an opaque origin, gives it an accessible name, shows a loading state while the document starts and a blocked state when the resource cannot be shown safely, grows to the height the widget reports, and forwards every well-formed request the widget sends (call a tool, open a link, send a prompt) to the app as a `message` event. It never acts on a request itself: the app decides, and answers through `post()`.

Unlike `embed` (a third-party page placed by an author, trusted by the page that places it), the content here is written by a tool at run time and is untrusted by default, so the frame owns the sandbox, the content policy, the origin checks and the message validation instead of leaving them to the consumer.

Threat model. The widget's HTML comes from an MCP server the reader may not control, through a model that may have been prompted by hostile content, so it is treated as hostile.

- Reaching the page: inline HTML renders through `srcdoc` with `sandbox="allow-scripts"` and never `allow-same-origin`, so the document has an opaque origin. It cannot read or change the parent DOM, cookies, `localStorage` or the app's session; `window.parent.document` throws. A resolved URL gets the same sandbox.
- Leaving the page: no `allow-top-navigation`, `allow-popups`, `allow-forms` or `allow-modals`, so the widget cannot navigate the tab, open windows, submit forms to another site or block the page with `alert()`. Opening a link is a request (`message`) the app approves.
- Sending data out: inline HTML gets a Content Security Policy `meta` placed before its own markup (after a leading doctype), the MCP Apps default: `default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; media-src data:; font-src data:; connect-src 'none'; frame-src 'none'; form-action 'none'; base-uri 'none'; object-src 'none'`. The widget cannot `fetch`, load remote images or frames, or post a form; a policy the widget adds can only narrow it. A resolved URL is governed by the policy its server sends.
- Loading arbitrary URLs: the frame never loads `resource.uri` or a URL from the resource on its own. A resource that is not inline HTML is shown only when the app's `resolveUrl` returns an `https:` URL for it; anything else is blocked.
- Spoofed messages: a `message` is accepted only when its `source` is this frame's own window and its `origin` is the frame's origin (`null` for inline HTML, the resolved URL's origin otherwise). Its shape must be one of the two documented protocols; it is rebuilt from the known keys before it is forwarded, so extra properties never reach the app.
- Resource exhaustion: a reported height is clamped between 48 px and `maxHeight`, so a widget cannot grow the conversation without bound.
- Origin isolation without a proxy: MCP Apps asks a web host for a sandbox proxy on a second origin so the view can keep `allow-same-origin`. The frame reaches the same goal (the view never shares the host's origin) with an opaque origin and no proxy; the cost is that the view has no storage of its own. A host that needs the proxy flow serves the proxy itself and passes its URL through `resolveUrl`.
- Out of scope: the network requests of a widget loaded from a resolved URL (its server's policy governs them), and whatever the app does with a forwarded request (it must check the tool name and arguments, and ask the reader before calling a sensitive tool, with `tool-approval`).

## When to use

- A tool call returns a UI resource (an MCP app widget: `text/html`, `text/html;profile=mcp-app`, or a `ui://` resource the app can resolve) and the answer should show it working inside the message.
- Any HTML or remote app produced at run time that the reader should interact with, without giving it access to the page.

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

- Write a `title` that says what the widget is (`Flight picker from the travel tool`); it is the frame's accessible name.
- Handle `message` with an allow-list: act only on the request types you support, check the tool name and its arguments, and route a sensitive tool through `tool-approval`.
- Answer the widget with `post()` (the result of a tool it asked for, the reply to its handshake); never reach into the frame.
- Resolve `ui://` and `https` resources only from servers you trust, and only to `https:` URLs; return `''` to block one.
- A widget that needs the network declares it to its own server; inline widgets run with no network access.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import AppFrame from '@aziontech/webkit/app-frame'

  const frame = ref(null)
  const resource = {
    uri: 'ui://travel/flight-picker',
    mimeType: 'text/html',
    text: '<button>Pick a flight</button>'
  }

  const onMessage = (event, message) => {
    if ('type' in message && message.type === 'tool') {
      frame.value?.post({ type: 'ui-message-response', messageId: message.messageId, payload: { response: { ok: true } } })
    }
  }
</script>

<template>
  <AppFrame
    ref="frame"
    :resource="resource"
    title="Flight picker from the travel tool"
    @message="onMessage"
  />
</template>
```

## Props

| Prop         | Type                                                       | Default     | Required | JSDoc                                                                                                                                                  |
| ------------ | ---------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `resource`   | `AppFrameResource`                                         | —           | true     | The UI resource the tool returned: its `uri`, `mimeType`, and the HTML as `text` or base64 `blob`.                                                     |
| `title`      | `string`                                                   | —           | true     | Accessible name of the widget, announced before its content.                                                                                           |
| `resolveUrl` | `(resource: AppFrameResource) => string \| Promise<string>` | `undefined` | false    | Turns a resource that is not inline HTML into an https URL the frame may load; return an empty string to block it. Without it such resources are blocked. |
| `maxHeight`  | `number`                                                   | `640`       | false    | Largest height in pixels the widget may grow the frame to.                                                                                             |

Types exported with the component:

- `AppFrameResource` — `{ uri: string; mimeType: string; text?: string; blob?: string }`.
- `AppFrameMessage` — `AppFrameUiMessage | AppFrameRpcMessage`.
- `AppFrameUiMessage` — an MCP-UI message: `{ type: string; payload?: Record<string, unknown>; messageId?: string }`.
- `AppFrameRpcMessage` — an MCP Apps JSON-RPC 2.0 message: `{ jsonrpc: '2.0'; id?: string | number; method?: string; params?: Record<string, unknown> | unknown[]; result?: unknown; error?: Record<string, unknown> }`.

## Events

| Event     | Payload                                          | Notes                                                                                                                                                                                                       |
| --------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `message` | `(event: MessageEvent, message: AppFrameMessage)` | A validated message from the widget (a tool call, a prompt, a link, a notification, the start handshake), rebuilt from its known keys. Size messages are handled by the frame and not emitted. Never acted on by the frame. |

## Slots

_No slots._

## Exposed

| Method          | Notes                                                                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `post(message)` | Sends an `AppFrameMessage` to the widget's window (the result of a tool it asked for, the reply to its handshake, new render data). Does nothing while the frame is loading its URL or blocked. |

## States

- Visual states: `loading` (the document is starting, or `resolveUrl` is pending), `ready`, `error` (the resource is blocked or failed to resolve).
- `data-loading` is set while loading: a `Skeleton` covers the frame and the root carries `aria-busy="true"`; a polite status says `Loading {title}`.
- `data-error` is set when blocked: the frame is replaced by an `Alert` (`severity="warning"`) saying the app cannot be shown, and no `iframe` is rendered.
- A resource is shown inline when its `mimeType` is `text/html` (any parameters, such as `;profile=mcp-app`) and it carries `text` or a base64 `blob`; every other resource goes through `resolveUrl`, whose result must be an absolute `https:` URL. A `blob` that is not valid base64 UTF-8 is blocked.
- Height: the frame starts at 240 px and follows the widget's size message (MCP-UI `ui-size-change` with `payload.height`, MCP Apps `ui/notifications/size-changed` with `params.height`), clamped between 48 px and `maxHeight`; the widget scrolls inside beyond that.
- Accepted messages: `source` is the frame's window, `origin` is the frame's origin, and the data is a plain object that is either an MCP-UI message (string `type` of 1 to 128 characters, optional plain-object `payload`, optional string `messageId`) or a JSON-RPC 2.0 message (`jsonrpc: '2.0'` with a string `method` or a string or number `id`). Everything else is dropped silently.
- A new `resource` (or `resolveUrl`) restarts the frame: loading again, height back to 240 px.

## Motion & Animations

| Trigger         | Animation / Transition | Token     | Reduced-motion fallback |
| --------------- | ---------------------- | --------- | ----------------------- |
| loading shimmer | `Skeleton`             | component | handled by `Skeleton`   |

## Tokens

| Region  | Token                                                             |
| ------- | ----------------------------------------------------------------- |
| frame   | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| blocked | `Alert` tokens (`severity="warning"`)                             |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the widget manages focus inside its document; the frame adds no focusable element of its own.
- Keyboard map: `Tab` moves into the widget and on through it; the frame intercepts no key. A widget that traps focus is the widget's defect; `F6` / the browser chrome still leaves it.
- ARIA: `title` renders as the `iframe`'s `title`; the root carries `aria-busy="true"` while loading; the loading text is a `role="status"` region; the blocked state is an `Alert`.
- Contrast: the frame contributes only its border and the Alert, both from tokens.
- Touch target: not applicable; controls belong to the widget.

## Internationalization

| Key                         | English source                                                  | Override prop |
| --------------------------- | --------------------------------------------------------------- | ------------- |
| `appFrame.loading`          | `Loading {title}`                                               | —             |
| `appFrame.errorTitle`       | `This app can't be shown`                                       | —             |
| `appFrame.errorDescription` | `The tool returned content that this page can't display safely.` | —             |

- Formatting: none. The widget's own text is the widget's.

## Right-to-left

- Layout: the frame is a full-width block; no physical utility.
- Icons: the Alert's icon is not directional.
- Keyboard: none.
- User data: the widget renders its own document and sets its own direction.

## Responsive

- Container queries: none; the frame takes the full width of its message.
- Narrow: the widget reflows inside the frame's width; the height follows its size messages.
- Touch: the widget's own targets.
- Reflow: no horizontal scroll from the frame; a widget wider than the frame scrolls inside it.

## Performance

- Bundle budget: see `.size-limit.json` (`app-frame`).
- Runtime budget: one `message` listener on `window` while mounted, removed on unmount; a size message costs one style write.
- Heavy parts: the widget document, loaded lazily (`loading="lazy"`).

## Examples

- Default — an inline HTML widget (a plan picker) that asks for a tool call; the example answers with `post()` and logs the forwarded messages.
- Resolved URL — a `ui://` resource without inline HTML, resolved by `resolveUrl`; one that resolves to an `https` URL and one the resolver blocks (the blocked state).
- Loading — a resource whose `resolveUrl` never settles, so the loading state stays.

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

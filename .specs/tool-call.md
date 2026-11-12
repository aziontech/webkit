---
name: tool-call
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: dcecb8fe8b26ee16bee815c935632ca80fcd5ff7e10c07c178ccea1102737b8d
created: 2026-11-11
last_updated: 2026-11-11
---

# ToolCall — Component Spec

## Purpose

One tool or command the agent invoked, shown in the conversation (AI Elements Tool, Cloudscape
progressive steps): a row with the tool name in code font, an optional plain description, and a status
(`Waiting`, `Running…`, `Completed`, `Failed`, `Denied`), with the call's input and output in a
collapsible panel. It is the record of what the agent did; authorization before it runs is
`ActionConfirmation`.

## When to use

- An agent calls a tool, an MCP server, an API or a CLI command during a response, and the reader should see what ran and what came back.

## When NOT to use

- Asking the reader to allow a call → `action-confirmation` (then a `tool-call` records it).
- The model's reasoning → `reasoning`.
- A long-running job outside a chat → `progress` / `status-indicator` on the resource.

## Related

- `action-confirmation` — the authorization step before a sensitive call.
- `status-indicator` — the status the row shows.
- `code-block`, `key-value-pairs` — what goes in the input and output slots.

## Best practices

- Name the tool exactly as it is (`list_workloads`) and describe it in plain words (`Listing your workloads`).
- Collapse details by default; open them on error so the reader sees why.
- Redact secrets from inputs and outputs.

## Usage

```vue
<script setup>
  import ToolCall from '@aziontech/webkit/tool-call'
  import CodeBlock from '@aziontech/webkit/code-block'
</script>

<template>
  <ToolCall name="list_workloads" title="Listing your workloads" state="success">
    <template #input>
      <CodeBlock :tabs="[{ label: 'JSON', value: 'in', code: '{ &quot;limit&quot;: 10 }', language: 'json' }]" :show-line-numbers="false" />
    </template>
  </ToolCall>
</template>
```

## Sub-components

_None. Exports: `"./tool-call"`; type `ToolCallState`. Composed DS components: `status-indicator`._

## Props

| Prop          | Type                                                        | Default     | Required | JSDoc                                                                                                       |
| ------------- | ----------------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `name`        | `string`                                                    | —           | true     | The tool or command identifier, shown in code font (`list_workloads`).                                     |
| `title`       | `string`                                                    | `''`        | false    | What the call does in the reader's words (`Listing your workloads`). Empty shows only the name.            |
| `state`       | `'pending' \| 'running' \| 'success' \| 'error' \| 'denied'` | `'running'` | false    | `pending` waits for authorization, `running` is in flight, then `success`, `error` or `denied` (the reader refused it). |
| `open`        | `boolean`                                                   | `undefined` | false    | Controlled open state of the input and output details. Use with `v-model:open`.                            |
| `defaultOpen` | `boolean`                                                   | `false`     | false    | Initial open state when uncontrolled; details start collapsed.                                             |

## Events

| Event         | Payload   | When                               |
| ------------- | --------- | ---------------------------------- |
| `update:open` | `boolean` | Details expanded or collapsed.     |

## Slots

| Slot     | Scope | Notes                                                              |
| -------- | ----- | ------------------------------------------------------------------ |
| `input`  | —     | The parameters the tool is called with (`CodeBlock`, `KeyValuePairs`). |
| `output` | —     | What the tool returned, or the error it failed with.               |

## States

- `data-status` mirrors `state`; `data-state="open|closed"` only when a slot makes it expandable.
- Status mapping: `pending` neutral, `running` info with spinner, `success` success, `error` danger, `denied` warning.
- Without `input` / `output` the row is static (no button).

## Motion & Animations

| Trigger            | Animation / Transition                                           | Token     | Reduced-motion fallback         |
| ------------------ | ---------------------------------------------------------------- | --------- | ------------------------------- |
| chevron open/close | `transition-transform duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |
| running spinner    | `Spinner` inside `StatusIndicator`                               | component | handled by `Spinner`            |

## Tokens

| Region        | Token                                                           |
| ------------- | --------------------------------------------------------------- |
| frame         | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)` |
| title         | `.text-label-sm`, `var(--text-default)`                          |
| name          | `.text-label-code`, `var(--bg-surface-raised)`, `var(--text-muted)` |
| section label | `.text-label-sm`, `var(--text-muted)`                            |
| padding       | `var(--spacing-sm)`, `var(--spacing-xs)`                         |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the trigger.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles the details.
- ARIA: the trigger is a `button` with `aria-expanded` / `aria-controls`; the status is `StatusIndicator` (`role="status"`), so a change from Running to Completed is announced; Input and Output are `section`s labelled by their `h4`.
- Status is conveyed in text, never by color alone.

## Internationalization

| Key                | English source | Override prop |
| ------------------ | -------------- | ------------- |
| `toolCall.pending` | `Waiting`      | —             |
| `toolCall.running` | `Running`      | —             |
| `toolCall.success` | `Completed`    | —             |
| `toolCall.error`   | `Failed`       | —             |
| `toolCall.denied`  | `Denied`       | —             |
| `toolCall.input`   | `Input`        | —             |
| `toolCall.output`  | `Output`       | —             |

- Formatting: none.

## Right-to-left

- Layout: logical utilities (`ms-auto` on the chevron, `text-start`).
- Icons: wrench and chevron-down are not mirrored.
- Keyboard: none.
- User data: the tool name is `dir="ltr"` code.

## Responsive

- Container queries: none.
- Narrow: title and name truncate; the status stays visible.
- Touch: 40 px row.
- Reflow: code in details scrolls inside its block.

## Performance

- Bundle budget: see `.size-limit.json` (`tool-call`).
- Runtime budget: static.
- Heavy parts: none (slot content is the owner's).

## Examples

_Examples in `packages/webkit/examples/tool-call/`: States (every state), With details (input and output, error open)._

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

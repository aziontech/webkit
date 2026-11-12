---
name: streaming-response
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 467844085e6742147bcd70a76958b0c4018634fae28ff789f54316cf368cb02f
created: 2026-11-11
last_updated: 2026-11-11
---

# StreamingResponse — Component Spec

## Purpose

Renders a model's Markdown as it streams in (AI Elements Response / Streamdown), safely. The content
is parsed by a small Markdown parser into a tree and rendered with Vue elements — never `v-html` — so
raw HTML in model output shows as text, `javascript:` and `data:` links are dropped (only `http(s)`,
`mailto`, relative and `#` links survive), and images render as their alt text. It covers what
responses use: paragraphs, headings, bold, italic, inline code, links, lists, block quotes, GFM tables,
rules and fenced code (rendered with `CodeBlock`, copyable). Incomplete Markdown is tolerated while
streaming: an unclosed `**` renders bold to the end, an unclosed code fence stays a plain `<pre>`
until it closes (no highlighting churn), and a half-written link shows its text only.

Numbered citations `[1]` become `Citation` references resolved against `sources`, linked to the
`Sources` list under the response through a shared `anchor`. A blinking caret marks the end while
`streaming`; the region is `aria-busy` until the stream ends.

## When to use

- The content of every assistant `ChatMessage`.
- Any generated text on a page (an explanation, a summary) that arrives token by token.

## When NOT to use

- Authored documentation prose → `doc-prose`.
- Code alone → `code-block`.
- Trusted HTML from your own CMS → render it with your CMS pipeline; this component deliberately renders no HTML.

## Related

- `chat-message` — the host of a response.
- `citation`, `sources` — inline references and the list they point at.
- `code-block` — what fenced code renders as.
- `ai-loading` — the loading text before the first token, or a bar where a table is coming.

## Best practices

- Pass the accumulated text on every chunk; the parser is cheap and the output is keyed by block.
- Keep `streaming` true until the stream closes, then false (removes the caret, highlights an open fence).
- Give the response and its `Sources` the same `anchor` so `[n]` links to item `n`.
- Do not post-process model output into HTML; there is no HTML path.

## Usage

```vue
<script setup>
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import Sources from '@aziontech/webkit/sources'

  const sources = [{ title: 'Real-Time Purge', href: 'https://www.azion.com/en/documentation/' }]
</script>

<template>
  <StreamingResponse
    content="Purge one URL from **Real-Time Purge** [1]."
    :sources="sources"
    anchor="answer-1"
    :streaming="false"
  />
  <Sources :items="sources" anchor="answer-1" />
</template>
```

## Sub-components

_None public. Internals shared by the AI family in `src/components/ai/_lib/`: `parse-markdown.ts`
(`parseMarkdown`, `parseInline`, `safeHref`, `plainText`) and `markdown-inline.vue` (recursive inline
renderer, also used by `ActionConfirmation` for backticks in its title). Exports: `"./streaming-response"`. Composed DS
components: `code-block`, `citation`._

## Props

| Prop        | Type         | Default | Required | JSDoc                                                                                                                                              |
| ----------- | ------------ | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`   | `string`     | `''`    | false    | The model's Markdown so far. Parsed into elements, never injected as HTML: raw tags render as text and only http(s), mailto, relative and hash links survive. |
| `streaming` | `boolean`    | `false` | false    | Tokens are still arriving: shows the caret, marks the region busy and keeps an unclosed code fence as plain text until it closes.                  |
| `sources`   | `AiSource[]` | `[]`    | false    | Sources the `[n]` citations in the content resolve against (title in the tooltip and the accessible name).                                          |
| `anchor`    | `string`     | `''`    | false    | The `anchor` of the `Sources` list under the response; citations link to its items. Empty renders unlinked numbers.                               |

## Events

_No events._

## Slots

_No slots — the content is the `content` string._

## States

- `data-streaming` and `aria-busy="true"` while `streaming`.
- Caret: inside the last paragraph or heading, else after the last block; only while `streaming`.
- Open fence while streaming: `<pre data-testid="…__pending-code">`; closed fence or stream ended: `CodeBlock`.

## Motion & Animations

| Trigger         | Animation / Transition | Token   | Reduced-motion fallback      |
| --------------- | ---------------------- | ------- | ---------------------------- |
| caret           | `animate-blink`        | `blink` | `motion-reduce:animate-none` (a steady block) |

## Tokens

| Region            | Token                                                          |
| ----------------- | -------------------------------------------------------------- |
| body              | `.text-body-md`, `var(--text-default)`                         |
| headings          | `.text-heading-sm` (`#`), `.text-heading-xs`, `.text-heading-xxs`, `.text-label-md` |
| inline code       | `.text-label-code`, `var(--bg-surface-raised)`, `var(--shape-elements)` |
| links             | `var(--text-link)`                                             |
| quote             | `var(--border-strong)`, `var(--text-muted)`                    |
| table             | `var(--border-default)`, `var(--border-muted)`, header `var(--bg-surface-raised)`, `.text-body-sm` |
| block gap         | `var(--spacing-sm)`                                            |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: links and the table scroller carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches links, citations, the copy control of each code block and a wide table's scroller.
- ARIA: `aria-busy` while streaming (screen readers wait); the caret is `aria-hidden`; headings start at `h3` (`#` → `h3`) so a response never outranks the page; tables use `th scope="col"`. Announcing the finished text is the `Conversation`'s job.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Contrast ≥4.5:1 for body, muted quote and link text.

## Internationalization

No built-in strings (the content is the model's; `Citation` and `CodeBlock` carry their own).

- Formatting: none.

## Right-to-left

- Layout: logical utilities (`ps-` list indent, `border-s` quotes, `text-start` cells).
- Icons: none of its own.
- Keyboard: none.
- User data: code blocks and inline code are `dir="ltr"`; prose follows the document.

## Responsive

- Container queries: none.
- Narrow: tables and code scroll horizontally inside their own frame; prose wraps (`break-words`).
- Touch: no hover-only affordance.
- Reflow: no page-level horizontal scroll at 320 px; tables are the exception, inside their scroller.

## Performance

- Bundle budget: see `.size-limit.json` (`streaming-response`; includes `CodeBlock`).
- Runtime budget: re-parse of a 4 000-character response < 1 ms; blocks keyed by position so earlier blocks keep their DOM.
- Heavy parts: `CodeBlock` highlighting runs only for closed fences.

## Examples

_Examples in `packages/webkit/examples/streaming-response/`: Default (rich Markdown), Streaming (simulated tokens), With citations, Unsafe input._

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

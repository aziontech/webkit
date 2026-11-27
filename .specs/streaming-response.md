---
name: streaming-response
category: ai
structure: monolithic
status: implemented
stability: preview
spec_version: 7
template: 2
checksum: 85e16798afebd8623661bb59dcafdbe9809c8de5f1a44816e598f3f2bb4fb006
created: 2026-11-11
last_updated: 2026-11-23
---

# StreamingResponse — Component Spec

## Purpose

Renders a model's Markdown as it streams in (AI Elements Response / Streamdown), safely. The content
is parsed by a small Markdown parser into a tree and rendered with Vue elements — never `v-html` — so
raw HTML in model output shows as text, `javascript:`, `data:` and protocol-relative links are dropped (only `http(s)`,
`mailto`, `tel`, relative and `#` links survive, checked by the shared `safeHref`), and images render as their alt text. It covers what
responses use: paragraphs, headings, bold, italic, inline code, links, lists (nested by indenting an
item's lines under it, to any depth), block quotes, GFM tables, rules and fenced code (rendered with
`CodeBlock`, copyable). Incomplete Markdown is tolerated while
streaming: an unclosed `**` renders bold to the end, an unclosed code fence stays a plain `<pre>`
until it closes (no highlighting churn), and a half-written link shows its text only.

Text renders at the prose reading size (`.text-body-prose-md`, 16 px on 26 px lines, ChatGPT's answer
size) with a full step (`--spacing-md`) between blocks, the plain answer column of a chat. Headings are
bold, one step larger than the text, 24 px below the block above and 8 px above their first line: `#` at `.text-heading-md`, every deeper level at `.text-body-lg`.
Lists indent 32 px from `sm` (24 px on a phone) with no extra gap between items. Inline code is
`.text-label-code-md` (14 px) in medium weight. A
fenced code block is a filled `CodeBlock` card with the language and copy in a sticky header, the
same while the fence is still open. Numbered citations become `Citation` chips resolved
against `sources`: `[1]` one chip with the site's mark and name, and a run of markers (`[1][2]`,
`[1] [2]`, `[1, 2]`) one chip with `+1` whose card pages through both sources. A blinking caret marks the end while
`streaming`; the region is `aria-busy` until the stream ends.

## When to use

- Use StreamingResponse for model Markdown that arrives while it renders; a whole documentation page written in MDX uses DocMarkdown.
- The content of every assistant `ChatMessage`.
- Any generated text on a page (an explanation, a summary) that arrives token by token.

## When NOT to use

- Authored documentation prose → `doc-prose`.
- Code alone → `code-block`.
- Trusted HTML from your own CMS → render it with your CMS pipeline; this component deliberately renders no HTML.

## Related

- `chat-message` — the host of a response.
- `citation`, `sources` — inline references and the panel that lists every source.
- `code-block` — what fenced code renders as.
- `response-loading` — the loading text before the first token, or a bar where a table is coming.

## Best practices

- Pass the accumulated text on every chunk; the parser is cheap and the output is keyed by block.
- Keep `streaming` true until the stream closes, then false (removes the caret, highlights an open fence).
- Pass the response and its `Sources` the same array, so `[n]` is item `n` in both.
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
    :streaming="false"
  />
  <Sources :items="sources" />
</template>
```

## Sub-components

_None public. Internals shared by the AI family in `src/components/ai/lib/`: `parse-markdown.ts`
(`parseMarkdown`, `parseInline`, `safeHref`, `plainText`), `markdown-inline.ts` (recursive inline
renderer, also used by `ToolApproval` and `AgentQuestion`, where a citation marker stays plain `[n]` text),
`markdown-inline-cited.ts` (the same renderer with `Citation` chips, used here) and `markdown-list.ts`
(recursive list renderer: nested lists render inside their item). Exports: `"./streaming-response"`. Composed DS
components: `code-block`, `citation`._

## Props

| Prop        | Type            | Default | Required | JSDoc                                                                                                                                                                              |
| ----------- | --------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `content`   | `string`        | `''`    | false    | The model's Markdown so far. Parsed into elements, never injected as HTML: raw tags render as text and only http(s), mailto, tel, relative and hash links survive.                 |
| `streaming` | `boolean`       | `false` | false    | Tokens are still arriving: shows the caret, marks the region busy and keeps an unclosed code fence as plain text until it closes.                                                  |
| `sources`   | `SourcesItem[]` | `[]`    | false    | Sources the `[n]`, `[n][m]` and `[n, m]` citations in the content resolve against: each becomes a chip with the site's favicon and name that opens a card of the sources it cites. |

## Events

_No events._

## Slots

_No slots — the content is the `content` string._

## States

- `data-streaming` and `aria-busy="true"` while `streaming`.
- `data-slot="streaming-response"` on the root marks the answer text, which `ChatMessage.Actions` Read aloud speaks.
- Caret: inside the last paragraph or heading, else after the last block; only while `streaming`.
- Open fence while streaming: the card `data-testid="…__pending-code"` (language header over a `<pre>`); closed fence or stream ended: `CodeBlock` with `show-label`, `:bordered="false"` and no height cap (`--code-block-max-height: none`).
- Lists: a nested list carries `data-nested` (an unordered one uses circles); `data-ordered` switches to decimals.

## Motion & Animations

| Trigger | Animation / Transition | Token   | Reduced-motion fallback                       |
| ------- | ---------------------- | ------- | --------------------------------------------- |
| caret   | `animate-blink`        | `blink` | `motion-reduce:animate-none` (a steady block) |

## Tokens

| Region      | Token                                                                                              |
| ----------- | -------------------------------------------------------------------------------------------------- |
| body        | `.text-body-prose-md`, `var(--text-default)`                                                       |
| headings    | `.text-heading-md` (`#`), `.text-body-lg` (`##` and deeper), `font-semibold`; `--spacing-xs` added above, taken from the gap below |
| inline code | `.text-label-code-md`, `font-medium`, `var(--bg-surface-raised)`, `var(--shape-control)`           |
| code block  | `var(--bg-surface-raised)`, `var(--shape-card)`, header `.text-label-code-sm` `var(--text-muted)`  |
| links       | `var(--text-link)`                                                                                 |
| quote       | `var(--border-strong)`, `var(--text-muted)`                                                        |
| table       | `var(--border-default)`, `var(--border-muted)`, header `var(--bg-surface-raised)`, `.text-body-sm` |
| block gap   | `var(--spacing-md)`; list items none; list indent `var(--spacing-lg)` + item `var(--spacing-xs)`   |

## Theme gaps

- No flat 20 px heading class (ChatGPT's answer title, 20/28): `.text-heading-md` reaches 24 px from `md`.
- `CodeBlock` has no size prop: its lines stay 12 px (`.text-label-code-sm`) under a 40 px header; ChatGPT's are 14–16 px under 48 px.

## Accessibility (WCAG 2.1 AA)

- Visible focus: links and the table scroller carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches links, citations, the copy control of each code block and a wide table's scroller.
- ARIA: `aria-busy` while streaming (screen readers wait); the caret is `aria-hidden`; headings start at `h3` (`#` → `h3`) so a response never outranks the page; tables use `th scope="col"`. Announcing the finished text is the `Conversation`'s job.
- External links open in a new tab with `rel="noopener noreferrer"`, followed by an `aria-hidden` `az-external-link` glyph and the sr-only `common.newTab` text, so the new tab is seen and heard.
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
- Runtime budget: parsing is incremental. When the new content extends the previous one, only the last two blocks are parsed again; every earlier block keeps its object. Blocks are keyed by position and memoized on their object, so a settled block (a paragraph, a table, a closed code fence) does not re-render on later tokens, and a closed fence is never highlighted again. `streaming-response-2k-lines` and `streaming-response-code-fences` (20 tokens after 1.2k lines of closed fences) in `perf-budgets.json` hold both, well under one frame per token.
- Heavy parts: `CodeBlock` highlighting runs only for closed fences.

## Examples

_Examples in `packages/webkit/examples/streaming-response/`: Default (rich Markdown with a nested list, a code card and a quote), Streaming (simulated tokens), With citations, Unsafe input._

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

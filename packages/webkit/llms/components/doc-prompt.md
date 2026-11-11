# Doc Prompt

> DocPrompt renders text the reader is meant to **run, not read** — the block a documentation page uses when the next step is "say this to your agent". It is the one component in this layer whose payload is addressed to a machine, so it is the one that ships an affordance for handing it to one: a copy control wired to the exact string on screen. It is deliberately **not** a code block — a prompt is a sentence, so it carries no language, no gutter, and no syntax highlighting, and it is set in the mono face only to say "this is the literal text, copy it as it stands".

- Import: `import DocPrompt from '@aziontech/webkit/doc-prompt'`
- Category: documentation · Surface: docs · Structure: monolithic
- API as JSON: [doc-prompt.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-prompt.json)

## When to use

- A documentation step, onboarding screen, or empty state whose next action is "paste this into your agent".
- A short list of example prompts a reader can try, under a heading that has already said what they are.
- Anywhere a literal string must be copied verbatim and the reader is the one who decides where it goes.

## Do

- Write the prompt once, in the default slot. It is both the visible text and the copied string, so the two cannot drift.
- Give `title` only when the surrounding page has not already said what the block is. Three one-line prompts under a "Prompts to try" heading want the bare shape.
- Use `kind="line"` for a single instruction and `kind="block"` for a priming paragraph. A one-sentence prompt broken across three lines reads as three instructions.
- Keep the prompt in the imperative and free of placeholders the reader must fill silently — if a value must be substituted, name it in the prose above.

## Don’t

- The payload is source code, a shell command, or configuration → use a code viewer, which owns languages, gutters, and highlighting; a prompt has none of them.
- The payload is a short inline token (a key, a flag, a variable name) → use `kbd` or inline code in prose.
- The block needs to run the prompt itself, or route it to a named vendor → out of scope; this component only puts the text on the clipboard.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [copy-button](copy-button.md) — the control DocPrompt composes. Reach for it directly when the value being copied has no block of its own.
- DocCallout` — draws attention to prose the reader should _read_; DocPrompt is for text the reader should _use_.
- DocProse` — the contract around it. The prompt marks itself `data-doc-chrome`, so prose rules stop at its edge, and `data-doc-block`, so it takes the block rung of the ladder.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'block' \| 'line'` | `'block'` | false | Wrapping paragraph capped at four lines, or one line that scrolls sideways. |
| `title` | `string` | `''` | false | What the block is, in a word or two. Renders as a titled row above the prompt. |
| `icon` | `string` | `'pi pi-sparkles'` | false | PrimeIcons class for the glyph beside the title. |
| `label` | `string` | `''` | false | Fallback prompt text when the default slot is empty. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The prompt itself: one or more sentences of literal text. Also the string the copy control carries. |

## States

- Visual states: `default`, `focus-visible` (on the `line` shape, which is a scroll container)
- `data-kind` mirrors the `kind` prop: `block` | `line`
- `data-expanded` — present on the prompt text when a capped `block` has been opened by the reader
- `data-capped` — present on the root when a `block` prompt is taller than its four-line cap; absent when it fits, so a prompt that fits earns no disclosure control
- `data-overflow` — on the `line` shape: `start` | `end` | `both`, whichever edge has text scrolled behind it; absent when the line fits
- `data-single-line` — on the prompt row when the prompt occupies exactly one line (`line` always; a `block` whose sentence fits its column). The row then centres the prompt against the copy control instead of top-aligning it — the control is 28px and one line of the prompt face is 19.5px, so a top-aligned pair leaves the sentence 4.25px above the control's middle. Absent the moment the prompt wraps.
- `data-doc-block` + `data-doc-chrome` are the `DocProse` contract (block rung; prose stops here)
- Empty: an empty slot with an empty `label` renders the shell with no prompt text and no copy control

## Accessibility

- Visible focus: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ring-color)` on the `line` shape
- Keyboard map: the `line` shape takes a tab stop because it is a scroll container — a scroll container holding no focusable child is unreachable by keyboard (and an axe `scrollable-region-focusable` violation); arrow keys then scroll it. The `block` shape scrolls nothing, so it takes no tab stop. `Tab` reaches the disclosure control and the copy control; `Enter` / `Space` activate them.
- ARIA: the full prompt text is in the DOM in every state, so the cap hides nothing from a screen reader — the disclosure is a visual convenience and the state it reports is the change in its own label (`Show more` / `Show less`). Every fade gradient is `aria-hidden="true"`; the title glyph is `aria-hidden="true"`. The copy control carries its own accessible name.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons) — the prompt is `--text-default`, not the muted body ink, because the prompt IS the payload and everything around it is chrome
- `motion-reduce:transition-none` on both animated states; the disclosure move is skipped rather than shortened
- Touch target ≥40×40 px on both controls (both are `size="small"` webkit controls, which meet the floor)

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Edge fades: the horizontal fades of a `line` prompt pair each physical gradient with its mirror (`bg-gradient-to-r rtl:bg-gradient-to-l`), so the fade always darkens toward the clipped edge.
- Keyboard: no horizontal arrow-key logic.
- User data: the prompt text is code-like and keeps its own direction.

## Examples

### Default

```vue
<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <DocPrompt title="AI Assistant">
    Deploy this repository to Azion and show me the edge URL when it is live.
  </DocPrompt>
</template>
```

### Kinds

```vue
<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-lg)">
    <DocPrompt
      kind="block"
      title="AI Assistant"
    >
      Deploy this repository to Azion and show me the edge URL when it is live.
    </DocPrompt>
    <DocPrompt
      kind="line"
      title="AI Assistant"
    >
      Deploy this repository to Azion and show me the edge URL when it is live. Then open the
      deployment log, find the cold-start figure, and summarise it for me.
    </DocPrompt>
  </div>
</template>
```

### Capped

```vue
<script setup>
  import DocPrompt from '@aziontech/webkit/doc-prompt'
</script>

<template>
  <DocPrompt title="Priming prompt">
    You are working in an Azion Web Platform project. Read the repository, identify the framework
    and its build output directory, then create the edge application, bind a domain to it, and
    deploy. Before you deploy, tell me which framework you detected and which build command you are
    about to run, and wait for me to confirm. After the deploy succeeds, report the edge URL and the
    propagation time, and leave the build artifacts in place so I can inspect them.
  </DocPrompt>
</template>
```

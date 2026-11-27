# Streaming Response

> Renders a model's Markdown as it streams in (AI Elements Response / Streamdown), safely. The content is parsed by a small Markdown parser into a tree and rendered with Vue elements — never `v-html` — so raw HTML in model output shows as text, `javascript:`, `data:` and protocol-relative links are dropped (only `http(s)`, `mailto`, `tel`, relative and `#` links survive, checked by the shared `safeHref`), and images render as their alt text. It covers what responses use: paragraphs, headings, bold, italic, inline code, links, lists (nested by indenting an item's lines under it, to any depth), block quotes, GFM tables, rules and fenced code (rendered with `CodeBlock`, copyable). Incomplete Markdown is tolerated while streaming: an unclosed `**` renders bold to the end, an unclosed code fence stays a plain `<pre>` until it closes (no highlighting churn), and a half-written link shows its text only. Text renders at the prose reading size (`.text-body-prose-md`, 16 px on 26 px lines, ChatGPT's answer size) with a full step (`--spacing-md`) between blocks, the plain answer column of a chat. Headings are bold, one step larger than the text, 24 px below the block above and 8 px above their first line: `#` at `.text-heading-md`, every deeper level at `.text-body-lg`. Lists indent 32 px from `sm` (24 px on a phone) with no extra gap between items. Inline code is `.text-label-code-md` (14 px) in medium weight. A fenced code block is a filled `CodeBlock` card with the language and copy in a sticky header, the same while the fence is still open. Numbered citations become `Citation` chips resolved against `sources`: `[1]` one chip with the site's mark and name, and a run of markers (`[1][2]`, `[1] [2]`, `[1, 2]`) one chip with `+1` whose card pages through both sources. A blinking caret marks the end while `streaming`; the region is `aria-busy` until the stream ends.

- Import: `import StreamingResponse from '@aziontech/ui/streaming-response'`
- Category: ai · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [streaming-response.json](streaming-response.json)

## When to use

- Use StreamingResponse for model Markdown that arrives while it renders; a whole documentation page written in MDX uses DocMarkdown.
- The content of every assistant `ChatMessage`.
- Any generated text on a page (an explanation, a summary) that arrives token by token.

## Do

- Pass the accumulated text on every chunk; the parser is cheap and the output is keyed by block.
- Keep `streaming` true until the stream closes, then false (removes the caret, highlights an open fence).
- Pass the response and its `Sources` the same array, so `[n]` is item `n` in both.
- Do not post-process model output into HTML; there is no HTML path.

## Don’t

- Authored documentation prose → `doc-prose`.
- Code alone → `code-block`.
- Trusted HTML from your own CMS → render it with your CMS pipeline; this component deliberately renders no HTML.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chat-message](chat-message.md) — the host of a response.
- [citation](citation.md), `sources` — inline references and the panel that lists every source.
- [code-block](code-block.md) — what fenced code renders as.
- [response-loading](response-loading.md) — the loading text before the first token, or a bar where a table is coming.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | `''` | false | The model's Markdown so far. Parsed into elements, never injected as HTML: raw tags render as text and only http(s), mailto, tel, relative and hash links survive. |
| `streaming` | `boolean` | `false` | false | Tokens are still arriving: shows the caret, marks the region busy and keeps an unclosed code fence as plain text until it closes. |
| `sources` | `SourcesItem[]` | `[]` | false | Sources the `[n]`, `[n][m]` and `[n, m]` citations in the content resolve against: each becomes a chip with the site's favicon and name that opens a card of the sources it cites. |

## Sub-components

_None public. Internals shared by the AI family in `src/components/ai/lib/`: `parse-markdown.ts`
(`parseMarkdown`, `parseInline`, `safeHref`, `plainText`), `markdown-inline.ts` (recursive inline
renderer, also used by `ToolApproval` and `AgentQuestion`, where a citation marker stays plain `[n]` text),
`markdown-inline-cited.ts` (the same renderer with `Citation` chips, used here) and `markdown-list.ts`
(recursive list renderer: nested lists render inside their item). Exports: `"./streaming-response"`. Composed DS
components: `code-block`, `citation`._

## States

- `data-streaming` and `aria-busy="true"` while `streaming`.
- `data-slot="streaming-response"` on the root marks the answer text, which `ChatMessage.Actions` Read aloud speaks.
- Caret: inside the last paragraph or heading, else after the last block; only while `streaming`.
- Open fence while streaming: the card `data-testid="…__pending-code"` (language header over a `<pre>`); closed fence or stream ended: `CodeBlock` with `show-label`, `:bordered="false"` and no height cap (`--code-block-max-height: none`).
- Lists: a nested list carries `data-nested` (an unordered one uses circles); `data-ordered` switches to decimals.

## Accessibility

- Visible focus: links and the table scroller carry `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches links, citations, the copy control of each code block and a wide table's scroller.
- ARIA: `aria-busy` while streaming (screen readers wait); the caret is `aria-hidden`; headings start at `h3` (`#` → `h3`) so a response never outranks the page; tables use `th scope="col"`. Announcing the finished text is the `Conversation`'s job.
- External links open in a new tab with `rel="noopener noreferrer"`, followed by an `aria-hidden` `az-external-link` glyph and the sr-only `common.newTab` text, so the new tab is seen and heard.
- Contrast ≥4.5:1 for body, muted quote and link text.

## Right-to-left

- Layout: logical utilities (`ps-` list indent, `border-s` quotes, `text-start` cells).
- Icons: none of its own.
- Keyboard: none.
- User data: code blocks and inline code are `dir="ltr"`; prose follows the document.

## Internationalization

No built-in strings (the content is the model's; `Citation` and `CodeBlock` carry their own).

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: tables and code scroll horizontally inside their own frame; prose wraps (`break-words`).
- Touch: no hover-only affordance.
- Reflow: no page-level horizontal scroll at 320 px; tables are the exception, inside their scroller.

## Examples

### Default

````vue
<script setup>
  import StreamingResponse from '@aziontech/ui/streaming-response'

  const content = [
    '## Purge one URL',
    '',
    'Use **Real-Time Purge** when one object changed at the origin. Purges by `URL` take effect in a few seconds.',
    '',
    '1. Open Real-Time Purge from the products menu.',
    '2. Choose *URL* as the purge type.',
    '   - `URL` removes one object.',
    '   - `Wildcard` removes everything under a path.',
    '3. Paste the address and select Purge.',
    '',
    '| Purge type | When to use it |',
    '| --- | --- |',
    '| URL | One object changed |',
    '| Wildcard | A folder changed |',
    '',
    'The same purge from the CLI:',
    '',
    '```bash',
    'azion purge urls --urls https://www.example.com/styles.css',
    '```',
    '',
    '> A purge does not change the origin. Update the file there first.'
  ].join('\n')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <StreamingResponse :content="content" />
  </div>
</template>
````

### Streaming

````vue
<script setup>
  import Button from '@aziontech/ui/button'
  import StreamingResponse from '@aziontech/ui/streaming-response'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const full = [
    'Your cache hit ratio dropped because **query strings** reach the cache key.',
    '',
    'Ignore the parameters that do not change the response:',
    '',
    '```json',
    '{ "cache_by_query_string": "ignore", "query_string_fields": ["utm_source"] }',
    '```',
    '',
    'Then purge the affected paths so the new key takes effect.'
  ].join('\n')

  const content = ref('')
  const streaming = ref(false)
  let timer

  function play() {
    clearInterval(timer)
    content.value = ''
    streaming.value = true
    let index = 0
    timer = setInterval(() => {
      index = Math.min(full.length, index + 4)
      content.value = full.slice(0, index)
      if (index >= full.length) {
        clearInterval(timer)
        streaming.value = false
      }
    }, 40)
  }

  onMounted(play)
  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col items-start gap-(--spacing-md)">
    <StreamingResponse
      :content="content"
      :streaming="streaming"
    />
    <Button
      label="Replay"
      variant="outline"
      size="small"
      icon="az az-refresh"
      :disabled="streaming"
      @click="play"
    />
  </div>
</template>
````

### WithCitations

```vue
<script setup>
  import Sources from '@aziontech/ui/sources'
  import StreamingResponse from '@aziontech/ui/streaming-response'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/products/cache/real-time-purge/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      icon: 'az az-azion'
    },
    {
      title: 'HTTP Caching (RFC 9111)',
      href: 'https://www.w3.org/Protocols/',
      description: 'How caches store responses and when they must ask the origin again.'
    },
    {
      title: 'Cache settings',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Set the TTL of each path and how query strings build the cache key.',
      site: 'Azion',
      icon: 'az az-azion'
    }
  ]

  const content =
    'A purge reaches every data center in a few seconds [1]. The next request for that object goes to the origin, and the response is cached again with the TTL from your cache settings [2][3].'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <StreamingResponse
      :content="content"
      :sources="sources"
    />
    <Sources :items="sources" />
  </div>
</template>
```
